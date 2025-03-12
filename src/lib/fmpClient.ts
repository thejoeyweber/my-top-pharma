/**
 * Financial Modeling Prep (FMP) API Client - Stable API Version
 * 
 * Uses the stable API endpoints from https://financialmodelingprep.com/stable/
 * Implements proper rate limiting and bulk operations for efficiency.
 */

import type { Database } from '../types/supabase';

/**
 * FMP Company Profile from /stable/profile-bulk endpoint
 */
export interface FMPCompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number | string;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string | null;
  cusip: string | null;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string | number;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

/**
 * FMP Company Screener Response
 */
export interface FMPScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: number | string;
  sector: string;
  industry: string;
  beta: number;
  price: number;
  lastAnnualDividend: number;
  volume: number;
  exchange: string;
  exchangeShortName: string;
  country: string;
  isEtf: boolean;
  isActivelyTrading: boolean;
}

/**
 * Rate limit tracking
 */
interface RateLimit {
  remaining: number;
  reset: number;
  total: number;
}

/**
 * FMP Client Configuration
 */
export interface FMPClientConfig {
  apiKey: string;
  baseUrl?: string;
}

/**
 * Industries we're interested in
 */
export type PharmaIndustry = 
  | 'Biotechnology' 
  | 'Drug Manufacturers—Specialty & Generic'
  | 'Drug Manufacturers—General'
  | 'Medical Devices'
  | 'Healthcare Plans'
  | 'Pharmaceutical Retailers';

/**
 * FMP API Client for the stable API endpoints
 */
export class FMPClient {
  private apiKey: string;
  private baseUrl: string;
  private rateLimit: RateLimit = {
    remaining: 250, // Free tier default
    reset: Date.now() + 24 * 60 * 60 * 1000,
    total: 250
  };
  private lastRequestTime: number = 0;
  private minRequestDelay: number = 250; // Min 250ms between requests

  constructor(config: FMPClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://financialmodelingprep.com/stable';
    
    if (!this.apiKey) {
      throw new Error('FMP API key is required');
    }
  }

  /**
   * Update rate limit info from response headers
   */
  private updateRateLimit(headers: Headers) {
    const remaining = headers.get('X-Rate-Limit-Remaining');
    const reset = headers.get('X-Rate-Limit-Reset');
    const total = headers.get('X-Rate-Limit-Total');

    if (remaining) this.rateLimit.remaining = parseInt(remaining, 10);
    if (reset) this.rateLimit.reset = parseInt(reset, 10) * 1000; // Convert to ms
    if (total) this.rateLimit.total = parseInt(total, 10);
  }

  /**
   * Check if we should wait before making another request
   */
  private async checkRateLimit() {
    if (this.rateLimit.remaining <= 1) {
      const now = Date.now();
      if (now < this.rateLimit.reset) {
        const waitTime = this.rateLimit.reset - now;
        console.warn(`Rate limit reached. Waiting ${waitTime}ms for reset`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Ensure minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestDelay - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Make a request to the FMP API
   */
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    await this.checkRateLimit();
    
    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.apiKey
    });
    
    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url);
      this.updateRateLimit(response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FMP API Error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error fetching from FMP API:', error);
      throw error;
    }
  }

  /**
   * Get company profiles in bulk
   * More efficient than individual requests
   */
  async getCompanyProfiles(symbols: string[]): Promise<FMPCompanyProfile[]> {
    if (!symbols.length) return [];
    
    try {
      // Use bulk endpoint with part parameter
      const results = await this.request<FMPCompanyProfile[]>('/profile-bulk', {
        symbols: symbols.join(',')
      });
      return results || [];
    } catch (error) {
      console.error('Error fetching company profiles:', error);
      return [];
    }
  }

  /**
   * Screen for pharmaceutical companies
   */
  async getPharmaCompanies(): Promise<FMPScreenerResult[]> {
    try {
      const results = await this.request<FMPScreenerResult[]>('/company-screener', {
        sector: 'Healthcare',
        industry: [
          'Biotechnology',
          'Drug Manufacturers—Specialty & Generic',
          'Drug Manufacturers—General'
        ].join(','),
        isActivelyTrading: 'true'
      });
      return results || [];
    } catch (error) {
      console.error('Error screening companies:', error);
      return [];
    }
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): RateLimit {
    return { ...this.rateLimit };
  }
}

/**
 * Create a new FMP client instance
 */
export function createFMPClient(apiKey: string): FMPClient {
  return new FMPClient({ apiKey });
} 