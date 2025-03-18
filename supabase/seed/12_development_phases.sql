-- Development Phases Seed Data
BEGIN;

INSERT INTO development_phases (id, name, description, order_num)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Discovery', 'Initial research phase to identify and validate potential drug targets', 1),
  ('00000000-0000-0000-0000-000000000002', 'Preclinical', 'Laboratory and animal testing to assess safety and biological activity', 2),
  ('00000000-0000-0000-0000-000000000003', 'Phase 1', 'Small group human trials focusing on safety and dosage', 3),
  ('00000000-0000-0000-0000-000000000004', 'Phase 2', 'Expanded trials evaluating effectiveness and side effects', 4),
  ('00000000-0000-0000-0000-000000000005', 'Phase 3', 'Large-scale trials confirming effectiveness, monitoring side effects, and comparing to standard treatments', 5),
  ('00000000-0000-0000-0000-000000000006', 'FDA Review', 'Regulatory review process for marketing approval', 6),
  ('00000000-0000-0000-0000-000000000007', 'Phase 4', 'Post-market safety monitoring and additional studies', 7);

COMMIT; 