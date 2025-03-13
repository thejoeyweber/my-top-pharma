/**
 * Supabase Admin Client
 * 
 * This file creates a Supabase client with admin privileges using the service role key.
 * Use this client only for admin operations like data imports that need to bypass RLS.
 * 
 * SECURITY WARNING: This client bypasses Row Level Security (RLS) policies.
 * Only use for trusted server-side operations, never expose to the client.
 */

import { createClient } from "@supabase/supabase-js";

// URL and service role key for Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key that bypasses RLS
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 