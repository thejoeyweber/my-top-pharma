/**
 * FMP API Connection Test (Stable API)
 * 
 * Tests connection to the Financial Modeling Prep stable API endpoints
 * with rate limit awareness and minimal API usage.
 * 
 * Usage:
 *   node scripts/test-fmp-connection.js
 */

import 'dotenv/config';
import { FMPClient } from '../src/lib/fmpClient.js';

// Check if API key is set
if (!process.env.PUBLIC_FMP_API_KEY) {
  console.error('❌ Error: PUBLIC_FMP_API_KEY is not set in .env file');
  console.log('Please add your FMP API key to the .env file:');
  console.log('PUBLIC_FMP_API_KEY=your-fmp-api-key');
  process.exit(1);
}

async function testConnection() {
  console.log('🔍 Testing connection to Financial Modeling Prep Stable API...');
  
  try {
    // Create FMP client
    const fmpClient = new FMPClient({
      apiKey: process.env.PUBLIC_FMP_API_KEY,
      baseUrl: 'https://financialmodelingprep.com/stable'
    });
    
    // Test screener endpoint with limit
    console.log('📊 Testing company screener endpoint...');
    const companies = await fmpClient.getPharmaCompanies();
    
    if (!companies || companies.length === 0) {
      console.warn('⚠️ Warning: No pharmaceutical companies found');
    } else {
      console.log(`✅ Successfully fetched ${companies.length} pharmaceutical companies`);
      console.log('📋 First 3 companies:');
      companies.slice(0, 3).forEach(company => {
        console.log(`   - ${company.companyName} (${company.symbol})`);
      });
      
      // Get rate limit status
      const rateLimit = fmpClient.getRateLimitStatus();
      console.log('\n📈 Rate limit status:');
      console.log(`   - Remaining calls: ${rateLimit.remaining}`);
      console.log(`   - Reset time: ${new Date(rateLimit.reset).toLocaleString()}`);
      
      // Test bulk profile endpoint with just 2 companies
      if (companies.length >= 2) {
        const testTickers = companies.slice(0, 2).map(c => c.symbol);
        console.log(`\n📈 Testing bulk profile endpoint for ${testTickers.join(', ')}...`);
        
        const profiles = await fmpClient.getCompanyProfiles(testTickers);
        
        if (!profiles || profiles.length === 0) {
          console.warn('⚠️ Warning: No profiles found');
        } else {
          console.log(`✅ Successfully fetched ${profiles.length} company profiles`);
          profiles.forEach(profile => {
            console.log('\n📋 Profile details:');
            console.log(`   - Company: ${profile.companyName}`);
            console.log(`   - Symbol: ${profile.symbol}`);
            console.log(`   - Exchange: ${profile.exchange}`);
            console.log(`   - Industry: ${profile.industry}`);
            console.log(`   - Market Cap: ${profile.mktCap}`);
          });
        }
        
        // Show updated rate limit
        const finalRateLimit = fmpClient.getRateLimitStatus();
        console.log('\n📈 Final rate limit status:');
        console.log(`   - Remaining calls: ${finalRateLimit.remaining}`);
        console.log(`   - Reset time: ${new Date(finalRateLimit.reset).toLocaleString()}`);
      }
    }
    
    console.log('\n🎉 FMP API connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing FMP API connection:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testConnection(); 