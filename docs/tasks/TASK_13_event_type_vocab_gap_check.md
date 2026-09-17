# Task 13 — Event-type vocab gap check (Israel content-scope broadening)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Backend/Data Engineer**. Read `AGENTS.md` (rule 5 especially), `docs/HANDOFF_V3.md` Part D (controlled vocabularies, sync script spec), `docs/CUE_RADAR_Product_Plan_v2.md` §3.2, `docs/DECISIONS.md` ("Task 12 — Israel-only pilot pivot and content-scope broadening") first. Work on branch `task/event-type-vocab-gap-check`, open **one PR** titled `Task 13: Event-type vocab gap check` against `main`.

---

## 0. Why this task exists

The owner's Israel-only pilot pivot (Task 12, `docs/DECISIONS.md`) broadens the content the app surfaces beyond open-calls/opportunities into "what's happening in the city": workshops, lectures, masterclasses, courses, performances, theatre, dance. This content type is `events` (already modeled, already has a minimal UI unblocked by Task 06 — the `/circuit/[city]` three-section view). The `events.event_type` column is a controlled vocab category (`vocab` where `category = 'event_type'`). This task's only job is to find out which of the owner's named categories already exist as usable vocab values and which are genuinely missing, and to document the correct path to add the missing ones. **It does not build any UI** — `/circuit/[city]` already renders whatever `event_type` values exist in `vocab`, grouped per Task 06 §7.2, with zero hardcoded event-type lists (`AGENTS.md` rule 4). Once new vocab values exist, they appear with no frontend change.

---

## 1. Step one: confirm the live state, don't assume it

Query the live database directly (same pattern already used in prior sessions — see `docs/DECISIONS.md` "Trip Radar v1..." and "Task 08 + Task 10..." entries for the exact `npx supabase db query --linked` / SQL Editor approach already in use in this repo):

```sql
select category, value, label, sort_order from vocab where category = 'event_type' order by sort_order;
```

As of the last confirmed check (`docs/DECISIONS.md`, 2026-09-17), this returns exactly 11 rows: `workshop, class, lab, masterclass, performance, concert, showing, exhibition, festival, talk, club`. **Re-confirm this is still accurate before doing anything else** — do not trust the historical note alone.

## 2. Step two: map the owner's seven named categories against the live rows

The owner named, in plain language: **workshops, lectures, masterclasses, courses, performances, theatre, dance**. For each one, determine and document one of three outcomes:

- **Already covered, exact or near-exact match** — e.g. "workshops" → existing `workshop` row, "masterclasses" → existing `masterclass` row, "performances" → existing `performance` row. No action needed.
- **Ambiguous — an existing row is close but not identical in meaning** — specifically `lectures` vs. the existing `talk` row, and `courses` vs. the existing `class` row. Decide, using your own judgment as the department closest to how this data will actually be curated and queried, whether each pair is the same real-world thing under a different label (in which case: do nothing to the schema, just note that "lecture" and "course" should be understood as `talk` and `class` respectively when curating the Sheet) or genuinely distinct concepts worth their own value (in which case: name it as a new value to add, per §3). Record whichever call you make, and why, in `docs/DECISIONS.md` under this task's number — this is exactly the kind of judgment call `AGENTS.md`'s "when the task and your judgment disagree" clause expects you to make and log, not escalate back to the owner as a technical question.
- **Genuinely missing, no existing row is a plausible match** — `theatre` and `dance` (as *event types* — note `dance` already exists as a `discipline` vocab value, which is a different category entirely and does not cover this; an event can be a dance discipline without being a "dance performance" event type, e.g. a lecture *about* dance). Treat these as new values to add, per §3, unless your own research turns up a reason one of them actually collapses into an existing value (e.g. if "theatre" performances are adequately covered by the existing `performance` row for this product's purposes — your call to make and log, same as the ambiguous pair above).

## 3. Step three: how missing values get added — the Sheet, not a migration

**This is a data change to a curated table, not a schema change.** Per `AGENTS.md` rule 5, `vocab` (like `markets, sources, opportunities, events`) is read-only to the app; only `scripts/sync_sheet_to_supabase.py` writes it, from the Google Sheet's `vocab` tab, in the documented upsert order `vocab → markets → sources → opportunities → events` (`docs/HANDOFF_V3.md` Part D).

**Do not write a migration that inserts into `vocab` directly for this.** Checked the precedent before writing this instruction: `supabase/migrations/0002_seed_vocab_markets.sql` (bootstrap seed of the entire vocab table before any Sheet/sync pipeline existed), `0003_demo_seed.sql` (added the `event_type` category itself, which did not exist at all, as part of a larger pilot-readiness migration that also added the `is_demo` column and recreated `hub_feed`), and `0004_discipline_taxonomy.sql` (a full taxonomy *replacement* with a new `deprecated` column and a relabeling of existing rows) are all **structural** vocab changes — adding a category that didn't exist, or restructuring a whole taxonomy — bundled with other schema work in a task explicitly owned by an engineer. Adding a handful of new leaf values to a category (`event_type`) that already exists and is already live is not structural; it is exactly the kind of ordinary content growth the Sheet+sync pipeline exists to handle without any migration or live-database-apply step at all.

Concretely, this task's deliverable for any value confirmed missing in §2 is:
- A row (or rows) to add to the Google Sheet's `vocab` tab: `category=event_type`, `value=<snake_case>`, `label=<Title Case>`, `sort_order=<next integer after 11>`. Write these out explicitly in the PR description and in `docs/OWNER_TASKS.md` (new numbered step, matching the existing Step 4-series style) so the owner can paste them into the Sheet directly — do not write a CSV file for this alone, since it's 0–2 rows, but do use the exact column names `scripts/sync_sheet_to_supabase.py`'s `ALLOWED_COLUMNS` already expects for `vocab`, so the wording is copy-pasteable with zero translation.
- Confirm `scripts/sync_sheet_to_supabase.py` already handles a genuinely new `event_type` value with no code change (it should — `event_type` is not enum-constrained in application code, only convention-constrained via the `vocab` table itself; verify by reading the script's validation logic for the `events` tab and quoting the relevant lines in the PR description). If the script *does* hardcode or enum-validate `event_type` anywhere (check `scripts/sync_sheet_to_supabase.py` and its tests before assuming it doesn't), that is a real bug against `AGENTS.md` rule 4 and is in scope to fix here — but only if you find it; do not add validation that doesn't already exist.

## 4. What this task does not do

- Does not add rows to `supabase/migrations/`.
- Does not touch `app/circuit/**`, `components/radar/EventRow.tsx`, or any other frontend file — the UI is already vocab-driven and needs no change once new values exist.
- Does not seed any actual Israeli event rows (real or demo) — that is separate content/research work, not this task.
- Does not decide the Israel city list — that is the Researcher's job per Task 12.
- Does not touch `docs/CUE_RADAR_Product_Plan_v2.md`'s own `event_type` enum text (§3.2) — that document is a historical plan snapshot; if you want to note the supersession, do it in `docs/DECISIONS.md`, not by editing the plan.

---

## 5. Order of work

1. Query live `vocab` for `event_type`, confirm the current 11 rows (§1).
2. Map the owner's seven named categories against them; make and log the two ambiguous-pair judgment calls (§2).
3. Confirm whether `scripts/sync_sheet_to_supabase.py` needs any change to accept new `event_type` values (it almost certainly doesn't — verify, don't assume) (§3).
4. Write the exact Sheet rows to add into `docs/OWNER_TASKS.md`.
5. Log the judgment calls in `docs/DECISIONS.md` under this task's number.
6. Verification (§6).

---

## 6. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
grep -n "event_type" scripts/sync_sheet_to_supabase.py
grep -rn "DROP\|DELETE FROM" supabase/migrations/ || echo OK_no_destructive_sql
ls supabase/migrations/   # confirm no new file was added by this task
grep -n "Task 13" docs/DECISIONS.md
grep -n "event_type" docs/OWNER_TASKS.md
```

Also paste, if live query access is available (same pattern as prior sessions):
```sql
select category, value, label, sort_order from vocab where category = 'event_type' order by sort_order;
```
showing the confirmed current state at the time this task ran.

---

## 7. Do not

- Do not write a migration inserting into `vocab` for ordinary new leaf values — use the Sheet+sync path (§3).
- Do not invent the Israel city list, or any content beyond the vocab-gap analysis itself.
- Do not touch frontend code — `/circuit/[city]` needs no change to pick up new vocab values.
- Do not add new npm/Python dependencies.
- Do not decide the ambiguous `lecture`-vs-`talk` / `course`-vs-`class` calls silently — make the call and log it in `docs/DECISIONS.md`, per §2.
