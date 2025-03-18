/**
 * Tests for DataSourceFactory
 * 
 * This file contains tests for the DataSourceFactory class to ensure
 * it properly handles data source construction, registration, and management.
 */

import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { DataSourceFactory, type DataSourceResult } from '../DataSourceFactory';
import { MockDataSource } from '../MockDataSource';
import type { DataSource } from '../../interfaces/DataSource';

// Mock data source for testing
class TestDataSource implements DataSource {
  id: string;

  constructor(id = 'test') {
    this.id = id;
  }
  
  async healthCheck() {
    return { status: 'healthy', message: 'Test data source is healthy' };
  }
  
  async getCompanyById() {
    return null;
  }
  
  async getCompanies() {
    return { items: [], total: 0 };
  }
  
  async getCompanyCount() {
    return 0;
  }
  
  async getProductById() {
    return null;
  }
  
  async getProducts() {
    return { items: [], total: 0 };
  }

  async getTherapeuticAreaById() {
    return null;
  }

  async getTherapeuticAreas() {
    return { items: [], total: 0 };
  }

  async getWebsiteById() {
    return null;
  }

  async getWebsites() {
    return { items: [], total: 0 };
  }

  async getCompaniesByTherapeuticArea() {
    return { items: [], total: 0 };
  }
}

describe('DataSourceFactory', () => {
  let factory: DataSourceFactory;
  
  beforeEach(() => {
    // Reset the singleton for each test
    // @ts-ignore - accessing private property for testing
    DataSourceFactory.instance = undefined;
    factory = DataSourceFactory.getInstance();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('should be a singleton', () => {
    const instance1 = DataSourceFactory.getInstance();
    const instance2 = DataSourceFactory.getInstance();
    
    expect(instance1).toBe(instance2);
  });
  
  test('should initialize with default mock data source', () => {
    const result = factory.getDataSource();
    
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(MockDataSource);
  });
  
  test('should register a new data source constructor', () => {
    // @ts-ignore - TestDataSource is compatible with DataSource
    const result = factory.registerDataSourceConstructor('test', TestDataSource);
    
    expect(result.success).toBe(true);
    expect(factory.hasDataSourceType('test')).toBe(true);
  });
  
  test('should create a new data source instance', () => {
    // @ts-ignore - TestDataSource is compatible with DataSource
    factory.registerDataSourceConstructor('test', TestDataSource);
    
    const result = factory.createDataSource('test', {}, 'test:instance1');
    
    expect(result.success).toBe(true);
    expect(result.data).toBe('test:instance1');
    expect(factory.hasDataSourceInstance('test:instance1')).toBe(true);
  });
  
  test('should generate instance ID if not provided', () => {
    // @ts-ignore - TestDataSource is compatible with DataSource
    factory.registerDataSourceConstructor('test', TestDataSource);
    
    const result = factory.createDataSource('test');
    
    expect(result.success).toBe(true);
    expect(result.data).toMatch(/^test:/);
  });
  
  test('should return error when creating from unregistered type', () => {
    const result = factory.createDataSource('unknown');
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('not registered');
  });
  
  test('should set and get active data source', () => {
    // @ts-ignore - TestDataSource is compatible with DataSource
    factory.registerDataSourceConstructor('test', TestDataSource);
    const createResult = factory.createDataSource('test', {}, 'test:active');
    expect(createResult.success).toBe(true);
    
    const setResult = factory.setActiveDataSource('test:active');
    expect(setResult.success).toBe(true);
    
    expect(factory.getActiveDataSourceId()).toBe('test:active');
    
    const getResult = factory.getDataSource();
    expect(getResult.success).toBe(true);
    expect(getResult.data).toBeDefined();
  });
  
  test('should return error when setting nonexistent data source as active', () => {
    const result = factory.setActiveDataSource('nonexistent');
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('not found');
  });
  
  test('should register a pre-initialized data source instance', () => {
    const dataSource = new TestDataSource('custom');
    const result = factory.registerDataSourceInstance('custom:instance', dataSource);
    
    expect(result.success).toBe(true);
    expect(factory.hasDataSourceInstance('custom:instance')).toBe(true);
    
    const getResult = factory.getDataSourceById('custom:instance');
    expect(getResult.success).toBe(true);
    expect(getResult.data).toBe(dataSource);
  });
  
  test('should return error when registering duplicate instance', () => {
    const dataSource = new TestDataSource();
    factory.registerDataSourceInstance('duplicate', dataSource);
    
    const result = factory.registerDataSourceInstance('duplicate', dataSource);
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('already exists');
  });
  
  test('should return error for missing Supabase configuration', () => {
    // @ts-ignore - We know this will be handled correctly
    factory.registerDataSourceConstructor('supabase', TestDataSource);
    
    const result = factory.createDataSource('supabase', {});
    
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Supabase URL and key are required');
  });
  
  test('should get all available data source types', () => {
    // Default has 'mock' and 'supabase'
    const types = factory.getAvailableDataSourceTypes();
    
    expect(types).toContain('mock');
    expect(types).toContain('supabase');
  });
  
  test('should get all data source instance IDs', () => {
    // Default has 'mock:default'
    const ids = factory.getDataSourceInstanceIds();
    
    expect(ids).toContain('mock:default');
  });
}); 