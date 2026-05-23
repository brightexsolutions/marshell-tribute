-- ── Fix: make marshell-gallery bucket public ─────────────────
-- Public buckets allow getPublicUrl() to return accessible URLs.
-- Run this if you created the bucket without enabling Public.
UPDATE storage.buckets
  SET public = true
  WHERE id = 'marshell-gallery';

-- ── Storage RLS policies ──────────────────────────────────────

-- Public can read any file in the gallery bucket
CREATE POLICY "Gallery public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'marshell-gallery');

-- Service role uploads (INSERT) — service role bypasses RLS,
-- but this policy lets the anon key list objects if ever needed
CREATE POLICY "Gallery authenticated insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'marshell-gallery');

-- Allow delete (admin uses service role which bypasses RLS,
-- but explicit policy prevents surprises)
CREATE POLICY "Gallery authenticated delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'marshell-gallery');
