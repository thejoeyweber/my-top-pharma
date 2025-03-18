-- Top Pharma Database Seed File Runner
-- This file imports all the seed data in the correct order to ensure referential integrity

-- 1. Core tables
\i 'seed/01_therapeutic_areas.sql'
\i 'seed/02_companies.sql'
\i 'seed/03_products.sql'
\i 'seed/04_websites.sql'

-- 2. Secondary data and relationships
\i 'seed/05_regions_indications.sql'
\i 'seed/06_users.sql'
\i 'seed/07_company_details.sql'
\i 'seed/08_product_details.sql'
\i 'seed/09_website_details.sql'
\i 'seed/10_news.sql'
\i 'seed/11_analytics_and_system.sql'
\i 'seed/12_development_phases.sql'

-- Success message
SELECT 'Successfully ran all seed files' as status; 