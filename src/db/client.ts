/**
 * Database Client for Astro
 * 
 * This module provides a client for connecting to the PostgreSQL database
 * from Astro components.
 */

import { Pool } from 'pg';

// Load environment variables
const { 
  POSTGRES_HOST = 'localhost',
  POSTGRES_PORT = '5432',
  POSTGRES_DB = 'toppharma',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'password'
} = import.meta.env;

// Create a connection pool
const pool = new Pool({
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT as string),
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

// Utility to run SQL queries
export const client = {
  /**
   * Execute a SQL query
   * 
   * @param text SQL query text
   * @param params Query parameters
   * @returns Query result
   */
  async query(text: string, params?: any[]) {
    try {
      const start = Date.now();
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`Query executed in ${duration}ms: ${text}`);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  /**
   * Get a single row from a query
   * 
   * @param text SQL query text
   * @param params Query parameters 
   * @returns Single row or null
   */
  async getOne(text: string, params?: any[]) {
    const result = await this.query(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  
  /**
   * Get multiple rows from a query
   * 
   * @param text SQL query text
   * @param params Query parameters
   * @returns Array of rows
   */
  async getMany(text: string, params?: any[]) {
    const result = await this.query(text, params);
    return result.rows;
  }
};

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Handle process shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database pool closed');
});

export default client; 