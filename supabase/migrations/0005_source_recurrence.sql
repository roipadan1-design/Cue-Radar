-- Migration 0005_source_recurrence.sql: Add opportunities.recurrence and
-- opportunities.expected_next_open, and recreate hub_feed to expose them.
--
-- Additive only, per AGENTS.md rule 6: nothing here removes a column, a row,
-- or a table, and no ALTER narrows or destroys existing data.
-- Both columns are nullable with no default; existing rows keep NULL ("unknown").
-- This migration does not backfill or guess a value for any existing row.

-- 1. New columns on opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS recurrence TEXT
    CHECK (recurrence IS NULL OR recurrence IN ('annual', 'biennial', 'rolling', 'one_off'));

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS expected_next_open DATE;

-- 2. Recreate hub_feed to expose the two new columns.
-- The current live view (from 0003_demo_seed.sql) selects an explicit column
-- list rather than `o.*`, so the new columns do not flow through automatically
-- and must be added explicitly here. This is otherwise byte-for-byte the same
-- view definition as 0003_demo_seed.sql.
CREATE OR REPLACE VIEW public.hub_feed AS
  SELECT
    o.opp_id,
    o.source_id,
    o.title,
    o.slug,
    o.summary,
    o.type,
    o.discipline_flags,
    o.city,
    o.deadline,
    o.funding_min,
    o.funding_max,
    o.currency,
    o.funding_type,
    o.covers,
    o.application_fee,
    o.eligibility_geo,
    o.career_stage,
    o.materials_required,
    o.apply_url,
    o.status,
    o.verified_at,
    o.verified_by,
    o.created_at,
    o.updated_at,
    o.recurrence,
    o.expected_next_open,
    s.name AS source_name,
    m.display_name AS city_name,
    m.region,
    (o.deadline - current_date) AS days_left,
    (o.deadline IS NULL) AS is_rolling,
    o.is_demo
  FROM public.opportunities o
  JOIN public.sources s USING (source_id)
  LEFT JOIN public.markets m ON m.slug = o.city
  WHERE o.status = 'live' AND (o.deadline IS NULL OR o.deadline >= current_date);
