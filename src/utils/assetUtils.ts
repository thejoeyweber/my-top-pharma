/**
 * Asset Utilities
 * 
 * Helper functions for working with images and other assets
 * with fallback mechanisms for missing files.
 */

/**
 * Get the company logo URL with a fallback if the specific logo doesn't exist
 */
export function getCompanyLogoUrl(companyId: string): string {
  // Return the company-specific logo path
  return `/images/companies/${companyId}.svg`;
}

/**
 * Get the company header image URL with a fallback
 */
export function getCompanyHeaderUrl(companyId: string): string {
  // Return the company-specific header image path
  return `/images/headers/${companyId}-header.jpg`;
}

/**
 * Get the website screenshot URL with a fallback
 */
export function getWebsiteScreenshotUrl(domain: string, year: string = '2024'): string {
  // Convert domain to URL-safe ID
  const domainId = domain.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  
  // Return the screenshot URL
  return `/screenshots/${domainId}-${year}.png`;
}

/**
 * Get the product image URL with a fallback
 */
export function getProductImageUrl(productId: string): string {
  // Return the product image path
  return `/images/products/${productId}.jpg`;
} 