import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';
import { supabaseAdmin } from '../../lib/supabase-admin';
import { FEATURES, setFeatureFlag } from '../../utils/featureFlags';

// Define FMP company profile interface since there's a mismatch with our generated types
interface FMPCompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number | string;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string | null;
  cusip: string | null;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string | number;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

const API_KEY = import.meta.env.PUBLIC_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Transform FMP company data to match our database schema
function transformCompany(profile: FMPCompanyProfile) {
  // Generate slug from company name
  const slug = profile.companyName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
  
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

// Fetch company data from FMP API
async function fetchCompanies(): Promise<FMPCompanyProfile[]> {
  try {
    // Define industry sectors to query
    const industries = [
      'Biotechnology',
      'Drug Manufacturers—General',
      'Drug Manufacturers—Specialty & Generic'
    ];
    
    // Use Set for deduplication based on symbol
    const companySymbols = new Set<string>();
    const allCompanies: any[] = [];
    
    // Fetch companies from each industry
    for (const industry of industries) {
      console.log(`Fetching ${industry} companies...`);
      const url = `${BASE_URL}/stock-screener?sector=Healthcare&industry=${encodeURIComponent(industry)}&isActivelyTrading=true&apikey=${API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`Error fetching ${industry} companies: ${response.status} ${response.statusText}`);
        continue; // Skip to next industry rather than failing completely
      }
      
      const companies = await response.json();
      
      if (!companies || !Array.isArray(companies)) {
        console.warn(`Invalid response for ${industry}`);
        continue;
      }
      
      console.log(`Found ${companies.length} ${industry} companies`);
      
      // Add unique companies to our collection
      for (const company of companies) {
        if (!companySymbols.has(company.symbol)) {
          companySymbols.add(company.symbol);
          allCompanies.push(company);
        }
      }
      
      // Add delay between industry requests to respect rate limits
      if (industry !== industries[industries.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`Found ${allCompanies.length} unique companies across all industries`);
    
    // If we have companies, fetch detailed profiles
    // Limit to 50 per batch to avoid rate limits but capture more companies
    const BATCH_SIZE = 10;
    const profiles: FMPCompanyProfile[] = [];
    const MAX_COMPANIES = 50;
    
    for (let i = 0; i < Math.min(allCompanies.length, MAX_COMPANIES); i += BATCH_SIZE) {
      const batch = allCompanies.slice(i, i + BATCH_SIZE);
      const symbols = batch.map((c: any) => c.symbol).join(',');
      
      console.log(`Fetching profiles for batch ${i / BATCH_SIZE + 1} (${symbols})...`);
      const profileUrl = `${BASE_URL}/profile/${symbols}?apikey=${API_KEY}`;
      
      const profileResponse = await fetch(profileUrl);
      
      if (!profileResponse.ok) {
        console.error(`Error fetching profiles for batch ${i / BATCH_SIZE + 1}: ${profileResponse.status} ${profileResponse.statusText}`);
        continue;
      }
      
      const batchProfiles = await profileResponse.json();
      
      if (batchProfiles && Array.isArray(batchProfiles)) {
        profiles.push(...batchProfiles);
      }
      
      // Add a delay to respect rate limits
      if (i + BATCH_SIZE < Math.min(allCompanies.length, MAX_COMPANIES)) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`Fetched ${profiles.length} company profiles`);
    
    return profiles;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get Supabase credentials with enhanced logging
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Connection attempt with credentials:', {
      urlProvided: !!supabaseUrl,
      keyProvided: !!supabaseKey,
      serviceRoleProvided: !!serviceRoleKey,
      urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'missing', // log partial URL for security
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Supabase credentials',
          details: 'Check .env.local file for PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY',
          missingValues: {
            PUBLIC_SUPABASE_URL: !supabaseUrl,
            PUBLIC_SUPABASE_ANON_KEY: !supabaseKey
          }
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing Supabase service role key',
          details: 'Check .env.local file for SUPABASE_SERVICE_ROLE_KEY. This is required for admin operations that bypass RLS.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing FMP API key',
          details: 'Check .env.local file for PUBLIC_FMP_API_KEY'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase client with enhanced logging
    console.log('Initializing Supabase client...');
    // We'll use the regular client for testing the connection
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    
    // Test connection to Supabase before proceeding
    try {
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase.from('companies').select('count');
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        return new Response(
          JSON.stringify({
            error: 'Failed to connect to Supabase',
            details: testError.message,
            code: testError.code,
            hint: testError.hint || 'Check your Supabase credentials and table permissions',
            supabaseError: testError
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Supabase connection test successful');
    } catch (connectionError) {
      console.error('Supabase connection attempt error:', connectionError);
      return new Response(
        JSON.stringify({
          error: 'Failed to connect to Supabase',
          message: connectionError instanceof Error ? connectionError.message : String(connectionError),
          stack: connectionError instanceof Error ? connectionError.stack : undefined
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch companies from FMP
    console.log('Starting FMP company import...');
    let profiles: FMPCompanyProfile[] = [];
    
    try {
      profiles = await fetchCompanies();
    } catch (fetchError) {
      console.error('Error fetching from FMP API:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch companies from FMP API',
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
          recommendation: 'Check your API key and network connection'
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No companies found from FMP API',
          details: 'The API returned an empty result. This could be due to rate limiting or filtering criteria.'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Transforming ${profiles.length} company profiles...`);
    
    // Transform FMP data to match our database schema
    const companies = profiles.map(transformCompany);
    
    console.log(`Upserting ${companies.length} companies to database...`);
    
    // Insert into Supabase with upsert using the admin client to bypass RLS
    const { error, count } = await supabaseAdmin
      .from('companies')
      .upsert(companies, { 
        onConflict: 'slug',
        count: 'exact'
      });
    
    if (error) {
      console.error('Error inserting companies:', error);
      
      // Provide more detailed error information
      let errorDetails = 'Unknown database error';
      let suggestedFix = '';
      
      if (error.code === '23502') {
        errorDetails = 'Not-null constraint violation. Check if required fields are missing.';
        suggestedFix = 'Ensure all required fields in the companies table have values in your transformCompany function.';
      } else if (error.code === '23505') {
        errorDetails = 'Unique constraint violation. Duplicate record detected.';
        suggestedFix = 'Check the onConflict parameter in your upsert operation.';
      } else if (error.code === '42P01') {
        errorDetails = 'Table does not exist. Check your database schema.';
        suggestedFix = 'Create the companies table in your Supabase project.';
      } else if (error.code?.startsWith('42')) {
        errorDetails = 'Syntax error in SQL. Table or column might not exist as expected.';
        suggestedFix = 'Verify table structure in Supabase matches your code expectations.';
      } else if (error.code === '28000' || error.code === '28P01') {
        errorDetails = 'Invalid authorization. Check your Supabase credentials.';
        suggestedFix = 'Verify your PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY values.';
      } else if (error.code === '3D000') {
        errorDetails = 'Database does not exist.';
        suggestedFix = 'Check your Supabase project setup.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to insert companies: ${error.message}`,
          errorCode: error.code,
          errorDetails,
          suggestedFix,
          fullError: error
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If we successfully imported companies and there are more than a few,
    // automatically set the feature flag to use database companies
    let featureFlagUpdated = false;
    if (count && count > 5) {
      try {
        setFeatureFlag(FEATURES.USE_DATABASE_COMPANIES, true);
        console.log('Automatically enabled USE_DATABASE_COMPANIES feature flag');
        featureFlagUpdated = true;
      } catch (flagError) {
        console.warn('Failed to set feature flag:', flagError);
        // Continue anyway, this is just a convenience
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        imported: count || companies.length,
        source: 'fmp',
        featureFlagUpdated,
        companies: {
          biotech: profiles.filter(p => p.industry === 'Biotechnology').length,
          pharmaGeneral: profiles.filter(p => p.industry === 'Drug Manufacturers—General').length,
          pharmaSpecialty: profiles.filter(p => p.industry === 'Drug Manufacturers—Specialty & Generic').length,
          total: profiles.length
        },
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Import failed with unexpected error:', error);
    
    // Safe error message extraction
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown Error Type';
    
    return new Response(
      JSON.stringify({ 
        error: `Import failed: ${errorMessage}`,
        errorType: errorName,
        details: errorStack,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 