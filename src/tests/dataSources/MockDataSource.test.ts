/**
 * MockDataSource.test.ts
 * 
 * Tests for the MockDataSource implementation.
 */

import { MockDataSource } from '../../dataSources/MockDataSource';
import type { QueryOptions } from '../../interfaces/DataSource';

describe('MockDataSource', () => {
  let dataSource: MockDataSource;

  beforeEach(() => {
    dataSource = new MockDataSource();
  });

  describe('healthCheck', () => {
    it('should always return true', async () => {
      const result = await dataSource.healthCheck();
      expect(result).toBe(true);
    });
  });

  describe('getCompanies', () => {
    it('should return all companies when no options are provided', async () => {
      const result = await dataSource.getCompanies();
      expect(result.data.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('should filter companies by name', async () => {
      const options: QueryOptions = {
        filters: { name: 'Pfizer' }
      };
      const result = await dataSource.getCompanies(options);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Pfizer');
    });

    it('should sort companies by name', async () => {
      const options: QueryOptions = {
        sort: { field: 'name', direction: 'asc' }
      };
      const result = await dataSource.getCompanies(options);
      expect(result.data[0].name).toBe('Novartis');
      expect(result.data[1].name).toBe('Pfizer');
    });

    it('should paginate companies', async () => {
      const options: QueryOptions = {
        pagination: { page: 1, limit: 1 }
      };
      const result = await dataSource.getCompanies(options);
      expect(result.data.length).toBe(1);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.pages).toBe(2);
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by ID', async () => {
      const result = await dataSource.getCompanyById('pfizer');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Pfizer');
    });

    it('should return null for non-existent company ID', async () => {
      const result = await dataSource.getCompanyById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getTherapeuticAreas', () => {
    it('should return all therapeutic areas when no options are provided', async () => {
      const result = await dataSource.getTherapeuticAreas();
      expect(result.data.length).toBe(3);
    });
  });

  describe('getTherapeuticAreasForCompany', () => {
    it('should return therapeutic areas for a specific company', async () => {
      const result = await dataSource.getTherapeuticAreasForCompany('pfizer');
      expect(result.data.length).toBe(2);
      expect(result.data.some(ta => ta.id === 'oncology')).toBe(true);
      expect(result.data.some(ta => ta.id === 'immunology')).toBe(true);
    });
  });

  describe('getProducts', () => {
    it('should return all products when no options are provided', async () => {
      const result = await dataSource.getProducts();
      expect(result.data.length).toBe(1);
    });
  });

  describe('getProductsForCompany', () => {
    it('should return products for a specific company', async () => {
      const result = await dataSource.getProductsForCompany('pfizer');
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Comirnaty');
    });

    it('should return empty array for company with no products', async () => {
      const result = await dataSource.getProductsForCompany('nonexistent');
      expect(result.data.length).toBe(0);
    });
  });

  describe('getWebsites', () => {
    it('should return all websites when no options are provided', async () => {
      const result = await dataSource.getWebsites();
      expect(result.data.length).toBe(1);
    });
  });

  describe('getWebsitesForCompany', () => {
    it('should return websites for a specific company', async () => {
      const result = await dataSource.getWebsitesForCompany('pfizer');
      expect(result.data.length).toBe(1);
      expect(result.data[0].domain).toBe('pfizer.com');
    });
  });
}); 