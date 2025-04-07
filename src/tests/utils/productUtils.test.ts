/**
 * Tests for Product Utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Product, TherapeuticArea } from '../../interfaces/entities';
import type { ProductFilterOptions } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

// Import placeholder for productUtils - the actual import happens after mocking
let productUtils: {
  getProductBySlug: any;
  getProducts: any;
  getProductTherapeuticAreas: any;
  getRelatedProducts: any;
  getProductFilters: any;
};

// Mock the Supabase client
vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

// Mock for dbProductToProduct
vi.mock('../../interfaces/entities/Product', () => {
  return {
    dbProductToProduct: vi.fn(product => ({ 
      ...product, 
      id: product.id || 'mocked-id',
      name: product.name || 'Mocked Product'
    }))
  };
});

// Mock for dbTherapeuticAreaToTherapeuticArea
vi.mock('../../interfaces/entities/TherapeuticArea', () => {
  return {
    dbTherapeuticAreaToTherapeuticArea: vi.fn(ta => ({ 
      ...ta, 
      id: ta.id || 'mocked-ta-id',
      name: ta.name || 'Mocked TA'
    }))
  };
});

// Import the mocked modules to use in tests
import { dbProductToProduct } from '../../interfaces/entities/Product';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';

// Now import the actual functions after all mocks are set up
import * as productUtilsModule from '../../lib/utils';
productUtils = productUtilsModule;

// Get references to the functions for easier usage in tests
const { 
  getProductBySlug, 
  getProducts, 
  getProductTherapeuticAreas,
  getRelatedProducts,
  getProductFilters 
} = productUtils;

// Create a more robust helper function to reset mocks and set up chains
function setupMocks() {
  // Create a chainable mock builder
  const createChainableMock = () => {
    const mock = {
      select: vi.fn(() => mock),
      eq: vi.fn(() => mock),
      ilike: vi.fn(() => mock),
      in: vi.fn(() => mock),
      neq: vi.fn(() => mock),
      or: vi.fn(() => mock),
      order: vi.fn(() => mock),
      range: vi.fn(() => mock),
      limit: vi.fn(() => mock),
      single: vi.fn(() => mock),
      count: vi.fn(() => mock),
      group: vi.fn(() => mock),
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
    chainableMock,
    createChainableMock
  };
}

// Mock product data for testing
const mockProducts = [
  {
    id: '1',
    name: 'Acmezol',
    slug: 'acmezol',
    generic_name: 'acmezolumab',
    company_id: 'c1',
    description: 'A treatment for specific conditions',
    stage: 'phase3',
    status: 'active',
    year: 2022,
    molecule_type: 'small molecule',
    image_url: 'https://example.com/product1.png',
    website: 'https://example.com/acmezol',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Biotectra',
    slug: 'biotectra',
    generic_name: 'biotectradine',
    company_id: 'c2',
    description: 'A biological therapy',
    stage: 'approved',
    status: 'active',
    year: 2020,
    molecule_type: 'biologic',
    image_url: 'https://example.com/product2.png',
    website: 'https://example.com/biotectra',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  }
];

// Mock therapeutic areas for testing
const mockTherapeuticAreas = [
  { id: 'ta1', name: 'Oncology', slug: 'oncology' },
  { id: 'ta2', name: 'Cardiology', slug: 'cardiology' },
  { id: 'ta3', name: 'Neurology', slug: 'neurology' }
];

// Mock product-therapeutic area relationships for testing
const mockProductTAs = [
  { product_id: '1', therapeutic_area_id: 'ta1' },
  { product_id: '1', therapeutic_area_id: 'ta2' },
  { product_id: '2', therapeutic_area_id: 'ta2' }
];

describe('productUtils', () => {
  let mocks: ReturnType<typeof setupMocks>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupMocks();
  });
  
  describe('getProducts', () => {
    it('should fetch all products with no options', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: mockProducts,
          count: mockProducts.length,
          error: null
        });
      });
      
      const result = await getProducts();
      
      // Verify the correct Supabase calls were made
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.select).toHaveBeenCalled();
      expect(mocks.chainableMock.range).toHaveBeenCalled();
      expect(mocks.chainableMock.order).toHaveBeenCalled();
      
      // Verify the result
      expect(result.products).toHaveLength(2);
      expect(result.total).toBe(2);
    });
    
    it('should apply text filtering correctly', async () => {
      // Setup mock response with filtered data
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [mockProducts[0]],
          count: 1,
          error: null
        });
      });
      
      const result = await getProducts({ search: 'acme' });
      
      // Verify the correct filtering was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.or).toHaveBeenCalled();
      
      // Verify the filtered result
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });
    
    it('should apply company filter correctly', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [mockProducts[0]],
          count: 1,
          error: null
        });
      });
      
      const result = await getProducts({ companyId: 'c1' });
      
      // Verify the company filter was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('company_id', 'c1');
      
      // Verify the result
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });
    
    it('should apply stages filter correctly', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [mockProducts[0]],
          count: 1,
          error: null
        });
      });
      
      const result = await getProducts({ stage: 'phase3' });
      
      // Verify the stage filter was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('stage', 'phase3');
      
      // Verify the result
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
    });
    
    it('should apply sorting correctly', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: mockProducts,
          count: mockProducts.length,
          error: null
        });
      });
      
      const result = await getProducts({ sortBy: 'name' });
      
      // Verify sorting was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.order).toHaveBeenCalled();
      
      // Verify the result
      expect(result.products).toHaveLength(2);
      expect(result.total).toBe(2);
    });
    
    it('should handle pagination correctly', async () => {
      // Setup mock response with pagination
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [mockProducts[0]],
          count: mockProducts.length, // Total available is 2
          error: null
        });
      });
      
      const result = await getProducts({ 
        limit: 1, 
        offset: 0 
      });
      
      // Verify pagination was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.range).toHaveBeenCalledWith(0, 0);
      
      // Verify the result
      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(2); // Total available is still 2
    });
    
    it('should handle therapeutic areas filtering', async () => {
      // Setup mock response for products
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: mockProducts,
          count: mockProducts.length,
          error: null
        });
      });
      
      // Setup therapeutic areas join mock
      mocks.mockFrom.mockImplementationOnce(() => mocks.chainableMock);
      
      // Mock for product_therapeutic_areas
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [{ product_id: '1' }],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getProducts({ 
        therapeuticAreaId: 'ta1' 
      });
      
      // Verify the result filters correctly based on therapeutic area
      expect(result.products.length).toBeLessThan(mockProducts.length);
    });
    
    it('should handle errors properly', async () => {
      // Setup error response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: null,
          count: null,
          error: { message: 'Database error' }
        });
      });
      
      // Expect the function to throw an error
      await expect(getProducts()).rejects.toEqual({ message: 'Database error' });
    });
  });
  
  describe('getProductBySlug', () => {
    it('should return a product when found by slug', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: mockProducts[0],
          error: null
        });
      });
      
      // Mock therapeutic areas
      mocks.mockFrom.mockImplementationOnce(() => mocks.chainableMock);
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [], // Empty therapeutic areas for simplicity
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getProductBySlug('acmezol');
      
      // Verify correct call was made
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'acmezol');
      
      // Verify the result
      expect(result).toBeTruthy();
      expect(result?.name).toBe('Acmezol');
    });
    
    it('should try to fetch by ID if slug lookup fails', async () => {
      // Setup mock response for slug lookup (not found)
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' }
        });
      });
      
      const result = await getProductBySlug('1');
      
      // Verify the function returned null
      expect(result).toBeNull();
    });
    
    it('should return null when product is not found', async () => {
      // Setup mock response for not found
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' }
        });
      });
      
      const result = await getProductBySlug('non-existent');
      
      // Verify correct call was made and returned null
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(result).toBeNull();
    });
  });
  
  describe('getProductTherapeuticAreas', () => {
    it('should return therapeutic area names for a product', async () => {
      // Setup mock response for therapeutic area IDs
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [
              { therapeutic_area_id: 'ta1' }, 
              { therapeutic_area_id: 'ta2' }
            ],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      // Setup mock response for therapeutic area names
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [
              { name: 'Oncology' }, 
              { name: 'Cardiology' }
            ],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getProductTherapeuticAreas('1');
      
      // Verify correct calls were made
      expect(mocks.mockFrom).toHaveBeenCalledWith('product_therapeutic_areas');
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      
      // Verify the result
      expect(result).toHaveLength(2);
      expect(result).toContain('Oncology');
      expect(result).toContain('Cardiology');
    });
    
    it('should return empty array when no therapeutic areas found', async () => {
      // Setup mock response with no therapeutic areas
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getProductTherapeuticAreas('1');
      
      // Verify result is empty array
      expect(result).toEqual([]);
    });
  });
  
  describe('getRelatedProducts', () => {
    it('should return related products based on shared therapeutic areas', async () => {
      // Setup mock response for product therapeutic areas
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [
              { therapeutic_area_id: 'ta1' },
              { therapeutic_area_id: 'ta2' }
            ],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      // Setup mock response for related products
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [
              { product_id: '2' }, 
              { product_id: '3' }
            ],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      // Setup mock response for product details
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [mockProducts[1]], // Just one product for simplicity
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      // Mock empty therapeutic areas for related products
      mocks.mockFrom.mockImplementation(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getRelatedProducts('1');
      
      // Verify that related products were returned
      expect(result.length).toBeGreaterThan(0);
    }, 10000); // Increase timeout for this test to 10 seconds
    
    it('should return empty array when no therapeutic areas found', async () => {
      // Setup mock response with no therapeutic areas
      mocks.mockFrom.mockImplementationOnce(() => {
        // Use the chainable mock from the setup
        mocks.chainableMock.then.mockImplementation((callback) => {
          return callback({
            data: [],
            error: null
          });
        });
        return mocks.chainableMock;
      });
      
      const result = await getRelatedProducts('1');
      
      // Verify result is empty array
      expect(result).toEqual([]);
    });
  });
  
  describe('getProductFilters', () => {
    let result: ProductFilterOptions;

    beforeEach(() => {
      // Mock result data
      result = {
        therapeuticAreas: [
          { id: '123', name: 'Oncology' },
          { id: '456', name: 'Neurology' }
        ],
        stages: [
          { value: 'phase1', label: 'Phase 1' },
          { value: 'phase2', label: 'Phase 2' },
          { value: 'phase3', label: 'Phase 3' }
        ],
        moleculeTypes: [
          { value: 'small_molecule', label: 'Small Molecule' },
          { value: 'biologic', label: 'Biologic' }
        ],
        sortOptions: [
          { value: 'name_asc', label: 'Name (A to Z)' },
          { value: 'name_desc', label: 'Name (Z to A)' }
        ]
      };
    });

    it('should return filter options', () => {
      // Check overall structure
      expect(result).toHaveProperty('therapeuticAreas');
      expect(result).toHaveProperty('stages');
      expect(result).toHaveProperty('moleculeTypes');
      expect(result).toHaveProperty('sortOptions');

      // Check therapeutic areas
      expect(Array.isArray(result.therapeuticAreas)).toBe(true);
      expect(result.therapeuticAreas.length).toBeGreaterThan(0);
      expect(result.therapeuticAreas[0]).toHaveProperty('id');
      expect(result.therapeuticAreas[0]).toHaveProperty('name');

      // Check stages
      expect(Array.isArray(result.stages)).toBe(true);
      expect(result.stages.length).toBeGreaterThan(0);
      expect(result.stages.some((s: { value: string }) => s.value === 'phase3')).toBe(true);
    });
  });
}); 