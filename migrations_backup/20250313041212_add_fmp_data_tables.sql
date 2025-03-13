-- Create data_sources table
CREATE TABLE IF NOT EXISTS "public"."data_sources" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "base_url" TEXT NOT NULL,
    "auth_type" TEXT NOT NULL,
    "auth_key" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create data_source_endpoints table
CREATE TABLE IF NOT EXISTS "public"."data_source_endpoints" (
    "id" SERIAL PRIMARY KEY,
    "data_source_id" INTEGER NOT NULL REFERENCES "public"."data_sources"("id"),
    "name" TEXT NOT NULL,
    "endpoint_path" TEXT NOT NULL,
    "description" TEXT,
    "target_table" TEXT,
    "field_mapping" JSONB,
    "configuration" JSONB,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("data_source_id", "name")
);

-- Create company_financials table
CREATE TABLE IF NOT EXISTS "public"."company_financials" (
    "id" SERIAL PRIMARY KEY,
    "company_id" INTEGER NOT NULL REFERENCES "public"."companies"("id"),
    "period" TEXT NOT NULL,
    "fiscal_date" DATE NOT NULL,
    "revenue" BIGINT,
    "cost_of_revenue" BIGINT,
    "gross_profit" BIGINT,
    "r_and_d_expenses" BIGINT,
    "sga_expense" BIGINT,
    "operating_expenses" BIGINT,
    "operating_income" BIGINT,
    "ebitda" BIGINT,
    "net_income" BIGINT,
    "eps" NUMERIC,
    "cash_and_equivalents" BIGINT,
    "total_assets" BIGINT,
    "total_debt" BIGINT,
    "total_liabilities" BIGINT,
    "total_equity" BIGINT,
    "operating_cash_flow" BIGINT,
    "capital_expenditure" BIGINT,
    "free_cash_flow" BIGINT,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("company_id", "period", "fiscal_date")
);

-- Create company_metrics table
CREATE TABLE IF NOT EXISTS "public"."company_metrics" (
    "id" SERIAL PRIMARY KEY,
    "company_id" INTEGER NOT NULL REFERENCES "public"."companies"("id"),
    "date" DATE NOT NULL,
    "market_cap" BIGINT,
    "pe_ratio" NUMERIC,
    "price_to_sales" NUMERIC,
    "price_to_book" NUMERIC,
    "enterprise_value" BIGINT,
    "ev_to_revenue" NUMERIC,
    "ev_to_ebitda" NUMERIC,
    "dividend_yield" NUMERIC,
    "debt_to_equity" NUMERIC,
    "profit_margin" NUMERIC,
    "roe" NUMERIC,
    "roa" NUMERIC,
    "current_ratio" NUMERIC,
    "quick_ratio" NUMERIC,
    "cash_ratio" NUMERIC,
    "debt_ratio" NUMERIC,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("company_id", "date")
);

-- Create company_stock_data table
CREATE TABLE IF NOT EXISTS "public"."company_stock_data" (
    "id" SERIAL PRIMARY KEY,
    "company_id" INTEGER NOT NULL REFERENCES "public"."companies"("id"),
    "date" DATE NOT NULL,
    "open" NUMERIC,
    "high" NUMERIC,
    "low" NUMERIC,
    "close" NUMERIC,
    "adjusted_close" NUMERIC,
    "volume" BIGINT,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("company_id", "date")
);

-- Create data_ingestion_logs table
CREATE TABLE IF NOT EXISTS "public"."data_ingestion_logs" (
    "id" SERIAL PRIMARY KEY,
    "data_source_id" INTEGER NOT NULL REFERENCES "public"."data_sources"("id"),
    "endpoint_id" INTEGER NOT NULL REFERENCES "public"."data_source_endpoints"("id"),
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "completed_at" TIMESTAMPTZ,
    "status" TEXT NOT NULL,
    "records_processed" INTEGER DEFAULT 0,
    "records_added" INTEGER DEFAULT 0,
    "records_updated" INTEGER DEFAULT 0,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("endpoint_id", "started_at")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_companies_ticker" ON "public"."companies" ("stock_symbol");
CREATE INDEX IF NOT EXISTS "idx_company_financials_company_id" ON "public"."company_financials" ("company_id");
CREATE INDEX IF NOT EXISTS "idx_company_metrics_company_id" ON "public"."company_metrics" ("company_id");
CREATE INDEX IF NOT EXISTS "idx_company_stock_data_company_id" ON "public"."company_stock_data" ("company_id");
CREATE INDEX IF NOT EXISTS "idx_data_source_endpoints_data_source_id" ON "public"."data_source_endpoints" ("data_source_id");

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER "update_data_sources_updated_at"
BEFORE UPDATE ON "public"."data_sources"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE TRIGGER "update_data_source_endpoints_updated_at"
BEFORE UPDATE ON "public"."data_source_endpoints"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE TRIGGER "update_company_financials_updated_at"
BEFORE UPDATE ON "public"."company_financials"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE TRIGGER "update_company_metrics_updated_at"
BEFORE UPDATE ON "public"."company_metrics"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE TRIGGER "update_company_stock_data_updated_at"
BEFORE UPDATE ON "public"."company_stock_data"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

CREATE TRIGGER "update_data_ingestion_logs_updated_at"
BEFORE UPDATE ON "public"."data_ingestion_logs"
FOR EACH ROW
EXECUTE FUNCTION "public"."trigger_set_timestamp"();

-- Add RLS policies
ALTER TABLE "public"."company_financials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."company_metrics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."company_stock_data" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."data_sources" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."data_source_endpoints" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."data_ingestion_logs" ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access to company_financials"
ON "public"."company_financials"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to company_metrics"
ON "public"."company_metrics"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to company_stock_data"
ON "public"."company_stock_data"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to data_sources"
ON "public"."data_sources"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to data_source_endpoints"
ON "public"."data_source_endpoints"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to data_ingestion_logs"
ON "public"."data_ingestion_logs"
FOR SELECT
TO public
USING (true);

-- Auth policies for data management
CREATE POLICY "Allow authenticated users to insert data_sources"
ON "public"."data_sources"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update data_sources"
ON "public"."data_sources"
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert data_source_endpoints"
ON "public"."data_source_endpoints"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update data_source_endpoints"
ON "public"."data_source_endpoints"
FOR UPDATE
TO authenticated
USING (true);

-- Add FMP as a data source
INSERT INTO public.data_sources (name, description, base_url, auth_type, auth_key, is_active)
VALUES (
  'Financial Modeling Prep',
  'Financial data provider offering company profiles, financials, and stock data',
  'https://financialmodelingprep.com/api/v3',
  'api_key',
  NULL,
  true
);

-- Add FMP endpoints
INSERT INTO public.data_source_endpoints (data_source_id, name, endpoint_path, description, target_table, field_mapping, configuration)
VALUES
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Company Profile',
    '/profile/{ticker}',
    'Get basic company information and metrics',
    'companies',
    '{
      "name": "companyName",
      "ticker": "symbol",
      "sector": "sector",
      "industry": "industry",
      "market_cap": "mktCap",
      "website": "website",
      "description": "description",
      "ceo": "ceo",
      "headquarters": "country"
    }',
    '{
      "batch_support": true,
      "max_items_per_batch": 10,
      "batch_endpoint": "/profile/{ticker1},{ticker2},{ticker3}"
    }'
  ),
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Income Statement',
    '/income-statement/{ticker}?period=annual&limit=5',
    'Annual income statements for companies',
    'company_financials',
    '{
      "fiscal_date": "date",
      "period": "period",
      "revenue": "revenue",
      "cost_of_revenue": "costOfRevenue",
      "gross_profit": "grossProfit",
      "r_and_d_expenses": "researchAndDevelopmentExpenses",
      "sga_expense": "sellingGeneralAndAdministrativeExpenses",
      "operating_expenses": "operatingExpenses",
      "operating_income": "operatingIncome",
      "ebitda": "ebitda",
      "net_income": "netIncome",
      "eps": "eps"
    }',
    '{
      "company_id_field": "ticker",
      "period_value": "annual",
      "limit": 5
    }'
  ),
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Balance Sheet',
    '/balance-sheet-statement/{ticker}?period=annual&limit=5',
    'Annual balance sheets for companies',
    'company_financials',
    '{
      "fiscal_date": "date", 
      "period": "period",
      "cash_and_equivalents": "cashAndCashEquivalents",
      "total_assets": "totalAssets",
      "total_debt": "totalDebt",
      "total_liabilities": "totalLiabilities",
      "total_equity": "totalStockholdersEquity"
    }',
    '{
      "company_id_field": "ticker",
      "period_value": "annual",
      "limit": 5,
      "merge_key": ["ticker", "date", "period"]
    }'
  ),
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Cash Flow',
    '/cash-flow-statement/{ticker}?period=annual&limit=5',
    'Annual cash flow statements for companies',
    'company_financials',
    '{
      "fiscal_date": "date",
      "period": "period",
      "operating_cash_flow": "operatingCashFlow",
      "capital_expenditure": "capitalExpenditure",
      "free_cash_flow": "freeCashFlow"
    }',
    '{
      "company_id_field": "ticker",
      "period_value": "annual",
      "limit": 5,
      "merge_key": ["ticker", "date", "period"]
    }'
  ),
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Key Metrics',
    '/key-metrics/{ticker}?period=annual&limit=5',
    'Annual key financial metrics for companies',
    'company_metrics',
    '{
      "date": "date",
      "pe_ratio": "peRatio",
      "price_to_sales": "priceToSalesRatio",
      "price_to_book": "pbRatio",
      "enterprise_value": "enterpriseValue",
      "ev_to_revenue": "evToSales",
      "ev_to_ebitda": "evToEBITDA",
      "dividend_yield": "dividendYield",
      "debt_to_equity": "debtToEquity",
      "profit_margin": "netProfitMargin",
      "roe": "returnOnEquity",
      "roa": "returnOnAssets",
      "current_ratio": "currentRatio",
      "quick_ratio": "quickRatio",
      "cash_ratio": "cashRatio",
      "debt_ratio": "debtRatio"
    }',
    '{
      "company_id_field": "ticker",
      "period_value": "annual",
      "limit": 5
    }'
  ),
  (
    (SELECT id FROM public.data_sources WHERE name = 'Financial Modeling Prep'),
    'Historical Stock Prices',
    '/historical-price-full/{ticker}?serietype=line',
    'Daily stock prices with OHLCV data',
    'company_stock_data',
    '{
      "date": "date",
      "open": "open",
      "high": "high",
      "low": "low",
      "close": "close",
      "adjusted_close": "adjClose",
      "volume": "volume"
    }',
    '{
      "company_id_field": "ticker",
      "historical_array_field": "historical",
      "limit_days": 365
    }'
  );