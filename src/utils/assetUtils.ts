/**
 * Asset Utilities
 * 
 * Helper functions for resolving URLs to assets like images, icons, etc.
 * Uses Astro's asset handling and environment variables for configuration.
 */

/**
 * Get the URL to a company logo
 */
export function getCompanyLogoUrl(companyId: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/companies/${companyId}/logo.svg`;
}

/**
 * Get the URL to a company header image
 */
export function getCompanyHeaderUrl(companyId: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/companies/${companyId}/header.jpg`;
}

/**
 * Get the URL to a product image
 * Note: Currently returns a placeholder as product images aren't available yet
 */
export function getProductImageUrl(productId: string): string | null {
  // Return null to indicate no image available
  return null;
  
  // Alternatively, when product images are ready, uncomment:
  // const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  // return `${baseUrl}/products/${productId}/image.svg`;
}

/**
 * Get the URL to a website screenshot
 */
export function getWebsiteScreenshotUrl(websiteId: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/websites/${websiteId}/screenshot.jpg`;
}

/**
 * Get the URL to an icon
 */
export function getIconUrl(iconId: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/icons/${iconId}.svg`;
}

/**
 * Get the URL to a therapeutic area icon
 */
export function getTherapeuticAreaIconUrl(areaId: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/therapeutic-areas/${areaId}/icon.svg`;
}

/**
 * Get the URL to a placeholder image
 */
export function getPlaceholderUrl(type: 'company' | 'product' | 'website'): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_BASE_URL || '/assets';
  return `${baseUrl}/placeholders/${type}.svg`;
} 