/**
 * Database Client Utility
 * 
 * This module provides a simple client for interacting with the PostgreSQL database.
 * It uses child_process to execute commands inside the Docker container.
 */

import { execSync } from 'child_process';

/**
 * Execute a SQL query inside the PostgreSQL Docker container
 * 
 * @param {string} query - SQL query to execute
 * @param {Object} options - Query options
 * @param {boolean} options.returnRaw - Whether to return raw output (default: false)
 * @param {string} options.format - Output format (default: 'csv')
 * @returns {Array|string} - Query results as array of objects or raw string
 */
export async function executeQuery(query, options = {}) {
  const { returnRaw = false, format = 'csv' } = options;
  
  try {
    // Escape single quotes in the query
    const escapedQuery = query.replace(/'/g, "''");
    
    // Build the command
    let command = `docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma`;
    
    // Add format option if needed
    if (format === 'csv') {
      command += ` -c "COPY (${escapedQuery}) TO STDOUT WITH CSV HEADER"`;
    } else {
      command += ` -c '${escapedQuery}'`;
    }
    
    // Execute the command
    const output = execSync(command).toString();
    
    // Return raw output if requested
    if (returnRaw) {
      return output;
    }
    
    // Parse CSV output
    if (format === 'csv') {
      const lines = output.trim().split('\n');
      if (lines.length < 2) {
        return [];
      }
      
      const headers = lines[0].split(',');
      const results = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j];
        }
        
        results.push(row);
      }
      
      return results;
    }
    
    // Return raw output for other formats
    return output;
  } catch (error) {
    console.error('Database query error:', error);
    return returnRaw ? '' : [];
  }
}

/**
 * Client object with methods for common database operations
 */
export const client = {
  /**
   * Execute a SQL query and return results
   * 
   * @param {string} query - SQL query to execute
   * @param {Object} options - Query options
   * @returns {Array} - Query results as array of objects
   */
  query: async (query, options = {}) => {
    return executeQuery(query, options);
  },
  
  /**
   * Get all rows from a table
   * 
   * @param {string} table - Table name
   * @param {string} orderBy - Order by clause
   * @param {number} limit - Maximum number of rows to return
   * @returns {Array} - Table rows as array of objects
   */
  getAll: async (table, orderBy = 'id', limit = 100) => {
    const query = `SELECT * FROM ${table} ORDER BY ${orderBy} LIMIT ${limit}`;
    return executeQuery(query);
  },
  
  /**
   * Get a single row by ID
   * 
   * @param {string} table - Table name
   * @param {string} idField - ID field name
   * @param {number|string} id - ID value
   * @returns {Object|null} - Row as object or null if not found
   */
  getById: async (table, idField, id) => {
    // Use a simpler format for the query to avoid escaping issues
    const query = `SELECT * FROM ${table} WHERE ${idField} = ${id}`;
    const results = await executeQuery(query);
    return results.length > 0 ? results[0] : null;
  },
  
  /**
   * Count rows in a table
   * 
   * @param {string} table - Table name
   * @param {string} whereClause - WHERE clause (optional)
   * @returns {number} - Row count
   */
  count: async (table, whereClause = '') => {
    const query = `SELECT COUNT(*) FROM ${table} ${whereClause ? 'WHERE ' + whereClause : ''}`;
    const results = await executeQuery(query);
    return parseInt(results[0]?.count || '0', 10);
  }
};

export default client; 