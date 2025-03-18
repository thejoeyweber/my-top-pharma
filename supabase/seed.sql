-- Top Pharma Database Seed File
-- This file contains all seed data in one consolidated file for Supabase db reset

BEGIN;

-- 1. Therapeutic Areas
INSERT INTO therapeutic_areas (id, name, description, slug)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Oncology', 'Cancer treatments and therapies', 'oncology'),
  ('00000000-0000-0000-0000-000000000002', 'Cardiology', 'Heart disease and cardiovascular treatments', 'cardiology'),
  ('00000000-0000-0000-0000-000000000003', 'Neurology', 'Nervous system disorders and treatments', 'neurology'),
  ('00000000-0000-0000-0000-000000000004', 'Immunology', 'Immune system disorders and treatments', 'immunology'),
  ('00000000-0000-0000-0000-000000000005', 'Infectious Disease', 'Treatments for bacterial, viral, and fungal infections', 'infectious-disease');

-- 2. Companies
INSERT INTO companies (id, name, description, headquarters, website, founded, stock_symbol, stock_exchange, slug)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Pfizer', 'Global pharmaceutical company focusing on innovative medicines and vaccines.', 'New York, USA', 'https://www.pfizer.com', '1849', 'PFE', 'NYSE', 'pfizer'),
  ('00000000-0000-0000-0000-000000000002', 'Merck', 'Leading biopharmaceutical company with a diverse portfolio of prescription medicines, vaccines, and animal health products.', 'Kenilworth, USA', 'https://www.merck.com', '1891', 'MRK', 'NYSE', 'merck'),
  ('00000000-0000-0000-0000-000000000003', 'Roche', 'Global pioneer in pharmaceuticals and diagnostics focusing on advancing science to improve people''s lives.', 'Basel, Switzerland', 'https://www.roche.com', '1896', 'ROG', 'SIX', 'roche'),
  ('00000000-0000-0000-0000-000000000004', 'Novartis', 'Global healthcare company based in Switzerland that provides solutions to address the evolving needs of patients worldwide.', 'Basel, Switzerland', 'https://www.novartis.com', '1996', 'NVS', 'NYSE', 'novartis'),
  ('00000000-0000-0000-0000-000000000005', 'AstraZeneca', 'Global, science-led biopharmaceutical company focusing on the discovery, development, and commercialization of prescription medicines.', 'Cambridge, UK', 'https://www.astrazeneca.com', '1999', 'AZN', 'NYSE', 'astrazeneca');

-- Company Therapeutic Areas mapping
INSERT INTO company_therapeutic_areas (company_id, therapeutic_area_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Pfizer - Oncology
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'), -- Pfizer - Infectious Disease
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- Merck - Oncology
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'), -- Merck - Immunology
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'), -- Roche - Oncology
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'), -- Roche - Neurology
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'), -- Novartis - Cardiology
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004'), -- Novartis - Immunology
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'), -- AstraZeneca - Oncology
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'); -- AstraZeneca - Cardiology

-- 3. Products Sample
INSERT INTO products (id, name, description, company_id, slug) 
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Keytruda', 'Cancer immunotherapy treatment', '00000000-0000-0000-0000-000000000002', 'keytruda'),
  ('00000000-0000-0000-0000-000000000002', 'Lipitor', 'Cholesterol lowering medication', '00000000-0000-0000-0000-000000000001', 'lipitor'),
  ('00000000-0000-0000-0000-000000000003', 'Herceptin', 'Breast cancer treatment', '00000000-0000-0000-0000-000000000003', 'herceptin');

-- Add sample data for websites
INSERT INTO websites (id, url, company_id, domain)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://www.pfizer.com', '00000000-0000-0000-0000-000000000001', 'pfizer.com'),
  ('00000000-0000-0000-0000-000000000002', 'https://www.lipitor.com', '00000000-0000-0000-0000-000000000001', 'lipitor.com');

COMMIT; 