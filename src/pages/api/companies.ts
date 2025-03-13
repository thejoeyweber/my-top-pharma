import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { FMPClient } from '../../lib/fmpClient';

export const GET: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const fmpApiKey = import.meta.env.PUBLIC_FMP_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({
      error: 'Missing Supabase configuration'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!fmpApiKey) {
    return new Response(JSON.stringify({
      error: 'Missing FMP API key'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const fmp = new FMPClient({
      apiKey: fmpApiKey,
      baseUrl: 'https://financialmodelingprep.com/stable'
    });

    // Check if we should fetch from FMP or use cached data
    const { data: cachedCompanies } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    // If we have cached data and it's less than 24 hours old, use it
    if (cachedCompanies && cachedCompanies.length > 0) {
      const lastUpdated = new Date(cachedCompanies[0].updated_at);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate < 24) {
        return new Response(JSON.stringify({
          companies: cachedCompanies,
          source: 'cache'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Fetch fresh data from FMP
    const companies = await fmp.getPharmaCompanies();
    
    if (!companies || companies.length === 0) {
      return new Response(JSON.stringify({
        error: 'No companies found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get detailed profiles for the companies
    const profiles = await fmp.getCompanyProfiles(
      companies.slice(0, 25).map(c => c.symbol) // Limit to 25 for rate limiting
    );

    // Return the data
    return new Response(JSON.stringify({
      companies: profiles,
      source: 'fmp',
      rateLimit: fmp.getRateLimitStatus()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch companies'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 