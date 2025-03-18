/**
 * Company Data Utilities
 * 
 * Standardized functions for accessing company data from various sources:
 * - Static JSON files (legacy/mock data)
 * - Local Database (development)
 * - Remote Database (production)
 * 
 * This consolidated module uses feature flags to determine data sources
 * and implements consistent error handling and type safety.
 */

import { supabase } from './supabase';
import { getFeatureFlag, FEATURES } from './featureFlags';
import { companies as mockCompanies } from './dataUtils';
import * as stringUtils from './stringUtils';
import { 
  handleDatabaseError, 
  createNotFoundError, 
  ErrorCategory, 
  type ErrorResponse 
} from './errorUtils';

// Import JSON data for mock responses
import companyFinancialsData from '../data/json/companyFinancials.json';
import companyMetricsData from '../data/json/companyMetrics.json';
import companyStockData from '../data/json/companyStockData.json';

// Import canonical types
import type { 
  Company, 
  CompanyProduct, 
  FinancialMetric, 
  DbCompany,
  dbCompanyToCompany
} from '../interfaces/entities/Company';

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
  stockSymbol?: string | null;
  stockExchange?: string | null;
  therapeuticAreas?: string[];
  products?: any[];
  [key: string]: any;
}

interface MockFinancial {
  stockSymbol: string;
  data: FinancialMetric[];
}

interface MockStockData {
  stockSymbol: string;
  data: any[];
}

interface MockMetrics {
  stockSymbol: string;
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
    stockSymbol: dbCompany.stock_symbol,
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
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    return await getCompaniesFromDatabase();
  } else {
    try {
      const companies = await getCompaniesFromJson();
      return { data: companies };
    } catch (error) {
      return { 
        error: {
          message: 'Error loading companies from JSON data',
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
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
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
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
      return { data: transformDatabaseCompany(data) as Company };
    } catch (error) {
      return { 
        error: handleDatabaseError(error, 'fetch', 'company', identifier)
      };
    }
  } else {
    // Use mock data
    try {
      const companies = await getCompaniesFromJson();
      
      // Find by ID or slug based on the type parameter
      const company = type === 'slug' 
        ? companies.find(company => company.slug === identifier)
        : type === 'id'
          ? companies.find(company => company.id === identifier)
          : companies.find(company => company.id === identifier || company.slug === identifier);
      
      if (!company) {
        return { 
          error: createNotFoundError('Company', identifier)
        };
      }
      
      return { data: company };
    } catch (error) {
      return { 
        error: {
          message: `Error fetching mock company with identifier ${identifier}`,
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
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
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    try {
      const companies = await getCompaniesByTherapeuticAreaFromDatabase(taId);
      return { data: companies };
    } catch (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'companies by therapeutic area', taId)
      };
    }
  } else {
    try {
      const companies = await getCompaniesByTherapeuticAreaFromJson(taId);
      return { data: companies };
    } catch (error) {
      return {
        error: {
          message: `Error fetching companies for therapeutic area ${taId}`,
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
  }
}

/**
 * Get company financials
 * 
 * @param stockSymbol Company stock symbol
 * @returns Promise<Result<FinancialMetric[]>> Result with array of financial metrics or error
 */
export async function getCompanyFinancials(stockSymbol: string): Promise<Result<FinancialMetric[]>> {
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    try {
      const financials = await getCompanyFinancialsFromDatabase(stockSymbol);
      return { data: financials };
    } catch (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'financials', stockSymbol)
      };
    }
  } else {
    try {
      const financials = await getCompanyFinancialsFromJson(stockSymbol);
      return { data: financials };
    } catch (error) {
      return {
        error: {
          message: `Error fetching financials for company with stock symbol ${stockSymbol}`,
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
  }
}

/**
 * Get company stock data
 * 
 * @param stockSymbol Company stock symbol
 * @returns Promise<Result<any>> Result with stock data or error
 */
export async function getCompanyStockData(stockSymbol: string): Promise<Result<any>> {
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    try {
      const stockData = await getCompanyStockDataFromDatabase(stockSymbol);
      return { data: stockData };
    } catch (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'stock data', stockSymbol)
      };
    }
  } else {
    try {
      const stockData = await getCompanyStockDataFromJson(stockSymbol);
      return { data: stockData };
    } catch (error) {
      return {
        error: {
          message: `Error fetching stock data for company with stock symbol ${stockSymbol}`,
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
  }
}

/**
 * Get company metrics
 * 
 * @param stockSymbol Company stock symbol
 * @returns Promise<Result<any>> Result with company metrics or error
 */
export async function getCompanyMetrics(stockSymbol: string): Promise<Result<any>> {
  const useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANIES);
  
  if (useDatabase) {
    try {
      const metrics = await getCompanyMetricsFromDatabase(stockSymbol);
      return { data: metrics };
    } catch (error) {
      return {
        error: handleDatabaseError(error, 'fetch', 'metrics', stockSymbol)
      };
    }
  } else {
    try {
      const metrics = await getCompanyMetricsFromJson(stockSymbol);
      return { data: metrics };
    } catch (error) {
      return {
        error: {
          message: `Error fetching metrics for company with stock symbol ${stockSymbol}`,
          category: ErrorCategory.INTERNAL,
          originalError: error
        }
      };
    }
  }
}

/**
 * Get related companies
 * 
 * @param companyId Company ID
 * @returns Promise<Result<Company[]>> Result with array of related companies or error
 */
export async function getRelatedCompanies(companyId: string): Promise<Result<Company[]>> {
  // This is a placeholder - in a real implementation, we would fetch related companies
  // based on relationships stored in the database
  try {
    const allCompanies = await getCompanies();
    if (allCompanies.error) {
      return allCompanies as Result<Company[]>;
    }
    
    const relatedCompanies = allCompanies.data?.filter(company => company.id !== companyId).slice(0, 3) || [];
    return { data: relatedCompanies };
  } catch (error) {
    return {
      error: {
        message: `Error fetching related companies for company ${companyId}`,
        category: ErrorCategory.INTERNAL,
        originalError: error
      }
    };
  }
}

// -------------------------------------------------------------------------
// Private implementation functions
// -------------------------------------------------------------------------

/**
 * Get companies from JSON (mock data)
 */
async function getCompaniesFromJson(): Promise<Company[]> {
  try {
    // Convert mock data to Company type
    return (mockCompanies as MockCompany[]).map(company => ({
      id: company.id,
      name: company.name,
      slug: company.slug || stringUtils.generateSlug(company.name),
      description: company.description,
      logoUrl: company.logoUrl,
      headerImageUrl: company.headerImageUrl,
      websiteUrl: company.websiteUrl || '',
      headquarters: company.headquarters,
      foundedYear: company.foundedYear || null,
      employeeCount: company.employeeCount || null,
      marketCapBillions: company.marketCapBillions || null,
      annualRevenueBillions: null, // Not available in mock data
      isPublic: !!company.stockSymbol,
      stockSymbol: company.stockSymbol || null,
      stockExchange: company.stockExchange || null,
      ceo: null, // Not available in mock data
      therapeuticAreas: company.therapeuticAreas || [],
      products: company.products as CompanyProduct[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })) as Company[];
  } catch (error) {
    console.error('Error loading companies from JSON:', error);
    throw error;
  }
}

/**
 * Get companies from database
 */
async function getCompaniesFromDatabase(): Promise<Result<Company[]>> {
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
 * Get companies by therapeutic area from database
 */
async function getCompaniesByTherapeuticAreaFromDatabase(therapeuticAreaId: string): Promise<Company[]> {
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
      .contains('therapeutic_areas', [therapeuticAreaId]);
      
    if (error) {
      console.error('Error fetching companies by therapeutic area:', error);
      throw error;
    }
    
    return (data || []).map((company: any) => transformDatabaseCompany(company) as Company);
  } catch (error) {
    console.error('Error fetching companies by therapeutic area:', error);
    throw error;
  }
}

/**
 * Get companies by therapeutic area from JSON
 */
function getCompaniesByTherapeuticAreaFromJson(therapeuticAreaId: string): Company[] {
  try {
    return (mockCompanies as MockCompany[])
      .filter(company => company.therapeuticAreas && company.therapeuticAreas.includes(therapeuticAreaId))
      .map(company => ({
        id: company.id,
        name: company.name,
        slug: company.slug || stringUtils.generateSlug(company.name),
        description: company.description,
        logoUrl: company.logoUrl,
        websiteUrl: company.websiteUrl || '',
        headquarters: company.headquarters,
        foundedYear: company.foundedYear || null,
        employeeCount: company.employeeCount || null,
        marketCapBillions: company.marketCapBillions || null,
        annualRevenueBillions: null,
        isPublic: !!company.stockSymbol,
        stockSymbol: company.stockSymbol || null,
        stockExchange: company.stockExchange || null,
        ceo: null,
        therapeuticAreas: company.therapeuticAreas || [],
        products: company.products as CompanyProduct[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })) as Company[];
  } catch (error) {
    console.error('Error filtering companies by therapeutic area:', error);
    throw error;
  }
}

/**
 * Get company financials from database
 */
async function getCompanyFinancialsFromDatabase(stockSymbol: string): Promise<FinancialMetric[]> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_financials')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('stock_symbol', stockSymbol)
      .order('fiscal_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching company financials:', error);
      throw error;
    }
    
    return (data || []).map((item: any) => ({
      year: new Date(item.fiscal_date).getFullYear(),
      revenue: item.revenue || 0,
      rAndDSpending: item.r_and_d_expense || 0,
      netIncome: item.net_income || 0
    }));
  } catch (error) {
    console.error('Error fetching company financials:', error);
    throw error;
  }
}

/**
 * Get company financials from JSON
 */
function getCompanyFinancialsFromJson(stockSymbol: string): FinancialMetric[] {
  try {
    const financials = (companyFinancialsData as unknown as MockFinancial[])
      .find(item => item.stockSymbol === stockSymbol);
    return financials?.data || [];
  } catch (error) {
    console.error('Error fetching company financials from JSON:', error);
    throw error;
  }
}

/**
 * Get company stock data from database
 */
async function getCompanyStockDataFromDatabase(stockSymbol: string): Promise<any> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_stock_data')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('stock_symbol', stockSymbol)
      .order('date', { ascending: false })
      .limit(30);
      
    if (error) {
      console.error('Error fetching company stock data:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company stock data:', error);
    throw error;
  }
}

/**
 * Get company stock data from JSON
 */
function getCompanyStockDataFromJson(stockSymbol: string): any {
  try {
    return (companyStockData as unknown as MockStockData[])
      .find(item => item.stockSymbol === stockSymbol);
  } catch (error) {
    console.error('Error fetching company stock data from JSON:', error);
    throw error;
  }
}

/**
 * Get company metrics from database
 */
async function getCompanyMetricsFromDatabase(stockSymbol: string): Promise<any> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // @ts-ignore: TypeScript has issues with Supabase's method chaining
    const { data, error } = await supabase
      .from('company_metrics')
      .select('*')
      // @ts-ignore: TypeScript has issues with Supabase query methods
      .eq('stock_symbol', stockSymbol)
      .order('date', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching company metrics:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company metrics:', error);
    throw error;
  }
}

/**
 * Get company metrics from JSON
 */
function getCompanyMetricsFromJson(stockSymbol: string): any {
  try {
    return (companyMetricsData as unknown as MockMetrics[])
      .find(item => item.stockSymbol === stockSymbol);
  } catch (error) {
    console.error('Error fetching company metrics from JSON:', error);
    throw error;
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