/**
 * Company Data Utilities
 * 
 * Adapter functions to fetch company data from either mock JSON or database
 * based on feature flags, following the phased migration strategy.
 */
import type { Company } from '../types/companies';
import { companies as mockCompanies } from './dataUtils';
import { supabase } from './supabase';
import { getFeatureFlag, FEATURES } from './featureFlags';

/**
 * Transform a database company record to match the expected Company type shape
 */
function transformDatabaseCompany(dbCompany: any): Company {
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
 * Get company data from either mock JSON or database based on feature flag
 */
export async function getCompanies(useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES)): Promise<Company[]> {
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
 */
export async function getCompanyById(
  id: string, 
  useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES)
): Promise<Company | null> {
  if (useDatabase) {
    try {
      // Try finding by ID first
      let { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      // If not found by ID, try by slug
      if (!data && !error) {
        ({ data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', id)
          .single());
      }
      
      // If still not found, try by ticker
      if (!data && !error) {
        ({ data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('ticker', id)
          .single());
      }
      
      if (error || !data) {
        console.error('Error fetching company by ID from database:', error);
        return getMockCompanyById(id);
      }
      
      return transformDatabaseCompany(data);
    } catch (error) {
      console.error('Failed to fetch company by ID from database, falling back to mock data:', error);
      return getMockCompanyById(id);
    }
  }
  
  return getMockCompanyById(id);
}

/**
 * Get mock companies data
 */
function getMockCompanies(): Company[] {
  return mockCompanies;
}

/**
 * Get a specific mock company by ID
 */
function getMockCompanyById(id: string): Company | null {
  return mockCompanies.find(company => 
    company.id === id || 
    // @ts-ignore - Ignore the slug property which might not be in the type but exists in the data
    company.slug === id || 
    company.stockSymbol?.toLowerCase() === id.toLowerCase()
  ) || null;
} 