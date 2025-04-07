/**
 * Tests for Company Utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Company } from '../../interfaces/entities/Company';

// Mock the Supabase module
vi.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(),
      })),
    },
  };
});

// Import the functions after mocking
import { getCompanies, getCompanyBySlug, getCompanyTherapeuticAreas } from '../../lib/utils/companyUtils';
import { supabase } from '../../lib/supabase';

// Create helper function to reset mocks and set up chains
function setupMocks() {
  // Get the mocked functions
  const mockFrom = vi.mocked(supabase.from);
  
  // Create a chainable mock with default implementations
  const createChainableMock = () => {
    // Define a mock response that can be returned by any method
    const mockResponse = {
      then: vi.fn()
    };
    
    // Create the chainable mock object with all methods returning itself
    const chainableMock = {
      select: vi.fn(() => chainableMock),
      eq: vi.fn(() => chainableMock),
      ilike: vi.fn(() => chainableMock),
      in: vi.fn(() => chainableMock),
      not: vi.fn(() => chainableMock),
      is: vi.fn(() => chainableMock),
      neq: vi.fn(() => chainableMock),
      gt: vi.fn(() => chainableMock),
      lt: vi.fn(() => chainableMock),
      gte: vi.fn(() => chainableMock),
      lte: vi.fn(() => chainableMock),
      or: vi.fn(() => chainableMock),
      order: vi.fn(() => chainableMock),
      range: vi.fn(() => chainableMock),
      limit: vi.fn(() => chainableMock),
      single: vi.fn(() => chainableMock),
      count: vi.fn(() => chainableMock),
      then: vi.fn((callback) => callback({
        data: [],
        count: 0,
        error: null
      }))
    };
    
    return chainableMock;
  };
  
  // Reset mocks
  mockFrom.mockReset();
  
  // Set up the chain
  const chainableMock = createChainableMock();
  mockFrom.mockReturnValue(chainableMock);
  
  return {
    mockFrom,
    chainableMock
  };
}

// Mock company data for testing
const mockCompanies = [
  {
    id: '1',
    name: 'Acme Pharma',
    slug: 'acme-pharma',
    description: 'A pharmaceutical company',
    logo_url: 'https://example.com/logo.png',
    market_cap: 500,
    headquarters: 'New York, US',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Bio Solutions',
    slug: 'bio-solutions',
    description: 'A biotech company',
    logo_url: 'https://example.com/bio-logo.png',
    market_cap: 300,
    headquarters: 'Boston, US',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  }
];

describe('companyUtils', () => {
  let mocks: ReturnType<typeof setupMocks>;
  
  beforeEach(() => {
    mocks = setupMocks();
  });
  
  describe('getCompanies', () => {
    it('should fetch all companies with no options', async () => {
      // Set up mock response for the count query
      mocks.chainableMock.select.mockImplementationOnce(() => mocks.chainableMock);
      
      // Set up mock response for the main query
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: mockCompanies,
        count: mockCompanies.length,
        error: null
      }));
      
      const result = await getCompanies();
      
      // Verify the correct Supabase calls were made
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.select).toHaveBeenCalled();
      
      // Verify the result contains mapped companies
      expect(result.companies).toHaveLength(2);
      expect(result.companies[0].name).toBe('Acme Pharma');
      expect(result.companies[1].name).toBe('Bio Solutions');
    });
    
    it('should apply text filtering correctly', async () => {
      // Setup mock responses
      mocks.chainableMock.select.mockImplementationOnce(() => mocks.chainableMock);
      mocks.chainableMock.ilike.mockImplementationOnce(() => mocks.chainableMock);
      
      // Setup mock response for the main query
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: [mockCompanies[1]],  // Only Bio Solutions matches the filter
        count: 1,
        error: null
      }));
      
      const result = await getCompanies({ search: 'bio' });
      
      // Verify the correct filtering was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.ilike).toHaveBeenCalled();
      
      // Verify the filtered result
      expect(result.companies).toHaveLength(1);
      expect(result.companies[0].name).toBe('Bio Solutions');
    });
    
    it('should apply sorting correctly', async () => {
      // Setup mock responses
      mocks.chainableMock.select.mockImplementationOnce(() => mocks.chainableMock);
      mocks.chainableMock.order.mockImplementationOnce(() => mocks.chainableMock);
      
      // Setup mock response for the main query with reversed data (for descending sort)
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: [...mockCompanies].reverse(), // Reversed for desc sort
        count: mockCompanies.length,
        error: null
      }));
      
      const result = await getCompanies({ 
        sortBy: 'name', 
        sortDirection: 'desc' 
      });
      
      // Verify sorting was applied
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.order).toHaveBeenCalled();
      
      // Verify the sorted result
      expect(result.companies).toHaveLength(2);
      expect(result.companies[0].name).toBe('Bio Solutions');
      expect(result.companies[1].name).toBe('Acme Pharma');
    });
    
    it('should handle errors properly', async () => {
      // Setup mock to throw an error
      mocks.chainableMock.select.mockImplementationOnce(() => mocks.chainableMock);
      mocks.chainableMock.then.mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      // Verify that the error is thrown
      await expect(getCompanies()).rejects.toThrow('Database error');
      
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.select).toHaveBeenCalled();
    });
  });
  
  describe('getCompanyBySlug', () => {
    it('should fetch a single company by slug', async () => {
      // Setup mock responses
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      // Setup mock response
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: mockCompanies[0],
        error: null
      }));
      
      const result = await getCompanyBySlug('acme-pharma');
      
      // Verify correct query was made
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'acme-pharma');
      expect(mocks.chainableMock.single).toHaveBeenCalled();
      
      // Verify the result
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Acme Pharma');
      expect(result?.slug).toBe('acme-pharma');
    });
    
    it('should return null for non-existent company', async () => {
      // Setup mock responses
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      mocks.chainableMock.single.mockReturnValueOnce(mocks.chainableMock);
      
      // Setup mock response for not found
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' }
      }));
      
      const result = await getCompanyBySlug('non-existent');
      
      // Verify the query
      expect(mocks.mockFrom).toHaveBeenCalledWith('companies');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('slug', 'non-existent');
      
      // Verify null result
      expect(result).toBeNull();
    });
  });
  
  describe('getCompanyTherapeuticAreas', () => {
    it('should fetch therapeutic areas for a company', async () => {
      // Setup mock responses for company therapeutic areas
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: [{ therapeutic_area_id: 'ta1' }, { therapeutic_area_id: 'ta2' }],
        error: null
      }));
      
      // Setup mock response for therapeutic area names
      mocks.chainableMock.in.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: [{ name: 'Oncology' }, { name: 'Cardiology' }],
        error: null
      }));
      
      const result = await getCompanyTherapeuticAreas('1');
      
      // Verify correct queries were made
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('company_id', '1');
      expect(mocks.mockFrom).toHaveBeenCalledWith('therapeutic_areas');
      expect(mocks.chainableMock.in).toHaveBeenCalledWith('id', ['ta1', 'ta2']);
      
      // Verify result contains therapeutic area names
      expect(result).toEqual(['Oncology', 'Cardiology']);
    });
    
    it('should return empty array when company has no therapeutic areas', async () => {
      // Setup mock response with no therapeutic areas
      mocks.chainableMock.eq.mockReturnValueOnce(mocks.chainableMock);
      
      mocks.chainableMock.then.mockImplementationOnce((callback) => callback({
        data: [],
        error: null
      }));
      
      const result = await getCompanyTherapeuticAreas('1');
      
      // Verify the query
      expect(mocks.mockFrom).toHaveBeenCalledWith('company_therapeutic_areas');
      expect(mocks.chainableMock.eq).toHaveBeenCalledWith('company_id', '1');
      
      // Verify empty result
      expect(result).toEqual([]);
    });
  });
}); 