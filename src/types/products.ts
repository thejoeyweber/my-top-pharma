/**
 * Product Types
 * 
 * Type definitions for pharmaceutical product data.
 */

export type ProductStage = 
  | 'preclinical'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'submitted'
  | 'approved'
  | 'marketed';

export interface ProductApproval {
  region: string;
  date: string;
  agency: string;
  indication: string;
  status: 'approved' | 'rejected' | 'pending';
}

export interface ProductTimeline {
  stage: ProductStage;
  startDate: string;
  endDate?: string;
  milestone?: string;
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