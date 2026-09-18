-- go_live_israel_2026-09-19.sql
--
-- Owner instruction, 2026-09-19: "promote those three to live" and "delete all the demos,
-- I want a real site."
--
-- This is an OPERATIONAL script, not a migration. It deliberately does not live in
-- supabase/migrations/ because it contains DELETEs, and AGENTS.md rule 6 says migrations
-- only ever add. Same category and same location as the existing
-- task20_market_reassignment_update.sql and israel_pilot_data_insert.sql.
--
-- HOW TO RUN: paste the whole file into the Supabase SQL editor
-- (Dashboard -> SQL Editor -> New query -> Run). It is wrapped in a transaction, so it
-- either all applies or none of it does.
--
-- IS THE DELETE REVERSIBLE? Yes. Every demo row originates in
-- supabase/migrations/0003_demo_seed.sql, whose four INSERTs all carry ON CONFLICT
-- clauses and are therefore safe to re-run. Re-running that file restores the demo set
-- exactly. Nothing here touches real curated content.
--
-- WILL A SHEET SYNC UNDO THIS? No. scripts/sync_sheet_to_supabase.py is upsert-only
-- (Prefer: resolution=merge-duplicates) and never issues DELETEs, so the three rows
-- inserted below survive later syncs, and the deleted demo rows are not resurrected
-- unless the Sheet itself contains them.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. The three institutions behind the three real calls
-- ---------------------------------------------------------------------------

INSERT INTO public.sources
  (source_id, name, source_type, market, discipline_focus, tier,
   website_url, opencalls_url, status, needs_verification, is_demo, notes)
VALUES
  ('SRC333',
   'Ralli Museum Caesarea',
   'institution',
   'caesarea',
   ARRAY['painting','sculpture','sound','dance','interdisciplinary']::TEXT[],
   2,
   'https://www.rallimuseums.com/',
   'https://friends.rallimuseums.com/psychomagic',
   'active', false, false,
   'Verified 2026-09-19 on the museum''s own landing page. Rothschild Blvd, Caesarea (next to the water tower); 04-6261013; caesarea@rallimuseums.com.'),

  ('SRC334',
   'Ministry of Culture and Sport - Otzrot Tarbut',
   'funder',
   'jerusalem',
   ARRAY['music','performance','dance','interdisciplinary']::TEXT[],
   1,
   'https://www.gov.il/he/pages/tculturallocal_26',
   'https://mofett.co.il/apply',
   'active', false, false,
   'Verified 2026-09-19 on gov.il, which marks the call status as active, published 19.07.2026. National programme. Distinct from SRC183 (Fund for Independent Creators), a different programme from the same ministry.'),

  ('SRC335',
   'Israeli Hashaa Theatre',
   'institution',
   NULL,
   ARRAY['performance','interdisciplinary']::TEXT[],
   2,
   NULL,
   'https://www.facebook.com/teatronhashaa/',
   'active', true, false,
   'Added 2026-09-19. market is NULL on purpose: the theatre''s home city was not stated on the post carrying the call, and guessing it would be inventing data. Submissions go to sharon@hashaa.com.')
ON CONFLICT (source_id) DO UPDATE SET
  name = EXCLUDED.name,
  source_type = EXCLUDED.source_type,
  market = EXCLUDED.market,
  discipline_focus = EXCLUDED.discipline_focus,
  tier = EXCLUDED.tier,
  website_url = EXCLUDED.website_url,
  opencalls_url = EXCLUDED.opencalls_url,
  status = EXCLUDED.status,
  needs_verification = EXCLUDED.needs_verification,
  notes = EXCLUDED.notes;

-- ---------------------------------------------------------------------------
-- 2. The three real, currently-open calls, inserted as status = 'live'
-- ---------------------------------------------------------------------------
-- The hub_feed view shows a row only when status = 'live' AND (deadline IS NULL OR
-- deadline >= CURRENT_DATE), so all three below will appear in the Hub immediately.

INSERT INTO public.opportunities
  (opp_id, source_id, title, slug, summary, type, discipline_flags, city, deadline,
   funding_min, funding_max, currency, funding_type, covers, application_fee,
   eligibility_geo, career_stage, materials_required, apply_url, status,
   verified_at, verified_by, is_demo, recurrence)
VALUES
  ('opp-il-2026-006', 'SRC333',
   'The Psychomagic Art Lab - Ralli Museum Caesarea',
   'psychomagic-art-lab-ralli-museum-caesarea-2026',
   'Three monthly sessions at Ralli Museum Caesarea exploring the link between making, imagination and healing, inspired by Alejandro Jodorowsky''s psychomagic. Led by Uri Sivan, Ari Folman and Mor Kadishzon with senior artists. Each participant develops a new "psychomagic act", culminating in a group exhibition at the museum in March 2027. Free to participate; places are limited and entry is by selection.',
   'lab_workshop',
   ARRAY['sound','dance','painting','sculpture','interdisciplinary']::TEXT[],
   'caesarea',
   DATE '2026-10-20',
   NULL, NULL, 'ILS', 'in_kind',
   ARRAY[]::TEXT[],
   0,
   ARRAY['IL']::TEXT[],
   'any',
   ARRAY['CV (PDF, max 1 page)','Three previous works','Intro video 3-5 min (hosted link)','Portfolio or website link']::TEXT[],
   'https://friends.rallimuseums.com/psychomagic',
   'live', DATE '2026-09-19', 'claude', false, 'one_off'),

  ('opp-il-2026-007', 'SRC334',
   'Otzrot Tarbut - call for artists, producers and cultural institutions',
   'otzrot-tarbut-ministry-of-culture-database',
   'The Ministry of Culture and Sport is building a national digital database of cultural events that local authorities book from, across six fields: music, theatre and fringe, dance, cinema, literature, and visual art and museums. The call seeks professional performances meeting the threshold conditions, assessed by professional quality committees in each field.',
   'open_call',
   ARRAY['music','performance','dance','interdisciplinary']::TEXT[],
   'jerusalem',
   NULL,
   NULL, NULL, 'ILS', 'in_kind',
   ARRAY[]::TEXT[],
   0,
   ARRAY['IL']::TEXT[],
   'any',
   ARRAY[]::TEXT[],
   'https://mofett.co.il/apply',
   'live', DATE '2026-09-19', 'claude', false, 'rolling'),

  ('opp-il-2026-008', 'SRC335',
   'Soliko BiShnayim 2027 - call for new work',
   'soliko-bishnayim-2027',
   'Open call from the Israeli Hashaa Theatre for new ideas to be brought to the stage. Proposals are sent by email to sharon@hashaa.com.',
   'open_call',
   ARRAY['performance','interdisciplinary']::TEXT[],
   NULL,
   DATE '2026-10-06',
   NULL, NULL, 'ILS', 'in_kind',
   ARRAY[]::TEXT[],
   0,
   ARRAY['IL']::TEXT[],
   'any',
   ARRAY[]::TEXT[],
   'https://www.facebook.com/teatronhashaa/posts/1517513207060655',
   'live', DATE '2026-09-19', 'claude', false, 'annual')
ON CONFLICT (opp_id) DO UPDATE SET
  status = EXCLUDED.status,
  deadline = EXCLUDED.deadline,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  apply_url = EXCLUDED.apply_url,
  verified_at = EXCLUDED.verified_at,
  verified_by = EXCLUDED.verified_by;

-- ---------------------------------------------------------------------------
-- 3. Remove every demo row
-- ---------------------------------------------------------------------------
-- Order matters. opportunities.source_id CASCADEs from sources, and
-- user_saved_opportunities.opp_id CASCADEs from opportunities, so deleting
-- opportunities first also cleans up anything a user had saved against a demo row.
-- `vocab` rows seeded by 0003 are left alone: they are category values, not content,
-- and nothing user-facing shows them as fictional.

DELETE FROM public.opportunities WHERE is_demo = true;
DELETE FROM public.events        WHERE is_demo = true;
DELETE FROM public.sources       WHERE is_demo = true;

COMMIT;

-- ---------------------------------------------------------------------------
-- Verify (run separately after the transaction commits)
-- ---------------------------------------------------------------------------
-- Expect: demo_opportunities = 0, demo_sources = 0, demo_events = 0,
--         and live_israeli_feed = 3.
--
-- SELECT
--   (SELECT count(*) FROM public.opportunities WHERE is_demo) AS demo_opportunities,
--   (SELECT count(*) FROM public.sources       WHERE is_demo) AS demo_sources,
--   (SELECT count(*) FROM public.events        WHERE is_demo) AS demo_events,
--   (SELECT count(*) FROM public.hub_feed f
--      LEFT JOIN public.markets m ON m.slug = f.city
--     WHERE m.is_active IS TRUE OR f.city IS NULL)            AS live_israeli_feed;
