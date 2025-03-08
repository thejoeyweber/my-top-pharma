/**
 * Type Definitions Index
 * 
 * This file re-exports all types from the various type modules
 * to make them easier to import across the application.
 */

// Re-export from companies
export type { 
  Company, 
  TherapeuticArea, 
  // Rename Company's Product type to avoid conflict
  Product as CompanyProduct, 
  Milestone, 
  FinancialMetric 
} from './companies';

// Re-export from products
export type {
  Product,
  ProductStage,
  ProductApproval,
  ProductTimeline
} from './products';

// Re-export from websites
export type {
  Website,
  WebsiteCategory
} from './websites';

// Re-export from user
export type {
  UserProfile,
  UserPreferences,
  UserNotification,
  FollowedItem
} from './user';

// Re-export from admin
export type {
  SystemStats,
  ApiEndpoint,
  CrawlerConfig,
  LogEntry,
  UserManagementData
} from './admin'; 