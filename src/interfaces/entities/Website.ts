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
  cms: string | null;
  
  /**
   * Web development framework
   */
  framework: string | null;
  
  /**
   * Server technology
   */
  server: string | null;
  
  /**
   * Analytics platform
   */
  analytics: string | null;
  
  /**
   * Email service provider
   */
  emailService: string | null;
  
  /**
   * Marketing automation platform
   */
  marketingAutomation: string | null;
  
  /**
   * Content Delivery Network provider
   */
  cdnProvider: string | null;
  
  /**
   * Search technology
   */
  searchTechnology: string | null;
  
  /**
   * Chat/bot provider
   */
  chatProvider: string | null;
}

/**
 * Hosting information for a website
 */
export interface WebsiteHosting {
  /**
   * Hosting provider
   */
  provider: string | null;
  
  /**
   * IP address
   */
  ip: string | null;
  
  /**
   * Domain registrar
   */
  registrar: string | null;
  
  /**
   * Domain registration date
   */
  registrationDate: string | null;
  
  /**
   * Domain expiration date
   */
  expirationDate: string | null;
  
  /**
   * Nameserver information
   */
  nameservers: string[] | null;
  
  /**
   * SSL certificate provider
   */
  sslProvider: string | null;
  
  /**
   * SSL certificate expiration date
   */
  sslExpirationDate: string | null;
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
  category: string | null;
  
  /**
   * Description of the feature
   */
  description: string | null;
  
  /**
   * Status of the feature
   */
  status: string | null;
  
  /**
   * Date the feature was added to the website
   */
  addedDate: string | null;
  
  /**
   * Creation timestamp
   */
  createdAt: string | null;
  
  /**
   * Last update timestamp
   */
  updatedAt: string | null;
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
  url: string | null;
  
  /**
   * Last update date
   */
  lastUpdated: string;
  
  /**
   * Applicable jurisdictions
   */
  jurisdiction: string[] | null;
  
  /**
   * Version number
   */
  version: string | null;
}

/**
 * Legal disclaimers for a website
 */
export interface WebsiteDisclaimers {
  /**
   * Site disclaimer text
   */
  siteDisclaimerText: string | null;
  
  /**
   * Link to cookie policy
   */
  cookiePolicyLink: string | null;
  
  /**
   * Link to privacy policy
   */
  privacyPolicyLink: string | null;
  
  /**
   * Region lock notice
   */
  regionLockNotice: string | null;
}

/**
 * Main Website interface representing a pharmaceutical company website
 */
export interface Website {
  id: string;
  companyId: string;
  company: {
    name: string;
    id: string;
  } | null;
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
 * Interface for Website database records
 */
export interface DBWebsite {
  id: string;
  company_id: string;
  domain: string;
  title: string | null;
  description: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
  url: string | null;
  slug: string;
  site_name: string | null;
  screenshot_url: string | null;
  status: string | null;
  categories: string[] | null;
  category_id: number | null;
  logo_url: string | null;
  is_primary: boolean | null;
  traffic_rank: number | null;
  domain_expires_at: string | null;
  domain_created_at: string | null;
  hosting_provider: string | null;
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
export function dbWebsiteToWebsite(dbWebsite: DBWebsite): Website {
  return {
    id: dbWebsite.id,
    companyId: dbWebsite.company_id,
    company: null, // Will be populated separately if needed
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
    companyName: null, // Will be populated separately if needed
    therapeuticAreaIds: [], // Will be populated separately if needed
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
export function websiteToDbWebsite(website: Partial<Website>): Partial<DBWebsite> {
  // Only include fields that exist in the database schema
  return {
    id: website.id,
    company_id: website.companyId,
    domain: website.domain,
    description: website.description || null,
    url: website.url || null,
    slug: website.slug,
    site_name: website.siteName || null,
    screenshot_url: website.screenshotUrl || null,
    status: website.status || null,
    category_id: website.categoryId,
    logo_url: website.logoUrl || null,
    is_primary: website.isPrimary || null,
    traffic_rank: website.trafficRank || null,
    domain_expires_at: website.domainExpiresAt ? website.domainExpiresAt.toISOString() : null,
    domain_created_at: website.domainCreatedAt ? website.domainCreatedAt.toISOString() : null,
    hosting_provider: website.hostingProvider || null,
    registrar: website.registrar || null,
    technologies: website.technologies || null,
    type: website.type || null,
    title: website.title || null,
    // Fields not mapped directly:
    // - company
    // - companyName
    // - therapeuticAreaIds
    // - therapeuticAreas
    // - categories
  };
}

// Zod schema for validating website data (aligned with the Website interface)
export const WebsiteSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  slug: z.string(),
  siteName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  companyId: z.string(),
  companyName: z.string().nullable().optional(),
  therapeuticAreaIds: z.array(z.string()).default([]),
  // therapeuticAreas: z.array(TherapeuticAreaSchema).nullable().optional(), // Can't use interface directly here easily, rely on IDs
  categoryId: z.number().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  screenshotUrl: z.string().url().nullable().optional(),
  isPrimary: z.boolean().default(false),
  trafficRank: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Add new properties to schema
  domainExpiresAt: z.date().nullable().optional(),
  domainCreatedAt: z.date().nullable().optional(),
  hostingProvider: z.string().nullable().optional(),
  registrar: z.string().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  type: z.string().default('unknown'),
  title: z.string(),
  status: z.string().nullable().optional(),
  categories: z.array(z.string()).nullable().optional(),
  domain: z.string(),
});

export type WebsiteInput = z.infer<typeof WebsiteSchema>; 