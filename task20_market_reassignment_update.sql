-- Task 20 — market reassignment cleanup (Tel Aviv -> Jerusalem / Haifa mis-tagging)
-- Prepared 2026-09-18. NOT YET RUN — awaiting owner confirmation/execution (see docs/DECISIONS.md
-- "Task 20 — market reassignment cleanup" for the full audit trail and reasoning).
--
-- This is a live-data UPDATE on existing rows only. No DROP, no DELETE, no destructive ALTER.
-- Safe to run as-is: every WHERE clause is an explicit source_id list built from manual review
-- of each row's notes field (see docs/DECISIONS.md for the row-by-row justification), not a
-- pattern-matched blind UPDATE.
--
-- Before running: re-run the verification query below and confirm the same 12 source_ids and
-- market='tel_aviv' still come back (in case anything shifted since this file was prepared).

-- 0) Re-verify current state right before applying (read-only)
select source_id, name, market, notes
from public.sources
where market = 'tel_aviv'
  and (notes ilike '%jerusalem%' or notes ilike '%haifa%')
order by source_id;

-- 1) Reassign to Jerusalem (9 rows — notes explicitly say "city: Jerusalem")
UPDATE public.sources
SET market = 'jerusalem'
WHERE source_id IN ('SRC164', 'SRC165', 'SRC166', 'SRC171', 'SRC172', 'SRC173', 'SRC174', 'SRC178', 'SRC185');

-- 2) Reassign to Haifa (2 rows — notes explicitly say "city: Haifa")
UPDATE public.sources
SET market = 'haifa'
WHERE source_id IN ('SRC180', 'SRC181');

-- 3) NOT reassigned — left as tel_aviv (1 row, ambiguous, do not touch):
--    SRC176 America-Israel Cultural Foundation (AICF) — notes literally say
--    "city: Tel Aviv / Jerusalem" (both cities listed, foundation is a US-based
--    funder not tied to one physical location). No UPDATE statement for this row
--    on purpose.

-- 4) Verify after running
select source_id, name, market
from public.sources
where source_id IN ('SRC164','SRC165','SRC166','SRC171','SRC172','SRC173','SRC174','SRC176','SRC178','SRC180','SRC181','SRC185')
order by source_id;

-- 5) Confirm opportunities/events were untouched (this task never writes to either table;
--    counts before this file was prepared: opportunities = 60, events = 28)
select count(*) from opportunities;
select count(*) from events;

-- Note: the equivalent check on public.opportunities.city for the same 12 source_ids
-- was already run read-only and returned ZERO rows (no opportunities.city='tel_aviv'
-- row references any of these 12 sources), so no opportunities UPDATE is needed or
-- included in this file.
