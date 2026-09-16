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

### Step 4: Google Service Account & Sheet Setup
1. Create a Google Cloud Service Account and download its JSON key.
2. Store the JSON key contents in GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`.
3. Create a Google Sheet, share it with the service account email (Viewer access), and set `GOOGLE_SHEETS_ID`.
4. Copy seed CSVs from `data/seed/` (`markets.csv`, `vocab.csv`, `sources.csv`) into the matching tabs of the Google Sheet.
5. Copy `opportunities_staging.csv` into `opportunities_staging` tab for human verification.
