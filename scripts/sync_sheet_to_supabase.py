#!/usr/bin/env python3
"""
sync_sheet_to_supabase.py
Syncs Google Sheets tabs (vocab, markets, sources, opportunities, events) to Supabase Postgres.
Supports both Google Cloud Service Account authentication and direct public Sheet CSV exports.
"""

import sys
import os
import io
import csv
import json
import argparse
import urllib.request
import urllib.error
from typing import List, Dict, Any, Tuple
from datetime import datetime

VALID_VOCAB_CATEGORIES = {"type", "discipline", "funding_type", "covers", "career_stage", "region"}

ALLOWED_COLUMNS = {
    "markets": {"slug", "display_name", "country", "region", "timezone", "currency", "lat", "lng"},
    "vocab": {"category", "value", "label", "sort_order"},
    "sources": {
        "source_id", "name", "source_type", "market", "discipline_focus",
        "tier", "website_url", "opencalls_url", "instagram_url",
        "scrape_method", "status", "needs_verification", "notes"
    },
    "opportunities": {
        "opp_id", "source_id", "title", "slug", "summary", "type",
        "discipline_flags", "city", "deadline", "funding_min", "funding_max",
        "currency", "funding_type", "covers", "application_fee",
        "eligibility_geo", "career_stage", "materials_required",
        "apply_url", "status", "verified_at", "verified_by"
    },
    "events": {
        "event_id", "market", "venue_name", "title", "event_type",
        "disciplines", "date", "time", "price_min", "ticket_url", "lat", "lng"
    }
}

TAB_GIDS = {
    "markets": "332317369",
    "vocab": "173468937",
    "sources": "1809625646",
    "opportunities": "215945914",
    "events": "1611726197"
}

def validate_rows(tab_name: str, rows: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
    valid_rows = []
    errors = []

    for idx, row in enumerate(rows, start=2):
        if not any(row.values()):
            continue

        if tab_name == "markets":
            required = ["slug", "display_name", "country", "region", "timezone", "currency"]
            missing = [f for f in required if not row.get(f)]
            if missing:
                errors.append(f"Row {idx} in markets missing required fields: {missing}")
                continue
            row["lat"] = float(row.get("lat") or 0.0)
            row["lng"] = float(row.get("lng") or 0.0)
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
            if not row.get("market"):
                row["market"] = None
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
                else:
                    row[date_field] = None

            if not row.get("city"):
                row["city"] = None

            for num_field in ["funding_min", "funding_max"]:
                val = row.get(num_field)
                if val:
                    try:
                        row[num_field] = float(val)
                    except ValueError:
                        row[num_field] = None
                else:
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

def fetch_tab_records(sheet_id: str, tab_name: str, service_acc_json: str = None) -> List[Dict[str, Any]]:
    if service_acc_json:
        import gspread
        creds_dict = json.loads(service_acc_json)
        gc = gspread.service_account_from_dict(creds_dict)
        sh = gc.open_by_key(sheet_id)
        worksheet = sh.worksheet(tab_name)
        return worksheet.get_all_records()
    else:
        gid = TAB_GIDS.get(tab_name)
        if not gid:
            return []
        url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        csv_text = urllib.request.urlopen(req).read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(csv_text))
        return list(reader)

def filter_columns(tab_name: str, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    allowed = ALLOWED_COLUMNS.get(tab_name, set())
    filtered = []
    for r in rows:
        row_dict = {}
        for col in allowed:
            val = r.get(col)
            if val == "":
                row_dict[col] = None
            else:
                row_dict[col] = val
        filtered.append(row_dict)
    return filtered

def post_upsert(supabase_url: str, supabase_key: str, tab_name: str, rows: List[Dict[str, Any]]) -> None:
    if not rows:
        return
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    batch_size = 50
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        post_url = f"{supabase_url}/rest/v1/{tab_name}"
        data_bytes = json.dumps(batch).encode('utf-8')
        post_req = urllib.request.Request(post_url, data=data_bytes, headers=headers, method="POST")
        with urllib.request.urlopen(post_req) as resp:
            pass

def main():
    parser = argparse.ArgumentParser(description="Sync Google Sheet to Supabase")
    parser.add_argument("--dry-run", action="store_true", help="Validate data without writing to Supabase")
    args = parser.parse_args()

    print(f"Starting Sheet to Supabase sync pipeline (dry-run: {args.dry_run})...")

    sheet_id = os.environ.get("GOOGLE_SHEETS_ID")
    service_acc_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not sheet_id:
        print("GOOGLE_SHEETS_ID is required.")
        sys.exit(1)

    if not args.dry_run and not (supabase_url and supabase_key):
        print("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for live sync.")
        sys.exit(1)

    tabs = ["markets", "sources", "opportunities"]
    for tab_name in tabs:
        try:
            records = fetch_tab_records(sheet_id, tab_name, service_acc_json)
        except Exception as e:
            print(f"Skipping tab {tab_name}: {e}")
            continue

        valid_rows, errors = validate_rows(tab_name, records)
        if errors:
            print(f"Validation errors in {tab_name}:")
            for err in errors[:5]:
                print(f"  - {err}")
            sys.exit(1)

        cleaned_rows = filter_columns(tab_name, valid_rows)
        print(f"Tab {tab_name}: {len(cleaned_rows)} valid rows.")

        if not args.dry_run:
            try:
                post_upsert(supabase_url, supabase_key, tab_name, cleaned_rows)
                print(f"Upserted {len(cleaned_rows)} rows into {tab_name}.")
            except Exception as e:
                print(f"Error upserting {tab_name}: {e}")
                sys.exit(1)

    print("Sync completed successfully.")

if __name__ == "__main__":
    main()
