/**
 * DataSourceFactory.ts
 * 
 * Factory class for creating and managing data sources.
 * This provides a centralized way to access different data sources
 * and switch between them as needed.
 */

import type { DataSource } from '../interfaces/DataSource';
import { MockDataSource } from './MockDataSource';

/**
 * Available data source types
 */
export type DataSourceType = 'mock' | 'supabase';

/**
 * Factory class for creating and managing data sources
 */
export class DataSourceFactory {
  private static instance: DataSourceFactory;
  private dataSources: Map<DataSourceType, DataSource>;
  private activeDataSource: DataSourceType;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.dataSources = new Map();
    
    // Initialize with mock data source by default
    this.dataSources.set('mock', new MockDataSource());
    
    // Set default active data source
    this.activeDataSource = 'mock';
  }

  /**
   * Get the singleton instance of the factory
   */
  public static getInstance(): DataSourceFactory {
    if (!DataSourceFactory.instance) {
      DataSourceFactory.instance = new DataSourceFactory();
    }
    return DataSourceFactory.instance;
  }

  /**
   * Get the currently active data source
   */
  public getDataSource(): DataSource {
    const dataSource = this.dataSources.get(this.activeDataSource);
    if (!dataSource) {
      throw new Error(`Data source '${this.activeDataSource}' not found`);
    }
    return dataSource;
  }

  /**
   * Get a specific data source by type
   * @param type The type of data source to get
   */
  public getDataSourceByType(type: DataSourceType): DataSource {
    const dataSource = this.dataSources.get(type);
    if (!dataSource) {
      throw new Error(`Data source '${type}' not found`);
    }
    return dataSource;
  }

  /**
   * Set the active data source
   * @param type The type of data source to set as active
   */
  public setActiveDataSource(type: DataSourceType): void {
    if (!this.dataSources.has(type)) {
      throw new Error(`Cannot set active data source: '${type}' not found`);
    }
    this.activeDataSource = type;
  }

  /**
   * Register a new data source
   * @param type The type identifier for the data source
   * @param dataSource The data source instance to register
   */
  public registerDataSource(type: DataSourceType, dataSource: DataSource): void {
    this.dataSources.set(type, dataSource);
  }

  /**
   * Check if a data source type is registered
   * @param type The type of data source to check
   */
  public hasDataSource(type: DataSourceType): boolean {
    return this.dataSources.has(type);
  }

  /**
   * Get the type of the currently active data source
   */
  public getActiveDataSourceType(): DataSourceType {
    return this.activeDataSource;
  }

  /**
   * Get all registered data source types
   */
  public getAvailableDataSourceTypes(): DataSourceType[] {
    return Array.from(this.dataSources.keys());
  }
} 