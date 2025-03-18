-- Seed data for website_tech_stack table
INSERT INTO website_tech_stack (id, website_id, tech_name, tech_type, version_info, implementation_details)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'React', 'frontend_framework', '18.2.0', 'Used for interactive UI components'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Tailwind CSS', 'css_framework', '3.3.2', 'Utility-first CSS framework for styling'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Node.js', 'backend', '18.16.0', 'JavaScript runtime for server-side logic'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'PostgreSQL', 'database', '14.8', 'Primary database for content management'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Vue.js', 'frontend_framework', '3.2.47', 'Progressive JavaScript framework for UI'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'SCSS', 'css_preprocessor', '1.62.1', 'CSS preprocessor for advanced styling'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '.NET Core', 'backend', '7.0', 'Cross-platform framework for server-side logic'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 'MS SQL Server', 'database', '2019', 'Enterprise relational database for content'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', 'Angular', 'frontend_framework', '16.0.4', 'TypeScript-based web application framework'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'Bootstrap', 'css_framework', '5.3.0', 'Component-based CSS framework'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'Java Spring Boot', 'backend', '3.1.0', 'Java-based framework for microservices'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Oracle', 'database', '19c', 'Enterprise database for application data'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', 'Next.js', 'frontend_framework', '13.4.4', 'React framework for server-side rendering'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000004', 'Chakra UI', 'ui_library', '2.6.1', 'Component library for React applications'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000004', 'Python Django', 'backend', '4.2.1', 'High-level Python web framework'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000004', 'MongoDB', 'database', '6.0', 'NoSQL document database'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000005', 'WordPress', 'cms', '6.2.2', 'Content management system for website'),
  ('00000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000005', 'PHP', 'backend', '8.2.6', 'Server-side scripting language'),
  ('00000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000005', 'MySQL', 'database', '8.0', 'Relational database for WordPress'),
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000006', 'Drupal', 'cms', '10.0.9', 'Content management system'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000006', 'PHP', 'backend', '8.1.18', 'Server-side scripting language'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000006', 'MariaDB', 'database', '10.11', 'Enhanced fork of MySQL database'),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000007', 'Svelte', 'frontend_framework', '3.59.1', 'Compiler-based JavaScript framework'),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000007', 'Tailwind CSS', 'css_framework', '3.3.2', 'Utility-first CSS framework'),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000007', 'Ruby on Rails', 'backend', '7.0.4', 'Full-stack web application framework'),
  ('00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000007', 'PostgreSQL', 'database', '15.3', 'Advanced open source database');

-- Seed data for website_hosting table
INSERT INTO website_hosting (id, website_id, provider, infrastructure_type, region, deployment_method, performance_metrics)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AWS', 'cloud', 'us-east-1', 'CI/CD with GitHub Actions', '{"avg_load_time": "1.2s", "uptime": "99.98%", "ttfb": "120ms"}'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Azure', 'cloud', 'eastus2', 'Azure DevOps Pipeline', '{"avg_load_time": "1.5s", "uptime": "99.95%", "ttfb": "150ms"}'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Google Cloud', 'cloud', 'us-central1', 'Cloud Build with GitLab', '{"avg_load_time": "1.3s", "uptime": "99.97%", "ttfb": "135ms"}'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Vercel', 'edge', 'global', 'Git-based deployments', '{"avg_load_time": "0.9s", "uptime": "99.99%", "ttfb": "80ms"}'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'WP Engine', 'managed', 'us-west', 'Git push with SSH', '{"avg_load_time": "1.8s", "uptime": "99.96%", "ttfb": "200ms"}'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'Acquia', 'managed', 'us-east', 'Acquia Cloud CD', '{"avg_load_time": "1.7s", "uptime": "99.95%", "ttfb": "190ms"}'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'Heroku', 'paas', 'us', 'Git push with Heroku CLI', '{"avg_load_time": "1.4s", "uptime": "99.94%", "ttfb": "160ms"}');

-- Seed data for website_legal_content table
INSERT INTO website_legal_content (id, website_id, content_type, last_updated, version, content_summary, compliance_status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'privacy_policy', '2023-05-10', '3.2', 'Comprehensive data collection, usage, and sharing practices', 'GDPR, CCPA compliant'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'terms_of_service', '2023-04-15', '2.8', 'User rights and responsibilities, limitation of liability', 'Legally reviewed'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'cookie_policy', '2023-05-10', '2.1', 'Types of cookies used and opt-out mechanisms', 'ePrivacy compliant'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'privacy_policy', '2023-03-22', '4.0', 'Data processing activities and international transfers', 'GDPR, CCPA, LGPD compliant'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'terms_of_service', '2023-02-18', '3.5', 'Service usage terms and intellectual property rights', 'Legally reviewed'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'privacy_policy', '2023-01-30', '2.7', 'Personal data handling procedures and retention policy', 'GDPR compliant'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'terms_of_service', '2023-01-15', '2.5', 'Service terms, warranties, and dispute resolution', 'Legally reviewed'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'cookie_policy', '2023-01-30', '1.8', 'Cookie usage and third-party tracking', 'ePrivacy compliant'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'privacy_policy', '2023-04-05', '2.0', 'Privacy practices and user data protection measures', 'GDPR, CCPA compliant'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'privacy_policy', '2022-11-20', '1.5', 'Data collection and consumer rights', 'GDPR compliant'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000006', 'privacy_policy', '2023-02-28', '2.3', 'Privacy framework and data protection provisions', 'GDPR, CCPA compliant'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000007', 'privacy_policy', '2023-05-05', '1.8', 'User data handling and right to be forgotten', 'GDPR compliant');

-- Seed data for website_features table
INSERT INTO website_features (id, website_id, feature_name, feature_type, implementation_date, feature_description)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Product Finder', 'search_tool', '2022-10-15', 'Advanced filtering tool for finding medications by condition, formulation, or active ingredient'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Clinical Trial Locator', 'information_tool', '2023-01-20', 'Interactive map for finding nearby clinical trials with filtering capabilities'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'HCP Portal', 'gated_content', '2022-08-05', 'Secure login area for healthcare professionals with specialized resources'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Disease Education Center', 'content_hub', '2022-11-30', 'Comprehensive resource library for patients about disease management'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Side Effect Calculator', 'interactive_tool', '2023-03-15', 'Interactive tool for understanding medication risks and benefits'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'Patient Assistance Finder', 'support_tool', '2022-09-22', 'Tool to help patients find financial assistance programs for medications'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Interactive Dosing Calculator', 'calculation_tool', '2023-02-08', 'Calculator for healthcare providers to determine proper medication dosing'),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 'Virtual Medical Education', 'e_learning', '2023-04-12', 'On-demand webinars and continuing education for healthcare professionals'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'Patient Stories', 'testimonial_feature', '2022-12-10', 'Video testimonials from patients about their treatment experiences'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 'Physician Locator', 'location_tool', '2023-01-05', 'Tool to find specialists experienced with specific treatments or conditions'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000005', 'Medication Reminder App', 'mobile_app', '2023-03-30', 'Companion app for patients to track medication adherence'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', 'Interactive 3D Mechanism of Action', 'visualization_tool', '2023-02-15', 'Interactive 3D visualization of how the medication works in the body'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000007', 'Research Publications Library', 'document_repository', '2023-01-18', 'Searchable database of research papers and publications'); 