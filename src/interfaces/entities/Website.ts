/**
 * Website Entity Interface
 * 
 * Defines the standard structure for pharmaceutical website data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent website data regardless of source.
 */

/**
 * Website categories for pharmaceutical sites
 */
export type WebsiteCategory = 
  | 'corporate'
  | 'hcp'
  | 'patient'
  | 'campaign'
  | 'ir'
  | 'clinical-trials'
  | 'disease-education'
  | 'product';

/**
 * Technical stack information for a website
 */
export interface WebsiteTechStack {
  /**
   * Content Management System
   */
  cms?: string;
  
  /**
   * Web development framework
   */
  framework?: string;
  
  /**
   * Server technology
   */
  server?: string;
  
  /**
   * Analytics platform
   */
  analytics?: string;
  
  /**
   * Email service provider
   */
  emailService?: string;
  
  /**
   * Marketing automation platform
   */
  marketingAutomation?: string;
  
  /**
   * Content Delivery Network provider
   */
  cdnProvider?: string;
  
  /**
   * Search technology
   */
  searchTechnology?: string;
  
  /**
   * Chat/bot provider
   */
  chatProvider?: string;
}

/**
 * Hosting information for a website
 */
export interface WebsiteHosting {
  /**
   * Hosting provider
   */
  provider?: string;
  
  /**
   * IP address
   */
  ip?: string;
  
  /**
   * Domain registrar
   */
  registrar?: string;
  
  /**
   * Domain registration date
   */
  registrationDate?: string;
  
  /**
   * Domain expiration date
   */
  expirationDate?: string;
  
  /**
   * Nameserver information
   */
  nameservers?: string[];
  
  /**
   * SSL certificate provider
   */
  sslProvider?: string;
  
  /**
   * SSL certificate expiration date
   */
  sslExpirationDate?: string;
}

/**
 * Website feature information
 */
export interface WebsiteFeature {
  /**
   * Feature name
   */
  name: string;
  
  /**
   * Feature description
   */
  description: string;
  
  /**
   * Feature category
   */
  category?: string;
  
  /**
   * Feature status
   */
  status?: "active" | "beta" | "deprecated";
  
  /**
   * Date when feature was added
   */
  addedDate?: string;
}

/**
 * Legal content information for a website
 */
export interface WebsiteLegalContent {
  /**
   * Type of legal content
   */
  type: string;
  
  /**
   * Legal content text
   */
  text: string;
  
  /**
   * URL to the legal content
   */
  url?: string;
  
  /**
   * Last update date
   */
  lastUpdated: string;
  
  /**
   * Applicable jurisdictions
   */
  jurisdiction?: string[];
  
  /**
   * Version number
   */
  version?: string;
}

/**
 * Legal disclaimers for a website
 */
export interface WebsiteDisclaimers {
  /**
   * Site disclaimer text
   */
  siteDisclaimerText?: string;
  
  /**
   * Link to cookie policy
   */
  cookiePolicyLink?: string;
  
  /**
   * Link to privacy policy
   */
  privacyPolicyLink?: string;
  
  /**
   * Region lock notice
   */
  regionLockNotice?: string;
}

/**
 * Main Website interface representing a pharmaceutical website
 */
export interface Website {
  /**
   * Unique identifier for the website
   */
  id: string;
  
  /**
   * Website domain name
   */
  domain: string;
  
  /**
   * Display name for the website
   */
  siteName: string;
  
  /**
   * Website category
   */
  category: WebsiteCategory;
  
  /**
   * Website description
   */
  description: string;
  
  /**
   * ID of the company that owns the website
   */
  companyId: string;
  
  /**
   * Launch date of the website
   */
  launchDate?: string;
  
  /**
   * Last update date of the website
   */
  lastUpdated?: string;
  
  /**
   * List of product IDs associated with the website
   */
  products?: string[];
  
  /**
   * List of therapeutic area IDs associated with the website
   */
  therapeuticAreas?: string[];
  
  /**
   * List of geographic regions targeted by the website
   */
  regions?: string[];
  
  /**
   * URL to website screenshot
   */
  screenshotUrl?: string;
  
  /**
   * Full URL to the website
   */
  url: string;
  
  /**
   * Whether the website has SSL enabled
   */
  hasSSL: boolean;
  
  /**
   * List of technologies used by the website
   */
  technologies?: string[];
  
  /**
   * List of subcategories for more granular categorization
   */
  subcategories?: string[];
  
  /**
   * Primary geographic region for the website
   */
  region?: string;
  
  /**
   * Date when the screenshot was taken
   */
  screenshotDate?: string;
  
  /**
   * Technical stack information
   */
  techStack?: WebsiteTechStack;
  
  /**
   * Hosting information
   */
  hosting?: WebsiteHosting;
  
  /**
   * Features and functionality
   */
  features?: WebsiteFeature[];
  
  /**
   * Legal disclaimers
   */
  disclaimers?: WebsiteDisclaimers;
  
  /**
   * Legal content
   */
  legalContent?: WebsiteLegalContent[];
  
  /**
   * Date of last crawl
   */
  lastCrawl?: string;
  
  /**
   * Website status
   */
  status?: "active" | "inactive" | "redirecting" | "error";
} 