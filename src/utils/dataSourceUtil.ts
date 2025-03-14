/**
 * Data Source Utility
 * 
 * This utility centralizes data source selection logic to support the phased
 * migration from static JSON to database-driven content. It implements the 
 * three-state approach outlined in the migration plan:
 * 
 * 1. Static JSON (legacy)
 * 2. Local Database (development)
 * 3. Remote Database (production)
 */

import { getFeatureFlag, FEATURES, type FeatureFlag } from './featureFlags';

/**
 * Represents the different data sources available in the application
 */
export enum DataSource {
  STATIC_JSON = 'static_json',
  LOCAL_DATABASE = 'local_database',
  REMOTE_DATABASE = 'remote_database'
}

/**
 * Represents a content type that can be migrated from JSON to database
 */
export type ContentType = 'companies' | 'products' | 'websites' | 'therapeutic_areas';

/**
 * Maps content types to their corresponding feature flags
 */
const contentTypeFlags: Record<ContentType, FeatureFlag> = {
  'companies': 'USE_DATABASE_COMPANIES',
  'products': 'USE_DATABASE_PRODUCTS',
  'websites': 'USE_DATABASE_WEBSITES',
  'therapeutic_areas': 'USE_DATABASE_THERAPEUTIC_AREAS'
};

/**
 * Determines which data source to use for a given content type
 * based on the current feature flag settings
 * 
 * @param contentType The type of content to get the data source for
 * @returns The data source to use (STATIC_JSON, LOCAL_DATABASE, or REMOTE_DATABASE)
 */
export function getDataSource(contentType: ContentType): DataSource {
  // Check if we should use database for this content type
  const useDatabase = getFeatureFlag(contentTypeFlags[contentType]);
  
  if (!useDatabase) {
    // If not using database, use static JSON
    return DataSource.STATIC_JSON;
  }
  
  // If using database, check which one (local or remote)
  const useLocalDatabase = getFeatureFlag('USE_LOCAL_DATABASE');
  
  return useLocalDatabase ? DataSource.LOCAL_DATABASE : DataSource.REMOTE_DATABASE;
}

/**
 * Gets a user-friendly display name for a data source
 */
export function getDataSourceDisplayName(source: DataSource): string {
  switch (source) {
    case DataSource.STATIC_JSON:
      return 'Static JSON';
    case DataSource.LOCAL_DATABASE:
      return 'Local Database';
    case DataSource.REMOTE_DATABASE:
      return 'Remote Database';
    default:
      return 'Unknown';
  }
}

/**
 * Gets an icon to represent a data source
 */
export function getDataSourceIcon(source: DataSource): string {
  switch (source) {
    case DataSource.STATIC_JSON:
      return '📄'; // File icon
    case DataSource.LOCAL_DATABASE:
      return '💾'; // Floppy disk icon
    case DataSource.REMOTE_DATABASE:
      return '🌐'; // Globe icon
    default:
      return '❓'; // Question mark
  }
}

/**
 * Gets a color to represent a data source (for UI elements)
 */
export function getDataSourceColor(source: DataSource): string {
  switch (source) {
    case DataSource.STATIC_JSON:
      return 'purple'; // JSON is purple
    case DataSource.LOCAL_DATABASE:
      return 'cyan'; // Local is cyan
    case DataSource.REMOTE_DATABASE:
      return 'green'; // Remote is green
    default:
      return 'gray';
  }
}

/**
 * Higher-order function that executes the appropriate data fetching strategy
 * based on the current data source for a content type
 * 
 * @param contentType Content type being fetched
 * @param staticJsonFn Function to execute for static JSON source
 * @param databaseFn Function to execute for database source (receives isLocal param)
 * @returns The result of the appropriate function
 */
export async function withDataSource<T>(
  contentType: ContentType,
  staticJsonFn: () => Promise<T>,
  databaseFn: (isLocal: boolean) => Promise<T>
): Promise<T> {
  const dataSource = getDataSource(contentType);
  
  try {
    switch (dataSource) {
      case DataSource.STATIC_JSON:
        return await staticJsonFn();
      
      case DataSource.LOCAL_DATABASE:
        return await databaseFn(true);
      
      case DataSource.REMOTE_DATABASE:
        return await databaseFn(false);
      
      default:
        console.error(`Unknown data source: ${dataSource}`);
        return await staticJsonFn(); // Fallback to static JSON
    }
  } catch (error) {
    console.error(`Error fetching from ${dataSource} for ${contentType}:`, error);
    
    // If we tried database and it failed, fall back to static JSON
    if (dataSource !== DataSource.STATIC_JSON) {
      console.warn(`Falling back to static JSON for ${contentType}`);
      return await staticJsonFn();
    }
    
    // If static JSON also fails, rethrow the error
    throw error;
  }
} 