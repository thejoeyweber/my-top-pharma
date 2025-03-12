/**
 * Simple FMP API Integration Test
 * 
 * Tests the connection to Financial Modeling Prep API
 * and fetches pharmaceutical and biotechnology companies
 */

// Get the API key from environment
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.PUBLIC_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Define industry sectors to query
const industries = [
  'Biotechnology',
  'Drug Manufacturers—General',
  'Drug Manufacturers—Specialty & Generic'
];

async function testFMPConnection() {
  console.log('Testing connection to Financial Modeling Prep API...');
  
  if (!API_KEY) {
    console.error('Error: FMP API key not found in environment variables');
    process.exit(1);
  }
  
  // Track unique companies
  const uniqueCompanies = new Map();
  
  // Fetch companies from each industry
  for (const industry of industries) {
    console.log(`Fetching ${industry} companies...`);
    
    try {
      const url = `${BASE_URL}/stock-screener?sector=Healthcare&industry=${encodeURIComponent(industry)}&isActivelyTrading=true&apikey=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn(`Error fetching ${industry} companies: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const companies = await response.json();
      
      if (!companies || !Array.isArray(companies)) {
        console.warn(`Invalid response for ${industry}`);
        continue;
      }
      
      console.log(`Found ${companies.length} ${industry} companies`);
      
      // Store unique companies
      for (const company of companies) {
        if (!uniqueCompanies.has(company.symbol)) {
          uniqueCompanies.set(company.symbol, {
            symbol: company.symbol,
            name: company.companyName,
            industry: industry,
            exchange: company.exchange,
            marketCap: company.marketCap
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching ${industry} companies:`, error);
    }
  }
  
  console.log(`Found ${uniqueCompanies.size} unique pharmaceutical companies`);
  
  // Display first 10 companies as a sample
  const sampleCompanies = Array.from(uniqueCompanies.values()).slice(0, 10);
  console.log('\nSample of pharmaceutical companies:');
  
  sampleCompanies.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name} (${company.symbol}) - ${company.exchange} - ${company.industry}`);
  });
  
  console.log('\nTest completed successfully!');
}

// Run the test
testFMPConnection().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
}); 