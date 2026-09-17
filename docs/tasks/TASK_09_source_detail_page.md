# Task 09 — Source detail page (`/sources/[id]`)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Frontend Engineer**. Read `AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/CUE_RADAR_Product_Plan_v2.md` §2.5, `docs/tasks/TASK_08_source_recurrence_migration.md`, `docs/DECISIONS.md` first.

**Hard dependency**: this task requires `supabase/migrations/0005_source_recurrence.sql` (Task 08) to be merged **and applied to the live database** before it can be verified end to end. If Task 08's migration is not yet applied when this task starts, build against the schema as specified in Task 08 (the columns will exist once applied) but say explicitly in the PR description that live verification is pending the migration, per `docs/OWNER_TASKS.md`.

Work on branch `task/source-detail-page`, open **one PR** titled `Task 09: Source detail page` against `main`.

---

## 1. Route

`app/sources/[id]/page.tsx` — server component, `params: Promise<{ id: string }>` matching the existing pattern in `app/opportunities/[slug]/page.tsx` and `app/a/[handle]/page.tsx`.

- Fetch the `sources` row by `source_id`. `notFound()` if it doesn't exist.
- Fetch all `opportunities` rows (via `hub_feed` for live ones, and directly from `opportunities` for the full history — see §3) where `source_id` matches.

## 2. Page content — institution info

- Meta line: `.t-meta text-muted`: `{source_type label from vocab} · {city_name}`.
- Title: source `name`, `.t-title`.
- `Demo` tag when `is_demo` (same neutral chip styling as Task 07 §3 uses on Hub rows) — sources can be demo rows per `0003_demo_seed.sql`.
- Links row (ghost links, ≥44px tap targets): `website_url`, `opencalls_url`, `instagram_url` — only the ones present.
- `notes` field, if present and non-empty, rendered as `.t-body` (this is curated editorial content already in the DB, not new copy the agent writes).

## 3. Past-calls archive

- A list of every `opportunities` row for this source, **not** filtered to `status = 'live'` (this is the archive — it should include `expired`/`archived` rows too, since the point is showing history). Use the existing `OpportunityRow` component for rows that are still live/open (clickable, full anatomy); for `expired`/`archived` rows, render a reduced, non-clickable row: title, deadline (`Closed {date}`), nothing else — do not link to an opportunity detail page for a call that's over, since Task 02/06 rules keep expired rows out of the live Hub.
- Sort: most recent `deadline` (or `created_at` when `deadline` is null) first.
- Empty state: `.t-body text-muted`: `No past calls recorded yet.`

## 4. "Usually opens in {month}"

- Only render this line when `expected_next_open` is present on at least one of the source's opportunities (use the most recent non-null value). Format: `.t-body`: `Usually opens in {Month}` where `{Month}` is `Intl.DateTimeFormat('en-GB', { month: 'long' }).format(new Date(expected_next_open))`.
- If `expected_next_open` is null across all of the source's opportunities, omit this line entirely — do not compute or guess a month from deadline patterns. This is read directly from the column Task 08 added; it is not inferred client-side.

## 5. Linking in from elsewhere

- On `components/hub/OpportunityRow.tsx` and the opportunity detail page (`app/opportunities/[slug]/page.tsx`), make `source_name` a link to `/sources/{source_id}` (it is currently plain text). Keep everything else about those rows unchanged.

## 6. `hub_feed` type

`recurrence` and `expected_next_open` are already added to `HubFeedRow` by Task 08 — use them as-is; do not re-add or duplicate the type change here.

---

## 7. Order of work

1. Confirm Task 08's migration is merged (check `supabase/migrations/` and `lib/types.ts`); if not applied live yet, proceed per the dependency note above.
2. Build `app/sources/[id]/page.tsx` (§1–§4).
3. Wire the `source_name` links (§5).
4. Verification (§8).

---

## 8. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
ls "app/sources/[id]/page.tsx"
grep -n "expected_next_open\|recurrence" "app/sources/[id]/page.tsx"
grep -n "/sources/" components/hub/OpportunityRow.tsx "app/opportunities/[slug]/page.tsx"
grep -rn "localStorage\|FALLBACK_\|: any" "app/sources/[id]/page.tsx" || echo OK_no_client_persistence
grep -rnE "#[0-9A-Fa-f]{6}" "app/sources/[id]/page.tsx" || echo OK_no_hex
```

Manual checklist at 390px (attach screenshots): a source with a live call (row links correctly, archive below it), a source with only expired calls (archive shows reduced rows, no live section), a source with `expected_next_open` set ("Usually opens in {month}" renders), a source without it (line omitted), a `notFound()` for a bad id.

---

## 9. Do not

- Do not compute `expected_next_open` client-side from deadline history — read the column only.
- Do not make expired/archived rows clickable into `/opportunities/[slug]`.
- Do not touch `supabase/migrations/` — that's Task 08's scope, already merged by the time this runs.
- Do not add new npm dependencies.
- Do not put summaries/descriptions back onto Hub row cards while wiring the `source_name` link — only the link target changes.
