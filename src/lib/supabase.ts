/**
 * Supabase Client for Astro
 * 
 * This module provides a Supabase client that can switch between local and remote
 * instances based on cookie or environment variable preferences.
 * 
 * For more information, see: https://docs.astro.build/en/guides/backend/supabase/
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Check for cookie-based preference if in browser environment
let cookiePreference: string | null = null;

if (typeof document !== 'undefined') {
  // Get preference from cookie in browser
  const cookieMatch = document.cookie
    .split('; ')
    .find(row => row.startsWith('use_local_database='));
    
  if (cookieMatch) {
    cookiePreference = cookieMatch.split('=')[1];
  }
}

// Determine which database to use:
// 1. Cookie preference (if in browser)
// 2. Environment variable (fallback)
const useLocalDatabase = 
  cookiePreference !== null 
    ? cookiePreference === 'true'
    : import.meta.env.PUBLIC_USE_LOCAL_DATABASE === 'true';

// Get the appropriate Supabase credentials based on environment
const supabaseUrl = useLocalDatabase 
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_URL 
  : import.meta.env.PUBLIC_SUPABASE_URL;

const supabaseAnonKey = useLocalDatabase
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_ANON_KEY
  : import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabaseServiceRoleKey = useLocalDatabase
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY
  : import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Log which environment we're using (only in development)
if (import.meta.env.DEV) {
  console.log(`🔌 Using ${useLocalDatabase ? 'LOCAL' : 'REMOTE'} Supabase instance: ${supabaseUrl}`);
  if (cookiePreference !== null) {
    console.log(`📝 Using cookie preference: ${cookiePreference}`);
  }
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Create and export the Supabase client for use throughout the app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Create a Supabase admin client with service role key for privileged operations
 * Note: Only use server-side, never expose to the client
 */
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Type-safe helper for querying database tables
 * 
 * @example
 * const { data, error } = await db('companies').select('*');
 */
export const db = <T extends keyof Database['public']['Tables']>(table: T) => {
  return supabase.from(table);
};

/**
 * Helper function to log database errors
 */
export const logDatabaseError = (error: unknown, context: string) => {
  console.error(`Database error in ${context}:`, error);
  return error;
}; 