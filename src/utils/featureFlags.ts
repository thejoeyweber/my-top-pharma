/**
 * Feature Flags
 * 
 * A centralized feature flags system for managing application features.
 * Simplified to remove previous data source selection features since the app
 * now uses Supabase directly.
 * 
 * Uses browser storage (cookies, localStorage) to persist flags
 * across sessions, and URL parameters for temporary overrides.
 */

import { ErrorCategory, createErrorResponse, type ErrorResponse } from './errorUtils';

/**
 * Feature flag types
 */
export interface FeatureFlags {
  // Database connection settings
  databaseUrl: string;
  databaseKey: string;
  databaseUseSsl: boolean;
  
  // Additional feature flags
  enableDevTools: boolean;
  enableDarkMode: boolean;
  enableBetaFeatures: boolean;
  
  // Add other feature flags as needed
  [key: string]: boolean | string | number;
}

/**
 * Default feature flag values 
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Database connection settings (override with env variables)
  databaseUrl: import.meta.env.PUBLIC_SUPABASE_URL || '',
  databaseKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '',
  databaseUseSsl: true,
  
  // Additional feature flags
  enableDevTools: import.meta.env.DEV === true,
  enableDarkMode: false,
  enableBetaFeatures: false,
};

// Singleton instance
let featureFlags: FeatureFlags = { ...defaultFeatureFlags };

/**
 * Initialize feature flags from various sources
 * Order of precedence: URL params > cookies > localStorage > defaults
 */
export function initializeFeatureFlags(): FeatureFlags {
  // Start with defaults
  const flags = { ...defaultFeatureFlags };
  
  try {
    // Load from localStorage if available
    if (typeof localStorage !== 'undefined') {
      const storedFlags = localStorage.getItem('featureFlags');
      if (storedFlags) {
        Object.assign(flags, JSON.parse(storedFlags));
      }
    }
    
    // Load from cookies if available
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        if (parts.length === 2 && parts[0].trim().startsWith('ff_')) {
          const key = parts[0].trim().substring(3);
          const value = parts[1].trim();
          
          if (key in flags) {
            // Convert string value to appropriate type
            if (typeof flags[key] === 'boolean') {
              flags[key] = value === 'true';
            } else if (typeof flags[key] === 'number') {
              flags[key] = Number(value);
            } else {
              flags[key] = value;
            }
          }
        }
      });
    }
    
    // Override with URL parameters if available
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.forEach((value, key) => {
        if (key.startsWith('ff_')) {
          const flagKey = key.substring(3);
          if (flagKey in flags) {
            // Convert string value to appropriate type
            if (typeof flags[flagKey] === 'boolean') {
              flags[flagKey] = value === 'true';
            } else if (typeof flags[flagKey] === 'number') {
              flags[flagKey] = Number(value);
            } else {
              flags[flagKey] = value;
            }
          }
        }
      });
    }
    
    // Update singleton instance
    featureFlags = flags;
    
  } catch (error) {
    console.error('Error initializing feature flags:', error);
  }
  
  return flags;
}

/**
 * Get a feature flag value
 * @param name Feature flag name
 * @returns The feature flag value
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(name: K): FeatureFlags[K] {
  return featureFlags[name];
}

/**
 * Set a feature flag value
 * @param name Feature flag name
 * @param value Feature flag value
 * @returns Result indicating success or error
 */
export function setFeatureFlag<K extends keyof FeatureFlags>(
  name: K, 
  value: FeatureFlags[K]
): { success: boolean; error?: ErrorResponse } {
  try {
    // Update in-memory value
    featureFlags[name] = value;
    
    // Persist to localStorage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
    }
    
    // Set cookie for persistence across sessions
    if (typeof document !== 'undefined') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
      document.cookie = `ff_${name}=${value};expires=${expiryDate.toUTCString()};path=/`;
    }
    
    // Dispatch event for components that need to react to flag changes
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('featureflag:changed', { 
        detail: { name, value } 
      });
      window.dispatchEvent(event);
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: createErrorResponse(
        `Failed to set feature flag: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCategory.INTERNAL,
        { originalError: error }
      ) 
    };
  }
}

/**
 * Reset feature flags to defaults
 * @returns Result indicating success or error
 */
export function resetFeatureFlags(): { success: boolean; error?: ErrorResponse } {
  try {
    // Reset in-memory flags
    featureFlags = { ...defaultFeatureFlags };
    
    // Clear localStorage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('featureFlags');
    }
    
    // Clear cookies
    if (typeof document !== 'undefined') {
      Object.keys(featureFlags).forEach(key => {
        document.cookie = `ff_${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    }
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('featureflag:reset');
      window.dispatchEvent(event);
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: createErrorResponse(
        `Failed to reset feature flags: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorCategory.INTERNAL,
        { originalError: error }
      ) 
    };
  }
}

/**
 * Get all feature flags
 * @returns All feature flags
 */
export function getAllFeatureFlags(): FeatureFlags {
  return { ...featureFlags };
}

// Initialize feature flags if in browser environment
if (typeof window !== 'undefined') {
  initializeFeatureFlags();
} 