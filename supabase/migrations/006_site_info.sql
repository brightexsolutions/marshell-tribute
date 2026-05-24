-- Seed hero details into site_content
-- Existing values are preserved (ON CONFLICT DO NOTHING)
INSERT INTO public.site_content (key, value)
VALUES
  ('hero_name',    'Marshell Okatch'),
  ('born_year',    ''),
  ('died_year',    '2026'),
  ('burial_date',  'June 5, 2026')
ON CONFLICT (key) DO NOTHING;
