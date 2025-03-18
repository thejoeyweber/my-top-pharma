-- Seed file for website_categories table
INSERT INTO website_categories (id, name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Corporate'),
  ('00000000-0000-0000-0000-000000000002', 'Product'),
  ('00000000-0000-0000-0000-000000000003', 'HCP'),
  ('00000000-0000-0000-0000-000000000004', 'Patient');

-- Seed file for websites table
INSERT INTO websites (id, domain, site_name, category_id, description, company_id, url, has_ssl, status, slug)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'pfizer.com', 'Pfizer Corporate', '00000000-0000-0000-0000-000000000001', 'Official corporate website for Pfizer Inc', '00000000-0000-0000-0000-000000000001', 'https://www.pfizer.com', true, 'active', 'pfizer-corporate'),
  ('00000000-0000-0000-0000-000000000002', 'merck.com', 'Merck Corporate', '00000000-0000-0000-0000-000000000001', 'Official corporate website for Merck & Co., Inc.', '00000000-0000-0000-0000-000000000002', 'https://www.merck.com', true, 'active', 'merck-corporate'),
  ('00000000-0000-0000-0000-000000000003', 'roche.com', 'Roche Corporate', '00000000-0000-0000-0000-000000000001', 'Official corporate website for Roche', '00000000-0000-0000-0000-000000000003', 'https://www.roche.com', true, 'active', 'roche-corporate'),
  ('00000000-0000-0000-0000-000000000004', 'ibrance.com', 'Ibrance', '00000000-0000-0000-0000-000000000002', 'Product website for Ibrance (palbociclib)', '00000000-0000-0000-0000-000000000001', 'https://www.ibrance.com', true, 'active', 'ibrance'),
  ('00000000-0000-0000-0000-000000000005', 'keytruda.com', 'Keytruda', '00000000-0000-0000-0000-000000000002', 'Product website for Keytruda (pembrolizumab)', '00000000-0000-0000-0000-000000000002', 'https://www.keytruda.com', true, 'active', 'keytruda'),
  ('00000000-0000-0000-0000-000000000006', 'hcp.novartis.com', 'Novartis HCP Portal', '00000000-0000-0000-0000-000000000003', 'Healthcare provider resource portal for Novartis products', '00000000-0000-0000-0000-000000000004', 'https://hcp.novartis.com', true, 'active', 'novartis-hcp'),
  ('00000000-0000-0000-0000-000000000007', 'azpatients.com', 'AstraZeneca Patient Resources', '00000000-0000-0000-0000-000000000004', 'Patient support and resources for AstraZeneca medications', '00000000-0000-0000-0000-000000000005', 'https://www.azpatients.com', true, 'active', 'astrazeneca-patients');

-- Seed website_therapeutic_areas junction table
INSERT INTO website_therapeutic_areas (website_id, therapeutic_area_id)
VALUES
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'), -- Ibrance - Oncology
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'), -- Keytruda - Oncology
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004'), -- Keytruda - Immunology
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002'), -- Novartis HCP - Cardiology
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004'), -- Novartis HCP - Immunology
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'), -- AZ Patients - Oncology
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002'); -- AZ Patients - Cardiology 