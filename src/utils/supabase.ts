/**
 * Supabase Client Utility
 * 
 * This file exports a configured Supabase client for use throughout the application.
 * It supports toggling between local and remote Supabase instances using feature flags.
 * 
 * The factory pattern used here isolates the toggle logic, making it easier to remove
 * once the migration to database-driven content is complete.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { FEATURES, getFeatureFlag } from './featureFlags';

/**
 * Validates a Supabase URL
 * 
 * @param url URL to validate
 * @returns Boolean indicating if the URL is valid
 */
const isValidUrl = (url: string): boolean => {
  try {
    // Test if this is a valid URL (has protocol, etc.)
    new URL(url);
    // Also verify it's not just the placeholder value
    return !url.includes('your-supabase-project-url');
  } catch (error) {
    return false;
  }
};

/**
 * Create a mock client for use when credentials aren't properly set
 * Provides stub methods that return predefined error responses
 */
const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Invalid Supabase credentials' } }),
      insert: () => ({ data: null, error: { message: 'Invalid Supabase credentials' } }),
      update: () => ({ data: null, error: { message: 'Invalid Supabase credentials' } }),
      delete: () => ({ data: null, error: { message: 'Invalid Supabase credentials' } }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Invalid Supabase credentials' } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid Supabase credentials' } }),
      signOut: () => Promise.resolve({ error: { message: 'Invalid Supabase credentials' } }),
    },
  };
};

// Mock client for use when credentials aren't properly set
const mockSupabaseClient = createMockClient();

/**
 * Creates a local Supabase client
 * 
 * @returns The configured local Supabase client
 */
function createLocalClient() {
  console.log('🔄 Creating local Supabase client');
  
  const url = import.meta.env.PUBLIC_LOCAL_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_LOCAL_SUPABASE_ANON_KEY;

  if (!isValidUrl(url) || !key || key.includes('YOUR_LOCAL_ANON_KEY')) {
    console.warn('⚠️ Invalid local Supabase credentials. Check your .env.local file');
    return mockSupabaseClient;
  }

  try {
    return createClient<Database>(url, key);
  } catch (error) {
    console.error('❌ Failed to initialize local Supabase client:', error);
    return mockSupabaseClient;
  }
}

/**
 * Creates a remote Supabase client
 * 
 * @returns The configured remote Supabase client
 */
function createRemoteClient() {
  console.log('🔄 Creating remote Supabase client');
  
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidUrl(url) || !key || key.includes('YOUR_SUPABASE_ANON_KEY')) {
    console.warn('⚠️ Invalid remote Supabase credentials. Check your .env file');
    return mockSupabaseClient;
  }

  try {
    return createClient<Database>(url, key);
  } catch (error) {
    console.error('❌ Failed to initialize remote Supabase client:', error);
    return mockSupabaseClient;
  }
}

/**
 * Factory function that returns the appropriate Supabase client based on the feature flag
 * 
 * @returns The configured Supabase client
 */
function createSupabaseClient() {
  const useLocalDatabase = getFeatureFlag(FEATURES.USE_LOCAL_DATABASE);
  
  if (useLocalDatabase) {
    return createLocalClient();
  }
  
  return createRemoteClient();
}

// Create and export the Supabase client
export const supabase = createSupabaseClient();

/**
 * Types of database connections
 */
export enum DatabaseConnectionType {
  LOCAL = 'local',
  REMOTE = 'remote',
  MOCK = 'mock',
}

/**
 * Tests the Supabase connection and returns detailed information
 * about the connection status
 * 
 * @returns Details about the connection status, type, and performance
 */
export async function testSupabaseConnection() {
  const startTime = Date.now();
  const useLocalDatabase = getFeatureFlag(FEATURES.USE_LOCAL_DATABASE);
  
  try {
    // Determine which type of client we're using
    let connectionType: DatabaseConnectionType;
    
    if (supabase === mockSupabaseClient) {
      connectionType = DatabaseConnectionType.MOCK;
      return {
        success: false,
        connectionType,
        error: 'Invalid Supabase credentials. Please update your .env file with real credentials.',
        latencyMs: 0,
        endpoint: 'none'
      };
    } else {
      connectionType = useLocalDatabase ? 
        DatabaseConnectionType.LOCAL : 
        DatabaseConnectionType.REMOTE;
    }
    
    // Attempt to make a simple query
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    const latencyMs = Date.now() - startTime;
    
    if (error) {
      console.error(`❌ Supabase ${connectionType} connection error:`, error.message);
      return {
        success: false,
        connectionType,
        error: error.message,
        latencyMs,
        endpoint: useLocalDatabase ? 
          import.meta.env.PUBLIC_LOCAL_SUPABASE_URL : 
          import.meta.env.PUBLIC_SUPABASE_URL
      };
    }
    
    console.log(`✅ Supabase ${connectionType} connection successful (${latencyMs}ms)`);
    return {
      success: true,
      connectionType,
      latencyMs,
      recordCount: data?.length || 0,
      endpoint: useLocalDatabase ? 
        import.meta.env.PUBLIC_LOCAL_SUPABASE_URL : 
        import.meta.env.PUBLIC_SUPABASE_URL
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    console.error(`❌ Failed to connect to ${useLocalDatabase ? 'local' : 'remote'} Supabase:`, err);
    return {
      success: false,
      connectionType: useLocalDatabase ? 
        DatabaseConnectionType.LOCAL : 
        DatabaseConnectionType.REMOTE,
      error: err instanceof Error ? err.message : String(err),
      latencyMs,
      endpoint: useLocalDatabase ? 
        import.meta.env.PUBLIC_LOCAL_SUPABASE_URL : 
        import.meta.env.PUBLIC_SUPABASE_URL
    };
  }
}

/**
 * Validates that essential tables exist in the database
 * 
 * @returns Information about table existence and schema validity
 */
export async function validateDatabaseSchema() {
  const startTime = Date.now();
  const useLocalDatabase = getFeatureFlag(FEATURES.USE_LOCAL_DATABASE);
  const connectionType = useLocalDatabase ? 'local' : 'remote';
  
  // List of essential tables to verify
  const essentialTables = [
    'companies',
    'products',
    'websites',
    'therapeutic_areas',
    'company_therapeutic_areas',
    'product_therapeutic_areas'
  ];
  
  try {
    // Get list of tables using system tables (requires service_role access)
    const tableResults = await Promise.all(
      essentialTables.map(async (table) => {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('id')
            .limit(1);
          
          return {
            table,
            exists: !error,
            error: error?.message,
            hasData: data && data.length > 0
          };
        } catch (e) {
          return {
            table,
            exists: false,
            error: e instanceof Error ? e.message : String(e),
            hasData: false
          };
        }
      })
    );
    
    const latencyMs = Date.now() - startTime;
    
    return {
      success: tableResults.every(t => t.exists),
      connectionType: useLocalDatabase ? 
        DatabaseConnectionType.LOCAL : 
        DatabaseConnectionType.REMOTE,
      tables: tableResults,
      missingTables: tableResults.filter(t => !t.exists).map(t => t.table),
      latencyMs,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    
    return {
      success: false,
      connectionType: useLocalDatabase ? 
        DatabaseConnectionType.LOCAL : 
        DatabaseConnectionType.REMOTE,
      error: err instanceof Error ? err.message : String(err),
      tables: essentialTables.map(table => ({
        table,
        exists: false,
        error: 'Schema validation failed',
        hasData: false
      })),
      missingTables: essentialTables,
      latencyMs,
      timestamp: new Date().toISOString()
    };
  }
} 