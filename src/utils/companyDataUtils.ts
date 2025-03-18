/**
 * Company Data Utilities
 * 
 * Standardized functions for accessing company data from database sources:
 * - Local Database (development)
 * - Remote Database (production)
 * 
 * This consolidated module implements consistent error handling and type safety.
 */

import { supabase } from '../lib/supabase';
import { getFeatureFlag } from './featureFlags';
import { FEATURES } from './constants';
import { 
  handleDatabaseError, 
  createNotFoundError, 
  ErrorCategory, 
  type ErrorResponse 
} from './errorUtils';

// Import canonical types
import type { Company, FinancialMetric } from '../interfaces/entities';

// Import database types
import type { Database } from '../types/database';
import type { PostgrestError } from '@supabase/supabase-js';

// Define mock data types
interface MockCompany {
  id: string;
  name: string;
  slug?: string;
  description: string;
  logoUrl: string;
  headerImageUrl?: string;
  websiteUrl?: string;
  headquarters: string;
  foundedYear?: number | null;
  employeeCount?: number | null;
  marketCapBillions?: number | null;
  tickerSymbol?: string | null;
  stockExchange?: string | null;
  therapeuticAreas?: string[];
  products?: any[];
  [key: string]: any;
}

interface MockFinancial {
  tickerSymbol: string;
  data: FinancialMetric[];
}

interface MockStockData {
  tickerSymbol: string;
  data: any[];
}

interface MockMetrics {
  tickerSymbol: string;
  data: any;
}

// Interface for function results with error handling
export interface Result<T> {
  data?: T;
  error?: ErrorResponse;
}

/**
 * Transform a database company record to the application Company model
 * 
 * @param dbCompany Company record from database
 * @returns Transformed company object matching the expected shape
 */
export function transformDatabaseCompany(dbCompany: any): Partial<Company> {
  // For null/undefined records
  if (!dbCompany) return {};
  
  return {
    id: dbCompany.id.toString(),
    name: dbCompany.name,
    slug: dbCompany.slug || stringUtils.generateSlug(dbCompany.name),
    description: dbCompany.description || '',
    logoUrl: dbCompany.logo_url || '/placeholder-logo.png',
    headerImageUrl: dbCompany.header_image_url,
    websiteUrl: dbCompany.website || '',
    headquarters: dbCompany.headquarters || 'Unknown',
    foundedYear: dbCompany.founded_year,
    employeeCount: dbCompany.employee_count,
    marketCapBillions: dbCompany.market_cap_billions,
    annualRevenueBillions: dbCompany.annual_revenue_billions,
    isPublic: dbCompany.public_company || false,
    tickerSymbol: dbCompany.ticker_symbol,
    stockExchange: dbCompany.stock_exchange,
    ceo: dbCompany.ceo,
    therapeuticAreas: dbCompany.therapeutic_areas || [],
    products: dbCompany.products || [],
    relatedCompanies: dbCompany.related_companies || [],
    milestones: dbCompany.milestones || [],
    financials: dbCompany.financials || [],
    createdAt: dbCompany.created_at,
    updatedAt: dbCompany.updated_at
  };
}

/**
 * Get all companies
 * 
 * @returns Promise<Result<Company[]>> Result with array of companies or error
 */
export async function getCompanies(): Promise<Result<Company[]>> {
  try {
    if (!supabase) {
      return {
        error: {
          message: 'Supabase client not initialized',
          category: ErrorCategory.INTERNAL
        }
      };
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('companies')
      .select('*, therapeutic_areas(*)')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .order('name');
      
    if (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'companies')
      };
    }
    
    const companies = (data || []).map((company: any) => transformDatabaseCompany(company) as Company);
    return { data: companies };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'companies')
    };
  }
}

/**
 * Get a company by ID or slug
 * 
 * @param identifier Company ID or slug
 * @param type Specify if the identifier is an 'id' or 'slug' (auto-detect if not specified)
 * @returns Promise<Result<Company>> Result with company or error
 */
export async function getCompany(
  identifier: string,
  type?: 'id' | 'slug'
): Promise<Result<Company>> {
  try {
    // Determine field to query based on type parameter or guess based on format
    let field = type;
    if (!field) {
      // If no type specified, try to guess - UUIDs and numeric strings are likely IDs
      const isIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier) || 
                        /^\d+$/.test(identifier);
      field = isIdPattern ? 'id' : 'slug';
    }
    
    if (!supabase) {
      return {
        error: {
          message: 'Supabase client not initialized',
          category: ErrorCategory.INTERNAL
        }
      };
    }
    
    // Execute query
    let data;
    let error;
    
    try {
      if (field === 'id') {
        // @ts-ignore: TypeScript has issues with Supabase's method chaining
        const result = await supabase
          .from('companies')
          .select('*, therapeutic_areas(*)')
          // @ts-ignore: TypeScript has issues with Supabase query methods
          .eq('id', identifier)
          .single();
        data = result.data;
        error = result.error;
      } else {
        // @ts-ignore: TypeScript has issues with Supabase's method chaining
        const result = await supabase
          .from('companies')
          .select('*, therapeutic_areas(*)')
          // @ts-ignore: TypeScript has issues with Supabase query methods
          .eq('slug', identifier)
          .single();
        data = result.data;
        error = result.error;
      }
    } catch (queryError) {
      return {
        error: {
          message: 'Error executing database query',
          category: ErrorCategory.DATABASE,
          originalError: queryError
        }
      };
    }
    
    // Handle errors
    if (error) {
      return { 
        error: handleDatabaseError(error, 'fetch', 'company', identifier)
      };
    }
    
    // Handle not found case
    if (!data) {
      return { 
        error: createNotFoundError('Company', identifier)
      };
    }
    
    // Transform and return the data
    return { data: data as Company };
  } catch (error) {
    return { 
      error: handleDatabaseError(error, 'fetch', 'company', identifier)
    };
  }
}

/**
 * Get a company by ID (legacy method - use getCompany instead)
 * @deprecated Use getCompany(id, 'id') instead
 */
export async function getCompanyById(id: string): Promise<Company | undefined> {
  const result = await getCompany(id, 'id');
  return result.data;
}

/**
 * Get a company by slug (legacy method - use getCompany instead)
 * @deprecated Use getCompany(slug, 'slug') instead
 */
export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  const result = await getCompany(slug, 'slug');
  return result.data;
}

/**
 * Get companies by therapeutic area
 * 
 * @param taId Therapeutic area ID
 * @returns Promise<Result<Company[]>> Result with array of companies or error
 */
export async function getCompaniesByTherapeuticArea(taId: string): Promise<Result<Company[]>> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // This is a simplified implementation - in a real app, we would use a join table
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .contains('therapeutic_areas', [taId]);
      
    if (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'companies by therapeutic area', taId)
      };
    }
    
    const companies = (data || []).map((company: any) => transformDatabaseCompany(company) as Company);
    return { data: companies };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'companies by therapeutic area', taId)
    };
  }
}

/**
 * Get company financials
 * 
 * @param tickerSymbol Company ticker symbol
 * @returns Promise<Result<FinancialMetric[]>> Result with array of financial metrics or error
 */
export async function getCompanyFinancials(tickerSymbol: string): Promise<Result<FinancialMetric[]>> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_financials')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('ticker_symbol', tickerSymbol)
      .order('fiscal_date', { ascending: false });
      
    if (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'financials', tickerSymbol)
      };
    }
    
    const financials = (data || []).map((item: any) => ({
      year: new Date(item.fiscal_date).getFullYear(),
      revenue: item.revenue || 0,
      rAndDSpending: item.r_and_d_expense || 0,
      netIncome: item.net_income || 0
    }));
    
    return { data: financials };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'financials', tickerSymbol)
    };
  }
}

/**
 * Get company stock data
 * 
 * @param tickerSymbol Company ticker symbol
 * @returns Promise<Result<any>> Result with stock data or error
 */
export async function getCompanyStockData(tickerSymbol: string): Promise<Result<any>> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_stock_data')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('ticker_symbol', tickerSymbol)
      .order('date', { ascending: false })
      .limit(30);
      
    if (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'stock data', tickerSymbol)
      };
    }
    
    return { data };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'stock data', tickerSymbol)
    };
  }
}

/**
 * Get company metrics
 * 
 * @param tickerSymbol Company ticker symbol
 * @returns Promise<Result<any>> Result with company metrics or error
 */
export async function getCompanyMetrics(tickerSymbol: string): Promise<Result<any>> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_metrics')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('ticker_symbol', tickerSymbol)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'metrics', tickerSymbol)
      };
    }
    
    return { data };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'metrics', tickerSymbol)
    };
  }
}

/**
 * Get related companies
 * 
 * @param companyId Company ID
 * @returns Promise<Result<Company[]>> Result with array of related companies or error
 */
export async function getRelatedCompanies(companyId: string): Promise<Result<Company[]>> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // Get companies related by therapeutic area
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('therapeutic_areas')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('id', companyId)
      .single();
      
    if (companyError) {
      return {
        error: handleDatabaseError(companyError, 'fetch', 'related companies', companyId)
      };
    }
    
    if (!company || !company.therapeutic_areas || company.therapeutic_areas.length === 0) {
      return { data: [] };
    }
    
    // Get companies with similar therapeutic areas
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data: relatedData, error: relatedError } = await supabase
      .from('companies')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .neq('id', companyId)
      .overlaps('therapeutic_areas', company.therapeutic_areas)
      .limit(5);
      
    if (relatedError) {
      return {
        error: handleDatabaseError(relatedError, 'fetch', 'related companies', companyId)
      };
    }
    
    const relatedCompanies = (relatedData || []).map((company: any) => 
      transformDatabaseCompany(company) as Company
    );
    
    return { data: relatedCompanies };
  } catch (error) {
    return {
      error: handleDatabaseError(error, 'fetch', 'related companies', companyId)
    };
  }
}

// Export a namespace for all company utilities
export const companyDataUtils = {
  getCompanies,
  getCompany,
  getCompanyById,
  getCompanyBySlug,
  getCompaniesByTherapeuticArea,
  getCompanyFinancials,
  getCompanyStockData,
  getCompanyMetrics,
  getRelatedCompanies,
  transformDatabaseCompany
}; 