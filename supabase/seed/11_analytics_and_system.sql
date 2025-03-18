-- Seed data for data_sources table
INSERT INTO data_sources (id, name, type, url, description, last_updated, active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'FDA Drug Database', 'api', 'https://api.fda.gov/drug/', 'Official FDA drug database API for regulatory information', '2023-05-20', true),
  ('00000000-0000-0000-0000-000000000002', 'ClinicalTrials.gov', 'api', 'https://clinicaltrials.gov/api/', 'Database of privately and publicly funded clinical studies', '2023-05-15', true),
  ('00000000-0000-0000-0000-000000000003', 'EMA Public Data', 'scraper', 'https://www.ema.europa.eu/en/medicines/', 'European Medicines Agency public data on approved medications', '2023-05-18', true),
  ('00000000-0000-0000-0000-000000000004', 'Company Financial Reports', 'manual', null, 'Manually entered data from quarterly and annual reports', '2023-05-10', true),
  ('00000000-0000-0000-0000-000000000005', 'PubMed Research Articles', 'api', 'https://pubmed.ncbi.nlm.nih.gov/api/', 'Medical research publication database', '2023-05-01', true);

-- Seed data for data_updates table
INSERT INTO data_updates (id, data_source_id, entity_type, entity_id, update_type, update_date, status, details)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'product', '00000000-0000-0000-0000-000000000001', 'new_approval', '2023-05-20', 'completed', '{"region": "Japan", "indication": "COVID-19 prevention", "details": "Approval for pediatric population 6 months to 4 years"}'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'product', '00000000-0000-0000-0000-000000000003', 'clinical_trial', '2023-05-15', 'completed', '{"trial_id": "NCT0987654", "phase": "3", "status": "Recruiting", "target_completion": "2024-06-30"}'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'product', '00000000-0000-0000-0000-000000000005', 'label_change', '2023-05-12', 'completed', '{"change_type": "safety_update", "details": "Added warning for potential immune-related adverse events"}'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'company', '00000000-0000-0000-0000-000000000002', 'financial_update', '2023-05-10', 'completed', '{"period": "Q1 2023", "revenue_change": "+5.3%", "guidance_updated": true}'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'therapeutic_area', '00000000-0000-0000-0000-000000000001', 'research_publication', '2023-05-05', 'completed', '{"journal": "Nature Medicine", "title": "Advances in targeted cancer therapies", "doi": "10.1038/s41591-023-0123-y"}');

-- Seed data for search_logs table
INSERT INTO search_logs (id, user_id, search_query, search_filters, results_count, search_date)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'breast cancer treatments', '{"therapeutic_area": "oncology", "approved_since": "2020"}', 12, '2023-05-20 09:45:23'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Keytruda clinical trials', '{"status": "recruiting", "location": "United States"}', 8, '2023-05-19 14:30:12'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Alzheimer\'s disease pipeline', '{"phase": ["2", "3"], "mechanism": "amyloid"}', 5, '2023-05-18 11:20:45'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'heart failure guidelines', '{"year": "2023", "issuing_body": "AHA"}', 3, '2023-05-17 16:05:33'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'pharmaceutical company mergers', '{"year_range": "2020-2023", "value": ">1B"}', 7, '2023-05-16 10:15:27');

-- Seed data for user_activity_logs table
INSERT INTO user_activity_logs (id, user_id, activity_type, entity_type, entity_id, activity_date, details)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'view', 'company', '00000000-0000-0000-0000-000000000001', '2023-05-20 10:30:45', '{"page": "company_detail", "time_spent": 240}'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'follow', 'product', '00000000-0000-0000-0000-000000000003', '2023-05-19 15:45:22', '{"action": "follow", "notification_setting": "weekly"}'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'download', 'report', 'financial_summary_2023', '2023-05-18 12:15:30', '{"format": "pdf", "size_kb": 1240}'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'view', 'therapeutic_area', '00000000-0000-0000-0000-000000000002', '2023-05-17 09:20:15', '{"page": "therapeutic_area_detail", "time_spent": 180}'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'share', 'news', '00000000-0000-0000-0000-000000000008', '2023-05-16 14:50:12', '{"platform": "email", "recipients_count": 3}');

-- Seed data for system_settings table
INSERT INTO system_settings (id, setting_key, setting_value, description, last_modified, modified_by)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'data_refresh_interval', '86400', 'Interval in seconds for automatic data refresh from external sources', '2023-05-01', 'system_admin'),
  ('00000000-0000-0000-0000-000000000002', 'max_search_results', '100', 'Maximum number of results to return in a single search query', '2023-04-15', 'system_admin'),
  ('00000000-0000-0000-0000-000000000003', 'default_notification_frequency', 'weekly', 'Default notification frequency for new user accounts', '2023-04-10', 'system_admin'),
  ('00000000-0000-0000-0000-000000000004', 'maintenance_mode', 'false', 'Flag to enable/disable system maintenance mode', '2023-05-15', 'system_admin'),
  ('00000000-0000-0000-0000-000000000005', 'analytics_retention_days', '365', 'Number of days to retain user analytics data', '2023-03-20', 'system_admin');

-- Seed data for api_keys table
INSERT INTO api_keys (id, user_id, key_name, key_prefix, created_at, expires_at, last_used_at, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Research Dashboard Integration', 'tpkey_r3s84', '2023-04-01', '2024-04-01', '2023-05-19', 'active'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'CRM Integration', 'tpkey_cr8m2', '2023-03-15', '2024-03-15', '2023-05-20', 'active'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Mobile App Access', 'tpkey_m0b7l', '2023-05-01', '2024-05-01', '2023-05-18', 'active'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Reporting Tool', 'tpkey_r8p06', '2023-02-10', '2024-02-10', '2023-05-15', 'active'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Development Testing', 'tpkey_d3v21', '2023-01-20', '2023-07-20', '2023-05-10', 'active');

-- Seed data for feedback table
INSERT INTO feedback (id, user_id, feedback_type, subject, content, submitted_at, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'feature_request', 'Add export to Excel functionality', 'Would like the ability to export search results and reports to Excel format for offline analysis.', '2023-05-10', 'under_review'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'bug_report', 'Search filter not working correctly', 'When filtering by approval date range, some products outside the range are still showing in results.', '2023-05-15', 'in_progress'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'suggestion', 'Improve mobile experience', 'The dashboard is difficult to navigate on smaller screens. Suggestion to create a more responsive layout.', '2023-05-08', 'planned'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'general', 'Thank you for the platform', 'Just wanted to express appreciation for this tool. It has significantly improved our research efficiency.', '2023-05-12', 'closed'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'feature_request', 'Add comparative analysis tool', 'Would be helpful to have a side-by-side comparison feature for multiple products or companies.', '2023-05-18', 'under_review'); 