-- Site content table for editable text (bio, etc.)
CREATE TABLE public.site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the bio with the placeholder text
INSERT INTO public.site_content (key, value)
VALUES ('bio', 'Marshell Okatch was a beloved friend, family member, and community pillar whose warmth and kindness touched everyone he met.

He lived a life full of purpose, laughter, and love — always ready with a helping hand and a genuine smile. His memory will live on in the hearts of all who were fortunate enough to know him.

Rest in peace, Marshell. You are deeply missed.');

-- RLS: public can read, only service role can write
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content_select_public"
  ON public.site_content FOR SELECT USING (true);
