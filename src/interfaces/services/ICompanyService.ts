import type { Company } from "../entities/Company";

/**
 * Options for fetching a list of companies.
 */
export interface CompanyListOptions {
  filterText?: string; // For searching company names, descriptions, etc.
  therapeuticAreaSlugs?: string[]; // Filter by associated therapeutic areas
  sortBy?: "name_asc" | "name_desc" | "relevance"; // Example sorting options
  page?: number; // For pagination
  pageSize?: number; // For pagination
}

/**
 * Defines the contract for a service handling company-related data operations.
 */
export interface ICompanyService {
  /**
   * Retrieves a paginated and potentially filtered/sorted list of companies.
   *
   * @param options - Filtering, sorting, and pagination parameters.
   * @returns A promise that resolves to an array of Company objects.
   */
  getCompanies(options?: CompanyListOptions): Promise<Company[]>;

  /**
   * Retrieves the detailed information for a single company by its unique slug.
   *
   * @param slug - The unique slug identifier for the company.
   * @returns A promise that resolves to a Company object, or null if not found.
   */
  getCompanyDetails(slug: string): Promise<Company | null>;

  // Add other potential methods as needed, e.g.:
  // getCompanyCount(options?: Pick<CompanyListOptions, 'filterText' | 'therapeuticAreaSlugs'>): Promise<number>;
  // getRelatedCompanies(slug: string, limit?: number): Promise<Company[]>;
}

// ... existing code ... 