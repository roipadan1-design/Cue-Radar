# Owner Action Items

This document tracks all tasks that require manual action by the repository owner (e.g., secret setup, external service provisioning).

---

## Day-One Checklist

### Step 1: Provision & Configure Supabase Auth
1. Open **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Enable **Google Provider**:
   - Authorized Client ID & Secret from Google Cloud Console.
   - Set Authorized Redirect URI in Google Cloud to `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. Enable **Apple Provider** (Optional - hide in app unless `NEXT_PUBLIC_AUTH_APPLE=true` is set).
4. Open **Authentication** -> **URL Configuration**:
   - **Site URL**: `https://cue-radar.vercel.app`
   - **Redirect URLs**:
     - `https://cue-radar.vercel.app/auth/callback`
     - `https://*-roipadan1-design.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`
5. Open **Authentication** -> **Email**:
   - **Confirm email**: Recommend **OFF** for the pilot (for instant onboarding), turn ON later.

### Step 2: Apply Database Migrations
Execute the migration files in order via the Supabase SQL Editor:
1. `supabase/migrations/0001_core.sql`
2. `supabase/migrations/0002_seed_vocab_markets.sql`
3. `supabase/migrations/0003_demo_seed.sql` (adds `is_demo` column, recreates `hub_feed`, seeds ~12 demo sources, ≥40 demo opportunities, ≥30 demo events)

### Step 3: Configure Environment Variables & Secrets
Set the following environment variables:
- **Vercel & Local (`.env.local`)**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL` = `https://cue-radar.vercel.app`
  - `NEXT_PUBLIC_FEEDBACK_EMAIL` = `feedback@cueradar.com`
  - `NEXT_PUBLIC_SHOW_DEMO` = `true` (set `false` when ready to hide demo content)
  - `NEXT_PUBLIC_AUTH_APPLE` = `false` (set `true` only when Apple Developer account is configured)
- **GitHub Actions Secrets**:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_SHEETS_ID`
  - `GOOGLE_SERVICE_ACCOUNT_JSON`

### Step 4a: Discipline taxonomy migration — CONFIRMED APPLIED (2026-09-17 update)
`supabase/migrations/0004_discipline_taxonomy.sql` was written as described below (new discipline vocab: Sound, Music, Performance, Dance, Painting, Sculpture — see `docs/DECISIONS.md` "Discipline taxonomy change"). It was previously reported as not applied. **Re-checked directly against the live project in this session (Task 08/10 work, 2026-09-17)**: `select category, value, label, sort_order, deprecated from vocab where category = 'discipline' order by sort_order;` now returns exactly the expected 10 rows — 6 with `deprecated = false` (sound, music, performance, dance, painting, sculpture) and 4 with `deprecated = true` (choreography, live_electronics, installation, interdisciplinary). **No action needed — this migration is live.** (Original manual-apply note, kept for history below.)

Original note on why this needed manual action: migrations `0001`–`0003` were applied by hand via the Supabase SQL Editor rather than `supabase db push`, so the CLI's migration-history table has no record of them (this is still true as of this session — `npx supabase migration list --linked` shows `remote: ""` for `0001`–`0004` even though all four are live). Running `supabase db push` blind therefore still tries to replay `0001_core.sql` from scratch and would fail on `CREATE POLICY ... already exists`. If a future session needs the CLI's own bookkeeping table to reflect reality (e.g. to `db push` `0005`/`0006` below via CLI instead of the SQL Editor), run `npx supabase migration repair --status applied 0001 0002 0003 0004` first — this only touches the CLI's local bookkeeping table and executes no schema SQL — then `npx supabase db push`.

### Step 4b: `/radar/[city]` and event calendar links — CONFIRMED APPLIED (2026-09-17 update)
`supabase/migrations/0003_demo_seed.sql` was previously reported as not applied (events table empty, no `event_type` vocab, no `is_demo` column). **Re-checked directly against the live project in this session**: `events` has 23 rows, `vocab` has 11 `event_type` rows, and `hub_feed`/`opportunities` both have `is_demo`. **No action needed — this migration is live**, and `/radar[/circuit]/[city]`'s "Workshops & classes" / "On stage & exhibitions" sections and the demo Hub rows should now be populated.

### Step 4c: Apply the source-recurrence migration (Task 08) — CONFIRMED APPLIED (2026-09-18)
`supabase/migrations/0005_source_recurrence.sql` adds `opportunities.recurrence` (nullable enum: `annual`/`biennial`/`rolling`/`one_off`) and `opportunities.expected_next_open` (nullable date), and recreates `hub_feed` to expose both. It is additive/idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE OR REPLACE VIEW`) and does not touch or guess a value for any existing row — both columns stay `NULL` on every row until filled in by hand via the sheet's `opportunities` tab (optional columns; leaving them blank is fine, the sync script does not require them).

**Applied to the live database 2026-09-18**, with owner (Roi) approval, after the CLI's migration-history bookkeeping for `0001`–`0004` was repaired (`npx supabase migration repair --status applied 0001 0002 0003 0004` — bookkeeping only, no schema SQL). One mid-flight fix was needed: the migration's `hub_feed` `SELECT` list originally placed `recurrence`/`expected_next_open` in the middle of the existing column list, which Postgres's `CREATE OR REPLACE VIEW` rejects (it only allows appending new output columns at the end of an existing view). Fixed by moving both columns to the end of the `SELECT` list (after `is_demo`) — no other change to the file. First push attempt (before the fix) failed cleanly and rolled back with zero effect on production; the corrected file was pushed successfully by Roi via `npx supabase db push --linked`.

Verified after applying: `select column_name, data_type, is_nullable from information_schema.columns where table_name = 'opportunities' and column_name in ('recurrence', 'expected_next_open');` returned both rows (`recurrence` text nullable, `expected_next_open` date nullable). **No action needed — this migration is live.**

### Step 4d: Apply the Discover/Connect `follows` migration (Task 10) — CONFIRMED APPLIED (2026-09-18)
`supabase/migrations/0006_follows.sql` creates the `follows` table (one-directional, private follow bookkeeping between two profiles — no public follower count, no messaging) with RLS restricting `select` to the two parties in the row and `insert`/`delete` to the follower only. Additive only (`CREATE TABLE IF NOT EXISTS`).

**Applied to the live database 2026-09-18**, in the same push as Step 4c above.

Verified after applying: `select tablename, policyname, cmd, qual from pg_policies where tablename = 'follows';` returned exactly three policies — `Select own follows` (SELECT, `auth.uid() = follower_id OR auth.uid() = followee_id`), `Insert own follow` (INSERT), `Delete own follow` (DELETE, `auth.uid() = follower_id`) — none with a public (`USING (true)`) qualifier. `to_regclass('public.follows')` confirms the table exists. `hub_feed` re-queried after both migrations and still returns its pre-migration row count (46) with no error. **No action needed — this migration is live.**

### Rebrand follow-up: custom domain for the new name "Fellow." (2026-09-17)
The app-facing product name was renamed from "Cue Radar" to "Fellow." (see `docs/DECISIONS.md` "Rebrand" entry) — code/UI only. The site still lives at the existing `cue-radar.vercel.app` URL (and `feedback@cueradar.com`, Supabase `Site URL`, GitHub repo name, and Vercel project name were all deliberately left untouched — out of scope for this task). Whether/when to buy and wire up a domain matching "Fellow." (and whether to update the Supabase Auth **Site URL**/**Redirect URLs** in Step 1 and `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_FEEDBACK_EMAIL` in Step 3 to match) is a future decision for the owner — not done here.

### Step 4e: Israel-only pilot — add confirmed Israeli cities to the Sheet's `markets` tab (Task 12, 2026-09-18)
The pilot's geographic scope narrowed to **Israel only** (supersedes the 2026-09-17 five-city selection below — Tel Aviv, Tokyo, Berlin, Vienna, Brussels — for the purposes of new sourcing effort; existing non-Israel rows are not deleted, per `AGENTS.md` rule 6). Named cities so far: **Tel Aviv, Haifa, Jerusalem**. The Researcher is finding any additional Israeli cities with real, verifiable art/culture activity — once confirmed, add them as rows to the Google Sheet's `markets` tab (same columns as `data/seed/markets.csv`: `slug, display_name, country, region, timezone, currency, lat, lng`). The existing sync pipeline (`scripts/sync_sheet_to_supabase.py`) picks up new rows automatically on its next run — no migration, no code change, no action beyond editing the Sheet. See `docs/DECISIONS.md`, "Task 12 — Israel-only pilot pivot," §1.

**Update (Research pass, 2026-09-18)**: 7 additional Israeli cities confirmed with a real, named, currently-active institution or recurring event series each — **Be'er Sheva, Herzliya, Holon, Akko (Acre), Eilat, Ramat Gan, Rishon LeZion**. An 8th, **Nazareth**, is included but weakly evidenced (see caveat below) — owner's call whether to include it now or wait for stronger confirmation. Rows ready to paste into the Sheet's `markets` tab: `data/seed/markets_staging_2026-09-18.csv`. Matching institution/event rows for the `sources` and `events` tabs (and one `opportunities` row) are in `data/seed/sources_staging_2026-09-18.csv`, `data/seed/events_staging_2026-09-18.csv`, `data/seed/opportunities_staging_2026-09-18.csv` — same draft/needs_verification conventions as the 2026-09-17 batch, review before pasting into the live Sheet tabs (strip the extra `notes`/`recurrence`/`expected_next_open` columns from the `events` file first — the live `events` tab only takes the columns in `sync_sheet_to_supabase.py`'s `ALLOWED_COLUMNS["events"]`). **Nazareth caveat**: the one institution found (Mahmoud Darwish Cultural Center) is real (confirmed via an independent Nazareth tourism site, address/phone verified) but its current-year event schedule and an official venue website could not be confirmed this session — see `src_080`'s notes. Full source-by-source evidence and per-city counts are in the Research department's response to the task that produced this (not duplicated into a new `docs/` file, per instructions not to write report files).

### Step 4f: Event-type vocab additions (Task 13, run 2026-09-18) — 2 new rows to paste into the Sheet

**Live re-check done** (`select category, value, label, sort_order from vocab where category = 'event_type' order by sort_order;` via `npx supabase db query --linked`, 2026-09-18). Confirmed exactly 11 rows, unchanged since 2026-09-17: `workshop, class, lab, masterclass, performance, concert, showing, exhibition, festival, talk, club`.

Mapping your 7 named categories (workshops, lectures, masterclasses, courses, performances, theatre, dance) against those 11:

- **Already covered, no action**: workshops → `workshop`, masterclasses → `masterclass`, performances → `performance`.
- **Covered under a different label — curate using the existing value, don't add a new one**: when you or whoever fills in the Sheet's `events` tab has a **lecture**, tag its `event_type` as `talk` (already exists). When you have a **course**, tag it `class` (already exists). These pairs describe the same real-world thing for this app's purposes; adding separate values would just split one bucket into two for no user-facing benefit. (Judgment call — logged with reasoning in `docs/DECISIONS.md` under "Task 13".)
- **Genuinely missing — 2 new rows needed**: **theatre** and **dance** (as event types — this is different from the `dance` *discipline* value that already exists; a discipline says what artistic field it's in, an event type says what kind of event it is, e.g. a dance-discipline event could be a workshop, a performance, or a lecture about dance).

**Action needed — add these 2 rows to the Google Sheet's `vocab` tab** (columns: `category, value, label, sort_order` — exact column names the sync script expects, paste as-is):

| category | value | label | sort_order |
|---|---|---|---|
| event_type | theatre | Theatre | 12 |
| event_type | dance | Dance | 13 |

No migration, no code deploy needed for these two rows once the sync script fix below is live — the sync pipeline picks them up on its next run.

**Important prerequisite bug found and fixed while running this task (do not skip)**: the sync script (`scripts/sync_sheet_to_supabase.py`) had a hardcoded list of "valid" vocab categories that did not include `event_type` at all — so before this fix, pasting the two rows above into the Sheet would have made every sync run **fail validation and exit with an error**, and the rows would never have reached the database. This is fixed in the same PR as this doc update (`VALID_VOCAB_CATEGORIES` now includes `event_type`), with a regression test added. No action needed from you for this part — just flagging that it was broken and is now fixed.

**Separate, bigger bug found — needs its own follow-up task, not fixed here (out of this task's scope)**: reading `scripts/sync_sheet_to_supabase.py`'s `main()` function, the list of tabs it actually fetches and syncs is hardcoded to `["markets", "sources", "opportunities"]` — it **never fetches or syncs the `vocab` or `events` tabs at all**, on any run, scheduled or manual. Both `.github/workflows/sync.yml` and `.github/workflows/data_sync.yml` just call the script with no arguments, so this is the real, current behavior in production, not a hypothetical. Practically, this means: every `vocab` row and every `events` row that exists in the live database today got there by a migration (`0002`–`0004` for vocab, `0003` for events) writing directly to the table, never via the Sheet+sync pipeline the docs describe. **This means the 2-row addition above will not actually reach the database just by editing the Sheet and waiting for the next scheduled sync** — the sync script needs a further code fix (adding `"vocab"` and `"events"` to that tab list) before the Sheet becomes the true source of truth for either table, as the architecture doc (`docs/HANDOFF_V3.md` Part D) describes it should be. This is a meaningful, separate fix (changes what a scheduled production job writes to two curated tables, needs its own careful review before going live) and was intentionally **not** made silently inside this task, and per `AGENTS.md` rule 5 / Task 13's own explicit instructions, a migration or a one-off manual SQL insert into `vocab` is not the correct path for ordinary new leaf values like these two rows either — so please treat "paste the 2 rows into the Sheet's `vocab` tab" (above) and "get a follow-up task written and reviewed to add `vocab`/`events` to the sync script's tab list" as two steps that both need to happen before `theatre`/`dance` actually show up as usable event types in the app. Paste the Sheet rows now regardless (no harm in them sitting there ready), but they won't take effect until that follow-up fix ships.

### Step 4g: Confirm the real signup → profile → public-profile flow (Task 07 §10)

The Task 07 pass could not exercise the full `/signup` → email confirmation → `/profile/edit?welcome=1` → `is_public` toggle → `/a/{handle}` round trip end to end (no real inbox / live Supabase session available in that session). The code paths were read and the individual screens verified in isolation (`/signin?next=/profile/edit` routes correctly now that the nav bug is fixed; `/profile/edit`, `/a/[handle]` render as expected against seed/demo data). Since Roi is registering as the first real user per the task brief, please run this exact sequence yourself on the deployed site and note here (or in a new `docs/DECISIONS.md` entry) if any step fails: `/signup` with email+password → confirm email if required → lands on `/profile/edit?welcome=1` → fill handle/full_name/discipline, toggle `is_public` on, save → open `/a/{handle}` signed out → confirm it renders.

### Step 4: Google Service Account & Sheet Setup
1. Create a Google Cloud Service Account and download its JSON key.
2. Store the JSON key contents in GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create a Google Sheet, share it with the service account email (Viewer access), and set `GOOGLE_SHEETS_ID`.
4. Copy seed CSVs from `data/seed/` (`markets.csv`, `vocab.csv`, `sources.csv`) into the matching tabs of the Google Sheet.
5. Copy `opportunities_staging.csv` into `opportunities_staging` tab for human verification.
