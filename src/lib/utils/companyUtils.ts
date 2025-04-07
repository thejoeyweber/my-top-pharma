/**
 * Company Data Utilities
 * 
 * This module provides functions to fetch and manipulate company data from Supabase.
 * It centralizes data access logic to improve maintainability and testing.
 */

import { supabase } from '../supabase';
import type { Company } from '../../interfaces/entities/Company';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';

/**
 * Options for filtering and sorting company data
 */
export interface CompanyFilter {
  filterText?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  therapeuticAreaIds?: string[];
}

/**
 * Fetches companies from the database with optional filtering and sorting
 * 
 * @param options Filtering and sorting options
 * @returns Array of companies matching the criteria
 */
export async function getCompanies(options: CompanyFilter = {}): Promise<Company[]> {
  try {
    let query = supabase.from('companies').select('*');
    
    // Apply text filter if provided
    if (options.filterText) {
      query = query.ilike('name', `%${options.filterText}%`);
    }
    
    // Apply sorting if provided
    if (options.sortBy) {
      // Convert camelCase sortBy to snake_case for database column names
      const dbField = options.sortBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      query = query.order(dbField, { 
        ascending: options.sortDirection !== 'desc' 
      });
    }
    
    // Apply pagination if provided
    if (options.limit !== undefined) {
      query = query.limit(options.limit);
      
      if (options.offset !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
    
    // Map database records to application entities
    const companies = data ? data.map(dbCompanyToCompany) : [];
    
    // If therapeutic area filtering is needed, handle it separately
    // This would require an additional query, as it's a many-to-many relationship
    if (options.therapeuticAreaIds?.length) {
      // Get company IDs that have the specified therapeutic areas
      const { data: companyTAs, error: taError } = await supabase
        .from('company_therapeutic_areas')
        .select('company_id')
        .in('therapeutic_area_id', options.therapeuticAreaIds);
      
      if (taError) {
        console.error('Error fetching company-therapeutic area relations:', taError);
        throw taError;
      }
      
      // Get unique company IDs
      const companyIds = [...new Set((companyTAs || []).map(cta => cta.company_id))];
      
      // Filter companies by those IDs
      return companies.filter(company => companyIds.includes(company.id));
    }
    
    return companies;
  } catch (error) {
    console.error('Error in getCompanies:', error);
    throw error;
  }
}

/**
 * Fetches a single company by its slug
 * 
 * @param slug The company slug
 * @returns The company if found, null otherwise
 */
export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error(`Error fetching company with slug "${slug}":`, error);
      throw error;
    }
    
    return data ? dbCompanyToCompany(data) : null;
  } catch (error) {
    console.error(`Error in getCompanyBySlug for slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Fetches therapeutic areas for a company
 * 
 * @param companyId The company ID
 * @returns Array of therapeutic area names
 */
export async function getCompanyTherapeuticAreas(companyId: string): Promise<string[]> {
  try {
    // Get the therapeutic area IDs for this company
    const { data: companyTAs, error: ctaError } = await supabase
      .from('company_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('company_id', companyId);
    
    if (ctaError) {
      console.error(`Error fetching therapeutic areas for company ${companyId}:`, ctaError);
      throw ctaError;
    }
    
    if (!companyTAs?.length) {
      return [];
    }
    
    // Get the therapeutic area names
    const taIds = companyTAs.map(cta => cta.therapeutic_area_id);
    const { data: taData, error: taError } = await supabase
      .from('therapeutic_areas')
      .select('name')
      .in('id', taIds);
    
    if (taError) {
      console.error('Error fetching therapeutic area names:', taError);
      throw taError;
    }
    
    return taData ? taData.map(ta => ta.name) : [];
  } catch (error) {
    console.error(`Error in getCompanyTherapeuticAreas for company ${companyId}:`, error);
    throw error;
  }
} 