/**
 * Therapeutic Area Types
 * 
 * This file defines types related to therapeutic areas (medical specialties)
 * using Healthcare Provider Taxonomy Codes (HPTCS) with MeSH references
 * for interoperability with other medical data sources.
 */

/**
 * Represents a therapeutic area (medical specialty)
 */
export interface TherapeuticArea {
  /** 
   * HPTCS code (e.g., "207RO0000X") serving as primary identifier
   */
  id: string;
  
  /**
   * Display name of the therapeutic area (e.g., "Oncology", "Cardiology")
   */
  name: string;
  
  /**
   * URL-friendly version of the name
   */
  slug: string;
  
  /**
   * MeSH identifier for the corresponding medical specialty (if available)
   */
  mesh_specialty_id?: string;
  
  /**
   * MeSH identifier for the corresponding disease category (if available)
   */
  mesh_disease_id?: string;
  
  /**
   * Description of the therapeutic area
   */
  description?: string;
  
  /**
   * Hierarchy level in the taxonomy (lower numbers = broader categories)
   */
  level?: number;
  
  /**
   * Reference to parent therapeutic area for hierarchical organization
   */
  parent_id?: string;
}

/**
 * Represents a mapping between a pharmaceutical class (EPC) and a therapeutic area
 */
export interface PharmClassMapping {
  /**
   * Database ID
   */
  id: number;
  
  /**
   * Pharmaceutical class name (from OpenFDA)
   */
  pharm_class: string;
  
  /**
   * Type of classification (EPC, MOA, CS, PE)
   */
  class_type: 'EPC' | 'MOA' | 'CS' | 'PE';
  
  /**
   * ID of the associated therapeutic area
   */
  therapeutic_area_id: string;
  
  /**
   * When the mapping was created
   */
  created_at?: string;
  
  /**
   * When the mapping was last updated
   */
  updated_at?: string;
} 