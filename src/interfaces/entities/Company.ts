/**
 * Company Entity Interface
 * 
 * Defines the standard structure for company data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent company data regardless of source.
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
   * URL to the company website
   */
  websiteUrl: string;
  
  /**
   * Location of company headquarters
   */
  headquarters: string;
  
  /**
   * Year the company was founded
   */
  foundedYear: number | null;
  
  /**
   * Approximate number of employees
   */
  employeeCount: number | null;
  
  /**
   * Market capitalization in billions USD
   */
  marketCapBillions: number | null;
  
  /**
   * Annual revenue in billions USD
   */
  annualRevenueBillions: number | null;
  
  /**
   * Stock ticker symbol
   */
  tickerSymbol: string;
  
  /**
   * Stock exchange where the company is listed
   */
  exchange: string;
  
  /**
   * Name of the CEO
   */
  ceo: string;
  
  /**
   * IDs of therapeutic areas associated with the company
   */
  therapeuticAreas: string[];
} 