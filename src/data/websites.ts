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

// Website categories for display/filtering
export const websiteCategories = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'hcp', label: 'Healthcare Professional' },
  { value: 'patient', label: 'Patient' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'ir', label: 'Investor Relations' },
  { value: 'clinical-trials', label: 'Clinical Trials' },
  { value: 'disease-education', label: 'Disease Education' },
  { value: 'product', label: 'Product' },
];

// Regions for filtering
export const regions = [
  { value: 'global', label: 'Global' },
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' },
  { value: 'APAC', label: 'Asia-Pacific' },
  { value: 'LATAM', label: 'Latin America' },
];

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
    // New fields
    screenshotUrl: "/screenshots/pfizer-com-2024.png",
    screenshotDate: "2025-02-15",
    status: "active",
    techStack: {
      cms: "Adobe Experience Manager",
      framework: "React",
      analytics: "Adobe Analytics",
      emailService: "Salesforce Marketing Cloud",
      marketingAutomation: "Marketo",
      cdnProvider: "Akamai",
    },
    features: [
      {
        name: "Investor Dashboard",
        description: "Interactive dashboard showing financial data and stock performance",
        category: "Investor Tools",
        status: "active",
        addedDate: "2024-12-15"
      },
      {
        name: "Career Finder",
        description: "Job search tool with filters for location, department, and experience level",
        category: "User Tools",
        status: "active",
        addedDate: "2024-10-10"
      }
    ],
    // Existing fields
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      registrationDate: "1998-03-25",
      expirationDate: "2025-03-24",
      ip: "23.45.67.89",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-09-30"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.pfizer.com/cookie-policy",
      privacyPolicyLink: "https://www.pfizer.com/privacy"
    },
    // New expanded legal content
    legalContent: [
      {
        type: "Privacy Policy",
        text: "Pfizer respects and values your privacy. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our websites or use our services. We are committed to maintaining the trust you place in us and will only use your information as described in this policy.",
        url: "https://www.pfizer.com/privacy",
        lastUpdated: "2024-10-15",
        jurisdiction: ["Global", "GDPR", "CCPA"],
        version: "5.0"
      },
      {
        type: "Terms of Use",
        text: "By accessing and using this website, you agree to these Terms of Use. This website is operated by Pfizer Inc. and its affiliates. The content is intended for informational purposes only and should not be considered as medical advice.",
        url: "https://www.pfizer.com/terms",
        lastUpdated: "2024-09-01",
        jurisdiction: ["Global"],
        version: "3.2"
      }
    ],
    lastCrawl: "2025-02-15T08:30:00Z",
    lastUpdate: "2025-02-14T15:45:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/pfizer-hcp-2024.png",
    screenshotDate: "2025-02-10",
    status: "active",
    techStack: {
      cms: "Drupal",
      framework: "Angular",
      analytics: "Google Analytics 4",
      emailService: "Marketo",
      marketingAutomation: "Marketo",
    },
    features: [
      {
        name: "HCP Verification",
        description: "Healthcare professional identity verification system",
        category: "Authentication",
        status: "active",
        addedDate: "2024-08-15"
      },
      {
        name: "Medical Resource Library",
        description: "Searchable database of clinical papers and resources",
        category: "Content",
        status: "active",
        addedDate: "2024-11-01"
      },
      {
        name: "Sample Request System",
        description: "Online ordering system for product samples",
        category: "User Tools",
        status: "active",
        addedDate: "2024-07-20"
      }
    ],
    // Existing fields
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      ip: "23.45.67.90"
    },
    disclaimers: {
      siteDisclaimerText: "For US Healthcare Professionals Only",
      cookiePolicyLink: "https://hcp.pfizer.com/cookie-policy",
      privacyPolicyLink: "https://hcp.pfizer.com/privacy"
    },
    // New expanded legal content
    legalContent: [
      {
        type: "Terms for Healthcare Professionals",
        text: "This website is intended for use by healthcare professionals only. By accessing this site, you confirm that you are a licensed healthcare professional. The information contained herein is scientific and educational in nature and not intended as medical advice.",
        url: "https://hcp.pfizer.com/terms",
        lastUpdated: "2024-12-10",
        jurisdiction: ["US"],
        version: "4.0"
      }
    ],
    lastCrawl: "2025-02-10T10:30:00Z",
    lastUpdate: "2025-02-08T16:30:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/ibrance-com-2024.png",
    screenshotDate: "2025-01-25",
    status: "active",
    techStack: {
      cms: "Sitecore",
      framework: "React",
      analytics: "Adobe Analytics",
      emailService: "Salesforce Marketing Cloud",
      marketingAutomation: "Salesforce Marketing Cloud",
    },
    features: [
      {
        name: "Dosing Calculator",
        description: "Tool to calculate appropriate dosing based on patient characteristics",
        category: "Clinical Tools",
        status: "active",
        addedDate: "2024-11-05"
      },
      {
        name: "Patient Support Program",
        description: "Registration and management for patient assistance programs",
        category: "Support",
        status: "active",
        addedDate: "2024-10-15"
      },
      {
        name: "Side Effect Management Guide",
        description: "Interactive guide for managing treatment side effects",
        category: "Education",
        status: "active",
        addedDate: "2024-09-20"
      }
    ],
    // Existing fields
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      ip: "54.23.45.67",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-08-15"
    },
    disclaimers: {
      siteDisclaimerText: "For US Residents Only",
      cookiePolicyLink: "https://www.ibrance.com/cookie-policy",
      privacyPolicyLink: "https://www.ibrance.com/privacy"
    },
    // New expanded legal content
    legalContent: [
      {
        type: "Important Safety Information",
        text: "IBRANCE may cause serious side effects including low white blood cell counts, which can be severe and may lead to infection. Before taking IBRANCE, tell your healthcare provider about all of your medical conditions, including if you have fever, chills, or other signs of infection...",
        url: "https://www.ibrance.com/safety-information",
        lastUpdated: "2024-12-05",
        jurisdiction: ["US"],
        version: "4.1"
      },
      {
        type: "Patient Privacy Notice",
        text: "This Privacy Notice explains how Pfizer collects, uses, and shares information about you when you use our patient support programs, websites, or mobile applications related to IBRANCE.",
        url: "https://www.ibrance.com/privacy-notice",
        lastUpdated: "2024-11-10",
        jurisdiction: ["US", "CCPA"],
        version: "3.0"
      }
    ],
    lastCrawl: "2025-01-25T14:45:00Z",
    lastUpdate: "2025-01-20T10:15:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/novartis-com-2024.png",
    screenshotDate: "2025-02-18",
    status: "active",
    techStack: {
      cms: "Adobe Experience Manager",
      framework: "Vue.js",
      analytics: "Google Analytics 4",
      emailService: "Adobe Campaign",
      marketingAutomation: "Adobe Marketing Cloud",
      cdnProvider: "Cloudflare",
    },
    features: [
      {
        name: "Research & Development Pipeline",
        description: "Interactive visualization of drug development pipeline",
        category: "Research",
        status: "active",
        addedDate: "2024-12-10"
      },
      {
        name: "Investor Dashboard",
        description: "Financial data visualization and reporting tools",
        category: "Investor Tools",
        status: "active",
        addedDate: "2024-11-20"
      }
    ],
    hosting: {
      provider: "Azure",
      registrar: "CSC Corporate Domains",
      registrationDate: "1996-04-12",
      ip: "40.112.72.205",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-10-20"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.novartis.com/cookie-policy",
      privacyPolicyLink: "https://www.novartis.com/privacy"
    },
    legalContent: [
      {
        type: "Global Privacy Policy",
        text: "Novartis respects your privacy and is committed to processing your personal data in accordance with fair information practices and applicable data privacy laws.",
        url: "https://www.novartis.com/privacy",
        lastUpdated: "2024-10-30",
        jurisdiction: ["Global", "GDPR", "CCPA"],
        version: "4.3"
      }
    ],
    lastCrawl: "2025-02-18T09:15:00Z",
    lastUpdate: "2025-02-15T12:45:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/ir-roche-com-2024.png",
    screenshotDate: "2025-02-05",
    status: "active",
    techStack: {
      cms: "Drupal",
      framework: "jQuery",
      analytics: "Adobe Analytics",
      emailService: "Salesforce Marketing Cloud",
    },
    features: [
      {
        name: "Financial Calendar",
        description: "Interactive calendar of earnings calls and financial events",
        category: "Investor Tools",
        status: "active",
        addedDate: "2024-09-15"
      },
      {
        name: "Annual Report Archive",
        description: "Searchable library of past annual reports and financial statements",
        category: "Documentation",
        status: "active",
        addedDate: "2024-08-20"
      }
    ],
    hosting: {
      provider: "AWS",
      registrar: "Netnames",
      ip: "54.93.123.45",
      sslProvider: "Comodo",
      sslExpirationDate: "2025-07-15"
    },
    disclaimers: {
      cookiePolicyLink: "https://ir.roche.com/cookie-policy",
      privacyPolicyLink: "https://ir.roche.com/privacy"
    },
    legalContent: [
      {
        type: "Forward-Looking Statements Notice",
        text: "This website contains certain forward-looking statements. These forward-looking statements may be identified by words such as 'believes', 'expects', 'anticipates', 'projects', 'intends', 'should', 'seeks', 'estimates', 'future' or similar expressions or by discussion of strategy, goals, plans or intentions.",
        url: "https://ir.roche.com/forward-looking-statements",
        lastUpdated: "2024-11-15",
        jurisdiction: ["Global"],
        version: "2.1"
      }
    ],
    lastCrawl: "2025-02-05T11:30:00Z",
    lastUpdate: "2025-01-25T09:30:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/clinicaltrials-astrazeneca-com-2024.png",
    screenshotDate: "2025-01-30",
    status: "active",
    techStack: {
      cms: "SharePoint",
      framework: "Angular",
      analytics: "Google Analytics 4",
      emailService: "Marketo",
    },
    features: [
      {
        name: "Clinical Trial Finder",
        description: "Search tool for finding clinical trials by condition, location, and phase",
        category: "User Tools",
        status: "active",
        addedDate: "2024-10-05"
      },
      {
        name: "Trial Matching Questionnaire",
        description: "Interactive questionnaire to match patients with suitable clinical trials",
        category: "User Tools",
        status: "active",
        addedDate: "2024-11-12"
      },
      {
        name: "Researcher Portal",
        description: "Secured access point for clinical researchers and investigators",
        category: "Professional Tools",
        status: "active",
        addedDate: "2024-08-30"
      }
    ],
    hosting: {
      provider: "Azure",
      registrar: "MarkMonitor Inc.",
      ip: "40.76.45.67",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-06-30"
    },
    disclaimers: {
      cookiePolicyLink: "https://clinicaltrials.astrazeneca.com/cookie-policy",
      privacyPolicyLink: "https://clinicaltrials.astrazeneca.com/privacy"
    },
    legalContent: [
      {
        type: "Clinical Trial Information Disclaimer",
        text: "The information provided about clinical trials on this website is intended for informational purposes only. It should not be used as a substitute for medical advice from your healthcare provider. Participation in a clinical trial is an important decision, and you should discuss all options with your doctor.",
        url: "https://clinicaltrials.astrazeneca.com/disclaimer",
        lastUpdated: "2024-12-20",
        jurisdiction: ["Global"],
        version: "3.5"
      }
    ],
    lastCrawl: "2025-01-30T13:45:00Z",
    lastUpdate: "2025-01-28T10:20:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/gileadforhcp-com-2024.png",
    screenshotDate: "2025-02-20",
    status: "active",
    techStack: {
      cms: "Sitecore",
      framework: "React",
      analytics: "Adobe Analytics",
      emailService: "Eloqua",
      marketingAutomation: "Oracle Eloqua",
    },
    features: [
      {
        name: "HCP Verification",
        description: "Healthcare professional identity verification system",
        category: "Authentication",
        status: "active",
        addedDate: "2024-07-10"
      },
      {
        name: "Medication Dosing Guidelines",
        description: "Interactive reference for medication dosing across patient populations",
        category: "Clinical Tools",
        status: "active",
        addedDate: "2024-09-25"
      },
      {
        name: "Medical Information Request",
        description: "Form to request specific medical information from Gilead",
        category: "Support",
        status: "active",
        addedDate: "2024-08-15"
      }
    ],
    hosting: {
      provider: "GCP",
      registrar: "CSC Corporate Domains",
      ip: "34.102.136.180",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-09-15"
    },
    disclaimers: {
      siteDisclaimerText: "For US Healthcare Professionals Only",
      cookiePolicyLink: "https://www.gileadforhcp.com/cookie-policy",
      privacyPolicyLink: "https://www.gileadforhcp.com/privacy"
    },
    legalContent: [
      {
        type: "HCP Terms of Use",
        text: "This website is intended for healthcare professionals practicing in the United States. The information on this website is not intended for use by consumers or patients. By accessing this website, you affirm that you are a US healthcare professional.",
        url: "https://www.gileadforhcp.com/terms",
        lastUpdated: "2024-11-30",
        jurisdiction: ["US"],
        version: "3.2"
      }
    ],
    lastCrawl: "2025-02-20T15:20:00Z",
    lastUpdate: "2025-02-18T11:45:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/diabetes-lilly-com-2024.png",
    screenshotDate: "2025-02-12",
    status: "active",
    techStack: {
      cms: "Adobe Experience Manager",
      framework: "Vue.js",
      analytics: "Google Analytics 4",
      emailService: "Salesforce Marketing Cloud",
      marketingAutomation: "Salesforce Marketing Cloud",
    },
    features: [
      {
        name: "Blood Sugar Tracker",
        description: "Tool for tracking and visualizing blood glucose readings",
        category: "Patient Tools",
        status: "active",
        addedDate: "2024-10-15"
      },
      {
        name: "Diabetes Education Library",
        description: "Collection of educational resources and videos about diabetes management",
        category: "Education",
        status: "active",
        addedDate: "2024-08-20"
      },
      {
        name: "Medication Savings Calculator",
        description: "Tool to calculate potential savings with Lilly diabetes medications",
        category: "Support",
        status: "active",
        addedDate: "2024-11-05"
      }
    ],
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      ip: "52.55.123.45",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-08-30"
    },
    disclaimers: {
      siteDisclaimerText: "This site is intended for US residents",
      cookiePolicyLink: "https://diabetes.lilly.com/cookie-policy",
      privacyPolicyLink: "https://diabetes.lilly.com/privacy"
    },
    legalContent: [
      {
        type: "Disclaimer",
        text: "The information on this website is not intended to be a substitute for professional medical advice. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition, diagnosis, or treatment options.",
        url: "https://diabetes.lilly.com/disclaimer",
        lastUpdated: "2024-10-25",
        jurisdiction: ["US"],
        version: "2.3"
      }
    ],
    lastCrawl: "2025-02-12T09:10:00Z",
    lastUpdate: "2025-02-10T14:30:00Z"
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
    // New fields
    screenshotUrl: "/screenshots/humira-com-2024.png",
    screenshotDate: "2025-02-08",
    status: "active",
    techStack: {
      cms: "Adobe Experience Manager",
      framework: "React",
      analytics: "Adobe Analytics",
      emailService: "Marketo",
      marketingAutomation: "Marketo",
    },
    features: [
      {
        name: "Complete Savings Card",
        description: "Digital savings card registration and management",
        category: "Support",
        status: "active",
        addedDate: "2024-09-10"
      },
      {
        name: "Nurse Ambassador Program",
        description: "Registration for one-on-one support from a dedicated nurse",
        category: "Support",
        status: "active",
        addedDate: "2024-07-15"
      },
      {
        name: "Injection Training",
        description: "Interactive video tutorials for self-injection",
        category: "Education",
        status: "active",
        addedDate: "2024-08-20"
      },
      {
        name: "Condition Assessment",
        description: "Tool to track and assess condition symptoms over time",
        category: "Patient Tools",
        status: "active",
        addedDate: "2024-10-05"
      }
    ],
    hosting: {
      provider: "AWS",
      registrar: "MarkMonitor Inc.",
      ip: "54.230.156.78",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-07-25"
    },
    disclaimers: {
      siteDisclaimerText: "For US Residents Only",
      cookiePolicyLink: "https://www.humira.com/cookie-policy",
      privacyPolicyLink: "https://www.humira.com/privacy"
    },
    legalContent: [
      {
        type: "Important Safety Information",
        text: "HUMIRA is a prescription medicine that affects your immune system and can lower your ability to fight infections. Serious infections have happened in people taking HUMIRA. These serious infections include tuberculosis (TB) and infections caused by viruses, fungi, or bacteria that have spread throughout the body. Some people have died from these infections.",
        url: "https://www.humira.com/safety",
        lastUpdated: "2024-12-15",
        jurisdiction: ["US"],
        version: "4.2"
      }
    ],
    lastCrawl: "2025-02-08T16:30:00Z",
    lastUpdate: "2025-02-05T12:15:00Z"
  },
  {
    id: "jnj-corporate",
    domain: "jnj.com",
    siteName: "Johnson & Johnson",
    category: "corporate",
    subcategories: ["about", "our-companies", "innovation"],
    description: "Corporate website for Johnson & Johnson, providing information about the company's pharmaceutical, medical device, and consumer health businesses.",
    companyId: "jnj",
    therapeuticAreas: ["immunology", "oncology", "neuroscience", "infectious-diseases", "cardiovascular"],
    region: "global",
    // New fields
    screenshotUrl: "/screenshots/jnj-com-2024.png",
    screenshotDate: "2025-02-20",
    status: "active",
    techStack: {
      cms: "Adobe Experience Manager",
      framework: "React",
      analytics: "Adobe Analytics",
      emailService: "Acoustic",
      marketingAutomation: "Acoustic Campaign",
      cdnProvider: "Akamai",
    },
    features: [
      {
        name: "Innovation Explorer",
        description: "Interactive tool showcasing J&J innovation across therapeutic areas",
        category: "Education",
        status: "active",
        addedDate: "2024-11-20"
      },
      {
        name: "Investor Dashboard",
        description: "Financial data visualization and reporting tool",
        category: "Investor Tools",
        status: "active",
        addedDate: "2024-10-15"
      },
      {
        name: "Career Search",
        description: "Job search and application tool",
        category: "User Tools",
        status: "active",
        addedDate: "2024-09-05"
      }
    ],
    hosting: {
      provider: "AWS",
      registrar: "CSC Corporate Domains",
      registrationDate: "1997-09-22",
      expirationDate: "2025-09-21",
      ip: "23.67.92.104",
      sslProvider: "DigiCert",
      sslExpirationDate: "2025-08-10"
    },
    disclaimers: {
      cookiePolicyLink: "https://www.jnj.com/cookie-policy",
      privacyPolicyLink: "https://www.jnj.com/privacy"
    },
    legalContent: [
      {
        type: "Privacy Policy",
        text: "Johnson & Johnson respects your privacy and is committed to maintaining your trust. This Privacy Policy describes how we collect, use, and disclose information through our websites, online services, and applications.",
        url: "https://www.jnj.com/privacy",
        lastUpdated: "2024-12-05",
        jurisdiction: ["Global", "GDPR", "CCPA"],
        version: "4.1"
      },
      {
        type: "Legal Notice",
        text: "The material on this website is intended to provide general information only and should not be used as a substitute for professional medical advice. Contact your healthcare provider with any questions or concerns you may have regarding your health.",
        url: "https://www.jnj.com/legal-notice",
        lastUpdated: "2024-11-10",
        jurisdiction: ["Global"],
        version: "3.2"
      }
    ],
    lastCrawl: "2025-02-20T10:45:00Z",
    lastUpdate: "2025-02-18T16:30:00Z"
  }
];

/**
 * Helper Functions
 */

export function getWebsiteById(id: string): Website | undefined {
  // First try to find by direct ID
  let website = websites.find(w => w.id === id);
  
  // If not found, try to match by URL-safe version of domain
  if (!website) {
    website = websites.find(w => 
      w.domain.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase() === id
    );
  }
  
  return website;
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