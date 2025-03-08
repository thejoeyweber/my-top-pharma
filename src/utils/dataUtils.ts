/**
 * Data Utilities
 * 
 * Utilities for loading JSON data and resolving asset paths.
 * This file provides type-safe access to data stored in JSON files.
 */

// Import types for type safety
import type { 
  Company, 
  TherapeuticArea,
  CompanyProduct,
  Product,
  ProductStage, 
  ProductApproval, 
  ProductTimeline,
  Website, 
  WebsiteCategory,
  UserProfile, 
  UserPreferences, 
  UserNotification, 
  FollowedItem,
  SystemStats, 
  ApiEndpoint, 
  CrawlerConfig, 
  LogEntry, 
  UserManagementData 
} from '../types';

/**
 * Load data from a JSON file
 * @param path Path to the JSON file
 * @returns The parsed JSON data
 */
async function loadJsonData<T>(path: string): Promise<T> {
  try {
    console.log(`[JSON Data Loader] Loading data from ${path}`);
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load data from ${path}: ${response.statusText}`);
    }
    const data = await response.json() as T;
    console.log(`[JSON Data Loader] Successfully loaded data from ${path}`);
    return data;
  } catch (error) {
    console.error(`Error loading data from ${path}:`, error);
    throw error;
  }
}

/**
 * Resolve an asset path for an SVG
 * @param type The type of asset (icon, logo, screenshot, product)
 * @param id The ID of the asset
 * @returns The path to the asset
 */
export function getAssetPath(type: 'icon' | 'logo' | 'screenshot' | 'product', id: string): string {
  const typeToFolder = {
    'icon': 'icons',
    'logo': 'logos',
    'screenshot': 'screenshots',
    'product': 'products'
  };
  return `/src/data/assets/${typeToFolder[type]}/${id}.svg`;
}

// Companies data
let companiesData: Company[] | null = null;
let therapeuticAreasData: TherapeuticArea[] | null = null;

export async function getCompanies(): Promise<Company[]> {
  if (!companiesData) {
    companiesData = await loadJsonData<Company[]>('/src/data/json/companies.json');
  }
  return companiesData;
}

export async function getTherapeuticAreas(): Promise<TherapeuticArea[]> {
  if (!therapeuticAreasData) {
    therapeuticAreasData = await loadJsonData<TherapeuticArea[]>('/src/data/json/therapeuticAreas.json');
  }
  return therapeuticAreasData;
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  const companies = await getCompanies();
  return companies.find(company => company.id === id);
}

// Products data
let productsData: Product[] | null = null;
let indicationsData: string[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (!productsData) {
    productsData = await loadJsonData<Product[]>('/src/data/json/products.json');
  }
  return productsData;
}

export async function getIndications(): Promise<string[]> {
  if (!indicationsData) {
    indicationsData = await loadJsonData<string[]>('/src/data/json/indications.json');
  }
  return indicationsData;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(product => product.id === id);
}

export async function getProductsByCompany(companyId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(product => product.companyId === companyId);
}

// Websites data
let websitesData: Website[] | null = null;
let websiteCategoriesData: { value: string, label: string }[] | null = null;
let regionsData: { value: string, label: string }[] | null = null;

export async function getWebsites(): Promise<Website[]> {
  if (!websitesData) {
    websitesData = await loadJsonData<Website[]>('/src/data/json/websites.json');
  }
  return websitesData;
}

export async function getWebsiteCategories(): Promise<{ value: string, label: string }[]> {
  if (!websiteCategoriesData) {
    websiteCategoriesData = await loadJsonData<{ value: string, label: string }[]>('/src/data/json/websiteCategories.json');
  }
  return websiteCategoriesData;
}

export async function getRegions(): Promise<{ value: string, label: string }[]> {
  if (!regionsData) {
    regionsData = await loadJsonData<{ value: string, label: string }[]>('/src/data/json/regions.json');
  }
  return regionsData;
}

export async function getWebsiteById(id: string): Promise<Website | undefined> {
  const websites = await getWebsites();
  return websites.find(website => website.id === id);
}

export async function getWebsitesByCompany(companyId: string): Promise<Website[]> {
  const websites = await getWebsites();
  return websites.filter(website => website.companyId === companyId);
}

// User data
let userProfileData: UserProfile | null = null;
let userPreferencesData: UserPreferences | null = null;
let followedCompaniesData: { id: string, name: string, followedAt: string }[] | null = null;

export async function getUserProfile(): Promise<UserProfile> {
  if (!userProfileData) {
    userProfileData = await loadJsonData<UserProfile>('/src/data/json/userProfile.json');
  }
  return userProfileData;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  if (!userPreferencesData) {
    userPreferencesData = await loadJsonData<UserPreferences>('/src/data/json/userPreferences.json');
  }
  return userPreferencesData;
}

export async function getFollowedCompanies(): Promise<{ id: string, name: string, followedAt: string }[]> {
  if (!followedCompaniesData) {
    followedCompaniesData = await loadJsonData<{ id: string, name: string, followedAt: string }[]>('/src/data/json/followedCompanies.json');
  }
  return followedCompaniesData;
}

// Admin data
let systemStatsData: SystemStats[] | null = null;

export async function getSystemStats(): Promise<SystemStats[]> {
  if (!systemStatsData) {
    systemStatsData = await loadJsonData<SystemStats[]>('/src/data/json/systemStats.json');
  }
  return systemStatsData;
} 