# Brief for the Tokyo curator agents (2026-10-19)

The full brief is in `docs/research/japan_pilot/FABLE_CURATORS_PROMPT.md`. Read it, plus §2.3 of `FABLE_PROMPT.md` (the underground score). The short version is below.

## Goal
Find **at least 4, ideally 6**, real people who programme Tokyo's underground scene in your discipline. Each must be **verified on an official page from 2025–2026**.

## Strict rules
- **Evidence comes from pages you actually opened with WebFetch.** A search-result snippet isn't evidence.
- Each person needs an official page that names them in the role: the organisation's own site, festival credits, an official programme, or an interview in arts media. If you can't find a 2025–2026 mention, leave them out.
- **No private data:** no personal phone numbers or personal emails, no addresses, no age, no family. Links are limited to their own professional website or Instagram, if one appears on an official page. No photos.
- Don't guess a role from a single mention. Don't merge two people with similar names.
- Use the romanised name as published in English, with the Japanese name in name_ja. If no romanised name is published, skip the person and log them.
- `about` must be in your own words, 300–900 characters, English, 2–3 paragraphs separated by a blank line inside quotes. It covers current role, what they programme, recent programmes (with years), and what that means for a visiting artist. **Only facts from pages you opened.** Don't use double quotes inside a cell; use single quotes.
- Only scenes scoring 3 or higher. No commercial galleries, no mainstream promoters, no artists who don't programme.

## Already covered (don't duplicate)
Toshiki Okada (Autumn Meteorite), Kako Kishimoto (BUoY), Naoko Itoh (Session House), Nozomu Ogawa (Ongoing), Chiaki Soma (Theater Commons).
Already checked with no result, so try only with a new lead: Naohiro Ukawa/DOMMUNE (MC mention only), 芳賀菜々花/RAW PARTY (no romanised name), Ftarri owner (not named on the site), Forestlimit owner (not named), Youkobo (inactive since 2023), Dance New Air (site from 2021), Mizuyo Takamura/Token (evidence from 2024 only).

## Existing source_ids in places.csv (Tokyo)
tyo-ftarri, tyo-forestlimit, tyo-sessionhouse, tyo-autumnmeteorite, tyo-geigeki, tyo-ongoing, tyo-buoy, tyo-rawparty, tyo-dommune, tyo-20000v, tyo-nishiogi-ci, tyo-dairakudakan, tyo-miminoimi, tyo-artweektokyo, tyo-theatercommons, tyo-youkobo.
If someone's organisation isn't on this list, propose a new source_id (`tyo-<slug>`) and add a row for it in your places file.

## Output: two files only, in `docs/research/japan_pilot/results_2026-10-19/`
1. `curators_tokyo_<discipline>.csv`, with this exact header:
`curator_id,name,name_ja,role_label,market,about,disciplines,affiliations,website_url,instagram_url,evidence_url,verified_at,status,underground_score,notes`
   - curator_id = `tyo-cur-<family>-<given>` (lowercase), market = tokyo, verified_at = 2026-10-19, status = active.
   - role_label is one of: Curator, Programmer, Artistic director, Festival director, Organiser, Residency director, Booker.
   - disciplines are taken from: dance, music, sound, performance, painting, sculpture, visual_art, photography, film, theatre.
2. `places_new_tokyo_<discipline>.csv`, only for new organisations, with the places.csv header:
`source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_friendly_notes,status,last_active_evidence,evidence_url,verified_at,notes`
   Leave cells you didn't verify empty.

**Don't touch any other file** (not curators.csv, places.csv, or VERIFICATION_LOG). The main session merges everything.

## Final report (short, in English)
- How many people you checked and how many went in.
- Who you dropped and why (role not confirmed, out of scope, privacy).
- Any row with weak evidence.
Save files as you go: after every 2 verified people, write the file. Don't save everything for the end.
