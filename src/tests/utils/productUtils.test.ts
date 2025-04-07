/**
 * Tests for Product Utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Product, TherapeuticArea } from '../../interfaces/entities';
import { 
  getProductBySlug,
  getProducts, 
  getProductTherapeuticAreas,
  getRelatedProducts,
  getProductFilters
} from '../../lib/utils/productUtils';
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
import * as productUtilsModule from '../../lib/utils/productUtils';
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
    chainableMock
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
      expect(mocks.chainableMock.select).toHaveBeenCalledWith('*', expect.any(Object));
      expect(mocks.chainableMock.range).toHaveBeenCalled();
      expect(mocks.chainableMock.order).toHaveBeenCalled();
      
      // Verify the result
      expect(result.products).toHaveLength(2);
      expect(result.totalCount).toBe(2);
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
      expect(result.totalCount).toBe(1);
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
      expect(result.totalCount).toBe(1);
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
      expect(result.totalCount).toBe(1);
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
      
      const result = await getProducts(); // Default sorting is by name
      
      // Verify sorting was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.order).toHaveBeenCalledWith('name');
      
      // Verify the result
      expect(result.products).toHaveLength(2);
    });
    
    it('should handle pagination correctly', async () => {
      // Setup mock response
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [mockProducts[0]],
          count: mockProducts.length,
          error: null
        });
      });
      
      const result = await getProducts({ limit: 1, offset: 0 });
      
      // Verify pagination was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.range).toHaveBeenCalledWith(0, 0);
      
      // Verify the result
      expect(result.products).toHaveLength(1);
      expect(result.totalCount).toBe(2); // Total available is still 2
    });
    
    it('should handle therapeutic areas filtering', async () => {
      // Setup first mock response for the main query
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: mockProducts,
          count: mockProducts.length,
          error: null
        });
      });
      
      // Setup the mock for the second query - product_therapeutic_areas
      // Need to intercept the next call to from() and return a new mock
      mocks.mockFrom.mockImplementationOnce(() => {
        return mocks.chainableMock; // Same mock instance
      }).mockImplementationOnce(() => {
        const secondMock = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [{ product_id: mockProducts[0].id }],
              error: null
            });
          })
        };
        return secondMock as any;
      });
      
      const result = await getProducts({ therapeuticAreaId: 'ta1' });
      
      // Since our main mock returns all products, and second mock returns product_id '1',
      // filtering should result in only product with ID '1' remaining
      expect(result.products.length).toBe(1);
      expect(result.products[0].id).toBe('1');
    });
    
    it('should handle errors properly', async () => {
      // Setup mock to return an error
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: null,
          count: null,
          error: { message: 'Database error' }
        });
      });
      
      const result = await getProducts();
      
      // Verify the error was handled gracefully
      expect(result.products).toHaveLength(0);
      expect(result.totalCount).toBe(0);
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
      
      const result = await getProductBySlug('acmezol');
      
      // Verify correct query was made
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.select).toHaveBeenCalledWith('*');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'acmezol');
      expect(mocks.chainableMock.single).toHaveBeenCalled();
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Acmezol');
    });
    
    it('should try to fetch by ID if slug lookup fails', async () => {
      // First call returns error, second call returns product
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: null,
          error: { message: 'Not found' }
        });
      }).mockImplementationOnce((callback) => {
        return callback({
          data: mockProducts[0],
          error: null
        });
      });
      
      const result = await getProductBySlug('1');
      
      // Verify both queries were attempted
      expect(mocks.mockFrom).toHaveBeenCalledTimes(2);
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', '1');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('id', '1');
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Acmezol');
    });
    
    it('should return null when product is not found', async () => {
      // Setup both queries to fail
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: null,
          error: { message: 'Not found' }
        });
      });
      
      const result = await getProductBySlug('non-existent');
      
      // Verify the result
      expect(result).toBeNull();
    });
  });
  
  describe('getProductTherapeuticAreas', () => {
    it('should return therapeutic area names for a product', async () => {
      // Setup mocks for sequential calls
      mocks.mockFrom.mockImplementationOnce(() => {
        // First call to product_therapeutic_areas
        const firstMock = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { therapeutic_area_id: 'ta1' },
                { therapeutic_area_id: 'ta2' }
              ],
              error: null
            });
          })
        };
        return firstMock as any;
      }).mockImplementationOnce(() => {
        // Second call to therapeutic_areas
        const secondMock = {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { name: 'Oncology' },
                { name: 'Cardiology' }
              ],
              error: null
            });
          })
        };
        return secondMock as any;
      });
      
      const result = await getProductTherapeuticAreas('1');
      
      // Verify the result
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('Oncology');
      expect(result).toContain('Cardiology');
    });
    
    it('should return empty array when no therapeutic areas found', async () => {
      // Mock for empty result
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      const result = await getProductTherapeuticAreas('3');
      
      // Verify the result
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getRelatedProducts', () => {
    it('should return related products based on shared therapeutic areas', async () => {
      // Setup mocks for sequential calls
      mocks.mockFrom.mockImplementationOnce(() => {
        // First call to product_therapeutic_areas for the product
        const firstMock = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { therapeutic_area_id: 'ta1' },
                { therapeutic_area_id: 'ta2' }
              ],
              error: null
            });
          })
        };
        return firstMock as any;
      }).mockImplementationOnce(() => {
        // Second call to product_therapeutic_areas for related products
        const secondMock = {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { product_id: '2' }
              ],
              error: null
            });
          })
        };
        return secondMock as any;
      }).mockImplementationOnce(() => {
        // Third call to products to get details
        const thirdMock = {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [mockProducts[1]],
              error: null
            });
          })
        };
        return thirdMock as any;
      });
      
      const result = await getRelatedProducts('1');
      
      // Verify the result
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Biotectra');
    });
    
    it('should return empty array when no therapeutic areas found', async () => {
      // Mock for empty result
      mocks.chainableMock.then.mockImplementation((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      const result = await getRelatedProducts('3');
      
      // Verify the result
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getProductFilters', () => {
    it('should return filter options for therapeutic areas, stages, and molecule types', async () => {
      // Setup mocks for sequential calls to make test more predictable
      mocks.mockFrom.mockImplementationOnce(() => {
        // First call for therapeutic_areas
        const firstMock = {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: mockTherapeuticAreas,
              error: null
            });
          })
        };
        return firstMock as any;
      }).mockImplementationOnce(() => {
        // Second call for stages
        const secondMock = {
          select: vi.fn().mockReturnThis(),
          group: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { count: 2, stage: 'phase3' },
                { count: 3, stage: 'approved' },
                { count: 1, stage: 'market' }
              ],
              error: null
            });
          })
        };
        return secondMock as any;
      }).mockImplementationOnce(() => {
        // Third call for molecule types
        const thirdMock = {
          select: vi.fn().mockReturnThis(),
          group: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { count: 5, molecule_type: 'small molecule' },
                { count: 3, molecule_type: 'biologic' }
              ],
              error: null
            });
          })
        };
        return thirdMock as any;
      }).mockImplementationOnce(() => {
        // Fourth call for TA counts
        const fourthMock = {
          select: vi.fn().mockReturnThis(),
          group: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            return callback({
              data: [
                { therapeutic_area_id: 'ta1', count: 3 },
                { therapeutic_area_id: 'ta2', count: 5 },
                { therapeutic_area_id: 'ta3', count: 2 }
              ],
              error: null
            });
          })
        };
        return fourthMock as any;
      });
      
      const result = await getProductFilters();
      
      // Verify the result structure
      expect(result).toHaveProperty('stages');
      expect(result).toHaveProperty('therapeuticAreas');
      expect(result).toHaveProperty('moleculeTypes');
      
      // Verify each part has data
      expect(Array.isArray(result.stages)).toBe(true);
      expect(Array.isArray(result.therapeuticAreas)).toBe(true);
      expect(Array.isArray(result.moleculeTypes)).toBe(true);
    });
  });
}); 