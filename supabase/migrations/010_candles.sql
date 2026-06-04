-- Virtual candle lighting feature
CREATE TABLE public.candles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_candles_created ON public.candles(created_at DESC);

ALTER TABLE public.candles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "candles_select_public"
  ON public.candles FOR SELECT USING (true);

CREATE POLICY "candles_insert_public"
  ON public.candles FOR INSERT WITH CHECK (true);

-- Required for Supabase projects created May 30 2026+
GRANT SELECT, INSERT ON public.candles TO anon;
GRANT SELECT, INSERT ON public.candles TO authenticated;
