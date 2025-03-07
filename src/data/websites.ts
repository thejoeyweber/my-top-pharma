/**
 * Website Data
 * 
 * Mock data for pharmaceutical websites including domains, categories,
 * ownership information, and technical details.
 */
import { companies } from './companies';
import { products } from './products';

// Get a safety fallback company ID
const DEFAULT_COMPANY_ID = companies[0]?.id || 'pfizer';

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
  hosting?: {
    provider?: string;
    ip?: string;
    registrar?: string;
    registrationDate?: string;
    expirationDate?: string;
  };
  disclaimers?: {
    siteDisclaimerText?: string;
    cookiePolicyLink?: string;
    privacyPolicyLink?: string;
    regionLockNotice?: string;
  };
  lastCrawl?: string;
}

export const websites: Website[] = [
  {
    id: "pfizer-corporate",
    domain: "pfizer.com",
    siteName: "Pfizer Corporate Website",
    category: "corporate",
    subcategories: ["investor-relations", "careers"],
    description: "Official corporate website for Pfizer Inc., providing information about the company, products, research, and more.",
    companyId: "pfizer",
    therapeuticAreas: ["oncology", "vaccines", "immunology", "rare-diseases"],
    region: "global",
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      registrationDate: "1998-03-25",
      expirationDate: "2025-03-24"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.pfizer.com/cookie-policy",
      privacyPolicyLink: "https://www.pfizer.com/privacy"
    },
    lastCrawl: "2025-02-15T08:30:00Z"
  },
  {
    id: "pfizer-hcp",
    domain: "hcp.pfizer.com",
    siteName: "Pfizer for Healthcare Professionals",
    category: "hcp",
    subcategories: ["medical-information", "product-resources"],
    description: "Resources and information for healthcare professionals about Pfizer medications and vaccines.",
    companyId: "pfizer",
    products: ["ibrance", "prevnar", "xeljanz"],
    therapeuticAreas: ["oncology", "vaccines", "immunology"],
    region: "US",
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc."
    },
    disclaimers: {
      siteDisclaimerText: "For US Healthcare Professionals Only",
      cookiePolicyLink: "https://hcp.pfizer.com/cookie-policy",
      privacyPolicyLink: "https://hcp.pfizer.com/privacy"
    },
    lastCrawl: "2025-02-10T10:30:00Z"
  },
  {
    id: "ibrance-patient",
    domain: "ibrance.com",
    siteName: "IBRANCE® (palbociclib)",
    category: "patient",
    subcategories: ["treatment-info", "patient-support"],
    description: "Official website for IBRANCE® (palbociclib), a treatment for hormone receptor-positive, HER2-negative breast cancer.",
    companyId: "pfizer",
    products: ["ibrance"],
    therapeuticAreas: ["oncology"],
    region: "US",
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc."
    },
    disclaimers: {
      siteDisclaimerText: "For US Residents Only",
      cookiePolicyLink: "https://www.ibrance.com/cookie-policy",
      privacyPolicyLink: "https://www.ibrance.com/privacy"
    },
    lastCrawl: "2025-01-25T14:45:00Z"
  },
  {
    id: "novartis-corporate",
    domain: "novartis.com",
    siteName: "Novartis International AG",
    category: "corporate",
    subcategories: ["investor-relations", "research", "innovation"],
    description: "Global website for Novartis, providing information about the company's focus on innovative medicines, generics, and biosimilars.",
    companyId: "novartis",
    therapeuticAreas: ["ophthalmology", "neuroscience", "immunology", "cardiovascular"],
    region: "global",
    hosting: {
      provider: "Azure",
      registrar: "CSC Corporate Domains",
      registrationDate: "1996-04-12"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.novartis.com/cookie-policy",
      privacyPolicyLink: "https://www.novartis.com/privacy"
    },
    lastCrawl: "2025-02-18T09:15:00Z"
  },
  {
    id: "roche-ir",
    domain: "ir.roche.com",
    siteName: "Roche Investor Relations",
    category: "ir",
    subcategories: ["financial-reporting", "shareholder-information"],
    description: "Investor relations site with financial reports, stock information, and corporate governance details for Roche Holding AG.",
    companyId: "roche",
    region: "global",
    hosting: {
      provider: "AWS",
      registrar: "Netnames"
    },
    disclaimers: {
      cookiePolicyLink: "https://ir.roche.com/cookie-policy",
      privacyPolicyLink: "https://ir.roche.com/privacy"
    },
    lastCrawl: "2025-02-05T11:30:00Z"
  },
  {
    id: "astrazeneca-clinical",
    domain: "clinicaltrials.astrazeneca.com",
    siteName: "AstraZeneca Clinical Trials",
    category: "clinical-trials",
    subcategories: ["trial-finder", "patient-resources"],
    description: "Find information about AstraZeneca's ongoing clinical trials and research studies.",
    companyId: "astrazeneca",
    therapeuticAreas: ["oncology", "respiratory", "cardiovascular"],
    region: "global",
    hosting: {
      provider: "Azure",
      registrar: "MarkMonitor Inc."
    },
    disclaimers: {
      cookiePolicyLink: "https://clinicaltrials.astrazeneca.com/cookie-policy",
      privacyPolicyLink: "https://clinicaltrials.astrazeneca.com/privacy"
    },
    lastCrawl: "2025-01-30T13:45:00Z"
  },
  {
    id: "gileadforhcp",
    domain: "gileadforhcp.com",
    siteName: "Gilead for Healthcare Professionals",
    category: "hcp",
    subcategories: ["virology", "oncology", "liver-diseases"],
    description: "Scientific and medical information for healthcare professionals about Gilead's medications and therapeutic areas.",
    companyId: "gilead",
    products: ["biktarvy", "veklury"],
    therapeuticAreas: ["infectious-diseases", "oncology", "liver-diseases"],
    region: "US",
    hosting: {
      provider: "GCP",
      registrar: "CSC Corporate Domains"
    },
    disclaimers: {
      siteDisclaimerText: "For US Healthcare Professionals Only",
      cookiePolicyLink: "https://www.gileadforhcp.com/cookie-policy",
      privacyPolicyLink: "https://www.gileadforhcp.com/privacy"
    },
    lastCrawl: "2025-02-20T15:20:00Z"
  },
  {
    id: "diabetes-lilly",
    domain: "diabetes.lilly.com",
    siteName: "Lilly Diabetes",
    category: "disease-education",
    subcategories: ["patient-resources", "hcp-resources"],
    description: "Disease education and product information about Lilly's diabetes treatments and solutions.",
    companyId: "lilly",
    products: ["trulicity", "humalog"],
    therapeuticAreas: ["diabetes"],
    region: "US",
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc."
    },
    disclaimers: {
      siteDisclaimerText: "This site is intended for US residents",
      cookiePolicyLink: "https://diabetes.lilly.com/cookie-policy",
      privacyPolicyLink: "https://diabetes.lilly.com/privacy"
    },
    lastCrawl: "2025-02-12T09:10:00Z"
  },
  {
    id: "humira-campaign",
    domain: "humira.com",
    siteName: "HUMIRA® (adalimumab)",
    category: "campaign",
    subcategories: ["patient-support", "savings-program"],
    description: "Official product website for HUMIRA® (adalimumab) with information about treatment, support programs, and financial assistance.",
    companyId: "abbvie",
    products: ["humira"],
    therapeuticAreas: ["immunology"],
    region: "US",
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc."
    },
    disclaimers: {
      siteDisclaimerText: "For US Residents Only",
      cookiePolicyLink: "https://www.humira.com/cookie-policy",
      privacyPolicyLink: "https://www.humira.com/privacy"
    },
    lastCrawl: "2025-02-08T16:30:00Z"
  },
  {
    id: "jnj-corporate",
    domain: "jnj.com",
    siteName: "Johnson & Johnson",
    category: "corporate",
    subcategories: ["about", "our-companies", "innovation"],
    description: "Corporate website for Johnson & Johnson, providing information about the company's pharmaceutical, medical device, and consumer health businesses.",
    companyId: "jnj",
    region: "global",
    hosting: {
      provider: "Azure",
      registrar: "CSC Corporate Domains",
      registrationDate: "1995-09-18"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.jnj.com/cookie-policy",
      privacyPolicyLink: "https://www.jnj.com/privacy"
    },
    lastCrawl: "2025-02-22T12:15:00Z"
  }
];

/**
 * Helper Functions
 */

export function getWebsiteById(id: string): Website | undefined {
  return websites.find(website => website.id === id);
}

export function getWebsitesByCompany(companyId: string): Website[] {
  return websites.filter(website => website.companyId === companyId);
}

export function getWebsitesByCategory(category: WebsiteCategory): Website[] {
  return websites.filter(website => website.category === category);
}

export function getWebsitesByProduct(productId: string): Website[] {
  return websites.filter(website => website.products?.includes(productId));
}

export function getWebsitesByTherapeuticArea(areaId: string): Website[] {
  return websites.filter(website => website.therapeuticAreas?.includes(areaId));
}

export function getWebsitesByRegion(region: string): Website[] {
  return websites.filter(website => website.region === region);
}

export const websiteCategories = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'hcp', label: 'Healthcare Professional' },
  { value: 'patient', label: 'Patient' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'ir', label: 'Investor Relations' },
  { value: 'clinical-trials', label: 'Clinical Trials' },
  { value: 'disease-education', label: 'Disease Education' },
  { value: 'product', label: 'Product' }
];

export const regions = [
  { value: 'global', label: 'Global' },
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' },
  { value: 'APAC', label: 'Asia Pacific' },
  { value: 'LATAM', label: 'Latin America' },
  { value: 'EMEA', label: 'Europe, Middle East & Africa' }
]; 