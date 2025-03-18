/**
 * Supabase Client Tests
 * 
 * Tests for the Supabase client functionality to ensure:
 * - Proper handling of environment variables
 * - Creation of appropriate client instances
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the environment variables and imports before importing the module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({
          data: [{ id: 1 }],
          error: null
        }))
      }))
    })),
    auth: {
      getUser: vi.fn()
    }
  }))
}));

// Create the import.meta.env mock
const originalEnv = import.meta.env;

describe('Supabase Client', () => {
  beforeEach(() => {
    // Setup mocked environment variables
    vi.stubGlobal('import.meta', {
      env: {
        PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PUBLIC_SUPABASE_ANON_KEY: 'public-key',
        SUPABASE_SERVICE_ROLE_KEY: 'service-key'
      }
    });
  });

  afterEach(() => {
    // Restore original environment
    vi.stubGlobal('import.meta', { env: originalEnv });
    vi.resetAllMocks();
  });

  it('should export supabase and supabaseAdmin clients', async () => {
    // Import the module after setting up mocks
    const { supabase, supabaseAdmin } = await import('../../lib/supabase');
    
    // Verify clients are created
    expect(supabase).toBeDefined();
    expect(supabaseAdmin).toBeDefined();
  });

  it('should handle missing environment variables', async () => {
    // Setup mocked environment with missing variables
    vi.stubGlobal('import.meta', {
      env: {
        // Missing the URL
        PUBLIC_SUPABASE_ANON_KEY: 'public-key'
      }
    });
    
    // Silence console errors for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Import the module with missing variables (should not throw but log error)
    const { supabase } = await import('../../lib/supabase');
    
    // Verify client is still defined (will use default values)
    expect(supabase).toBeDefined();
    
    // Verify error was logged about missing variables
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
}); 