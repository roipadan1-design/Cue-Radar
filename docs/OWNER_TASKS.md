# Owner Action Items

This document tracks all tasks that require manual action by the repository owner (e.g., secret setup, external service provisioning).

---

## Day-One Checklist

### Step 1: Provision Supabase Project
1. Create or confirm your Supabase project.
2. Enable Google Provider in **Authentication -> Providers**.
3. Add Site URL and Redirect URLs (`http://localhost:3000/auth/callback` and your production domain).

### Step 2: Apply Database Migrations
If `SUPABASE_ACCESS_TOKEN` is not provided to the agent, execute the migration files in order via the Supabase SQL Editor:
1. `supabase/migrations/0001_core.sql`
2. `supabase/migrations/0002_seed_vocab_markets.sql`

### Step 3: Configure Environment Variables & Secrets
Set the following environment variables:
- **Vercel & Local (`.env.local`)**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
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
