/**
 * Utility Script: Check Table Data
 * 
 * This script connects to the local Supabase database and prints
 * the data in a specified table.
 * 
 * Usage:
 *   npx tsx scripts/check-table-data.ts <table_name> [limit]
 * 
 * Example:
 *   npx tsx scripts/check-table-data.ts therapeutic_areas 5
 */

import { createClient } from '@supabase/supabase-js';

// Create Supabase client using service role key (bypasses RLS)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableData() {
  const tableName = process.argv[2];
  const limit = parseInt(process.argv[3] || '10', 10);
  
  if (!tableName) {
    console.error('❌ Please provide a table name as an argument');
    console.error('Example: npx tsx scripts/check-table-data.ts therapeutic_areas 5');
    process.exit(1);
  }
  
  console.log(`🔍 Checking data for table: ${tableName} (limit: ${limit})`);
  
  try {
    // Query the table to get data
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error querying data:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ Found ${count} total records in ${tableName}`);
    
    if (data && data.length > 0) {
      console.log(`📊 Showing ${data.length} records:`);
      console.table(data);
    } else {
      console.log('⚠️ No data found in table');
    }
  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

checkTableData(); 