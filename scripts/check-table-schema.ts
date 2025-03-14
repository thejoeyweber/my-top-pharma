/**
 * Utility Script: Check Table Schema
 * 
 * This script connects to the local Supabase database and prints
 * the schema of a specified table.
 * 
 * Usage:
 *   npx tsx scripts/check-table-schema.ts <table_name>
 * 
 * Example:
 *   npx tsx scripts/check-table-schema.ts therapeutic_areas
 */

import { createClient } from '@supabase/supabase-js';

// Create Supabase client using service role key (bypasses RLS)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; // Service role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchema() {
  const tableName = process.argv[2];
  
  if (!tableName) {
    console.error('❌ Please provide a table name as an argument');
    console.error('Example: npx tsx scripts/check-table-schema.ts therapeutic_areas');
    process.exit(1);
  }
  
  console.log(`🔍 Checking schema for table: ${tableName}`);
  
  try {
    // Query the information_schema.columns table to get column information
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .order('ordinal_position');
    
    if (error) {
      console.error('❌ Error querying schema:', error.message);
      
      // Try alternative approach with direct SQL
      console.log('🔄 Trying alternative approach...');
      
      const { data: result, error: sqlError } = await supabase
        .rpc('run_sql', { 
          query: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = '${tableName}'
            ORDER BY ordinal_position;
          `
        });
      
      if (sqlError) {
        console.error('❌ SQL error:', sqlError.message);
        
        // Last resort: try to select from the table and infer schema
        console.log('🔄 Trying to infer schema from table data...');
        
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.error('❌ Could not query table:', tableError.message);
          process.exit(1);
        }
        
        if (tableData && tableData.length > 0) {
          console.log('✅ Inferred schema from table data:');
          const row = tableData[0];
          const columns = Object.keys(row);
          
          columns.forEach(column => {
            const value = row[column];
            const type = typeof value;
            console.log(`- ${column}: ${type} ${value === null ? '(nullable)' : ''}`);
          });
        } else {
          console.log('⚠️ Table exists but has no data to infer schema from');
        }
      } else {
        console.log('✅ Schema information:');
        console.table(result);
      }
    } else {
      console.log('✅ Schema information:');
      console.table(data);
    }
  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

checkTableSchema(); 