import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { supabaseAdmin } from '../../lib/supabase-admin';
import type { ImportHistoryEntry } from '../../types/admin';

// Define the type for the data ingestion log response with joined tables
interface DataIngestionLogWithJoins {
  id: string;
  data_source_id: string;
  endpoint_id: string | null;
  started_at: string;
  completed_at: string | null;
  status: string;
  records_processed: number | null;
  records_added: number | null;
  records_updated: number | null;
  records_skipped: number | null;
  error_message: string | null;
  data_sources: { name: string }[];  // Joined tables come back as arrays
  data_source_endpoints: { name: string }[];
}

export const GET: APIRoute = async () => {
  try {
    // Get all data ingestion logs with related data source info
    const { data, error } = await supabaseAdmin
      .from('data_ingestion_logs')
      .select(`
        id,
        data_source_id,
        endpoint_id,
        started_at,
        completed_at,
        status,
        records_processed,
        records_added,
        records_updated,
        records_skipped,
        error_message,
        data_sources(name),
        data_source_endpoints(name)
      `)
      .order('started_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching import history:', error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Error fetching import history',
          details: error.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Transform the raw database results into the format expected by the UI
    const importHistory: ImportHistoryEntry[] = (data as unknown as DataIngestionLogWithJoins[]).map(log => {
      // Calculate the API calls made (estimated based on processed records)
      const apiCallsMade = Math.ceil((log.records_processed || 0) / 20); // Assuming batch size of 20
      
      // Extract data source name from the joined table
      const dataSource = log.data_sources && log.data_sources.length > 0 
        ? log.data_sources[0].name 
        : 'Unknown Source';
      
      // Use the records_skipped column directly
      const recordsSkipped = log.records_skipped ?? 0;
      
      return {
        id: log.id,
        dataSource,
        startTime: log.started_at,
        endTime: log.completed_at || undefined,
        status: log.status as any,
        recordsFound: log.records_processed || 0,
        recordsAdded: log.records_added || 0,
        recordsUpdated: log.records_updated || 0,
        recordsSkipped,
        apiCallsMade,
        errorMessage: log.error_message || undefined,
        config: {
          batchSize: 20,
          industries: ['Biotechnology', 'Drug Manufacturers—Specialty & Generic', 'Drug Manufacturers—General'],
          includeInactive: false,
          requestDelay: 500
        },
        importedIndustries: {}
      };
    });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: importHistory
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in import history API route:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : null
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 