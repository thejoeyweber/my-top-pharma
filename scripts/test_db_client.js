/**
 * Test Database Client
 * 
 * This script tests the database client by querying the companies table.
 */

// Import the database client
import { client } from '../src/db/client.js';

// Test the database client
async function testDatabaseClient() {
  console.log('Testing database client...');
  
  try {
    // Test the query method
    console.log('Testing query method...');
    const companies = await client.query(
      "SELECT company_id, name, ticker_symbol FROM companies ORDER BY name LIMIT 5"
    );
    
    console.log('Query result:');
    console.log(companies);
    
    // Test the count method
    console.log('\nTesting count method...');
    const count = await client.count('companies');
    console.log(`Companies count: ${count}`);
    
    // Test the getById method
    console.log('\nTesting getById method...');
    if (companies.length > 0) {
      const company = await client.getById('companies', 'company_id', companies[0].company_id);
      console.log('Company by ID:');
      console.log(company);
    } else {
      console.log('No companies found to test getById method');
    }
    
    console.log('\nDatabase client test completed successfully!');
  } catch (error) {
    console.error('Error testing database client:', error);
  }
}

// Run the test
testDatabaseClient(); 