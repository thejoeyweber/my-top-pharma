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
 * Preserves specified parameters while updating others
 * 
 * @param updates - Object containing parameter updates
 * @param preserveParams - Array of parameter names to preserve
 * @param baseUrl - The base URL to update (defaults to current URL if used client-side)
 * @returns String URL with updated parameters
 */
export function preserveParams(
  updates: Record<string, string | string[] | number | null | undefined>,
  preserveParams: string[] = ['view', 'page', 'filter'],
  baseUrl?: string | URL
): string {
  const url = baseUrl 
    ? (typeof baseUrl === 'string' ? new URL(baseUrl) : baseUrl)
    : new URL(window.location.href);
  
  // Collect values of parameters to preserve
  const preserved: Record<string, string> = {};
  preserveParams.forEach(param => {
    const value = url.searchParams.get(param);
    if (value) {
      preserved[param] = value;
    }
  });
  
  // Merge preserved values with updates (updates take precedence)
  return updateUrlParams({...preserved, ...updates}, url);
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

/**
 * Updates sort parameters while preserving view mode and other key parameters
 * 
 * @param sortValue - The sort parameter value to set
 * @param currentUrl - The current URL (defaults to window.location in client context)
 * @param paramsToPreserve - Array of parameters to preserve (defaults to ['view'])
 * @returns String URL with updated sort parameter and preserved parameters
 */
export function updateSortParams(
  sortValue: string,
  currentUrl?: string | URL,
  paramsToPreserve: string[] = ['view']
): string {
  // Create URL object from current URL
  const url = currentUrl 
    ? (typeof currentUrl === 'string' ? new URL(currentUrl) : currentUrl)
    : new URL(window.location.href);
  
  // Create updates object with new sort parameter
  const updates: Record<string, string> = { 
    sort: sortValue 
  };
  
  // Only preserve parameters that actually exist in the URL
  paramsToPreserve.forEach(param => {
    if (url.searchParams.has(param)) {
      updates[param] = url.searchParams.get(param)!;
    }
  });
  
  // Use the existing updateUrlParams function to apply the updates
  return updateUrlParams(updates, url);
}

/**
 * Updates view mode parameter while preserving sort and other key parameters
 * 
 * @param viewMode - The view mode value to set
 * @param currentUrl - The current URL (defaults to window.location in client context)
 * @param paramsToPreserve - Array of parameters to preserve (defaults to ['sort', 'filter'])
 * @returns String URL with updated view mode parameter and preserved parameters
 */
export function updateViewParams(
  viewMode: string,
  currentUrl?: string | URL,
  paramsToPreserve: string[] = ['sort', 'filter']
): string {
  // Use the more general preserveParams function
  return preserveParams(
    { view: viewMode },
    paramsToPreserve,
    currentUrl
  );
} 