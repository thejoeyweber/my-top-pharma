-- Add slug column to websites table
ALTER TABLE websites 
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create a unique index to ensure slug uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_websites_slug ON websites(slug);

-- Create a trigger to auto-generate slugs from domain if not provided
CREATE OR REPLACE FUNCTION generate_website_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.domain, '[^a-zA-Z0-9]', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_slug_trigger
BEFORE INSERT OR UPDATE ON websites
FOR EACH ROW
EXECUTE FUNCTION generate_website_slug();

-- Update existing records to have slugs based on domain if missing
UPDATE websites
SET slug = LOWER(REGEXP_REPLACE(domain, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL OR slug = ''; 