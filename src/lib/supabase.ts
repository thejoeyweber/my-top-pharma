/**
 * Supabase Client for Astro
 * 
 * This module provides a simple Supabase client for database access.
 * For more information, see: https://docs.astro.build/en/guides/backend/supabase/
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Check if we should use local or remote Supabase
const useLocalDatabase = import.meta.env.PUBLIC_USE_LOCAL_DATABASE === 'true';

// Determine which set of environment variables to use
const supabaseUrl = useLocalDatabase 
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_URL 
  : import.meta.env.PUBLIC_SUPABASE_URL;

const supabaseAnonKey = useLocalDatabase 
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_ANON_KEY 
  : import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const serviceRoleKey = useLocalDatabase 
  ? import.meta.env.PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY 
  : import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`Missing Supabase environment variables for ${useLocalDatabase ? 'local' : 'remote'} database. Check your .env files.`);
}

// Log which database we're connecting to (helpful for debugging)
console.log(`🔌 Connecting to ${useLocalDatabase ? 'local' : 'remote'} Supabase database at ${supabaseUrl}`);

// Create and export the Supabase client for use throughout the app
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Create a Supabase admin client with service role key for privileged operations
 * Note: Only use server-side, never expose to the client
 */
export const supabaseAdmin = serviceRoleKey 
  ? createClient<Database>(
      supabaseUrl, 
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false }}
    )
  : null;

// Example usage (keep for reference if needed elsewhere, or remove if truly unused)
// async function exampleQuery() {
//   try {
//     const { data, error } = await supabase.from('your_table').select('*')
//     if (error) throw error
//     console.log(data)
//   } catch (error) {
//     console.error('Error fetching data:', error)
//   }
// } 