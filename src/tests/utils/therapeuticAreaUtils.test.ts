/**
 * Tests for Therapeutic Area Utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TherapeuticArea, Company, Product } from '../../interfaces/entities';

// Mock the Supabase module
vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn()
    },
  };
});

// Mock entity conversion functions
vi.mock('../../interfaces/entities/TherapeuticArea', () => {
  return {
    dbTherapeuticAreaToTherapeuticArea: vi.fn(ta => ({ 
      ...ta, 
      id: ta.id || 'mocked-ta-id',
      name: ta.name || 'Mocked TA'
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

// Import the functions after mocking
import { 
  getTherapeuticAreas, 
  getTherapeuticAreaBySlug, 
  getTherapeuticAreaCompanies,
  getTherapeuticAreaProducts,
  getRelatedTherapeuticAreas,
  getTherapeuticAreaFilters
} from '../../lib/utils/therapeuticAreaUtils';
import { supabase } from '../../lib/supabase';
import { dbTherapeuticAreaToTherapeuticArea } from '../../interfaces/entities/TherapeuticArea';
import { dbCompanyToCompany } from '../../interfaces/entities/Company';
import { dbProductToProduct } from '../../interfaces/entities/Product';

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
const mockTherapeuticAreas = [
  {
    id: 'ta1',
    name: 'Oncology',
    slug: 'oncology',
    description: 'Cancer treatment',
    icon_path: '/icons/oncology.svg',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'ta2',
    name: 'Cardiology',
    slug: 'cardiology',
    description: 'Heart health',
    icon_path: '/icons/cardiology.svg',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 'ta3',
    name: 'Neurology',
    slug: 'neurology',
    description: 'Brain and nervous system',
    icon_path: '/icons/neurology.svg',
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

// Mock relationship data
const mockCompanyTAs = [
  { company_id: 'c1', therapeutic_area_id: 'ta1' },
  { company_id: 'c1', therapeutic_area_id: 'ta2' },
  { company_id: 'c2', therapeutic_area_id: 'ta2' },
  { company_id: 'c2', therapeutic_area_id: 'ta3' }
];

const mockProductTAs = [
  { product_id: 'p1', therapeutic_area_id: 'ta1' },
  { product_id: 'p2', therapeutic_area_id: 'ta2' }
];

const mockWebsites = [
  { id: 'w1', company_id: 'c1' },
  { id: 'w2', company_id: 'c1' },
  { id: 'w3', company_id: 'c2' }
];

describe('therapeuticAreaUtils', () => {
  let mocks: ReturnType<typeof setupMocks>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupMocks();
  });
  
  describe('getTherapeuticAreas', () => {
    it('should fetch all therapeutic areas with no options', async () => {
      // Setup mock responses for each query in the function
      mocks.chainableMock.select.mockImplementationOnce(() => {
        const countMock = mocks.chainableMock.count;
        countMock.mockReturnValueOnce(mocks.chainableMock);
        return mocks.chainableMock;
      });
      
      // Return therapeutic areas data
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockTherapeuticAreas,
          count: mockTherapeuticAreas.length,
          error: null
        });
      });
      
      // Return company-TA relations
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockCompanyTAs,
          error: null
        });
      });
      
      // Return product-TA relations
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockProductTAs,
          error: null
        });
      });
      
      // Return websites
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites,
          error: null
        });
      });
      
      const result = await getTherapeuticAreas();
      
      // Verify Supabase queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      expect(mocks.chainableMock.select).toHaveBeenCalled();
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.mockFrom).toHaveBeenCalledWith('product_therapeutic_areas');
      expect(mocks.mockFrom).toHaveBeenCalledWith('websites');
      
      // Verify the result
      expect(result.therapeuticAreas).toHaveLength(3);
      expect(result.totalCount).toBe(3);
      
      // Verify stats calculations
      const oncology = result.therapeuticAreas.find(ta => ta.name === 'Oncology');
      expect(oncology).toBeDefined();
      expect(oncology?.companyCount).toBe(1);
      expect(oncology?.productCount).toBe(1);
      
      const cardiology = result.therapeuticAreas.find(ta => ta.name === 'Cardiology');
      expect(cardiology).toBeDefined();
      expect(cardiology?.companyCount).toBe(2);
      expect(cardiology?.productCount).toBe(1);
    });
    
    it('should apply search filter', async () => {
      // Setup mock response with filtered data
      mocks.chainableMock.or.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockTherapeuticAreas[0]],  // Only Oncology matches the filter
          count: 1,
          error: null
        });
      });
      
      // Return empty relations for simplicity
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({ data: [], error: null });
      });
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({ data: [], error: null });
      });
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({ data: [], error: null });
      });
      
      const result = await getTherapeuticAreas({ search: 'onco' });
      
      // Verify the search was applied
      expect(mocks.chainableMock.or).toHaveBeenCalledWith(
        expect.stringContaining('name.ilike.%onco%')
      );
      
      // Verify the filtered result
      expect(result.therapeuticAreas).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.therapeuticAreas[0].name).toBe('Oncology');
    });
    
    it('should apply sorting and count filtering', async () => {
      // Setup basic responses
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockTherapeuticAreas,
          count: mockTherapeuticAreas.length,
          error: null
        });
      });
      
      // Return company-TA relations
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockCompanyTAs,
          error: null
        });
      });
      
      // Return product-TA relations
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockProductTAs,
          error: null
        });
      });
      
      // Return websites
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockWebsites,
          error: null
        });
      });
      
      const result = await getTherapeuticAreas({ 
        sortBy: 'companies', 
        sortDirection: 'desc',
        minCompanies: 2
      });
      
      // Verify the result is filtered and sorted
      expect(result.therapeuticAreas).toHaveLength(1); // Only Cardiology has 2+ companies
      expect(result.therapeuticAreas[0].name).toBe('Cardiology');
    });
    
    it('should handle errors', async () => {
      // Setup mock to throw an error
      mocks.chainableMock.then.mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      // Verify the error is thrown
      await expect(getTherapeuticAreas()).rejects.toThrow('Database error');
    });
  });
  
  describe('getTherapeuticAreaBySlug', () => {
    it('should fetch a single therapeutic area by slug', async () => {
      // Setup mock response
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: mockTherapeuticAreas[0],
          error: null
        });
      });
      
      const result = await getTherapeuticAreaBySlug('oncology');
      
      // Verify correct query was made
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'oncology');
      expect(mocks.chainableMock.single).toHaveBeenCalled();
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Oncology');
      expect(result?.slug).toBe('oncology');
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
          data: mockTherapeuticAreas[0],
          error: null
        });
      });
      
      const result = await getTherapeuticAreaBySlug('ta1');
      
      // Verify both queries were attempted
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'ta1');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('id', 'ta1');
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Oncology');
    });
    
    it('should return null for non-existent therapeutic area', async () => {
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
      
      const result = await getTherapeuticAreaBySlug('nonexistent');
      
      // Verify the result is null
      expect(result).toBeNull();
    });
  });
  
  describe('getTherapeuticAreaCompanies', () => {
    it('should fetch companies for a therapeutic area', async () => {
      // Setup mock response for company-TA relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [
            { company_id: 'c1', therapeutic_area_id: 'ta1' }
          ],
          error: null
        });
      });
      
      // Setup mock response for companies
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.range.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.order.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockCompanies[0]],
          error: null
        });
      });
      
      const result = await getTherapeuticAreaCompanies('ta1');
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('therapeutic_area_id', 'ta1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['c1']);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Acme Pharma');
    });
    
    it('should return empty array when no companies found', async () => {
      // Setup mock response with no relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      const result = await getTherapeuticAreaCompanies('ta1');
      
      // Verify the result is empty
      expect(result).toHaveLength(0);
      // Verify we didn't continue to the second query
      expect(mocks.mockFrom).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getTherapeuticAreaProducts', () => {
    it('should fetch products for a therapeutic area', async () => {
      // Setup mock response for product-TA relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [
            { product_id: 'p1', therapeutic_area_id: 'ta1' }
          ],
          error: null
        });
      });
      
      // Setup mock response for products
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.range.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.order.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockProducts[0]],
          error: null
        });
      });
      
      const result = await getTherapeuticAreaProducts('ta1');
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('product_therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('therapeutic_area_id', 'ta1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('products');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['p1']);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Oncostat');
    });
  });
  
  describe('getRelatedTherapeuticAreas', () => {
    it('should fetch related therapeutic areas', async () => {
      // Setup mock responses for the relation queries
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [{ company_id: 'c1', therapeutic_area_id: 'ta1' }],
          error: null
        });
      });
      
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [{ product_id: 'p1', therapeutic_area_id: 'ta1' }],
          error: null
        });
      });
      
      // Setup mock responses for finding related TAs by companies
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.neq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [
            { therapeutic_area_id: 'ta2' },
            { therapeutic_area_id: 'ta2' } // Duplicate to test counting
          ],
          error: null
        });
      });
      
      // Setup mock responses for finding related TAs by products
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.neq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      // Setup mock response for fetching TA details
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [mockTherapeuticAreas[1]], // Cardiology related to Oncology
          error: null
        });
      });
      
      const result = await getRelatedTherapeuticAreas('ta1');
      
      // Verify the queries
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.mockFrom).toHaveBeenCalledWith('product_therapeutic_areas');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('company_id', ['c1']);
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('product_id', ['p1']);
      expect(mocks.chainableMock.neq).toHaveBeenCalledWith('therapeutic_area_id', 'ta1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['ta2']);
      
      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Cardiology');
    });
    
    it('should return empty array when no relations', async () => {
      // Setup mock responses with no relations
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => {
        return callback({
          data: [],
          error: null
        });
      });
      
      const result = await getRelatedTherapeuticAreas('ta1');
      
      // Verify the result is empty
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getTherapeuticAreaFilters', () => {
    it('should return filter options', async () => {
      const result = await getTherapeuticAreaFilters();
      
      // Verify the result
      expect(result.sortOptions).toBeDefined();
      expect(result.sortOptions).toHaveLength(8);
      expect(result.sortOptions[0].value).toBe('name_asc');
      expect(result.sortOptions[0].label).toBe('Name (A to Z)');
    });
  });
}); 