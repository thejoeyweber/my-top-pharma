/**
 * Application Constants
 * 
 * Central location for all application constants and feature flag names.
 */

/**
 * Feature flag names
 */
export const FEATURES = {
  // Database usage flags
  USE_DATABASE_COMPANIES: 'useDbCompanies',
  USE_DATABASE_PRODUCTS: 'useDbProducts',
  USE_DATABASE_WEBSITES: 'useDbWebsites',
  USE_DATABASE_THERAPEUTIC_AREAS: 'useDbTherapeuticAreas',
  
  // Financial data flags
  USE_DATABASE_COMPANY_FINANCIALS: 'useDbCompanyFinancials',
  USE_DATABASE_COMPANY_METRICS: 'useDbCompanyMetrics',
  USE_DATABASE_COMPANY_STOCK_DATA: 'useDbCompanyStockData',
  
  // Local development flags
  USE_LOCAL_DATABASE: 'useLocalDatabase',
  
  // UI feature flags
  ENABLE_DATA_SOURCE_TOGGLE: 'enableDataSourceToggle'
}; 