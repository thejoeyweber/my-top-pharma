/**
 * Product Data Utilities
 * 
 * This module provides functions to fetch and manipulate product data from Supabase.
 * It centralizes data access logic to improve maintainability and testing.
 */

import { supabase } from '../supabase';
import type { Product, TherapeuticArea } from '../../interfaces/entities';
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';
import { DEFAULT_LIMIT } from '../constants';

/**
 * Options for filtering and sorting product data
 */
export interface ProductFilter {
  search?: string;
  companyId?: string;
  therapeuticAreaId?: string;
  stage?: string;
  moleculeType?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Interface for product filter options
 */
export interface ProductFilterOptions {
  therapeuticAreas: { id: string; name: string }[];
  stages: { value: string; label: string }[];
  moleculeTypes: { value: string; label: string }[];
  sortOptions: { value: string; label: string }[];
}

/**
 * Fetches products from the database with filtering, sorting and pagination
 * 
 * @param options Filtering and sorting options
 * @returns Object containing products array and total count
 */
export async function getProducts(options: ProductFilter = {}): Promise<{
  products: Product[];
  total: number;
}> {
  try {
    const {
      search,
      companyId,
      therapeuticAreaId,
      stage,
      moleculeType,
      sortBy = 'name',
      sortDirection = 'asc',
      limit = DEFAULT_LIMIT,
      offset = 0
    } = options;

    // Start building the query
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,generic_name.ilike.%${search}%`);
    }
    
    // Apply company filter if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    // Apply stage filter if provided
    if (stage) {
      query = query.eq('stage', stage);
    }
    
    // Apply molecule type filter if provided
    if (moleculeType) {
      query = query.eq('molecule_type', moleculeType);
    }
    
    // Apply therapeutic area filter (handled separately after initial query)
    let taFilteredProductIds: string[] | null = null;
    if (therapeuticAreaId) {
      const { data: productTAs } = await supabase
        .from('product_therapeutic_areas')
        .select('product_id')
        .eq('therapeutic_area_id', therapeuticAreaId);
      
      if (productTAs && productTAs.length > 0) {
        taFilteredProductIds = productTAs.map(relation => relation.product_id);
        query = query.in('id', taFilteredProductIds);
      } else {
        // No products match the TA filter, return empty
        return { products: [], total: 0 };
      }
    }
    
    // Apply sorting
    const sortField = (() => {
      if (sortBy === 'name') return 'name';
      if (sortBy === 'stage') return 'stage';
      if (sortBy === 'date') return 'created_at';
      return 'name'; // Default sort field
    })();
    
    query = query.order(sortField, { ascending: sortDirection !== 'desc' });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute the query
    const { data, count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Convert database records to application entities
    const products = (data || []).map(dbProduct => dbProductToProduct(dbProduct as any));
    
    return { 
      products, 
      total: count || 0 
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetches a product by its slug
 * 
 * @param slug The product slug
 * @returns The product if found, null otherwise
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Try by slug first
    let response = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    // If not found by slug, try by ID (in case the slug is actually an ID)
    if (response.error || !response.data) {
      response = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .single();
    }
    
    // Handle not found case
    if (response.error || !response.data) {
      if (response.error?.code === 'PGRST116') {
        return null; // Not found
      }
      throw response.error;
    }
    
    return dbProductToProduct(response.data as any);
  } catch (error) {
    console.error(`Error in getProductBySlug for slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Fetches therapeutic areas for a product
 * 
 * @param productId The product ID
 * @returns Array of therapeutic area names
 */
export async function getProductTherapeuticAreas(productId: string): Promise<string[]> {
  try {
    // Get therapeutic area IDs for this product
    const { data: productTAs, error: taError } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('product_id', productId);
    
    if (taError) {
      throw taError;
    }
    
    if (!productTAs?.length) {
      return [];
    }
    
    // Get the therapeutic area names
    const taIds = productTAs.map(relation => relation.therapeutic_area_id);
    const { data: tas, error: tasError } = await supabase
      .from('therapeutic_areas')
      .select('name')
      .in('id', taIds);
    
    if (tasError) {
      throw tasError;
    }
    
    return (tas || []).map(ta => ta.name);
  } catch (error) {
    console.error(`Error in getProductTherapeuticAreas for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Fetches related products based on shared therapeutic areas
 * 
 * @param productId The product ID
 * @param limit Maximum number of related products to return
 * @returns Array of related products
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    // Get therapeutic area IDs for this product
    const { data: productTAs, error: taError } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('product_id', productId);
    
    if (taError) {
      throw taError;
    }
    
    if (!productTAs?.length) {
      return [];
    }
    
    // Get product IDs that share these therapeutic areas
    const taIds = productTAs.map(relation => relation.therapeutic_area_id);
    const { data: relatedProductTAs, error: relatedError } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id')
      .in('therapeutic_area_id', taIds)
      .neq('product_id', productId);
    
    if (relatedError) {
      throw relatedError;
    }
    
    if (!relatedProductTAs?.length) {
      return [];
    }
    
    // Count occurrences to find products with most shared TAs
    const productIdCounts = new Map<string, number>();
    relatedProductTAs.forEach(relation => {
      const count = productIdCounts.get(relation.product_id) || 0;
      productIdCounts.set(relation.product_id, count + 1);
    });
    
    // Sort by count and take top N
    const topProductIds = [...productIdCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
    
    if (!topProductIds.length) {
      return [];
    }
    
    // Get product details
    const { data: relatedProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', topProductIds)
      .limit(limit);
    
    if (productsError) {
      throw productsError;
    }
    
    return (relatedProducts || []).map(product => dbProductToProduct(product as any));
  } catch (error) {
    console.error(`Error in getRelatedProducts for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Gets filter options for products
 * 
 * @returns Filter options for products
 */
export async function getProductFilters(): Promise<ProductFilterOptions> {
  try {
    // Get therapeutic areas
    const { data: therapeuticAreas, error: taError } = await supabase
      .from('therapeutic_areas')
      .select('id, name')
      .order('name');
    
    if (taError) {
      throw taError;
    }
    
    // Define development stages
    const stages = [
      { value: 'discovery', label: 'Discovery' },
      { value: 'preclinical', label: 'Preclinical' },
      { value: 'phase1', label: 'Phase 1' },
      { value: 'phase2', label: 'Phase 2' },
      { value: 'phase3', label: 'Phase 3' },
      { value: 'filed', label: 'Filed' },
      { value: 'approved', label: 'Approved' },
      { value: 'market', label: 'Market' }
    ];
    
    // Define molecule types
    const moleculeTypes = [
      { value: 'small_molecule', label: 'Small Molecule' },
      { value: 'biologic', label: 'Biologic' },
      { value: 'peptide', label: 'Peptide' },
      { value: 'cell_therapy', label: 'Cell Therapy' },
      { value: 'gene_therapy', label: 'Gene Therapy' },
      { value: 'oligonucleotide', label: 'Oligonucleotide' },
      { value: 'radiopharmaceutical', label: 'Radiopharmaceutical' },
      { value: 'other', label: 'Other' }
    ];
    
    // Define sort options
    const sortOptions = [
      { value: 'name_asc', label: 'Name (A to Z)' },
      { value: 'name_desc', label: 'Name (Z to A)' },
      { value: 'stage_asc', label: 'Stage (Early to Late)' },
      { value: 'stage_desc', label: 'Stage (Late to Early)' },
      { value: 'date_desc', label: 'Newest First' },
      { value: 'date_asc', label: 'Oldest First' }
    ];
    
    return {
      therapeuticAreas: therapeuticAreas || [],
      stages,
      moleculeTypes,
      sortOptions
    };
  } catch (error) {
    console.error('Error in getProductFilters:', error);
    throw error;
  }
} 