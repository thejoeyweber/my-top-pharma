/**
 * SupabaseDataSource.ts
 * 
 * Implementation of the DataSource interface that uses Supabase
 * as the data source.
 */

import type { DataSource, QueryOptions, PaginatedResult } from '../interfaces/DataSource';
import type { Company } from '../interfaces/entities/Company';
import type { Product } from '../interfaces/entities/Product';
import type { Website } from '../interfaces/entities/Website';
import type { TherapeuticArea } from '../interfaces/entities/TherapeuticArea';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase implementation of the DataSource interface
 */
export class SupabaseDataSource implements DataSource {
  private client: SupabaseClient;
  
  /**
   * Create a new SupabaseDataSource
   * @param supabaseUrl Supabase URL
   * @param supabaseKey Supabase API key
   */
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Check if the Supabase connection is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client.from('companies').select('count', { count: 'exact', head: true });
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }
  
  /**
   * Apply query options to a Supabase query
   * @param query The Supabase query to modify
   * @param options Query options to apply
   */
  private applyQueryOptions(query: any, options?: QueryOptions): any {
    let modifiedQuery = query;
    
    // Apply filters
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'string' && value.includes('%')) {
            // Handle LIKE queries
            modifiedQuery = modifiedQuery.ilike(key, value);
          } else {
            // Handle exact matches
            modifiedQuery = modifiedQuery.eq(key, value);
          }
        }
      }
    }
    
    // Apply sorting
    if (options?.sort) {
      const { field, direction } = options.sort;
      modifiedQuery = modifiedQuery.order(field, { ascending: direction === 'asc' });
    }
    
    // Apply pagination
    if (options?.pagination) {
      const { page, limit } = options.pagination;
      const start = (page - 1) * limit;
      const end = start + limit - 1;
      modifiedQuery = modifiedQuery.range(start, end);
    }
    
    return modifiedQuery;
  }
  
  /**
   * Transform a Supabase response into a PaginatedResult
   * @param data The data from Supabase
   * @param count The total count of items
   * @param options The query options used
   */
  private createPaginatedResult<T>(data: T[], count: number, options?: QueryOptions): PaginatedResult<T> {
    const page = options?.pagination?.page || 1;
    const limit = options?.pagination?.limit || 10;
    
    return {
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  }
  
  /**
   * Get a company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error('Error fetching company by ID:', error);
      return null;
    }
    
    return this.mapCompanyFromDb(data);
  }
  
  /**
   * Get companies with optional filtering, sorting, and pagination
   */
  async getCompanies(options?: QueryOptions): Promise<PaginatedResult<Company>> {
    // Get the count first
    const { count, error: countError } = await this.client
      .from('companies')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting companies:', countError);
      return this.createPaginatedResult([], 0, options);
    }
    
    // Then get the data with options applied
    let query = this.client.from('companies').select('*');
    query = this.applyQueryOptions(query, options);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching companies:', error);
      return this.createPaginatedResult([], 0, options);
    }
    
    const companies = data.map(this.mapCompanyFromDb);
    return this.createPaginatedResult(companies, count || 0, options);
  }
  
  /**
   * Get a product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return this.mapProductFromDb(data);
  }
  
  /**
   * Get products with optional filtering, sorting, and pagination
   */
  async getProducts(options?: QueryOptions): Promise<PaginatedResult<Product>> {
    // Get the count first
    const { count, error: countError } = await this.client
      .from('products')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting products:', countError);
      return this.createPaginatedResult([], 0, options);
    }
    
    // Then get the data with options applied
    let query = this.client.from('products').select('*');
    query = this.applyQueryOptions(query, options);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return this.createPaginatedResult([], 0, options);
    }
    
    const products = data.map(this.mapProductFromDb);
    return this.createPaginatedResult(products, count || 0, options);
  }
  
  /**
   * Get products for a specific company
   */
  async getProductsForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Product>> {
    // Add company filter to options
    const companyOptions: QueryOptions = {
      ...options,
      filters: {
        ...options?.filters,
        company_id: companyId
      }
    };
    
    return this.getProducts(companyOptions);
  }
  
  /**
   * Get a website by ID
   */
  async getWebsiteById(id: string): Promise<Website | null> {
    const { data, error } = await this.client
      .from('websites')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error('Error fetching website by ID:', error);
      return null;
    }
    
    return this.mapWebsiteFromDb(data);
  }
  
  /**
   * Get websites with optional filtering, sorting, and pagination
   */
  async getWebsites(options?: QueryOptions): Promise<PaginatedResult<Website>> {
    // Get the count first
    const { count, error: countError } = await this.client
      .from('websites')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting websites:', countError);
      return this.createPaginatedResult([], 0, options);
    }
    
    // Then get the data with options applied
    let query = this.client.from('websites').select('*');
    query = this.applyQueryOptions(query, options);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching websites:', error);
      return this.createPaginatedResult([], 0, options);
    }
    
    const websites = data.map(this.mapWebsiteFromDb);
    return this.createPaginatedResult(websites, count || 0, options);
  }
  
  /**
   * Get websites for a specific company
   */
  async getWebsitesForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Website>> {
    // Add company filter to options
    const companyOptions: QueryOptions = {
      ...options,
      filters: {
        ...options?.filters,
        company_id: companyId
      }
    };
    
    return this.getWebsites(companyOptions);
  }
  
  /**
   * Get a therapeutic area by ID
   */
  async getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null> {
    const { data, error } = await this.client
      .from('therapeutic_areas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      console.error('Error fetching therapeutic area by ID:', error);
      return null;
    }
    
    return this.mapTherapeuticAreaFromDb(data);
  }
  
  /**
   * Get therapeutic areas with optional filtering, sorting, and pagination
   */
  async getTherapeuticAreas(options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>> {
    // Get the count first
    const { count, error: countError } = await this.client
      .from('therapeutic_areas')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting therapeutic areas:', countError);
      return this.createPaginatedResult([], 0, options);
    }
    
    // Then get the data with options applied
    let query = this.client.from('therapeutic_areas').select('*');
    query = this.applyQueryOptions(query, options);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching therapeutic areas:', error);
      return this.createPaginatedResult([], 0, options);
    }
    
    const therapeuticAreas = data.map(this.mapTherapeuticAreaFromDb);
    return this.createPaginatedResult(therapeuticAreas, count || 0, options);
  }
  
  /**
   * Get therapeutic areas for a specific company
   */
  async getTherapeuticAreasForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>> {
    // First get the company to get its therapeutic areas
    const { data: company, error: companyError } = await this.client
      .from('companies')
      .select('therapeutic_areas')
      .eq('id', companyId)
      .single();
      
    if (companyError || !company || !company.therapeutic_areas) {
      console.error('Error fetching company therapeutic areas:', companyError);
      return this.createPaginatedResult([], 0, options);
    }
    
    // Then get the therapeutic areas that match the IDs
    const therapeuticAreaIds = company.therapeutic_areas;
    
    // Add therapeutic area IDs filter to options
    const taOptions: QueryOptions = {
      ...options,
      filters: {
        ...options?.filters,
        id: therapeuticAreaIds
      }
    };
    
    return this.getTherapeuticAreas(taOptions);
  }
  
  /**
   * Map a company from the database to the Company interface
   */
  private mapCompanyFromDb(dbCompany: any): Company {
    return {
      id: dbCompany.id,
      name: dbCompany.name,
      slug: dbCompany.slug,
      description: dbCompany.description,
      logoUrl: dbCompany.logo_url,
      websiteUrl: dbCompany.website_url,
      headquarters: dbCompany.headquarters,
      foundedYear: dbCompany.founded_year,
      employeeCount: dbCompany.employee_count,
      marketCapBillions: dbCompany.market_cap_billions,
      annualRevenueBillions: dbCompany.annual_revenue_billions,
      tickerSymbol: dbCompany.ticker_symbol,
      exchange: dbCompany.exchange,
      ceo: dbCompany.ceo,
      therapeuticAreas: dbCompany.therapeutic_areas || []
    };
  }
  
  /**
   * Map a product from the database to the Product interface
   */
  private mapProductFromDb(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      genericName: dbProduct.generic_name,
      companyId: dbProduct.company_id,
      description: dbProduct.description,
      stage: dbProduct.stage,
      therapeuticAreas: dbProduct.therapeutic_areas || [],
      indications: dbProduct.indications || [],
      moleculeType: dbProduct.molecule_type,
      imageUrl: dbProduct.image_url,
      timeline: dbProduct.timeline || [],
      approvals: dbProduct.approvals || [],
      website: dbProduct.website,
      patents: dbProduct.patents || []
    };
  }
  
  /**
   * Map a website from the database to the Website interface
   */
  private mapWebsiteFromDb(dbWebsite: any): Website {
    return {
      id: dbWebsite.id,
      domain: dbWebsite.domain,
      siteName: dbWebsite.site_name,
      category: dbWebsite.category,
      description: dbWebsite.description,
      companyId: dbWebsite.company_id,
      launchDate: dbWebsite.launch_date,
      lastUpdated: dbWebsite.last_updated,
      products: dbWebsite.products || [],
      therapeuticAreas: dbWebsite.therapeutic_areas || [],
      regions: dbWebsite.regions || [],
      screenshotUrl: dbWebsite.screenshot_url,
      url: dbWebsite.url,
      hasSSL: dbWebsite.has_ssl,
      technologies: dbWebsite.technologies || [],
      subcategories: dbWebsite.subcategories || [],
      region: dbWebsite.region,
      screenshotDate: dbWebsite.screenshot_date,
      techStack: dbWebsite.tech_stack,
      hosting: dbWebsite.hosting,
      features: dbWebsite.features || [],
      disclaimers: dbWebsite.disclaimers,
      legalContent: dbWebsite.legal_content || [],
      lastCrawl: dbWebsite.last_crawl,
      status: dbWebsite.status
    };
  }
  
  /**
   * Map a therapeutic area from the database to the TherapeuticArea interface
   */
  private mapTherapeuticAreaFromDb(dbTA: any): TherapeuticArea {
    return {
      id: dbTA.id,
      name: dbTA.name,
      slug: dbTA.slug,
      description: dbTA.description,
      iconUrl: dbTA.icon_url,
      imageUrl: dbTA.image_url,
      isPrimary: dbTA.is_primary,
      parentId: dbTA.parent_id,
      companyIds: dbTA.company_ids || [],
      productIds: dbTA.product_ids || [],
      alternativeNames: dbTA.alternative_names || [],
      relatedConditions: dbTA.related_conditions || [],
      marketSizeBillions: dbTA.market_size_billions,
      growthRate: dbTA.growth_rate,
      updatedAt: dbTA.updated_at,
      color: dbTA.color
    };
  }
} 