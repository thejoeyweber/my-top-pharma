/**
 * Company Data Utilities
 * 
 * This module provides functions for accessing company data from different sources:
 * - Static JSON files (legacy)
 * - Local Database (development)
 * - Remote Database (production)
 * 
 * It implements the phased migration approach outlined in _docs/phased-migration-plan.md
 */

import type { Company } from '../types/company';
import { supabase } from './supabase';
import { withDataSource, type ContentType } from './dataSourceUtil';
import type { PostgrestError } from '@supabase/supabase-js';

// Define type for database records
interface CompanyRecord {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  headquarters: string | null;
  founded_year: number | null;
  employee_count: number | null;
  market_cap_billions: number | null;
  annual_revenue_billions: number | null;
  ticker_symbol: string | null;
  exchange: string | null;
  ceo: string | null;
  therapeutic_areas: string[] | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all companies
 * 
 * This function fetches companies from the appropriate data source based on 
 * current feature flag settings.
 * 
 * @returns Promise<Company[]> Array of companies
 */
export async function getCompanies(): Promise<Company[]> {
  return withDataSource<Company[]>(
    'companies',
    getCompaniesFromJson,
    getCompaniesFromDatabase
  );
}

/**
 * Get a single company by ID
 * 
 * @param id Company ID to retrieve
 * @returns Promise<Company | undefined> The company object or undefined if not found
 */
export async function getCompanyById(id: string): Promise<Company | undefined> {
  try {
    const companies = await getCompanies();
    return companies.find(company => company.id === id);
  } catch (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    return undefined;
  }
}

/**
 * Get companies by therapeutic area
 * 
 * @param taId Therapeutic area ID
 * @returns Promise<Company[]> Array of companies with the specified therapeutic area
 */
export async function getCompaniesByTherapeuticArea(taId: string): Promise<Company[]> {
  try {
    const companies = await getCompanies();
    return companies.filter(company => 
      company.therapeuticAreas && company.therapeuticAreas.includes(taId)
    );
  } catch (error) {
    console.error(`Error fetching companies for therapeutic area ${taId}:`, error);
    return [];
  }
}

/**
 * Legacy function to get companies from static JSON files
 * Will be removed after migration is complete
 * 
 * @private
 * @returns Promise<Company[]> Array of companies from JSON
 */
async function getCompaniesFromJson(): Promise<Company[]> {
  try {
    console.log('📄 Fetching companies from static JSON');
    const companiesModule = await import('../data/json/companies.json');
    // Cast to any first to bypass type checking, then we'll transform the data
    const jsonCompanies = companiesModule.default as any[];
    
    // Transform the JSON data to match our Company type
    return jsonCompanies.map(json => ({
      id: json.id,
      name: json.name,
      description: json.description || '',
      logoUrl: json.logoUrl || '',
      websiteUrl: json.website || '',
      headquarters: json.headquarters || '',
      foundedYear: json.founded ? parseInt(json.founded) : null,
      employeeCount: json.employees || null,
      marketCapBillions: json.marketCap || null,
      annualRevenueBillions: null, // Not available in JSON format
      tickerSymbol: json.stockSymbol || '',
      exchange: json.stockExchange || '',
      ceo: '', // Not available in JSON format
      therapeuticAreas: json.therapeuticAreas || []
    }));
  } catch (error) {
    console.error('Error loading companies from JSON:', error);
    return [];
  }
}

/**
 * Get companies from database (either local or remote)
 * 
 * @private
 * @param isLocal Whether to use local database (true) or remote database (false)
 * @returns Promise<Company[]> Array of companies from database
 */
async function getCompaniesFromDatabase(isLocal: boolean): Promise<Company[]> {
  try {
    console.log(`💾 Fetching companies from ${isLocal ? 'local' : 'remote'} database`);
    
    // Use type assertion to handle the mock client case
    const query = supabase
      .from('companies')
      .select('*');
    
    // Only call order if it's available (not on the mock client)
    const { data, error } = 'order' in query 
      ? await query.order('name') 
      : await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.warn('No companies found in database');
      return [];
    }
    
    // Transform database records to match application Company type
    return data.map((record: CompanyRecord) => ({
      id: record.id,
      name: record.name,
      description: record.description || '',
      logoUrl: record.logo_url || '',
      websiteUrl: record.website_url || '',
      headquarters: record.headquarters || '',
      foundedYear: record.founded_year,
      employeeCount: record.employee_count,
      marketCapBillions: record.market_cap_billions,
      annualRevenueBillions: record.annual_revenue_billions,
      tickerSymbol: record.ticker_symbol || '',
      exchange: record.exchange || '',
      ceo: record.ceo || '',
      therapeuticAreas: record.therapeutic_areas || []
    }));
  } catch (error) {
    console.error(`Error fetching companies from ${isLocal ? 'local' : 'remote'} database:`, error);
    
    // During transition phase, fall back to JSON
    // This fallback will be removed after migration is complete
    console.warn('Falling back to static JSON for companies');
    return getCompaniesFromJson();
  }
} 