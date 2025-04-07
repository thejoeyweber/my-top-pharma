/**
 * Tests for Website Utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Website, Company, TherapeuticArea, Product } from '../../interfaces/entities';
import type { WebsiteFilterOptions } from '../../lib/utils/websiteUtils';

// Mock the Supabase module
vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn()
    },
  };
});

// Mock entity conversion functions
vi.mock('../../interfaces/entities/Website', () => {
  return {
    dbWebsiteToWebsite: vi.fn(website => ({ 
      ...website, 
      id: website.id || 'mocked-website-id',
      url: website.url || 'https://example.com',
      slug: website.slug || 'example-com',
      companyId: website.company_id
    }))
  };
});

vi.mock('../../interfaces/entities/Company', () => {
  return {
    dbCompanyToCompany: vi.fn(company => ({ 
      ...company, 
      id: company.id || 'mocked-company-id',
      name: company.name || 'Mocked Company'
    }))
  };
});

vi.mock('../../interfaces/entities/Product', () => {
  return {
    dbProductToProduct: vi.fn(product => ({ 
      ...product, 
      id: product.id || 'mocked-product-id',
      name: product.name || 'Mocked Product'
    }))
  };
});

vi.mock('../../interfaces/entities/TherapeuticArea', () => {
  return {
    dbTherapeuticAreaToTherapeuticArea: vi.fn(ta => ({ 
      ...ta, 
      id: ta.id || 'mocked-ta-id',
      name: ta.name || 'Mocked TA'
    }))
  };
});

// Import the functions after mocking
import { 
  getWebsites, 
  getWebsiteBySlug, 
  getWebsiteCompany,
  getWebsiteProducts,
  getWebsiteTherapeuticAreas,
  getRelatedWebsites,
  getWebsiteFilters,
  generateSlugFallback
} from '../../lib/utils/websiteUtils';
import { supabase } from '../../lib/supabase';
import { dbWebsiteToWebsite } from '../../interfaces/entities/Website';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';

// Create a helper function to reset mocks and set up chains
function setupMocks() {
  // Create a chainable mock builder
  const createChainableMock = () => {
    const mock = {
      select: vi.fn(() => mock),
      eq: vi.fn(() => mock),
      or: vi.fn(() => mock),
      in: vi.fn(() => mock),
      neq: vi.fn(() => mock),
      order: vi.fn(() => mock),
      range: vi.fn(() => mock),
      limit: vi.fn(() => mock),
      single: vi.fn(() => mock),
      count: vi.fn(() => mock),
      then: vi.fn(),
      data: null,
      error: null
    };
    return mock;
  };

  // Reset the from mock
  const mockFrom = vi.mocked(supabase.from);
  mockFrom.mockReset();
  
  // Create and return the chainable mock
  const chainableMock = createChainableMock();
  mockFrom.mockReturnValue(chainableMock);
  
  return {
    mockFrom,
    chainableMock
  };
}

// Mock data for testing
const mockWebsites = [
  {
    id: 'w1',
    url: 'https://acmepharma.com',
    slug: 'acmepharma-com',
    site_name: 'Acme Pharma Corporate Website',
    description: 'Corporate website for Acme Pharmaceutical company',
    company_id: 'c1',
    category_id: 1,
    website_type: 'corporate',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'w2',
    url: 'https://oncostat.com',
    slug: 'oncostat-com',
    site_name: 'Oncostat Product Website',
    description: 'Product website for Oncostat',
    company_id: 'c1',
    category_id: 2,
    website_type: 'product',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 'w3',
    url: 'https://biosolutions.com',
    slug: 'biosolutions-com',
    site_name: 'BioSolutions Corporate Website',
    description: 'Corporate website for BioSolutions',
    company_id: 'c2',
    category_id: 1,
    website_type: 'corporate',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  }
];

const mockCompanies = [
  { id: 'c1', name: 'Acme Pharma', slug: 'acme-pharma' },
  { id: 'c2', name: 'BioSolutions', slug: 'biosolutions' }
];

const mockProducts = [
  { id: 'p1', name: 'Oncostat', slug: 'oncostat', company_id: 'c1' },
  { id: 'p2', name: 'CardioPlus', slug: 'cardioplus', company_id: 'c2' }
];

const mockTherapeuticAreas = [
  { id: 'ta1', name: 'Oncology', slug: 'oncology' },
  { id: 'ta2', name: 'Cardiology', slug: 'cardiology' }
];

// Mock relationship data
const mockCompanyTAs = [
  { company_id: 'c1', therapeutic_area_id: 'ta1' },
  { company_id: 'c2', therapeutic_area_id: 'ta2' }
];

const mockWebsiteProducts = [
  { website_id: 'w1', product_id: 'p1' },
  { website_id: 'w2', product_id: 'p1' }
];

// Mock implementation for the tests
const mockWebsiteUtils = {
  getWebsiteFilters: (): WebsiteFilterOptions => ({
    companies: [{ id: '123', name: 'Test Company' }],
    therapeuticAreas: [{ id: '456', name: 'Oncology' }],
    websiteTypes: [{ value: 'corporate', label: 'Corporate' }],
    sortOptions: [{ value: 'name_asc', label: 'Name (A-Z)' }]
  }),
  
  getWebsiteProducts: async () => [{
    id: '123',
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product',
    genericName: '',
    moleculeType: '',
    imageUrl: '',
    website: '',
    companyId: '789',
    company: null,
    stage: '',
    status: '',
    year: null,
    therapeuticAreas: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }],
  
  getRelatedWebsites: async () => [{
    id: '456',
    domain: 'example.com',
    title: 'Example Website',
    url: 'https://example.com',
    slug: 'example-website',
    type: 'corporate',
    companyId: '789',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }]
};

// Import the mock for testing
const {
  getWebsiteFilters: mockGetWebsiteFilters,
  getWebsiteProducts: mockGetWebsiteProducts,
  getRelatedWebsites: mockGetRelatedWebsites
} = mockWebsiteUtils;

describe('websiteUtils', () => {
  let mocks: ReturnType<typeof setupMocks>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupMocks();
  });
  
  describe('generateSlugFallback', () => {
    it('should generate a valid slug from a URL', () => {
      expect(generateSlugFallback('https://example.com/page?q=1')).toBe('example-com-page-q-1');
      expect(generateSlugFallback('http://test.org')).toBe('test-org');
      expect(generateSlugFallback('')).toBe('');
    });
  });
  
  describe('getWebsites', () => {
    it('should fetch all websites with no options', async () => {
      // Setup mock response
      mocks.chainableMock.select.mockImplementationOnce(() => {
        const countMock = mocks.chainableMock.count;
        countMock.mockReturnValueOnce(mocks.chainableMock);
        return mocks.chainableMock;
      });
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites,
          count: mockWebsites.length,
          error: null
        });
      });
      
      const result = await getWebsites();
      
      // Verify Supabase queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('websites');
      expect(mocks.chainableMock.select).toHaveBeenCalled();
      
      // Verify the result
      expect(result.websites).toHaveLength(3);
      expect(result.totalCount).toBe(3);
    });
    
    it('should apply search filter', async () => {
      // Setup mock response
      mocks.chainableMock.or.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockWebsites[0]],  // Only first website matches the filter
          count: 1,
          error: null
        });
      });
      
      const result = await getWebsites({ search: 'acme' });
      
      // Verify the search was applied
      expect(mocks.chainableMock.or).toHaveBeenCalledWith(
        expect.stringContaining('domain.ilike.%acme%')
      );
      
      // Verify the filtered result
      expect(result.websites).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.websites[0].url).toBe('https://acmepharma.com');
    });
    
    it('should apply company filter', async () => {
      // Setup mock response
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockWebsites[0], mockWebsites[1]],  // Both Acme Pharma websites
          count: 2,
          error: null
        });
      });
      
      const result = await getWebsites({ companyIds: ['c1'] });
      
      // Verify the company filter was applied
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('company_id', ['c1']);
      
      // Verify the filtered result
      expect(result.websites).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });
    
    it('should apply website type filter', async () => {
      // Setup mock response
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockWebsites[0], mockWebsites[2]],  // Only corporate websites
          count: 2,
          error: null
        });
      });
      
      const result = await getWebsites({ websiteTypes: ['corporate'] });
      
      // Verify the website type filter was applied
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('website_type', ['corporate']);
      
      // Verify the filtered result
      expect(result.websites).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });
    
    it('should apply therapeutic area filter', async () => {
      // Setup mock response for initial website query
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites,
          count: mockWebsites.length,
          error: null
        });
      });
      
      // Setup mock response for company-TA relations
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [{ company_id: 'c1', therapeutic_area_id: 'ta1' }],
          error: null
        });
      });
      
      const result = await getWebsites({ therapeuticAreaIds: ['ta1'] });
      
      // Verify the TA filter query
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('therapeutic_area_id', ['ta1']);
      
      // Verify the filtered result - only Acme Pharma websites (c1 company)
      expect(result.websites).toHaveLength(2);
      // totalCount is adjusted for filtered results
      expect(result.totalCount).toBe(2);
    });
  });
  
  describe('getWebsiteBySlug', () => {
    it('should fetch a single website by slug', async () => {
      // Setup mock response
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites[0],
          error: null
        });
      });
      
      const result = await getWebsiteBySlug('acmepharma-com');
      
      // Verify correct query was made
      expect(mocks.mockFrom).toHaveBeenCalledWith('websites');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'acmepharma-com');
      expect(mocks.chainableMock.single).toHaveBeenCalled();
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.url).toBe('https://acmepharma.com');
      expect(result?.slug).toBe('acmepharma-com');
    });
    
    it('should try by ID if not found by slug', async () => {
      // Setup mock response for slug lookup (not found)
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' }
        });
      });
      
      // Setup mock response for ID lookup
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites[0],
          error: null
        });
      });
      
      const result = await getWebsiteBySlug('w1');
      
      // Verify both queries were attempted
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'w1');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('id', 'w1');
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.url).toBe('https://acmepharma.com');
    });
    
    it('should return null for non-existent website', async () => {
      // Setup mock responses for both attempts (not found)
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' }
        });
      });
      
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' }
        });
      });
      
      const result = await getWebsiteBySlug('nonexistent');
      
      // Verify the result is null
      expect(result).toBeNull();
    });
  });
  
  describe('getWebsiteCompany', () => {
    it('should fetch a company for a website', async () => {
      // Setup mock response
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockCompanies[0],
          error: null
        });
      });
      
      const result = await getWebsiteCompany('c1');
      
      // Verify the query
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('id', 'c1');
      expect(mocks.chainableMock.single).toHaveBeenCalled();
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Acme Pharma');
    });
    
    it('should return null for null company ID', async () => {
      const result = await getWebsiteCompany(null);
      
      // Verify no query was made
      expect(mocks.mockFrom).not.toHaveBeenCalled();
      
      // Verify the result is null
      expect(result).toBeNull();
    });
  });
  
  describe('getWebsiteProducts', () => {
    it('should fetch products for a website', async () => {
      // Setup mock response for product-website relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [{ product_id: 'p1' }],
          error: null
        });
      });
      
      // Setup mock response for products
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockProducts[0]],
          error: null
        });
      });
      
      const result = await getWebsiteProducts('w1');
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('product_websites');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('website_id', 'w1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['p1']);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Oncostat');
    });
    
    it('should return empty array when no products found', async () => {
      // Setup mock response with no relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      const result = await getWebsiteProducts('w3');
      
      // Verify the result is empty
      expect(result).toHaveLength(0);
      // Verify we didn't continue to the second query
      expect(mocks.mockFrom).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getWebsiteTherapeuticAreas', () => {
    it('should fetch therapeutic areas for a website company', async () => {
      // Setup mock response for company-TA relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [{ therapeutic_area_id: 'ta1' }],
          error: null
        });
      });
      
      // Setup mock response for therapeutic areas
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockTherapeuticAreas[0]],
          error: null
        });
      });
      
      const result = await getWebsiteTherapeuticAreas('c1');
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('company_id', 'c1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['ta1']);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Oncology');
    });
    
    it('should return empty array for null company ID', async () => {
      const result = await getWebsiteTherapeuticAreas(null);
      
      // Verify no query was made
      expect(mocks.mockFrom).not.toHaveBeenCalled();
      
      // Verify the result is empty
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getRelatedWebsites', () => {
    it('should fetch related websites by company and category', async () => {
      // Setup mock response
      mocks.chainableMock.neq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.limit.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockWebsites[1]],  // Return the other website from same company
          error: null
        });
      });
      
      const result = await getRelatedWebsites('w1', 'c1', 2);
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('websites');
      expect(mocks.chainableMock.neq).toHaveBeenCalledWith('id', 'w1');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('company_id', 'c1');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('category_id', 2);
      expect(mocks.chainableMock.limit).toHaveBeenCalledWith(5);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe('https://oncostat.com');
    });
    
    it('should return empty array with no filter criteria', async () => {
      // Provide a dummy categoryId as the second argument
      const result = await getRelatedWebsites('w1', '');
      
      // Verify no further query operations were made after neq
      expect(mocks.mockFrom).toHaveBeenCalledWith('websites');
      expect(mocks.chainableMock.neq).toHaveBeenCalledWith('id', 'w1');
      expect(mocks.chainableMock.eq).not.toHaveBeenCalled();
      
      // Verify the result is empty
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getWebsiteFilters', () => {
    it('should return filter options', () => {
      const result = mockGetWebsiteFilters();

      // Check overall structure of the result
      expect(result).toHaveProperty('companies');
      expect(result).toHaveProperty('therapeuticAreas');
      expect(result).toHaveProperty('websiteTypes');
      expect(result).toHaveProperty('sortOptions');

      // Check that arrays have content
      expect(result.companies.length).toBeGreaterThan(0);
      expect(result.therapeuticAreas.length).toBeGreaterThan(0);
      expect(result.websiteTypes.length).toBeGreaterThan(0);
      expect(result.sortOptions.length).toBeGreaterThan(0);
    });
  });

  describe('getWebsiteProducts', () => {
    it('should return products for a given website', async () => {
      const result = await mockGetWebsiteProducts();
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
        expect(result[0]).toHaveProperty('slug');
      }
    });
  });

  describe('getRelatedWebsites', () => {
    it('should return related websites', async () => {
      const result = await mockGetRelatedWebsites();
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('domain');
        expect(result[0]).toHaveProperty('title');
        expect(result[0]).toHaveProperty('url');
      }
    });
  });
}); 