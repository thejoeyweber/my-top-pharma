/**
 * Error Handling Utilities Tests
 * 
 * Unit tests for the error handling utilities.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createErrorResponse, 
  handleDatabaseError, 
  handleNetworkError, 
  handleExternalApiError,
  createNotFoundError,
  safeJsonParse,
  ErrorCategory
} from '../errorUtils';

// Mock console.error to prevent test output noise
console.error = vi.fn();

describe('Error Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('createErrorResponse', () => {
    it('should create a basic error response', () => {
      const result = createErrorResponse('Test error', ErrorCategory.INTERNAL);
      
      expect(result).toEqual({
        message: 'Test error',
        category: ErrorCategory.INTERNAL,
        code: undefined,
        details: undefined,
        originalError: undefined
      });
    });
    
    it('should include additional options when provided', () => {
      const originalError = new Error('Original error');
      const result = createErrorResponse('Test error', ErrorCategory.DATABASE, {
        code: 'DB_ERROR',
        details: { field: 'id' },
        originalError
      });
      
      expect(result).toEqual({
        message: 'Test error',
        category: ErrorCategory.DATABASE,
        code: 'DB_ERROR',
        details: { field: 'id' },
        originalError
      });
    });
  });
  
  describe('handleDatabaseError', () => {
    it('should handle PostgrestError objects', () => {
      const postgrestError = {
        message: 'Database error',
        code: 'DB_ERROR',
        hint: 'Check your query',
        details: 'Error details'
      };
      
      const result = handleDatabaseError(
        postgrestError,
        'fetch',
        'company',
        '123'
      );
      
      expect(result.message).toContain('Failed to fetch company 123');
      expect(result.category).toBe(ErrorCategory.DATABASE);
      expect(result.code).toBe('DB_ERROR');
      expect(result.details).toHaveProperty('hint', 'Check your query');
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should handle generic errors', () => {
      const error = new Error('Generic error');
      
      const result = handleDatabaseError(
        error,
        'update',
        'product'
      );
      
      expect(result.message).toContain('Failed to update product');
      expect(result.category).toBe(ErrorCategory.DATABASE);
      expect(result.originalError).toBe(error);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('handleNetworkError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Network error');
      
      const result = handleNetworkError(error, 'API call');
      
      expect(result.message).toContain('Network error');
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.originalError).toBe(error);
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should handle non-Error objects', () => {
      const result = handleNetworkError('Connection refused', 'API call');
      
      expect(result.message).toBe('Network connection error');
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.originalError).toBe('Connection refused');
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('handleExternalApiError', () => {
    it('should handle Error objects', () => {
      const error = new Error('API error');
      
      const result = handleExternalApiError(error, 'FMP', 'fetching financials');
      
      expect(result.message).toContain('FMP API error');
      expect(result.category).toBe(ErrorCategory.EXTERNAL_API);
      expect(result.originalError).toBe(error);
      expect(console.error).toHaveBeenCalled();
    });
    
    it('should handle non-Error objects', () => {
      const result = handleExternalApiError(
        { status: 429, statusText: 'Too Many Requests' },
        'FMP',
        'fetching financials'
      );
      
      expect(result.message).toContain('FMP API error during fetching financials');
      expect(result.category).toBe(ErrorCategory.EXTERNAL_API);
      expect(result.originalError).toEqual({ status: 429, statusText: 'Too Many Requests' });
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('createNotFoundError', () => {
    it('should create an error with identifier', () => {
      const result = createNotFoundError('Company', '123');
      
      expect(result.message).toBe("Company with identifier '123' not found");
      expect(result.category).toBe(ErrorCategory.NOT_FOUND);
    });
    
    it('should create an error without identifier', () => {
      const result = createNotFoundError('Companies');
      
      expect(result.message).toBe('Companies not found');
      expect(result.category).toBe(ErrorCategory.NOT_FOUND);
    });
  });
  
  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"name":"test","value":123}', {});
      
      expect(result).toEqual({ name: 'test', value: 123 });
    });
    
    it('should return default value for invalid JSON', () => {
      const defaultValue = { name: 'default' };
      const result = safeJsonParse('{invalid json', defaultValue);
      
      expect(result).toBe(defaultValue);
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 