# Task 20 — Market reassignment cleanup (Tel Aviv → Jerusalem / Haifa mis-tagging)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Backend/Data Engineer**. Read `AGENTS.md` (rule 5 and rule 6 especially), `docs/HANDOFF_V3.md` Part D, `docs/DECISIONS.md` ("Task 12 — Israel-only pilot pivot," "Research pass — Israel city expansion," and the entry logging today's direct-insert script and the Jerusalem/Haifa markets bootstrap) before touching anything. Work on branch `task/market-reassignment-cleanup`, open **one PR** titled `Task 20: Market reassignment cleanup` against `main`.

---

## 0. Why this task exists

Jerusalem and Haifa were never their own rows in `markets` until today (2026-09-18) — they were added as part of the Israel-pilot direct-insert batch (`israel_pilot_data_insert.sql`, run by the owner directly in the Supabase SQL editor, see `docs/DECISIONS.md`). Before today, every institution actually located in Jerusalem or Haifa that was already in the `sources` table had been mis-tagged `market='tel_aviv'`, with the real city only ever mentioned in the free-text `notes` column. This task finds and corrects those pre-existing rows now that `jerusalem` and `haifa` exist as proper markets.

**This is a live-data `UPDATE`, not a schema migration.** `sources` is a curated table (`AGENTS.md` rule 5) — it is read-only to the app, and in the normal flow only `scripts/sync_sheet_to_supabase.py` writes to it. This task is, like today's direct-insert batch, an owner-adjacent live-data correction rather than an app write, and it carries the same auditability obligation: log the exact before/after row list in `docs/DECISIONS.md` so there is a permanent record of exactly what changed and why. Do not write a `supabase/migrations/*.sql` file for this — it is a one-time data correction on rows that already exist, not a schema change (no new column, no new table, no `vocab` addition). Run it the same way today's Israel-pilot insert was run: a one-off, idempotent-safe SQL statement (or set of statements) executed directly against the live database, with the exact SQL and its output logged.

---

## 1. Step one — identify candidate rows, don't assume

Query the live `sources` table directly (same `npx supabase db query --linked` / SQL Editor pattern already established in this repo — see `docs/DECISIONS.md` for the exact tooling precedent):

```sql
select source_id, name, market, notes
from public.sources
where market = 'tel_aviv'
  and (notes ilike '%jerusalem%' or notes ilike '%haifa%')
order by source_id;
```

This is the starting candidate list (the owner's own estimate is "~20+ rows" — treat that as an expectation to sanity-check against, not a target count to hit). For each row returned, read the actual `notes` text yourself before deciding anything — do not pattern-match on the word alone. A note that says something like "originally scouted via a Tel Aviv aggregator, city: Jerusalem" is a clear reassignment case. A note that merely mentions Jerusalem or Haifa in passing (e.g., "also runs a satellite programme in Jerusalem" for an institution whose primary address is genuinely Tel Aviv) is not — leave that row alone.

## 2. Step two — classify every candidate into exactly one of three buckets

For every row the query in §1 returns, decide and record:

1. **Confidently Jerusalem** — the notes field states or clearly implies the institution's actual city/location is Jerusalem (e.g., an explicit "city: Jerusalem" tag, a Jerusalem street address, "Jerusalem's main venue for X"). Reassign `market` to `jerusalem`.
2. **Confidently Haifa** — same standard, for Haifa. Reassign `market` to `haifa`.
3. **Not confidently determinable** — the notes are ambiguous, silent on city, or contradictory. **Leave `market` exactly as `tel_aviv`.** Do not guess. This bucket is not a failure of the task — reporting it accurately is the task's job. List these rows explicitly in the PR description and in `docs/DECISIONS.md` as "checked, left unchanged, insufficient evidence," with a one-line reason each, so nobody re-does this check later thinking it was skipped.

Also, while reading notes for the §1 candidate set, if you notice a row whose notes clearly indicate a *different* Israeli city entirely (Be'er Sheva, Herzliya, Holon, Akko, Eilat, Ramat Gan, Rishon LeZion, Nazareth — the cities added in today's same batch), reassign it to that market too, using the same confidence standard as buckets 1/2 above. Do not go looking for this beyond what the §1 query and a normal read of its results surfaces — this task is not a full re-audit of every `tel_aviv` row's notes field for every possible city, only of the ones the query already flagged.

## 3. Step three — apply the correction

Write and run a single `UPDATE` statement (or one per bucket, for clarity) against the live database, using explicit `source_id IN (...)` lists built from your §2 classification — never a bare `WHERE notes ilike '%jerusalem%'` `UPDATE` run blind, since that would re-run the same pattern-match instead of your reviewed judgment call. Example shape:

```sql
UPDATE public.sources
SET market = 'jerusalem'
WHERE source_id IN ('SRC0xx', 'SRC0yy', ...);   -- exact IDs from your §2 bucket 1 list

UPDATE public.sources
SET market = 'haifa'
WHERE source_id IN ('SRC0zz', ...);   -- exact IDs from your §2 bucket 2 list
```

This is a plain `UPDATE` on existing rows' `market` column — no `DROP`, no `DELETE`, no destructive `ALTER`, consistent with `AGENTS.md` rule 6 (which governs `supabase/migrations/`; this task doesn't touch that directory at all, but the same non-destructive spirit applies to any live-data write in this repo's practice).

After running, re-query to confirm:

```sql
select source_id, name, market from public.sources where source_id IN (/* the same ID list */);
```

## 4. Step four — audit log (mandatory, this is the point of the task)

Add a new dated entry to `docs/DECISIONS.md` (`## Task 20 — market reassignment cleanup (2026-09-18)` or the date you actually run this) containing:

- The exact §1 query and how many candidate rows it returned.
- A table or list of every row moved to `jerusalem`, every row moved to `haifa`, and every row moved to any other city bucket — `source_id`, `name`, old `market`, new `market`, and the one-line notes excerpt that justified the move.
- A table or list of every row left unchanged under bucket 3, with the one-line reason each.
- The exact `UPDATE` statement(s) actually run.
- Confirmation that `hub_feed`/`opportunities` row counts are unchanged before/after (this task only ever changes a `market` value on existing `sources` rows — it must not add, remove, or touch any `opportunities` or `events` row; verify this with a simple `select count(*) from opportunities;` / `select count(*) from events;` before and after and paste both).

---

## 5. What this task does not do

- Does not touch `opportunities`, `events`, or any table other than `sources.market`.
- Does not write a `supabase/migrations/*.sql` file.
- Does not touch the Google Sheet — this corrects rows that were never sourced through the Sheet+sync pipeline in the first place (they predate the Jerusalem/Haifa markets existing at all), so there's nothing to reconcile there. If you discover the Sheet's own `sources` tab has the same mis-tagged rows, note that in `docs/OWNER_TASKS.md` as a follow-up for whoever next reconciles the Sheet (per the existing "Sheet is out of sync with today's direct-insert batch" note) — do not edit the Sheet yourself as part of this task.
- Does not guess a city for any row where the notes field doesn't clearly support one.
- Does not re-audit every `tel_aviv` row in the table — only the candidate set surfaced by the §1 query.

---

## 6. Order of work

1. Run the §1 query against the live database; read every returned row's notes.
2. Classify every row per §2; write down the classification before touching the database.
3. Run the `UPDATE`(s) from §3; re-query to confirm.
4. Write the full audit entry into `docs/DECISIONS.md` per §4.
5. Verification (§7).

---

## 7. Verification (paste raw output in the PR — prose is not proof)

```bash
grep -rn "Task 20" docs/DECISIONS.md
ls supabase/migrations/   # confirm no new file was added by this task
grep -rn "DROP\|DELETE FROM" supabase/migrations/ || echo OK_no_destructive_sql
```

Also paste the raw SQL query/output pairs directly in the PR description, in this order:
1. The §1 candidate-query output (all returned rows, as returned).
2. Your §2 classification (which rows go to which bucket, one line each).
3. The exact §3 `UPDATE` statement(s) actually executed.
4. The §3 re-query output confirming the new `market` values.
5. The before/after `opportunities`/`events` row counts from §4's last bullet.

If no candidate rows are found at all in §1 (i.e., the owner's "~20+" estimate turns out to be wrong), say so plainly with the query output proving it, rather than treating an empty result as an error to work around.

---

## 8. Do not

- Do not guess a city for an ambiguous row — leave it as `tel_aviv` and log it as unresolved.
- Do not write a migration file for this.
- Do not touch any table other than `sources`, and only the `market` column on it.
- Do not run a pattern-matched `UPDATE ... WHERE notes ilike ...` directly — build explicit ID lists from your own reviewed classification first.
- Do not edit the Google Sheet.
