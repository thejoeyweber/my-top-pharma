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
  id: number;
  url: string;
  slug: string;
  siteName?: string | null;
  description?: string | null;
  companyId?: number | null;
  companyName?: string | null;
  therapeuticAreaIds?: number[] | null; // Array of TA IDs
  therapeuticAreas?: TherapeuticArea[] | null; // Populated TA objects
  categoryId?: number | null;
  logoUrl?: string | null;
  screenshotUrl?: string | null;
  isPrimary?: boolean | null;
  trafficRank?: number | null;
  createdAt: Date;
  updatedAt: Date;
  // New nullable properties added based on usage in websites/[slug].astro
  domainExpiresAt?: Date | null;
  domainCreatedAt?: Date | null;
  hostingProvider?: string | null;
  registrar?: string | null;
  technologies?: string[] | null; // Assuming technologies is an array of strings
}

/**
 * Converts a database website record to the application Website model
 */
export function dbWebsiteToWebsite(dbWebsite: any): Website {
  return {
    id: dbWebsite.id,
    url: dbWebsite.url,
    slug: dbWebsite.slug,
    siteName: dbWebsite.site_name,
    description: dbWebsite.description,
    companyId: dbWebsite.company_id,
    companyName: dbWebsite.company?.name, // Assuming relation 'company' exists and has 'name'
    therapeuticAreaIds: dbWebsite.therapeutic_area_ids,
    therapeuticAreas: dbWebsite.therapeutic_areas?.map(dbTherapeuticAreaToTherapeuticArea), // Use imported function
    categoryId: dbWebsite.category_id,
    logoUrl: dbWebsite.logo_url,
    screenshotUrl: dbWebsite.screenshot_url,
    isPrimary: dbWebsite.is_primary,
    trafficRank: dbWebsite.traffic_rank,
    createdAt: new Date(dbWebsite.created_at),
    updatedAt: new Date(dbWebsite.updated_at),
    // Map new properties (handle potential nulls from DB)
    domainExpiresAt: dbWebsite.domain_expires_at ? new Date(dbWebsite.domain_expires_at) : null,
    domainCreatedAt: dbWebsite.domain_created_at ? new Date(dbWebsite.domain_created_at) : null,
    hostingProvider: dbWebsite.hosting_provider,
    registrar: dbWebsite.registrar,
    technologies: dbWebsite.technologies, // Assuming DB returns an array or null
  };
}

/**
 * Converts the application Website model (or a partial update) back to a database record format.
 * NOTE: Casting to 'any' as a temporary workaround due to outdated DbWebsite type.
 * Regenerate Supabase types (src/types/database.ts) to fix this properly.
 */
export function websiteToDbWebsite(website: Partial<Website>): Partial<DbWebsite> {
  const dbUpdate: any = {}; // Temporary 'any' cast

  // Map standard fields
  if (website.id !== undefined) dbUpdate.id = website.id;
  if (website.url !== undefined) dbUpdate.url = website.url;
  if (website.siteName !== undefined) dbUpdate.site_name = website.siteName;
  if (website.description !== undefined) dbUpdate.description = website.description;
  if (website.companyId !== undefined) dbUpdate.company_id = website.companyId;
  if (website.therapeuticAreaIds !== undefined) dbUpdate.therapeutic_area_ids = website.therapeuticAreaIds;
  if (website.categoryId !== undefined) dbUpdate.category_id = website.categoryId;
  if (website.logoUrl !== undefined) dbUpdate.logo_url = website.logoUrl;
  if (website.screenshotUrl !== undefined) dbUpdate.screenshot_url = website.screenshotUrl;
  if (website.isPrimary !== undefined) dbUpdate.is_primary = website.isPrimary;
  if (website.trafficRank !== undefined) dbUpdate.traffic_rank = website.trafficRank;
  // createdAt and updatedAt are usually handled by the DB

  // Map new fields
  if (website.domainExpiresAt !== undefined) dbUpdate.domain_expires_at = website.domainExpiresAt?.toISOString();
  if (website.domainCreatedAt !== undefined) dbUpdate.domain_created_at = website.domainCreatedAt?.toISOString();
  if (website.hostingProvider !== undefined) dbUpdate.hosting_provider = website.hostingProvider;
  if (website.registrar !== undefined) dbUpdate.registrar = website.registrar;
  if (website.technologies !== undefined) dbUpdate.technologies = website.technologies;

  return dbUpdate as Partial<DbWebsite>; // Cast back for return type consistency
}

// Zod schema for validating website data (aligned with the Website interface)
export const WebsiteSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  slug: z.string(),
  siteName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  companyId: z.number().nullable().optional(),
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