#!/usr/bin/env python3
"""
sync_sheet_to_supabase.py
Syncs Google Sheets tabs (vocab, markets, sources, opportunities, events) to Supabase Postgres.
"""

import sys
import os
import json
import argparse
from typing import List, Dict, Any, Tuple
from datetime import datetime

VALID_VOCAB_CATEGORIES = {"type", "discipline", "funding_type", "covers", "career_stage", "region"}

def validate_rows(tab_name: str, rows: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    valid_rows = []
    errors = []

    for idx, row in enumerate(rows, start=2):
        if not any(row.values()):
            continue

        if tab_name == "markets":
            required = ["slug", "display_name", "country", "region", "timezone", "currency", "lat", "lng"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in markets missing required fields: {missing}")
                continue
            row["lat"] = float(row["lat"])
            row["lng"] = float(row["lng"])
            valid_rows.append(row)

        elif tab_name == "vocab":
            required = ["category", "value", "label"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in vocab missing required fields: {missing}")
                continue
            if row["category"] not in VALID_VOCAB_CATEGORIES:
                errors.append(f"Row {idx} in vocab invalid category '{row['category']}'")
                continue
            row["sort_order"] = int(row.get("sort_order") or 0)
            valid_rows.append(row)

        elif tab_name == "sources":
            required = ["source_id", "name", "source_type", "status"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in sources missing required fields: {missing}")
                continue

            disc_str = row.get("discipline_focus", "")
            row["discipline_focus"] = [d.strip() for d in disc_str.split(",") if d.strip()] if isinstance(disc_str, str) else disc_str
            row["tier"] = int(row.get("tier") or 2)
            row["needs_verification"] = str(row.get("needs_verification", "")).upper() in ("TRUE", "1", "YES")
            valid_rows.append(row)

        elif tab_name == "opportunities":
            required = ["opp_id", "source_id", "title", "slug", "type", "apply_url", "application_fee"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in opportunities missing required fields: {missing}")
                continue

            try:
                row["application_fee"] = float(row.get("application_fee") or 0)
            except ValueError:
                errors.append(f"Row {idx} in opportunities invalid application_fee")
                continue

            for array_field in ["discipline_flags", "covers", "eligibility_geo", "materials_required"]:
                val = row.get(array_field, "")
                if isinstance(val, str):
                    row[array_field] = [item.strip() for item in val.split(",") if item.strip()]

            for date_field in ["deadline", "verified_at", "created_at"]:
                d_val = row.get(date_field)
                if d_val:
                    try:
                        datetime.strptime(d_val, "%Y-%m-%d")
                    except ValueError:
                        errors.append(f"Row {idx} in opportunities invalid date for {date_field}: '{d_val}'")

            for num_field in ["funding_min", "funding_max"]:
                val = row.get(num_field)
                if val:
                    try:
                        row[num_field] = float(val)
                    except ValueError:
                        row[num_field] = None

            valid_rows.append(row)

        elif tab_name == "events":
            required = ["event_id", "venue_name", "title", "event_type", "date"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in events missing required fields: {missing}")
                continue

            disc_str = row.get("disciplines", "")
            row["disciplines"] = [d.strip() for d in disc_str.split(",") if d.strip()] if isinstance(disc_str, str) else disc_str
            valid_rows.append(row)

    return valid_rows, errors

def main():
    parser = argparse.ArgumentParser(description="Sync Google Sheet to Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Validate data without writing to Supabase")
    args = parser.parse_args()

    print(f"Starting Sheet to Supabase sync pipeline (dry-run: {args.dry_run})...")

    sheet_id = os.environ.get("GOOGLE_SHEETS_ID")
    service_acc_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not args.dry_run and not (sheet_id and service_acc_json and supabase_url and supabase_key):
        print("Missing required environment variables for live sync. Running validation check in dry-run mode.")
        args.dry_run = True

    if args.dry_run and not (sheet_id and service_acc_json):
        print("Dry run complete (no Google Sheet credentials provided to test live sheet).")
        return

    import gspread
    from supabase import create_client

    creds_dict = json.loads(service_acc_json)
    gc = gspread.service_account_from_dict(creds_dict)
    sh = gc.open_by_key(sheet_id)
    supabase = create_client(supabase_url, supabase_key) if not args.dry_run else None

    tabs = ["vocab", "markets", "sources", "opportunities", "events"]
    pk_map = {
        "vocab": "category,value",
        "markets": "slug",
        "sources": "source_id",
        "opportunities": "opp_id",
        "events": "event_id"
    }

    for tab_name in tabs:
        try:
            worksheet = sh.worksheet(tab_name)
            records = worksheet.get_all_records()
        except Exception as e:
            print(f"Skipping tab {tab_name}: {e}")
            continue

        valid_rows, errors = validate_rows(tab_name, records)
        if errors:
            print(f"Validation errors in {tab_name}:")
            for err in errors:
                print(f"  - {err}")
            sys.exit(1)

        print(f"Tab {tab_name}: {len(valid_rows)} valid rows.")

        if not args.dry_run and supabase:
            on_conflict = pk_map[tab_name]
            supabase.table(tab_name).upsert(valid_rows, on_conflict=on_conflict).execute()
            print(f"Upserted {len(valid_rows)} rows into {tab_name}.")

    print("Sync completed successfully.")

if __name__ == "__main__":
    main()
