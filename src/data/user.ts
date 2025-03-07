/**
 * Mock User Data
 * 
 * This file contains mock user data for UI prototyping purposes.
 * In a real application, this would come from an API or database.
 */

// Mock user profile
export const userProfile = {
  id: 'user-001',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  jobTitle: 'Pharmaceutical Research Analyst',
  company: 'BioHealth Partners',
  avatarUrl: '/images/avatars/female-1.jpg',
  createdAt: '2023-09-12T14:30:00Z',
};

// Mock user preferences
export const userPreferences = {
  notifications: {
    email: true,
    push: false,
    marketingEmails: false,
    newCompanyAlerts: true,
    productApprovals: true,
    websiteLaunches: false,
  },
  display: {
    theme: 'light',
    compactMode: false,
    dashboardLayout: 'grid',
  },
  privacy: {
    showProfilePublicly: true,
    shareActivityWithinOrg: true,
  },
};

// Mock followed companies
export const followedCompanies = [
  { id: 'pfizer', name: 'Pfizer', followedAt: '2023-12-10T09:15:00Z' },
  { id: 'novartis', name: 'Novartis', followedAt: '2023-11-25T14:20:00Z' },
  { id: 'roche', name: 'Roche', followedAt: '2024-01-05T11:45:00Z' },
  { id: 'merck', name: 'Merck', followedAt: '2024-02-18T16:30:00Z' },
  { id: 'gsk', name: 'GlaxoSmithKline', followedAt: '2023-10-30T13:10:00Z' },
];

// Mock followed therapeutic areas
export const followedTherapeuticAreas = [
  { id: 'oncology', name: 'Oncology', followedAt: '2023-12-05T10:30:00Z' },
  { id: 'neurology', name: 'Neurology', followedAt: '2024-01-12T08:45:00Z' },
  { id: 'immunology', name: 'Immunology', followedAt: '2023-11-18T14:20:00Z' },
];

// Mock followed products
export const followedProducts = [
  { id: 'product-001', name: 'Lipitor', company: 'Pfizer', followedAt: '2024-01-08T15:20:00Z' },
  { id: 'product-002', name: 'Humira', company: 'AbbVie', followedAt: '2023-12-22T09:30:00Z' },
  { id: 'product-003', name: 'Keytruda', company: 'Merck', followedAt: '2024-02-03T11:15:00Z' },
];

// Mock notifications
export const notifications = [
  {
    id: 'notif-001',
    type: 'company_update',
    title: 'Pfizer announced Q4 earnings',
    description: 'Pfizer reported strong Q4 2023 earnings, exceeding analyst expectations.',
    timestamp: '2024-02-20T13:45:00Z',
    read: false,
    entityId: 'pfizer',
    entityType: 'company',
  },
  {
    id: 'notif-002',
    type: 'product_approval',
    title: 'Novartis receives FDA approval for new drug',
    description: 'Novartis has received FDA approval for its new treatment targeting multiple sclerosis.',
    timestamp: '2024-02-15T09:30:00Z',
    read: true,
    entityId: 'product-004',
    entityType: 'product',
  },
  {
    id: 'notif-003',
    type: 'website_launch',
    title: 'Roche launches new product website',
    description: 'Roche has launched a new website for its oncology product line.',
    timestamp: '2024-02-10T14:20:00Z',
    read: false,
    entityId: 'roche',
    entityType: 'company',
  },
  {
    id: 'notif-004',
    type: 'therapeutic_area',
    title: 'New breakthrough in Oncology research',
    description: 'Major breakthrough announced in cancer immunotherapy research.',
    timestamp: '2024-02-05T11:10:00Z',
    read: true,
    entityId: 'oncology',
    entityType: 'therapeutic_area',
  },
  {
    id: 'notif-005',
    type: 'company_update',
    title: 'Merck announces acquisition',
    description: 'Merck has announced the acquisition of a biotech startup focused on rare diseases.',
    timestamp: '2024-01-28T16:50:00Z',
    read: false,
    entityId: 'merck',
    entityType: 'company',
  },
  {
    id: 'notif-006',
    type: 'product_update',
    title: 'Keytruda shows positive results in new trial',
    description: 'Keytruda demonstrated positive results in Phase III clinical trial for new indication.',
    timestamp: '2024-01-20T10:15:00Z',
    read: true,
    entityId: 'product-003',
    entityType: 'product',
  },
];

// Mock saved searches
export const savedSearches = [
  {
    id: 'search-001',
    name: 'Oncology Companies in Europe',
    query: 'therapeutic_area:oncology AND region:europe',
    createdAt: '2024-01-15T09:20:00Z',
    lastRun: '2024-02-18T14:30:00Z',
  },
  {
    id: 'search-002',
    name: 'Rare Disease Products',
    query: 'category:"rare disease"',
    createdAt: '2023-12-10T11:45:00Z',
    lastRun: '2024-02-10T16:15:00Z',
  },
  {
    id: 'search-003',
    name: 'Patient Websites',
    query: 'website_type:patient',
    createdAt: '2024-02-05T13:30:00Z',
    lastRun: '2024-02-20T10:45:00Z',
  },
];

// Mock user widget configuration for dashboard
export const userWidgets = [
  {
    id: 'widget-001',
    type: 'followed_companies',
    title: 'Companies You Follow',
    position: 1,
    size: 'medium',
    enabled: true,
  },
  {
    id: 'widget-002',
    type: 'recent_notifications',
    title: 'Recent Notifications',
    position: 2,
    size: 'large',
    enabled: true,
  },
  {
    id: 'widget-003',
    type: 'therapeutic_areas',
    title: 'Therapeutic Areas',
    position: 3,
    size: 'small',
    enabled: true,
  },
  {
    id: 'widget-004',
    type: 'saved_searches',
    title: 'Saved Searches',
    position: 4,
    size: 'medium',
    enabled: false,
  },
  {
    id: 'widget-005',
    type: 'recent_products',
    title: 'Recently Viewed Products',
    position: 5, 
    size: 'medium',
    enabled: true,
  },
]; 