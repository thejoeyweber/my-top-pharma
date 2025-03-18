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
  description?: string;
  
  /**
   * URL to the company logo image
   */
  logoUrl?: string;
  
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
  headquarters?: string;
  
  /**
   * Year the company was founded
   */
  founded?: string;
  
  /**
   * Approximate number of employees
   */
  employees?: number;
  
  /**
   * Market capitalization in billions USD
   */
  marketCap?: number;
  
  /**
   * Stock ticker symbol
   */
  stockSymbol?: string;
  
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
  createdAt?: string;
  
  /**
   * Last update timestamp
   */
  updatedAt?: string;
}

/**
 * Converts a database company record to the application Company model
 */
export function dbCompanyToCompany(dbCompany: DbCompany): Company {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    description: dbCompany.description || undefined,
    logoUrl: dbCompany.logo_url || undefined,
    headerImageUrl: dbCompany.header_image_url || undefined,
    headquarters: dbCompany.headquarters || undefined,
    founded: dbCompany.founded || undefined,
    website: dbCompany.website || undefined,
    marketCap: dbCompany.market_cap || undefined,
    employees: dbCompany.employees || undefined,
    stockSymbol: dbCompany.stock_symbol || undefined,
    stockExchange: dbCompany.stock_exchange || undefined,
    ownershipType: dbCompany.ownership_type || undefined,
    parentCompanyId: dbCompany.parent_company_id || undefined,
    createdAt: dbCompany.created_at || undefined,
    updatedAt: dbCompany.updated_at || undefined,
    slug: dbCompany.slug,
    therapeuticAreas: [], // This will be populated separately by joining with company_therapeutic_areas
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
    stock_symbol: company.stockSymbol || null,
    stock_exchange: company.stockExchange || null,
    ownership_type: company.ownershipType || null,
    parent_company_id: company.parentCompanyId || null,
    // Don't set created_at or updated_at, let the database handle those
    slug: company.slug || null,
    // therapeuticAreas is handled separately through the junction table
  };
} 