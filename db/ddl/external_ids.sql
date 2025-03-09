-- External IDs SQL Definition
-- This file contains tables for tracking external IDs for companies and products
-- These tables allow mapping entities in external systems to our internal IDs

-- Create company_external_ids table
CREATE TABLE IF NOT EXISTS company_external_ids (
    external_id_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL,
    source_system VARCHAR(100) NOT NULL, -- e.g., 'SEC_EDGAR', 'OPENCORPORATES', 'FDA', etc.
    external_id VARCHAR(255) NOT NULL, -- the ID in the external system
    url VARCHAR(500), -- optional URL to the entity in the external system
    metadata JSONB, -- any additional data about this external ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(company_id)
        ON DELETE CASCADE,
    CONSTRAINT uk_company_external_id UNIQUE (company_id, source_system, external_id)
);

-- Add indices for company_external_ids
CREATE INDEX idx_company_external_ids_company ON company_external_ids(company_id);
CREATE INDEX idx_company_external_ids_source ON company_external_ids(source_system);
CREATE INDEX idx_company_external_ids_external ON company_external_ids(external_id);

-- Create product_external_ids table
CREATE TABLE IF NOT EXISTS product_external_ids (
    external_id_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    source_system VARCHAR(100) NOT NULL, -- e.g., 'FDA', 'CLINICALTRIALS', etc.
    external_id VARCHAR(255) NOT NULL, -- the ID in the external system
    url VARCHAR(500), -- optional URL to the entity in the external system
    metadata JSONB, -- any additional data about this external ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,
    CONSTRAINT uk_product_external_id UNIQUE (product_id, source_system, external_id)
);

-- Add indices for product_external_ids
CREATE INDEX idx_product_external_ids_product ON product_external_ids(product_id);
CREATE INDEX idx_product_external_ids_source ON product_external_ids(source_system);
CREATE INDEX idx_product_external_ids_external ON product_external_ids(external_id);

-- Create triggers for updating the updated_at timestamp
CREATE TRIGGER update_company_external_ids_updated_at
BEFORE UPDATE ON company_external_ids
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_external_ids_updated_at
BEFORE UPDATE ON product_external_ids
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 