/**
 * Enhanced Financial Modeling Prep (FMP) API Client
 * 
 * This module provides an improved client for FMP with better handling of rate limits
 * and more efficient use of API calls.
 */

import type { FMPCompanyProfile, FMPScreenerResult, ScreenOptions } from './fmp';

/**
 * Configuration for the FMP client
 */
interface FMPClientConfig {
  apiKey: string;
  baseUrl?: string;
  requestDelay: number;
  defaultBatchSize?: number;
  maxRetries?: number;
}

/**
 * Default configuration
 */
const defaultConfig: FMPClientConfig = {
  apiKey: import.meta.env.PUBLIC_FMP_API_KEY || '',
  baseUrl: 'https://financialmodelingprep.com/stable',
  requestDelay: 1000,
  defaultBatchSize: 5,
  maxRetries: 3
};

/**
 * Industries we're interested in
 */
export type PharmaIndustry = 
  | 'Biotechnology' 
  | 'Drug Manufacturers - Specialty & Generic'  // Fixed hyphen
  | 'Drug Manufacturers - General'              // Fixed hyphen
  | 'Medical Devices'
  | 'Healthcare Plans'
  | 'Pharmaceutical Retailers';

/**
 * Result of a company screening operation
 */
interface ScreeningResult {
  companies: FMPScreenerResult[];
  totalFound: number;
  requestsMade: number;
  apiCallsRemaining?: number;
  industries: Record<string, number>;
}

/**
 * Rate limit tracking
 */
interface RateLimit {
  remaining: number;
  reset: number;
  total: number;
}

class RateLimitHandler {
  private rateLimit: RateLimit = {
    remaining: 250,
    reset: Date.now() + 24 * 60 * 60 * 1000,
    total: 250
  };

  updateFromHeaders(headers: Headers): void {
    const remaining = headers.get('X-Rate-Limit-Remaining');
    const reset = headers.get('X-Rate-Limit-Reset');
    const total = headers.get('X-Rate-Limit-Total');

    if (remaining) this.rateLimit.remaining = parseInt(remaining);
    if (reset) this.rateLimit.reset = parseInt(reset) * 1000;
    if (total) this.rateLimit.total = parseInt(total);
  }

  async handleRateLimit(): Promise<void> {
    if (this.rateLimit.remaining <= 5) {
      const now = Date.now();
      const waitTime = Math.max(0, this.rateLimit.reset - now);
      if (waitTime > 0) {
        console.warn(`Rate limit near (${this.rateLimit.remaining}), waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  getRateLimit(): RateLimit {
    return { ...this.rateLimit };
  }
}

/**
 * Enhanced FMP API client with better rate limit handling and efficiency
 * @param apiKey The FMP API key
 * @param config Additional configuration options
 */
export function createFMPClient(apiKey: string, config: Partial<FMPClientConfig> = {}) {
  if (!apiKey) {
    throw new Error('FMP API key is required');
  }

  const baseUrl = config.baseUrl || 'https://financialmodelingprep.com/stable';
  const requestDelay = config.requestDelay || 1000;
  const defaultBatchSize = config.defaultBatchSize || 5;
  const maxRetries = config.maxRetries || 3;

  let lastRequestTime = 0;
  let requestsMade = 0;
  let retryCount = 0;

  /**
   * Enhanced request function with proper rate limiting and error handling
   */
  async function request<T>(
    endpoint: string, 
    params: Record<string, string> = {}, 
    rateLimitHandler: RateLimitHandler,
    config: FMPClientConfig = defaultConfig
  ): Promise<T> {
    await rateLimitHandler.handleRateLimit();
    
    // Add delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const delay = config.requestDelay || defaultConfig.requestDelay;
    
    if (timeSinceLastRequest < delay) {
      await new Promise(resolve => setTimeout(resolve, delay - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
    requestsMade++;
    
    const queryParams = new URLSearchParams({
      ...params,
      apikey: config.apiKey
    });
    
    const url = `${config.baseUrl}${endpoint}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url);
      rateLimitHandler.updateFromHeaders(response.headers);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`Rate limit hit, waiting ${delay * 2}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay * 2));
          retryCount++;
          return request<T>(endpoint, params, rateLimitHandler, config);
        }
        throw new Error(`FMP API Error (${response.status}): ${await response.text()}`);
      }
      
      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get company profiles for multiple tickers
   * This uses individual profile fetches which work on the free tier
   */
  async function getCompanyProfiles(
    symbols: string[],
    rateLimitHandler: RateLimitHandler,
    config: FMPClientConfig = defaultConfig
  ): Promise<FMPCompanyProfile[]> {
    if (!symbols.length) {
      return [];
    }
    
    const results: FMPCompanyProfile[] = [];
    const batchSize = config.defaultBatchSize || defaultConfig.defaultBatchSize || 5;
    
    // Process in smaller batches to avoid rate limits
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      // Use comma-separated list for the batch (still works on free tier)
      const symbolsParam = batch.join(',');
      
      try {
        const profiles = await request<FMPCompanyProfile[]>(`/profile/${symbolsParam}`, {}, rateLimitHandler, config);
        
        if (profiles && Array.isArray(profiles)) {
          results.push(...profiles);
        }
        
        // Add delay between batches
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, config.requestDelay));
        }
      } catch (error) {
        console.error(`Error fetching profiles for batch starting at ${i}:`, error);
        // Continue with the next batch even if this one fails
      }
    }
    
    return results;
  }
  
  /**
   * Get stocks in the Healthcare sector from the screener
   * This uses the company-screener endpoint for the stable API
   */
  async function screenHealthcareCompanies(
    industry: string,
    rateLimitHandler: RateLimitHandler,
    config: FMPClientConfig = defaultConfig
  ): Promise<FMPScreenerResult[]> {
    // Use the company-screener endpoint (stable API uses company-screener, not stock-screener)
    const params: Record<string, string> = {
      sector: 'Healthcare',
      industry: industry,
      isActivelyTrading: 'true'
    };
    
    try {
      return await request<FMPScreenerResult[]>('/company-screener', params, rateLimitHandler, config);
    } catch (error) {
      console.error(`Error screening for industry ${industry}:`, error);
      return [];
    }
  }
  
  /**
   * Count companies by industry
   */
  function countByIndustry(companies: (FMPCompanyProfile | FMPScreenerResult)[]): Record<string, number> {
    return companies.reduce((acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Get pharmaceutical companies using free tier endpoints
   */
  async function getPharmaCompanies(
    options: ScreenOptions = {},
    config: FMPClientConfig = defaultConfig
  ): Promise<ScreeningResult> {
    // Ensure industry names use proper hyphens
    const industries = options.includeIndustries || [
      'Biotechnology',
      'Drug Manufacturers - Specialty & Generic',
      'Drug Manufacturers - General'
    ];
    
    // Log the industries we're using
    console.log('Using industries:', industries);
    
    const rateLimitHandler = new RateLimitHandler();
    const results: FMPScreenerResult[] = [];
    const industryCount: Record<string, number> = {};
    
    // Step 1: Use company-screener endpoint to find companies in each industry
    for (const industry of industries) {
      try {
        console.log(`Screening for industry: ${industry}`);
        const industryResults = await screenHealthcareCompanies(
          industry, 
          rateLimitHandler,
          config
        );
        
        if (industryResults && Array.isArray(industryResults)) {
          industryCount[industry] = industryResults.length;
          results.push(...industryResults);
          console.log(`Found ${industryResults.length} companies in ${industry}`);
        }
        
        // Add delay between industry requests
        if (industry !== industries[industries.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, config.requestDelay));
        }
      } catch (error) {
        console.error(`Error processing industry ${industry}:`, error);
      }
    }
    
    // Limit results if maxCompanies is specified
    const limitedResults = options.maxCompanies 
      ? results.slice(0, options.maxCompanies) 
      : results;
    
    console.log(`Total companies found across all industries: ${limitedResults.length}`);
    
    return {
      companies: limitedResults,
      totalFound: limitedResults.length,
      requestsMade: requestsMade,
      industries: industryCount
    };
  }

  return {
    getCompanyProfiles,
    getPharmaCompanies,
    screenHealthcareCompanies,
    getRequestCount: () => requestsMade,
    getRetryCount: () => retryCount
  };
}

/**
 * Export the factory function to create a new client
 */
export default createFMPClient; 