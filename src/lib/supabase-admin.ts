/**
 * Supabase Admin Client
 * 
 * This file creates a Supabase client with admin privileges using the service role key.
 * It supports both local and remote Supabase instances based on feature flags.
 * 
 * SECURITY WARNING: This client bypasses Row Level Security (RLS) policies.
 * Only use for trusted server-side operations, never expose to the client.
 */

import { createClient } from "@supabase/supabase-js";
import { FEATURES, getFeatureFlag } from "../utils/featureFlags";
import type { Database } from "../types/database";

/**
 * Creates a local Supabase admin client with service role permissions
 * 
 * @returns A Supabase client with service role permissions for local development
 */
function createLocalAdminClient() {
  console.log('🔄 Creating local Supabase admin client');
  
  const url = import.meta.env.PUBLIC_LOCAL_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.PUBLIC_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    console.warn('⚠️ Missing local Supabase service role credentials. Check your .env.local file');
    return null;
  }
  
  return createClient<Database>(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * Creates a remote Supabase admin client with service role permissions
 * 
 * @returns A Supabase client with service role permissions for production
 */
function createRemoteAdminClient() {
  console.log('🔄 Creating remote Supabase admin client');
  
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    console.warn('⚠️ Missing remote Supabase service role credentials. Check your .env file');
    return null;
  }
  
  return createClient<Database>(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * Factory function that returns the appropriate Supabase admin client based on the feature flag
 * 
 * @returns The configured Supabase admin client
 */
function createSupabaseAdminClient() {
  const useLocalDatabase = getFeatureFlag(FEATURES.USE_LOCAL_DATABASE);
  
  if (useLocalDatabase) {
    return createLocalAdminClient();
  }
  
  return createRemoteAdminClient();
}

// Create a Supabase client with the service role key that bypasses RLS
export const supabaseAdmin = createSupabaseAdminClient();

/**
 * Tests the Supabase admin connection
 * 
 * @returns Information about the admin connection status
 */
export async function testSupabaseAdminConnection() {
  const startTime = Date.now();
  const useLocalDatabase = getFeatureFlag(FEATURES.USE_LOCAL_DATABASE);
  
  try {
    if (!supabaseAdmin) {
      return {
        success: false,
        connectionType: useLocalDatabase ? 'local' : 'remote',
        error: 'Missing Supabase service role credentials',
        latencyMs: 0
      };
    }
    
    // Basic query to test connection
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('id')
      .limit(1);
    
    const latencyMs = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Supabase admin connection error:`, error.message);
      return {
        success: false,
        connectionType: useLocalDatabase ? 'local' : 'remote',
        error: error.message,
        latencyMs
      };
    }
    
    console.log(`✅ Supabase admin connection successful (${latencyMs}ms)`);
    return {
      success: true,
      connectionType: useLocalDatabase ? 'local' : 'remote',
      latencyMs,
      recordCount: data?.length || 0
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    
    console.error(`❌ Failed to connect to Supabase admin:`, err);
    return {
      success: false,
      connectionType: useLocalDatabase ? 'local' : 'remote',
      error: err instanceof Error ? err.message : String(err),
      latencyMs
    };
  }
} 