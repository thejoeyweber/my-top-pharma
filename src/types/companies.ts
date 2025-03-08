/**
 * Company Types
 * 
 * Type definitions for pharmaceutical company data.
 */

export interface TherapeuticArea {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'Approved' | 'Phase 3' | 'Phase 2' | 'Phase 1' | 'Preclinical';
  approvalDate?: string;
  therapeuticAreas: string[];
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  type: 'acquisition' | 'product' | 'regulatory' | 'corporate';
}

export interface FinancialMetric {
  year: number;
  revenue: number; // in billions USD
  rAndDSpending: number; // in billions USD
  netIncome: number; // in billions USD
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  headerImageUrl?: string;
  headquarters: string;
  founded: string;
  website: string;
  marketCap: number; // in billions USD
  employees: number;
  stockSymbol?: string;
  stockExchange?: string;
  therapeuticAreas: string[];
  products: Product[];
  relatedCompanies: {
    id: string;
    relationship: 'competitor' | 'partner' | 'subsidiary' | 'parent';
  }[];
  milestones: Milestone[];
  financials: FinancialMetric[];
} 