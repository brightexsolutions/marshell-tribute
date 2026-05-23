-- Photos table for dynamically managed gallery and primary hero image
CREATE TABLE public.photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure only one photo can be primary at a time (partial unique index)
CREATE UNIQUE INDEX idx_photos_one_primary ON public.photos(is_primary)
  WHERE is_primary = true;

-- RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Public can read photos (for gallery + hero)
CREATE POLICY "photos_select_public"
  ON public.photos FOR SELECT USING (true);

-- Only service role (admin) can insert/update/delete (bypasses RLS)
-- No anon policies for write operations

-- ============================================================
-- IMPORTANT: Also create a Supabase Storage bucket manually:
--   1. Go to Supabase Dashboard > Storage
--   2. Create a new bucket named: marshell-gallery
--   3. Set it to PUBLIC
--   4. Allow file types: image/jpeg, image/png, image/webp
-- ============================================================
