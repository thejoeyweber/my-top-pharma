/**
 * Product Utils
 * 
 * Utility functions for fetching and manipulating product data.
 * Centralizes all product-related data access to promote reusability
 * and consistent data handling.
 */

import { supabase } from '../supabase';
import type { 
  Product, 
  TherapeuticArea, 
  Company 
} from '../../interfaces/entities';
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';

/**
 * Interface for filter options with count
 */
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * Interface for product filter parameters
 */
interface ProductFilterParams {
  search?: string;
  stage?: string;
  therapeuticAreaId?: string;
  companyId?: string;
  moleculeType?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get a product by slug
 * @param slug The product slug or ID
 * @returns Product entity or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // First try to fetch by slug
  let response = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
    
  // If not found by slug, try by ID
  if (response.error || !response.data) {
    response = await supabase
      .from('products')
      .select('*')
      .eq('id', slug)
      .single();
  }

  // Return null if not found
  if (response.error || !response.data) {
    return null;
  }

  // Convert to Product entity and return
  return dbProductToProduct(response.data);
}

/**
 * Get a list of products with filtering options
 * @param filters Object containing filter parameters
 * @returns Object containing products array and total count
 */
export async function getProducts(filters: ProductFilterParams = {}): Promise<{ products: Product[], totalCount: number }> {
  const { 
    search, 
    stage, 
    therapeuticAreaId, 
    companyId, 
    moleculeType,
    limit = 20,
    offset = 0
  } = filters;

  // Start building the query
  let query = supabase.from('products').select('*', { count: 'exact' });

  // Apply search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,generic_name.ilike.%${search}%`);
  }

  // Apply stage filter
  if (stage) {
    query = query.eq('stage', stage);
  }

  // Apply molecule type filter
  if (moleculeType) {
    query = query.eq('molecule_type', moleculeType);
  }

  // Apply company filter
  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1).order('name');

  // Execute the query
  const { data: dbProducts, count, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }

  let products = (dbProducts || []).map(dbProductToProduct);
  let totalCount = count || 0;

  // If we need to filter by therapeutic area, we do it separately
  // because it requires a join that's easier to handle this way
  if (therapeuticAreaId) {
    const { data: productTAs } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id')
      .eq('therapeutic_area_id', therapeuticAreaId);
      
    if (productTAs && productTAs.length > 0) {
      const productIds = productTAs.map(pta => pta.product_id);
      products = products.filter(product => productIds.includes(product.id));
      totalCount = products.length; // Adjust count for filtered results
    } else {
      // No products match this therapeutic area
      return { products: [], totalCount: 0 };
    }
  }

  // Return the products and total count
  return { products, totalCount };
}

/**
 * Get therapeutic areas for a specific product
 * @param productId The product ID
 * @returns Array of therapeutic area names
 */
export async function getProductTherapeuticAreas(productId: string): Promise<string[]> {
  // Get therapeutic area IDs for the product
  const { data: productTAs, error: ptaError } = await supabase
    .from('product_therapeutic_areas')
    .select('therapeutic_area_id')
    .eq('product_id', productId);
    
  if (ptaError || !productTAs || productTAs.length === 0) {
    return [];
  }
  
  // Get therapeutic area names
  const therapeuticAreaIds = productTAs.map(pta => pta.therapeutic_area_id);
  const { data: taData, error: taError } = await supabase
    .from('therapeutic_areas')
    .select('name')
    .in('id', therapeuticAreaIds);
    
  if (taError || !taData) {
    return [];
  }
  
  // Return just the names
  return taData.map(ta => ta.name);
}

/**
 * Get products related to a specific product (shared therapeutic areas)
 * @param productId The product ID to find related products for
 * @param limit Maximum number of related products to return
 * @returns Array of related Product entities
 */
export async function getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
  // Get therapeutic area IDs for the product
  const { data: productTAs } = await supabase
    .from('product_therapeutic_areas')
    .select('therapeutic_area_id')
    .eq('product_id', productId);
    
  if (!productTAs || productTAs.length === 0) {
    return [];
  }
  
  // Get related product IDs (same therapeutic areas but different product)
  const therapeuticAreaIds = productTAs.map(pta => pta.therapeutic_area_id);
  const { data: relatedPTAs } = await supabase
    .from('product_therapeutic_areas')
    .select('product_id')
    .in('therapeutic_area_id', therapeuticAreaIds)
    .neq('product_id', productId);
    
  if (!relatedPTAs || relatedPTAs.length === 0) {
    return [];
  }
  
  // Count occurrences to find products with most therapeutic areas in common
  const productCounts: Record<string, number> = {};
  relatedPTAs.forEach(pta => {
    productCounts[pta.product_id] = (productCounts[pta.product_id] || 0) + 1;
  });
  
  // Sort by count (most related first) and take top N
  const relatedProductIds = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  
  // Get product details
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .in('id', relatedProductIds);
    
  if (!dbProducts || dbProducts.length === 0) {
    return [];
  }
  
  // Convert to Product entities and return
  return dbProducts.map(dbProductToProduct);
}

/**
 * Get all available filter options for products
 * @returns Object containing filter options for stages, therapeutic areas, and molecule types
 */
export async function getProductFilters(): Promise<{
  stages: FilterOption[],
  therapeuticAreas: (TherapeuticArea & { count: number })[],
  moleculeTypes: FilterOption[]
}> {
  // Get all therapeutic areas
  const { data: dbTherapeuticAreas } = await supabase
    .from('therapeutic_areas')
    .select('*')
    .order('name');
  
  const therapeuticAreas = (dbTherapeuticAreas || []).map(ta => ({
    ...dbTherapeuticAreaToTherapeuticArea(ta),
    count: 0 // Initialize count, will be updated later
  }));
  
  // Get counts for each therapeutic area
  const { data: ptaCounts } = await supabase
    .from('product_therapeutic_areas')
    .select('therapeutic_area_id, count(*)', { count: 'exact' })
    .group('therapeutic_area_id');
    
  if (ptaCounts) {
    // Update counts in therapeutic areas array
    ptaCounts.forEach(item => {
      const taIndex = therapeuticAreas.findIndex(ta => ta.id === item.therapeutic_area_id);
      if (taIndex >= 0) {
        therapeuticAreas[taIndex].count = parseInt(item.count);
      }
    });
  }
  
  // Get counts for stages
  const { data: stageCounts } = await supabase
    .from('products')
    .select('stage, count(*)', { count: 'exact' })
    .group('stage');
    
  // Define stage options with counts
  const stageMap: Record<string, string> = {
    'discovery': 'Discovery',
    'preclinical': 'Preclinical',
    'phase1': 'Phase 1',
    'phase2': 'Phase 2',
    'phase3': 'Phase 3',
    'approved': 'Approved',
    'market': 'Market',
    'discontinued': 'Discontinued'
  };
  
  const stages: FilterOption[] = Object.entries(stageMap).map(([value, label]) => ({
    value,
    label,
    count: 0
  }));
  
  if (stageCounts) {
    stageCounts.forEach(item => {
      const stage = stages.find(s => s.value === item.stage);
      if (stage) {
        stage.count = parseInt(item.count);
      }
    });
  }
  
  // Get counts for molecule types
  const { data: moleculeTypeCounts } = await supabase
    .from('products')
    .select('molecule_type, count(*)', { count: 'exact' })
    .group('molecule_type');
    
  const moleculeTypes: FilterOption[] = (moleculeTypeCounts || [])
    .filter(item => item.molecule_type) // Filter out null values
    .map(item => ({
      value: item.molecule_type,
      label: item.molecule_type,
      count: parseInt(item.count)
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  
  return {
    stages,
    therapeuticAreas,
    moleculeTypes
  };
} 