/**
 * Company Types
 * 
 * Type definitions for company data.
 */

export type CompanyRelationType = 'competitor' | 'partner' | 'subsidiary' | 'parent';

export interface Milestone {
  date: string;
  title: string;
  description: string;
  type: 'acquisition' | 'merger' | 'spinoff' | 'regulatory' | 'partnership';
}

export interface FinancialMetric {
  year: number;
  revenue: number;
  rAndDSpending: number;
  netIncome: number;
}

// Define a simplified product type to avoid circular dependency
export interface CompanyProduct {
  id: string;
  name: string;
  description: string;
  status: string;
  approvalDate?: string;
  therapeuticAreas: string[];
}

export interface Company {
  id: string;
  name: string;
  slug?: string;
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
  products: CompanyProduct[];
  relatedCompanies: {
    id: string;
    relationship: CompanyRelationType;
  }[];
  milestones: Milestone[];
  financials: FinancialMetric[];
}

export interface TherapeuticArea {
  id: string;
  name: string;
  description: string;
} 