/**
 * Feature Flags System
 * 
 * This module provides a centralized way to manage feature flags for the application.
 * Feature flags control which data source is used for different content types,
 * allowing for a phased migration from static JSON data to database-driven content.
 */

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

// Default feature flag values
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

// In-memory cache of feature flags
let featureFlagsCache: Record<FeatureFlag, boolean> | null = null;

/**
 * Initialize feature flags from local storage or defaults
 */
function initializeFeatureFlags(): Record<FeatureFlag, boolean> {
  // Return cached flags if available
  if (featureFlagsCache !== null) {
    return featureFlagsCache;
  }
  
  // Only run in browser context
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { ...DEFAULT_FLAGS };
  }
  
  try {
    const storedFlags = localStorage.getItem(STORAGE_KEY);
    if (storedFlags) {
      const parsedFlags = JSON.parse(storedFlags);
      // Merge saved flags with defaults (to handle new flags added since last save)
      featureFlagsCache = { ...DEFAULT_FLAGS, ...parsedFlags };
    } else {
      featureFlagsCache = { ...DEFAULT_FLAGS };
    }
    
    return featureFlagsCache;
  } catch (error) {
    console.error('Error loading feature flags from local storage:', error);
    featureFlagsCache = { ...DEFAULT_FLAGS };
    return featureFlagsCache;
  }
}

/**
 * Get the current value of a feature flag
 * @param flag The feature flag to check
 * @returns The current state of the feature flag (true=enabled, false=disabled)
 */
export function getFeatureFlag(flag: FeatureFlag): boolean {
  const flags = initializeFeatureFlags();
  
  // Allow URL parameter override for testing
  if (typeof window !== 'undefined' && typeof URLSearchParams !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(`ff_${flag.toLowerCase()}`);
    
    if (paramValue === 'true') return true;
    if (paramValue === 'false') return false;
  }
  
  return flags[flag];
}

/**
 * Set a feature flag value
 * @param flag The feature flag to set
 * @param value The value to set (true=enabled, false=disabled)
 */
export function setFeatureFlag(flag: FeatureFlag, value: boolean): void {
  const flags = initializeFeatureFlags();
  flags[flag] = value;
  
  // Update the cache
  featureFlagsCache = flags;
  
  // Only run in browser context
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error saving feature flags to local storage:', error);
    }
  }
}

/**
 * Reset all feature flags to their default values
 */
export function resetFeatureFlags(): void {
  featureFlagsCache = { ...DEFAULT_FLAGS };
  
  // Only run in browser context
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(featureFlagsCache));
    } catch (error) {
      console.error('Error resetting feature flags in local storage:', error);
    }
  }
}

/**
 * Get all current feature flag values
 * @returns Record of all feature flags and their current values
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  return { ...initializeFeatureFlags() };
} 