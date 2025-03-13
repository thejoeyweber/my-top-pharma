import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompanyInsert() {
  console.log('🧪 Testing company insert with minimal fields...');
  
  try {
    // Create a test company with minimal fields
    const testCompany = {
      name: 'Test Company',
      slug: 'test-company-' + Date.now()
    };
    
    console.log(`Attempting to insert company with name="${testCompany.name}" and slug="${testCompany.slug}"...`);
    
    const { data, error } = await supabase
      .from('companies')
      .insert([testCompany])
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('✅ Insert successful!');
      console.log('Inserted data:', data);
      
      // Clean up
      console.log('Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('slug', testCompany.slug);
      
      if (deleteError) {
        console.error('❌ Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCompanyInsert()
  .catch(error => {
    console.error('Script execution failed:', error);
  })
  .finally(() => {
    console.log('Test completed.');
  }); 