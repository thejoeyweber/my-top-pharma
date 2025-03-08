/**
 * Asset Utilities
 * 
 * Helper functions for resolving URLs to assets like images, icons, etc.
 */

/**
 * Get the URL to a company logo
 */
export function getCompanyLogoUrl(companyId: string): string {
  return `/src/data/assets/logos/${companyId}.svg`;
}

/**
 * Get the URL to a company header image
 */
export function getCompanyHeaderUrl(companyId: string): string {
  return `/images/headers/${companyId}-header.jpg`;
}

/**
 * Get the URL to a product image
 */
export function getProductImageUrl(productId: string): string {
  return `/src/data/assets/products/${productId}.svg`;
}

/**
 * Get the URL to a website screenshot
 */
export function getWebsiteScreenshotUrl(websiteId: string): string {
  return `/src/data/assets/screenshots/${websiteId}.jpg`;
}

/**
 * Get the URL to an icon
 */
export function getIconUrl(iconId: string): string {
  return `/src/data/assets/icons/${iconId}.svg`;
} 