/**
 * FMP Data Mapper
 * 
 * This module transforms data from the Financial Modeling Prep API
 * to match our internal database schema.
 */

import type { FMPCompanyProfile, FMPScreenerResult } from './fmpClient';
import type { Database } from '../types/supabase';
import { generateSlug, parseNumeric } from '../utils/stringUtils';

export type DbCompanyInsert = Database['public']['Tables']['companies']['Insert'];

/**
 * Transform FMP company profile data to our database schema
 * @param profile FMP company profile
 * @returns Database company object
 */
export function mapProfileToCompany(profile: FMPCompanyProfile): DbCompanyInsert {
  // Generate slug from company name
  const slug = generateSlug(profile.companyName);
  
  // Parse numeric values that might be strings
  const marketCap = parseNumeric(profile.mktCap);
  const employeeCount = parseNumeric(profile.fullTimeEmployees);
  
  // Maps FMP data to our database schema
  return {
    name: profile.companyName,
    slug: slug,
    description: profile.description || null,
    website: profile.website || null,
    logo_url: profile.image || null, // FMP provides image URLs
    headquarters: profile.country ? `${profile.city}, ${profile.country}` : null,
    employee_count: employeeCount, 
    revenue_usd: null, // FMP doesn't provide this directly
    public_company: true, // FMP only covers public companies
    stock_symbol: profile.symbol,
    stock_exchange: profile.exchange,
    // Extract year from IPO date if available
    founded_year: profile.ipoDate ? new Date(profile.ipoDate).getFullYear() : null
  };
}

/**
 * Transform FMP screener result to our database schema
 * With less detail than full profile
 * @param result FMP screener result
 * @returns Database company object
 */
export function mapScreenerResultToCompany(result: FMPScreenerResult): DbCompanyInsert {
  // Generate slug from company name
  const slug = generateSlug(result.companyName);
  
  // Parse market cap which might be a string
  const marketCap = parseNumeric(result.marketCap);
  
  // Create minimal company record from screener data
  return {
    name: result.companyName,
    slug: slug,
    description: null, // Not available in screener
    website: null, // Not available in screener
    logo_url: null, // Not available in screener
    headquarters: result.country || null,
    employee_count: null, // Not available in screener
    revenue_usd: null, // Not available in screener
    public_company: true, // FMP only covers public companies
    stock_symbol: result.symbol,
    stock_exchange: result.exchange,
    founded_year: null // Not available in screener
  };
}

/**
 * Process a batch of company profiles into database records
 * @param profiles List of FMP company profiles
 * @returns List of database company objects
 */
export function processCompanyProfiles(profiles: FMPCompanyProfile[]): DbCompanyInsert[] {
  return profiles.map(profile => mapProfileToCompany(profile));
}

/**
 * Process a batch of screener results into database records
 * @param results List of FMP screener results
 * @returns List of database company objects
 */
export function processScreenerResults(results: FMPScreenerResult[]): DbCompanyInsert[] {
  return results.map(result => mapScreenerResultToCompany(result));
} 