/**
 * Database Utilities
 * 
 * Adapter functions to fetch data from Supabase as part of the 
 * phased migration from static JSON data to database-driven content.
 */

import { supabase } from './supabase';
import type { Company, TherapeuticArea } from '../types/companies';
import { getFeatureFlag } from './featureFlags';

/**
 * Transform a database company record to match the structure expected by templates
 * @param dbCompany Company record from database
 * @returns Transformed company object matching the expected shape
 */
export function transformDatabaseCompany(dbCompany: any): Company | null {
  // For empty/null records
  if (!dbCompany) return null;
  
  // Basic transformation mapping DB fields to expected structure
  // We need to ensure all fields expected by the templates are present
  return {
    id: dbCompany.slug || dbCompany.id, // Use slug as ID to match existing routes
    name: dbCompany.name,
    description: dbCompany.description || '',
    logoUrl: dbCompany.logo_url || '/placeholder-logo.png',
    headerImageUrl: dbCompany.header_image_url || '/images/headers/default-header.jpg',
    headquarters: dbCompany.headquarters || 'Unknown',
    founded: dbCompany.founded_year?.toString() || 'Unknown',
    website: dbCompany.website || '',
    marketCap: typeof dbCompany.market_cap === 'number' ? dbCompany.market_cap / 1000000000 : 0, // Convert to billions
    employees: dbCompany.employee_count || 0,
    stockSymbol: dbCompany.stock_symbol || '',
    stockExchange: dbCompany.stock_exchange || '',
    therapeuticAreas: dbCompany.therapeutic_areas || [],
    products: [], // We'll need a separate query for these
    relatedCompanies: [], // We'll need a separate query for these
    milestones: [], // We'll need a separate query for these
    financials: [] // We'll need a separate query for these
  };
}

/**
 * Get all companies from the database
 * @param useDatabase Whether to use database (true) or mock data (false)
 * @returns Array of companies
 */
export async function getDatabaseCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching companies from database:', error);
      return [];
    }
    
    return data.map(transformDatabaseCompany);
  } catch (error) {
    console.error('Failed to fetch companies from database:', error);
    return [];
  }
}

/**
 * Get a company by ID or slug from the database
 * @param idOrSlug Company ID or slug
 * @returns Company object or null if not found
 */
export async function getDatabaseCompanyById(idOrSlug: string): Promise<Company | null> {
  try {
    // Try to find by slug first (our primary identifier)
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', idOrSlug)
      .single();
      
    if (!error && data) {
      return transformDatabaseCompany(data);
    }
    
    // If not found by slug, try by ID
    const { data: dataById, error: errorById } = await supabase
      .from('companies')
      .select('*')
      .eq('id', idOrSlug)
      .single();
      
    if (errorById) {
      console.error(`Error fetching company ${idOrSlug} from database:`, errorById);
      return null;
    }
    
    return transformDatabaseCompany(dataById);
  } catch (error) {
    console.error(`Failed to fetch company ${idOrSlug} from database:`, error);
    return null;
  }
}

/**
 * Get companies related to a specific therapeutic area
 * @param therapeuticArea Therapeutic area ID
 * @returns Array of companies in that therapeutic area
 */
export async function getDatabaseCompaniesByTherapeuticArea(therapeuticArea: string): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .contains('therapeutic_areas', [therapeuticArea])
      .order('name');
      
    if (error) {
      console.error(`Error fetching companies for therapeutic area ${therapeuticArea}:`, error);
      return [];
    }
    
    return data.map(transformDatabaseCompany);
  } catch (error) {
    console.error(`Failed to fetch companies for therapeutic area ${therapeuticArea}:`, error);
    return [];
  }
}

/**
 * Get companies related to another company
 * @param companyId ID of the company to find relations for
 * @returns Array of related companies with relationship type
 */
export async function getDatabaseRelatedCompanies(companyId: string): Promise<any[]> {
  // This would require a proper relationship table in the database
  // For now, return an empty array as we haven't set up this schema yet
  return [];
} 