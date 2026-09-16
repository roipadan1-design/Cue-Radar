import unittest
import csv
import os
from scripts.sync_sheet_to_supabase import validate_rows, filter_demo_rows

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
