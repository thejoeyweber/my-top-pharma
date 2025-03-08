/**
 * Data Utilities
 * 
 * Helper functions to load data from JSON files and provide accessors
 * that mimic the exports from the TS data files for backwards compatibility.
 */

// Import company-related types
import type { Company } from '../types/companies';
import type { Product, ProductStage } from '../types/products';
import type { Website } from '../types/websites';

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
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>',
    link: '/admin/users',
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    id: 'database', 
    title: 'Database Management',
    description: 'Configure data sources and manage imports',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>',
    link: '/admin/database',
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    id: 'chart-bar', 
    title: 'Analytics',
    description: 'View system analytics and performance metrics',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" /></svg>',
    link: '/admin/chart-bar',
    color: 'bg-amber-100 text-amber-600'
  },
  { 
    id: 'clipboard-list', 
    title: 'Activity Log',
    description: 'Review system activity and user actions',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg>',
    link: '/admin/clipboard-list',
    color: 'bg-emerald-100 text-emerald-600'
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
  { id: 'feed-1', name: 'Clinical Trials Data', provider: 'ClinicalTrials.gov', status: 'active', lastUpdate: '2023-12-09T10:15:00Z', frequency: 'daily' },
  { id: 'feed-2', name: 'FDA Approvals', provider: 'FDA.gov', status: 'active', lastUpdate: '2023-12-08T14:30:00Z', frequency: 'daily' },
  { id: 'feed-3', name: 'EMA Decisions', provider: 'EMA Europa', status: 'active', lastUpdate: '2023-12-07T09:45:00Z', frequency: 'daily' },
  { id: 'feed-4', name: 'Financial Data', provider: 'Bloomberg', status: 'active', lastUpdate: '2023-12-10T08:00:00Z', frequency: 'hourly' },
  { id: 'feed-5', name: 'News Articles', provider: 'PharmaNews API', status: 'inactive', lastUpdate: '2023-11-30T16:20:00Z', frequency: 'hourly' }
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

// Get therapeutic area by ID
export function getTherapeuticAreaById(id: string) {
  return therapeuticAreasData.find(area => area.id === id);
}

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
  userManagement
}; 