-- 0007_vocab_event_type_theatre_dance.sql
--
-- Adds the 2 event_type vocab values Task 13 confirmed were genuinely missing
-- (theatre, dance) after mapping the owner's named content categories against
-- the 11 event_type rows already live (see docs/DECISIONS.md, "Task 13 —
-- event-type vocab gap check, completed").
--
-- Written as a migration, not a Google Sheet row, per the architecture
-- decision in docs/DECISIONS.md, "Task 13 follow-up #2 — vocab-tab
-- architecture decision: migration-seeded, not Sheet-synced": the Sheet's
-- own "vocab" worksheet is a different, wide, one-column-per-category
-- dropdown-reference artifact, not a category/value/label/sort_order mirror
-- of this table, and scripts/sync_sheet_to_supabase.py's main() has never
-- synced a "vocab" tab into production. This follows the same precedent as
-- 0002_seed_vocab_markets.sql, 0003_demo_seed.sql, and
-- 0004_discipline_taxonomy.sql: additive only, ON CONFLICT DO UPDATE so it
-- is safe to run more than once, and it does not touch, reorder, or remove
-- any existing row in this table.

INSERT INTO public.vocab (category, value, label, sort_order) VALUES
  ('event_type', 'theatre', 'Theatre', 12),
  ('event_type', 'dance', 'Dance', 13)
ON CONFLICT (category, value) DO UPDATE SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order;
