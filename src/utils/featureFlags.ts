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
import { FEATURES } from './constants';

/**
 * Feature flag types
 */
export interface FeatureFlags {
  // Database connection settings
  databaseUrl: string;
  databaseKey: string;
  databaseUseSsl: boolean;
  
  // Database usage flags (defined in constants.ts)
  // Using indexed signature notation to avoid TS errors with computed properties
  useDbCompanies: boolean;
  useDbProducts: boolean;
  useDbWebsites: boolean;
  useDbTherapeuticAreas: boolean;
  useDbCompanyFinancials: boolean;
  useDbCompanyMetrics: boolean;
  useDbCompanyStockData: boolean;
  useLocalDatabase: boolean;
  enableDataSourceToggle: boolean;
  
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
  
  // Database usage flags (all enabled by default)
  useDbCompanies: true,
  useDbProducts: true,
  useDbWebsites: true,
  useDbTherapeuticAreas: true,
  useDbCompanyFinancials: true,
  useDbCompanyMetrics: true,
  useDbCompanyStockData: true,
  useLocalDatabase: false,
  enableDataSourceToggle: import.meta.env.DEV === true,
  
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
  // Handle mapping from FEATURES constant to actual property name
  if (name === FEATURES.USE_DATABASE_COMPANIES) return featureFlags.useDbCompanies as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_PRODUCTS) return featureFlags.useDbProducts as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_WEBSITES) return featureFlags.useDbWebsites as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_THERAPEUTIC_AREAS) return featureFlags.useDbTherapeuticAreas as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_COMPANY_FINANCIALS) return featureFlags.useDbCompanyFinancials as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_COMPANY_METRICS) return featureFlags.useDbCompanyMetrics as FeatureFlags[K];
  if (name === FEATURES.USE_DATABASE_COMPANY_STOCK_DATA) return featureFlags.useDbCompanyStockData as FeatureFlags[K];
  if (name === FEATURES.USE_LOCAL_DATABASE) return featureFlags.useLocalDatabase as FeatureFlags[K];
  if (name === FEATURES.ENABLE_DATA_SOURCE_TOGGLE) return featureFlags.enableDataSourceToggle as FeatureFlags[K];
  
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
    // Handle mapping from FEATURES constant to actual property name
    if (name === FEATURES.USE_DATABASE_COMPANIES) {
      featureFlags.useDbCompanies = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_PRODUCTS) {
      featureFlags.useDbProducts = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_WEBSITES) {
      featureFlags.useDbWebsites = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_THERAPEUTIC_AREAS) {
      featureFlags.useDbTherapeuticAreas = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_COMPANY_FINANCIALS) {
      featureFlags.useDbCompanyFinancials = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_COMPANY_METRICS) {
      featureFlags.useDbCompanyMetrics = value as boolean;
    } else if (name === FEATURES.USE_DATABASE_COMPANY_STOCK_DATA) {
      featureFlags.useDbCompanyStockData = value as boolean;
    } else if (name === FEATURES.USE_LOCAL_DATABASE) {
      featureFlags.useLocalDatabase = value as boolean;
    } else if (name === FEATURES.ENABLE_DATA_SOURCE_TOGGLE) {
      featureFlags.enableDataSourceToggle = value as boolean;
    } else {
      // Update other flags
      featureFlags[name] = value;
    }
    
    // Persist to localStorage if available
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
    }
    
    // Set cookie for persistence across sessions
    if (typeof document !== 'undefined') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
      
      // For FEATURES constant keys, map to the actual property name
      let cookieName = name as string;
      if (name in FEATURES) {
        cookieName = name.toString().replace(/^use/, '').replace(/^([A-Z])/, (m) => m.toLowerCase());
      }
      
      document.cookie = `ff_${cookieName}=${value};expires=${expiryDate.toUTCString()};path=/`;
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