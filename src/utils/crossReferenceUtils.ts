/**
 * Cross-Reference Utilities
 * 
 * Helper functions for managing relationships between entities (companies, products, websites, therapeutic areas).
 */

import { 
  companies, 
  products, 
  websites, 
  getCompanyById, 
  getProductById, 
  getWebsiteById 
} from './dataUtils';
import { filterAndSortItems } from './filterUtils';

/**
 * Get all websites owned by a specific company
 */
export function getWebsitesByCompany(companyId: string) {
  return websites.filter(website => website.companyId === companyId);
}

/**
 * Get all websites associated with a specific product
 */
export function getWebsitesByProduct(productId: string) {
  return websites.filter(
    website => website.products && website.products.includes(productId)
  );
}

/**
 * Get all websites related to a specific therapeutic area
 */
export function getWebsitesByTherapeuticArea(therapeuticArea: string) {
  return websites.filter(
    website => website.therapeuticAreas && website.therapeuticAreas.includes(therapeuticArea)
  );
}

/**
 * Get all products by company ID
 */
export function getProductsByCompany(companyId: string) {
  return products.filter(product => product.companyId === companyId);
}

/**
 * Get all products related to a therapeutic area
 */
export function getProductsByTherapeuticArea(therapeuticArea: string) {
  return products.filter(
    product => product.therapeuticAreas && product.therapeuticAreas.includes(therapeuticArea)
  );
}

/**
 * Validate that a website's company reference exists
 */
export function validateWebsiteCompany(website: any) {
  return !!getCompanyById(website.companyId);
}

/**
 * Validate that all product references in a website exist
 */
export function validateWebsiteProducts(website: any) {
  if (!website.products || !Array.isArray(website.products)) {
    return true; // No products to validate
  }
  
  return website.products.every((productId: string) => !!getProductById(productId));
}

/**
 * Get filtered websites by various criteria
 */
export function getFilteredWebsites(options: {
  companyId?: string;
  productId?: string;
  therapeuticArea?: string;
  category?: string;
  searchQuery?: string;
}) {
  const { companyId, productId, therapeuticArea, category, searchQuery } = options;
  
  const filters: Record<string, any> = {};
  if (companyId) filters.companyId = companyId;
  if (category) filters.category = category;
  
  let results = filterAndSortItems(websites, {
    searchQuery,
    searchFields: ['domain', 'description', 'siteName'],
    filters
  });
  
  // Handle special filters that need custom logic
  if (productId) {
    results = results.filter(website => 
      website.products && website.products.includes(productId)
    );
  }
  
  if (therapeuticArea) {
    results = results.filter(website => 
      website.therapeuticAreas && website.therapeuticAreas.includes(therapeuticArea)
    );
  }
  
  return results;
}

/**
 * Get summary of website connections to other entities
 */
export function getWebsiteConnectionSummary(websiteId: string) {
  const website = getWebsiteById(websiteId);
  if (!website) return null;
  
  const company = getCompanyById(website.companyId);
  
  const relatedProducts = website.products 
    ? website.products.map(id => getProductById(id)).filter(Boolean)
    : [];
    
  return {
    website,
    company,
    relatedProducts,
    therapeuticAreas: website.therapeuticAreas || []
  };
} 