/**
 * Product Entity Interface
 * 
 * Defines the standard structure for pharmaceutical product data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent product data regardless of source.
 */

import type { Database } from '../../types/database';
import type { TherapeuticArea } from './TherapeuticArea';

// Database types for reference
export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbProductInsert = Database['public']['Tables']['products']['Insert'];
export type DbProductUpdate = Database['public']['Tables']['products']['Update'];

/**
 * Development and approval stages for a pharmaceutical product
 */
export type ProductStage = 
  | 'discovery'
  | 'preclinical'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'approved'
  | 'market'
  | 'discontinued';

/**
 * Timeline entry for a product's development history
 */
export interface ProductTimeline {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Date of the timeline event
   */
  date: string;
  
  /**
   * Stage of development at this point in time
   */
  stage: string;
  
  /**
   * Description of the timeline event
   */
  description: string;
}

/**
 * Regulatory approval information for a product
 */
export interface ProductApproval {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Geographic region of the approval
   */
  region: string;
  
  /**
   * Date of approval
   */
  date: string;
  
  /**
   * Agency that granted the approval
   */
  agency: string;
  
  /**
   * Status of the approval
   */
  status: string;
  
  /**
   * Approved indication (what the product is approved to treat)
   */
  indication: string;
  
  /**
   * Additional details about the approval
   */
  details?: string;
}

/**
 * Patent information for a product
 */
export interface ProductPatent {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Patent number
   */
  number: string;
  
  /**
   * Date when the patent expires
   */
  expiryDate: string;
  
  /**
   * Description of what the patent covers
   */
  description: string;
}

/**
 * Product interface
 * Represents a pharmaceutical product in the database
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  genericName: string | null;
  companyId: string | null;
  companyName?: string; // Derived field
  companySlug?: string; // Derived field
  description: string | null;
  stage: string | null;
  status: string | null;
  year: number | null;
  moleculeType: string | null;
  imageUrl: string | null;
  website: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  therapeuticAreas?: string[]; // Derived field from join table
}

/**
 * Interface for Product database records
 */
export interface DBProduct {
  id: string;
  name: string;
  slug: string | null;
  description?: string;
  generic_name?: string;
  molecule_type?: string;
  image_url?: string;
  website?: string;
  company_id: string;
  stage?: string;
  status?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Product filter interface
 * Defines filtering and sorting options for product queries
 */
export interface ProductFilter {
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
 * Product list response interface
 * For paginated product queries
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
}

/**
 * Converts a database product record to a Product entity
 * @param dbProduct Database product record
 * @returns Product entity
 */
export function dbProductToProduct(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug || '',
    description: dbProduct.description || null,
    genericName: dbProduct.generic_name || null,
    moleculeType: dbProduct.molecule_type || null,
    imageUrl: dbProduct.image_url || null,
    website: dbProduct.website || null,
    companyId: dbProduct.company_id,
    companyName: undefined, // Will be populated separately if needed
    companySlug: undefined, // Will be populated separately if needed
    stage: dbProduct.stage || null,
    status: dbProduct.status || null,
    year: dbProduct.year || null,
    therapeuticAreas: [], // Will be populated separately
    createdAt: new Date(dbProduct.created_at),
    updatedAt: new Date(dbProduct.updated_at)
  };
}

/**
 * Converts an application Product model to a database insert record
 */
export function productToDbProduct(product: Partial<Product>): Partial<DBProduct> {
  return {
    id: product.id,
    name: product.name,
    generic_name: product.genericName || undefined,
    company_id: product.companyId || undefined,
    description: product.description || undefined,
    stage: product.stage || undefined,
    molecule_type: product.moleculeType || undefined,
    image_url: product.imageUrl || undefined,
    website: product.website || undefined,
    status: product.status || undefined,
    year: product.year || undefined,
    slug: product.slug || '',
    // Don't set created_at or updated_at, let the database handle those
    // therapeuticAreas is handled separately through the junction table
  };
} 