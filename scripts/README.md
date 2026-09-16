# Google Sheet → Supabase Sync Pipeline

This script (`scripts/sync_sheet_to_supabase.py`) reads curated data from Google Sheets and mirrors it into Supabase Postgres.

## Setup & Environment
Requires the following secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

## Local Testing
To test validation without network calls:
```bash
python3 -m unittest scripts/test_sync_validation.py
```
