/**
 * Entity Interfaces Index
 * 
 * This file exports all entity interfaces and associated types/functions
 */

// Export Company entities
export type { 
  Company, 
  DbCompany, 
  DbCompanyInsert,
  DbCompanyUpdate,
  CompanyFilter, 
  CompanyProduct,
  Milestone,
  FinancialMetric,
  RelatedCompany,
  CompanyWithTAs,
  CompanyListResponse,
  CompanyRelationType,
  DBCompany
} from './Company';
export { 
  dbCompanyToCompany,
  companyToDbCompany
} from './Company';

// Export Product entities
export type { 
  Product, 
  DbProduct, 
  DbProductInsert,
  DbProductUpdate,
  DBProduct, 
  ProductStage,
  ProductFilter,
  ProductTimeline,
  ProductApproval,
  ProductPatent,
  ProductListResponse
} from './Product';
export {
  dbProductToProduct,
  productToDbProduct
} from './Product';

// Export TherapeuticArea entities
export type { 
  TherapeuticArea, 
  DbTherapeuticArea,
  DbTherapeuticAreaInsert,
  DbTherapeuticAreaUpdate,
  PharmClassMapping
} from './TherapeuticArea';
export {
  dbTherapeuticAreaToTherapeuticArea,
  therapeuticAreaToDbTherapeuticArea
} from './TherapeuticArea';

// Export Website entities
export type { 
  Website, 
  DbWebsite,
  DbWebsiteInsert,
  DbWebsiteUpdate,
  DBWebsite,
  WebsiteCategory,
  WebsiteTechStack,
  WebsiteHosting,
  WebsiteFeature,
  WebsiteLegalContent,
  WebsiteDisclaimers,
  ProductWebsite,
  WebsiteInput
} from './Website';
export {
  dbWebsiteToWebsite,
  websiteToDbWebsite,
  WebsiteSchema
} from './Website'; 