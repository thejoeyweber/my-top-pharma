/**
 * Website Types
 * 
 * Type definitions for pharmaceutical website data.
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

export interface Website {
  // Basic Information
  id: string;
  domain: string;
  siteName?: string;
  category: WebsiteCategory;
  subcategories?: string[];
  description?: string;
  companyId: string;
  products?: string[];
  therapeuticAreas?: string[];
  region?: string;

  // Visual Content
  screenshotUrl?: string;
  screenshotDate?: string;

  // Technical Stack
  techStack?: {
    cms?: string;
    framework?: string;
    server?: string;
    analytics?: string;
    emailService?: string;
    marketingAutomation?: string;
    cdnProvider?: string;
    searchTechnology?: string;
    chatProvider?: string;
  };

  // Hosting Information
  hosting?: {
    provider?: string;
    ip?: string;
    registrar?: string;
    registrationDate?: string;
    expirationDate?: string;
    nameservers?: string[];
    sslProvider?: string;
    sslExpirationDate?: string;
  };

  // Features & Functionality
  features?: Array<{
    name: string;
    description: string;
    category?: string;
    status?: "active" | "beta" | "deprecated";
    addedDate?: string;
  }>;

  // Legal & Compliance (enhanced from disclaimers)
  disclaimers?: {
    siteDisclaimerText?: string;
    cookiePolicyLink?: string;
    privacyPolicyLink?: string;
    regionLockNotice?: string;
  };

  // New legal content array for expanded legal content
  legalContent?: Array<{
    type: string;
    text: string;
    url?: string;
    lastUpdated: string;
    jurisdiction?: string[];
    version?: string;
  }>;

  // Tracking & Metadata
  lastCrawl?: string;
  lastUpdate?: string;
  status?: "active" | "inactive" | "redirecting" | "error";
} 