/**
 * Data Source Interface
 * 
 * Defines the standard interface for data sources used throughout the application.
 * This abstraction layer allows for consistent data access regardless of where
 * the data is coming from (Supabase, static files, API, etc.).
 */

import type { 
  Company, 
  Product, 
  TherapeuticArea, 
  Website 
} from './entities';

/**
 * Filtering options for Company queries
 */
export interface CompanyFilters {
  ids?: string[];
  name?: string;
  country?: string;
  type?: string;
  therapeuticAreaIds?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Filtering options for Product queries
 */
export interface ProductFilters {
  ids?: string[];
  name?: string;
  companyId?: string;
  stage?: string;
  therapeuticAreaIds?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Filtering options for TherapeuticArea queries
 */
export interface TherapeuticAreaFilters {
  ids?: string[];
  name?: string;
  limit?: number;
  offset?: number;
}

/**
 * Filtering options for Website queries
 */
export interface WebsiteFilters {
  ids?: string[];
  domain?: string;
  companyId?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

/**
 * DataSource interface defines the contract for data access
 */
export interface DataSource {
  /**
   * Initialize the data source
   */
  initialize(): Promise<void>;

  /**
   * Get companies with optional filtering
   */
  getCompanies(filters?: CompanyFilters): Promise<Company[]>;

  /**
   * Get a single company by ID
   */
  getCompanyById(id: string): Promise<Company | null>;

  /**
   * Get a single company by slug
   */
  getCompanyBySlug(slug: string): Promise<Company | null>;

  /**
   * Create a new company
   */
  createCompany(company: Partial<Company>): Promise<Company>;

  /**
   * Update an existing company
   */
  updateCompany(id: string, company: Partial<Company>): Promise<Company>;

  /**
   * Delete a company
   */
  deleteCompany(id: string): Promise<boolean>;

  /**
   * Get products with optional filtering
   */
  getProducts(filters?: ProductFilters): Promise<Product[]>;

  /**
   * Get a single product by ID
   */
  getProductById(id: string): Promise<Product | null>;

  /**
   * Get a single product by slug
   */
  getProductBySlug(slug: string): Promise<Product | null>;

  /**
   * Create a new product
   */
  createProduct(product: Partial<Product>): Promise<Product>;

  /**
   * Update an existing product
   */
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;

  /**
   * Delete a product
   */
  deleteProduct(id: string): Promise<boolean>;

  /**
   * Get therapeutic areas with optional filtering
   */
  getTherapeuticAreas(filters?: TherapeuticAreaFilters): Promise<TherapeuticArea[]>;

  /**
   * Get a single therapeutic area by ID
   */
  getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null>;

  /**
   * Get a single therapeutic area by slug
   */
  getTherapeuticAreaBySlug(slug: string): Promise<TherapeuticArea | null>;

  /**
   * Create a new therapeutic area
   */
  createTherapeuticArea(area: Partial<TherapeuticArea>): Promise<TherapeuticArea>;

  /**
   * Update an existing therapeutic area
   */
  updateTherapeuticArea(id: string, area: Partial<TherapeuticArea>): Promise<TherapeuticArea>;

  /**
   * Delete a therapeutic area
   */
  deleteTherapeuticArea(id: string): Promise<boolean>;

  /**
   * Get websites with optional filtering
   */
  getWebsites(filters?: WebsiteFilters): Promise<Website[]>;

  /**
   * Get a single website by ID
   */
  getWebsiteById(id: string): Promise<Website | null>;

  /**
   * Get websites by company ID
   */
  getWebsitesByCompanyId(companyId: string): Promise<Website[]>;

  /**
   * Create a new website
   */
  createWebsite(website: Partial<Website>): Promise<Website>;

  /**
   * Update an existing website
   */
  updateWebsite(id: string, website: Partial<Website>): Promise<Website>;

  /**
   * Delete a website
   */
  deleteWebsite(id: string): Promise<boolean>;
}

/**
 * Constructor for DataSource implementation
 */
export interface DataSourceConstructor {
  new (useAdmin?: boolean): DataSource;
} 