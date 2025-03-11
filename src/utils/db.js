/**
 * Database client utility
 * 
 * Provides a connection to the PostgreSQL database for querying.
 * Uses Docker to ensure reliable connection to the existing 'toppharma' database.
 */

// Track whether we've logged Docker fallback message
let dockerFallbackLogged = false;

/**
 * Execute a database query with proper error handling
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} - Query result
 */
const query = async (text, params = []) => {
  try {
    // Import execSync
    const { execSync } = await import('child_process');
    
    // Log only once that we're using Docker exclusively
    if (!dockerFallbackLogged) {
      console.log('Using Docker for database queries...');
      dockerFallbackLogged = true;
    }
    
    // Format parameters for SQL command if needed
    let preparedQuery = text;
    if (params && params.length > 0) {
      // Simple parameter replacement (for basic queries)
      params.forEach((param, index) => {
        const placeholder = `$${index + 1}`;
        const paramValue = typeof param === 'string' 
          ? `'${param.replace(/'/g, "''")}'` 
          : param;
        preparedQuery = preparedQuery.replace(placeholder, paramValue);
      });
    }
    
    // Use Docker exec to run the query - using the correct database name 'toppharma'
    const dockerCmd = `docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -c "${preparedQuery.replace(/"/g, '\\"')}" -t -A`;
    const output = execSync(dockerCmd, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    
    // Parse the output
    if (output && output.trim()) {
      const rows = output.trim().split('\n').filter(row => row.trim().length > 0);
      
      // Simple column detection - works for basic queries
      const isSingleValue = !output.includes('|');
      
      // Format the output accordingly
      if (isSingleValue) {
        // For count queries or similar that return a single value
        return { 
          rows: [{ count: parseInt(output.trim()) }],
          rowCount: 1
        };
      } else {
        // For queries that return rows with multiple columns
        return {
          rowCount: rows.length,
          rows: rows.map(row => {
            const values = row.split('|');
            
            // For SELECT columns queries (like information_schema)
            if (text.toLowerCase().includes('information_schema.columns')) {
              return {
                column_name: values[0],
                data_type: values[1],
                character_maximum_length: values[2] || null
              };
            }
            
            // For SIC distribution queries
            if (text.toLowerCase().includes('group by sic')) {
              return {
                sic: values[0],
                sic_description: values[1],
                company_count: parseInt(values[2])
              };
            }
            
            // For companies table
            if (text.toLowerCase().includes('from companies')) {
              return {
                id: values[0],
                name: values[1],
                headquarters: values[2],
                cik: values[3] || null,
                ticker: values[4] || null
              };
            }
            
            // For sec_companies table
            if (text.toLowerCase().includes('from sec_companies')) {
              return {
                id: values[0],
                cik: values[1],
                name: values[2],
                ticker: values[3],
                exchange: values[4],
                sic: values[5],
                sic_description: values[6]
              };
            }
            
            // Default case - create an object with only id and name
            return { 
              id: values[0],
              name: values[1],
              // Add any other columns you expect here
            };
          })
        };
      }
    }
    
    // Empty result
    return { rows: [], rowCount: 0 };
    
  } catch (error) {
    console.error('Database query error:', error);
    return { rows: [], rowCount: 0 };
  }
};

// Export the database client interface
export const dbClient = {
  query,
  // Test connection method
  testConnection: async () => {
    try {
      const { execSync } = await import('child_process');
      try {
        // Test connection to the correct database 'toppharma'
        execSync('docker exec mytoppharma-postgres-1 psql -U postgres -d toppharma -c "SELECT 1" -t -A', { stdio: 'pipe' });
        return { connected: true, message: 'Database connection successful via Docker to toppharma database' };
      } catch (dockerError) {
        console.error('Docker connection error:', dockerError);
        return { 
          connected: false, 
          message: `Database connection failed: ${dockerError.message}`
        };
      }
    } catch (error) {
      return { 
        connected: false, 
        message: `Database connection failed: ${error.message}` 
      };
    }
  }
}; 