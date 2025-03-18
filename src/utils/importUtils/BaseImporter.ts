/**
 * BaseImporter
 * 
 * This abstract class provides a foundation for all data importers with
 * common functionality for connection setup, validation, backup, and logging.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import fs from 'fs/promises';
import path from 'path';
import { 
  handleDatabaseError, 
  ErrorCategory, 
  type ErrorResponse,
  safeJsonParse
} from '../errorUtils';

export interface ImportStatistics {
  processed: number;
  inserted: number;
  updated: number;
  errors: number;
  skipped: number;
  totalInDatabase?: number;
}

export interface ImportResult<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  statistics: ImportStatistics;
}

export abstract class BaseImporter {
  protected supabase: SupabaseClient | null = null;
  protected startTime: Date | null = null;
  protected statistics: ImportStatistics = {
    processed: 0,
    inserted: 0,
    updated: 0,
    errors: 0,
    skipped: 0
  };
  protected dataSourceId: number;
  protected tableName: string;
  protected backupDirPath: string;

  /**
   * Create a new importer
   * @param dataSourceId The ID of the data source in the database
   * @param tableName The name of the table to import data into
   * @param backupDirName The name of the backup directory (under data/backups/)
   */
  constructor(dataSourceId: number, tableName: string, backupDirName: string) {
    this.dataSourceId = dataSourceId;
    this.tableName = tableName;
    this.backupDirPath = path.join(process.cwd(), 'data', 'backups', backupDirName);
  }

  /**
   * Main import method to be called externally
   */
  public async import<T = any>(): Promise<ImportResult<T>> {
    this.startTime = new Date();
    console.log(`Import started at ${this.startTime.toISOString()}`);

    try {
      // Initialize database connection
      await this.initializeSupabase();

      // Run the import process
      const result = await this.executeImport();

      // Log results
      await this.logImportResults();

      console.log('\nImport completed successfully!');
      
      return {
        success: true,
        data: result,
        statistics: this.statistics
      };
    } catch (error: any) {
      console.error('Import failed:', error);
      
      const errorResponse = this.createErrorResponse(error);
      
      // Try to log the error to the database
      if (this.supabase) {
        try {
          await this.supabase
            .from('data_ingestion_logs')
            .insert({
              data_source_id: this.dataSourceId,
              started_at: this.startTime?.toISOString(),
              completed_at: new Date().toISOString(),
              status: 'failed',
              error_message: errorResponse.message || 'Unknown error'
            });
        } catch (logError) {
          console.error('Could not log import error to database:', logError);
        }
      }
      
      return {
        success: false,
        error: errorResponse,
        statistics: this.statistics
      };
    }
  }

  /**
   * Create a standardized error response
   */
  private createErrorResponse(error: any): ErrorResponse {
    if (error.category && typeof error.message === 'string') {
      // If it's already our error format, return it
      return error as ErrorResponse;
    }
    
    // Otherwise, create a new error response
    return {
      message: error.message || 'Unknown import error',
      category: ErrorCategory.IMPORT,
      originalError: error
    };
  }

  /**
   * Initialize Supabase client
   */
  protected async initializeSupabase(): Promise<void> {
    console.log('Initializing Supabase client...');
    
    // Use the supabase client from lib/supabase.ts directly
    this.supabase = supabase;
    
    // Verify connection
    try {
      // @ts-ignore: TypeScript has issues with Supabase's method chaining
      const { error } = await this.supabase.from(this.tableName).select('id', { count: 'exact', head: true });
      
      if (error) {
        throw handleDatabaseError(error, 'connect', this.tableName);
      }
    } catch (error: any) {
      throw {
        message: `Failed to initialize Supabase client: ${error.message}`,
        category: ErrorCategory.DATABASE,
        originalError: error
      };
    }
    
    console.log('Supabase client initialized successfully');
  }

  /**
   * Save data to JSON file as backup
   * @param data The data to backup
   * @param backupType Optional prefix for the backup file name
   */
  protected async saveBackup(data: any[], backupType = 'import'): Promise<string | null> {
    console.log('Saving backup data...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Create backup directory if it doesn't exist
      await fs.mkdir(this.backupDirPath, { recursive: true });
      
      // Create backup file path
      const backupPath = path.join(
        this.backupDirPath, 
        `${backupType}-${this.tableName}-${timestamp}.json`
      );
      
      // Write backup file
      await fs.writeFile(
        backupPath,
        JSON.stringify(data, null, 2)
      );
      
      console.log(`Backup saved to ${backupPath}`);
      return backupPath;
    } catch (error: any) {
      console.warn('Warning: Could not save backup file:', error.message);
      return null;
    }
  }

  /**
   * Insert/update records in batches
   * @param data The records to insert/update
   * @param batchSize The number of records per batch
   * @param conflictField The field to use for conflict resolution
   */
  protected async batchUpsert(
    data: any[], 
    batchSize = 50, 
    conflictField = 'id'
  ): Promise<void> {
    if (!this.supabase) {
      throw {
        message: 'Supabase client not initialized',
        category: ErrorCategory.DATABASE
      };
    }

    console.log(`Upserting ${data.length} records to ${this.tableName} table...`);
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(data.length / batchSize);
      
      console.log(`Upserting batch ${batchNum}/${totalBatches} (${batch.length} records)...`);
      
      try {
        // @ts-ignore: TypeScript has issues with Supabase's method chaining
        const { data: result, error, count } = await this.supabase
          .from(this.tableName)
          .upsert(batch, { 
            onConflict: conflictField,
            count: 'exact'
          });
        
        if (error) {
          console.error(`Error upserting batch ${batchNum}:`, error);
          this.statistics.errors++;
          this.statistics.skipped += batch.length;
        } else {
          // Count successful operations
          this.statistics.inserted += count || batch.length;
        }
      } catch (error) {
        console.error(`Error upserting batch ${batchNum}:`, error);
        this.statistics.errors++;
        this.statistics.skipped += batch.length;
      }
    }
    
    // Get final count of records in the table
    try {
      // @ts-ignore: TypeScript has issues with Supabase's method chaining
      const { count, error } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        this.statistics.totalInDatabase = count;
      }
    } catch (error) {
      console.warn(`Could not get final count from ${this.tableName} table:`, error);
    }
  }

  /**
   * Log import results to the console and database
   */
  protected async logImportResults(): Promise<void> {
    if (!this.supabase || !this.startTime) {
      throw {
        message: 'Import not properly initialized',
        category: ErrorCategory.IMPORT
      };
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - this.startTime.getTime()) / 1000;
    const { processed, inserted, updated, errors, skipped, totalInDatabase } = this.statistics;
    
    console.log('\nImport summary:');
    console.log(`- Time taken: ${duration.toFixed(2)} seconds`);
    console.log(`- Records processed: ${processed}`);
    console.log(`- Database operations: ${inserted} inserted, ${updated} updated, ${errors} errors, ${skipped} skipped`);
    
    if (totalInDatabase !== undefined) {
      console.log(`- Total records in database: ${totalInDatabase}`);
    }
    
    // Log to data_ingestion_logs table
    try {
      // @ts-ignore: TypeScript has issues with Supabase's method chaining
      const { error: logError } = await this.supabase
        .from('data_ingestion_logs')
        .insert({
          data_source_id: this.dataSourceId,
          started_at: this.startTime.toISOString(),
          completed_at: endTime.toISOString(),
          status: errors > 0 ? 'completed_with_errors' : 'completed',
          records_processed: processed,
          records_added: inserted,
          records_updated: updated,
          records_skipped: skipped,
          error_message: errors > 0 ? `${errors} batches had errors` : null
        });
        
      if (logError) {
        console.error('Error logging import:', logError);
      }
    } catch (logError) {
      console.error('Error logging import:', logError);
    }
  }

  /**
   * Execute the import process (to be implemented by subclasses)
   */
  protected abstract executeImport(): Promise<any>;
} 