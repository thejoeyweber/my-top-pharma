-- Migration: add_fmp_data_source
-- Description: Adds the FMP data source and its endpoints
-- Author: Claude 3.7 Sonnet
-- Date: 2025-04-02

-- Forward Migration
BEGIN;

-- Insert Financial Modeling Prep (FMP) as a data source
INSERT INTO public.data_sources (name, description, base_url, auth_type, is_active)
VALUES (
    'Financial Modeling Prep',
    'Financial data API providing company profiles, financial statements, and market data for publicly traded companies',
    'https://financialmodelingprep.com/api/v3',
    'api_key',
    true
)
ON CONFLICT (name) DO NOTHING;

-- Get the ID of the FMP data source
WITH fmp_id AS (
    SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'
)

-- Insert endpoints for FMP
INSERT INTO public.data_source_endpoints (
    data_source_id, 
    name, 
    endpoint_path, 
    description,
    is_active,
    target_table,
    field_mapping,
    configuration
)
VALUES
-- Company Profile endpoint
(
    (SELECT id FROM fmp_id),
    'Company Profiles',
    '/profile/{ticker}',
    'Basic company information including sector, industry, market cap, and more',
    true,
    'companies',
    '{
        "name": "companyName",
        "ticker": "symbol",
        "stock_symbol": "symbol",
        "cik": "cik",
        "isin": "isin",
        "market_cap": "mktCap",
        "industry": "industry",
        "sector": "sector",
        "full_time_employees": "fullTimeEmployees",
        "website": "website",
        "description": "description",
        "ceo": "ceo",
        "exchange": "exchange",
        "ipo": "ipoDate"
    }',
    '{
        "batch_supported": true,
        "batch_url": "/profile/{ticker1},{ticker2},...",
        "max_batch_size": 25,
        "frequency": "daily",
        "parameters": {}
    }'
),
-- Income Statement endpoint
(
    (SELECT id FROM fmp_id),
    'Income Statements',
    '/income-statement/{ticker}',
    'Annual and quarterly income statements with revenue, expenses, and profit metrics',
    false,
    'company_financials',
    '{
        "company_id": "@@lookup:companies:ticker",
        "period": "@@param:period",
        "fiscal_date": "date",
        "revenue": "revenue",
        "gross_profit": "grossProfit",
        "r_and_d_expense": "researchAndDevelopmentExpenses",
        "net_income": "netIncome",
        "ebitda": "ebitda",
        "eps": "eps"
    }',
    '{
        "batch_supported": false,
        "frequency": "quarterly",
        "parameters": {
            "period": ["annual", "quarter"],
            "limit": 20
        }
    }'
),
-- Key Metrics endpoint
(
    (SELECT id FROM fmp_id),
    'Key Metrics',
    '/key-metrics/{ticker}',
    'Financial ratios and metrics like PE ratio, ROE, and more',
    false,
    'company_metrics',
    '{
        "company_id": "@@lookup:companies:ticker",
        "date": "date",
        "pe_ratio": "peRatio",
        "pb_ratio": "pbRatio",
        "price_to_sales": "priceToSalesRatio",
        "debt_to_equity": "debtToEquity",
        "roe": "roe",
        "roa": "roa",
        "current_ratio": "currentRatio",
        "quick_ratio": "quickRatio",
        "dividend_yield": "dividendYield"
    }',
    '{
        "batch_supported": false,
        "frequency": "quarterly",
        "parameters": {
            "period": ["annual", "quarter"],
            "limit": 10
        }
    }'
),
-- Historical Stock Prices endpoint
(
    (SELECT id FROM fmp_id),
    'Historical Stock Prices',
    '/historical-price-full/{ticker}',
    'Daily historical stock prices including open, high, low, close, and volume',
    false,
    'company_stock_data',
    '{
        "company_id": "@@lookup:companies:ticker",
        "date": "date",
        "open": "open",
        "high": "high",
        "low": "low",
        "close": "close",
        "adjusted_close": "adjClose",
        "volume": "volume"
    }',
    '{
        "batch_supported": true,
        "batch_url": "/historical-price-full/{ticker1},{ticker2},...",
        "max_batch_size": 10,
        "frequency": "daily",
        "parameters": {
            "from": "YYYY-MM-DD",
            "to": "YYYY-MM-DD",
            "timeseries": 30
        }
    }'
)
ON CONFLICT (data_source_id, name) DO NOTHING;

COMMIT;

-- Rollback Migration
-- BEGIN;
-- DELETE FROM public.data_source_endpoints WHERE data_source_id = (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep');
-- DELETE FROM public.data_sources WHERE name = 'Financial Modeling Prep';
-- COMMIT; 