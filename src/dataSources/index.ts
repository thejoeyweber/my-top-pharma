/**
 * Data Sources Index
 * 
 * Exports the data source factory and provides utility functions
 * for accessing data sources throughout the application.
 */

import type { DataSource } from '../interfaces/DataSource';
import { DataSourceFactory, type DataSourceType } from './DataSourceFactory';

/**
 * Get the currently active data source
 * @returns The active data source instance
 */
export function getDataSource(): DataSource {
  return DataSourceFactory.getInstance().getDataSource();
}

/**
 * Get a specific data source by type
 * @param type The type of data source to get
 * @returns The requested data source instance
 */
export function getDataSourceByType(type: DataSourceType): DataSource {
  return DataSourceFactory.getInstance().getDataSourceByType(type);
}

/**
 * Set the active data source
 * @param type The type of data source to set as active
 */
export function setActiveDataSource(type: DataSourceType): void {
  DataSourceFactory.getInstance().setActiveDataSource(type);
}

/**
 * Get the type of the currently active data source
 * @returns The active data source type
 */
export function getActiveDataSourceType(): DataSourceType {
  return DataSourceFactory.getInstance().getActiveDataSourceType();
}

/**
 * Get all available data source types
 * @returns Array of available data source types
 */
export function getAvailableDataSourceTypes(): DataSourceType[] {
  return DataSourceFactory.getInstance().getAvailableDataSourceTypes();
}

// Export data source classes
export { DataSourceFactory } from './DataSourceFactory';
export { MockDataSource } from './MockDataSource';
export { SupabaseDataSource } from './SupabaseDataSource'; 