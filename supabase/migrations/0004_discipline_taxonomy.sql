-- 0004_discipline_taxonomy.sql
-- Owner decision: replace the ad-hoc `discipline` vocab list with a clean medium-based taxonomy —
-- Sound, Music, Performance, Dance, Painting, Sculpture ("that's it for now").
--
-- Additive only (AGENTS.md rule 6 — migrations only add, never DROP/DELETE/destructive ALTER):
--   1. Adds a `deprecated` flag column to public.vocab (new column, defaults false, no existing
--      row's meaning changes).
--   2. Upserts the 6 canonical discipline values. Three (`dance`, `performance`, `sound`) already
--      exist as vocab rows and are only relabeled/reordered via the same ON CONFLICT ... DO UPDATE
--      pattern already used in 0002_seed_vocab_markets.sql — their `value` slugs are untouched, so
--      every existing sources.discipline_focus / opportunities.discipline_flags / profiles.disciplines
--      row that already used them keeps matching. Three (`music`, `painting`, `sculpture`) are new rows.
--   3. Flags the 4 old fine-grained discipline values (`choreography`, `live_electronics`,
--      `installation`, `interdisciplinary`) as deprecated-but-present rather than deleting them —
--      they are still referenced by live/demo sources and opportunities rows. They stay valid,
--      selectable values; the Hub filter UI is expected to stop offering them as primary chips
--      (frontend follow-up, see docs/DECISIONS.md).
--
-- See docs/DECISIONS.md, "Discipline taxonomy change (2026-09-16)" for full reasoning.

-- 1. Additive column: lets vocab rows be marked deprecated-but-present without ever deleting them.
ALTER TABLE public.vocab ADD COLUMN IF NOT EXISTS deprecated boolean NOT NULL DEFAULT false;

-- 2. Upsert the 6 canonical discipline values (relabels dance/performance/sound in place, adds
--    music/painting/sculpture as new rows).
INSERT INTO public.vocab (category, value, label, sort_order, deprecated) VALUES
  ('discipline', 'sound', 'Sound', 1, false),
  ('discipline', 'music', 'Music', 2, false),
  ('discipline', 'performance', 'Performance', 3, false),
  ('discipline', 'dance', 'Dance', 4, false),
  ('discipline', 'painting', 'Painting', 5, false),
  ('discipline', 'sculpture', 'Sculpture', 6, false)
ON CONFLICT (category, value) DO UPDATE SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order,
  deprecated = EXCLUDED.deprecated;

-- 3. Mark the old fine-grained discipline values deprecated-but-present. Never DELETE: existing
--    sources.discipline_focus / opportunities.discipline_flags (including demo seed rows in
--    0003_demo_seed.sql) still reference these value slugs and must keep resolving.
UPDATE public.vocab
SET deprecated = true,
    sort_order = CASE value
      WHEN 'choreography'       THEN 21
      WHEN 'live_electronics'   THEN 22
      WHEN 'installation'       THEN 23
      WHEN 'interdisciplinary'  THEN 24
    END
WHERE category = 'discipline'
  AND value IN ('choreography', 'live_electronics', 'installation', 'interdisciplinary');
