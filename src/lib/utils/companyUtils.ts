/**
 * Company Data Utilities
 * 
 * This module provides functions to fetch and manipulate company data from Supabase.
 * It centralizes data access logic to improve maintainability and testing.
 */

import { supabase } from '../supabase';
import type { Company, CompanyFilter, CompanyWithTAs, CompanyListResponse } from '../../interfaces/entities/Company';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';
import { DEFAULT_LIMIT } from '../constants';
import { getSlug } from './stringUtils';

/**
 * Options for filtering and sorting company data
 */
export interface CompanyFilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * Type for company filter options
 */
export interface CompanyFilterOptions {
  regions: CompanyFilterOption[];
  therapeuticAreas: Array<{ id: string; name: string }>;
  sortOptions: CompanyFilterOption[];
  marketCapRange: {
    min: number;
    max: number;
  };
}

/**
 * Fetches companies from the database with filtering, sorting and pagination
 * 
 * @param filter - Filtering options
 * @param sortParam - Sort parameter in format "field_direction"
 * @param page - Page number for pagination
 * @param pageSize - Number of results per page
 * @returns Promise with companies and total count
 */
export async function getCompanies(options: CompanyFilter = {}): Promise<CompanyListResponse> {
  try {
    const {
      search,
      regions,
      therapeuticAreaIds,
      minMarketCap,
      maxMarketCap,
      sortBy = 'name',
      sortDirection = 'asc',
      limit = DEFAULT_LIMIT,
      offset = 0
    } = options;

    // Create the base query
    let query = supabase
      .from('companies')
      .select('*', { head: false, count: 'exact' });
    
    let hasFilters = false;
    
    // Apply search filter if provided
    if (search) {
      query = query.ilike('name', `%${search}%`);
      hasFilters = true;
    }
    
    // Apply region filter if provided
    if (regions && regions.length > 0) {
      const regionFilters = regions.map((region: string) => {
        return `headquarters.ilike.%${region}%`;
      }).join(',');
      query = query.or(regionFilters);
      hasFilters = true;
    }
    
    // Apply market cap filters if provided
    if (minMarketCap !== undefined && minMarketCap > 0) {
      query = query.gte('market_cap', minMarketCap);
      hasFilters = true;
    }
    
    if (maxMarketCap !== undefined && maxMarketCap < 2000) {
      query = query.lte('market_cap', maxMarketCap);
      hasFilters = true;
    }

    // Apply therapeutic area filter if provided
    if (therapeuticAreaIds && therapeuticAreaIds.length > 0) {
      hasFilters = true;
      
      // This is more complex as we need to filter by a related table
      // We'll get the company IDs that have the specified therapeutic areas
      const { data: companyTaData, error: taError } = await supabase
        .from('company_therapeutic_areas')
        .select('company_id')
        .in('therapeutic_area_id', therapeuticAreaIds);
      
      if (taError) {
        throw taError;
      }
      
      if (companyTaData && companyTaData.length > 0) {
        const companyIds = [...new Set(companyTaData.map(item => item.company_id))];
        query = query.in('id', companyIds);
      } else if (hasFilters) {
        // Only return empty if we're actually filtering by TAs
        // No companies match the TA filter, return empty
        return { companies: [], total: 0 };
      }
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortDirection === 'asc' });
    
    // Apply pagination
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }
    
    // Execute the query
    const { data, count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // If no data returned but also no filters applied, this might be a database issue
    if (!data || data.length === 0) {
      // Try a direct, simple query as a fallback
      if (!hasFilters) {
        const { data: fallbackData, count: fallbackCount } = await supabase
          .from('companies')
          .select('*', { count: 'exact' })
          .limit(limit)
          .range(offset, offset + limit - 1);
          
        if (fallbackData && fallbackData.length > 0) {
          const baseCompanies = fallbackData.map(company => dbCompanyToCompany(company));
          return {
            companies: baseCompanies,
            total: fallbackCount || baseCompanies.length
          };
        }
      }
    }
    
    // Convert base company data
    const baseCompanies = (data || []).map(company => dbCompanyToCompany(company));
    
    // Fetch therapeutic areas for each company
    const companies = await Promise.all(
      baseCompanies.map(async (company) => {
        try {
          // Get the therapeutic area IDs for this company
          const { data: taLinks, error: taLinksError } = await supabase
            .from('company_therapeutic_areas')
            .select('therapeutic_area_id')
            .eq('company_id', company.id);
          
          if (taLinksError) {
            throw taLinksError;
          }
          
          if (taLinks && taLinks.length > 0) {
            // Get the therapeutic area names
            const taIds = taLinks.map(link => link.therapeutic_area_id);
            const { data: tas, error: tasError } = await supabase
              .from('therapeutic_areas')
              .select('name')
              .in('id', taIds);
            
            if (tasError) {
              throw tasError;
            }
            
            // Add therapeutic areas to the company
            company.therapeuticAreas = (tas || []).map(ta => ta.name);
          } else {
            company.therapeuticAreas = [];
          }
          
          return company;
        } catch (error) {
          console.error(`Error fetching therapeutic areas for company ${company.id}:`, error);
          company.therapeuticAreas = [];
          return company;
        }
      })
    );
    
    return { 
      companies, 
      total: count || 0 
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}

/**
 * Fetches available filter options for companies
 * 
 * @returns Object containing filter options for regions and therapeutic areas
 */
export async function getCompanyFilters(): Promise<CompanyFilterOptions> {
  try {
    // Get unique regions from companies
    const { data: regionsData, error: regionsError } = await supabase
      .from('companies')
      .select('headquarters');
    
    if (regionsError) {
      throw regionsError;
    }
    
    // Extract all regions from the headquarters field
    const allRegions = regionsData
      ?.filter(company => company.headquarters)
      .map(company => {
        // Parse the headquarters string to extract the region (after the comma)
        const parts = company.headquarters ? company.headquarters.split(',') : [];
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
      }) || [];
    
    // Filter out duplicates
    const uniqueRegions = [...new Set(allRegions)].sort();
    
    // Get all therapeutic areas
    const { data: therapeuticAreas, error: tasError } = await supabase
      .from('therapeutic_areas')
      .select('id, name')
      .order('name');
    
    if (tasError) {
      throw tasError;
    }
    
    // Get market cap range
    const { data: marketCapData, error: mcError } = await supabase
      .from('companies')
      .select('market_cap')
      .order('market_cap', { ascending: true });
    
    if (mcError) {
      throw mcError;
    }
    
    const marketCapValues = marketCapData
      ?.filter(item => item.market_cap !== null)
      .map(item => typeof item.market_cap === 'number' ? item.market_cap : 0) || [];
    
    const minMarketCap = marketCapValues.length > 0 ? Math.min(...marketCapValues) : 0;
    const maxMarketCap = marketCapValues.length > 0 ? Math.max(...marketCapValues) : 1000;
    
    return {
      regions: uniqueRegions.map(region => ({
        value: region,
        label: region.charAt(0).toUpperCase() + region.slice(1).replace('-', ' '),
        count: 0
      })),
      therapeuticAreas: therapeuticAreas || [],
      sortOptions: [
        { value: 'name_asc', label: 'Name (A to Z)', count: 0 },
        { value: 'name_desc', label: 'Name (Z to A)', count: 0 },
        { value: 'market_cap_desc', label: 'Market Cap (High to Low)', count: 0 },
        { value: 'market_cap_asc', label: 'Market Cap (Low to High)', count: 0 },
        { value: 'founded_desc', label: 'Founded (Newest First)', count: 0 },
        { value: 'founded_asc', label: 'Founded (Oldest First)', count: 0 }
      ],
      marketCapRange: {
        min: minMarketCap,
        max: maxMarketCap
      }
    };
  } catch (error) {
    console.error('Error fetching company filters:', error);
    throw error;
  }
}

/**
 * Fetches a single company by its slug
 * 
 * @param slug The company slug
 * @returns The company if found, null otherwise
 */
export async function getCompanyBySlug(slug: string): Promise<CompanyWithTAs | null> {
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
    
    if (!data) {
      return null;
    }
    
    // Get the therapeutic areas for this company
    const therapeuticAreas = await getCompanyTherapeuticAreas(data.id);
    
    // Map to our Company interface
    const company: CompanyWithTAs = {
      id: data.id,
      name: data.name,
      slug: data.slug || '',
      description: data.description || '',
      logoUrl: data.logo_url || '',
      marketCap: data.market_cap || 0,
      headquarters: data.headquarters || '',
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',
      therapeuticAreas
    };
    
    return company;
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
    const { data: taLinks, error: taLinksError } = await supabase
      .from('company_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('company_id', companyId);
    
    if (taLinksError) {
      throw taLinksError;
    }
    
    if (!taLinks || taLinks.length === 0) {
      return [];
    }
    
    // Get the therapeutic area names
    const taIds = taLinks.map(link => link.therapeutic_area_id);
    const { data: tas, error: tasError } = await supabase
      .from('therapeutic_areas')
      .select('name')
      .in('id', taIds);
    
    if (tasError) {
      throw tasError;
    }
    
    return (tas || []).map(ta => ta.name);
  } catch (error) {
    console.error(`Error fetching therapeutic areas for company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Creates a new company
 * @param company - The company data
 * @returns The created company
 */
export async function createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
  try {
    // Generate a slug if not provided
    const slug = company.slug || getSlug(company.name);
    
    const { data, error } = await supabase
      .from('companies')
      .insert([
        {
          name: company.name,
          slug,
          description: company.description,
          logo_url: company.logoUrl,
          market_cap: company.marketCap,
          headquarters: company.headquarters
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map to our Company interface
    return {
      id: data.id,
      name: data.name,
      slug: data.slug || '',
      description: data.description || '',
      logoUrl: data.logo_url || '',
      marketCap: data.market_cap || 0,
      headquarters: data.headquarters || '',
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || ''
    };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

/**
 * Updates an existing company
 * @param id - The company ID
 * @param company - The updated company data
 * @returns The updated company
 */
export async function updateCompany(
  id: string, 
  company: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Company> {
  try {
    // Generate a slug if name is changing and slug not provided
    const slug = company.name && !company.slug 
      ? getSlug(company.name) 
      : company.slug;
    
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...(company.name && { name: company.name }),
        ...(slug && { slug }),
        ...(company.description !== undefined && { description: company.description }),
        ...(company.logoUrl !== undefined && { logo_url: company.logoUrl }),
        ...(company.marketCap !== undefined && { market_cap: company.marketCap }),
        ...(company.headquarters !== undefined && { headquarters: company.headquarters })
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map to our Company interface
    return {
      id: data.id,
      name: data.name,
      slug: data.slug || '',
      description: data.description || '',
      logoUrl: data.logo_url || '',
      marketCap: data.market_cap || 0,
      headquarters: data.headquarters || '',
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || ''
    };
  } catch (error) {
    console.error(`Error updating company ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a company by ID
 * @param id - The company ID
 * @returns Success indicator
 */
export async function deleteCompany(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting company ${id}:`, error);
    throw error;
  }
} 