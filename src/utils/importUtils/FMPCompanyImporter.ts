/**
 * FMPCompanyImporter
 * 
 * Specific implementation of BaseImporter for handling
 * Financial Modeling Prep (FMP) company data imports.
 */

import { BaseImporter } from './BaseImporter';
import { ErrorCategory, handleExternalApiError } from '../errorUtils';
import type { Company } from '../../interfaces/entities/Company';

// We need to import these types from their source
type FMPClient = any; // Will be replaced with actual type when imported dynamically
type FMPCompany = any; // Will be replaced with actual type when imported dynamically

export class FMPCompanyImporter extends BaseImporter {
  private fmpClient: FMPClient | null = null;
  private processCompanyProfiles: Function | null = null; 
  private processScreenerResults: Function | null = null;
  private screenResults: { companies: any[] } | null = null;
  private tickers: string[] = [];

  constructor() {
    // FMP data source ID is 1, table is 'companies', backup dir is 'fmp'
    super(1, 'companies', 'fmp');
  }

  /**
   * Execute the FMP company import process
   */
  protected async executeImport(): Promise<Company[]> {
    // Initialize dependencies
    await this.initializeDependencies();
    
    // Fetch and transform data
    await this.fetchPharmaCompanies();
    await this.fetchCompanyProfiles();
    
    // Save data to backup before database insertion
    await this.saveBackup(this.companies, 'fmp-companies');
    
    // Insert into database
    await this.batchUpsert(this.companies, 50, 'slug');
    
    // Return the processed companies
    return this.companies;
  }

  /**
   * Initialize FMP client and mappers
   */
  private async initializeDependencies(): Promise<void> {
    console.log('Initializing FMP client and mappers...');
    
    // Validate FMP API key
    const { FMP_API_KEY } = process.env;
    
    if (!FMP_API_KEY) {
      throw {
        message: 'Missing FMP API key in .env file',
        category: ErrorCategory.CONFIGURATION
      };
    }
    
    try {
      // Dynamically import dependencies
      const { createFMPClient } = await import('../../lib/fmpClient.js');
      const { processCompanyProfiles, processScreenerResults } = await import('../../lib/fmpMapper.js');
      
      // Initialize FMP client
      this.fmpClient = createFMPClient(FMP_API_KEY);
      this.processCompanyProfiles = processCompanyProfiles;
      this.processScreenerResults = processScreenerResults;
      
      console.log('FMP client and mappers initialized successfully');
    } catch (error: any) {
      throw {
        message: `Failed to initialize FMP dependencies: ${error.message}`,
        category: ErrorCategory.IMPORT,
        originalError: error
      };
    }
  }

  /**
   * Fetch pharmaceutical companies from FMP screener
   */
  private async fetchPharmaCompanies(): Promise<void> {
    if (!this.fmpClient) {
      throw {
        message: 'FMP client not initialized',
        category: ErrorCategory.IMPORT
      };
    }
    
    console.log('Fetching pharmaceutical companies from FMP...');
    
    try {
      this.screenResults = await this.fmpClient.getPharmaCompanies();
      if (!this.screenResults) {
        throw {
          message: 'Failed to get screener results from FMP',
          category: ErrorCategory.EXTERNAL_API
        };
      }
      this.tickers = this.screenResults.companies.map(company => company.symbol);
      
      console.log(`Found ${this.tickers.length} companies from screener`);
    } catch (error: any) {
      throw handleExternalApiError(error, 'FMP', 'fetching pharmaceutical companies');
    }
  }

  /**
   * Fetch detailed company profiles with rate limiting
   */
  private async fetchCompanyProfiles(): Promise<void> {
    if (!this.fmpClient || !this.screenResults || !this.processCompanyProfiles || !this.processScreenerResults) {
      throw {
        message: 'Required dependencies not initialized',
        category: ErrorCategory.IMPORT
      };
    }
    
    console.log('Fetching and processing company profiles...');
    
    // Process in batches to avoid rate limits
    const BATCH_SIZE = 25;
    const DELAY_BETWEEN_BATCHES = 1500; // 1.5 seconds
    let allProfiles: any[] = [];
    
    for (let i = 0; i < this.tickers.length; i += BATCH_SIZE) {
      const batchTickers = this.tickers.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(this.tickers.length / BATCH_SIZE);
      
      console.log(`Fetching profiles for batch ${batchNum}/${totalBatches} (${batchTickers.length} companies)...`);
      
      try {
        const batchProfiles = await this.fmpClient.getCompanyProfiles(batchTickers);
        allProfiles.push(...batchProfiles);
        
        // Log progress
        console.log(`Progress: ${allProfiles.length}/${this.tickers.length} profiles fetched`);
        
        if (i + BATCH_SIZE < this.tickers.length) {
          // Add a delay between batches to avoid rate limiting
          console.log(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      } catch (error: any) {
        // Log error but continue with the next batch rather than failing completely
        console.error(`Error fetching batch ${batchNum}:`, error);
      }
    }
    
    console.log(`Got detailed profiles for ${allProfiles.length} of ${this.tickers.length} companies`);
    
    // Transform the data
    console.log('Transforming company data to database schema...');
    // Use non-null assertion since we already checked processCompanyProfiles above
    let transformedCompanies = this.processCompanyProfiles!(allProfiles);
    
    // For any companies that we couldn't get detailed profiles for, use screener data
    const missingTickers = new Set(this.tickers);
    allProfiles.forEach(profile => missingTickers.delete(profile.symbol));
    
    if (missingTickers.size > 0) {
      console.log(`Adding ${missingTickers.size} companies from screener data (missing profiles)`);
      
      const missingCompanies = this.screenResults.companies
        .filter(result => missingTickers.has(result.symbol))
        .map(result => this.processScreenerResults!([result])[0]);
        
      transformedCompanies.push(...missingCompanies);
    }
    
    console.log(`Transformed ${transformedCompanies.length} companies for database insertion`);
    
    // Store processed companies in state
    this.companies = transformedCompanies;
    this.statistics.processed = transformedCompanies.length;
  }

  // Property to store companies after transformation
  private companies: Company[] = [];
} 