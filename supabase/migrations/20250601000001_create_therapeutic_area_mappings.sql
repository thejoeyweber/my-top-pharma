-- Create company_therapeutic_areas join table
CREATE TABLE company_therapeutic_areas (
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  therapeutic_area_id TEXT REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (company_id, therapeutic_area_id)
);

-- Create pharm_class_mappings table for mapping FDA Established Pharmacologic Classes to therapeutic areas
CREATE TABLE pharm_class_mappings (
  id SERIAL PRIMARY KEY,
  pharm_class TEXT NOT NULL,
  class_type TEXT NOT NULL,  -- 'EPC', 'MOA', 'CS', etc.
  therapeutic_area_id TEXT NOT NULL REFERENCES therapeutic_areas(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add a unique constraint for pharm_class and class_type
ALTER TABLE pharm_class_mappings ADD CONSTRAINT unique_pharm_class_mapping UNIQUE (pharm_class, class_type);

-- Add composite index for faster lookups
CREATE INDEX pharm_class_mapping_idx ON pharm_class_mappings (pharm_class, class_type);

-- Add comments to explain the purpose of these tables
COMMENT ON TABLE company_therapeutic_areas IS 'Join table linking companies to therapeutic areas';
COMMENT ON TABLE pharm_class_mappings IS 'Mapping table for OpenFDA pharmacologic classes to therapeutic areas';

-- Add trigger for updated_at on pharm_class_mappings
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pharm_class_mappings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp(); 