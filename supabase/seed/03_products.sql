-- Seed file for products table
INSERT INTO products (id, name, generic_name, company_id, description, stage, molecule_type, slug)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Comirnaty', 'COVID-19 mRNA Vaccine', '00000000-0000-0000-0000-000000000001', 'COVID-19 mRNA vaccine', 'marketed', 'mRNA Vaccine', 'comirnaty'),
  ('00000000-0000-0000-0000-000000000002', 'Ibrance', 'palbociclib', '00000000-0000-0000-0000-000000000001', 'CDK4/6 inhibitor used in the treatment of HR+/HER2- advanced or metastatic breast cancer', 'marketed', 'Small Molecule', 'ibrance'),
  ('00000000-0000-0000-0000-000000000003', 'Keytruda', 'pembrolizumab', '00000000-0000-0000-0000-000000000002', 'Anti-PD-1 therapy that works by increasing the ability of the body''s immune system to help detect and fight tumor cells', 'marketed', 'Monoclonal Antibody', 'keytruda'),
  ('00000000-0000-0000-0000-000000000004', 'Gardasil 9', 'Human Papillomavirus 9-valent Vaccine', '00000000-0000-0000-0000-000000000002', 'Vaccine to prevent certain cancers and diseases caused by nine HPV types', 'marketed', 'Vaccine', 'gardasil-9'),
  ('00000000-0000-0000-0000-000000000005', 'Tecentriq', 'atezolizumab', '00000000-0000-0000-0000-000000000003', 'PD-L1 blocking antibody indicated for the treatment of patients with specific types of cancer', 'marketed', 'Monoclonal Antibody', 'tecentriq'),
  ('00000000-0000-0000-0000-000000000006', 'Entresto', 'sacubitril/valsartan', '00000000-0000-0000-0000-000000000004', 'Treatment for adults with symptomatic chronic heart failure with reduced ejection fraction', 'marketed', 'Small Molecule', 'entresto'),
  ('00000000-0000-0000-0000-000000000007', 'Tagrisso', 'osimertinib', '00000000-0000-0000-0000-000000000005', 'EGFR tyrosine kinase inhibitor for the treatment of patients with metastatic EGFR T790M mutation-positive NSCLC', 'marketed', 'Small Molecule', 'tagrisso');

-- Seed product_therapeutic_areas junction table
INSERT INTO product_therapeutic_areas (product_id, therapeutic_area_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'), -- Comirnaty - Infectious Disease
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- Ibrance - Oncology
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'), -- Keytruda - Oncology
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'), -- Keytruda - Immunology
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005'), -- Gardasil 9 - Infectious Disease
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'), -- Tecentriq - Oncology
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002'), -- Entresto - Cardiology
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'); -- Tagrisso - Oncology 