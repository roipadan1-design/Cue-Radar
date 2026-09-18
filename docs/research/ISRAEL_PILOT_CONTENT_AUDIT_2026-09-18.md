# Israel-only pilot: content supply audit — 2026-09-18

Written by Research in response to the owner's urgent Israel-only-scope directive. Scope: (1)
verify the four already-curated but stalled real Israeli rows the owner flagged, (2) find any
other real, currently open dance/performance/sound/interdisciplinary opportunities in the 11
active Israeli markets (Tel Aviv, Jerusalem, Haifa, Be'er Sheva, Holon, Ramat Gan, Herzliya, Akko,
Nazareth, Eilat, Rishon LeZion).

**Output:** `data/seed/opportunities_staging_2026-09-18_israel_pilot.csv` (7 rows) and
`data/seed/sources_staging_2026-09-18_israel_pilot.csv` (3 new source rows). Column shapes match
the existing `opportunities_staging_2026-09-18.csv` / `sources_staging_2026-09-18.csv` exactly.
Every row was checked directly against the institution's own site on 2026-09-18; every row carries
its source URL and what was and wasn't confirmed in its `notes` field.

## The four stalled rows — verified

1. **Artis — International Residency Grant.** Genuinely **live and rolling** — the one row in this
   whole batch that is not off-cycle. Confirmed on `artis.art/grants_and_open_calls/program/residency`
   and its FAQ: quarterly committee reviews (Feb/May/Aug/Nov 2026), cap **USD 5,000**/applicant,
   covers fees/travel/living/supplies, apply via `grantinterface.com`. This resolves the
   inconsistency flagged in the 2026-09-17 batch (`opp_stg_031`) — it was never a single fixed
   deadline, it's rolling. New row `opp_stg_038` supersedes it.
   **Important caveat the owner should see:** Artis funds **visual artists and curators**
   specifically ("visual artists and curators who identify as being from Israel") — not dance,
   performance or sound. It's real and it's live, but it doesn't match the product's stated
   discipline priority. Worth a product call on whether to include it at all.

2. **Artis — Studio Partnership Program.** Confirmed **closed**. The 2027-placement window (Jul 15
   – Aug 31, 2026) has passed; submissions are under review; the site states outright the next call
   opens "spring of 2027, for residencies taking place in 2028." Same visual-art-only caveat as
   above. Row `opp_stg_039` updates `opp_stg_032`.

3. **Suzanne Dellal Centre Residency 2026/27.** Confirmed **off-cycle**. This is a distinct
   programme from the "1|2|3" platform already tracked (`opp_stg_033`) — it's the long-term
   choreographer residency (~3 months studio time, admin/production support, tickets). The
   residency page shows an already-concluded cohort; the Open Calls page returns zero results.
   New row `opp_stg_040`.

4. **Pitching Program 2026.** This is Suzanne Dellal's "Pitching" platform (part of the annual
   November–December "International Exposure" showcase) — Israeli choreographers pitch a future
   project to an international panel of festival/institution directors. It's real, but the site is
   **stale**: the live page still shows "Pitching 2023" content (deadline 2 June 2023) and no 2026
   cycle has been announced anywhere on the Centre's site, including the International Exposure
   overview page. There is currently no verifiable 2026 deadline to publish. New row `opp_stg_041`.

**Bottom line on Suzanne Dellal:** all three of its programmes (1|2|3, Residency, Pitching) are
off-cycle right now. That's a correct, useful finding, not a gap — the Centre is Israel's single
most important dance institution and its cycle just hasn't opened yet this year. Recheck
October–November 2026, when International Exposure dates are historically announced.

## What else I found

- **Batsheva Ensemble annual audition** (`opp_stg_042`) — closed for the current season, but the
  company states on its own site that registration for the next cycle opens "around October 2026"
  — i.e., essentially next month from today. This is the closest thing to an imminent live Israeli
  dance opportunity in the whole audit.
- **Kamea Dance Company annual audition** (`opp_stg_043`, Be'er Sheva) — closed (2026-28 season
  round already ran Feb/Mar 2026), next cycle date not published.
- **"Ba'Zman" grant** (`opp_stg_044`) — a real Tel Aviv-Yafo Municipality + Yehoshua Rabinovich
  Foundation for the Arts grant that explicitly funds dance and music/interdisciplinary performance
  (not just visual art) for city residents — the most on-brief find of the batch, but its 2026
  registration window is confirmed closed on the municipality's own page, and no 2027 date is
  published yet.
- **Checked and found nothing verifiable, currently:** Kelim Choreography Center (Bat Yam/Tel Aviv),
  Hazira Performance Art Arena, Tmuna Theatre (no open-call page found despite active 2026
  festivals — Tmuna Festival, Intimidance Festival — that may run submission calls I couldn't
  locate), Mamuta Art & Research Center (residency page has no current cycle; its dedicated
  open-call post is from 2009), Vertigo Dance Company's Eco Art Village (no residency application
  info found on-site), Israeli Center for Digital Art in Holon (residency is **invitation-only**,
  not an open call — doesn't belong in the feed regardless of cycle), AICF's Creative Excellence
  Grants/Sharett program and its dance/music scholarship auditions (real and significant, but
  `aicf.org` blocked direct fetches with a 403 in this session — needs a direct visit, not a guess),
  the Rabinovich Foundation's main visual-arts call (real, Feb 15 deadline, but visual-art only and
  Hebrew-only site resisted fetching), and HaMecarer/The Fridge's open call (its stated deadline,
  Nov 29 2025, has already passed — despite one fetch summary claiming otherwise; always check the
  date against today, 2026-09-18, not the model's own claim).

## Honest read on Israeli content supply (dance / sound / performance / interdisciplinary)

It's thin — thinner than the owner should be comfortable shipping as "the Hub" on its own. After a
real search across the flagship institutions (Suzanne Dellal, Artis) and a wide sweep of secondary
ones (Kelim, Hazira, Tmuna, Mamuta, Vertigo, Batsheva, Kamea, ICDA, AICF, Rabinovich, Tel Aviv
Municipality, The Fridge), I found exactly **one genuinely live, currently-open opportunity** in
these disciplines: the Artis Residency Grant — and it's visual-art-only by its own eligibility
text, not dance/performance/sound. Everything else real that I found is closed, off-cycle, or
invitation-only right now. Two items (Batsheva's ensemble audition, and to a lesser extent
Suzanne Dellal's cycles generally) are close to reopening in October/November 2026, which is worth
watching, not padding today.

This isn't a searching failure — Israel's dance/performance/sound field runs on a small number of
institutions (Suzanne Dellal is effectively the hub of the hub), most cycle once a year in a
narrow autumn/winter window, and September is between cycles for nearly all of them. The honest
plan is: (1) ship what's real now, labeled off-cycle where true, rolling where true; (2) put a
recheck reminder on Suzanne Dellal, Batsheva and AICF for October–November 2026 — that's when this
list will genuinely grow; (3) get AICF's actual pages open (403 in this tool) — that's the biggest
remaining unknown and plausibly the best-fit funder for Israeli dance/music artists that I could
not fully verify this session.

## Leads to chase, not included in the CSV (insufficient verification)

- AICF (`aicf.org`) — Creative Excellence Grants (Sharett), annual scholarship auditions
  (dance/music/theater), Study Abroad program. Real and significant; blocked by a 403 on direct
  fetch in this session. Needs a direct browser visit.
- Rabinovich Foundation (`rabinovichfoundation.org.il`) — real, active, Hebrew-only site; visual-art
  call confirmed via secondary sources (Feb 15 deadline) but not independently fetched; unclear if
  it funds dance/theatre directly beyond the Tel Aviv/Ba'Zman joint program already captured.
- Tmuna Theatre's 2026 festivals (Tmuna Festival, Intimidance Festival) — both real and dated for
  2026, but no submission/open-call page was found on `tmu-na.org.il` in this session; may exist
  behind a page not surfaced by search.
- Mamuta Art & Research Center (Jerusalem/Hansen House) — real, active residency space; current
  application cycle status unconfirmed (its dedicated open-call page is dated 2009).
- Vertigo Dance Company's Eco Art Village — real eco-residency space near Jerusalem/Beit Shemesh;
  no residency application details found on-site.
- Hazira Performance Art Arena and Kelim Choreography Center — both real, active Tel Aviv-area
  institutions; no open call found via search or direct fetch in this session.
