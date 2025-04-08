/**
 * Utils module barrel file
 * Re-exports all utility modules for easier importing
 */

// Re-export company utilities
export * from './companyUtils';

// Re-export product utilities
export * from './productUtils';

// Re-export therapeutic area utilities
// Rename exports to avoid conflicts
export {
  getTherapeuticAreas,
  getTherapeuticAreaBySlug,
  getTherapeuticAreaCompanies,
  getTherapeuticAreaProducts,
  getRelatedTherapeuticAreas,
  getTherapeuticAreaFilters,
  type FilterOption,
  type TherapeuticAreaFilter
} from './therapeuticAreaUtils';

// Re-export website utilities
export * from './websiteUtils';

// Re-export string utilities
export * from './stringUtils';

// Re-export URL utilities
export * from './urlUtils';

// Re-export date utilities
export * from './dateUtils';

// Re-export hydration utilities
export * from './hydrationUtils';

// Re-export schema utilities
export * from './schemaUtils';

// Add other utility exports here as needed 