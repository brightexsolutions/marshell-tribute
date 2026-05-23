-- Marshell Memorial: tributes table
CREATE TABLE public.tributes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT,                          -- NULL when anonymous
  contact      TEXT,                          -- phone or email, optional
  message      TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  relationship TEXT,                          -- e.g. Friend, Family, Parent, or custom
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for chronological listing (newest first)
CREATE INDEX idx_tributes_created ON public.tributes(created_at DESC);
