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
import { dbProductToProduct, type DBProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';
import { DEFAULT_LIMIT } from '../constants';
import type { ProductFilter, ProductListResponse } from '../../interfaces/entities/Product';

/**
 * Interface for filter options with count
 */
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * SQL result types for aggregated queries
 */
interface TherapeuticAreaCount {
  therapeutic_area_id: string;
  count: string;
}

interface StageCount {
  stage: string;
  count: string;
}

interface MoleculeTypeCount {
  molecule_type: string;
  count: string;
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
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Get a product by slug
 * @param slug The product slug or ID
 * @returns Product entity or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // First try to fetch by slug
    const { data, error } = await supabase
      .from('products')
      .select('*, companies(*)')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get therapeutic areas for this product
    const therapeuticAreas = await getProductTherapeuticAreas(data.id);
    
    // Convert to Product entity and return with manual type assertion to handle Supabase types
    const product = dbProductToProduct(data as unknown as DBProduct);
    product.therapeuticAreas = therapeuticAreas;
    
    return product;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Get a list of products with filtering options
 * @param filters Object containing filter parameters
 * @returns Object containing products array and total count
 */
export async function getProducts(filters: ProductFilter = {}): Promise<ProductListResponse> {
  try {
    const { 
      search, 
      stage, 
      therapeuticAreaId, 
      companyId, 
      moleculeType,
      limit = DEFAULT_LIMIT,
      offset = 0,
      sortBy = 'name',
      sortDirection = 'asc'
    } = filters;

    // Start building the query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact', head: false });

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

    // Apply sorting
    if (sortBy) {
      const field = sortBy.replace('_asc', '').replace('_desc', '');
      const ascending = !sortBy.endsWith('_desc');
      query = query.order(field);
    } else {
      // Default sorting
      query = query.order('name');
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    // Start with products from the main query
    // Use type assertion to handle Supabase types
    let products = (data || []).map(product => dbProductToProduct(product as unknown as DBProduct));
    let total = count || 0;

    // If we need to filter by therapeutic area, we do it separately
    // because it requires a join that's easier to handle this way
    if (therapeuticAreaId) {
      // Get product IDs that match the therapeutic area
      const { data: productTAs } = await supabase
        .from('product_therapeutic_areas')
        .select('product_id')
        .eq('therapeutic_area_id', therapeuticAreaId);
        
      if (productTAs && productTAs.length > 0) {
        const productIds = productTAs.map(pta => pta.product_id);
        products = products.filter(product => productIds.includes(product.id));
        total = products.length; // Adjust count for filtered results
      } else {
        // No products match this therapeutic area
        return { products: [], total: 0 };
      }
    }

    // Fetch therapeutic areas for all products
    for (const product of products) {
      product.therapeuticAreas = await getProductTherapeuticAreas(product.id);
    }

    // Return the products and total count
    return { products, total: total };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Gets the therapeutic areas associated with a product
 * @param productId - The product ID
 * @returns Array of therapeutic area names
 */
export async function getProductTherapeuticAreas(productId: string): Promise<string[]> {
  try {
    // Get therapeutic area IDs for the product
    const { data: productTAs, error: ptaError } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('product_id', productId);
    
    if (ptaError) {
      throw ptaError;
    }
    
    if (!productTAs || !Array.isArray(productTAs) || productTAs.length === 0) {
      return [];
    }
    
    // Get therapeutic area names
    try {
      const therapeuticAreaIds = productTAs.map(pta => pta.therapeutic_area_id);
      const { data: taData, error: taError } = await supabase
        .from('therapeutic_areas')
        .select('name')
        .in('id', therapeuticAreaIds);
      
      if (taError) {
        throw taError;
      }
      
      return (taData || []).map(ta => ta.name);
    } catch (error) {
      console.error(`Error in getProductTherapeuticAreas mapping: ${error}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching therapeutic areas for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Get all available filter options for products
 * @returns Object containing filter options for stages, therapeutic areas, and molecule types
 */
export async function getProductFilters(): Promise<{
  stages: FilterOption[],
  therapeuticAreas: (TherapeuticArea & { count: number })[],
  moleculeTypes: FilterOption[],
  sortOptions: { value: string; label: string }[]
}> {
  try {
    // Get all therapeutic areas
    const { data: dbTherapeuticAreas } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .order('name');
    
    const therapeuticAreas = (dbTherapeuticAreas || []).map(ta => ({
      ...dbTherapeuticAreaToTherapeuticArea(ta),
      count: 0 // Initialize count, will be updated later
    }));
    
    // Get counts for each therapeutic area using raw SQL
    const { data: taCountsData } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id, count(*)')
      // We need to use .count() without .group() for Supabase
      .select('therapeutic_area_id');
    
    // Type assertion for SQL query result
    const taCounts = taCountsData as unknown as TherapeuticAreaCount[] | null;
    
    if (taCounts) {
      // Update counts in therapeutic areas array
      taCounts.forEach(item => {
        const taIndex = therapeuticAreas.findIndex(ta => ta.id === item.therapeutic_area_id);
        if (taIndex >= 0) {
          therapeuticAreas[taIndex].count = parseInt(item.count);
        }
      });
    }
    
    // Get counts for stages using direct SQL query
    const { data: stageCountsData } = await supabase
      .from('products')
      .select('stage, count(*)')
      .select('stage');
    
    // Type assertion for SQL query result
    const stageCounts = stageCountsData as unknown as StageCount[] | null;
    
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
    
    // Get counts for molecule types using direct SQL query
    const { data: moleculeCountsData } = await supabase
      .from('products')
      .select('molecule_type, count(*)')
      .select('molecule_type');
    
    // Type assertion for SQL query result
    const moleculeTypeCounts = moleculeCountsData as unknown as MoleculeTypeCount[] | null;
    
    const moleculeTypes: FilterOption[] = [];
    
    if (moleculeTypeCounts) {
      // Transform the SQL results into FilterOption objects
      moleculeTypeCounts.forEach(item => {
        if (item.molecule_type) {
          moleculeTypes.push({
            value: item.molecule_type,
            label: item.molecule_type,
            count: parseInt(item.count)
          });
        }
      });
      
      // Sort by label
      moleculeTypes.sort((a, b) => a.label.localeCompare(b.label));
    }
    
    // Define sort options
    const sortOptions = [
      { value: 'name_asc', label: 'Name (A to Z)' },
      { value: 'name_desc', label: 'Name (Z to A)' },
      { value: 'stage_asc', label: 'Stage (Early to Late)' },
      { value: 'stage_desc', label: 'Stage (Late to Early)' },
      { value: 'created_at_desc', label: 'Newest First' },
      { value: 'created_at_asc', label: 'Oldest First' }
    ];
    
    return {
      stages,
      therapeuticAreas,
      moleculeTypes,
      sortOptions
    };
  } catch (error) {
    console.error('Error fetching product filters:', error);
    throw error;
  }
}

/**
 * Get products related to a specific product (shared therapeutic areas)
 * @param productId The product ID to find related products for
 * @param limit Maximum number of related products to return
 * @returns Array of related Product entities
 */
export async function getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
  try {
    // Get therapeutic area IDs for the product
    const { data: productTAs } = await supabase
      .from('product_therapeutic_areas')
      .select('therapeutic_area_id')
      .eq('product_id', productId);
      
    if (!productTAs || !Array.isArray(productTAs) || productTAs.length === 0) {
      return [];
    }
    
    // Get related product IDs (same therapeutic areas but different product)
    const therapeuticAreaIds = productTAs.map(pta => pta.therapeutic_area_id);
    const { data: relatedPTAs } = await supabase
      .from('product_therapeutic_areas')
      .select('product_id')
      .in('therapeutic_area_id', therapeuticAreaIds)
      .neq('product_id', productId);
      
    if (!relatedPTAs || !Array.isArray(relatedPTAs) || relatedPTAs.length === 0) {
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
      
    if (!dbProducts || !Array.isArray(dbProducts) || dbProducts.length === 0) {
      return [];
    }
    
    // Convert to Product entities with type assertion
    const products = dbProducts.map(product => dbProductToProduct(product as unknown as DBProduct));
    
    // Fetch therapeutic areas for all products
    for (const product of products) {
      product.therapeuticAreas = await getProductTherapeuticAreas(product.id);
    }
    
    return products;
  } catch (error) {
    console.error(`Error fetching related products for product ${productId}:`, error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
}

/**
 * Retrieves a list of products for a specific company
 * @param companyId - The company ID
 * @param options - Filter options
 * @returns Products for the company
 */
export async function getProductsByCompany(
  companyId: string,
  options: Omit<ProductFilter, 'companyId'> = {}
): Promise<ProductListResponse> {
  try {
    // Add the company ID to the filter
    return getProducts({
      ...options,
      companyId
    });
  } catch (error) {
    console.error(`Error fetching products for company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Creates a new product
 * @param product - The product data
 * @returns The created product
 */
export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          slug: product.slug,
          description: product.description,
          generic_name: product.genericName,
          molecule_type: product.moleculeType,
          image_url: product.imageUrl,
          website: product.website,
          company_id: product.companyId,
          stage: product.stage,
          status: product.status,
          year: product.year
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map to our Product interface
    return dbProductToProduct(data as unknown as DBProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Updates an existing product
 * @param id - The product ID
 * @param product - The updated product data
 * @returns The updated product
 */
export async function updateProduct(
  id: string, 
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...(product.name !== undefined && { name: product.name }),
        ...(product.slug !== undefined && { slug: product.slug }),
        ...(product.description !== undefined && { description: product.description }),
        ...(product.genericName !== undefined && { generic_name: product.genericName }),
        ...(product.moleculeType !== undefined && { molecule_type: product.moleculeType }),
        ...(product.imageUrl !== undefined && { image_url: product.imageUrl }),
        ...(product.website !== undefined && { website: product.website }),
        ...(product.companyId !== undefined && { company_id: product.companyId }),
        ...(product.stage !== undefined && { stage: product.stage }),
        ...(product.status !== undefined && { status: product.status }),
        ...(product.year !== undefined && { year: product.year })
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map to our Product interface
    return dbProductToProduct(data as unknown as DBProduct);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a product by ID
 * @param id - The product ID
 * @returns Success indicator
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
} 