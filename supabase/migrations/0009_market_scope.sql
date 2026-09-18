-- 0009_market_scope.sql
-- Task 21: the pilot is Israel-only. Every city outside Israel must disappear from the
-- product (city filters, landing city strip, Discover city search, the feed itself).
--
-- Rule 6 (migrations only add) forbids deleting the non-Israel markets, and rule 5 keeps
-- the app out of the curated tables, so scope is expressed as one additive flag column on
-- `markets` instead. Curated rows for Berlin/Tokyo/etc. stay exactly where they are and
-- come back by flipping one boolean when the pilot widens — nothing is destroyed.
--
-- The app reads `markets` with `.eq('is_active', true)` and derives every city list and
-- feed scope from that, so there is still no hard-coded country or city list in the code
-- (rule 4). `scripts/sync_sheet_to_supabase.py` owns this column from here on.

ALTER TABLE public.markets
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Pilot scope: Israel only. Non-destructive — flips a flag, keeps every row.
UPDATE public.markets SET is_active = (country = 'IL');

COMMENT ON COLUMN public.markets.is_active IS
  'Pilot scope flag. Only is_active markets are surfaced by the app (cities, filters, feed). Owned by scripts/sync_sheet_to_supabase.py.';

CREATE INDEX IF NOT EXISTS idx_markets_is_active ON public.markets (is_active);
