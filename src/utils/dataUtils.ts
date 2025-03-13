/**
 * Data Utilities
 * 
 * Helper functions to load data from JSON files and provide accessors
 * that mimic the exports from the TS data files for backwards compatibility.
 * 
 * Phase 1 of migration: Adding support for database-driven data via feature flags.
 */

// Import company-related types
import type { Company, CompanyRelationType } from '../types/companies';
import type { Product, ProductStage } from '../types/products';
import type { Website } from '../types/websites';

// Import feature flags
import { getFeatureFlag, FEATURES } from './featureFlags';

// Load JSON data
import companiesData from '../data/json/companies.json';
import productsData from '../data/json/products.json';
import websitesData from '../data/json/websites.json';
import therapeuticAreasData from '../data/json/therapeuticAreas.json';
import indications from '../data/json/indications.json';
import regions from '../data/json/regions.json';
import websiteCategories from '../data/json/websiteCategories.json';
import userProfile from '../data/json/userProfile.json';
import userPreferences from '../data/json/userPreferences.json';
import followedCompaniesData from '../data/json/followedCompanies.json';
import systemStats from '../data/json/systemStats.json';
// Import new FMP data types
import companyFinancialsData from '../data/json/companyFinancials.json';
import companyMetricsData from '../data/json/companyMetrics.json';
import companyStockData from '../data/json/companyStockData.json';

// Ensure imported JSON data matches expected types
const typedCompaniesData = companiesData as unknown as Company[];

// Override systemStats with SVG icons
const enhancedSystemStats = systemStats.map(stat => {
  let svgIcon = '';
  
  if (stat.id === 'companies-stat') {
    svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clip-rule="evenodd" /></svg>';
  } else if (stat.id === 'products-stat') {
    svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" /><path fill-rule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg>';
  } else {
    // Default icon if needed
    svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clip-rule="evenodd" /></svg>';
  }
  
  return {
    ...stat,
    icon: svgIcon
  };
});

// Add admin data - these might need to be loaded from JSON files if they exist
const adminShortcuts = [
  { 
    id: 'users', 
    title: 'User Management',
    description: 'Manage system users, roles, and permissions',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>',
    url: '/admin/users'
  },
  { 
    id: 'settings', 
    title: 'System Settings',
    description: 'Configure global application settings',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" /></svg>',
    url: '/admin/settings'
  },
  { 
    id: 'crawler', 
    title: 'Crawler Management',
    description: 'Configure and monitor the web crawler',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" /></svg>',
    url: '/admin/crawler'
  },
  { 
    id: 'data-feeds', 
    title: 'Data Feeds',
    description: 'Manage external data integrations and feeds',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M3.75 4.5a.75.75 0 01.75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 01-.75-.75V4.5zm0 6.75a.75.75 0 01.75-.75h.75a8.25 8.25 0 018.25 8.25v.75a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.75c0-3.722-3.025-6.75-6.75-6.75H4.5a.75.75 0 01-.75-.75v-.75zm0 7.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" /></svg>',
    url: '/admin/data-feeds'
  },
  {
    id: 'audit-companies',
    title: 'Companies Audit',
    description: 'Compare mock and database company data',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.089a.75.75 0 0 0-1.172-.93l-2.25 2.828-1.24-1.24a.75.75 0 1 0-1.06 1.061l1.5 1.5a.75.75 0 0 0 1.06 0l3-3.75a.75.75 0 0 0 .162-.538Z" clip-rule="evenodd" /></svg>',
    url: '/admin/audit/companies'
  }
];

const recentCrawlerJobs = [
  { id: 'job-1', website: 'pfizer.com', status: 'completed', startTime: '2023-12-10T15:30:00Z', duration: '00:45:23' },
  { id: 'job-2', website: 'novartis.com', status: 'completed', startTime: '2023-12-10T14:15:00Z', duration: '00:52:11' },
  { id: 'job-3', website: 'abbvie.com', status: 'failed', startTime: '2023-12-10T13:00:00Z', duration: '00:03:45' },
  { id: 'job-4', website: 'merck.com', status: 'in-progress', startTime: '2023-12-10T16:10:00Z', duration: '00:15:32' }
];

const systemLogs = [
  { id: 'log-1', timestamp: '2023-12-10T16:35:22Z', level: 'error', message: 'Database connection timeout', service: 'data-crawler' },
  { id: 'log-2', timestamp: '2023-12-10T16:33:10Z', level: 'info', message: 'New user registration', service: 'auth-service' },
  { id: 'log-3', timestamp: '2023-12-10T16:30:05Z', level: 'warning', message: 'Rate limit approaching for API key', service: 'external-api' },
  { id: 'log-4', timestamp: '2023-12-10T16:28:56Z', level: 'info', message: 'Scheduled backup completed', service: 'backup-service' },
  { id: 'log-5', timestamp: '2023-12-10T16:25:13Z', level: 'error', message: 'Failed to process PDF document', service: 'document-processor' }
];

const apiConfig = {
  endpoints: [
    { id: 'api-1', name: 'Company Data API', url: 'https://api.example.com/companies', status: 'active', lastSync: '2023-12-09T14:30:00Z' },
    { id: 'api-2', name: 'Product Database', url: 'https://api.example.com/products', status: 'active', lastSync: '2023-12-10T09:15:00Z' },
    { id: 'api-3', name: 'Clinical Trials API', url: 'https://api.example.com/trials', status: 'inactive', lastSync: '2023-11-30T11:45:00Z' },
    { id: 'api-4', name: 'Regulatory Submissions', url: 'https://api.example.com/regulatory', status: 'active', lastSync: '2023-12-08T16:20:00Z' }
  ],
  keys: [
    { id: 'key-1', name: 'Production API Key', created: '2023-10-15T08:00:00Z', lastUsed: '2023-12-10T16:30:00Z', status: 'active' },
    { id: 'key-2', name: 'Development API Key', created: '2023-11-01T10:30:00Z', lastUsed: '2023-12-09T14:25:00Z', status: 'active' },
    { id: 'key-3', name: 'Testing API Key', created: '2023-11-15T09:45:00Z', lastUsed: '2023-12-05T11:10:00Z', status: 'active' }
  ]
};

const crawlerConfig = {
  schedules: [
    { id: 'schedule-1', name: 'Daily Pharma Websites', frequency: 'daily', startTime: '01:00', lastRun: '2023-12-10T01:00:00Z', nextRun: '2023-12-11T01:00:00Z', status: 'active' },
    { id: 'schedule-2', name: 'Weekly Deep Crawl', frequency: 'weekly', startTime: '02:00', lastRun: '2023-12-04T02:00:00Z', nextRun: '2023-12-11T02:00:00Z', status: 'active' },
    { id: 'schedule-3', name: 'Monthly Archive', frequency: 'monthly', startTime: '03:00', lastRun: '2023-11-01T03:00:00Z', nextRun: '2023-12-01T03:00:00Z', status: 'paused' }
  ],
  rules: [
    { id: 'rule-1', name: 'Respect robots.txt', description: 'Follow robots.txt directives', isEnabled: true },
    { id: 'rule-2', name: 'Max Depth', description: 'Maximum crawl depth of 5 pages from start URL', isEnabled: true },
    { id: 'rule-3', name: 'Rate Limiting', description: 'Maximum 1 request per second per domain', isEnabled: true },
    { id: 'rule-4', name: 'Follow Redirects', description: 'Follow up to 3 redirects', isEnabled: true }
  ]
};

const dataFeeds = [
  { 
    id: 'feed-1', 
    name: 'Clinical Trials Data', 
    provider: 'ClinicalTrials.gov', 
    url: 'https://clinicaltrials.gov/api/v2/studies',
    status: 'active', 
    lastUpdate: '2023-12-09T10:15:00Z', 
    frequency: 'daily',
    lastFetch: '2023-12-09T10:15:00Z',
    nextFetch: '2023-12-10T10:15:00Z',
    active: true
  },
  { 
    id: 'feed-2', 
    name: 'FDA Approvals', 
    provider: 'FDA.gov', 
    url: 'https://api.fda.gov/drug/approval',
    status: 'active', 
    lastUpdate: '2023-12-08T14:30:00Z', 
    frequency: 'daily',
    lastFetch: '2023-12-08T14:30:00Z',
    nextFetch: '2023-12-09T14:30:00Z',
    active: true
  },
  { 
    id: 'feed-3', 
    name: 'EMA Decisions', 
    provider: 'EMA Europa', 
    url: 'https://www.ema.europa.eu/en/medicines/api',
    status: 'active', 
    lastUpdate: '2023-12-07T09:45:00Z', 
    frequency: 'daily',
    lastFetch: '2023-12-07T09:45:00Z',
    nextFetch: '2023-12-08T09:45:00Z',
    active: true
  },
  { 
    id: 'feed-4', 
    name: 'Financial Data', 
    provider: 'Bloomberg', 
    url: 'https://api.bloomberg.com/data',
    status: 'active', 
    lastUpdate: '2023-12-10T08:00:00Z', 
    frequency: 'hourly',
    lastFetch: '2023-12-10T08:00:00Z',
    nextFetch: '2023-12-10T09:00:00Z',
    active: true
  },
  { 
    id: 'feed-5', 
    name: 'News Articles', 
    provider: 'PharmaNews API', 
    url: 'https://api.pharmanews.com/articles',
    status: 'inactive', 
    lastUpdate: '2023-11-30T16:20:00Z', 
    frequency: 'hourly',
    lastFetch: '2023-11-30T16:20:00Z',
    nextFetch: '2023-12-01T16:20:00Z',
    active: false
  }
];

const reportsConfig = [
  { id: 'report-1', name: 'Market Share Analysis', description: 'Analysis of market share by company and therapeutic area', schedule: 'weekly', lastGenerated: '2023-12-04T08:30:00Z' },
  { id: 'report-2', name: 'Pipeline Overview', description: 'Overview of pharmaceutical pipeline by development stage', schedule: 'monthly', lastGenerated: '2023-12-01T09:15:00Z' },
  { id: 'report-3', name: 'Regulatory Submissions', description: 'Summary of recent regulatory submissions and decisions', schedule: 'weekly', lastGenerated: '2023-12-04T10:00:00Z' },
  { id: 'report-4', name: 'Clinical Trials Status', description: 'Status updates on ongoing clinical trials', schedule: 'bi-weekly', lastGenerated: '2023-11-20T11:30:00Z' }
];

const userManagement = {
  users: [
    { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', lastLogin: '2023-12-10T14:30:00Z' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'editor', status: 'active', lastLogin: '2023-12-09T09:15:00Z' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'viewer', status: 'active', lastLogin: '2023-12-08T11:45:00Z' },
    { id: 'user-4', name: 'Alice Williams', email: 'alice.williams@example.com', role: 'editor', status: 'inactive', lastLogin: '2023-11-20T16:20:00Z' },
    { id: 'user-5', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'viewer', status: 'active', lastLogin: '2023-12-07T10:05:00Z' }
  ],
  roles: [
    { id: 'role-1', name: 'admin', description: 'Full access to all features', permissions: ['read', 'write', 'delete', 'admin'] },
    { id: 'role-2', name: 'editor', description: 'Can edit content but not system settings', permissions: ['read', 'write'] },
    { id: 'role-3', name: 'viewer', description: 'Read-only access', permissions: ['read'] }
  ]
};

// Type assertions for loaded data
const companies = companiesData as unknown as Company[];
const products = productsData as unknown as Product[];
const websites = websitesData as unknown as Website[];

// Company-related utility functions
export function getCompanyById(id: string) {
  return companies.find(company => company.id === id);
}

export function getRelatedCompanies(companyId: string) {
  const company = getCompanyById(companyId);
  if (!company || !company.relatedCompanies) return [];
  
  return company.relatedCompanies
    .map(relation => ({
      ...getCompanyById(relation.id),
      relationship: relation.relationship
    }))
    .filter(Boolean);
}

export function getCompaniesByTherapeuticArea(therapeuticArea: string) {
  return companies.filter(company => 
    company.therapeuticAreas && company.therapeuticAreas.includes(therapeuticArea)
  );
}

// Product-related utility functions
export function getProductById(id: string) {
  return products.find(product => product.id === id);
}

export function getProductsByCompany(companyId: string) {
  return products.filter(product => product.companyId === companyId);
}

export function getRelatedProducts(productId: string) {
  const product = getProductById(productId);
  if (!product) return [];
  
  // Find products with same therapeutic areas or indications
  return products.filter(p => 
    p.id !== productId && (
      (p.therapeuticAreas && product.therapeuticAreas &&
       p.therapeuticAreas.some(area => product.therapeuticAreas.includes(area))) ||
      (p.indications && product.indications &&
       p.indications.some(ind => product.indications.includes(ind)))
    )
  );
}

export function getStageName(stage: ProductStage): string {
  const stageNames: Record<string, string> = {
    'discovery': 'Discovery',
    'preclinical': 'Preclinical',
    'phase1': 'Phase 1',
    'phase2': 'Phase 2',
    'phase3': 'Phase 3',
    'approved': 'Approved',
    'market': 'Marketed',
    'discontinued': 'Discontinued'
  };
  
  return stageNames[stage] || stage;
}

export function getStageColor(stage: ProductStage): string {
  const stageColors: Record<string, string> = {
    'discovery': 'var(--color-gray-500)',
    'preclinical': 'var(--color-gray-600)',
    'phase1': 'var(--color-primary-400)',
    'phase2': 'var(--color-primary-500)',
    'phase3': 'var(--color-primary-600)',
    'approved': 'var(--color-pharma-green)',
    'market': 'var(--color-secondary-600)',
    'discontinued': 'var(--color-pharma-red)'
  };
  
  return stageColors[stage] || 'var(--color-gray-500)';
}

// Website-related utility functions
export function getWebsiteById(id: string) {
  return websites.find(website => website.id === id);
}

// Get therapeutic area by ID
export function getTherapeuticAreaById(id: string) {
  return therapeuticAreasData.find(area => area.id === id);
}

// Add mock followed products and therapeutic areas for compatibility
const followedProducts = [
  { 
    id: 'lipitor', 
    name: 'Lipitor', 
    company: 'Pfizer',
    followedAt: '2023-10-15T14:28:00Z' 
  },
  { 
    id: 'humira', 
    name: 'Humira', 
    company: 'AbbVie',
    followedAt: '2023-10-10T09:15:30Z' 
  },
  { 
    id: 'keytruda', 
    name: 'Keytruda', 
    company: 'Merck',
    followedAt: '2023-09-22T16:42:10Z' 
  }
];

const followedTherapeuticAreas = [
  {
    id: 'oncology',
    name: 'Oncology',
    followedAt: '2023-10-18T11:34:25Z'
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    followedAt: '2023-09-29T15:22:40Z'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    followedAt: '2023-08-07T10:05:15Z'
  }
];

// Add notifications
const notifications = [
  {
    id: '1',
    type: 'company_update',
    title: 'Pfizer announced Q3 2023 earnings',
    description: 'Pfizer reported $24.2 billion in revenue for Q3 2023, exceeding analyst expectations.',
    entityType: 'company',
    entityId: 'pfizer',
    timestamp: '2023-11-15T09:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'product_approval',
    title: "FDA approves Merck's Keytruda for new indication",
    description: 'Keytruda received approval for treatment of advanced endometrial carcinoma.',
    entityType: 'product',
    entityId: 'keytruda',
    timestamp: '2023-11-12T14:45:00Z',
    read: true
  },
  {
    id: '3',
    type: 'therapeutic_area',
    title: 'New research in Oncology field',
    description: 'Major breakthrough announced in targeted therapy for lung cancer treatment.',
    entityType: 'therapeutic-area',
    entityId: 'oncology',
    timestamp: '2023-11-10T11:15:00Z',
    read: false
  },
  {
    id: '4',
    type: 'website_launch',
    title: 'New product website for Humira',
    description: 'AbbVie launched a redesigned website for Humira with enhanced patient resources.',
    entityType: 'website',
    entityId: 'humira-com',
    timestamp: '2023-11-08T16:20:00Z',
    read: true
  },
  {
    id: '5',
    type: 'company_update',
    title: 'Novartis completes acquisition of MedTech startup',
    description: 'Novartis announced the completion of its acquisition of CellTech Innovations.',
    entityType: 'company',
    entityId: 'novartis',
    timestamp: '2023-11-05T10:00:00Z',
    read: false
  }
];

// Export data and utility functions
export {
  companies,
  products,
  websites,
  therapeuticAreasData as therapeuticAreas,
  indications,
  regions,
  websiteCategories,
  userProfile,
  userPreferences,
  followedCompaniesData as followedCompanies,
  followedProducts,
  followedTherapeuticAreas,
  notifications,
  enhancedSystemStats as systemStats,
  adminShortcuts,
  recentCrawlerJobs,
  systemLogs,
  apiConfig,
  crawlerConfig,
  dataFeeds,
  reportsConfig,
  userManagement,
  // Export the new FMP data types
  companyFinancialsData as companyFinancials,
  companyMetricsData as companyMetrics,
  companyStockData
}; 