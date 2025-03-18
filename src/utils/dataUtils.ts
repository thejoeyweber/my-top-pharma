/**
 * Data Utilities
 * 
 * Helper functions to access data from Supabase with proper typing
 * and consistent error handling.
 */
import { supabase, logDatabaseError } from '../lib/supabase';
import { dbCompanyToCompany } from '../interfaces/entities/Company';
import { dbProductToProduct } from '../interfaces/entities/Product';
import { dbWebsiteToWebsite } from '../interfaces/entities/Website';
import { dbTherapeuticAreaToTherapeuticArea } from '../interfaces/entities/TherapeuticArea';
import type { Company, Product, Website, TherapeuticArea } from '../interfaces/entities';

/**
 * Get all therapeutic areas
 */
export async function getAllTherapeuticAreas(): Promise<TherapeuticArea[]> {
  try {
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data ? data.map(dbTherapeuticAreaToTherapeuticArea) : [];
  } catch (error) {
    logDatabaseError(error, 'getAllTherapeuticAreas');
    return [];
  }
}

/**
 * Get a therapeutic area by ID
 */
export async function getTherapeuticAreaById(id: string): Promise<TherapeuticArea | undefined> {
  try {
    const { data, error } = await supabase
      .from('therapeutic_areas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbTherapeuticAreaToTherapeuticArea(data) : undefined;
  } catch (error) {
    logDatabaseError(error, `getTherapeuticAreaById(${id})`);
    return undefined;
  }
}

/**
 * Get all companies
 */
export async function getAllCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data ? data.map(dbCompanyToCompany) : [];
  } catch (error) {
    logDatabaseError(error, 'getAllCompanies');
    return [];
  }
}

/**
 * Get a company by ID
 */
export async function getCompanyById(id: string): Promise<Company | undefined> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbCompanyToCompany(data) : undefined;
  } catch (error) {
    logDatabaseError(error, `getCompanyById(${id})`);
    return undefined;
  }
}

/**
 * Get companies by therapeutic area
 */
export async function getCompaniesByTherapeuticArea(therapeuticAreaId: string): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .contains('therapeutic_area_ids', [therapeuticAreaId]);
    
    if (error) throw error;
    return data ? data.map(dbCompanyToCompany) : [];
  } catch (error) {
    logDatabaseError(error, `getCompaniesByTherapeuticArea(${therapeuticAreaId})`);
    return [];
  }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data ? data.map(dbProductToProduct) : [];
  } catch (error) {
    logDatabaseError(error, 'getAllProducts');
    return [];
  }
}

/**
 * Get a product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbProductToProduct(data) : undefined;
  } catch (error) {
    logDatabaseError(error, `getProductById(${id})`);
    return undefined;
  }
}

/**
 * Get products by company
 */
export async function getProductsByCompany(companyId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data ? data.map(dbProductToProduct) : [];
  } catch (error) {
    logDatabaseError(error, `getProductsByCompany(${companyId})`);
    return [];
  }
}

/**
 * Get products by therapeutic area
 */
export async function getProductsByTherapeuticArea(therapeuticAreaId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('therapeutic_area_ids', [therapeuticAreaId]);
    
    if (error) throw error;
    return data ? data.map(dbProductToProduct) : [];
  } catch (error) {
    logDatabaseError(error, `getProductsByTherapeuticArea(${therapeuticAreaId})`);
    return [];
  }
}

/**
 * Get all websites
 */
export async function getAllWebsites(): Promise<Website[]> {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('title');
    
    if (error) throw error;
    return data ? data.map(dbWebsiteToWebsite) : [];
  } catch (error) {
    logDatabaseError(error, 'getAllWebsites');
    return [];
  }
}

/**
 * Get a website by ID
 */
export async function getWebsiteById(id: string): Promise<Website | undefined> {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? dbWebsiteToWebsite(data) : undefined;
  } catch (error) {
    logDatabaseError(error, `getWebsiteById(${id})`);
    return undefined;
  }
}

/**
 * Get websites by company
 */
export async function getWebsitesByCompany(companyId: string): Promise<Website[]> {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data ? data.map(dbWebsiteToWebsite) : [];
  } catch (error) {
    logDatabaseError(error, `getWebsitesByCompany(${companyId})`);
    return [];
  }
}

/**
 * Get websites by therapeutic area
 */
export async function getWebsitesByTherapeuticArea(therapeuticAreaId: string): Promise<Website[]> {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .contains('therapeutic_area_ids', [therapeuticAreaId]);
    
    if (error) throw error;
    return data ? data.map(dbWebsiteToWebsite) : [];
  } catch (error) {
    logDatabaseError(error, `getWebsitesByTherapeuticArea(${therapeuticAreaId})`);
    return [];
  }
}

// Website categories for consistent labeling
export const websiteCategories = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'product', label: 'Product' },
  { value: 'hcp', label: 'Healthcare Professional' },
  { value: 'patient', label: 'Patient' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'clinical-trials', label: 'Clinical Trials' },
  { value: 'disease-education', label: 'Disease Education' },
  { value: 'ir', label: 'Investor Relations' }
];

/**
 * Mock system statistics for the admin dashboard
 */
export const systemStats = [
  {
    label: 'Total Companies',
    value: 152,
    change: '+12%',
    trend: 'up',
    icon: `<svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>`
  },
  {
    label: 'Total Products',
    value: 873,
    change: '+3.2%',
    trend: 'up',
    icon: `<svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>`
  },
  {
    label: 'Therapeutic Areas',
    value: 48,
    change: '+0%',
    trend: 'up',
    icon: `<svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>`
  },
  {
    label: 'Websites Tracked',
    value: 236,
    change: '-2.7%',
    trend: 'down',
    icon: `<svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>`
  }
];

/**
 * Mock recent crawler jobs for the admin dashboard
 */
export const recentCrawlerJobs = [
  {
    id: 'CJ-2023-05-15-001',
    startTime: '2023-05-15T09:00:00Z',
    endTime: '2023-05-15T11:30:00Z',
    status: 'complete',
    websitesUpdated: 48,
    websitesAdded: 3,
    errors: 0
  },
  {
    id: 'CJ-2023-05-14-001',
    startTime: '2023-05-14T09:00:00Z',
    endTime: '2023-05-14T12:15:00Z',
    status: 'complete',
    websitesUpdated: 52,
    websitesAdded: 1,
    errors: 2
  },
  {
    id: 'CJ-2023-05-13-001',
    startTime: '2023-05-13T09:00:00Z',
    endTime: '2023-05-13T10:45:00Z',
    status: 'complete',
    websitesUpdated: 46,
    websitesAdded: 0,
    errors: 0
  },
  {
    id: 'CJ-2023-05-12-001',
    startTime: '2023-05-12T09:00:00Z',
    endTime: '2023-05-12T09:35:00Z',
    status: 'failed',
    websitesUpdated: 12,
    websitesAdded: 0,
    errors: 8
  }
];

/**
 * Mock admin shortcuts for the admin dashboard
 */
export const adminShortcuts = [
  {
    title: 'Import Data',
    description: 'Import data from CSV files',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>`,
    link: '/admin/import',
    color: 'bg-indigo-600'
  },
  {
    title: 'Export Data',
    description: 'Export data to CSV or JSON',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>`,
    link: '/admin/export',
    color: 'bg-blue-600'
  },
  {
    title: 'Run Crawler',
    description: 'Start a new crawler job',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    link: '/admin/crawler',
    color: 'bg-green-600'
  },
  {
    title: 'Database Maintenance',
    description: 'Optimize and maintain database',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>`,
    link: '/admin/database',
    color: 'bg-yellow-600'
  },
  {
    title: 'System Logs',
    description: 'View system logs and errors',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>`,
    link: '/admin/logs',
    color: 'bg-red-600'
  },
  {
    title: 'User Management',
    description: 'Manage user accounts',
    icon: `<svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`,
    link: '/admin/users',
    color: 'bg-purple-600'
  }
]; 