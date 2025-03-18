/**
 * FMP Company Data Ingestion Script
 * 
 * This script fetches pharmaceutical and biotech companies from FMP API,
 * transforms them to match our database schema, and stores them in Supabase.
 * 
 * Usage:
 * node scripts/ingest-companies.js
 */

import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global state for the ingestion process
const state = {
  startTime: null,
  supabase: null,
  fmpClient: null,
  companies: [],
  statistics: {
    processed: 0,
    inserted: 0,
    updated: 0,
    errors: 0,
    skipped: 0
  }
};

// Main execution function
async function main() {
  try {
    const { createFMPClient } = await import('../src/lib/fmpClient.js');
    const { processCompanyProfiles, processScreenerResults } = await import('../src/lib/fmpMapper.js');
    
    state.startTime = new Date();
    console.log(`Ingestion started at ${state.startTime.toISOString()}`);
    
    // Initialize clients
    await initializeClients(createFMPClient);
    
    // Fetch and transform data
    await fetchPharmaCompanies();
    await fetchCompanyProfiles(processCompanyProfiles, processScreenerResults);
    
    // Save backup and insert to database
    await saveBackupData();
    await upsertCompaniesToDatabase();
    
    // Log results
    await logIngestionResults();
    
    console.log('\nIngestion completed successfully!');
  } catch (error) {
    console.error('Ingestion failed:', error);
    
    // Try to log the error to the database
    if (state.supabase) {
      try {
        await state.supabase
          .from('data_ingestion_logs')
          .insert({
            data_source_id: 1, // Assuming FMP is ID 1
            started_at: state.startTime?.toISOString(),
            completed_at: new Date().toISOString(),
            status: 'failed',
            error_message: error.message
          });
      } catch (logError) {
        console.error('Could not log ingestion error to database:', logError);
      }
    }
    
    process.exit(1);
  }
}

/**
 * Initialize Supabase and FMP clients
 */
async function initializeClients(createFMPClient) {
  console.log('Initializing clients...');
  
  // Validate environment variables
  const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, FMP_API_KEY } = process.env;
  
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials in .env file');
  }
  
  if (!FMP_API_KEY) {
    throw new Error('Missing FMP API key in .env file');
  }
  
  // Initialize Supabase client
  state.supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  
  // Initialize FMP client
  state.fmpClient = createFMPClient(FMP_API_KEY);
  
  // Verify connections
  try {
    // Verify Supabase connection
    const { error } = await state.supabase.from('companies').select('id', { count: 'exact', head: true });
    if (error) throw new Error(`Supabase connection error: ${error.message}`);
    
    // FMP client will be verified in the first API call
  } catch (error) {
    throw new Error(`Failed to initialize clients: ${error.message}`);
  }
  
  console.log('Clients initialized successfully');
}

/**
 * Fetch pharmaceutical companies from FMP screener
 */
async function fetchPharmaCompanies() {
  console.log('Fetching pharmaceutical companies from FMP...');
  
  try {
    const screenResults = await state.fmpClient.getPharmaCompanies();
    state.screenResults = screenResults;
    console.log(`Found ${screenResults.companies.length} companies from screener`);
    return screenResults;
  } catch (error) {
    throw new Error(`Failed to fetch companies from screener: ${error.message}`);
  }
}

/**
 * Fetch detailed company profiles with rate limiting
 */
async function fetchCompanyProfiles(processCompanyProfiles, processScreenerResults) {
  console.log('Fetching and processing company profiles...');
  
  const { companies } = state.screenResults;
  const tickers = companies.map(company => company.symbol);
  
  // Process in batches to avoid rate limits (25 tickers per batch)
  const BATCH_SIZE = 25;
  const DELAY_BETWEEN_BATCHES = 1500; // 1.5 seconds
  let allProfiles = [];
  
  for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
    const batchTickers = tickers.slice(i, i + BATCH_SIZE);
    console.log(`Fetching profiles for batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(tickers.length / BATCH_SIZE)} (${batchTickers.length} companies)...`);
    
    try {
      const batchProfiles = await state.fmpClient.getCompanyProfiles(batchTickers);
      allProfiles.push(...batchProfiles);
      
      // Log progress
      console.log(`Progress: ${allProfiles.length}/${tickers.length} profiles fetched`);
      
      if (i + BATCH_SIZE < tickers.length) {
        // Add a delay between batches to avoid rate limiting
        console.log(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    } catch (error) {
      console.error(`Error fetching batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      // Continue with the next batch rather than failing completely
    }
  }
  
  console.log(`Got detailed profiles for ${allProfiles.length} of ${tickers.length} companies`);
  
  // Transform the data
  console.log('Transforming company data to database schema...');
  let transformedCompanies = processCompanyProfiles(allProfiles);
  
  // For any companies that we couldn't get detailed profiles for, use screener data
  const missingTickers = new Set(tickers);
  allProfiles.forEach(profile => missingTickers.delete(profile.symbol));
  
  if (missingTickers.size > 0) {
    console.log(`Adding ${missingTickers.size} companies from screener data (missing profiles)`);
    
    const missingCompanies = companies
      .filter(result => missingTickers.has(result.symbol))
      .map(result => processScreenerResults([result])[0]);
      
    transformedCompanies.push(...missingCompanies);
  }
  
  console.log(`Transformed ${transformedCompanies.length} companies for database insertion`);
  state.companies = transformedCompanies;
  state.statistics.processed = transformedCompanies.length;
}

/**
 * Save data to JSON file as backup
 */
async function saveBackupData() {
  console.log('Saving backup data...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../data/backups');
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `fmp-companies-${timestamp}.json`);
    
    await fs.writeFile(
      backupPath,
      JSON.stringify(state.companies, null, 2)
    );
    console.log(`Backup saved to ${backupPath}`);
  } catch (error) {
    console.warn('Warning: Could not save backup file:', error.message);
    // Continue with the process even if backup fails
  }
}

/**
 * Insert/update companies in the database
 */
async function upsertCompaniesToDatabase() {
  console.log('Upserting companies into database...');
  
  const { companies } = state;
  
  // Process in smaller batches for database insertion
  const DB_BATCH_SIZE = 50;
  
  for (let i = 0; i < companies.length; i += DB_BATCH_SIZE) {
    const batch = companies.slice(i, i + DB_BATCH_SIZE);
    console.log(`Upserting batch ${Math.floor(i / DB_BATCH_SIZE) + 1}/${Math.ceil(companies.length / DB_BATCH_SIZE)} (${batch.length} companies)...`);
    
    try {
      const { data, error, count } = await state.supabase
        .from('companies')
        .upsert(batch, { 
          onConflict: 'slug',
          returning: 'minimal'
        });
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / DB_BATCH_SIZE) + 1}:`, error);
        state.statistics.errors++;
        state.statistics.skipped += batch.length;
      } else {
        // Count inserted records
        state.statistics.inserted += count || batch.length;
      }
    } catch (error) {
      console.error(`Error upserting batch ${Math.floor(i / DB_BATCH_SIZE) + 1}:`, error);
      state.statistics.errors++;
      state.statistics.skipped += batch.length;
    }
  }
  
  // Get final count of companies in the database
  try {
    const { data: finalCount, error } = await state.supabase
      .from('companies')
      .select('id', { count: 'exact', head: true });
    
    if (!error) {
      state.statistics.totalInDatabase = finalCount;
    }
  } catch (error) {
    console.warn('Could not get final count from database:', error.message);
  }
}

/**
 * Log ingestion results to the console and database
 */
async function logIngestionResults() {
  const endTime = new Date();
  const duration = (endTime - state.startTime) / 1000;
  const { processed, inserted, updated, errors, skipped, totalInDatabase } = state.statistics;
  
  console.log('\nIngestion summary:');
  console.log(`- Time taken: ${duration.toFixed(2)} seconds`);
  console.log(`- Companies processed: ${processed}`);
  console.log(`- Database operations: ${inserted} inserted, ${updated} updated, ${errors} errors, ${skipped} skipped`);
  
  if (totalInDatabase !== undefined) {
    console.log(`- Total companies in database: ${totalInDatabase}`);
  }
  
  // Log to data_ingestion_logs table
  try {
    const { error: logError } = await state.supabase
      .from('data_ingestion_logs')
      .insert({
        data_source_id: 1, // Assuming FMP is ID 1
        started_at: state.startTime.toISOString(),
        completed_at: endTime.toISOString(),
        status: errors > 0 ? 'completed_with_errors' : 'completed',
        records_processed: processed,
        records_added: inserted,
        records_updated: updated,
        records_skipped: skipped,
        error_message: errors > 0 ? `${errors} batches had errors` : null
      });
      
    if (logError) {
      console.error('Error logging ingestion:', logError);
    }
  } catch (logError) {
    console.error('Error logging ingestion:', logError);
  }
}

// Execute the main function
main(); 