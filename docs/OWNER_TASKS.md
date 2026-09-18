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

**Important prerequisite bug found and fixed (do not skip)**: the sync script (`scripts/sync_sheet_to_supabase.py`) had a hardcoded list of "valid" vocab categories that did not include `event_type` at all — so pasting the two rows above into the Sheet would have made every sync run **fail validation and exit with an error**, and the rows would never have reached the database. Fixed (`VALID_VOCAB_CATEGORIES` now includes `event_type`), with a regression test added. No action needed from you for this part.

**Superseded by the decision in Step 4k below**: the paragraphs immediately following this one describe the `vocab`-tab-format blocker as something to be *resolved* (either reformat the Sheet's `vocab` tab or repoint the sync script at a different, correctly-shaped tab). After further investigation, the Backend/Data Engineer department recommended, and this repo now treats as decided (`docs/DECISIONS.md`, "Task 13 follow-up #2"), that `vocab` should **not** be a Sheet-synced table at all going forward — it's engineer-owned and ships via small additive migrations instead, same as it always has been in practice. The 2 rows below do **not** need to be pasted into the Sheet — see Step 4k for what actually needs to happen instead. Kept below for the historical record of how this was investigated.

**Update, same day — a second, bigger problem found: the `vocab` tab cannot sync at all yet, for a different reason.** `scripts/sync_sheet_to_supabase.py`'s `main()` function had a second bug — it only ever fetched/synced the `markets`, `sources`, and `opportunities` tabs, never `vocab` or `events`, on any run (checked both `.github/workflows/sync.yml` and `.github/workflows/data_sync.yml` — this is genuinely how every scheduled run behaves today). Investigated the git history first, per instruction, rather than guessing: this was a plain oversight from an early rewrite of the script (commit `01563f2`, "Initial commit") that swapped how the script talks to Google Sheets — the original scaffold (`2ecf53b`) correctly synced all 5 tabs, but the rewrite's tab list was accidentally trimmed to 3 even though it kept full working support for `vocab` and `events` everywhere else in the file (the per-tab validation rules, the Google-Sheet-tab-ID lookup, the allowed-columns list). No comment, commit message, or doc anywhere says this was deliberate.

Before changing the list, ran a **read-only** check against the real Sheet (no writes, just fetched what's actually in the `vocab` and `events` tabs today):
- **`events` tab: safe, now fixed.** Its columns already match everything the sync script needs (plus a few extra columns it will just ignore, e.g. `end_date`, `verified_at`). Added `"events"` to the tab list — **the next scheduled sync (or a manual run) will now actually pick up whatever rows exist in the Sheet's `events` tab.** Confirmed with a real read-only dry run against the live Sheet: `markets: 23, sources: 314, opportunities: 13, events: 0` (events tab is empty right now — see Step 4e's staged CSV for rows ready to paste in), no errors.
- **`vocab` tab: NOT safe, NOT added — please read this before doing anything with the Sheet's `vocab` tab.** The worksheet the sync script currently points to for `vocab` is not actually laid out as `category, value, label, sort_order` rows — it's a completely different sheet, one column per category with dropdown-style values listed underneath (e.g. a `discipline` column, a `region` column, etc.). If `vocab` sync were turned on as-is, **every scheduled sync would immediately fail and stop** the moment it hit that tab, which (depending on tab order) could also block `markets`/`sources`/`opportunities`/`events` from syncing in that same run — this is a real risk to the entire pipeline, not just to vocab, so it was deliberately left off. **This means the `theatre`/`dance` rows above still cannot reach the database via the Sheet yet, even after this fix** — that needs one of two things first, and I don't think it's something I should decide alone: either (a) the existing tab at that Sheet location gets reformatted to `category, value, label, sort_order` rows (which would also mean re-entering the vocab data that's actually live in the database today — the 11 `event_type` rows plus every `type`/`discipline`/`funding_type`/`covers`/`career_stage`/`region` row — as the Sheet's own record of it, since right now the Sheet's `vocab`-labeled tab holds none of that), or (b) if a correctly-formatted `vocab` tab already exists somewhere else in the same spreadsheet under a different tab, the sync script needs to be pointed at that tab's ID instead. Whoever manages the Google Sheet directly (you, or whoever set up that "dropdown reference" tab) is best placed to tell us which of these is true — flagging here rather than guessing. Paste the 2 Sheet rows above now regardless (no harm in them sitting there ready), but they won't take effect until the `vocab` tab format question above is resolved.

### Step 4k: Action needed — apply the `theatre`/`dance` vocab migration (2026-09-18)

Following up on Step 4f above: rather than pasting the `theatre`/`dance` rows into the Sheet (which, per Step 4f, wouldn't reach the database anyway — the Sheet's `vocab` tab is a different, wide dropdown-reference artifact, not a mirror of the `vocab` table), the Backend/Data Engineer department investigated three options for the real fix (reshape the Sheet's `vocab` tab; add a wide→narrow transform to the sync script; treat `vocab` as migration-seeded, matching what has actually happened every time this table has ever changed) and recommends the third — full reasoning in `docs/DECISIONS.md`, "Task 13 follow-up #2 — vocab-tab architecture decision."

`supabase/migrations/0007_vocab_event_type_theatre_dance.sql` is written and verified safe (additive, idempotent `ON CONFLICT ... DO UPDATE`, touches no existing row) but **not applied to the live database** — per this repo's standing rule, a live-project write needs your own explicit confirmation, not a task-runner's instruction alone.

**What to do**: review `supabase/migrations/0007_vocab_event_type_theatre_dance.sql`, then apply it via the Supabase SQL Editor (paste the file's contents) or `npx supabase db push --linked` (migration bookkeeping for `0001`–`0006` is already repaired and in sync, confirmed via `npx supabase migration list --linked` on 2026-09-18, so a plain push should apply just `0007`). After applying, confirm with:
```sql
select category, value, label, sort_order from vocab where category = 'event_type' order by sort_order;
```
which should now return 13 rows (the existing 11 plus `theatre` at sort_order 12 and `dance` at sort_order 13).

### Step 4g: Confirm the real signup → profile → public-profile flow (Task 07 §10)

The Task 07 pass could not exercise the full `/signup` → email confirmation → `/profile/edit?welcome=1` → `is_public` toggle → `/a/{handle}` round trip end to end (no real inbox / live Supabase session available in that session). The code paths were read and the individual screens verified in isolation (`/signin?next=/profile/edit` routes correctly now that the nav bug is fixed; `/profile/edit`, `/a/[handle]` render as expected against seed/demo data). Since Roi is registering as the first real user per the task brief, please run this exact sequence yourself on the deployed site and note here (or in a new `docs/DECISIONS.md` entry) if any step fails: `/signup` with email+password → confirm email if required → lands on `/profile/edit?welcome=1` → fill handle/full_name/discipline, toggle `is_public` on, save → open `/a/{handle}` signed out → confirm it renders.

### Step 4h: Action needed — run the Task 20 market-reassignment UPDATE (2026-09-18)

Task 20 identified **12 pre-existing `sources` rows** wrongly tagged `market='tel_aviv'` (real city was only ever in the free-text `notes` column, from before `jerusalem`/`haifa` existed as markets). Full classification, evidence, and row-by-row justification is logged in `docs/DECISIONS.md` under "Task 20 — market reassignment cleanup (2026-09-18)".

**This was not run live in this session.** Per this repo's standing rule (any live write to the shared production database needs your own explicit confirmation, not a task file's instruction alone), and per Task 20's own contingency for exactly this situation, you were reported as away from your desk (~3 hours) at dispatch time, so the change was prepared and verified but held for you.

**What to do**: review `task20_market_reassignment_update.sql` in the repo root (mirrors the `israel_pilot_data_insert.sql` pattern already used for the Israel-pilot batch) — it contains a re-verification `select`, the two `UPDATE` statements (9 rows → `jerusalem`, 2 rows → `haifa`), a post-update `select` to confirm, and `opportunities`/`events` count checks. Run it via the Supabase SQL Editor or `npx supabase db query --linked`, in order, top to bottom. One row (`SRC176`, America-Israel Cultural Foundation) was deliberately left as `tel_aviv` — notes say "city: Tel Aviv / Jerusalem," genuinely ambiguous, not guessed.

No `opportunities` rows needed the equivalent fix (checked — zero matches for these 12 source_ids with `city='tel_aviv'`). No migration file was written (this is a data correction, not a schema change). The Google Sheet was not touched — if the Sheet's own `sources` tab has the same mis-tagged rows for these institutions, that's a separate reconciliation for whoever next syncs the Sheet (not checked in this pass).

### Step 4i: Desktop layout QA finding — re-check the deployed URL, not just this PR (2026-09-18)

QA reported `/hub`, `/sources`, and an opportunity detail page rendering a fixed ~470px column pinned to the left at ≥1280px. Investigated in depth for Task 19's companion fix: the current code already has correct `max-w-[960px]`/`max-w-[720px]` + `mx-auto` centering on all three pages, verified against a clean `npm run build && npm run start` and a fresh `npm run dev` at 1000px/1280px — both render correctly centered with symmetric margins. No layout code was changed. Full investigation, including a `.next`-cache-corruption root-cause finding for this session's own dev-server misbehavior, is logged in `docs/DECISIONS.md` under "Desktop layout — investigated, not reproducible as described...". **Action needed from you**: after this PR is merged and deployed, please re-check `/hub`, `/sources`, and an opportunity detail page on the actual deployed URL at a wide window. If the narrow-pinned-left rendering is still visible there, it's most likely a stale/corrupted Vercel build artifact rather than a source-code bug — a fresh deploy (or "Redeploy" without build cache in the Vercel dashboard) should resolve it; if it doesn't, that's new information worth a fresh screenshot and a follow-up task.

### Step 4j: Demo `apply_url` still points at the pre-rebrand domain (cosmetic, low priority)

Task 19's companion fix (this session) stopped the Apply button's **label** from showing "cue-radar.vercel.app" for demo rows (now shows "Apply on the demo page"), by changing the label-generation logic in `components/hub/OpportunityDetailView.tsx`, not the underlying data. The demo rows' actual `apply_url` value (`https://cue-radar.vercel.app/demo`, set in `supabase/migrations/0003_demo_seed.sql`, already live) is untouched — clicking Apply on a demo row still opens that URL, which still correctly routes to the app's own `/demo` page (satisfies `AGENTS.md` rule 1), just via the old domain name rather than a relative path. If you'd like the literal stored value cleaned up too (e.g. to a real relative `/demo` or the current canonical domain), that needs a small additive `UPDATE` migration against the live `sources`/`opportunities`/`events` tables — flagging as optional follow-up, not done in this pass since it wasn't necessary to fix the visible bug and migrations are Backend/Data Engineer scope.

### Step 4: Google Service Account & Sheet Setup
1. Create a Google Cloud Service Account and download its JSON key.
2. Store the JSON key contents in GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create a Google Sheet, share it with the service account email (Viewer access), and set `GOOGLE_SHEETS_ID`.
4. Copy seed CSVs from `data/seed/` (`markets.csv`, `vocab.csv`, `sources.csv`) into the matching tabs of the Google Sheet.
5. Copy `opportunities_staging.csv` into `opportunities_staging` tab for human verification.
