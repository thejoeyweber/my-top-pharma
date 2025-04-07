/**
 * URL Utilities
 * 
 * Common functions for URL manipulation and parameter handling used across the application.
 */

/**
 * Creates a new URL with updated parameters
 * 
 * @param updates - Object containing parameter updates
 * @param baseUrl - The base URL to update (defaults to current URL if used client-side)
 * @returns String URL with updated parameters
 */
export function updateUrlParams(
  updates: Record<string, string | string[] | number | null | undefined>,
  baseUrl?: string | URL
): string {
  // In SSR context (Astro), we need to provide a base URL
  // In client-side context, we can default to current URL
  const url = baseUrl 
    ? (typeof baseUrl === 'string' ? new URL(baseUrl) : baseUrl)
    : new URL(window.location.href);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else if (Array.isArray(value)) {
      if (value.length) {
        url.searchParams.set(key, value.join(','));
      } else {
        url.searchParams.delete(key);
      }
    } else {
      url.searchParams.set(key, value.toString());
    }
  });
  
  return url.pathname + url.search;
}

/**
 * Creates a URL with parameters for pagination
 * 
 * @param baseUrl - The base URL (page path)
 * @param currentParams - Current parameters to preserve
 * @param page - Page number to set
 * @returns String URL with updated pagination parameter
 */
export function getPaginationUrl(
  baseUrl: string,
  currentParams: URLSearchParams,
  page: number
): string {
  const params = new URLSearchParams(currentParams.toString());
  params.set('page', page.toString());
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Parses pagination parameters from URL search params
 * 
 * @param params - URL search parameters 
 * @param defaultLimit - Default number of items per page
 * @returns Object with page, limit, and offset values
 */
export function getPaginationParams(
  params: URLSearchParams,
  defaultLimit: number = 20
): { page: number; limit: number; offset: number } {
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || defaultLimit.toString());
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
} 