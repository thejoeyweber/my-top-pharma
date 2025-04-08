/**
 * Website Entity Interface
 * 
 * Defines the standard structure for website data used throughout the application.
 * This interface is used by the data source abstraction layer to ensure
 * consistent website data regardless of source.
 */

import type { Database } from '../../types/database';
import { z } from 'zod';
import type { TherapeuticArea } from './TherapeuticArea';
import { dbTherapeuticAreaToTherapeuticArea } from './TherapeuticArea';

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
  companyId: string;
  company?: {
    name: string;
    id: string;
  };
  domain: string;
  title: string;
  description: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  slug: string;
  siteName: string | null;
  screenshotUrl: string | null;
  status: string | null;
  categories: string[] | null;
  companyName: string | null;
  therapeuticAreaIds: string[];
  therapeuticAreas: TherapeuticArea[];
  categoryId: number | null;
  logoUrl: string | null;
  isPrimary: boolean;
  trafficRank: number | null;
  domainExpiresAt: Date | null;
  domainCreatedAt: Date | null;
  hostingProvider: string | null;
  registrar: string | null;
  technologies: string[] | null;
}

/**
 * Product Website Join Table
 * 
 * Represents the product_websites join table in the database
 */
export interface ProductWebsite {
  id: string;
  product_id: string;
  website_id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Converts a database website record to a Website entity
 */
export function dbWebsiteToWebsite(dbWebsite: any): Website {
  return {
    id: dbWebsite.id,
    companyId: dbWebsite.company_id,
    domain: dbWebsite.domain,
    title: dbWebsite.title || dbWebsite.domain,
    description: dbWebsite.description,
    type: dbWebsite.type || 'unknown',
    createdAt: dbWebsite.created_at,
    updatedAt: dbWebsite.updated_at,
    url: dbWebsite.url || `https://${dbWebsite.domain}`,
    slug: dbWebsite.slug,
    siteName: dbWebsite.site_name,
    screenshotUrl: dbWebsite.screenshot_url,
    status: dbWebsite.status,
    categories: dbWebsite.categories || [],
    companyName: dbWebsite.company_name,
    therapeuticAreaIds: dbWebsite.therapeutic_area_ids || [],
    therapeuticAreas: [], // Will be populated separately if needed
    categoryId: dbWebsite.category_id,
    logoUrl: dbWebsite.logo_url,
    isPrimary: dbWebsite.is_primary || false,
    trafficRank: dbWebsite.traffic_rank,
    domainExpiresAt: dbWebsite.domain_expires_at ? new Date(dbWebsite.domain_expires_at) : null,
    domainCreatedAt: dbWebsite.domain_created_at ? new Date(dbWebsite.domain_created_at) : null,
    hostingProvider: dbWebsite.hosting_provider,
    registrar: dbWebsite.registrar,
    technologies: dbWebsite.technologies || [],
  };
}

/**
 * Converts an application Website model to a database insert record
 */
export function websiteToDbWebsite(website: Partial<Website>): Partial<DbWebsiteInsert> {
  // Only include fields that exist in the database schema
  return {
    id: website.id,
    company_id: website.companyId,
    domain: website.domain,
    description: website.description || undefined,
    url: website.url,
    slug: website.slug,
    site_name: website.siteName || undefined,
    screenshot_url: website.screenshotUrl || undefined,
    status: website.status || undefined,
    category_id: website.categoryId !== null ? 
      String(website.categoryId) : undefined,
    region: undefined, // Present in DB schema but not in the Website interface
    language: undefined, // Present in DB schema but not in the Website interface
    has_ssl: undefined, // Present in DB schema but not in the Website interface
    // Fields not included in the DB schema:
    // is_primary, traffic_rank, domain_expires_at, domain_created_at,
    // hosting_provider, registrar, technologies
  };
}

// Zod schema for validating website data (aligned with the Website interface)
export const WebsiteSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  slug: z.string(),
  siteName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  companyId: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(), // Added based on interface
  therapeuticAreaIds: z.array(z.number()).nullable().optional(), // Corrected type
  // therapeuticAreas: z.array(TherapeuticAreaSchema).nullable().optional(), // Can't use interface directly here easily, rely on IDs
  categoryId: z.number().nullable().optional(), // Corrected type
  logoUrl: z.string().url().nullable().optional(),
  screenshotUrl: z.string().url().nullable().optional(),
  isPrimary: z.boolean().nullable().optional(),
  trafficRank: z.number().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add new properties to schema
  domainExpiresAt: z.date().nullable().optional(),
  domainCreatedAt: z.date().nullable().optional(),
  hostingProvider: z.string().nullable().optional(),
  registrar: z.string().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
});

export type WebsiteInput = z.infer<typeof WebsiteSchema>; 