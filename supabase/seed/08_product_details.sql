-- Seed file for product_timelines table
INSERT INTO product_timelines (id, product_id, date, stage, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2020-01-15', 'discovery', 'Initial development of COVID-19 mRNA vaccine platform'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2020-07-27', 'clinical_trial', 'Phase 2/3 clinical trial initiated'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '2020-12-11', 'approval', 'FDA Emergency Use Authorization granted'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '2021-08-23', 'full_approval', 'FDA full approval for ages 16 and older'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '2013-04-12', 'discovery', 'Initial discovery of palbociclib'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '2015-02-03', 'approval', 'FDA approval for HR+/HER2- breast cancer'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '2017-03-31', 'expanded_indication', 'FDA approval for combination therapy with aromatase inhibitors'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', '2011-01-26', 'discovery', 'Initial development of pembrolizumab'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', '2014-09-04', 'approval', 'FDA approval for advanced melanoma'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', '2016-10-24', 'expanded_indication', 'FDA approval for first-line treatment of metastatic NSCLC'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', '2023-03-17', 'expanded_indication', 'FDA approval for adjuvant treatment of melanoma'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', '2013-09-12', 'discovery', 'Initial development of atezolizumab'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000005', '2016-05-18', 'approval', 'FDA approval for urothelial carcinoma'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000006', '2012-06-08', 'discovery', 'Initial development of sacubitril/valsartan'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000006', '2015-07-07', 'approval', 'FDA approval for heart failure with reduced ejection fraction'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000007', '2014-05-23', 'discovery', 'Initial development of osimertinib'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000007', '2015-11-13', 'approval', 'FDA approval for EGFR T790M mutation-positive NSCLC');

-- Seed file for product_approvals table
INSERT INTO product_approvals (id, product_id, region, date, agency, status, indication, details)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'United States', '2020-12-11', 'FDA', 'approved', 'COVID-19 prevention', 'Emergency Use Authorization for prevention of COVID-19 in individuals 16 years and older'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Europe', '2020-12-21', 'EMA', 'approved', 'COVID-19 prevention', 'Conditional marketing authorization for prevention of COVID-19'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'United Kingdom', '2020-12-02', 'MHRA', 'approved', 'COVID-19 prevention', 'Temporary authorization for prevention of COVID-19'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'United States', '2015-02-03', 'FDA', 'approved', 'HR+/HER2- breast cancer', 'Approval for treatment of HR+/HER2- advanced or metastatic breast cancer'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Europe', '2016-11-09', 'EMA', 'approved', 'HR+/HER2- breast cancer', 'Approval for treatment of HR+/HER2- locally advanced or metastatic breast cancer'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'United States', '2014-09-04', 'FDA', 'approved', 'Advanced melanoma', 'Approval for treatment of unresectable or metastatic melanoma'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Europe', '2015-07-17', 'EMA', 'approved', 'Advanced melanoma', 'Approval for treatment of advanced (unresectable or metastatic) melanoma in adults'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'United States', '2016-10-24', 'FDA', 'approved', 'Metastatic NSCLC', 'Approval for first-line treatment of metastatic NSCLC with high PD-L1 expression'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', 'United States', '2016-05-18', 'FDA', 'approved', 'Urothelial carcinoma', 'Approval for treatment of locally advanced or metastatic urothelial carcinoma'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'Europe', '2017-09-21', 'EMA', 'approved', 'Urothelial carcinoma', 'Approval for treatment of locally advanced or metastatic urothelial carcinoma'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006', 'United States', '2015-07-07', 'FDA', 'approved', 'Heart failure', 'Approval for treatment of heart failure with reduced ejection fraction'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', 'Europe', '2015-11-19', 'EMA', 'approved', 'Heart failure', 'Approval for treatment of symptomatic chronic heart failure with reduced ejection fraction'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000007', 'United States', '2015-11-13', 'FDA', 'approved', 'EGFR T790M NSCLC', 'Approval for treatment of patients with metastatic EGFR T790M mutation-positive NSCLC'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000007', 'Europe', '2016-02-02', 'EMA', 'approved', 'EGFR T790M NSCLC', 'Approval for treatment of locally advanced or metastatic EGFR T790M mutation-positive NSCLC');

-- Seed file for product_patents table
INSERT INTO product_patents (id, product_id, number, expiry_date, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'US10702600', '2035-06-30', 'Modified mRNA encoding SARS-CoV-2 spike protein'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'US10703789', '2036-01-15', 'Lipid nanoparticle formulation for mRNA delivery'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'US7507755', '2023-03-24', 'CDK 4/6 inhibitor compound'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'US8420645', '2025-08-13', 'Methods of treatment using CDK 4/6 inhibitors'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'US8952136', '2033-11-30', 'Humanized antibodies against PD-1'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'US9809623', '2036-05-19', 'Combination therapy with PD-1 antibodies'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 'US9567399', '2035-01-21', 'Anti-PD-L1 antibodies and methods of use'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000006', 'US8877938', '2028-11-26', 'Compounds containing sacubitril and valsartan'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', 'US9388134', '2031-07-09', 'Methods of treating heart failure with neprilysin inhibitors'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000007', 'US9862748', '2032-12-15', 'EGFR mutant selective inhibitors'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000007', 'US10183931', '2035-03-12', 'Crystalline forms of osimertinib mesylate');

-- Seed file for regulatory_approvals table
INSERT INTO regulatory_approvals (id, product_id, company_id, agency, approval_date, indication, details)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FDA', '2020-12-11', 'COVID-19 prevention', 'Emergency Use Authorization for prevention of COVID-19 in individuals 16 years and older'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FDA', '2021-08-23', 'COVID-19 prevention', 'Full FDA approval for individuals 16 years and older'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'FDA', '2015-02-03', 'HR+/HER2- breast cancer', 'Accelerated approval for HR+/HER2- advanced breast cancer in postmenopausal women'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'FDA', '2017-03-31', 'HR+/HER2- breast cancer', 'Approval for use in combination with aromatase inhibitors'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'FDA', '2014-09-04', 'Advanced melanoma', 'Accelerated approval for treatment of unresectable or metastatic melanoma'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'FDA', '2016-10-24', 'Metastatic NSCLC', 'Approval for first-line treatment of metastatic NSCLC with high PD-L1 expression'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'FDA', '2016-05-18', 'Urothelial carcinoma', 'Accelerated approval for locally advanced or metastatic urothelial carcinoma'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'FDA', '2019-03-18', 'Triple-negative breast cancer', 'Accelerated approval for PD-L1+ metastatic triple-negative breast cancer'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'FDA', '2015-07-07', 'Heart failure', 'Approval for treatment of heart failure with reduced ejection fraction'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 'FDA', '2015-11-13', 'EGFR T790M NSCLC', 'Accelerated approval for metastatic EGFR T790M mutation-positive NSCLC'); 