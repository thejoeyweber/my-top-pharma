/**
 * Therapeutic Area Data Utilities
 * 
 * This module provides functions to fetch and manipulate therapeutic area data from Supabase.
 * It centralizes data access logic to improve maintainability and testing.
 */

import { supabase } from '../supabase';
import type { TherapeuticArea, Product, Company } from '../../interfaces/entities';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';

/**
 * Options for filtering and sorting therapeutic area data
 */
export interface TherapeuticAreaFilter {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  minCompanies?: number;
  minProducts?: number;
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
 * Fetches therapeutic areas from the database with optional filtering and sorting
 * 
 * @param options Filtering and sorting options
 * @returns Array of therapeutic areas matching the criteria along with their stats
 */
export async function getTherapeuticAreas(options: TherapeuticAreaFilter = {}): Promise<{
  therapeuticAreas: (TherapeuticArea & { companyCount: number; productCount: number; websiteCount: number; })[];
  totalCount: number;
}> {
  try {
    // Start building the query
    let query = supabase
      .from('therapeutic_areas')
      .select('*', { count: 'exact' });
    
    // Apply search filter if provided
    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    
    // Apply sorting based on name 
    // (other sorts like company/product count will be applied after stats are calculated)
    if (options.sortBy === 'name') {
      query = query.order('name', { 
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
    const { data: dbTherapeuticAreas, count, error } = await query;
    
    if (error) {
      console.error('Error fetching therapeutic areas:', error);
      throw error;
    }
    
    // Convert database records to application entities
    const therapeuticAreas = (dbTherapeuticAreas || []).map(dbTherapeuticAreaToTherapeuticArea);
    
    // Fetch all company-therapeutic area relations for these areas
    const { data: allCompanyRelations, error: companyRelError } = await supabase
      .from('company_therapeutic_areas')
      .select('company_id, therapeutic_area_id');
    
    if (companyRelError) {
      console.error('Error fetching company-therapeutic area relations:', companyRelError);
      throw companyRelError;
    }
    
    // Fetch all product-therapeutic area relations for these areas
    const { data: allProductRelations, error: productRelError } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id, therapeutic_area_id');
    
    if (productRelError) {
      console.error('Error fetching product-therapeutic area relations:', productRelError);
      throw productRelError;
    }
    
    // Fetch all website-company relations to calculate website counts
    const { data: allWebsites, error: websiteError } = await supabase
      .from('websites')
      .select('id, company_id');
    
    if (websiteError) {
      console.error('Error fetching websites:', websiteError);
      throw websiteError;
    }
    
    // Group relations by therapeutic area
    const companyRelationsByTA = new Map<string, string[]>();
    const productRelationsByTA = new Map<string, string[]>();
    
    // Process company relations
    (allCompanyRelations || []).forEach(relation => {
      const taId = relation.therapeutic_area_id;
      const companyIds = companyRelationsByTA.get(taId) || [];
      companyRelationsByTA.set(taId, [...companyIds, relation.company_id]);
    });
    
    // Process product relations
    (allProductRelations || []).forEach(relation => {
      const taId = relation.therapeutic_area_id;
      const productIds = productRelationsByTA.get(taId) || [];
      productRelationsByTA.set(taId, [...productIds, relation.product_id]);
    });
    
    // Create a map of company IDs to website counts
    const websitesByCompany = new Map<string, number>();
    (allWebsites || []).forEach(website => {
      if (website.company_id) {
        const count = websitesByCompany.get(website.company_id) || 0;
        websitesByCompany.set(website.company_id, count + 1);
      }
    });
    
    // Calculate statistics for each therapeutic area
    const areasWithStats = therapeuticAreas.map(area => {
      // Get companies for this therapeutic area
      const companyIds = companyRelationsByTA.get(area.id) || [];
      const companyCount = companyIds.length;
      
      // Get products for this therapeutic area
      const productIds = productRelationsByTA.get(area.id) || [];
      const productCount = productIds.length;
      
      // Count websites associated with companies in this therapeutic area
      let websiteCount = 0;
      companyIds.forEach(companyId => {
        websiteCount += websitesByCompany.get(companyId) || 0;
      });
      
      return {
        ...area,
        companyCount,
        productCount,
        websiteCount
      };
    });
    
    // Apply filtering based on counts if needed
    let filteredAreaStats = areasWithStats;
    if (options.minCompanies && options.minCompanies > 0) {
      filteredAreaStats = filteredAreaStats.filter(stats => stats.companyCount >= options.minCompanies!);
    }
    if (options.minProducts && options.minProducts > 0) {
      filteredAreaStats = filteredAreaStats.filter(stats => stats.productCount >= options.minProducts!);
    }
    
    // Apply sorting for non-name fields
    if (options.sortBy && options.sortBy !== 'name') {
      filteredAreaStats.sort((a, b) => {
        let comparison = 0;
        
        if (options.sortBy === 'companies') {
          comparison = a.companyCount - b.companyCount;
        } else if (options.sortBy === 'products') {
          comparison = a.productCount - b.productCount;
        } else if (options.sortBy === 'websites') {
          comparison = a.websiteCount - b.websiteCount;
        }
        
        return options.sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return { 
      therapeuticAreas: filteredAreaStats,
      totalCount: count || 0
    };
  } catch (error) {
    console.error('Error in getTherapeuticAreas:', error);
    throw error;
  }
}

/**
 * Fetches a single therapeutic area by its slug
 * 
 * @param slug The therapeutic area slug
 * @returns The therapeutic area if found, null otherwise
 */
export async function getTherapeuticAreaBySlug(slug: string): Promise<TherapeuticArea | null> {
  try {
    let response = await supabase
      .from('therapeutic_areas')
      .select('*')
      .eq('slug', slug)
      .single();
    
    // If not found by slug, try by ID
    if (response.error || !response.data) {
      response = await supabase
        .from('therapeutic_areas')
        .select('*')
        .eq('id', slug)
        .single();
    }
    
    if (response.error || !response.data) {
      if (response.error?.code === 'PGRST116') {
        return null; // Not found
      }
      console.error(`Error fetching therapeutic area with slug "${slug}":`, response.error);
      throw response.error;
    }
    
    return dbTherapeuticAreaToTherapeuticArea(response.data);
  } catch (error) {
    console.error(`Error in getTherapeuticAreaBySlug for slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Fetches companies related to a therapeutic area
 * 
 * @param therapeuticAreaId The therapeutic area ID
 * @param limit Maximum number of companies to return
 * @param offset Offset for pagination
 * @returns Array of companies in the therapeutic area
 */
export async function getTherapeuticAreaCompanies(
  therapeuticAreaId: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<Company[]> {
  try {
    // Get company IDs for this therapeutic area
    const { data: companyTAs, error: taError } = await supabase
      .from('company_therapeutic_areas')
      .select('company_id')
      .eq('therapeutic_area_id', therapeuticAreaId);
    
    if (taError) {
      console.error(`Error fetching companies for therapeutic area ${therapeuticAreaId}:`, taError);
      throw taError;
    }
    
    if (!companyTAs?.length) {
      return [];
    }
    
    // Get the company details
    const companyIds = companyTAs.map(relation => relation.company_id);
    const { data: companies, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .in('id', companyIds)
      .range(offset, offset + limit - 1)
      .order('name');
    
    if (companyError) {
      console.error('Error fetching company details:', companyError);
      throw companyError;
    }
    
    return (companies || []).map(dbCompanyToCompany);
  } catch (error) {
    console.error(`Error in getTherapeuticAreaCompanies for TA ${therapeuticAreaId}:`, error);
    throw error;
  }
}

/**
 * Fetches products for a therapeutic area
 * @param id The therapeutic area ID 
 * @returns Products associated with the therapeutic area
 */
export async function getTherapeuticAreaProducts(id: string): Promise<Product[]> {
  try {
    // Get product IDs for this therapeutic area
    const { data: productTAs, error: productTAError } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id')
      .eq('therapeutic_area_id', id);
    
    if (productTAError) {
      throw productTAError;
    }
    
    if (!productTAs?.length) {
      return [];
    }
    
    // Get full product details
    const productIds = productTAs.map(pta => pta.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    
    if (productsError) {
      throw productsError;
    }
    
    // Need to use type assertion (as any) to avoid TypeScript errors with the 
    // Supabase types vs. our DBProduct interface
    return (products || []).map(product => dbProductToProduct(product as any));
  } catch (error) {
    console.error(`Error fetching products for therapeutic area ${id}:`, error);
    return [];
  }
}

/**
 * Fetches therapeutic areas related to a therapeutic area (based on shared companies/products)
 * 
 * @param therapeuticAreaId The therapeutic area ID
 * @param limit Maximum number of related areas to return
 * @returns Array of related therapeutic areas
 */
export async function getRelatedTherapeuticAreas(
  therapeuticAreaId: string, 
  limit: number = 5
): Promise<TherapeuticArea[]> {
  try {
    // Get companies for this therapeutic area
    const { data: companyTAs } = await supabase
      .from('company_therapeutic_areas')
      .select('company_id')
      .eq('therapeutic_area_id', therapeuticAreaId);
    
    // Get products for this therapeutic area
    const { data: productTAs } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id')
      .eq('therapeutic_area_id', therapeuticAreaId);
    
    // No relations found
    if ((!companyTAs || companyTAs.length === 0) && (!productTAs || productTAs.length === 0)) {
      return [];
    }
    
    // Extract IDs
    const companyIds = (companyTAs || []).map(relation => relation.company_id);
    const productIds = (productTAs || []).map(relation => relation.product_id);
    
    // Find therapeutic areas related by companies
    const { data: relatedCompanyTAs } = await supabase
      .from('company_therapeutic_areas')
      .select('therapeutic_area_id')
      .in('company_id', companyIds)
      .neq('therapeutic_area_id', therapeuticAreaId);
    
    // Find therapeutic areas related by products
    const { data: relatedProductTAs } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id')
      .in('product_id', productIds)
      .neq('therapeutic_area_id', therapeuticAreaId);
    
    // Count occurrences to find areas with most connections
    const taCount = new Map<string, number>();
    
    (relatedCompanyTAs || []).forEach(relation => {
      const count = taCount.get(relation.therapeutic_area_id) || 0;
      taCount.set(relation.therapeutic_area_id, count + 1);
    });
    
    (relatedProductTAs || []).forEach(relation => {
      const count = taCount.get(relation.therapeutic_area_id) || 0;
      taCount.set(relation.therapeutic_area_id, count + 1);
    });
    
    // Sort by count and take top N
    const topTAIds = [...taCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
    
    if (topTAIds.length === 0) {
      return [];
    }
    
    // Get full details for related therapeutic areas
    const { data: relatedTAs, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .in('id', topTAIds);
    
    if (error) {
      console.error('Error fetching related therapeutic areas:', error);
      throw error;
    }
    
    return (relatedTAs || []).map(dbTherapeuticAreaToTherapeuticArea);
  } catch (error) {
    console.error(`Error in getRelatedTherapeuticAreas for TA ${therapeuticAreaId}:`, error);
    throw error;
  }
}

/**
 * Gets filter options for therapeutic areas
 * 
 * @returns Filter options for therapeutic areas
 */
export async function getTherapeuticAreaFilters(): Promise<{
  sortOptions: { value: string; label: string }[];
}> {
  // Define sort options
  const sortOptions = [
    { value: 'name_asc', label: 'Name (A to Z)' },
    { value: 'name_desc', label: 'Name (Z to A)' },
    { value: 'companies_desc', label: 'Most Companies' },
    { value: 'companies_asc', label: 'Fewest Companies' },
    { value: 'products_desc', label: 'Most Products' },
    { value: 'products_asc', label: 'Fewest Products' },
    { value: 'websites_desc', label: 'Most Websites' },
    { value: 'websites_asc', label: 'Fewest Websites' }
  ];
  
  return { sortOptions };
} 