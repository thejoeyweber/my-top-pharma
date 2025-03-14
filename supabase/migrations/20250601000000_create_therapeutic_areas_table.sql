-- Create therapeutic_areas table
CREATE TABLE therapeutic_areas (
  id TEXT PRIMARY KEY,                -- HPTCS code (e.g., "207RO0000X")
  name TEXT NOT NULL,                 -- "Oncology", "Cardiology", etc.
  slug TEXT UNIQUE NOT NULL,          -- URL-friendly version of name
  mesh_specialty_id TEXT,             -- Related MeSH specialty code 
  mesh_disease_id TEXT,               -- Related MeSH disease category
  description TEXT,
  level INT,
  parent_id TEXT REFERENCES therapeutic_areas(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add comment to explain the purpose of this table
COMMENT ON TABLE therapeutic_areas IS 'Standardized therapeutic areas based on Healthcare Provider Taxonomy Codes (HPTCS) with MeSH references';

-- Add comments to explain key fields
COMMENT ON COLUMN therapeutic_areas.id IS 'HPTCS code (e.g., "207RO0000X") serving as primary identifier';
COMMENT ON COLUMN therapeutic_areas.mesh_specialty_id IS 'MeSH identifier for the corresponding medical specialty';
COMMENT ON COLUMN therapeutic_areas.mesh_disease_id IS 'MeSH identifier for the corresponding disease category';
COMMENT ON COLUMN therapeutic_areas.level IS 'Hierarchy level in the taxonomy (lower numbers = broader categories)';
COMMENT ON COLUMN therapeutic_areas.parent_id IS 'Reference to parent therapeutic area for hierarchical organization';

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON therapeutic_areas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp(); 