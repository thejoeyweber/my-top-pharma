/**
 * TherapeuticArea Entity Interface
 * 
 * Defines the standard structure for therapeutic area data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent therapeutic area data regardless of source.
 */

/**
 * Main TherapeuticArea interface
 */
export interface TherapeuticArea {
  /**
   * Unique identifier for the therapeutic area
   */
  id: string;
  
  /**
   * Display name of the therapeutic area
   */
  name: string;
  
  /**
   * URL-friendly version of the name
   */
  slug: string;
  
  /**
   * Description of the therapeutic area
   */
  description: string;
  
  /**
   * URL to the therapeutic area icon image
   */
  iconUrl?: string;
  
  /**
   * URL to the therapeutic area image
   */
  imageUrl?: string;
  
  /**
   * Whether this is a primary therapeutic area
   */
  isPrimary?: boolean;
  
  /**
   * ID of the parent therapeutic area, if applicable
   */
  parentId?: string;
  
  /**
   * IDs of companies associated with this therapeutic area
   */
  companyIds?: string[];
  
  /**
   * IDs of products associated with this therapeutic area
   */
  productIds?: string[];
  
  /**
   * Alternative names or abbreviations for the therapeutic area
   */
  alternativeNames?: string[];
  
  /**
   * Related disease conditions
   */
  relatedConditions?: string[];
  
  /**
   * Market size in billions USD
   */
  marketSizeBillions?: number;
  
  /**
   * Projected annual growth rate percentage
   */
  growthRate?: number;
  
  /**
   * Last updated timestamp
   */
  updatedAt?: string;
  
  /**
   * Color used for UI elements related to this therapeutic area
   */
  color?: string;
} 