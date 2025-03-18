-- Make slug fields non-nullable and add unique constraints

-- First, ensure any NULL slug fields are populated with generated slugs
UPDATE companies
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

UPDATE products
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

UPDATE therapeutic_areas
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

UPDATE websites
SET slug = LOWER(REGEXP_REPLACE(domain, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

-- Add unique constraints to slug fields
ALTER TABLE companies 
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT companies_slug_unique UNIQUE (slug);

ALTER TABLE products 
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT products_slug_unique UNIQUE (slug);

ALTER TABLE therapeutic_areas 
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT therapeutic_areas_slug_unique UNIQUE (slug);

ALTER TABLE websites 
  ALTER COLUMN slug SET NOT NULL,
  ADD CONSTRAINT websites_slug_unique UNIQUE (slug);

-- Create indexes for faster lookups on slug fields
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_therapeutic_areas_slug ON therapeutic_areas (slug);
CREATE INDEX IF NOT EXISTS idx_websites_slug ON websites (slug);
