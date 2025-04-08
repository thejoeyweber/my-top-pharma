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
  details: string | null;
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
  companyName: string | null; // Derived field
  companySlug: string | null; // Derived field
  description: string | null;
  stage: string | null;
  status: string | null;
  year: number | null;
  moleculeType: string | null;
  imageUrl: string | null;
  website: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  therapeuticAreas: TherapeuticArea[]; // Derived field from join table
}

/**
 * Interface for Product database records
 */
export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  generic_name: string | null;
  molecule_type: string | null;
  image_url: string | null;
  website: string | null;
  company_id: string | null;
  stage: string | null;
  status: string | null;
  year: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Product filter interface
 * Defines filtering and sorting options for product queries
 */
export interface ProductFilter {
  search: string | null;
  stage: string | null;
  therapeuticAreaId: string | null;
  companyId: string | null;
  moleculeType: string | null;
  limit: number | null;
  offset: number | null;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
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
    slug: dbProduct.slug,
    description: dbProduct.description,
    genericName: dbProduct.generic_name,
    moleculeType: dbProduct.molecule_type,
    imageUrl: dbProduct.image_url,
    website: dbProduct.website,
    companyId: dbProduct.company_id,
    companyName: null, // Will be populated separately if needed
    companySlug: null, // Will be populated separately if needed
    stage: dbProduct.stage,
    status: dbProduct.status,
    year: dbProduct.year,
    therapeuticAreas: [], // Will be populated separately
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
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
    slug: product.slug,
    // Don't set created_at or updated_at, let the database handle those
    // therapeuticAreas is handled separately through the junction table
  };
} 