/**
 * Script to add 'records_skipped' column to the data_ingestion_logs table
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });
dotenv.config({ path: './.env' });

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function addRecordsSkippedColumn() {
  try {
    console.log('Running SQL to add records_skipped column...');
    
    // Check if the column exists
    const { data: columnInfo, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'data_ingestion_logs')
      .eq('column_name', 'records_skipped');

    if (checkError) {
      console.error('Error checking column existence:', checkError.message);
      // Continue anyway, we'll try to add it
    }

    // If column already exists
    if (columnInfo && columnInfo.length > 0) {
      console.log('records_skipped column already exists!');
      return;
    }
    
    // Execute raw SQL using stored procedure or rpc
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE public.data_ingestion_logs 
        ADD COLUMN IF NOT EXISTS records_skipped INTEGER DEFAULT 0;
        
        UPDATE public.data_ingestion_logs 
        SET records_skipped = 0 
        WHERE records_skipped IS NULL;
      `
    });

    if (error) {
      // If the exec_sql RPC doesn't exist, try another approach
      console.error('Error executing RPC:', error.message);
      console.log('Trying alternative approach...');
      
      // Try direct SQL execution - this may or may not work depending on your Supabase setup
      const { error: directError } = await supabase.auth.admin.executeRaw(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'data_ingestion_logs' AND column_name = 'records_skipped'
          ) THEN
            ALTER TABLE public.data_ingestion_logs ADD COLUMN records_skipped INTEGER DEFAULT 0;
            UPDATE public.data_ingestion_logs SET records_skipped = 0 WHERE records_skipped IS NULL;
          END IF;
        END
        $$;
      `);

      if (directError) {
        console.error('Error with direct SQL execution:', directError.message);
        console.log('=====================================================');
        console.log('MANUAL INSTRUCTIONS:');
        console.log('1. Go to Supabase dashboard for your project');
        console.log('2. Open the SQL Editor');
        console.log('3. Execute the following SQL:');
        console.log(`
          ALTER TABLE public.data_ingestion_logs 
          ADD COLUMN IF NOT EXISTS records_skipped INTEGER DEFAULT 0;
          
          UPDATE public.data_ingestion_logs 
          SET records_skipped = 0 
          WHERE records_skipped IS NULL;
        `);
        process.exit(1);
      }
    }

    console.log('Successfully added records_skipped column to data_ingestion_logs table!');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the function
addRecordsSkippedColumn().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 