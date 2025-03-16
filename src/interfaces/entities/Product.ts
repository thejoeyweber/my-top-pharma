/**
 * Product Entity Interface
 * 
 * Defines the standard structure for pharmaceutical product data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent product data regardless of source.
 */

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
   * Date of the timeline event
   */
  date: string;
  
  /**
   * Stage of development at this point in time
   */
  stage: ProductStage;
  
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
   * Geographic region of the approval
   */
  region: string;
  
  /**
   * Date of approval
   */
  date: string;
  
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
  description: string;
  
  /**
   * Current development or market stage
   */
  stage: ProductStage;
  
  /**
   * IDs of therapeutic areas associated with this product
   */
  therapeuticAreas: string[];
  
  /**
   * Medical conditions the product is used to treat
   */
  indications: string[];
  
  /**
   * Type of molecule (small molecule, biologic, etc.)
   */
  moleculeType: string;
  
  /**
   * Key development and approval milestones
   */
  timeline: ProductTimeline[];
  
  /**
   * Regulatory approvals for the product
   */
  approvals: ProductApproval[];
  
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
} 