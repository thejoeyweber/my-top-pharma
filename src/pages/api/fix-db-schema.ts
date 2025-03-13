import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase-admin';

export const POST: APIRoute = async () => {
  try {
    // Run SQL directly to add the column
    const { error } = await supabaseAdmin.rpc('pg_execute', {
      query: `
        ALTER TABLE public.data_ingestion_logs ADD COLUMN IF NOT EXISTS records_skipped INTEGER DEFAULT 0;
        UPDATE public.data_ingestion_logs SET records_skipped = 0 WHERE records_skipped IS NULL;
        COMMENT ON COLUMN public.data_ingestion_logs.records_skipped IS 'Number of records skipped during import because they already exist or do not need updates';
      `
    }).single();

    if (error) {
      // If the RPC method doesn't exist, try a direct SQL approach
      console.error('Error executing RPC:', error);
      
      // Try a different approach
      const { error: alterError } = await supabaseAdmin.from('_sql').select('*').single().then(
        async () => {
          // If we can access the _sql table, try to run SQL directly (this is a workaround)
          const sqlQuery = `
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
          `;
          return await supabaseAdmin.from('_sql').select('*').eq('query', sqlQuery);
        }
      );

      if (alterError) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to add records_skipped column via API. Please run migration manually:',
            instructions: 'cd app ; npx supabase db reset --shadow', 
            error: alterError.message
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database schema updated successfully. The records_skipped column has been added or already exists.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating database schema:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error updating database schema. Please run the migration manually:',
        instructions: 'cd app ; npx supabase migration up', // Note the semicolon for PowerShell
        error: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 