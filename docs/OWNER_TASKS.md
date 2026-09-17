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

### Step 4c: Apply the source-recurrence migration (Task 08, 2026-09-17)
`supabase/migrations/0005_source_recurrence.sql` adds `opportunities.recurrence` (nullable enum: `annual`/`biennial`/`rolling`/`one_off`) and `opportunities.expected_next_open` (nullable date), and recreates `hub_feed` to expose both. It is additive/idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE OR REPLACE VIEW`) and does not touch or guess a value for any existing row — both columns stay `NULL` on every row until filled in by hand via the sheet's `opportunities` tab (optional columns; leaving them blank is fine, the sync script does not require them).

**Not applied to the live database in this session** (see the task report for why — pending your confirmation to run it, per this repo's live-migration rule). To apply:
- **SQL Editor (matches how 0001–0004 were applied)**: paste the contents of `supabase/migrations/0005_source_recurrence.sql` into the Supabase SQL Editor and run it.
- **Via CLI**: `npx supabase migration repair --status applied 0001 0002 0003 0004` once, then `npx supabase db push`.

Verify after applying: `select column_name, data_type from information_schema.columns where table_name = 'opportunities' and column_name in ('recurrence', 'expected_next_open');` — expect both rows back.

### Step 4d: Apply the Discover/Connect `follows` migration (Task 10, 2026-09-17)
`supabase/migrations/0006_follows.sql` creates the `follows` table (one-directional, private follow bookkeeping between two profiles — no public follower count, no messaging) with RLS restricting `select` to the two parties in the row and `insert`/`delete` to the follower only. Additive only (`CREATE TABLE IF NOT EXISTS`).

**Not applied to the live database in this session** (same pending-confirmation reason as Step 4c). To apply:
- **SQL Editor**: paste the contents of `supabase/migrations/0006_follows.sql` into the Supabase SQL Editor and run it.
- **Via CLI**: same repair-then-push as Step 4c (`0005` and `0006` can be pushed together once the migration-history repair has run once).

Verify after applying: `select tablename, policyname, cmd, qual from pg_policies where tablename = 'follows';` — expect exactly three policies (select/insert/delete), none with a public (`USING (true)`) qualifier.

### Rebrand follow-up: custom domain for the new name "Fellow." (2026-09-17)
The app-facing product name was renamed from "Cue Radar" to "Fellow." (see `docs/DECISIONS.md` "Rebrand" entry) — code/UI only. The site still lives at the existing `cue-radar.vercel.app` URL (and `feedback@cueradar.com`, Supabase `Site URL`, GitHub repo name, and Vercel project name were all deliberately left untouched — out of scope for this task). Whether/when to buy and wire up a domain matching "Fellow." (and whether to update the Supabase Auth **Site URL**/**Redirect URLs** in Step 1 and `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_FEEDBACK_EMAIL` in Step 3 to match) is a future decision for the owner — not done here.

### Step 4: Google Service Account & Sheet Setup
1. Create a Google Cloud Service Account and download its JSON key.
2. Store the JSON key contents in GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create a Google Sheet, share it with the service account email (Viewer access), and set `GOOGLE_SHEETS_ID`.
4. Copy seed CSVs from `data/seed/` (`markets.csv`, `vocab.csv`, `sources.csv`) into the matching tabs of the Google Sheet.
5. Copy `opportunities_staging.csv` into `opportunities_staging` tab for human verification.
