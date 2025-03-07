/**
 * Admin Data
 * 
 * Mock data for the administrator dashboard including system statistics,
 * crawler configurations, and API settings.
 */

// System statistics for admin dashboard
export const systemStats = [
  { 
    label: 'Companies', 
    value: 2847, 
    change: '+12%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clip-rule="evenodd" /></svg>'
  },
  { 
    label: 'Products', 
    value: 14382, 
    change: '+8%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5ZM12.75 3h7.5A2.25 2.25 0 0 1 22.5 5.25v6h-5.473a3 3 0 0 0-4.277-4.204V3ZM1.5 15.75v-1.5h4.973a3 3 0 0 0 4.277 4.204V21h-7.5a2.25 2.25 0 0 1-2.25-2.25v-3ZM12.75 21v-2.546a3 3 0 0 0 4.277-4.204H22.5v1.5A2.25 2.25 0 0 1 20.25 21h-7.5Z" /></svg>'
  },
  { 
    label: 'Websites', 
    value: 9271, 
    change: '+15%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" /></svg>'
  },
  { 
    label: 'API Calls', 
    value: 237580, 
    change: '+24%', 
    trend: 'up',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>'
  },
];

// Recent crawler jobs for admin dashboard
export const recentCrawlerJobs = [
  { 
    id: 'crawl-12879',
    startTime: '2025-03-07T08:30:00Z',
    endTime: '2025-03-07T09:45:00Z',
    status: 'complete',
    websitesUpdated: 237,
    websitesAdded: 12,
    errors: 3,
  },
  { 
    id: 'crawl-12878',
    startTime: '2025-03-06T08:30:00Z',
    endTime: '2025-03-06T09:40:00Z',
    status: 'complete',
    websitesUpdated: 215,
    websitesAdded: 8,
    errors: 0,
  },
  { 
    id: 'crawl-12877',
    startTime: '2025-03-05T08:30:00Z',
    endTime: '2025-03-05T09:50:00Z',
    status: 'complete',
    websitesUpdated: 243,
    websitesAdded: 15,
    errors: 5,
  },
  { 
    id: 'crawl-12876',
    startTime: '2025-03-04T08:30:00Z',
    endTime: '2025-03-04T09:30:00Z',
    status: 'complete',
    websitesUpdated: 198,
    websitesAdded: 7,
    errors: 1,
  },
  { 
    id: 'crawl-12875',
    startTime: '2025-03-03T08:30:00Z',
    endTime: '',
    status: 'failed',
    websitesUpdated: 42,
    websitesAdded: 0,
    errors: 23,
  },
];

// Admin shortcut cards
export const adminShortcuts = [
  {
    title: 'Crawler Configuration',
    description: 'Configure crawler rules, patterns, and scheduling',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" /></svg>',
    link: '/admin/crawler-config',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Data Feeds',
    description: 'Manage external data sources and integration',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" /></svg>',
    link: '/admin/data-feeds',
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'API Configuration',
    description: 'Manage API access, tokens, and usage limits',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" /></svg>',
    link: '/admin/api-config',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Reports Administration',
    description: 'Configure report templates and export settings',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875h-5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z" clip-rule="evenodd" /></svg>',
    link: '/admin/reports-admin',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'User Management',
    description: 'Manage user accounts, roles, and permissions',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" /></svg>',
    link: '/admin/user-management',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'System Logs',
    description: 'View system logs and activity history',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg>',
    link: '/admin/system-logs',
    color: 'bg-slate-100 text-slate-700',
  }
];

// Crawler configuration mock data
export const crawlerConfig = {
  general: {
    enableCrawling: true,
    maxConcurrentRequests: 10,
    requestTimeout: 30000, // ms
    respectRobotsTxt: true,
    userAgent: 'TopPharma Crawler/1.0',
  },
  scheduling: {
    frequency: 'daily',
    startTime: '02:00', // UTC
    daysToRun: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    lastRun: '2025-03-07T02:00:00Z',
    nextRun: '2025-03-08T02:00:00Z',
  },
  domainRules: [
    { pattern: '*.pfizer.com', enabled: true, maxDepth: 3 },
    { pattern: '*.merck.com', enabled: true, maxDepth: 3 },
    { pattern: '*.novartis.com', enabled: true, maxDepth: 3 },
    { pattern: '*.roche.com', enabled: true, maxDepth: 2 },
    { pattern: '*.gsk.com', enabled: true, maxDepth: 3 },
    { pattern: '*.abbvie.com', enabled: true, maxDepth: 2 },
    { pattern: '*.sanofi.com', enabled: true, maxDepth: 3 },
    { pattern: '*.astrazeneca.com', enabled: true, maxDepth: 3 },
    { pattern: '*.bms.com', enabled: true, maxDepth: 3 },
    { pattern: '*.amgen.com', enabled: true, maxDepth: 2 },
  ],
  dataExtractionRules: [
    { 
      name: 'Disclaimer detection',
      selector: '.disclaimer, .legal-text, footer .legal, #disclaimer',
      enabled: true
    },
    { 
      name: 'Product mentions',
      selector: '.product-name, .medication-name, [data-product]',
      enabled: true
    },
    { 
      name: 'Therapeutic area detection',
      selector: '.therapeutic-area, .disease-area, .treatment-category',
      enabled: true
    },
  ],
};

// External data feeds mock data
export const dataFeeds = [
  {
    id: 'feed-1',
    name: 'FDA Drug Approvals',
    url: 'https://api.fda.gov/drug/approval',
    active: true,
    frequency: 'daily',
    lastFetch: '2025-03-07T00:00:00Z',
    nextFetch: '2025-03-08T00:00:00Z',
    status: 'healthy',
  },
  {
    id: 'feed-2',
    name: 'ClinicalTrials.gov Updates',
    url: 'https://clinicaltrials.gov/api/v2/studies',
    active: true,
    frequency: 'daily',
    lastFetch: '2025-03-07T00:30:00Z',
    nextFetch: '2025-03-08T00:30:00Z',
    status: 'healthy',
  },
  {
    id: 'feed-3',
    name: 'SEC EDGAR Filings',
    url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    active: true,
    frequency: 'weekly',
    lastFetch: '2025-03-03T01:00:00Z',
    nextFetch: '2025-03-10T01:00:00Z',
    status: 'warning',
    statusDetails: 'Rate limit warnings',
  },
  {
    id: 'feed-4',
    name: 'EMA Medicine Updates',
    url: 'https://www.ema.europa.eu/en/medicines/api',
    active: false,
    frequency: 'weekly',
    lastFetch: '2025-03-03T01:30:00Z',
    nextFetch: null,
    status: 'disabled',
  },
  {
    id: 'feed-5',
    name: 'WHO Essential Medicines',
    url: 'https://apps.who.int/api/medicines',
    active: true,
    frequency: 'monthly',
    lastFetch: '2025-03-01T02:00:00Z',
    nextFetch: '2025-04-01T02:00:00Z',
    status: 'healthy',
  },
];

// API configuration mock data
export const apiConfig = {
  general: {
    enabled: true,
    baseUrl: 'https://api.toppharma.com/v1',
    defaultRateLimit: 1000, // requests per day
    requireAuthentication: true,
  },
  apiKeys: [
    {
      id: 'key-1',
      name: 'Research Partner A',
      key: 'tp_live_xxxxxxxxxxx',
      created: '2025-01-15T10:00:00Z',
      lastUsed: '2025-03-07T14:32:21Z',
      status: 'active',
      rateLimit: 5000,
      endpoints: ['companies', 'products', 'websites'],
    },
    {
      id: 'key-2',
      name: 'Agency Partner B',
      key: 'tp_live_yyyyyyyyyyy',
      created: '2025-02-01T09:30:00Z',
      lastUsed: '2025-03-07T08:12:45Z',
      status: 'active',
      rateLimit: 10000,
      endpoints: ['companies', 'products', 'websites', 'therapeutic-areas'],
    },
    {
      id: 'key-3',
      name: 'University Research',
      key: 'tp_live_zzzzzzzzzzz',
      created: '2025-02-20T14:00:00Z',
      lastUsed: '2025-03-05T11:45:03Z',
      status: 'active',
      rateLimit: 2000,
      endpoints: ['companies', 'products'],
    },
    {
      id: 'key-4',
      name: 'Test Account',
      key: 'tp_test_ttttttttttt',
      created: '2025-03-01T15:30:00Z',
      lastUsed: '2025-03-02T09:22:18Z',
      status: 'revoked',
      rateLimit: 100,
      endpoints: ['companies'],
    },
  ],
  usage: {
    today: 8427,
    yesterday: 7621,
    thisWeek: 45920,
    thisMonth: 158439,
    peakTime: '14:00-15:00',
    topEndpoint: 'companies',
  },
};

// Reports configuration mock data
export const reportsConfig = {
  templates: [
    {
      id: 'template-1',
      name: 'Company Directory',
      description: 'Complete pharmaceutical company directory',
      fields: ['name', 'headquarters', 'foundedYear', 'stockInfo', 'products'],
      format: 'pdf',
      lastGenerated: '2025-03-01T10:00:00Z',
    },
    {
      id: 'template-2',
      name: 'Product Pipeline',
      description: 'Current product pipeline across companies',
      fields: ['name', 'company', 'approvalStatus', 'therapeuticArea', 'phase'],
      format: 'excel',
      lastGenerated: '2025-03-05T14:30:00Z',
    },
    {
      id: 'template-3',
      name: 'Website Compliance Audit',
      description: 'Audit of pharmaceutical websites for compliance',
      fields: ['domain', 'company', 'disclaimers', 'privacyPolicy', 'cookiePolicy', 'compliance'],
      format: 'pdf',
      lastGenerated: '2025-03-07T09:15:00Z',
    },
    {
      id: 'template-4',
      name: 'Therapeutic Area Focus',
      description: 'Products and companies by therapeutic area',
      fields: ['therapeuticArea', 'companies', 'products', 'clinicalTrials'],
      format: 'powerpoint',
      lastGenerated: '2025-02-28T16:45:00Z',
    },
  ],
  scheduledReports: [
    {
      id: 'schedule-1',
      templateId: 'template-1',
      name: 'Monthly Company Directory',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '06:00',
      recipients: ['research@example.com', 'sales@example.com'],
      lastSent: '2025-03-01T06:00:00Z',
      nextSend: '2025-04-01T06:00:00Z',
    },
    {
      id: 'schedule-2',
      templateId: 'template-2',
      name: 'Weekly Pipeline Update',
      frequency: 'weekly',
      dayOfWeek: 'Monday',
      time: '07:00',
      recipients: ['product@example.com'],
      lastSent: '2025-03-04T07:00:00Z',
      nextSend: '2025-03-11T07:00:00Z',
    },
    {
      id: 'schedule-3',
      templateId: 'template-3',
      name: 'Daily Compliance Check',
      frequency: 'daily',
      time: '00:30',
      recipients: ['compliance@example.com', 'legal@example.com'],
      lastSent: '2025-03-07T00:30:00Z',
      nextSend: '2025-03-08T00:30:00Z',
    },
  ],
};

// User management mock data (for future use)
export const userManagement = {
  users: [
    {
      id: 'user-1',
      email: 'admin@toppharma.com',
      name: 'Admin User',
      role: 'admin',
      lastLogin: '2025-03-07T09:12:34Z',
      status: 'active',
      createdAt: '2024-12-01T10:00:00Z',
    },
    {
      id: 'user-2',
      email: 'analyst@toppharma.com',
      name: 'Research Analyst',
      role: 'editor',
      lastLogin: '2025-03-07T08:45:12Z',
      status: 'active',
      createdAt: '2025-01-15T11:30:00Z',
    },
    {
      id: 'user-3',
      email: 'viewer@toppharma.com',
      name: 'Data Viewer',
      role: 'viewer',
      lastLogin: '2025-03-06T14:22:05Z',
      status: 'active',
      createdAt: '2025-02-20T09:15:00Z',
    },
    {
      id: 'user-4',
      email: 'former@toppharma.com',
      name: 'Former User',
      role: 'viewer',
      lastLogin: '2025-01-05T10:17:42Z',
      status: 'inactive',
      createdAt: '2025-01-01T08:00:00Z',
    },
  ],
  roles: [
    {
      id: 'role-1',
      name: 'admin',
      description: 'Full system access',
      permissions: ['read', 'write', 'delete', 'manage-users', 'manage-api'],
    },
    {
      id: 'role-2',
      name: 'editor',
      description: 'Can edit data but not system settings',
      permissions: ['read', 'write'],
    },
    {
      id: 'role-3',
      name: 'viewer',
      description: 'Read-only access',
      permissions: ['read'],
    },
  ],
};

// System logs mock data
export const systemLogs = [
  {
    id: 'log-1',
    timestamp: '2025-03-07T15:42:13Z',
    level: 'info',
    category: 'crawler',
    message: 'Daily crawl completed successfully',
    details: 'Processed 2,547 URLs, updated 237 entries',
  },
  {
    id: 'log-2',
    timestamp: '2025-03-07T14:30:22Z',
    level: 'warning',
    category: 'api',
    message: 'Rate limit approaching for API key tp_live_xxxxxxxxxxx',
    details: '4,872/5,000 requests used (97.4%)',
  },
  {
    id: 'log-3',
    timestamp: '2025-03-07T12:15:05Z',
    level: 'error',
    category: 'data-feed',
    message: 'Connection failed to SEC EDGAR API',
    details: 'Timeout after 30s, will retry in 1 hour',
  },
  {
    id: 'log-4',
    timestamp: '2025-03-07T10:03:41Z',
    level: 'info',
    category: 'user',
    message: 'User admin@toppharma.com logged in',
    details: 'IP: 192.168.1.1, Browser: Chrome 125.0.0',
  },
  {
    id: 'log-5',
    timestamp: '2025-03-07T09:47:18Z',
    level: 'info',
    category: 'report',
    message: 'Scheduled report "Daily Compliance Check" generated',
    details: 'Sent to 2 recipients, 15 pages, PDF format',
  },
  {
    id: 'log-6',
    timestamp: '2025-03-07T08:30:00Z',
    level: 'info',
    category: 'system',
    message: 'Daily backup completed',
    details: 'Database size: 4.2GB, Backup location: Cloud Storage',
  },
  {
    id: 'log-7',
    timestamp: '2025-03-07T02:00:00Z',
    level: 'info',
    category: 'crawler',
    message: 'Daily crawl started',
    details: 'Targeting 2,700 URLs across 47 domains',
  },
  {
    id: 'log-8',
    timestamp: '2025-03-06T23:45:12Z',
    level: 'error',
    category: 'data-feed',
    message: 'Failed to parse response from FDA API',
    details: 'Invalid JSON format, data may be corrupted',
  },
  {
    id: 'log-9',
    timestamp: '2025-03-06T18:22:37Z',
    level: 'warning',
    category: 'system',
    message: 'High CPU usage detected',
    details: '85% utilization for over 10 minutes',
  },
  {
    id: 'log-10',
    timestamp: '2025-03-06T16:05:51Z',
    level: 'info',
    category: 'api',
    message: 'New API key generated',
    details: 'Key ID: tp_live_nnnnnnnnnn, For: "New Research Partner"',
  },
]; 