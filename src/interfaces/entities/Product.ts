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
  createdAt: string | null;
  updatedAt: string | null;
  therapeuticAreas?: string[]; // Derived field from join table
}

/**
 * Database Product interface
 * Maps directly to the products table schema
 */
export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  generic_name: string | null;
  company_id: string | null;
  description: string | null;
  stage: string | null;
  status: string | null;
  year: number | null;
  molecule_type: string | null;
  image_url: string | null;
  website: string | null;
  created_at: string | null;
  updated_at: string | null;
  companies?: {
    id: string;
    name: string;
    slug: string;
  } | null;
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
 * Converts a database product record to a Product object
 * @param dbProduct The database product record
 * @returns A Product object
 */
export function dbProductToProduct(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    genericName: dbProduct.generic_name,
    companyId: dbProduct.company_id,
    companyName: dbProduct.companies?.name || undefined,
    companySlug: dbProduct.companies?.slug || undefined,
    description: dbProduct.description,
    stage: dbProduct.stage,
    status: dbProduct.status,
    year: dbProduct.year,
    moleculeType: dbProduct.molecule_type,
    imageUrl: dbProduct.image_url,
    website: dbProduct.website,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
    therapeuticAreas: []
  };
}

/**
 * Converts an application Product model to a database insert record
 */
export function productToDbProduct(product: Partial<Product>): Partial<DBProduct> {
  return {
    id: product.id,
    name: product.name,
    generic_name: product.genericName || null,
    company_id: product.companyId || null,
    description: product.description || null,
    stage: product.stage || null,
    molecule_type: product.moleculeType || null,
    image_url: product.imageUrl || null,
    website: product.website || null,
    status: product.status || null,
    year: product.year || null,
    slug: product.slug || '',
    // Don't set created_at or updated_at, let the database handle those
    // therapeuticAreas is handled separately through the junction table
  };
} 