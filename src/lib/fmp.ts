/**
 * Financial Modeling Prep (FMP) API Client
 * 
 * This module provides a typed client for interacting with FMP's API endpoints
 * to fetch pharmaceutical and biotech company data.
 */

/**
 * FMP Company Profile Response
 * Contains detailed info about a company from the /profile endpoint
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
 * FMP Stock Screener Response
 * Contains screener results from the /stock-screener endpoint
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
 * Error from FMP API
 */
export interface FMPError {
  message: string;
  status: number;
}

/**
 * Configuration for the FMP client
 */
export interface FMPClientConfig {
  apiKey: string;
  baseUrl?: string;
  requestDelay?: number;
  defaultBatchSize?: number;
}

/**
 * Industries that are related to pharmaceuticals or biotech
 */
export type PharmaIndustry = 
  | 'Biotechnology' 
  | 'Drug Manufacturers—Specialty & Generic'
  | 'Drug Manufacturers—General'
  | 'Medical Devices'
  | 'Healthcare Plans'
  | 'Pharmaceutical Retailers';

/**
 * Options for screening companies
 */
export interface ScreenOptions {
  batchSize?: number;
  maxCompanies?: number;
  includeIndustries?: PharmaIndustry[];
  requestDelay?: number;
}

/**
 * Result of a company screening operation
 */
export interface ScreeningResult {
  companies: FMPScreenerResult[];
  totalFound: number;
  requestsMade: number;
  apiCallsRemaining?: number;
  industries: Record<string, number>;
}

/**
 * Financial Modeling Prep API Client
 * Handles requests to FMP API endpoints with proper error handling and rate limiting
 */
export class FMPClient {
  private apiKey: string;
  private baseUrl: string;
  private lastRequestTime: number = 0;
  private requestDelay: number = 250; // Min 250ms between requests to avoid rate limiting
  private defaultBatchSize: number = 20; // Default to 20 companies per batch (FMP supports up to 25-30)
  private requestsMade: number = 0;

  /**
   * Create a new FMP API client
   * @param config Configuration for the client
   */
  constructor(config: FMPClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://financialmodelingprep.com/api/v3';
    this.requestDelay = config.requestDelay || 250;
    this.defaultBatchSize = config.defaultBatchSize || 20;
    
    if (!this.apiKey) {
      throw new Error('FMP API key is required');
    }
  }

  /**
   * Make a request to the FMP API with rate limiting
   * @param endpoint The API endpoint
   * @param params Additional query parameters
   * @returns The API response
   */
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // Simple rate limiting to avoid hitting API limits
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    this.requestsMade++;
    
    // Build the query string
    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.apiKey
    });
    
    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FMP API Error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data === null || data.length === 0) {
        return [] as unknown as T;
      }
      
      return data as T;
    } catch (error) {
      console.error('Error fetching from FMP API:', error);
      throw error;
    }
  }

  /**
   * Get total API requests made since client initialization
   */
  public getRequestCount(): number {
    return this.requestsMade;
  }

  /**
   * Reset the request counter
   */
  public resetRequestCount(): void {
    this.requestsMade = 0;
  }
  
  /**
   * Get company profiles for multiple tickers
   * @param symbols List of ticker symbols
   * @returns Company profiles
   */
  async getCompanyProfiles(symbols: string[]): Promise<FMPCompanyProfile[]> {
    if (!symbols.length) {
      return [];
    }
    
    // Join symbols for batch request (comma-separated)
    const symbolsParam = symbols.join(',');
    return this.request<FMPCompanyProfile[]>(`/profile/${symbolsParam}`);
  }
  
  /**
   * Get company profile for a single ticker
   * @param symbol Ticker symbol
   * @returns Company profile
   */
  async getCompanyProfile(symbol: string): Promise<FMPCompanyProfile | null> {
    const profiles = await this.getCompanyProfiles([symbol]);
    return profiles.length > 0 ? profiles[0] : null;
  }
  
  /**
   * Screen for companies in specific industries with configurable options
   * @param options Screening options including industries, batch size, and maximum companies
   * @returns Screening result with companies, counts, and API usage
   */
  async screenCompanies(options: ScreenOptions = {}): Promise<ScreeningResult> {
    const industries = options.includeIndustries || [
      'Biotechnology',
      'Drug Manufacturers—Specialty & Generic',
      'Drug Manufacturers—General'
    ];
    const sector = 'Healthcare';
    const batchSize = options.batchSize || this.defaultBatchSize;
    const maxCompanies = options.maxCompanies || Number.MAX_SAFE_INTEGER;
    const requestDelay = options.requestDelay || this.requestDelay;
    
    // Cannot screen for multiple industries in a single call
    // Need to make separate calls and merge the results
    const results: FMPScreenerResult[] = [];
    const processedSymbols = new Set<string>();
    const industryCount: Record<string, number> = {};
    const startRequestCount = this.requestsMade;
    
    for (const industry of industries) {
      const industryResults = await this.request<FMPScreenerResult[]>('/stock-screener', {
        sector,
        industry,
        isActivelyTrading: 'true',
        exchange: 'NYSE,NASDAQ,AMEX,EURONEXT,TSX,MUTUAL_FUND,ETF'
      });
      
      // Track counts by industry
      industryCount[industry] = industryResults.length;
      
      // Avoid duplicates when merging results
      for (const company of industryResults) {
        if (!processedSymbols.has(company.symbol)) {
          processedSymbols.add(company.symbol);
          results.push(company);
          
          // Break if we've reached the maximum number of companies
          if (results.length >= maxCompanies) {
            break;
          }
        }
      }
      
      // Break outer loop if we've reached the maximum
      if (results.length >= maxCompanies) {
        break;
      }
      
      // Delay between industry requests
      if (industry !== industries[industries.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, requestDelay));
      }
    }
    
    return {
      companies: results.slice(0, maxCompanies),
      totalFound: results.length,
      requestsMade: this.requestsMade - startRequestCount,
      industries: industryCount
    };
  }
  
  /**
   * Get pharmaceutical and biotech companies with configurable options
   * @param options Screening options including batch size and maximum companies
   * @returns Screening result with companies, counts, and API usage
   */
  async getPharmaCompanies(options: ScreenOptions = {}): Promise<ScreeningResult> {
    return this.screenCompanies({
      includeIndustries: [
        'Biotechnology',
        'Drug Manufacturers—Specialty & Generic',
        'Drug Manufacturers—General'
      ],
      ...options
    });
  }
}

/**
 * Create a configured FMP client instance
 * @param apiKey FMP API key
 * @param config Additional configuration options
 * @returns Configured FMP client
 */
export function createFMPClient(apiKey: string, config: Partial<FMPClientConfig> = {}): FMPClient {
  return new FMPClient({ apiKey, ...config });
} 