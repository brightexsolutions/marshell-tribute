-- Enable Row Level Security
ALTER TABLE public.tributes ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors) can read tributes
CREATE POLICY "tributes_select_public"
  ON public.tributes
  FOR SELECT
  USING (true);

-- Anyone can submit a tribute
CREATE POLICY "tributes_insert_public"
  ON public.tributes
  FOR INSERT
  WITH CHECK (true);

-- No UPDATE or DELETE policies: blocked for anon key
-- Admin reads and manages ALL rows via service role key (bypasses RLS)
