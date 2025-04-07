/**
 * Company Entity Interface
 * 
 * Defines the standard structure for company data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent company data regardless of source.
 * 
 * This is the canonical definition for Company entities in the application.
 */

import type { Database } from '../../types/database';

// Database types for reference
export type DbCompany = Database['public']['Tables']['companies']['Row'];
export type DbCompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type DbCompanyUpdate = Database['public']['Tables']['companies']['Update'];

// Related types
export type CompanyRelationType = 'competitor' | 'partner' | 'subsidiary' | 'parent';

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
}

export interface FinancialMetric {
  id: string;
  year: number;
  revenue: number;
  rAndDSpending: number;
  netIncome: number;
}

// Simplified product type to avoid circular dependency
export interface CompanyProduct {
  id: string;
  name: string;
  description: string;
  stage: string;
  therapeuticAreas: string[];
}

// Simplified related company to avoid circular dependency
export interface RelatedCompany {
  id: string;
  relatedCompanyId: string;
  relationshipType: CompanyRelationType;
}

/**
 * Main Company interface
 */
export interface Company {
  /**
   * Unique identifier for the company
   */
  id: string;
  
  /**
   * Company name
   */
  name: string;
  
  /**
   * URL-friendly version of the name
   */
  slug: string;
  
  /**
   * Company description or overview
   */
  description: string;
  
  /**
   * URL to the company logo image
   */
  logoUrl: string;
  
  /**
   * URL to the company header image (optional)
   */
  headerImageUrl?: string;
  
  /**
   * URL to the company website
   */
  website?: string;
  
  /**
   * Location of company headquarters
   */
  headquarters: string;
  
  /**
   * Year the company was founded
   */
  founded?: number;
  
  /**
   * Approximate number of employees
   */
  employees?: number;
  
  /**
   * Market capitalization in billions USD
   */
  marketCap: number;
  
  /**
   * Stock ticker symbol
   */
  tickerSymbol?: string;
  
  /**
   * Stock exchange where the company is listed
   */
  stockExchange?: string;
  
  /**
   * Type of ownership (e.g., public, private, subsidiary)
   */
  ownershipType?: string;
  
  /**
   * ID of parent company, if applicable
   */
  parentCompanyId?: string;
  
  /**
   * IDs of therapeutic areas associated with the company
   */
  therapeuticAreas?: string[];
  
  /**
   * Products associated with the company
   */
  products?: CompanyProduct[];
  
  /**
   * Related companies (competitors, partners, etc.)
   */
  relatedCompanies?: RelatedCompany[];
  
  /**
   * Company milestones
   */
  milestones?: Milestone[];
  
  /**
   * Financial metrics
   */
  financials?: FinancialMetric[];
  
  /**
   * Creation timestamp
   */
  createdAt: string;
  
  /**
   * Last update timestamp
   */
  updatedAt: string;
}

/**
 * Interface for Company with Therapeutic Areas
 */
export interface CompanyWithTAs extends Company {
  therapeuticAreas: string[];
}

/**
 * Options for filtering and sorting company data
 */
export interface CompanyFilter {
  search?: string;
  regions?: string[];
  minMarketCap?: number;
  maxMarketCap?: number;
  therapeuticAreaIds?: string[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Result type for paginated company queries
 */
export interface CompanyListResponse {
  companies: Company[];
  total: number;
}

/**
 * Interface for Company database records
 */
export interface DBCompany {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  logo_url: string | null;
  market_cap: number | null;
  headquarters: string | null;
  created_at: string | null;
  updated_at: string | null;
  founded: number | null;
}

/**
 * Convert a database company record to a Company
 */
export function dbCompanyToCompany(dbCompany: DBCompany): Company {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    slug: dbCompany.slug || '',
    description: dbCompany.description || '',
    logoUrl: dbCompany.logo_url || '',
    marketCap: dbCompany.market_cap || 0,
    headquarters: dbCompany.headquarters || '',
    founded: dbCompany.founded || undefined,
    createdAt: dbCompany.created_at || '',
    updatedAt: dbCompany.updated_at || ''
  };
}

/**
 * Converts an application Company model to a database insert record
 */
export function companyToDbCompany(company: Partial<Company>): Partial<DbCompany> {
  return {
    id: company.id,
    name: company.name,
    description: company.description || null,
    logo_url: company.logoUrl || null,
    header_image_url: company.headerImageUrl || null,
    headquarters: company.headquarters || null,
    founded: company.founded || null,
    website: company.website || null,
    market_cap: company.marketCap || null,
    employees: company.employees || null,
    ticker_symbol: company.tickerSymbol || null,
    stock_exchange: company.stockExchange || null,
    ownership_type: company.ownershipType || null,
    parent_company_id: company.parentCompanyId || null,
    // Don't set created_at or updated_at, let the database handle those
    slug: company.slug || null,
    // therapeuticAreas is handled separately through the junction table
  };
} 