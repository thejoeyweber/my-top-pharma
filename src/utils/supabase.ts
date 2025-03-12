/**
 * Supabase Client Utility
 * 
 * This file exports a configured Supabase client for use throughout the application.
 * It uses environment variables for configuration, ensuring security of credentials.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are valid (not just placeholders)
const isValidUrl = (url: string) => {
  try {
    // Test if this is a valid URL (has protocol, etc.)
    new URL(url);
    // Also verify it's not just the placeholder value
    return !url.includes('your-supabase-project-url');
  } catch (error) {
    return false;
  }
};

// Create a mock client for use when credentials aren't properly set
const mockSupabaseClient = {
  from: () => ({
    select: () => ({ data: null, error: { message: 'Invalid Supabase credentials' } }),
  }),
  // Add other commonly used methods as needed
};

// Create the real client only if we have valid credentials
let supabase: any;
try {
  if (isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('your-supabase-anon-key')) {
    supabase = createClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );
  } else {
    console.warn('Using mock Supabase client: Please set valid Supabase credentials in .env file');
    supabase = mockSupabaseClient;
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabase = mockSupabaseClient;
}

/**
 * Function to test the Supabase connection
 * Useful for verifying credentials during setup or troubleshooting
 */
export async function testSupabaseConnection() {
  try {
    // Check if we're using the mock client
    if (supabase === mockSupabaseClient) {
      return {
        success: false,
        error: 'Invalid Supabase credentials. Please update your .env file with real credentials.',
        usingMock: true
      };
    }
    
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return {
        success: false,
        error: error.message,
        usingMock: false
      };
    }
    
    console.log('Supabase connection successful');
    return {
      success: true,
      usingMock: false
    };
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      usingMock: false
    };
  }
}

export { supabase }; 