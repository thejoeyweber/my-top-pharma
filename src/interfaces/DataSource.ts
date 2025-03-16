/**
 * Data Source Abstraction Layer
 * 
 * This file defines the core interfaces for the data source abstraction layer,
 * which provides consistent data access patterns regardless of the underlying
 * data source (JSON, Supabase, external APIs, etc.).
 */

import type { Company } from './entities/Company';
import type { Product } from './entities/Product';
import type { Website } from './entities/Website';
import type { TherapeuticArea } from './entities/TherapeuticArea';

/**
 * Query options for filtering, sorting, and paginating results
 */
export interface QueryOptions {
  /**
   * Filter criteria as key-value pairs
   */
  filters?: Record<string, unknown>;
  
  /**
   * Sorting configuration
   */
  sort?: {
    /**
     * Field to sort by
     */
    field: string;
    
    /**
     * Sort direction
     */
    direction: 'asc' | 'desc';
  };
  
  /**
   * Pagination options
   */
  pagination?: {
    /**
     * Page number (1-indexed)
     */
    page: number;
    
    /**
     * Number of items per page
     */
    limit: number;
  };
}

/**
 * Result structure for paginated queries
 */
export interface PaginatedResult<T> {
  /**
   * Array of items for the current page
   */
  data: T[];
  
  /**
   * Pagination metadata
   */
  pagination: {
    /**
     * Total number of items across all pages
     */
    total: number;
    
    /**
     * Current page number
     */
    page: number;
    
    /**
     * Number of items per page
     */
    limit: number;
    
    /**
     * Total number of pages
     */
    pages: number;
  };
}

/**
 * Core interface for data sources
 * 
 * This interface defines a consistent API for accessing data
 * regardless of the underlying data source (JSON, Supabase, external APIs, etc.)
 */
export interface DataSource {
  /**
   * Check if the data source is healthy and accessible
   * @returns Promise resolving to true if healthy, false otherwise
   */
  healthCheck(): Promise<boolean>;
  
  /**
   * Get a company by ID
   * @param id Company ID
   * @returns Promise resolving to the company or null if not found
   */
  getCompanyById(id: string): Promise<Company | null>;
  
  /**
   * Get companies with optional filtering, sorting, and pagination
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated companies
   */
  getCompanies(options?: QueryOptions): Promise<PaginatedResult<Company>>;
  
  /**
   * Get a product by ID
   * @param id Product ID
   * @returns Promise resolving to the product or null if not found
   */
  getProductById(id: string): Promise<Product | null>;
  
  /**
   * Get products with optional filtering, sorting, and pagination
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated products
   */
  getProducts(options?: QueryOptions): Promise<PaginatedResult<Product>>;
  
  /**
   * Get products for a specific company
   * @param companyId Company ID
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated products for the company
   */
  getProductsForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Product>>;
  
  /**
   * Get a website by ID
   * @param id Website ID
   * @returns Promise resolving to the website or null if not found
   */
  getWebsiteById(id: string): Promise<Website | null>;
  
  /**
   * Get websites with optional filtering, sorting, and pagination
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated websites
   */
  getWebsites(options?: QueryOptions): Promise<PaginatedResult<Website>>;
  
  /**
   * Get websites for a specific company
   * @param companyId Company ID
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated websites for the company
   */
  getWebsitesForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<Website>>;
  
  /**
   * Get a therapeutic area by ID
   * @param id Therapeutic area ID
   * @returns Promise resolving to the therapeutic area or null if not found
   */
  getTherapeuticAreaById(id: string): Promise<TherapeuticArea | null>;
  
  /**
   * Get therapeutic areas with optional filtering, sorting, and pagination
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated therapeutic areas
   */
  getTherapeuticAreas(options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>>;
  
  /**
   * Get therapeutic areas for a specific company
   * @param companyId Company ID
   * @param options Query options for filtering, sorting, and pagination
   * @returns Promise resolving to paginated therapeutic areas for the company
   */
  getTherapeuticAreasForCompany(companyId: string, options?: QueryOptions): Promise<PaginatedResult<TherapeuticArea>>;
} 