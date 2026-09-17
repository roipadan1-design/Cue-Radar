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

### Step 4a: Apply the discipline taxonomy migration (2026-09-16)
`supabase/migrations/0004_discipline_taxonomy.sql` (new discipline vocab: Sound, Music, Performance, Dance, Painting, Sculpture — see `docs/DECISIONS.md` "Discipline taxonomy change") is written and verified safe, but was **not applied** to the live database in this session.

Why manual: migrations `0001`–`0003` were applied by hand via the Supabase SQL Editor rather than `supabase db push`, so the CLI's migration-history table has no record of them. Running `supabase db push` now tries to replay `0001_core.sql` from scratch and fails on `CREATE POLICY ... already exists`, since those objects are already live. This session's sandbox also would not permit the fix (`supabase migration repair --status applied 0001 0002 0003`) as a live-project action.

Two ways to finish this — pick one:
- **Simplest (matches how 0001–0003 were applied)**: open the Supabase SQL Editor and run the contents of `supabase/migrations/0004_discipline_taxonomy.sql` directly. It is additive/idempotent (`ADD COLUMN IF NOT EXISTS`, `ON CONFLICT ... DO UPDATE`, a scoped `UPDATE`), safe to run as-is.
- **Via CLI**: run `npx supabase migration repair --status applied 0001 0002 0003` once (updates only the CLI's bookkeeping table, executes no schema SQL), then `npx supabase db push` to apply `0004`.

After applying, verify with: `select category, value, label, sort_order, deprecated from vocab where category = 'discipline' order by sort_order;` — expect 6 rows with `deprecated = false` (sound, music, performance, dance, painting, sculpture) and 4 rows with `deprecated = true` (choreography, live_electronics, installation, interdisciplinary).

### Step 4b: `/radar/[city]` and event calendar links need `0003` applied (2026-09-17)
Confirmed live (queried the DB directly): `supabase/migrations/0003_demo_seed.sql` from Step 2 above is still **not applied** — the `events` table is empty, `vocab` has no `event_type` category, and `hub_feed` has no `is_demo` column. The new `/radar/[city]` page (Trip Radar v1, Task 06 §7.2) and `app/events/[id]/ics/route.ts` are built and were verified against the live `hub_feed` data (real opportunities show up correctly), but the "Workshops & classes" and "On stage & exhibitions" sections will stay empty — correctly rendering nothing rather than an error — until `0003` is applied. Same fix as Step 2 / Step 4a: paste `0003_demo_seed.sql` into the Supabase SQL Editor (it's additive/idempotent), or run `npx supabase migration repair --status applied 0001 0002` then `npx supabase db push` to apply both `0003` and `0004` via the CLI.

### Rebrand follow-up: custom domain for the new name "Fellow." (2026-09-17)
The app-facing product name was renamed from "Cue Radar" to "Fellow." (see `docs/DECISIONS.md` "Rebrand" entry) — code/UI only. The site still lives at the existing `cue-radar.vercel.app` URL (and `feedback@cueradar.com`, Supabase `Site URL`, GitHub repo name, and Vercel project name were all deliberately left untouched — out of scope for this task). Whether/when to buy and wire up a domain matching "Fellow." (and whether to update the Supabase Auth **Site URL**/**Redirect URLs** in Step 1 and `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_FEEDBACK_EMAIL` in Step 3 to match) is a future decision for the owner — not done here.

### Step 4: Google Service Account & Sheet Setup
1. Create a Google Cloud Service Account and download its JSON key.
2. Store the JSON key contents in GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create a Google Sheet, share it with the service account email (Viewer access), and set `GOOGLE_SHEETS_ID`.
4. Copy seed CSVs from `data/seed/` (`markets.csv`, `vocab.csv`, `sources.csv`) into the matching tabs of the Google Sheet.
5. Copy `opportunities_staging.csv` into `opportunities_staging` tab for human verification.
