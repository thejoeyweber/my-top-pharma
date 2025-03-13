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
import fs from 'fs/promises';

// Get proper __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import FMP modules
// We need to import these directly to avoid ESM/TypeScript issues in Node.js script
import('../src/lib/fmp.js').then(fmpModule => {
  const { createFMPClient } = fmpModule;
  
  import('../src/lib/fmpMapper.js').then(async mapperModule => {
    const { processCompanyProfiles, processScreenerResults } = mapperModule;
    
    // Run the ingestion
    await runIngestion({ createFMPClient, processCompanyProfiles, processScreenerResults });
  }).catch(error => {
    console.error('Error importing FMP mapper:', error);
    process.exit(1);
  });
}).catch(error => {
  console.error('Error importing FMP client:', error);
  process.exit(1);
});

/**
 * Main ingestion function
 */
async function runIngestion({ createFMPClient, processCompanyProfiles, processScreenerResults }) {
  console.log('Starting FMP data ingestion...');
  
  // Validate environment variables
  const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_FMP_API_KEY } = process.env;
  
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Error: Missing Supabase credentials in .env file');
    process.exit(1);
  }
  
  if (!PUBLIC_FMP_API_KEY) {
    console.error('Error: Missing FMP API key in .env file');
    process.exit(1);
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
    
    // Initialize FMP client
    const fmpClient = createFMPClient(PUBLIC_FMP_API_KEY);
    
    // Start time for logging
    const startTime = new Date();
    console.log(`Ingestion started at ${startTime.toISOString()}`);
    
    // Step 1: Fetch pharma companies from screener
    console.log('Fetching pharmaceutical companies from FMP...');
    const screenResults = await fmpClient.getPharmaCompanies();
    console.log(`Found ${screenResults.length} companies from screener`);
    
    // Get all tickers for batch profile lookup
    const tickers = screenResults.map(company => company.symbol);
    
    // Step 2: Fetch detailed profiles for all tickers
    console.log('Fetching detailed company profiles...');
    
    // Process in batches to avoid rate limits (25 tickers per batch)
    const BATCH_SIZE = 25;
    let allProfiles = [];
    
    for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
      const batchTickers = tickers.slice(i, i + BATCH_SIZE);
      console.log(`Fetching profiles for batch ${i / BATCH_SIZE + 1} (${batchTickers.length} companies)...`);
      
      try {
        const batchProfiles = await fmpClient.getCompanyProfiles(batchTickers);
        allProfiles.push(...batchProfiles);
        
        if (i + BATCH_SIZE < tickers.length) {
          // Add a delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error fetching batch ${i / BATCH_SIZE + 1}:`, error);
        // Continue with the next batch
      }
    }
    
    console.log(`Got detailed profiles for ${allProfiles.length} companies`);
    
    // Step 3: Transform FMP data to our schema
    console.log('Transforming company data to database schema...');
    const companies = processCompanyProfiles(allProfiles);
    
    // For any companies that we couldn't get detailed profiles for, use screener data
    const missingTickers = new Set(tickers);
    allProfiles.forEach(profile => missingTickers.delete(profile.symbol));
    
    if (missingTickers.size > 0) {
      console.log(`Adding ${missingTickers.size} companies from screener data (missing profiles)`);
      
      const missingCompanies = screenResults
        .filter(result => missingTickers.has(result.symbol))
        .map(result => processScreenerResults([result])[0]);
        
      companies.push(...missingCompanies);
    }
    
    console.log(`Transformed ${companies.length} companies for database insertion`);
    
    // Step 4: Save data to JSON file as backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../data/backups');
    
    try {
      await fs.mkdir(backupDir, { recursive: true });
      await fs.writeFile(
        path.join(backupDir, `fmp-companies-${timestamp}.json`),
        JSON.stringify(companies, null, 2)
      );
      console.log('Backup saved to data/backups directory');
    } catch (error) {
      console.warn('Warning: Could not save backup file:', error.message);
    }
    
    // Step 5: Insert into database with upsert (conflict resolution on slug)
    console.log('Upserting companies into database...');
    
    // Process in smaller batches for database insertion
    const DB_BATCH_SIZE = 50;
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    for (let i = 0; i < companies.length; i += DB_BATCH_SIZE) {
      const batch = companies.slice(i, i + DB_BATCH_SIZE);
      console.log(`Upserting batch ${i / DB_BATCH_SIZE + 1} (${batch.length} companies)...`);
      
      try {
        const { data, error, count } = await supabase
          .from('companies')
          .upsert(batch, { 
            onConflict: 'slug',
            returning: 'minimal'
          });
        
        if (error) {
          console.error(`Error inserting batch ${i / DB_BATCH_SIZE + 1}:`, error);
          errors++;
        } else {
          // Count updated/inserted based on returned data
          inserted += count || 0;
        }
      } catch (error) {
        console.error(`Error upserting batch ${i / DB_BATCH_SIZE + 1}:`, error);
        errors++;
      }
    }
    
    // Get final count of companies in the database
    const { data: finalCount } = await supabase
      .from('companies')
      .select('id', { count: 'exact', head: true });
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\nIngestion completed successfully!');
    console.log(`Time taken: ${duration.toFixed(2)} seconds`);
    console.log(`Companies processed: ${companies.length}`);
    console.log(`Database operations: ${inserted} successful, ${errors} errors`);
    console.log(`Total companies in database: ${finalCount}`);
    
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
} 