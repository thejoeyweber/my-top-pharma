/**
 * Filter Utilities
 * 
 * Helper functions for filtering and searching data on the client side.
 */

/**
 * Normalize text for search by converting to lowercase and removing diacritics
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Check if an item matches a search query
 */
export function matchesSearch<T>(
  item: T,
  query: string,
  fields: (keyof T)[]
): boolean {
  if (!query) return true;
  
  const normalizedQuery = normalizeText(query);
  
  return fields.some(field => {
    const value = item[field];
    if (value == null) return false;
    
    // Check if value is a string
    if (typeof value === 'string') {
      return normalizeText(value).includes(normalizedQuery);
    }
    
    // Check if value is an array of strings
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return value.some(v => normalizeText(v).includes(normalizedQuery));
    }
    
    // Check if value is a number or boolean (convert to string)
    if (typeof value === 'number' || typeof value === 'boolean') {
      return normalizeText(String(value)).includes(normalizedQuery);
    }
    
    return false;
  });
}

/**
 * Check if an item matches a set of filters
 */
export function matchesFilters<T>(
  item: T,
  filters: Record<string, any>
): boolean {
  if (!filters || Object.keys(filters).length === 0) return true;
  
  return Object.entries(filters).every(([key, filterValue]) => {
    const itemValue = item[key as keyof T];
    
    // Skip if the item doesn't have this property
    if (itemValue === undefined) return true;
    
    // Handle array filter values (multiple selection)
    if (Array.isArray(filterValue)) {
      if (filterValue.length === 0) return true;
      
      // If the item value is also an array, check for intersection
      if (Array.isArray(itemValue)) {
        return filterValue.some(fv => itemValue.includes(fv));
      }
      
      // If the item value is not an array, check if it's in the filter values
      return filterValue.includes(itemValue);
    }
    
    // Handle range filter (object with min/max)
    if (filterValue && typeof filterValue === 'object' && ('min' in filterValue || 'max' in filterValue)) {
      const numericValue = Number(itemValue);
      if (isNaN(numericValue)) return true;
      
      const { min, max } = filterValue;
      const minValue = min !== undefined ? Number(min) : Number.MIN_SAFE_INTEGER;
      const maxValue = max !== undefined ? Number(max) : Number.MAX_SAFE_INTEGER;
      
      return numericValue >= minValue && numericValue <= maxValue;
    }
    
    // Handle string or number equality
    return itemValue === filterValue;
  });
}

/**
 * Sort items based on a sort field and direction
 */
export function sortItems<T>(
  items: T[],
  sortField: keyof T | null,
  sortDirection: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortField) return items;
  
  return [...items].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    
    // Compare strings case-insensitively
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Compare numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    // Convert to strings as fallback
    const aString = String(aValue);
    const bString = String(bValue);
    
    return sortDirection === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });
}

/**
 * Apply search, filters, and sorting to an array of items
 */
export function filterAndSortItems<T>(
  items: T[],
  options: {
    searchQuery?: string;
    searchFields?: (keyof T)[];
    filters?: Record<string, any>;
    sortField?: keyof T | null;
    sortDirection?: 'asc' | 'desc';
  }
): T[] {
  const {
    searchQuery = '',
    searchFields = [],
    filters = {},
    sortField = null,
    sortDirection = 'asc'
  } = options;
  
  // First filter by search query
  const searchResults = searchQuery
    ? items.filter(item => matchesSearch(item, searchQuery, searchFields))
    : items;
  
  // Then filter by other filters
  const filteredResults = Object.keys(filters).length
    ? searchResults.filter(item => matchesFilters(item, filters))
    : searchResults;
  
  // Finally sort the results
  return sortField
    ? sortItems(filteredResults, sortField, sortDirection)
    : filteredResults;
} 