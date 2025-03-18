import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../../lib/supabase';

/**
 * Test Supabase Database Connection API
 * 
 * This endpoint tests the connection to the Supabase database and
 * returns diagnostic information about the connection.
 * It also tests the admin client with service role key for operations
 * that bypass Row Level Security (RLS).
 */
export const GET: APIRoute = async () => {
  try {
    console.log('Testing Supabase connection...');

    // Get Supabase credentials
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Log credential availability (not values for security)
    const credentialStatus = {
      url: {
        provided: !!supabaseUrl,
        sample: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : null
      },
      key: {
        provided: !!supabaseKey,
        length: supabaseKey?.length || 0
      },
      serviceRole: {
        provided: !!serviceRoleKey,
        length: serviceRoleKey?.length || 0
      }
    };
    
    console.log('Credential status:', credentialStatus);
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing Supabase credentials',
          credentials: credentialStatus,
          message: 'Please check your .env.local file for PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection - checking companies table exists
    console.log('Testing companies table with regular client...');
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('count');
    
    let companiesStatus = {
      success: !companiesError,
      error: companiesError ? {
        message: companiesError.message,
        code: companiesError.code,
        details: companiesError.details,
        hint: companiesError.hint
      } : null,
      count: companiesData?.[0]?.count || 0
    };
    
    if (companiesError) {
      console.error('Companies table test failed with regular client:', companiesError);
    } else {
      console.log('Companies table test successful with regular client:', companiesData);
    }
    
    // Test system schema for database health
    console.log('Testing database system schema...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public')
      .limit(10);
    
    let schemaStatus = {
      success: !tablesError,
      error: tablesError ? {
        message: tablesError.message,
        code: tablesError.code,
        details: tablesError.details,
        hint: tablesError.hint || 'This is expected to fail with anonymous key due to RLS restrictions'
      } : null,
      tables: tablesData || []
    };
    
    // Define the type for admin error
    type AdminErrorType = {
      message: string;
      code?: string;
      details?: string;
      hint?: string;
      stack?: string;
    } | null;
    
    // Test admin client with service role key
    let adminStatus: {
      success: boolean;
      tested: boolean;
      error: AdminErrorType;
      count?: number;
    } = { 
      success: false, 
      tested: false, 
      error: null 
    };
    
    if (serviceRoleKey) {
      console.log('Testing companies table with admin client...');
      try {
        if (!supabaseAdmin) {
          throw new Error('Supabase admin client not initialized');
        }
        
        const { data: adminData, error: adminError } = await supabaseAdmin
          .from('companies')
          .select('count');
        
        adminStatus = {
          success: !adminError,
          tested: true,
          error: adminError ? {
            message: adminError.message,
            code: adminError.code,
            details: adminError.details,
            hint: adminError.hint
          } : null,
          count: adminData?.[0]?.count || 0
        };
        
        if (adminError) {
          console.error('Companies table test failed with admin client:', adminError);
        } else {
          console.log('Companies table test successful with admin client:', adminData);
        }
      } catch (adminErr) {
        console.error('Admin client test failed with exception:', adminErr);
        adminStatus.error = {
          message: adminErr instanceof Error ? adminErr.message : String(adminErr),
          stack: adminErr instanceof Error ? adminErr.stack : undefined
        };
      }
    } else {
      console.warn('Skipping admin client test - service role key not provided');
    }
    
    // Generate a timestamp for the test
    const timestamp = new Date().toISOString();
    
    // Success is if either regular client or admin client succeeded
    const overallSuccess = (!companiesError || (adminStatus.tested && adminStatus.success));
    
    // Return the test results
    return new Response(
      JSON.stringify({
        success: overallSuccess,
        timestamp,
        credentials: credentialStatus,
        companies: companiesStatus,
        schema: schemaStatus,
        admin: adminStatus,
        message: overallSuccess
          ? 'Database connection successful'
          : 'Database connection failed with both regular and admin clients'
      }),
      { 
        status: overallSuccess ? 200 : 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Database connection test failed with exception:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        message: 'Database connection test failed with an exception'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 