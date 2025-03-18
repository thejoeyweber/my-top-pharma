/**
 * Entity Interfaces Index
 * 
 * This file exports all entity interfaces and associated types/functions
 */

// Export Company entities
export type { Company, DbCompany } from './Company';
export { 
  dbCompanyToCompany,
  companyToDbCompany
} from './Company';

// Export Product entities
export type { Product, DbProduct } from './Product';
export {
  dbProductToProduct,
  productToDbProduct
} from './Product';

// Export TherapeuticArea entities
export type { TherapeuticArea, DbTherapeuticArea } from './TherapeuticArea';
export {
  dbTherapeuticAreaToTherapeuticArea,
  therapeuticAreaToDbTherapeuticArea
} from './TherapeuticArea';

// Export Website entities
export type { Website, DbWebsite } from './Website';
export {
  dbWebsiteToWebsite,
  websiteToDbWebsite
} from './Website'; 