import unittest
import csv
import os
from scripts.sync_sheet_to_supabase import (
    validate_rows,
    filter_demo_rows,
    filter_columns,
    partition_by_keys,
)

class TestSyncValidation(unittest.TestCase):

    def read_csv(self, filepath):
        rows = []
        with open(filepath, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(dict(row))
        return rows

    def test_markets_seed_validation(self):
        filepath = os.path.join('data', 'seed', 'markets.csv')
        rows = self.read_csv(filepath)
        valid_rows, errors = validate_rows('markets', rows)
        self.assertEqual(len(errors), 0, f"Market validation errors: {errors}")
        self.assertEqual(len(valid_rows), 23)

    def test_vocab_seed_validation(self):
        filepath = os.path.join('data', 'seed', 'vocab.csv')
        rows = self.read_csv(filepath)
        valid_rows, errors = validate_rows('vocab', rows)
        self.assertEqual(len(errors), 0, f"Vocab validation errors: {errors}")
        self.assertGreater(len(valid_rows), 20)

    def test_sources_seed_validation(self):
        filepath = os.path.join('data', 'seed', 'sources.csv')
        rows = self.read_csv(filepath)
        valid_rows, errors = validate_rows('sources', rows)
        self.assertEqual(len(errors), 0, f"Sources validation errors: {errors}")
        self.assertEqual(len(valid_rows), 57)

    def test_opportunities_staging_validation(self):
        filepath = os.path.join('data', 'seed', 'opportunities_staging.csv')
        rows = self.read_csv(filepath)
        valid_rows, errors = validate_rows('opportunities', rows)
        self.assertEqual(len(errors), 0, f"Opportunities validation errors: {errors}")
        self.assertEqual(len(valid_rows), 16)

    def test_vocab_event_type_category_accepted(self):
        """event_type is a live vocab category (added directly to the DB by
        0003_demo_seed.sql) but was missing from VALID_VOCAB_CATEGORIES, which
        would make validate_rows reject any event_type row pasted into the
        Sheet's vocab tab as an 'invalid category' error. Regression test for
        Task 13's fix."""
        rows = [
            {"category": "event_type", "value": "theatre", "label": "Theatre", "sort_order": "12"},
        ]
        valid_rows, errors = validate_rows('vocab', rows)
        self.assertEqual(errors, [])
        self.assertEqual(len(valid_rows), 1)

    def test_markets_sync_does_not_resurrect_inactive_market_when_sheet_has_no_is_active_column(self):
        """Task 21: the Sheet's markets tab today has no is_active column at
        all. A sync run must not resurrect a market the owner parked (e.g. a
        non-Israel market flipped to is_active=false by
        supabase/migrations/0009_market_scope.sql) by silently upserting it
        back to the schema default (true). Proves the upsert payload for such
        a row omits the is_active key entirely, rather than sending False or
        True -- an omitted key is what makes Supabase's upsert leave the
        existing DB value alone."""
        rows = [
            {
                "slug": "berlin", "display_name": "Berlin", "country": "DE",
                "region": "DACH", "timezone": "Europe/Berlin", "currency": "EUR",
                "lat": "52.52", "lng": "13.405",
            },
        ]
        valid_rows, errors = validate_rows("markets", rows)
        self.assertEqual(errors, [])
        cleaned = filter_columns("markets", valid_rows)
        self.assertEqual(len(cleaned), 1)
        self.assertNotIn("is_active", cleaned[0])

    def test_markets_sync_reads_is_active_when_sheet_provides_it(self):
        """When the Sheet does have an is_active column and a row sets it,
        the sync should read and forward that explicit value (true/false),
        parsed the same way needs_verification-style boolean columns are."""
        rows = [
            {
                "slug": "tel_aviv", "display_name": "Tel Aviv", "country": "IL",
                "region": "Middle East", "timezone": "Asia/Jerusalem", "currency": "ILS",
                "lat": "32.0853", "lng": "34.7818", "is_active": "TRUE",
            },
            {
                "slug": "tokyo", "display_name": "Tokyo", "country": "JP",
                "region": "East Asia", "timezone": "Asia/Tokyo", "currency": "JPY",
                "lat": "35.6762", "lng": "139.6503", "is_active": "FALSE",
            },
        ]
        valid_rows, errors = validate_rows("markets", rows)
        self.assertEqual(errors, [])
        cleaned = filter_columns("markets", valid_rows)
        by_slug = {r["slug"]: r for r in cleaned}
        self.assertIs(by_slug["tel_aviv"]["is_active"], True)
        self.assertIs(by_slug["tokyo"]["is_active"], False)

    def test_markets_sync_blank_is_active_cell_is_preserved_not_nulled(self):
        """A row where the Sheet has the is_active column but this
        particular market's cell was left blank must also omit the key
        (preserve), not send an explicit null -- a null would violate the
        column's NOT NULL constraint and/or reset the value."""
        rows = [
            {
                "slug": "vienna", "display_name": "Vienna", "country": "AT",
                "region": "DACH", "timezone": "Europe/Vienna", "currency": "EUR",
                "lat": "48.2082", "lng": "16.3738", "is_active": "",
            },
        ]
        valid_rows, errors = validate_rows("markets", rows)
        self.assertEqual(errors, [])
        cleaned = filter_columns("markets", valid_rows)
        self.assertNotIn("is_active", cleaned[0])

    def test_partition_by_keys_splits_mixed_shape_rows_and_is_a_noop_otherwise(self):
        """Mixed-shape rows (some with is_active, some without) must be
        split into separate homogeneous-key groups before being POSTed as a
        Supabase bulk upsert, since PostgREST requires every object in one
        JSON array to share the same keys. Tabs with no sparse columns
        (e.g. vocab-shaped rows here, standing in for any non-markets tab)
        must stay in a single group, unchanged from pre-Task-21 behaviour."""
        mixed = [
            {"slug": "a", "display_name": "A"},
            {"slug": "b", "display_name": "B", "is_active": True},
            {"slug": "c", "display_name": "C"},
            {"slug": "d", "display_name": "D", "is_active": False},
        ]
        groups = partition_by_keys(mixed)
        self.assertEqual(len(groups), 2)
        for group in groups:
            keysets = {frozenset(r.keys()) for r in group}
            self.assertEqual(len(keysets), 1)
        flattened_slugs = {r["slug"] for group in groups for r in group}
        self.assertEqual(flattened_slugs, {"a", "b", "c", "d"})

        uniform = [
            {"category": "discipline", "value": "sound"},
            {"category": "discipline", "value": "dance"},
        ]
        self.assertEqual(len(partition_by_keys(uniform)), 1)

    def test_filter_demo_rows(self):
        test_rows = [
            {"title": "Real Opp", "is_demo": False},
            {"title": "Demo Opp 1", "is_demo": True},
            {"title": "Demo Opp 2", "is_demo": "TRUE"},
            {"title": "Real Opp 2", "is_demo": "false"},
        ]
        filtered = filter_demo_rows(test_rows)
        self.assertEqual(len(filtered), 2)
        self.assertEqual([r["title"] for r in filtered], ["Real Opp", "Real Opp 2"])

if __name__ == '__main__':
    unittest.main()
