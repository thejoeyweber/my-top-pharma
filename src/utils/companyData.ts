/**
 * Company Data Interface Module
 * 
 * This module serves as a redirector to the appropriate data source
 * based on the current feature flag settings. It handles the decision logic
 * between different data sources and provides a consistent API.
 * 
 * For actual implementation details, see:
 * - companyDataUtils.ts - Core data access functions
 */

import { companyDataUtils } from './companyDataUtils';
import { getFeatureFlag } from './featureFlags';
import { FEATURES } from './constants';

// Export types
export type { Company } from '../interfaces/entities';
export type { Result } from './companyDataUtils';

/**
 * Get all companies
 * Returns companies from the database
 */
export async function getAllCompanies() {
  return companyDataUtils.getCompanies();
}

/**
 * Get a company by ID
 * @param id - Company ID 
 */
export async function getCompanyById(id: string) {
  return companyDataUtils.getCompany(id, 'id');
}

/**
 * Get a company by slug
 * @param slug - Company slug
 */
export async function getCompanyBySlug(slug: string) {
  return companyDataUtils.getCompany(slug, 'slug');
}

/**
 * Get related companies for a specific company
 * @param companyId - ID of the company to get related companies for
 */
export async function getRelatedCompanies(companyId: string) {
  return companyDataUtils.getRelatedCompanies(companyId);
}

/**
 * Get companies by therapeutic area
 * @param therapeuticAreaId - Therapeutic area ID
 */
export async function getCompaniesByTherapeuticArea(therapeuticAreaId: string) {
  return companyDataUtils.getCompaniesByTherapeuticArea(therapeuticAreaId);
}

/**
 * Get company financial data
 * @param tickerSymbol - Company ticker symbol
 */
export async function getCompanyFinancials(tickerSymbol: string) {
  return companyDataUtils.getCompanyFinancials(tickerSymbol);
}

/**
 * Get company stock data
 * @param tickerSymbol - Company ticker symbol
 */
export async function getCompanyStockData(tickerSymbol: string) {
  return companyDataUtils.getCompanyStockData(tickerSymbol);
}

/**
 * Get company metrics data
 * @param tickerSymbol - Company ticker symbol
 */
export async function getCompanyMetrics(tickerSymbol: string) {
  return companyDataUtils.getCompanyMetrics(tickerSymbol);
} 