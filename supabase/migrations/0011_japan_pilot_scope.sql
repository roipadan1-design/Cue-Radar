-- 0011_japan_pilot_scope.sql
-- Task 22: the pilot moves to Kyoto and Tokyo only, focused on exploring the city
-- (events, venues, collectives) for one client who is in Japan now.
--
-- Additive only (rule 6): one market INSERT, vocab INSERTs, and a flag flip on
-- `markets.is_active` (the same non-destructive pattern 0009 used). Every Israeli and
-- European market row stays in place, parked behind is_active = false, and comes back
-- by flipping the flag.
--
-- Checked against the live DB (read-only) on 2026-10-19 before writing:
--   * `kyoto` has no market row; `tokyo` exists with is_active = false.
--   * 0009 / 0010 are applied (is_active exists; 16 Israeli markets active).
--   * 0007 is NOT applied: event_type 'theatre' and 'dance' are missing. Re-added below
--     (ON CONFLICT DO NOTHING, so it's safe whether or not 0007 runs later).

-- 1) Kyoto market. Coordinates are the city centre; region/timezone/currency follow tokyo.
INSERT INTO public.markets (slug, display_name, country, region, timezone, currency, lat, lng, is_active) VALUES
  ('kyoto', 'Kyoto', 'Japan', 'East_Asia', 'Asia/Tokyo', 'JPY', 35.0116, 135.7681, true)
ON CONFLICT (slug) DO NOTHING;

-- 2) Pilot scope: Kyoto + Tokyo only. Flag flip, no row removed.
UPDATE public.markets SET is_active = (slug IN ('kyoto', 'tokyo'));

-- 3) Event types the Japan research uses (docs/research/japan_pilot/FABLE_PROMPT.md §5.2).
INSERT INTO public.vocab (category, value, label, sort_order) VALUES
  ('event_type', 'theatre',     'Theatre',     12),
  ('event_type', 'dance',       'Dance',       13),
  ('event_type', 'party',       'Party',       14),
  ('event_type', 'jam',         'Jam',         15),
  ('event_type', 'meetup',      'Meetup',      16),
  ('event_type', 'open_studio', 'Open Studio', 17),
  ('event_type', 'screening',   'Screening',   18)
ON CONFLICT (category, value) DO NOTHING;
