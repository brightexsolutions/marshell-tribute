-- ============================================================
-- NEW MIGRATIONS — run this in Supabase SQL Editor
-- Run AFTER the original 001_schema.sql and 002_rls.sql
-- ============================================================

-- ── 003: Photos table ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure only one photo is primary at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_photos_one_primary
  ON public.photos(is_primary) WHERE is_primary = true;

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select_public"
  ON public.photos FOR SELECT USING (true);


-- ── 004: Site content table (bio, etc.) ──────────────────────

CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_content (key, value)
VALUES (
  'bio',
  'Marshell Okatch was a beloved friend, family member, and community pillar whose warmth and kindness touched everyone he met.

He lived a life full of purpose, laughter, and love — always ready with a helping hand and a genuine smile. His memory will live on in the hearts of all who were fortunate enough to know him.

Rest in peace, Marshell. You are deeply missed.'
) ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content_select_public"
  ON public.site_content FOR SELECT USING (true);


-- ── Storage bucket ───────────────────────────────────────────
-- Create the storage bucket manually in the Supabase Dashboard:
--   Storage → New Bucket → Name: marshell-gallery → Public: ON
-- ============================================================
