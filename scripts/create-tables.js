/**
 * Script to create database tables directly using Supabase JS client
 * 
 * This is a workaround for when migrations aren't working correctly
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import { join } from 'path';

// Get proper __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Supabase credentials from .env
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

// Ensure we have credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to create the companies table
const companiesTableSQL = `
-- Create the companies table
CREATE TABLE IF NOT EXISTS companies (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  ticker        text NOT NULL,
  sector        text,
  industry      text,
  market_cap    numeric,
  cik           text,
  isin          text,
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(ticker)
);

-- Create an index on ticker for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker);

-- Create an index on sector and industry for filtering
CREATE INDEX IF NOT EXISTS idx_companies_sector_industry ON companies(sector, industry);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
`;

async function createTables() {
  try {
    console.log('Creating tables in Supabase...');
    
    // Execute the SQL using Supabase's rpc function to run raw SQL
    const { error } = await supabase.rpc('exec_sql', { query: companiesTableSQL });
    
    if (error) {
      console.error('Error creating tables:', error);
      return;
    }
    
    console.log('Tables created successfully!');
    
    // Test if we can query the table
    const { data, error: queryError } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
      
    if (queryError) {
      console.error('Error querying companies table:', queryError);
      return;
    }
    
    console.log('Companies table query successful:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the function
createTables(); 