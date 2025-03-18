/**
 * Website Entity Interface
 * 
 * Defines the standard structure for website data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent website data regardless of source.
 */

import type { Database } from '../../types/database';

// Database types for reference
export type DbWebsite = Database['public']['Tables']['websites']['Row'];
export type DbWebsiteInsert = Database['public']['Tables']['websites']['Insert'];
export type DbWebsiteUpdate = Database['public']['Tables']['websites']['Update'];

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
 * Represents features/functionality found on a pharmaceutical website
 */
export interface WebsiteFeature {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * Website ID this feature belongs to
   */
  websiteId: string;
  
  /**
   * Name of the feature
   */
  name: string;
  
  /**
   * Category of the feature
   */
  category?: string;
  
  /**
   * Description of the feature
   */
  description?: string;
  
  /**
   * Status of the feature
   */
  status?: string;
  
  /**
   * Date the feature was added to the website
   */
  addedDate?: string;
  
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
 * Main Website interface representing a pharmaceutical company website
 */
export interface Website {
  id: string;
  domain: string;
  siteName?: string;
  categoryId?: string;
  description?: string;
  companyId: string;
  url: string;
  hasSSL?: boolean;
  status?: string;
  screenshotUrl?: string;
  screenshotDate?: string;
  lastCrawl?: string;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
  therapeuticAreas?: string[]; // Array of therapeutic area IDs
}

/**
 * Converts a database website record to the application Website model
 */
export function dbWebsiteToWebsite(dbWebsite: DbWebsite): Website {
  return {
    id: dbWebsite.id,
    domain: dbWebsite.domain,
    siteName: dbWebsite.site_name || undefined,
    categoryId: dbWebsite.category_id || undefined,
    description: dbWebsite.description || undefined,
    companyId: dbWebsite.company_id,
    url: dbWebsite.url,
    hasSSL: dbWebsite.has_ssl || undefined,
    status: dbWebsite.status || undefined,
    screenshotUrl: dbWebsite.screenshot_url || undefined,
    screenshotDate: dbWebsite.screenshot_date || undefined,
    lastCrawl: dbWebsite.last_crawl || undefined,
    lastUpdated: dbWebsite.last_updated || undefined,
    createdAt: dbWebsite.created_at || undefined,
    updatedAt: dbWebsite.updated_at || undefined,
    slug: dbWebsite.slug,
    therapeuticAreas: [], // This will be populated separately by joining with website_therapeutic_areas
  };
}

/**
 * Converts an application Website model to a database insert record
 */
export function websiteToDbWebsite(website: Partial<Website>): Partial<DbWebsite> {
  return {
    id: website.id,
    domain: website.domain,
    site_name: website.siteName || null,
    category_id: website.categoryId || null,
    description: website.description || null,
    company_id: website.companyId,
    url: website.url,
    has_ssl: website.hasSSL || null,
    status: website.status || null,
    screenshot_url: website.screenshotUrl || null,
    screenshot_date: website.screenshotDate || null,
    last_crawl: website.lastCrawl || null,
    last_updated: website.lastUpdated || null,
    // Don't set created_at or updated_at, let the database handle those
    slug: website.slug || null,
    // therapeuticAreas is handled separately through the junction table
  };
} 