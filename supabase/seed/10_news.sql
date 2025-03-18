-- Seed data for news table
INSERT INTO news (id, title, publication_date, source, author, content, url, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Pfizer Announces Positive Phase 3 Results for New Oncology Drug', '2023-05-12', 'BioPharma Today', 'Sarah Johnson', 'Pfizer today announced that its investigational oncology drug demonstrated statistically significant improvement in progression-free survival compared to standard of care in a Phase 3 clinical trial for advanced breast cancer patients. The company plans to submit regulatory applications by the end of the year.', 'https://example.com/pfizer-phase3-results', 'https://example.com/images/pfizer-research.jpg'),
  
  ('00000000-0000-0000-0000-000000000002', 'Merck Expands Research Collaboration with Leading Academic Institutions', '2023-04-28', 'Pharma Business Weekly', 'Michael Chen', 'Merck has announced an expansion of its research collaboration with five top academic institutions to accelerate development of novel immunotherapy approaches. The $150 million initiative will focus on exploring new mechanisms of action and combination therapies for difficult-to-treat cancers.', 'https://example.com/merck-academic-collaboration', 'https://example.com/images/merck-collaboration.jpg'),
  
  ('00000000-0000-0000-0000-000000000003', 'Roche Receives Breakthrough Therapy Designation for Alzheimer's Treatment', '2023-05-05', 'Neurology Today', 'Emma Williams', 'The FDA has granted Breakthrough Therapy Designation to Roche's investigational Alzheimer's disease treatment based on promising Phase 2 clinical data showing significant reduction in amyloid plaques and preliminary evidence of cognitive improvement in early-stage patients.', 'https://example.com/roche-alzheimers-breakthrough', 'https://example.com/images/roche-research.jpg'),
  
  ('00000000-0000-0000-0000-000000000004', 'Novartis Announces Major Investment in RNA Therapeutics Platform', '2023-04-15', 'Reuters Health', 'David Smith', 'Novartis has announced a $300 million investment to expand its RNA therapeutics capabilities, including a new research facility in Cambridge, Massachusetts. The company aims to develop novel treatments for rare genetic disorders and explore applications in cardiovascular and metabolic diseases.', 'https://example.com/novartis-rna-investment', 'https://example.com/images/novartis-facility.jpg'),
  
  ('00000000-0000-0000-0000-000000000005', 'AstraZeneca's COPD Therapy Shows Improved Outcomes in Real-World Study', '2023-05-18', 'Respiratory Medicine Journal', 'Jennifer Lee', 'A large real-world evidence study of AstraZeneca's triple therapy for COPD showed significant reductions in exacerbations and hospitalizations compared to dual therapies. The study tracked over 15,000 patients across multiple healthcare systems for 24 months.', 'https://example.com/astrazeneca-copd-study', 'https://example.com/images/astrazeneca-respiratory.jpg'),
  
  ('00000000-0000-0000-0000-000000000006', 'FDA Approves New Indication for Keytruda in Colorectal Cancer', '2023-03-30', 'Oncology Times', 'Robert Johnson', 'The FDA has approved Merck's Keytruda (pembrolizumab) for the treatment of patients with microsatellite instability-high (MSI-H) or mismatch repair deficient (dMMR) colorectal cancer, expanding its use to earlier stages of the disease when used in combination with chemotherapy.', 'https://example.com/keytruda-colorectal-approval', 'https://example.com/images/keytruda-approval.jpg'),
  
  ('00000000-0000-0000-0000-000000000007', 'European Commission Approves Pfizer's COVID-19 Vaccine for Children Ages 6 Months to 4 Years', '2023-04-02', 'European Medical News', 'Maria Garcia', 'The European Commission has granted marketing authorization for Pfizer/BioNTech's COVID-19 vaccine for children 6 months through 4 years of age. The approval follows positive recommendations from the European Medicines Agency based on clinical trial data showing a strong immune response and favorable safety profile in this age group.', 'https://example.com/pfizer-pediatric-approval-eu', 'https://example.com/images/pfizer-vaccine.jpg'),
  
  ('00000000-0000-0000-0000-000000000008', 'Roche's Tecentriq Shows Promise in Triple-Negative Breast Cancer Subgroup', '2023-05-08', 'Breast Cancer Research', 'Thomas Wilson', 'New analysis from a Phase 3 trial of Roche's Tecentriq (atezolizumab) identified a specific biomarker signature that may predict stronger response in triple-negative breast cancer patients. Patients with the biomarker profile showed significantly improved overall survival compared to the general study population.', 'https://example.com/tecentriq-tnbc-biomarker', 'https://example.com/images/tecentriq-research.jpg'),
  
  ('00000000-0000-0000-0000-000000000009', 'New Research Highlights Growing Concern of Antibiotic Resistance in Respiratory Infections', '2023-04-10', 'Infectious Disease Reports', 'Laura Martinez', 'A comprehensive review published today highlights the alarming increase in antibiotic-resistant respiratory infections worldwide. The authors call for improved stewardship programs, new diagnostic approaches, and accelerated development of novel antibacterial agents to address this growing public health threat.', 'https://example.com/antibiotic-resistance-respiratory', 'https://example.com/images/antibiotic-research.jpg'),
  
  ('00000000-0000-0000-0000-000000000010', 'Novartis Heart Failure Drug Shows Cardiovascular Benefits in Diabetic Patients', '2023-05-15', 'Cardiovascular Medicine', 'Andrew Thompson', 'A post-hoc analysis of clinical trial data reveals that Novartis's Entresto (sacubitril/valsartan) provides significant cardiovascular benefits in heart failure patients with diabetes. The findings suggest the therapy may offer particular advantages for this high-risk population, which represents approximately 30-40% of heart failure patients.', 'https://example.com/entresto-diabetes-benefits', 'https://example.com/images/novartis-cardio.jpg');

-- Seed data for news_companies table
INSERT INTO news_companies (id, news_id, company_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004');

-- Seed data for news_products table
INSERT INTO news_products (id, news_id, product_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000006');

-- Seed data for news_therapeutic_areas table
INSERT INTO news_therapeutic_areas (id, news_id, therapeutic_area_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004'); 