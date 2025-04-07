/**
 * URL Utilities Tests
 * 
 * Tests for URL manipulation and parameter handling utilities.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { updateUrlParams, getPaginationUrl, getPaginationParams } from '../../lib/utils/urlUtils';

describe('urlUtils', () => {
  describe('updateUrlParams', () => {
    // Mock window.location in a server-side environment
    const originalWindow = global.window;
    
    beforeEach(() => {
      // Reset window mock before each test
      vi.stubGlobal('window', {
        location: {
          href: 'https://example.com/test?existing=value'
        }
      });
    });
    
    afterEach(() => {
      // Restore original window after each test
      if (originalWindow) {
        vi.stubGlobal('window', originalWindow);
      } else {
        vi.unstubAllGlobals();
      }
    });

    it('should add new parameters', () => {
      const baseUrl = new URL('https://example.com/path');
      const result = updateUrlParams({ key: 'value' }, baseUrl);
      expect(result).toBe('/path?key=value');
    });

    it('should update existing parameters', () => {
      const baseUrl = new URL('https://example.com/path?key=oldvalue');
      const result = updateUrlParams({ key: 'newvalue' }, baseUrl);
      expect(result).toBe('/path?key=newvalue');
    });

    it('should remove parameters when value is null', () => {
      const baseUrl = new URL('https://example.com/path?key=value&keep=true');
      const result = updateUrlParams({ key: null }, baseUrl);
      expect(result).toBe('/path?keep=true');
    });

    it('should join array values with commas', () => {
      const baseUrl = new URL('https://example.com/path');
      const result = updateUrlParams({ tags: ['one', 'two', 'three'] }, baseUrl);
      expect(result).toBe('/path?tags=one%2Ctwo%2Cthree');
    });

    it('should handle number values', () => {
      const baseUrl = new URL('https://example.com/path');
      const result = updateUrlParams({ count: 42 }, baseUrl);
      expect(result).toBe('/path?count=42');
    });

    it('should handle string baseUrl', () => {
      const result = updateUrlParams({ key: 'value' }, 'https://example.com/path');
      expect(result).toBe('/path?key=value');
    });

    it('should use window.location.href when no baseUrl provided', () => {
      const result = updateUrlParams({ newParam: 'newValue' });
      expect(result).toBe('/test?existing=value&newParam=newValue');
    });
  });

  describe('getPaginationUrl', () => {
    it('should add page parameter to URL', () => {
      const baseUrl = '/products';
      const params = new URLSearchParams('sort=name_asc');
      const result = getPaginationUrl(baseUrl, params, 2);
      expect(result).toBe('/products?sort=name_asc&page=2');
    });

    it('should update existing page parameter', () => {
      const baseUrl = '/products';
      const params = new URLSearchParams('sort=name_asc&page=1');
      const result = getPaginationUrl(baseUrl, params, 3);
      expect(result).toBe('/products?sort=name_asc&page=3');
    });
  });

  describe('getPaginationParams', () => {
    it('should extract pagination params with defaults', () => {
      const params = new URLSearchParams('');
      const result = getPaginationParams(params);
      expect(result).toEqual({ page: 1, limit: 20, offset: 0 });
    });

    it('should extract pagination params from URL', () => {
      const params = new URLSearchParams('page=3&limit=10');
      const result = getPaginationParams(params);
      expect(result).toEqual({ page: 3, limit: 10, offset: 20 });
    });

    it('should use custom default limit', () => {
      const params = new URLSearchParams('page=2');
      const result = getPaginationParams(params, 25);
      expect(result).toEqual({ page: 2, limit: 25, offset: 25 });
    });
  });
}); 