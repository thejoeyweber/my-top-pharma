/**
 * Company Data Utilities
 * 
 * Standardized functions for accessing company data from various sources.
 * Uses feature flags to determine whether to fetch from Supabase or mock JSON.
 */

import { supabase } from './supabase';
import { getFeatureFlag, FEATURES } from './featureFlags';
import { companies as mockCompanies } from './dataUtils';

// Import JSON data for mock responses
import companyFinancialsData from '../data/json/companyFinancials.json';
import companyMetricsData from '../data/json/companyMetrics.json';
import companyStockData from '../data/json/companyStockData.json';

// Import types
import type { Database } from '../types/supabase';
import type { Company as CompanyType } from '../types/companies';

// Define company type based on Supabase schema
export type Company = Database['public']['Tables']['companies']['Row'];

/**
 * Transform a database company record to match the expected Company type shape
 */
function transformDatabaseCompany(dbCompany: any): CompanyType {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    slug: dbCompany.slug || dbCompany.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    description: dbCompany.description || '',
    logoUrl: dbCompany.logo_url || '/placeholder-logo.png',
    headerImageUrl: dbCompany.header_image_url || undefined,
    headquarters: dbCompany.headquarters || 'Unknown',
    founded: dbCompany.founded || 'Unknown',
    website: dbCompany.website || '',
    marketCap: dbCompany.market_cap ? Number(dbCompany.market_cap) / 1e9 : 0, // Convert to billions
    employees: dbCompany.full_time_employees || 0,
    stockSymbol: dbCompany.stock_symbol || dbCompany.ticker || undefined,
    stockExchange: dbCompany.stock_exchange || undefined,
    therapeuticAreas: dbCompany.therapeutic_areas || [],
    products: dbCompany.products || [],
    relatedCompanies: dbCompany.related_companies || [],
    milestones: dbCompany.milestones || [],
    financials: dbCompany.financials || []
  };
}

/**
 * Get mock companies data
 */
function getMockCompanies(): CompanyType[] {
  return mockCompanies;
}

/**
 * Get a specific mock company by ID
 */
function getMockCompanyById(id: string): CompanyType | null {
  return mockCompanies.find(company => 
    company.id.toString() === id.toString() || 
    // @ts-ignore - Ignore the slug property which might not be in the type but exists in the data
    company.slug === id || 
    company.stockSymbol?.toLowerCase() === id.toLowerCase()
  ) || null;
}

/**
 * Get all companies
 * @returns Array of companies
 */
export async function getAllCompanies(): Promise<CompanyType[]> {
  return getCompanies(getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES));
}

/**
 * Get company data from either mock JSON or database based on feature flag
 */
export async function getCompanies(useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES)): Promise<CompanyType[]> {
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching companies from database:', error);
        return getMockCompanies();
      }
      
      return data.map(transformDatabaseCompany);
    } catch (error) {
      console.error('Failed to fetch companies from database, falling back to mock data:', error);
      return getMockCompanies();
    }
  }
  
  return getMockCompanies();
}

/**
 * Get a specific company by ID from either mock JSON or database
 * @param id - Company ID, slug, or stock symbol (string or number)
 * @param useDatabase - Whether to use database or mock data
 * @returns Company or null if not found
 */
export async function getCompanyById(
  id: string | number, 
  useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES)
): Promise<CompanyType | null> {
  if (useDatabase) {
    try {
      // Try finding by ID first
      let { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id.toString())
        .single();
      
      // If not found by ID, try by slug (if id is a string)
      if (!data && !error && typeof id === 'string') {
        ({ data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', id)
          .single());
      }
      
      // If still not found, try by stock_symbol (if id is a string)
      if (!data && !error && typeof id === 'string') {
        ({ data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('stock_symbol', id)
          .single());
      }
      
      if (error || !data) {
        console.error('Error fetching company by ID from database:', error);
        return getMockCompanyById(id.toString());
      }
      
      return transformDatabaseCompany(data);
    } catch (error) {
      console.error('Failed to fetch company by ID from database, falling back to mock data:', error);
      return getMockCompanyById(id.toString());
    }
  }
  
  return getMockCompanyById(id.toString());
}

/**
 * Get a company by slug
 * @param slug Company slug
 * @returns Company or null if not found
 */
export async function getCompanyBySlug(slug: string): Promise<CompanyType | null> {
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (!useDatabase) {
    // Use mock data
    return mockCompanies.find(company => company.slug === slug) || null;
  } else {
    // Load from Supabase
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error) {
        console.error(`Error fetching company ${slug} from Supabase:`, error);
        return null;
      }
      
      return transformDatabaseCompany(data);
    } catch (error) {
      console.error(`Error fetching company ${slug}:`, error);
      return null;
    }
  }
}

/**
 * Get companies by therapeutic area from database
 * @param therapeuticAreaId The therapeutic area ID
 * @returns Array of companies in the therapeutic area
 */
export async function getCompaniesByTherapeuticAreaFromDatabase(therapeuticAreaId: string): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('company_therapeutic_areas')
      .select('company_id')
      .eq('therapeutic_area_id', therapeuticAreaId);
      
    if (error) {
      console.error(`Error fetching companies for therapeutic area ${therapeuticAreaId}:`, error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const companyIds = data.map((item: { company_id: number }) => item.company_id);
    
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .in('id', companyIds)
      .order('name');
      
    if (companiesError) {
      console.error(`Error fetching companies by IDs:`, companiesError);
      return [];
    }
    
    return companies || [];
  } catch (error) {
    console.error(`Error in getCompaniesByTherapeuticAreaFromDatabase:`, error);
    return [];
  }
}

/**
 * Get companies by therapeutic area from JSON mock data
 * @param therapeuticAreaId The therapeutic area ID
 * @returns Array of companies in the therapeutic area
 */
export function getCompaniesByTherapeuticAreaFromJson(therapeuticAreaId: string): any[] {
  return mockCompanies.filter((company: any) => 
    company.therapeutic_areas && 
    Array.isArray(company.therapeutic_areas) && 
    company.therapeutic_areas.includes(therapeuticAreaId)
  );
}

/**
 * Get company financials from database
 * @param stockSymbol The company stock symbol
 * @returns Company financials data
 */
export async function getCompanyFinancialsFromDatabase(stockSymbol: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('company_financials')
      .select('*')
      .eq('stock_symbol', stockSymbol)
      .order('period_end_date', { ascending: false })
      .limit(4);
      
    if (error) {
      console.error(`Error fetching financials for ${stockSymbol}:`, error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error in getCompanyFinancialsFromDatabase:`, error);
    return null;
  }
}

/**
 * Get company financials from JSON mock data
 * @param stockSymbol The company stock symbol
 * @returns Company financials data
 */
export function getCompanyFinancialsFromJson(stockSymbol: string): any {
  return companyFinancialsData[stockSymbol as keyof typeof companyFinancialsData] || null;
}

/**
 * Get company stock data from database
 * @param stockSymbol The company stock symbol
 * @returns Company stock data
 */
export async function getCompanyStockDataFromDatabase(stockSymbol: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('company_stock_data')
      .select('*')
      .eq('stock_symbol', stockSymbol)
      .order('date', { ascending: false })
      .limit(30);
      
    if (error) {
      console.error(`Error fetching stock data for ${stockSymbol}:`, error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error in getCompanyStockDataFromDatabase:`, error);
    return null;
  }
}

/**
 * Get company stock data from JSON mock data
 * @param stockSymbol The company stock symbol
 * @returns Company stock data
 */
export function getCompanyStockDataFromJson(stockSymbol: string): any {
  return companyStockData[stockSymbol as keyof typeof companyStockData] || null;
}

/**
 * Get company metrics from database
 * @param stockSymbol The company stock symbol
 * @returns Company metrics data
 */
export async function getCompanyMetricsFromDatabase(stockSymbol: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('company_metrics')
      .select('*')
      .eq('stock_symbol', stockSymbol)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error(`Error fetching metrics for ${stockSymbol}:`, error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error(`Error in getCompanyMetricsFromDatabase:`, error);
    return null;
  }
}

/**
 * Get company metrics from JSON mock data
 * @param stockSymbol The company stock symbol
 * @returns Company metrics data
 */
export function getCompanyMetricsFromJson(stockSymbol: string): any {
  return companyMetricsData[stockSymbol as keyof typeof companyMetricsData] || null;
}

/**
 * Get related companies for a specific company
 * @param companyId - ID of the company to get related companies for
 * @returns Array of related companies with relationship information
 */
export async function getRelatedCompanies(companyId: string) {
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    try {
      // This is a simplified implementation - in a real app, you'd have a proper relationship table
      // For now, we'll fall back to the mock data for related companies
      const company = await getCompanyById(companyId);
      if (!company || !company.relatedCompanies) return [];
      
      const relatedCompanyIds = company.relatedCompanies.map((relation: any) => relation.id);
      const relatedCompaniesData = await Promise.all(
        relatedCompanyIds.map((id: string) => getCompanyById(id))
      );
      
      return relatedCompaniesData
        .filter(Boolean)
        .map((relatedCompany, index) => ({
          ...relatedCompany,
          relationship: company.relatedCompanies[index].relationship
        }));
    } catch (error) {
      console.error(`Error fetching related companies for ${companyId}:`, error);
      return [];
    }
  } else {
    // Use mock data
    const mockCompany = getMockCompanyById(companyId);
    if (!mockCompany || !mockCompany.relatedCompanies) return [];
    
    return mockCompany.relatedCompanies
      .map((relation: any) => ({
        ...getMockCompanyById(relation.id),
        relationship: relation.relationship
      }))
      .filter(Boolean);
  }
} 