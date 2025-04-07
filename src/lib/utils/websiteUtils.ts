/**
 * Website Data Utilities
 * 
 * This module provides functions to fetch and manipulate website data from Supabase.
 * It centralizes data access logic to improve maintainability and testing.
 */

import { supabase } from '../supabase';
import type { Website, Company, TherapeuticArea, Product } from '../../interfaces/entities';
import { dbWebsiteToWebsite } from '../../interfaces/entities/Website';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';

/**
 * Options for filtering and sorting website data
 */
export interface WebsiteFilter {
  search?: string;
  companyIds?: string[];
  therapeuticAreaIds?: string[];
  websiteTypes?: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Interface for filter options with count
 */
export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * Helper function to create a URL-safe slug from a string
 */
export function generateSlugFallback(input: string): string {
  if (!input) return '';
  return input.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
}

/**
 * Fetches websites from the database with optional filtering and sorting
 * 
 * @param options Filtering and sorting options
 * @returns Object containing websites array and total count
 */
export async function getWebsites(options: WebsiteFilter = {}): Promise<{
  websites: Website[];
  totalCount: number;
}> {
  try {
    // Start building the query
    let query = supabase.from('websites').select('*', { count: 'exact' });
    
    // Apply search filter if provided
    if (options.search) {
      query = query.or(`domain.ilike.%${options.search}%,title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    
    // Apply company filter if provided
    if (options.companyIds && options.companyIds.length > 0) {
      query = query.in('company_id', options.companyIds);
    }
    
    // Apply website type filter if provided
    if (options.websiteTypes && options.websiteTypes.length > 0) {
      query = query.in('website_type', options.websiteTypes);
    }
    
    // Apply sorting
    if (options.sortBy) {
      const field = (() => {
        if (options.sortBy === 'domain') return 'domain';
        if (options.sortBy === 'title') return 'title';
        if (options.sortBy === 'date') return 'created_at';
        return 'domain'; // Default sort field
      })();
      
      query = query.order(field, { 
        ascending: options.sortDirection !== 'desc' 
      });
    }
    
    // Apply pagination if provided
    if (options.limit !== undefined) {
      query = query.range(
        options.offset || 0, 
        (options.offset || 0) + options.limit - 1
      );
    }
    
    // Execute the query
    const { data: dbWebsites, count, error } = await query;
    
    if (error) {
      console.error('Error fetching websites:', error);
      throw error;
    }
    
    // Convert database records to application entities
    let websites = (dbWebsites || []).map(dbWebsiteToWebsite);
    
    // Handle therapeutic area filtering separately if needed
    if (options.therapeuticAreaIds && options.therapeuticAreaIds.length > 0) {
      // Get all companies in the selected therapeutic areas
      const { data: companyTAs, error: ctaError } = await supabase
        .from('company_therapeutic_areas')
        .select('company_id')
        .in('therapeutic_area_id', options.therapeuticAreaIds);
        
      if (ctaError) {
        console.error('Error fetching company-therapeutic area relations:', ctaError);
        throw ctaError;
      }
      
      // Get unique company IDs that have the selected therapeutic areas
      const companyIds = [...new Set((companyTAs || []).map(cta => cta.company_id))];
      
      // Filter websites by those company IDs
      websites = websites.filter(website => 
        website.companyId && companyIds.includes(website.companyId)
      );
      
      // Adjust total count for therapeutic area filtering
      // This is an approximation since we filtered post-query
      const totalFiltered = websites.length;
      return { websites, totalCount: totalFiltered };
    }
    
    return { websites, totalCount: count || 0 };
  } catch (error) {
    console.error('Error in getWebsites:', error);
    throw error;
  }
}

/**
 * Fetches a single website by its slug
 * 
 * @param slug The website slug
 * @returns The website if found, null otherwise
 */
export async function getWebsiteBySlug(slug: string): Promise<Website | null> {
  try {
    // Try by slug first
    let response = await supabase
      .from('websites')
      .select('*')
      .eq('slug', slug)
      .single();
    
    // If not found by slug, try by ID (in case the slug is actually an ID)
    if (response.error || !response.data) {
      response = await supabase
        .from('websites')
        .select('*')
        .eq('id', slug)
        .single();
    }
    
    // Handle not found case
    if (response.error || !response.data) {
      if (response.error?.code === 'PGRST116') {
        return null; // Not found
      }
      console.error(`Error fetching website with slug "${slug}":`, response.error);
      throw response.error;
    }
    
    return dbWebsiteToWebsite(response.data);
  } catch (error) {
    console.error(`Error in getWebsiteBySlug for slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Fetches the owning company for a website
 * 
 * @param companyId The company ID
 * @returns The owning company or null if not found
 */
export async function getWebsiteCompany(companyId: string | null): Promise<Company | null> {
  if (!companyId) return null;
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    if (error || !data) {
      if (error?.code === 'PGRST116') {
        return null; // Not found
      }
      console.error(`Error fetching company for website (company ID: ${companyId}):`, error);
      throw error;
    }
    
    return dbCompanyToCompany(data);
  } catch (error) {
    console.error(`Error in getWebsiteCompany for companyId "${companyId}":`, error);
    throw error;
  }
}

/**
 * Fetches products associated with a website
 * 
 * @param websiteId The website ID
 * @returns Array of associated products
 */
export async function getWebsiteProducts(websiteId: string): Promise<Product[]> {
  try {
    // Get product IDs associated with this website
    const { data: websiteProductRelations, error: relError } = await supabase
      .from('product_websites')
      .select('product_id')
      .eq('website_id', websiteId);
    
    if (relError) {
      console.error(`Error fetching product relations for website ${websiteId}:`, relError);
      throw relError;
    }
    
    if (!websiteProductRelations?.length) {
      return [];
    }
    
    // Get the product details
    const productIds = websiteProductRelations.map(rel => rel.product_id);
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productError) {
      console.error('Error fetching product details:', productError);
      throw productError;
    }
    
    return (products || []).map(dbProductToProduct);
  } catch (error) {
    console.error(`Error in getWebsiteProducts for website ${websiteId}:`, error);
    throw error;
  }
}

/**
 * Fetches therapeutic areas for a website's company
 * 
 * @param companyId The company ID
 * @returns Array of therapeutic areas
 */
export async function getWebsiteTherapeuticAreas(companyId: string | null): Promise<TherapeuticArea[]> {
  if (!companyId) return [];
  
  try {
    // Get therapeutic area IDs for this company
    const { data: companyTARelations, error: relError } = await supabase
      .from('company_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('company_id', companyId);
    
    if (relError) {
      console.error(`Error fetching therapeutic area relations for company ${companyId}:`, relError);
      throw relError;
    }
    
    if (!companyTARelations?.length) {
      return [];
    }
    
    // Get the therapeutic area details
    const taIds = companyTARelations.map(rel => rel.therapeutic_area_id);
    const { data: therapeuticAreas, error: taError } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .in('id', taIds);
    
    if (taError) {
      console.error('Error fetching therapeutic area details:', taError);
      throw taError;
    }
    
    return (therapeuticAreas || []).map(dbTherapeuticAreaToTherapeuticArea);
  } catch (error) {
    console.error(`Error in getWebsiteTherapeuticAreas for company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Fetches similar websites based on company, category, or both
 * 
 * @param websiteId The current website ID
 * @param companyId The company ID for finding related websites
 * @param categoryId The category ID for finding related websites
 * @param limit Maximum number of related websites to return
 * @returns Array of related websites
 */
export async function getRelatedWebsites(
  websiteId: string, 
  companyId?: string | null, 
  categoryId?: number | null, 
  limit: number = 5
): Promise<Website[]> {
  try {
    let query = supabase.from('websites').select('*');
    
    // Don't include the current website
    query = query.neq('id', websiteId);
    
    // Add filters if provided
    let hasFilter = false;
    
    if (companyId) {
      query = query.eq('company_id', companyId);
      hasFilter = true;
    }
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
      hasFilter = true;
    }
    
    // If no filters were applied, return an empty array
    if (!hasFilter) {
      return [];
    }
    
    // Limit results
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related websites:', error);
      throw error;
    }
    
    return (data || []).map(dbWebsiteToWebsite);
  } catch (error) {
    console.error(`Error in getRelatedWebsites for website ${websiteId}:`, error);
    throw error;
  }
}

/**
 * Gets filter options for websites
 * 
 * @returns Filter options for websites
 */
export async function getWebsiteFilters(): Promise<{
  companies: { id: string|number; name: string; count: number }[];
  therapeuticAreas: { id: string|number; name: string; count: number }[];
  websiteTypes: { id: string; name: string; count: number }[];
  sortOptions: { value: string; label: string }[];
}> {
  try {
    // Fetch companies data for dropdown
    const { data: dbCompanies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .order('name');
    
    if (companiesError) {
      console.error('Error fetching companies for filters:', companiesError);
      throw companiesError;
    }
    
    // Get website counts by company (for displaying counts)
    const { data: companyWebsiteCounts, error: countError } = await supabase
      .from('websites')
      .select(`
        company_id,
        count:count(*)
      `, { count: 'exact', head: false });
      
    if (countError) {
      console.error('Error getting website counts by company:', countError);
    }
    
    // Create a map of company ID to count
    const companyCountMap = new Map<string, number>();
    (companyWebsiteCounts || []).forEach((item: any) => {
      if (item && item.company_id) {
        companyCountMap.set(item.company_id, parseInt(item.count));
      }
    });
    
    // Create company options for filtering
    const companies = (dbCompanies || []).map(company => ({
      id: company.id,
      name: company.name,
      count: companyCountMap.get(company.id) || 0
    }));
    
    // Fetch therapeutic areas for filtering
    const { data: dbTherapeuticAreas, error: taError } = await supabase
      .from('therapeutic_areas')
      .select('id, name')
      .order('name');
    
    if (taError) {
      console.error('Error fetching therapeutic areas for filters:', taError);
      throw taError;
    }
    
    // Get website counts by therapeutic area (via company_therapeutic_areas)
    const { data: taWebsiteCounts, error: taCountError } = await supabase
      .from('therapeutic_areas')
      .select('id, name, company_therapeutic_areas(company_id)')
      .order('name');
      
    if (taCountError) {
      console.error('Error getting website counts by therapeutic area:', taCountError);
    }
    
    // Create therapeutic areas options for filtering
    const therapeuticAreas = (dbTherapeuticAreas || []).map(ta => {
      // Count for each therapeutic area estimated from associated companies
      const taItem = taWebsiteCounts?.find(item => item.id === ta.id);
      const count = taItem?.company_therapeutic_areas?.length || 0;
      
      return {
        id: ta.id,
        name: ta.name,
        count: count
      };
    });
    
    // Define website types with counts
    const { data: typeCountsData, error: typeCountsError } = await supabase
      .from('websites')
      .select(`
        website_type,
        count:count(*)
      `, { count: 'exact', head: false });
      
    if (typeCountsError) {
      console.error('Error getting website counts by type:', typeCountsError);
    }
    
    // Create a map of type to count - explicitly type the items
    const typeCountMap = new Map<string, number>();
    (typeCountsData || []).forEach((item: any) => {
      if (item.website_type) {
        typeCountMap.set(item.website_type, parseInt(item.count));
      }
    });
    
    // Define website types for filtering
    const websiteTypes = [
      { id: 'corporate', name: 'Corporate', count: typeCountMap.get('corporate') || 0 },
      { id: 'product', name: 'Product', count: typeCountMap.get('product') || 0 },
      { id: 'research', name: 'Research', count: typeCountMap.get('research') || 0 },
      { id: 'disease', name: 'Disease Awareness', count: typeCountMap.get('disease') || 0 },
      { id: 'patient', name: 'Patient Support', count: typeCountMap.get('patient') || 0 },
      { id: 'hcp', name: 'Healthcare Professional', count: typeCountMap.get('hcp') || 0 },
      { id: 'campaign', name: 'Campaign', count: typeCountMap.get('campaign') || 0 },
      { id: 'news', name: 'News', count: typeCountMap.get('news') || 0 },
      { id: 'other', name: 'Other', count: typeCountMap.get('other') || 0 }
    ];
    
    // Define sort options
    const sortOptions = [
      { value: 'domain_asc', label: 'Domain (A to Z)' },
      { value: 'domain_desc', label: 'Domain (Z to A)' },
      { value: 'title_asc', label: 'Title (A to Z)' },
      { value: 'title_desc', label: 'Title (Z to A)' },
      { value: 'date_desc', label: 'Newest First' },
      { value: 'date_asc', label: 'Oldest First' }
    ];
    
    return {
      companies,
      therapeuticAreas,
      websiteTypes,
      sortOptions
    };
  } catch (error) {
    console.error('Error in getWebsiteFilters:', error);
    throw error;
  }
} 