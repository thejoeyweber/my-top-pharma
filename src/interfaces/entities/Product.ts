/**
 * Product Entity Interface
 * 
 * Defines the standard structure for pharmaceutical product data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent product data regardless of source.
 */

import type { Database } from '../../types/database';

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
 * Main Product interface representing a pharmaceutical product
 */
export interface Product {
  /**
   * Unique identifier for the product
   */
  id: string;
  
  /**
   * Commercial or brand name of the product
   */
  name: string;
  
  /**
   * URL-friendly version of the name
   */
  slug: string;
  
  /**
   * Non-proprietary or scientific name
   */
  genericName?: string;
  
  /**
   * ID of the company that owns/markets the product
   */
  companyId: string;
  
  /**
   * Product description
   */
  description?: string;
  
  /**
   * Current development or market stage
   */
  stage?: string;
  
  /**
   * Current status (approved, pending, etc.)
   */
  status?: string;
  
  /**
   * Year of product release/approval
   */
  year?: number;
  
  /**
   * IDs of therapeutic areas associated with this product
   */
  therapeuticAreas?: string[];
  
  /**
   * Medical conditions the product is used to treat
   */
  indications?: string[];
  
  /**
   * Type of molecule (small molecule, biologic, etc.)
   */
  moleculeType?: string;
  
  /**
   * Key development and approval milestones
   */
  timeline?: ProductTimeline[];
  
  /**
   * Regulatory approvals for the product
   */
  approvals?: ProductApproval[];
  
  /**
   * URL to product image
   */
  imageUrl?: string;
  
  /**
   * URL to product website
   */
  website?: string;
  
  /**
   * Patents associated with the product
   */
  patents?: ProductPatent[];
  
  /**
   * Creation timestamp
   */
  createdAt?: string;
  
  /**
   * Last update timestamp
   */
  updatedAt?: string;
}

/**
 * Converts a database product record to the application Product model
 */
export function dbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    genericName: dbProduct.generic_name || undefined,
    companyId: dbProduct.company_id,
    description: dbProduct.description || undefined,
    status: dbProduct.status || undefined,
    stage: dbProduct.stage || undefined,
    year: dbProduct.year ? Number(dbProduct.year) : undefined,
    moleculeType: dbProduct.molecule_type || undefined,
    imageUrl: dbProduct.image_url || undefined,
    website: dbProduct.website || undefined,
    createdAt: dbProduct.created_at || undefined,
    updatedAt: dbProduct.updated_at || undefined,
    slug: dbProduct.slug,
    therapeuticAreas: [], // This will be populated separately by joining with product_therapeutic_areas
    indications: [], // This will be populated separately by joining with product_indications
  };
}

/**
 * Converts an application Product model to a database insert record
 */
export function productToDbProduct(product: Partial<Product>): Partial<DbProduct> {
  return {
    id: product.id,
    name: product.name,
    generic_name: product.genericName || null,
    company_id: product.companyId,
    description: product.description || null,
    stage: product.stage || null,
    molecule_type: product.moleculeType || null,
    image_url: product.imageUrl || null,
    website: product.website || null,
    // Don't set created_at or updated_at, let the database handle those
    slug: product.slug || null,
    // therapeuticAreas and indications are handled separately through junction tables
  };
} 