/**
 * Migration Script: Import Companies from JSON to Local Supabase
 * 
 * This script reads the static JSON company data and imports it into
 * the local Supabase database. It handles transformation from the JSON
 * format to the database schema.
 * 
 * Usage:
 *   npm run migrate:companies
 * 
 * Prerequisites:
 *   - Local Supabase instance must be running
 *   - Valid .env.local file with Supabase credentials
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Create Supabase client using service role key (bypasses RLS)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key

console.log('🔐 Using Supabase URL:', supabaseUrl);
console.log('🔑 Using Supabase key type:', supabaseKey.includes('service_role') ? 'Service Role Key' : 'Anon Key');

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to the static JSON file
const companiesJsonPath = path.join(
  process.cwd(),
  'src',
  'data',
  'json',
  'companies.json'
);

interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
  marketCapBillions?: number;
  annualRevenueBillions?: number;
  tickerSymbol?: string;
  stock_symbol?: string;
  exchange?: string;
  ceo?: string;
  therapeuticAreas?: string[];
  [key: string]: any;
}

/**
 * Main migration function
 */
async function migrateCompanies() {
  console.log('🚀 Starting companies migration...');
  
  try {
    // Read companies from JSON
    console.log('📄 Reading companies from JSON file...');
    const jsonData = fs.readFileSync(companiesJsonPath, 'utf-8');
    const companies = JSON.parse(jsonData) as Company[];
    
    console.log(`📊 Found ${companies.length} companies in JSON file`);
    
    // Use direct query to test connection and table existence
    console.log('🔍 Checking database and table...');
    try {
      const { error } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation "companies" does not exist')) {
          console.error('❌ Companies table does not exist. Please run database migrations first:');
          console.error('npx supabase db reset');
          process.exit(1);
        } else {
          throw error;
        }
      }
      
      console.log('✅ Companies table exists');
    } catch (error: any) {
      console.error('❌ Error accessing database:', error.message);
      console.error('Please ensure your local Supabase instance is running and .env.local is configured correctly');
      process.exit(1);
    }
    
    // Define mapping between JSON and DB schema
    const columnMapping = {
      'name': 'name',
      'description': 'description',
      'logoUrl': 'logo_url',
      'websiteUrl': 'website',
      'headquarters': 'headquarters',
      'foundedYear': 'founded_year',
      'employeeCount': 'employee_count',
      'marketCapBillions': 'market_cap',
      'tickerSymbol': 'stock_symbol',
      'exchange': 'stock_exchange'
    };
    
    // Create a map for string ID to integer ID
    const idMap: Record<string, number> = {
      'pfizer': 1,
      'novartis': 2,
      'astrazeneca': 3,
      // Add more mappings as needed
    };
    
    // Transform and insert companies
    console.log('🔄 Transforming company data to database format...');
    const transformedCompanies = companies.map(company => 
      transformCompanyToDbFormat(company, columnMapping, idMap)
    );
    
    // Try to use direct SQL to bypass RLS if we encounter issues
    let useSqlFallback = false;
    
    // Insert companies one at a time for better error tracking
    let successCount = 0;
    let errorCount = 0;
    let errors: any[] = [];
    
    for (let i = 0; i < transformedCompanies.length; i++) {
      const company = transformedCompanies[i];
      const companyName = companies[i].name;
      
      console.log(`⏳ Inserting company (${i + 1}/${companies.length}): ${companyName}`);
      
      if (!useSqlFallback) {
        // Try using the API first
        try {
          const { data, error } = await supabase
            .from('companies')
            .upsert(company, { onConflict: 'id' });
          
          if (error) {
            if (error.message.includes('row-level security policy') && i === 0) {
              // If it's an RLS issue and it's the first company, switch to SQL approach
              console.warn('⚠️ RLS policy violation detected. Switching to SQL fallback method...');
              useSqlFallback = true;
              i--; // Retry this company with SQL approach
              continue;
            } else {
              console.error(`❌ Error inserting company ${companyName}: ${error.message}`);
              errorCount++;
              errors.push({ company: companyName, error: error.message });
            }
          } else {
            successCount++;
            console.log(`✅ Inserted company: ${companyName}`);
          }
        } catch (err: any) {
          console.error(`❌ Unexpected error for company ${companyName}: ${err.message}`);
          errorCount++;
          errors.push({ company: companyName, error: err.message });
        }
      }
      
      // If we're using SQL fallback or if we just switched to it
      if (useSqlFallback) {
        try {
          // Build SQL query to insert the company
          const columns = Object.keys(company).join(', ');
          const values = Object.values(company).map(val => 
            typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : // Escape quotes in strings
            val === null ? 'NULL' : val
          ).join(', ');
          
          const sql = `
            INSERT INTO companies (${columns})
            VALUES (${values})
            ON CONFLICT (id) DO UPDATE
            SET ${Object.keys(company).map(col => `${col} = EXCLUDED.${col}`).join(', ')}
          `;
          
          const { error } = await supabase.rpc('run_sql', { query: sql });
          
          if (error) {
            // If rpc doesn't work, try direct query with service role
            console.warn(`⚠️ Couldn't use RPC for SQL, error: ${error.message}`);
            console.warn('⚠️ Please add the SQL function to your database or add service role key to .env.local');
            
            errorCount++;
            errors.push({ company: companyName, error: `SQL insertion failed: ${error.message}` });
          } else {
            successCount++;
            console.log(`✅ Inserted company via SQL: ${companyName}`);
          }
        } catch (err: any) {
          console.error(`❌ Unexpected SQL error for company ${companyName}: ${err.message}`);
          errorCount++;
          errors.push({ company: companyName, error: err.message });
        }
      }
    }
    
    console.log(`
    ✅ Migration completed:
    - Total companies: ${companies.length}
    - Successfully migrated: ${successCount}
    - Errors: ${errorCount}
    `);
    
    if (errors.length > 0) {
      console.log('❌ Error details:');
      errors.forEach((err, index) => {
        console.log(`  ${index + 1}. Company: ${err.company}`);
        console.log(`     Error: ${err.error}`);
      });
      
      console.log(`
      If you're experiencing RLS policy issues:
      
      1. Try adding the SUPABASE_SERVICE_ROLE_KEY to your .env.local file
      2. Or run this SQL in the Supabase dashboard to disable RLS for the companies table:
         ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
      3. Or add this function to your database:
         CREATE OR REPLACE FUNCTION run_sql(query text) RETURNS void AS $$
         BEGIN
           EXECUTE query;
         END;
         $$ LANGUAGE plpgsql SECURITY DEFINER;
      `);
    }
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Transform a company from JSON format to database schema format
 */
function transformCompanyToDbFormat(
  company: Company, 
  columnMapping: Record<string, string>,
  idMap: Record<string, number>
) {
  // Create a mapped object with appropriate field names
  const dbCompany: Record<string, any> = {
    // Use numeric ID from the map instead of string ID
    id: idMap[company.id] || null,
    name: company.name,
    slug: createSlug(company.name),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Exit early if we don't have a proper numeric ID
  if (dbCompany.id === null) {
    console.warn(`⚠️ No ID mapping found for company "${company.name}" (ID: ${company.id})`);
  }
  
  // Map other fields using the column mapping
  for (const [jsonField, dbField] of Object.entries(columnMapping)) {
    if (jsonField in company && company[jsonField] !== undefined) {
      // Special case for stock_symbol (use either stock_symbol or tickerSymbol)
      if (dbField === 'stock_symbol' && company.stock_symbol) {
        dbCompany[dbField] = company.stock_symbol;
      } else {
        dbCompany[dbField] = company[jsonField];
      }
    }
  }
  
  return dbCompany;
}

/**
 * Create a URL-friendly slug from a company name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
    .trim();
}

// Execute the migration
migrateCompanies().then(() => {
  console.log('👋 Migration script completed');
  process.exit(0);
}); 