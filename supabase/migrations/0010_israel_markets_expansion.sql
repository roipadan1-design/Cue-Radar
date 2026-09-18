-- 0010_israel_markets_expansion.sql
-- Task 21 follow-up: "add every city in Israel that has an open call."
--
-- Reviewing the open calls the owner sent surfaced five Israeli cities that host real
-- calls but had no market row, so their opportunities could not be stored at all --
-- `opportunities.city` and `sources.market` are both foreign keys to `markets(slug)`:
--
--   caesarea   -- Ralli Museum Caesarea (Psychomagic Art Lab, closes 2026-10-20)
--   karmiel    -- Karmiel Dance Festival (4-8 Aug 2026, founded 1988)
--   ashdod     -- Ashdod Municipality "Ashdod celebrates 70" call for cultural projects
--   givatayim  -- Givatayim Theatre (Yossi Alfi Storytellers Festival, 33rd edition)
--   bat_yam    -- Kelim Choreography Center residency tracks
--
-- Additive only (rule 6): INSERT ... ON CONFLICT DO NOTHING, no row is altered or removed.
-- `is_active` is TRUE because the pilot is Israel-only and these are Israeli cities; the
-- 22 non-Israel markets parked by 0009 stay exactly as they are -- kept as backup, not
-- deleted, and invisible to the app only because is_active is false.
--
-- Coordinates are the cities' standard centre points. `region` follows the existing
-- Israeli rows seeded in 0002 ('Med'), as do timezone and currency.

INSERT INTO public.markets (slug, display_name, country, region, timezone, currency, lat, lng, is_active) VALUES
  ('caesarea',  'Caesarea',  'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.5000, 34.8994, true),
  ('karmiel',   'Karmiel',   'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.9186, 35.2961, true),
  ('ashdod',    'Ashdod',    'IL', 'Med', 'Asia/Jerusalem', 'ILS', 31.8014, 34.6435, true),
  ('givatayim', 'Givatayim', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.0722, 34.8106, true),
  ('bat_yam',   'Bat Yam',   'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.0171, 34.7450, true)
ON CONFLICT (slug) DO NOTHING;
