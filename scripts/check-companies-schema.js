import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompaniesTable() {
  console.log('🔍 Checking companies table schema...');
  
  try {
    // First try to get the table definition
    console.log('Attempting introspection query...');
    const { data: columns, error: introspectionError } = await supabase
      .rpc('get_table_columns', { table_name: 'companies' });
    
    if (introspectionError) {
      console.log('Introspection query failed:', introspectionError.message);
      console.log('Falling back to SELECT query...');
      
      // If introspection fails, try to select a row to see the fields
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Error querying companies table:', error.message);
        console.error('Error details:', error);
        
        // As a last resort, try an insert with minimal fields to see what errors
        console.log('Attempting test insert...');
        const testCompany = {
          name: 'Test Company',
          ticker: 'TEST' + Date.now()
        };
        
        const { error: insertError } = await supabase
          .from('companies')
          .insert([testCompany]);
        
        if (insertError) {
          console.error('❌ Insert error:', insertError.message);
          console.error('Error details:', insertError);
        } else {
          console.log('✅ Insert successful with minimal fields');
          // Clean up
          await supabase
            .from('companies')
            .delete()
            .eq('ticker', testCompany.ticker);
        }
      } else {
        if (data && data.length > 0) {
          console.log('✅ Table structure (from data):', Object.keys(data[0]));
        } else {
          console.log('⚠️ No data found in companies table');
        }
      }
    } else {
      console.log('✅ Companies table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }
    
    // Try to describe the constraints
    const { data: constraints, error: constraintsError } = await supabase
      .rpc('get_table_constraints', { table_name: 'companies' });
    
    if (!constraintsError && constraints) {
      console.log('✅ Table constraints:');
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.constraint_name}: ${constraint.constraint_type}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkCompaniesTable()
  .catch(error => {
    console.error('Script execution failed:', error);
  })
  .finally(() => {
    console.log('Schema check completed.');
  }); 