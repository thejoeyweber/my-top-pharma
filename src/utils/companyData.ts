/**
 * Company Data Interface Module
 * 
 * This module serves as a redirector to the appropriate data source
 * based on the current feature flag settings. It handles the decision logic
 * between different data sources and provides a consistent API.
 * 
 * For actual implementation details, see:
 * - companyDataUtils.ts - Core data access functions
 * - fmpClient.ts - Financial Modeling Prep API client
 */

import * as companyDataUtils from './companyDataUtils';
import { getFeatureFlag, FEATURES } from './featureFlags';

// Re-export types from companyDataUtils for convenience
export type { Company } from './companyDataUtils';

/**
 * Get all companies
 * Redirects to the appropriate data source based on feature flags
 */
export async function getAllCompanies() {
  // Always check the feature flag state at runtime, don't cache it
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  return companyDataUtils.getCompanies(useDatabase);
}

/**
 * Get a company by ID
 * @param id - Company ID, slug, or stock symbol
 */
export async function getCompanyById(id: string) {
  // Always check the feature flag state at runtime, don't cache it
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  return companyDataUtils.getCompanyById(id, useDatabase);
}

/**
 * Get related companies for a specific company
 * @param companyId - ID of the company to get related companies for
 */
export async function getRelatedCompanies(companyId: string) {
  // Always check the feature flag state at runtime
  return companyDataUtils.getRelatedCompanies(companyId);
}

/**
 * Get companies by therapeutic area
 * @param therapeuticAreaId - Therapeutic area ID
 */
export async function getCompaniesByTherapeuticArea(therapeuticAreaId: string) {
  const useDatabaseSource = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  // Implement different source handling logic
  if (useDatabaseSource) {
    return companyDataUtils.getCompaniesByTherapeuticAreaFromDatabase(therapeuticAreaId);
  } else {
    return companyDataUtils.getCompaniesByTherapeuticAreaFromJson(therapeuticAreaId);
  }
}

/**
 * Get company financial data
 * @param stockSymbol - Company stock symbol
 */
export async function getCompanyFinancials(stockSymbol: string) {
  const useFmpDataSource = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_FINANCIALS);
  
  if (useFmpDataSource) {
    // This would fetch from FMP or database
    return companyDataUtils.getCompanyFinancialsFromDatabase(stockSymbol);
  } else {
    // Fallback to mock data
    return companyDataUtils.getCompanyFinancialsFromJson(stockSymbol);
  }
}

/**
 * Get company stock data
 * @param stockSymbol - Company stock symbol
 */
export async function getCompanyStockData(stockSymbol: string) {
  const useFmpDataSource = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_STOCK_DATA);
  
  if (useFmpDataSource) {
    // This would fetch from FMP or database
    return companyDataUtils.getCompanyStockDataFromDatabase(stockSymbol);
  } else {
    // Fallback to mock data
    return companyDataUtils.getCompanyStockDataFromJson(stockSymbol);
  }
}

/**
 * Get company metrics data
 * @param stockSymbol - Company stock symbol
 */
export async function getCompanyMetrics(stockSymbol: string) {
  const useFmpDataSource = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_METRICS);
  
  if (useFmpDataSource) {
    // This would fetch from FMP or database
    return companyDataUtils.getCompanyMetricsFromDatabase(stockSymbol);
  } else {
    // Fallback to mock data
    return companyDataUtils.getCompanyMetricsFromJson(stockSymbol);
  }
} 