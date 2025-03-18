-- Seed file for users table
INSERT INTO users (id, email, name, job_title, company, avatar_url)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'sarah.johnson@example.com', 'Sarah Johnson', 'Pharmaceutical Analyst', 'BioVista Research', 'https://randomuser.me/api/portraits/women/42.jpg'),
  ('00000000-0000-0000-0000-000000000002', 'michael.chen@example.com', 'Michael Chen', 'Medical Science Liaison', 'LifeScience Partners', 'https://randomuser.me/api/portraits/men/15.jpg'),
  ('00000000-0000-0000-0000-000000000003', 'akira.tanaka@example.com', 'Akira Tanaka', 'Regulatory Affairs Director', 'Global Pharma Associates', 'https://randomuser.me/api/portraits/men/37.jpg'),
  ('00000000-0000-0000-0000-000000000004', 'emily.rodriguez@example.com', 'Emily Rodriguez', 'Market Access Manager', 'Healthcare Insights Group', 'https://randomuser.me/api/portraits/women/23.jpg'),
  ('00000000-0000-0000-0000-000000000005', 'james.wilkinson@example.com', 'James Wilkinson', 'Clinical Research Director', 'BioTech Innovations', 'https://randomuser.me/api/portraits/men/52.jpg');

-- Seed user_preferences table  
INSERT INTO user_preferences (id, user_id, preference_key, preference_value)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'theme', 'light'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'email_notifications', 'weekly'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'theme', 'dark'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'email_notifications', 'daily'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'theme', 'system'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'email_notifications', 'none'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 'default_view', 'table'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', 'default_view', 'card');

-- Seed user_followed_companies table
INSERT INTO user_followed_companies (user_id, company_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Sarah follows Pfizer
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'), -- Sarah follows Roche
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'), -- Michael follows Merck
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'), -- Michael follows Novartis
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005'), -- Akira follows AstraZeneca
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'), -- Emily follows Pfizer
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003'); -- James follows Roche

-- Seed user_followed_products table  
INSERT INTO user_followed_products (user_id, product_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Sarah follows Comirnaty
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'), -- Sarah follows Ibrance
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'), -- Michael follows Keytruda
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005'), -- Akira follows Tecentriq
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006'), -- Emily follows Entresto
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007'); -- James follows Tagrisso

-- Seed user_followed_therapeutic_areas table
INSERT INTO user_followed_therapeutic_areas (user_id, therapeutic_area_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Sarah follows Oncology
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- Michael follows Oncology
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'), -- Michael follows Immunology
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'), -- Akira follows Neurology
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'), -- Emily follows Cardiology
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005'); -- James follows Infectious Disease

-- Seed user_followed_websites table
INSERT INTO user_followed_websites (user_id, website_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Sarah follows Pfizer.com
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004'), -- Sarah follows Ibrance.com
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'), -- Michael follows Merck.com
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005'), -- Michael follows Keytruda.com
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'), -- Akira follows Roche.com
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006'), -- Emily follows Novartis HCP Portal
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007'); -- James follows AZ Patient Resources

-- Seed user_notifications table
INSERT INTO user_notifications (id, user_id, notification_type, title, message, timestamp, read, action_url, entity_id, entity_type)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'company_update', 'Pfizer Update', 'Pfizer has released new financial results for Q1 2025', '2025-04-01 10:23:00', false, '/companies/00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'company'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'product_approval', 'New Approval for Ibrance', 'Ibrance has received FDA approval for a new indication', '2025-03-28 14:15:00', true, '/products/00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'product'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'product_update', 'Keytruda Data Update', 'New clinical trial data published for Keytruda', '2025-03-25 09:45:00', false, '/products/00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'product'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'website_update', 'Roche Website Redesign', 'Roche.com has launched a new website design', '2025-03-20 16:30:00', false, '/websites/00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'website'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'therapeutic_area_update', 'New Research in Cardiology', 'Recent breakthrough in heart failure treatments', '2025-03-15 11:20:00', true, '/therapeutic-areas/00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'therapeutic_area'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'company_update', 'AstraZeneca Collaboration', 'AstraZeneca announces new research collaboration', '2025-03-10 13:45:00', false, '/companies/00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'company');

-- Seed alert_subscriptions table
INSERT INTO alert_subscriptions (id, user_id, type_of_alert, reference_id, frequency)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'company', '00000000-0000-0000-0000-000000000001', 'daily'), -- Sarah's daily alert for Pfizer
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'product', '00000000-0000-0000-0000-000000000002', 'weekly'), -- Sarah's weekly alert for Ibrance
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'therapeutic_area', '00000000-0000-0000-0000-000000000001', 'daily'), -- Michael's daily alert for Oncology
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'product', '00000000-0000-0000-0000-000000000005', 'weekly'), -- Akira's weekly alert for Tecentriq
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'company', '00000000-0000-0000-0000-000000000004', 'monthly'), -- Emily's monthly alert for Novartis
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'therapeutic_area', '00000000-0000-0000-0000-000000000005', 'weekly'); -- James' weekly alert for Infectious Disease 