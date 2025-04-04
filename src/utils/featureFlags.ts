/**
 * Feature Flags Utility
 * 
 * This module provides functionality for managing feature flags in the application.
 * It allows for enabling/disabling features at runtime and persisting these settings.
 */

// Define all available feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: 'ENABLE_ANALYTICS',
  USE_NEW_UI: 'USE_NEW_UI',
  ENABLE_BETA_FEATURES: 'ENABLE_BETA_FEATURES',
  DARK_MODE: 'DARK_MODE',
  ENABLE_NOTIFICATIONS: 'ENABLE_NOTIFICATIONS',
};

// In-memory store for feature flag values
const featureFlags: Record<string, boolean> = {
  [FEATURES.ENABLE_ANALYTICS]: true,
  [FEATURES.USE_NEW_UI]: false,
  [FEATURES.ENABLE_BETA_FEATURES]: false,
  [FEATURES.DARK_MODE]: false,
  [FEATURES.ENABLE_NOTIFICATIONS]: true,
};

/**
 * Set a feature flag value
 * @param flag The feature flag to set
 * @param value The boolean value to set
 */
export const setFeatureFlag = (flag: string, value: boolean): void => {
  if (Object.values(FEATURES).includes(flag)) {
    featureFlags[flag] = value;
    console.log(`Feature flag ${flag} set to ${value}`);
  } else {
    console.warn(`Attempted to set unknown feature flag: ${flag}`);
  }
};

/**
 * Get the current value of a feature flag
 * @param flag The feature flag to check
 * @returns The boolean value of the flag, or false if not found
 */
export const getFeatureFlag = (flag: string): boolean => {
  if (Object.values(FEATURES).includes(flag)) {
    return featureFlags[flag];
  }
  console.warn(`Attempted to get unknown feature flag: ${flag}`);
  return false;
};

/**
 * Initialize feature flags from cookies or other sources
 * @param cookies Object containing cookie values
 */
export const initializeFeatureFlags = (cookies: Record<string, string> = {}): void => {
  Object.values(FEATURES).forEach(flag => {
    const cookieName = `ff_${flag.toLowerCase()}`;
    if (cookieName in cookies) {
      const value = cookies[cookieName] === 'true';
      featureFlags[flag] = value;
      console.log(`Initialized feature flag ${flag} to ${value} from cookie`);
    }
  });
}; 