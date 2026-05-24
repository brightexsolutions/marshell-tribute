-- ── Contributions table ──────────────────────────────────────────────────
-- Tracks send-off contributions. Public can submit; admin manages.
CREATE TABLE IF NOT EXISTS public.contributions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor    TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'mpesa',
  mpesa_ref      TEXT,
  amount         NUMERIC(10, 2),
  confirmed      BOOLEAN NOT NULL DEFAULT false,
  is_anonymous   BOOLEAN NOT NULL DEFAULT false,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Public can submit contributions
CREATE POLICY "contributions_insert_public"
  ON public.contributions FOR INSERT WITH CHECK (true);

-- Public can view confirmed contributions (for transparency)
CREATE POLICY "contributions_select_public"
  ON public.contributions FOR SELECT USING (true);

-- ── Contribution display settings in site_content ─────────────────────────
INSERT INTO public.site_content (key, value)
VALUES
  ('contribution_enabled', 'true'),
  ('contribution_method',  'M-Pesa'),
  ('contribution_phone',   ''),
  ('contribution_name',    ''),
  ('contribution_note',    'Send via M-Pesa, then fill in your name and M-Pesa reference below so the family can confirm receipt.')
ON CONFLICT (key) DO NOTHING;
