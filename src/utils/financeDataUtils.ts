/**
 * Finance Data Utilities
 * 
 * Adapter functions to fetch company financial data from either mock JSON or database
 * based on feature flags, following the phased migration strategy.
 */
import { companyFinancials as mockFinancials, companyMetrics as mockMetrics, companyStockData as mockStockData } from './dataUtils';
import { supabase } from './supabase';
import { getFeatureFlag, FEATURES } from './featureFlags';

/**
 * Get financial data for a company
 * 
 * @param companyId The ID of the company
 * @param period 'annual' or 'quarterly'
 * @param useDatabase Whether to use the database or mock data
 * @returns An array of financial records for the company
 */
export async function getCompanyFinancials(
  companyId: number, 
  period: 'annual' | 'quarterly' = 'annual',
  useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_FINANCIALS)
) {
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('company_financials')
        .select('*')
        .eq('company_id', companyId)
        .eq('period', period)
        .order('fiscal_date', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database fetch failed for company financials, falling back to mock data:', error);
      return getMockCompanyFinancials(companyId, period);
    }
  }
  return getMockCompanyFinancials(companyId, period);
}

/**
 * Get metric data for a company
 * 
 * @param companyId The ID of the company
 * @param useDatabase Whether to use the database or mock data
 * @returns An array of metric records for the company
 */
export async function getCompanyMetrics(
  companyId: number,
  useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_METRICS)
) {
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('company_metrics')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database fetch failed for company metrics, falling back to mock data:', error);
      return getMockCompanyMetrics(companyId);
    }
  }
  return getMockCompanyMetrics(companyId);
}

/**
 * Get stock price data for a company
 * 
 * @param companyId The ID of the company
 * @param days Number of days of data to return (defaults to 30)
 * @param useDatabase Whether to use the database or mock data
 * @returns An array of stock price records for the company
 */
export async function getCompanyStockData(
  companyId: number,
  days = 30,
  useDatabase = getFeatureFlag(FEATURES.USE_DATABASE_COMPANY_STOCK_DATA)
) {
  if (useDatabase) {
    try {
      const { data, error } = await supabase
        .from('company_stock_data')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false })
        .limit(days);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database fetch failed for company stock data, falling back to mock data:', error);
      return getMockCompanyStockData(companyId, days);
    }
  }
  return getMockCompanyStockData(companyId, days);
}

/**
 * Get mock financial data for a company
 * 
 * @param companyId The ID of the company
 * @param period 'annual' or 'quarterly'
 * @returns An array of financial records for the company
 */
function getMockCompanyFinancials(companyId: number, period: string) {
  return mockFinancials.filter(record => 
    record.company_id === companyId && 
    record.period === period
  ).sort((a, b) => 
    new Date(b.fiscal_date).getTime() - new Date(a.fiscal_date).getTime()
  );
}

/**
 * Get mock metric data for a company
 * 
 * @param companyId The ID of the company
 * @returns An array of metric records for the company
 */
function getMockCompanyMetrics(companyId: number) {
  return mockMetrics.filter(record => 
    record.company_id === companyId
  ).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get mock stock price data for a company
 * 
 * @param companyId The ID of the company
 * @param days Number of days of data to return
 * @returns An array of stock price records for the company
 */
function getMockCompanyStockData(companyId: number, days: number) {
  return mockStockData.filter(record => 
    record.company_id === companyId
  ).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, days);
} 