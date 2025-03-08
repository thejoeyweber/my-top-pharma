/**
 * Product Types
 * 
 * Type definitions for pharmaceutical product data.
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

export interface ProductTimeline {
  date: string;
  stage: ProductStage;
  description: string;
}

export interface ProductApproval {
  region: string;
  date: string;
  indication: string;
  details?: string;
}

export interface Product {
  id: string;
  name: string;
  genericName?: string;
  companyId: string;
  description: string;
  stage: ProductStage;
  therapeuticAreas: string[];
  indications: string[];
  moleculeType: string;
  timeline: ProductTimeline[];
  approvals: ProductApproval[];
  imageUrl?: string;
  website?: string;
  patents?: {
    number: string;
    expiryDate: string;
    description: string;
  }[];
} 