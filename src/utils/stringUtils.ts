/**
 * String Utility Functions
 * 
 * Common string manipulation utilities used throughout the application.
 */

/**
 * Generate a slug from a string
 * @param name String to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
}

/**
 * Parse a numeric string or return null if invalid
 * @param value Value to parse
 * @returns Parsed number or null
 */
export function parseNumeric(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? null : num;
}

/**
 * Format market cap for display
 * @param marketCap Market cap value
 * @returns Formatted market cap string
 */
export function formatMarketCap(marketCap: number | string): string {
  const num = typeof marketCap === 'string' ? parseFloat(marketCap) : marketCap;
  if (isNaN(num)) return 'N/A';
  
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
} 