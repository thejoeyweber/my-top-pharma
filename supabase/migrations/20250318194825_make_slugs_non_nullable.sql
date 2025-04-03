-- This migration has been modified to handle the case where the column doesn't exist

-- Add the column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'slug') THEN
    ALTER TABLE websites ADD COLUMN slug character varying;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'slug') THEN
    ALTER TABLE products ADD COLUMN slug character varying;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'slug') THEN
    ALTER TABLE companies ADD COLUMN slug character varying;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns 
    WHERE table_name = 'therapeutic_areas' AND column_name = 'slug') THEN
    ALTER TABLE therapeutic_areas ADD COLUMN slug character varying;
  END IF;
END $$;

-- Now set values for websites
UPDATE websites
SET slug = LOWER(REGEXP_REPLACE(domain, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL AND domain IS NOT NULL;

-- Now set values for products
UPDATE products
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL AND name IS NOT NULL;

-- Now set values for companies
UPDATE companies
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL AND name IS NOT NULL;

-- Now set values for therapeutic_areas
UPDATE therapeutic_areas
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL AND name IS NOT NULL;

-- Now make them non-nullable if they have values
ALTER TABLE websites ALTER COLUMN slug SET NOT NULL;
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;
ALTER TABLE therapeutic_areas ALTER COLUMN slug SET NOT NULL;
ALTER TABLE companies ALTER COLUMN slug SET NOT NULL;

-- Add unique constraints to slug fields
ALTER TABLE companies 
  ADD CONSTRAINT companies_slug_unique UNIQUE (slug);

ALTER TABLE products 
  ADD CONSTRAINT products_slug_unique UNIQUE (slug);

ALTER TABLE therapeutic_areas 
  ADD CONSTRAINT therapeutic_areas_slug_unique UNIQUE (slug);

-- Create indexes for faster lookups on slug fields
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_therapeutic_areas_slug ON therapeutic_areas (slug);
