import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';
import { supabaseAdmin } from '../../lib/supabase';
import { FEATURES, setFeatureFlag } from '../../utils/featureFlags';
import type { FMPCompanyProfile, ScreenOptions } from '../../lib/fmp';
import { createFMPClient } from '../../lib/fmpEnhanced';
import type { ImportConfig } from '../../types/admin';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = import.meta.env.PUBLIC_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/stable';

// Transform FMP company data to match our database schema
function transformCompany(profile: FMPCompanyProfile) {
  // Generate base slug from company name
  const baseSlug = profile.companyName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
  
  // Add stock symbol to make slug unique
  const slug = `${baseSlug}-${profile.symbol.toLowerCase()}`;
  
  // Parse numeric values
  let marketCap = null;
  if (profile.mktCap) {
    // Convert to billions and round to 2 decimal places
    const mcapValue = typeof profile.mktCap === 'string' 
      ? parseFloat(profile.mktCap) 
      : profile.mktCap;
    
    if (!isNaN(mcapValue)) {
      marketCap = Math.round((mcapValue / 1_000_000_000) * 100) / 100;
    }
  }
  
  // Parse employee count
  let employeeCount = null;
  if (profile.fullTimeEmployees) {
    const empCount = typeof profile.fullTimeEmployees === 'string'
      ? parseInt(profile.fullTimeEmployees.replace(/,/g, ''), 10)
      : profile.fullTimeEmployees;
    
    if (!isNaN(empCount)) {
      employeeCount = empCount;
    }
  }
  
  // Format headquarters if available
  let headquarters = null;
  if (profile.country) {
    headquarters = profile.city && profile.state
      ? `${profile.city}, ${profile.state}, ${profile.country}`
      : profile.city
        ? `${profile.city}, ${profile.country}`
        : profile.country;
  }
  
  // Extract year from IPO date if available
  let foundedYear = null;
  if (profile.ipoDate) {
    try {
      foundedYear = new Date(profile.ipoDate).getFullYear();
      if (foundedYear < 1800 || foundedYear > new Date().getFullYear()) {
        foundedYear = null; // Invalid year
      }
    } catch (e) {
      console.warn(`Invalid IPO date for ${profile.symbol}: ${profile.ipoDate}`);
    }
  }
  
  // Return transformed company data with just the fields that exist in the database
  return {
    name: profile.companyName,
    slug: slug,
    description: profile.description || null,
    website: profile.website || null,
    logo_url: profile.image || null,
    headquarters: headquarters,
    employee_count: employeeCount, 
    revenue_usd: null, // Not available in FMP basic data
    public_company: true,
    stock_symbol: profile.symbol || null,
    stock_exchange: profile.exchange || null,
    founded_year: foundedYear
  };
}

// Process the import from FMP
async function processImport(config: ImportConfig) {
  try {
    // Create FMP client with configuration
    const fmpClient = createFMPClient(API_KEY, {
      baseUrl: BASE_URL,
      requestDelay: config.requestDelay,
      defaultBatchSize: config.batchSize
    });
    
    // Setup screening options from config
    const screenOptions: ScreenOptions = {
      batchSize: config.batchSize,
      maxCompanies: config.maxCompanies,
      includeIndustries: config.industries as any[],
      requestDelay: config.requestDelay
    };
    
    // Add a notice about free tier limitations
    console.log(`
===============================
  FREE TIER RECOMMENDATIONS
===============================
For successful imports with the free tier:
1. Use a small batch size (1-5 companies)
2. Use a longer request delay (2000-5000ms)
3. Consider limiting max companies (e.g., 50-100) for initial tests
4. Expect slower imports due to rate limiting precautions
===============================
`);
    
    // Fetch companies with our enhanced client
    console.log(`Starting company import with config:`, config);
    const result = await fmpClient.getPharmaCompanies(screenOptions);
    console.log(`Found ${result.totalFound} companies across industries`);
    console.log(`Industry breakdown:`, result.industries);
    
    // Initialize tracking variables
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let retryCount = 0;
    
    // Get list of all symbols from the screening
    const allSymbols = result.companies.map(c => c.symbol);
    
    // Check which companies we already have in our database
    const supabase = supabaseAdmin;
    const { data: existingCompanies, error: existingError } = await supabase
      .from('companies')
      .select('stock_symbol, updated_at')
      .in('stock_symbol', allSymbols);
    
    if (existingError) {
      console.error('Error fetching existing companies:', existingError);
      throw existingError;
    }
    
    // Create a map of existing companies by symbol with their last update time
    const existingSymbolsMap = new Map();
    existingCompanies?.forEach(company => {
      existingSymbolsMap.set(company.stock_symbol, new Date(company.updated_at));
    });
    
    // Calculate the cutoff date for updates (default to 7 days)
    const updateIntervalDays = config.updateIntervalDays || 7;
    const updateCutoffDate = new Date();
    updateCutoffDate.setDate(updateCutoffDate.getDate() - updateIntervalDays);
    
    console.log(`Using update interval of ${updateIntervalDays} days (cutoff: ${updateCutoffDate.toISOString().split('T')[0]})`);
    
    // Determine which companies are new or need updating
    const symbolsToFetch = allSymbols.filter(symbol => {
      // If it's a new company, we need to fetch it
      if (!existingSymbolsMap.has(symbol)) {
        return true;
      }
      
      // For existing companies, only update if it's been more than the configured interval
      const lastUpdated = existingSymbolsMap.get(symbol);
      return lastUpdated < updateCutoffDate;
    });
    
    // Calculate how many companies were skipped because they were recently updated
    skippedCount = allSymbols.length - symbolsToFetch.length;
    
    // If there are no symbols to fetch, we can skip the API calls
    if (symbolsToFetch.length === 0) {
      console.log('No new or updated companies to fetch. Skipping API calls.');
      return {
        totalFound: result.totalFound,
        processed: 0,
        added: 0,
        updated: 0,
        errors: 0,
        apiCalls: fmpClient.getRequestCount(),
        industries: result.industries,
        skipped: result.totalFound
      };
    }
    
    console.log(`Need to fetch detailed profiles for ${symbolsToFetch.length} companies (${skippedCount} skipped due to recent updates)`);
    
    // Process companies in batches to get detailed profiles
    const batchSize = config.batchSize;
    const profiles: FMPCompanyProfile[] = [];
    
    for (let i = 0; i < symbolsToFetch.length; i += batchSize) {
      const batch = symbolsToFetch.slice(i, i + batchSize);
      const symbols = batch.join(',');
      
      console.log(`Fetching profiles for batch ${Math.floor(i / batchSize) + 1} (${symbols})...`);
      
      // Add retry logic for API calls
      let retries = 0;
      const maxRetries = 3;
      let success = false;
      
      while (retries < maxRetries && !success) {
        try {
          // If this is a retry, add an additional delay
          if (retries > 0) {
            // Use exponential backoff - each retry waits exponentially longer
            const retryDelay = config.requestDelay * Math.pow(2, retries);
            console.log(`Retry #${retries} for batch ${Math.floor(i / batchSize) + 1} after ${retryDelay}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryCount++;
          }
          
          // Use the individual profile endpoint (free tier) instead of bulk
          const profileUrl = `${BASE_URL}/profile/${symbols}?apikey=${API_KEY}`;
          const profileResponse = await fetch(profileUrl);
          
          if (!profileResponse.ok) {
            // If we get a 403, it's likely rate limiting
            if (profileResponse.status === 403) {
              if (retries < maxRetries - 1) {
                retries++;
                console.warn(`Rate limit (403) encountered for batch ${Math.floor(i / batchSize) + 1}. Retrying...`);
                continue;
              } else {
                console.error(`Maximum retries reached for batch ${Math.floor(i / batchSize) + 1} after 403 error.`);
                errorCount++;
                break;
              }
            } else {
              console.error(`Error fetching profiles for batch ${Math.floor(i / batchSize) + 1}: ${profileResponse.status} ${profileResponse.statusText}`);
              errorCount++;
              break;
            }
          }
          
          const batchProfiles = await profileResponse.json();
          
          if (batchProfiles && Array.isArray(batchProfiles)) {
            profiles.push(...batchProfiles);
            success = true;
          } else {
            console.error(`Invalid response format for batch ${Math.floor(i / batchSize) + 1}`);
            errorCount++;
            break;
          }
        } catch (error) {
          console.error(`Error processing batch ${Math.floor(i / batchSize) + 1}:`, error);
          
          if (retries < maxRetries - 1) {
            retries++;
            continue;
          } else {
            errorCount++;
            break;
          }
        }
      }
      
      // Add a delay between batches to respect rate limits
      if (i + batchSize < symbolsToFetch.length) {
        await new Promise(resolve => setTimeout(resolve, config.requestDelay));
      }
    }
    
    console.log(`Fetched ${profiles.length} company profiles (with ${retryCount} retries)`);
    
    // Transform profiles to match our database schema
    const transformedCompanies = profiles.map(transformCompany);
    
    // Create a set of symbols we were able to fetch profiles for
    const fetchedSymbols = new Set(profiles.map(p => p.symbol));
    
    // Separate companies for insert vs update based on what we actually fetched
    const companiesToInsert = transformedCompanies.filter(c => 
      c.stock_symbol && fetchedSymbols.has(c.stock_symbol) && !existingSymbolsMap.has(c.stock_symbol)
    );
    
    const companiesToUpdate = transformedCompanies.filter(c => 
      c.stock_symbol && fetchedSymbols.has(c.stock_symbol) && existingSymbolsMap.has(c.stock_symbol)
    );
    
    console.log(`Found ${companiesToInsert.length} new companies to insert`);
    console.log(`Found ${companiesToUpdate.length} existing companies to update`);
    
    // Insert new companies
    if (companiesToInsert.length > 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from('companies')
        .insert(companiesToInsert)
        .select('id');
      
      if (insertError) {
        console.error('Error inserting companies:', insertError);
        errorCount += companiesToInsert.length;
      } else {
        addedCount = insertedData?.length || 0;
        console.log(`