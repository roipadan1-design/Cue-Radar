# Task 08 — Source recurrence: migration and types

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Backend/Data Engineer**. Read `AGENTS.md`, `docs/HANDOFF_V3.md` (Part D, data model), `docs/CUE_RADAR_Product_Plan_v2.md` §2.5, `docs/ROADMAP.md`, `docs/DECISIONS.md` first. Work on branch `task/source-recurrence`, open **one PR** titled `Task 08: Source recurrence migration` against `main`.

This task adds the schema `docs/CUE_RADAR_Product_Plan_v2.md` §2.5 calls for so a future source page can say "usually opens in {month}". It is **additive only** and does not build any UI — the `/sources/[id]` page that reads these columns is Task 09, which depends on this task landing first.

---

## 1. Migration

Write `supabase/migrations/0005_source_recurrence.sql` (next free number after `0004_discipline_taxonomy.sql`):

- `ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS recurrence TEXT CHECK (recurrence IS NULL OR recurrence IN ('annual', 'biennial', 'rolling', 'one_off'));` — nullable, no default (existing rows keep `NULL`, meaning "unknown" — do not backfill a guess).
- `ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS expected_next_open DATE;` — nullable.
- `CREATE OR REPLACE VIEW public.hub_feed AS ...` — recreate the view exactly as it is in `0001_core.sql`/`0003_demo_seed.sql` (whatever the current live definition is — check `0003_demo_seed.sql` for whether it already touched this view) plus the two new columns, since `o.*` in the existing view will pick them up automatically if the view is `SELECT o.*, ...` — confirm this is still true by reading the current view definition before assuming a bare `o.*` covers it, and only add an explicit `CREATE OR REPLACE VIEW` statement if the columns do not already flow through.
- The migration must be idempotent (`ADD COLUMN IF NOT EXISTS`) and contain no `DROP`, no `DELETE`, no destructive `ALTER`, per rule 6.
- Do not touch `sources` — recurrence and next-open-date live on `opportunities` per the plan doc's own wording ("`opportunities.recurrence`... `expected_next_open` שמחושב מ-created_at/deadline של המופע הקודם"), not on `sources`.

## 2. Types

In `lib/types.ts`:
- Add `recurrence?: 'annual' | 'biennial' | 'rolling' | 'one_off' | null` and `expected_next_open?: string | null` to `HubFeedRow`.
- No other type changes.

## 3. Sync script

Check `scripts/sync_sheet_to_supabase.py` and the sheet-tab validation logic: if the `opportunities` tab in the sheet does not yet have `recurrence`/`expected_next_open` columns, the sync script must continue to work with them absent (nullable, no required-field error) — do not make either field required in the sheet-side validator. Add a short note to `docs/OWNER_TASKS.md` telling the owner these two optional columns exist in the sheet's `opportunities` tab now, and that leaving them blank is fine.

## 4. What this task does not do

- Does not compute `expected_next_open` for any existing row. That is either a manual/owner data-entry task (via the sheet) or a future computed-value task — out of scope here. Leave all existing rows `NULL` on both new columns.
- Does not build `/sources/[id]` — that is Task 09, which explicitly depends on this migration being merged and applied to the live database first.
- Does not touch `sources` table columns.

---

## 5. Order of work

1. Write and validate the migration file locally (no destructive statements, idempotent).
2. Update `lib/types.ts`.
3. Update the sync script's validator if needed, plus its unit tests.
4. Update `docs/OWNER_TASKS.md` with the "apply `0005_source_recurrence.sql`" step, matching the exact style of the existing Step 4a/4b entries (SQL Editor paste or CLI repair+push, since prior migrations in this project were applied by hand — check current live migration-history state before assuming `supabase db push` will work cleanly, per the precedent in `docs/DECISIONS.md` "Discipline taxonomy change").
5. Verification (§6).

---

## 6. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
ls supabase/migrations/0005_source_recurrence.sql
grep -n "recurrence\|expected_next_open" supabase/migrations/0005_source_recurrence.sql
grep -n "DROP\|DELETE" supabase/migrations/0005_source_recurrence.sql || echo OK_no_destructive_sql
grep -n "recurrence\|expected_next_open" lib/types.ts
grep -n "recurrence\|expected_next_open" docs/OWNER_TASKS.md
```

If the migration was applied to the live database in this session, also paste the raw output of:
```sql
select column_name, data_type from information_schema.columns where table_name = 'opportunities' and column_name in ('recurrence', 'expected_next_open');
```
If it was not applied (same sandbox restriction noted in prior DECISIONS.md entries may apply), say so explicitly in the PR description and leave the exact SQL-Editor instructions in `docs/OWNER_TASKS.md`.

---

## 7. Do not

- Do not add `DROP`, `DELETE`, or a destructive `ALTER` anywhere in `supabase/migrations/`.
- Do not touch `sources`, `markets`, `vocab`, or `events`.
- Do not build the `/sources/[id]` page — that is Task 09.
- Do not backfill guessed values into `recurrence` or `expected_next_open` for existing rows.
- Do not add new npm dependencies.
