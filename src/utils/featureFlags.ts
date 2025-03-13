/**
 * Feature Flags System
 * 
 * This module provides a centralized way to manage feature flags for the application.
 * Feature flags control which data source is used for different content types,
 * allowing for a phased migration from static JSON data to database-driven content.
 */

// Import .env variables for server-side rendering defaults
import.meta.env;

// Define all available feature flags
export const FEATURES = {
  // Data source flags - control whether we use database or static JSON
  USE_DATABASE_COMPANIES: 'USE_DATABASE_COMPANIES',
  USE_DATABASE_PRODUCTS: 'USE_DATABASE_PRODUCTS',
  USE_DATABASE_WEBSITES: 'USE_DATABASE_WEBSITES',
  USE_DATABASE_THERAPEUTIC_AREAS: 'USE_DATABASE_THERAPEUTIC_AREAS',
  
  // Additional data type flags for FMP data
  USE_DATABASE_COMPANY_FINANCIALS: 'USE_DATABASE_COMPANY_FINANCIALS',
  USE_DATABASE_COMPANY_METRICS: 'USE_DATABASE_COMPANY_METRICS',
  USE_DATABASE_COMPANY_STOCK_DATA: 'USE_DATABASE_COMPANY_STOCK_DATA',
  
  // UI flags
  ENABLE_DATA_SOURCE_TOGGLE: 'ENABLE_DATA_SOURCE_TOGGLE',
} as const;

// Define the type for feature flag keys
export type FeatureFlag = keyof typeof FEATURES;

// Local storage key for persisting feature flags
const STORAGE_KEY = 'mytoppharma_feature_flags';

// Server-side environment variables can set default flag values
// These take precedence over DEFAULT_FLAGS but not over URL params or cookies
const ENV_FLAGS: Partial<Record<FeatureFlag, boolean>> = {
  USE_DATABASE_COMPANIES: import.meta.env.PUBLIC_USE_DATABASE_COMPANIES === 'true',
  USE_DATABASE_PRODUCTS: import.meta.env.PUBLIC_USE_DATABASE_PRODUCTS === 'true',
  USE_DATABASE_WEBSITES: import.meta.env.PUBLIC_USE_DATABASE_WEBSITES === 'true',
  USE_DATABASE_THERAPEUTIC_AREAS: import.meta.env.PUBLIC_USE_DATABASE_THERAPEUTIC_AREAS === 'true',
  USE_DATABASE_COMPANY_FINANCIALS: import.meta.env.PUBLIC_USE_DATABASE_COMPANY_FINANCIALS === 'true',
  USE_DATABASE_COMPANY_METRICS: import.meta.env.PUBLIC_USE_DATABASE_COMPANY_METRICS === 'true',
  USE_DATABASE_COMPANY_STOCK_DATA: import.meta.env.PUBLIC_USE_DATABASE_COMPANY_STOCK_DATA === 'true',
};

// Default feature flag values if not set in environment or cookies
const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  USE_DATABASE_COMPANIES: false,
  USE_DATABASE_PRODUCTS: false,
  USE_DATABASE_WEBSITES: false,
  USE_DATABASE_THERAPEUTIC_AREAS: false,
  USE_DATABASE_COMPANY_FINANCIALS: false,
  USE_DATABASE_COMPANY_METRICS: false,
  USE_DATABASE_COMPANY_STOCK_DATA: false,
  ENABLE_DATA_SOURCE_TOGGLE: import.meta.env.DEV, // Only enabled in development by default
};

// In-memory cache of feature flags - cleared between requests in SSR
let featureFlagsCache: Record<FeatureFlag, boolean> | null = null;

/**
 * Parses cookies to find feature flags
 * Works in both browser and server contexts if cookies are present
 */
function getFeatureFlagsFromCookies(): Partial<Record<FeatureFlag, boolean>> {
  const flags: Partial<Record<FeatureFlag, boolean>> = {};
  
  // Get cookies string - works in both browser and some server contexts
  const cookieString = 
    // Browser context
    (typeof document !== 'undefined' ? document.cookie : '') ||
    // We can't directly access Astro in a module, so we only use document.cookie
    '';
  
  if (!cookieString) return flags;
  
  // Parse cookies
  cookieString.split(';').forEach((cookie: string) => {
    const [name, value] = cookie.trim().split('=');
    
    // Check if this is a feature flag cookie (prefixed with ff_)
    if (name && name.startsWith('ff_')) {
      // Convert cookie name back to flag name
      const flagName = name.replace('ff_', '').toUpperCase();
      
      // Check if this matches a known feature flag
      if (Object.values(FEATURES).includes(flagName as any)) {
        flags[flagName as FeatureFlag] = value === 'true';
      }
    }
  });
  
  return flags;
}

/**
 * Get URL parameters for feature flags
 * Works in both browser and server contexts
 */
function getFeatureFlagsFromUrl(): Partial<Record<FeatureFlag, boolean>> {
  const flags: Partial<Record<FeatureFlag, boolean>> = {};
  
  // Get URL search params - browser-only for now
  // We can't access Astro.url in a module
  let searchParams: URLSearchParams | null = null;
  
  try {
    // Browser context
    if (typeof window !== 'undefined') {
      searchParams = new URLSearchParams(window.location.search);
    }
  } catch (e) {
    console.error('Error getting URL parameters:', e);
    return flags;
  }
  
  if (!searchParams) return flags;
  
  // Check each feature flag for URL parameter
  Object.values(FEATURES).forEach(flag => {
    const paramName = `ff_${flag.toLowerCase()}`;
    const paramValue = searchParams?.get(paramName);
    
    if (paramValue === 'true') {
      flags[flag as FeatureFlag] = true;
    } else if (paramValue === 'false') {
      flags[flag as FeatureFlag] = false;
    }
  });
  
  return flags;
}

/**
 * Get feature flags from localStorage (client-side only)
 */
function getFeatureFlagsFromLocalStorage(): Partial<Record<FeatureFlag, boolean>> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {};
  }
  
  try {
    const storedFlags = localStorage.getItem(STORAGE_KEY);
    if (storedFlags) {
      return JSON.parse(storedFlags);
    }
  } catch (error) {
    console.error('Error loading feature flags from local storage:', error);
  }
  
  return {};
}

/**
 * Initialize feature flags by combining all sources with proper priority
 * 1. URL parameters (highest priority)
 * 2. Cookies (shared between client/server)
 * 3. LocalStorage (client-only)
 * 4. Environment variables
 * 5. Default values (lowest priority)
 */
function initializeFeatureFlags(): Record<FeatureFlag, boolean> {
  // Return cached values if available
  if (featureFlagsCache !== null) {
    return featureFlagsCache;
  }
  
  // Start with default values
  const mergedFlags = { ...DEFAULT_FLAGS };
  
  // Apply each source with increasing priority
  const sources = [
    // Environment variables from .env (server-side)
    ENV_FLAGS,
    // localStorage values (client-side only)
    getFeatureFlagsFromLocalStorage(),
    // Cookie values (works in both contexts)
    getFeatureFlagsFromCookies(),
    // URL parameters (highest priority)
    getFeatureFlagsFromUrl(),
  ];
  
  // Merge sources in priority order
  sources.forEach(source => {
    Object.entries(source).forEach(([key, value]) => {
      if (key in mergedFlags) {
        mergedFlags[key as FeatureFlag] = value;
      }
    });
  });
  
  // Cache the result
  featureFlagsCache = mergedFlags;
  
  return mergedFlags;
}

/**
 * Get the current value of a feature flag
 * @param flag The feature flag to check
 * @returns The current state of the feature flag (true=enabled, false=disabled)
 */
export function getFeatureFlag(flag: FeatureFlag): boolean {
  const flags = initializeFeatureFlags();
  return flags[flag];
}

/**
 * Set a feature flag value - affects localStorage and attempts to set a cookie
 * @param flag The feature flag to set
 * @param value The value to set (true=enabled, false=disabled)
 */
export function setFeatureFlag(flag: FeatureFlag, value: boolean): void {
  // Update in-memory cache
  const flags = initializeFeatureFlags();
  flags[flag] = value;
  featureFlagsCache = flags;
  
  // Only update storage in browser context
  if (typeof window !== 'undefined') {
    // Update localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error saving feature flags to local storage:', error);
    }
    
    // Try to set a cookie as well
    try {
      document.cookie = `ff_${flag.toLowerCase()}=${value}; path=/; max-age=86400`;
    } catch (error) {
      console.error('Error setting feature flag cookie:', error);
    }
  }
}

/**
 * Reset all feature flags to their default values
 */
export function resetFeatureFlags(): void {
  featureFlagsCache = { ...DEFAULT_FLAGS };
  
  // Only update storage in browser context
  if (typeof window !== 'undefined') {
    // Update localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(featureFlagsCache));
    } catch (error) {
      console.error('Error resetting feature flags in local storage:', error);
    }
    
    // Clear cookies for all flags
    Object.values(FEATURES).forEach(flag => {
      try {
        document.cookie = `ff_${flag.toLowerCase()}=; path=/; max-age=0`;
      } catch (error) {
        console.error(`Error clearing cookie for flag ${flag}:`, error);
      }
    });
  }
}

/**
 * Get all current feature flag values
 * @returns Record of all feature flags and their current values
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  return { ...initializeFeatureFlags() };
} 