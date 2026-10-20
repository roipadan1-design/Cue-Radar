# Follow-up research for Fellow.: contacts, people, events, places (Tokyo + Kyoto)

> This single file is everything you need. You have no prior knowledge of this project. Read it
> completely before you start. Part A is the background and the rules, Parts B to D are your tasks,
> Part E lists what we already have so that you do not repeat it. If anything is missing, say so in
> your report. Do not guess.
>
> Language of deliverables: English (names also in the local script where asked).
> Time order: **finish and save Task 1 before Task 2, and so on.** Save the output file after every
> ~15 verified rows. Today is **2026-10-21**; use real dates from pages you open.

## What happened before (short)

Three research rounds already delivered: organisations (`places`), events, and people (`curators`)
for **Tokyo and Kyoto only**. They are loaded in the product. Current counts: 83 organisations,
141 events, 35 people. Those rounds had two weaknesses that this round fixes:

1. **Contact routes are missing.** The product now shows a "Contact" section on every person and
   organisation page, and almost all of them have only the organisation's home page. We need real,
   public, professional contact routes (e-mail, contact form, Instagram, website). **This is the
   most important task (Task 1).**
2. **Too few people and too few events.** Only 9 of a target of 35 new people were verified in the
   last round (strict "2025–2026 evidence" rule); events for December were thin.

**Out of scope, do not spend time on:** finding street addresses for venues that only appear on
Tokyo Gig Guide (Permian, Knuttel House, Oriental Force, Bar Isshee, OTOOTO, Chitei). The owner
decided to drop that. Also: Osaka, Kobe and Nara are NOT targets, not even as day trips (Yokohama
is allowed as a Tokyo day trip, filed under `tokyo`). Other cities are parked.

## Tasks, in priority order

### Task 1: Contact routes for everyone we already show (most important)

**1a. People.** All 35 rows in E.2 (include inactive ones; check whether the role is still valid).
For each person find the legitimate public ways to contact them, in this order:
(a) personal or professional website / portfolio; (b) Instagram (confirm per Part A §6.2);
(c) e-mail published for professional contact (Part A §6.1): check the person's own site, the
organisation's staff or contact page, the programme or open-call page they run, festival press
pages; (d) contact form on their own or their organisation's site; (e) the organisation's official
contact page or role address as the fallback.
Also re-check the role: does a page from **2025 or 2026** still name them in this role? Record it.
Note any new organisation they work with in `new_affiliations_found`.
Known leads from last round (not yet opened): `chelfitsch.net` (Toshiki Okada), `makigami.com`
(Koichi Makigami; he currently has NO route and the festival moved to `jazzartsengawa.org`),
`kotayamazaki.com` (Kota Yamazaki), `minanishimura.com` (Mina Nishimura). Official contact pages to
look for: kyoto-ex.jp contact, haps-kyoto.com consultation form, kac.or.jp inquiry page, buoy.or.jp,
session-house.net, ongoing.jp, bodyartslabo.com, contactimprov-nn.com, the5thfloor.org,
dommune.com, miminoimi.me, borofesta.jp, kunstarzt.com, xyzcollective.jp, 4-6-4-9.jp (NOT opened
yet; open it first), monochromecircus.com, askyoto.or.jp/e9. Search in Japanese too:
`<name_ja> 連絡先`, `<name_ja> お問い合わせ`, `<name_ja> ポートフォリオ`, `<organisation> スタッフ`.

Output `contacts_people.csv`, one row per person, **all 35 rows even if you found nothing**:
```
curator_id,name,website_url,portfolio_url,instagram_url,instagram_evidence,instagram_candidate_url,contact_email,email_type,email_evidence_url,contact_form_url,org_contact_url,other_links,best_contact_route,identity_confidence,role_still_valid,role_evidence_url,new_affiliations_found,contact_notes,checked_at
```
Column rules: `instagram_evidence` = `linked_from_site`, `bio_links_back` or `credited_by_org` plus the
proving URL. `instagram_candidate_url` holds a plausible but unconfirmed account (then
`identity_confidence = low` and `instagram_url` stays empty). `email_type` = `personal_published`
or `organisation_role` or empty. `best_contact_route` = one of `email_personal`, `email_org`,
`contact_form`, `website`, `instagram`, `org_page`, `none`. `role_still_valid` = `yes`, `unclear`,
`no`. `new_affiliations_found` = `Name (website)` separated by ` | `.

**1b. Organisations.** Every **active** organisation in E.1 (skip `closed`). Find: official contact
e-mail (usually `info@`), contact form, Instagram (confirm per §6.2), calendar URL if missing, and
public venue phone and street address (allowed for organisations). Start with the ones that have no
website or Instagram in the list. Output `contacts_places.csv`:
```
source_id,name,website_url,instagram_url,instagram_evidence,contact_email,email_type,email_evidence_url,contact_form_url,phone_public,address_public,calendar_url,best_contact_route,still_active,activity_evidence_url,contact_notes,checked_at
```
`email_type` is `organisation_role` or `personal_published`. `still_active` = `yes`, `unclear` or
`closed` with the page that shows it.

### Task 2: New people (target 26 more; quality over quantity)

Everyone with a managerial or programming role in our fields, not only "curators": curators of
artist-run spaces and independent galleries, programmers and bookers of music venues, live houses
and clubs, festival directors and producers, **residency directors (especially dance and
performance residencies)**, venue and studio directors, **producers of art events**, organisers of
recurring parties, improv series and dance labs, education leads, public programme officers at
funders (only when the funder's own page names them), and platform or network directors.
Role categories (`role_category`): `curator`, `programmer_booker`, `festival_leadership`,
`residency_leadership`, `venue_leadership`, `producer`, `organiser_collective`, `education_lead`,
`programme_officer`, `platform_leadership`.

Targets: Tokyo 14, Kyoto 12 (new, on top of E.2). **Fields still missing and to be filled first:**
music-club bookers and DIY promoters, sound / noise / ambient series organisers, residency
directors, film and video-art people, photography, theatre. Dance and exhibitions are already
represented; add only strong ones.

Quality gate per person (all must be true): a page from **2025 or 2026** names them in this role at
this organisation; you can say in one sentence of fact what they programme or run; at least one
legitimate contact route exists (if none, you may still include them with
`best_contact_route = none`, but this should be rare); not already in E.2 (match name and
organisation); underground score at least 3; a romanised name is published somewhere (otherwise log
as skipped).

Candidate leads from last round, **not yet verified, do not import without opening the pages**:
Tokyo: Art Center Ongoing staff beyond Nozomu Ogawa; mumei (Fuyumi Murata); LAVENDER OPENER CHAIR;
im labor; Fig.; HAGISO (Mitsuyoshi Miyazaki); Tokyo Arts and Space residency staff (institution,
score 3); Totem Pole Photo Gallery; Place M (Masato Seto, all sources found were 2017-22, needs a
2025-26 page); Image Forum Festival (film; open imageforum.co.jp); Ochiai Soup; Velvet Sun;
Forestlimit bookers; Nanahari; Dance New Air; NPO Dance Archive Network (Toshio Mizohata, newest
dated item 2022); LAND FES (Dai Matsuoka, last seen 2019); Youkobo Art Space (Hiroko and Tatsuhiko
Murata; venue listed as closed or on hiatus, status unclear); Yota Kageyama (THEATRE E9 general
manager; decide if "programmer" fits). Kyoto: Soda (Kazuto Tanaka); UrBANGUILD owner or booker;
KYOTOGRAPHIE / KG+ (Lucille Reyboz, Yusuke Nakanishi; score 3); Social Kitchen / Hanare; VOU (no
official page names a director yet); Lumen gallery (film / video); Live House nano (Mogura's
venue); ANTIBODIES Collective (Yoko Higashino, Toshio Kajiwara; latest item Jan 2024); Yoshitaka
Yazu (kumagusuku; current role unverified). Do NOT add Taiki Murakami (his E9 appointment fell
through) or Takao Kawaguchi (no current programming role found).

Output `people_new.csv`, header exactly:
```
curator_id,name,name_ja,role_label,role_category,market,about,disciplines,affiliations,website_url,portfolio_url,instagram_url,instagram_evidence,contact_email,email_type,email_evidence_url,contact_form_url,other_links,best_contact_route,evidence_url,verified_at,status,underground_score,notes
```
`curator_id` = `<city3>-cur-<family>-<given>` (`tyo-`, `kyo-`), lowercase ASCII, unique. `about` is shown
on the site: 2 to 3 short paragraphs, 300 to 900 characters, English, your own words: current
role(s); what they programme or run; notable recent programmes with years; what this means for a
visiting artist. Professional facts only, only from pages you opened. Blank line between
paragraphs inside the quoted cell; no double quotes inside the cell, use single quotes.
`affiliations` = comma-separated organisation ids from E.1 or from your own `places_new.csv`.
`disciplines` from the database list in Part A §3. `status` = `active` (or `inactive` if the role
cannot be confirmed for 2025-26; prefer to omit).

### Task 3: Events (20 Oct to 31 Dec 2026, target +40 Tokyo, +10 Kyoto)

Exhibitions are the thinnest category; fix that first. Open items from last round:
1. **Tokyo Art Beat**: "opening reception" filter for Nov and Dec gallery openings (Tokyo and
   Kyoto); use it to discover, then confirm on the gallery's own page.
2. **BUoY** (Kita-Senju): the official site was unreachable by search. Read the venue's Instagram
   (@buoy_tokyo) and the programme page. RAW PARTY vol.6 date.
3. **Art Center Ongoing**: "no upcoming exhibitions" on 20 Oct; re-check for the show after 1 Nov.
4. **Resident Advisor Tokyo and Kyoto**: December collective nights (Forestlimit, VENT, bonobo,
   CLUB METRO, WWWβ).
5. **Ftarri** and **FORESTLIMIT**: both sites stopped at mid-November; FORESTLIMIT's X account
   already showed 18 Dec. Add what you can confirm.
6. **Kyoto Art Center** "Meirin Workshop" December page (expected around 20 Nov; URL pattern
   `kac.or.jp/events/YYYYMMDD-N/`).
7. **CLUB METRO** Nov to Dec nights; Kyoto International Butoh Festival side events after 15 Nov;
   Nishiogikubo Contact Improvisation jam December dates (confirm on its Facebook page).
8. Dairakudakan Kochuten, Body Arts Laboratory, Youkobo, Session House workshop page (Shift-JIS,
   needs a proper decoder).
9. Dance New Air (check for a 2027 edition), Koenji live houses with noise or improv nights.
10. "Wazawaza Zawazawa" (Heidi S. Durning, 31 Jan 2027, UrBANGUILD) is outside the window; note it
    only.
11. The six Tokyo Gig Guide venues listed above may still be used **as event sources** (events at
    them are welcome if you can confirm on the venue's or the organiser's own page), but do not
    research their addresses.

Event rules: only events a visiting independent artist could realistically attend. Score 3 or more
(Part A §5). Dated, with an `evidence_url` you opened. If time or price is not on the page, leave
the cell empty and set `confidence = low` or `medium`.

Output `events_new.csv`, header exactly:
```
event_id,market,venue_source_id,venue_name,title,title_ja,event_type,disciplines,date,end_date,time,end_time,recurrence,price_min,price_max,currency,ticket_url,evidence_url,lat,lng,lineup,description,underground_score,underground_reason,newcomer_friendly,language_barrier,booking_required,verified_at,confidence
```
`event_id` = `<kyo|tyo>-evt-YYYYMMDD-<slug>`. `event_type` from: `concert`, `club`, `dance`,
`theatre`, `performance`, `exhibition`, `workshop`, `class`, `masterclass`, `lab`, `jam`, `showing`,
`talk`, `screening`, `open_studio`, `party`, `meetup`, `festival`. `venue_source_id` must exist in
E.1 or in your `places_new.csv`. `description` is at most **200 characters**, factual, your own
words. `language_barrier` is `none`, `some` or `high`. **`booking_required` is `yes`, `no` or
`recommended`, or empty if unknown (never the word "unknown").** `newcomer_friendly` is `yes`, `no`
or empty. `confidence` is `high` (organiser's own page), `medium` (listing site), `low`.
For recurring classes use `recurrence` (e.g. `weekly Tue 19:30`) and set `date` to the next
occurrence. Do not duplicate anything in E.3 (check by id and by venue plus date).

### Task 4: New organisations (gaps first)

Add organisations in these gap areas, Tokyo and Kyoto only: independent galleries (Kyoto and Tokyo),
photography, film and video-art spaces, theatre black boxes, **residencies** (dance, performance,
interdisciplinary; those that take foreigners), schools and workshop series, record shops and labels
that host shows, clubs, funders and cultural institutes with programmes for independent artists
(Japan Foundation, Saison Foundation, Arts Council Tokyo, Goethe, Institut francais and similar),
artists' networks. Target: Tokyo 20, Kyoto 10 (new, on top of E.1). Every `active` organisation
needs at least one of: e-mail, contact form, Instagram, or a website with a visible contact section;
if none, start `notes` with `no public contact found`. Keep closed and dormant places, with the
status and the date if known.

Output `places_new.csv`, header exactly:
```
source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,instagram_evidence,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_notes,status,last_active_evidence,evidence_url,verified_at,notes,about,contact_email,email_type,email_evidence_url,contact_form_url,phone_public
```
`source_id` = `<tyo|kyo>-<slug>`. `source_type` only from the list in Part A §8 (there is no
`bar_venue`; use `shop_venue` for a bar or cafe that hosts shows). `about` is shown on the site: 2
to 4 short paragraphs, 400 to 1000 characters (hard cap 1200), your own words: what it is, what it
programmes and for whom, its scene, how a visiting artist gets involved. `tier`: 1 must know, 2
good to know, 3 niche. `status`: `active`, `dormant` (nothing in 6+ months), `closed`.
`lat`/`lng` only if read from a map link on the organisation's own page. `scrape_method`:
`html_calendar`, `peatix`, `ra`, `instagram_only`, `x_only`, `newsletter`, `manual`.
Known corrections to existing data (confirm and report in `corrections_log.md`): Gallery PARC
(Kyoto) is dormant since Jan 2025; d-soko (Tokyo) closed end of 2021; SuperDeluxe's Nishi-Azabu
venue is closed (the organisation continues in Kamogawa, Chiba, out of scope); the Polaris Tokyo
address is unconfirmed (site says Minami-Aoyama, a 2023 listing said Kanda); XYZ collective and
Morishita Studio sites were not opened directly; 4649 site not opened.

## Deliverables (put all in one output folder)

1. `contacts_people.csv` (Task 1a, 35 rows)
2. `contacts_places.csv` (Task 1b)
3. `people_new.csv` (Task 2)
4. `events_new.csv` (Task 3)
5. `places_new.csv` (Task 4)
6. `corrections_log.md`: existing rows (from Part E) that are closed, moved, renamed or wrong, with
   the evidence URL for each.
7. `REPORT.md` (short, English): counts per file and per field; how many people and organisations
   have at least one usable contact route before and after your work; a table of how many have
   e-mail / Instagram / website / form / none; people and organisations with no route at all and
   what you tried; items you checked and dropped, each with the reason; roles you could not confirm
   for 2025-26; gaps (what you could not reach and why, for example Instagram-only scenes or
   language); the ten most useful feeds or calendars you found for the weekly refresh.

Do not edit any file outside your output folder. Do not contact anyone.

## Self-check before you hand back

- [ ] Every row has an `evidence_url` you opened and a `verified_at`.
- [ ] Every non-empty e-mail has an `email_evidence_url` that shows that exact address. No address was built from a pattern; no e-mail finder or data-broker site was used.
- [ ] Every non-empty `instagram_url` has `instagram_evidence`.
- [ ] No personal phone numbers, home addresses, photos, or family details anywhere. Organisation phone numbers and street addresses are fine.
- [ ] `about` texts are your own words and within the limits. `description` of events is 200 characters or less.
- [ ] No duplicates of Part E; ids are unique; every `affiliations` and `venue_source_id` exists in Part E or in your own places file.
- [ ] Nothing invented; unverified cells are empty.
- [ ] Mix of fields is reasonable (no single field above about 45 percent of a file).
- [ ] No Osaka, Kobe or Nara. The Tokyo Gig Guide venue address task was NOT done (out of scope).

---

# PART A: Background (read fully)

# Context: Fellow. and the professional network we are building

> Read this part completely. It is the shared background for the three missions in this
> folder (`MISSION_A_…`, `MISSION_B_…`, `MISSION_C_…`). You do not need to act on anything here.
> The tasks are in the mission files. You have no prior knowledge of this project; everything you
> need is in this folder. If something is missing, say so in your report. Do not guess.

---

## 1. What Fellow. is

**Fellow.** is a small web product for **independent, cross-disciplinary artists**: contemporary
dancers, choreographers, performers, experimental musicians, sound artists, and visual artists whose
work crosses into performance or sound. (Live app: `cue-radar.vercel.app`; the code repo is still
called Cue Radar.)

It started as a feed of verified open calls, residencies and grants. It is now built around one
question: **"I'm in this city now. What's happening in my scene, and how do I get into it?"**

Three parts matter for your work:

1. **Explore the city**: events (performances, concerts, exhibitions, classes, workshops, talks,
   parties, meetups) by city and date.
2. **Discover**, with two directories:
   - **Organizations**: venues, spaces, collectives, festivals, schools, residencies, funders. Each
     has a page: name, "Type · City, Country", an **About** text, how to get in the door, upcoming
     events, links.
   - **Curators**: the *people* who programme and run the scene. Each has a page that looks like a
     professional profile: name, "Role · City, Country", an **About** text, fields, the
     organisations they work with, and **Contact**.
3. **Artist profile**: the artist's own page, so they can introduce themselves to people they meet.

**The goal of this phase is to turn the two directories into a real professional network:** a
visiting or local independent artist should be able to find the right person (the programmer, the
residency director, the festival producer, the gallery director) and **reach them directly**.
That is why *contact routes are now mandatory* on the site: every person and every organisation
that is shown must have at least one working way to get in touch.

## 2. Who it is for: the underground

The audience is **underground and alternative**, not mainstream: an artist who goes to an improv night
in a 40-person room, a butoh workshop, an artist-run gallery opening, a collective's club night.
They do **not** want stadium concerts, idol shows, musicals, tourist-format traditional performance,
or blockbuster "immersive" exhibitions.

What they value: **signal over volume** (ten strong picks beat a hundred listings), **doors that
open** (places and people a newcomer can actually approach), **context** (who runs what and why it
matters), and **trust** (everything is checked by a human; nothing is invented).

## 3. Where we are today

- **Pilot cities: Tokyo and Kyoto** (market keys `tokyo`, `kyoto`). A real client, an artist, is
  there now. Earlier research already produced **26 curators** (25 active, 1 inactive) and about
  **48 organisations** for Japan (see `input/`).
- The database also holds ~320 organisations for **other cities** (Berlin, Brussels, Tel Aviv,
  Seoul, Vienna and others, listed by name in `input/institutions_existing_other_markets.md`).
  Those cities are parked for now but will be switched on later, so the network must eventually
  cover them too.
- Disciplines we work with (database keys): `dance`, `music`, `sound`, `performance`, `painting`,
  `sculpture`, `visual_art`, `photography`, `film`, `theatre`. Priority order for the pilot is
  **dance, music, exhibitions (visual art)**, then performance, theatre, festivals, film.
  **We now want every one of these fields covered**, in every city we research.

## 4. How your output is used

Your CSVs are reviewed by a person and then imported into the **master database**, a Google Sheet
(`Fellow_Master_Database_v2`) that feeds the app's Postgres database. You cannot see the Sheet;
the relevant parts are exported into `input/`. Mapping:

| Your file | Master tab | Shown where |
|---|---|---|
| curators (people) | `curators` | Discover → Curators; page shows About, Fields, Contact, "Works with" |
| institutions (places) | `sources` | Discover → Organizations; page shows About, how to get in, events, links |

Technical limits you must respect:
- `market` is a database key: `tokyo`, `kyoto`, or another existing key (list in §7). For a new city
  use a proposed lowercase slug and list it under "proposed new
  markets" in your report; the team will add it.
- Dates `YYYY-MM-DD`. Multi-value cells are comma-separated inside one cell.
- `about` is capped at **1200 characters** by the database; we ask for 300 to 900.
- IDs: lowercase, hyphenated. People: `<city3>-cur-<family>-<given>` (e.g. `tyo-cur-okada-toshiki`,
  `kyo-cur-…`, `ber-cur-…`). Organisations: `<city3>-<slug>` (e.g. `tyo-forestlimit`).
  City prefixes: `tyo`, `kyo`, `tlv`, `ber`, `bru`, `vie`, `sel`, `par`, `ams`,
  `lis`, `ath`, `bcn`, … (three letters, state any new one in your report).

## 5. The underground filter (applies to people and organisations)

Score from 1 to 5. **Only 3 or higher goes into the deliverables.**

| Score | Meaning | Typical examples (by kind) |
|---|---|---|
| **5** | Core underground: artist-run, DIY, experimental, small rooms | improv/noise venues of 20–80 people; artist-run spaces; butoh and improv dance studios; DIY halls; zine/record shops that host shows |
| **4** | Independent and curatorially adventurous | independent galleries with emerging artists; mid-size live houses with experimental programming; small contemporary dance houses; collective-run club nights |
| **3** | Institution with an experimental programme, or a body that gives independent artists *access* | public arts centre with an experimental festival/residency; university gallery; a residency or funder an independent artist can actually apply to. **Include, and say so.** |
| **2** | Mainstream with an occasional edge | large commercial galleries; big clubs with commercial bookings. Leave out. |
| **1** | Mainstream | arenas, idol/J-pop, musicals, tourist-format traditional shows, blockbuster museum shows, large EDM. Leave out. |

For a **person**, the score is the score of the scene they programme or run, plus whether an
independent artist can realistically approach them. Traditional forms (noh, kabuki, gagaku, etc.)
count only when the presentation is experimental or contemporary, never tourist format.

## 6. Ground rules (apply to every mission)

1. **Nothing invented.** No people, places, roles, dates, links, e-mails, handles. A cell you could
   not verify stays **empty**. An empty cell is correct; a guess is a defect.
2. **Evidence on every row.** An `evidence_url` you actually opened (not a search snippet), plus
   `verified_at` (the date you checked). Blogs and listicles are leads, never evidence.
3. **Open the page.** Every fact (role, handle, e-mail, address) comes from a page you opened and
   read. Do not copy from memory or from earlier articles. Venues close and people change jobs.
4. **Your own words.** `about` and `notes` are written by you. Never paste a bio or press text.
5. **Search in the local language as well as English.** Much of the scene never appears in English.
6. **Do not contact anyone.** No e-mails, DMs, follows, form submissions, or sign-ups. You only
   read public pages.
7. **Save as you go.** Write the output file after every ~15 verified rows. Do not keep everything
   for the end.
8. **Do not edit any file outside your output files.** The main session merges everything.

### 6.1 Contact data: what is allowed and what is not

Fellow. now **publishes contact routes** on person and organisation pages. This is a deliberate
product decision. It is only acceptable if the data is clean, so these rules are strict:

**Allowed**
- An e-mail address that the person or their organisation **publishes themselves** for professional
  contact, on a page you opened: their own site, the organisation's staff/contact page, a festival
  press/contact page, an open-call page. Copy it exactly. If the page shows it obfuscated
  ("name [at] example.com"), you may write it normally *only if the page itself spells it out*.
- Role or organisation addresses (`info@…`, `contact@…`, `program@…`, `press@…`): label them
  `organisation_role`, not personal.
- The person's **own professional website / portfolio**, their **own public professional
  Instagram** (see §6.2), and public professional pages (Linktree, note.com, X, Facebook page,
  LinkedIn) **only when linked from the person's own site or the organisation's official page, or
  the profile unmistakably belongs to the same person**.
- A **contact form URL** on the person's or organisation's official site.

**Not allowed, ever**
- **Guessing or constructing** an address (`firstname@domain`), even if the pattern is obvious.
- E-mail finders, data brokers, people-search sites, leaked databases, WHOIS, scraped directories.
- Personal phone numbers, home addresses, family information, age, anything outside professional
  work. (An organisation's **public venue phone and street address** are fine for organisations.)
- Private or clearly non-professional accounts (private Instagram, family/personal accounts).
- Portrait photos. The product shows initials only.

If you cannot find any legitimate route for a person, leave the contact cells empty and set
`best_contact_route = none`. The team will decide what to do. Do not fill the gap with a guess.

### 6.2 How to confirm an Instagram handle (the usual failure point)

A handle is accepted only if **at least one** of these is true, and you write which one in
`instagram_evidence`:
1. It is **linked from the person's/organisation's official website** or an official programme page.
2. The Instagram bio **links back to the official website** or names the organisation and role.
3. The organisation's official page **tags/credits that account** for that person.

A matching name alone is not enough. If you have a plausible candidate you cannot confirm, put it in
`instagram_candidate_url` with `identity_confidence = low` and leave `instagram_url` empty. Never
choose between two similar accounts by guessing; if unsure, say so in `contact_notes`.

## 7. Cities already in the database (market keys)

Active (pilot): `tokyo`, `kyoto`.
Parked: `akko`, `amsterdam`, `ashdod`, `athens`, `barcelona`, `bat_yam`, `beer_sheva`, `berlin`,
`brussels`, `caesarea`, `copenhagen`, `eilat`, `givatayim`, `haifa`, `herzliya`, `holon`,
`jerusalem`, `karmiel`, `krakow`, `cologne`, `lisbon`, `lyon`, `nazareth`, `oslo`, `paris`,
`prague`, `ramat_gan`, `rishon_lezion`, `seoul`, `stockholm`, `tbilisi`, `tel_aviv`, `turin`,
`vienna`, `warsaw`, `zurich`, plus `remote` (global networks).

## 8. Organisation types (`source_type`, database values)

`venue_music`, `live_house`, `club`, `dance_studio`, `theatre_small`, `gallery`, `artist_run_space`,
`art_centre`, `museum`, `festival`, `collective`, `label`, `school_workshop`, `residency`,
`shop_venue` (record shop, bookshop or café that hosts shows), `community_space`, `aggregator`,
`media`, `funder`, `platform`, `institution` (use only if nothing else fits), `network`.


---

# PART E: Appendices (what already exists: de-duplicate against these)

## E.1 Organisations already in the database (Tokyo + Kyoto): 83 rows

Format: `source_id | name | type | market | status | website`

```
kyo-borofesta | Boro Festa | festival | kyoto | active | 
kyo-butohfes | Kyoto International Butoh Festival | festival | kyoto | active | https://kyoto-butohfes.com/
kyo-clubmetro | CLUB METRO | club | kyoto | active | 
kyo-dancebox | DANCE BOX / ArtTheater dB Kobe | theatre_small | kyoto | active | https://db-dancebox.org
kyo-delta | DELTA | KYOTOGRAPHIE Permanent Space | gallery | kyoto | active | https://delta.kyotographie.jp/
kyo-galerie16 | galerie 16 | gallery | kyoto | active | https://art16.net/
kyo-galleryparc | Gallery PARC (GRAND MARBLE) | gallery | kyoto | dormant | https://galleryparc.com/
kyo-haps | HAPS (Higashiyama Artists Placement Service) | community_space | kyoto | active | https://haps-kyoto.com/
kyo-kac | Kyoto Art Center | art_centre | kyoto | active | https://www.kac.or.jp/
kyo-kcua | @KCUA (Kyoto City University of Arts Gallery) | gallery | kyoto | active | https://gallery.kcua.ac.jp/
kyo-kidwf | Kyoto International Dance Workshop Festival (Kyoto no Atsui Natsu) | festival | kyoto | active | https://www.kac.or.jp/events/20260330/
kyo-kiraza | Butoh company Kiraza (Ima Tenko) | collective | kyoto | active | https://imakiraza.wixsite.com/kirabutoh
kyo-kunstarzt | KUNST ARZT | artist_run_space | kyoto | active | http://www.kunstarzt.com/
kyo-kyotoartbox | Kyoto Art Box | aggregator | kyoto | active | https://kyoto-artbox.jp/
kyo-kyotographie | KYOTOGRAPHIE / KYOTOPHONIE / KG+ | festival | kyoto | active | https://www.kyotographie.jp/
kyo-kyototravel-night | Kyoto City Tourism 'Night events' listing (ja.kyoto.travel) | aggregator | kyoto | active | https://ja.kyoto.travel/times/night/event/
kyo-monade | monade contemporary | gallery | kyoto | active | https://monadecontemporary.art-phil.com/
kyo-monochromecircus | Monochrome Circus | collective | kyoto | active | https://monochromecircus.com/
kyo-rohm | ROHM Theatre Kyoto | art_centre | kyoto | active | https://rohmtheatrekyoto.jp/
kyo-shunjuza | Kyoto Art Theater Shunjuza | theatre_small | kyoto | active | https://k-pac.org/
kyo-soto | Soto | live_house | kyoto | active | https://soto-kyoto.jp/
kyo-spacelfan | SPACE LFAN | community_space | kyoto | active | 
kyo-terras | Kyoto Seika University Gallery Terra-S | gallery | kyoto | active | https://gallery.kyoto-seika.ac.jp/
kyo-theatre-e9 | THEATRE E9 KYOTO | theatre_small | kyoto | active | https://askyoto.or.jp/e9
kyo-underthrow | UNDER-THROW (Chiten) | theatre_small | kyoto | active | https://chiten.org/en/
kyo-urbanguild | UrBANGUILD | live_house | kyoto | active | https://urbanguild.net/
SRC072 | Kyoto Experiment | festival | kyoto | active | https://kyoto-ex.jp/en/
SRC068 | TOKION | media | tokyo | active | https://tokion.jp/en/
SRC069 | SUPER DOMMUNE | media | tokyo | active | https://www.dommune.com/
SRC070 | Ftarri | venue_music | tokyo | active | https://www.ftarri.com/
SRC071 | Higashi-Koenji Nijuuman Denatsu (20000V) | live_house | tokyo | active | 
SRC073 | YPAM (Yokohama Intl Performing Arts Meeting) | festival | tokyo | active | https://ypam.jp/2025/index.en.html
SRC074 | Yokohama Dance Collection | festival | tokyo | active | https://yokohama-dance-collection.jp/en/
SRC075 | Kagurazaka Session House | dance_studio | tokyo | active | https://session-house.net/
SRC076 | Youkobo Art Space | residency | tokyo | active | https://youkobo.co.jp/
SRC077 | The Saison Foundation | funder | tokyo | active | https://www.saison.or.jp/en/
SRC078 | Agency for Cultural Affairs (Bunka-cho) | funder | tokyo | dormant | https://www.bunka.go.jp/english/
SRC079 | Tokyo Jardin | platform | tokyo | active | https://tokyojardin.org/
SRC080 | Tokyo Sound Healing Meetup Group | platform | tokyo | dormant | https://www.meetup.com/tokyo-sound-healing-meetup-group/
SRC081 | studio PLAYA | venue | tokyo | dormant | https://studioplaya.com/index_en.html
SRC259 | FORESTLIMIT | club | tokyo | active | https://www.forestlimit.com
SRC260 | Art Center Ongoing | artist_run_space | tokyo | active | https://www.ongoing.jp/
SRC261 | Design Festa | festival | tokyo | dormant | https://designfesta.com
tyo-3331 | 3331 Arts Chiyoda | art_centre | tokyo | closed | https://www.3331.jp/
tyo-4649 | 4649 | artist_run_space | tokyo | active | https://4-6-4-9.jp/
tyo-artweektokyo | Art Week Tokyo | festival | tokyo | active | https://www.artweektokyo.com/
tyo-autumnmeteorite | Tokyo Festival / Autumn Meteorite 2026 Tokyo | festival | tokyo | active | https://autumnmeteorite.jp/
tyo-bal | Body Arts Laboratory (Whenever Wherever Festival) | collective | tokyo | active | https://bodyartslabo.com/
tyo-barisshee | Bar Isshee | shop_venue | tokyo | active | 
tyo-blackbird | Black Bird Eatery | shop_venue | tokyo | active | https://www.blackbirdtokyo.com/
tyo-bonobo | bonobo | club | tokyo | active | 
tyo-buoy | BUoY Arts Center Tokyo | art_centre | tokyo | active | https://buoy.or.jp/
tyo-chitei | Chitei | shop_venue | tokyo | active | 
tyo-cinn | C.I.N.N. (Contact Improvisation Nippon Network) | collective | tokyo | active | https://www.contactimprov-nn.com/
tyo-dairakudakan | Dairakudakan / Kochuten | collective | tokyo | active | http://www.dairakudakan.com/
tyo-dsoko | d-soko (d-倉庫) | theatre_small | tokyo | closed | 
tyo-geigeki | Tokyo Metropolitan Theatre | art_centre | tokyo | active | https://www.geigeki.jp/
tyo-jazzartsengawa | JAZZ ART SENGAWA | festival | tokyo | active | https://jazzartsengawa.org/
tyo-karas | KARAS APPARATUS | dance_studio | tokyo | active | https://www.st-karas.com/
tyo-knuttel | Knuttel House | shop_venue | tokyo | active | 
tyo-miminoimi | MIMINOIMI Ambient Week | collective | tokyo | active | https://www.miminoimi.me/
tyo-morishita | Morishita Studio (The Saison Foundation) | residency | tokyo | active | http://www.saison.or.jp
tyo-multiplespirits | Multiple Spirits | collective | tokyo | active | 
tyo-nanahari | Nanahari | artist_run_space | tokyo | active | http://www.ftftftf.com
tyo-nishiogi-ci | Nishiogikubo Contact Improvisation WS & Jam | collective | tokyo | active | https://contactimprov-nn.com/workshop-list/nishiogi/
tyo-orientalforce | Oriental Force | live_house | tokyo | active | 
tyo-otooto | OTOOTO | live_house | tokyo | active | 
tyo-permian | Permian | shop_venue | tokyo | active | 
tyo-pitinn | Shinjuku PIT INN | venue_music | tokyo | active | https://pit-inn.com/
tyo-polaris | POLARIS tokyo | venue_music | tokyo | active | https://polaristokyo.com/
tyo-ra | Resident Advisor (Tokyo / Kansai) | aggregator | tokyo | active | https://ra.co/
tyo-rawparty | RAW PARTY (牢) | collective | tokyo | active | 
tyo-stspot | ST Spot | theatre_small | tokyo | active | https://stspot.jp/
tyo-superdeluxe | SuperDeluxe | venue_music | tokyo | closed | https://super-deluxe.com/
tyo-terpsichore | Terpsichore | theatre_small | tokyo | active | https://www.studioterpsichore.com/
tyo-the5thfloor | The 5th Floor | venue | tokyo | active | https://the5thfloor.org/
tyo-theatercommons | Theater Commons Tokyo | festival | tokyo | active | https://theatercommons.tokyo/en/
tyo-tokas | Tokyo Arts and Space Hongo (TOKAS) | art_centre | tokyo | active | https://www.tokyoartsandspace.jp/
tyo-tokyoartbeat | Tokyo Art Beat | aggregator | tokyo | active | https://www.tokyoartbeat.com/
tyo-tokyogigguide | Tokyo Gig Guide | aggregator | tokyo | active | https://www.tokyogigguide.com/
tyo-wwwbeta | WWWβ (WWW Beta) | club | tokyo | active | https://www-shibuya.jp
tyo-xyz | XYZ collective | artist_run_space | tokyo | active | https://xyzcollective.jp/
tyo-ypam | YPAM (Yokohama International Performing Arts Meeting) | festival | tokyo | active | https://ypam.jp/2025/index.en.html
```

## E.2 People already in the database: 35 rows

Format: `curator_id | name | role | market | status | affiliations`

```
kyo-cur-ago-satoshi | Satoshi Ago | Artistic director | kyoto | active | kyo-theatre-e9,SRC072
kyo-cur-fujita-mizuho | Mizuho Fujita | Curator | kyoto | active | kyo-kcua
kyo-cur-iida-jinichiro | Jinichiro Iida | Organiser | kyoto | active | kyo-borofesta,kyo-clubmetro
kyo-cur-katsura-kan | Kan Katsura | Festival director | kyoto | active | kyo-butohfes,kyo-urbanguild,kyo-spacelfan
kyo-cur-kawasaki-yoko | Yoko Kawasaki | Artistic director | kyoto | active | SRC072
kyo-cur-mogura | Mogura | Organiser | kyoto | active | kyo-borofesta
kyo-cur-mori-yuko | Yuko Mori | Organiser | kyoto | active | kyo-monochromecircus,kyo-kidwf
kyo-cur-ogura-emi | Emi Ogura | Programmer | kyoto | active | kyo-kidwf,kyo-kac,kyo-urbanguild
kyo-cur-okamoto-mitsuhiro | Mitsuhiro Okamoto | Curator | kyoto | active | kyo-kunstarzt
kyo-cur-okuyama-riko | Riko Okuyama | Organiser | kyoto | active | kyo-haps
kyo-cur-sakamoto-kosei | Kosei Sakamoto | Organiser | kyoto | active | kyo-monochromecircus,kyo-kidwf,kyo-kac
kyo-cur-tani-ryuichi | Ryuichi Tani | Programmer | kyoto | active | kyo-kac
kyo-cur-tsukahara-yuya | Yuya Tsukahara | Artistic director | kyoto | active | SRC072
tyo-cur-aokid | Aokid | Curator | tokyo | active | tyo-bal,tyo-rawparty
tyo-cur-cobra | COBRA | Curator | tokyo | active | tyo-xyz
tyo-cur-endo-mai | Mai Endo | Curator | tokyo | inactive | tyo-multiplespirits
tyo-cur-fukumoto-maaya | Maaya Fukumoto | Organiser | tokyo | active | tyo-cinn
tyo-cur-itoh-naoko | Naoko Itoh | Artistic director | tokyo | active | SRC075
tyo-cur-iwanaka-kanako | Kanako Iwanaka | Programmer | tokyo | active | tyo-bal
tyo-cur-iwata-tomoya | Tomoya Iwata | Artistic director | tokyo | active | tyo-the5thfloor
tyo-cur-kishimoto-kako | Kako Kishimoto | Artistic director | tokyo | active | tyo-buoy,tyo-rawparty
tyo-cur-kobayashi-yuhei | Yuhei Kobayashi | Curator | tokyo | active | tyo-4649
tyo-cur-makigami-koichi | Koichi Makigami | Festival director | tokyo | active | tyo-jazzartsengawa
tyo-cur-miyagi-futoshi | Futoshi Miyagi | Curator | tokyo | active | tyo-xyz
tyo-cur-nagata-kentaro | kentaro nagata | Organiser | tokyo | active | tyo-miminoimi
tyo-cur-nishimura-mina | Mina Nishimura | Curator | tokyo | active | tyo-bal
tyo-cur-ogawa-nozomu | Nozomu Ogawa | Artistic director | tokyo | active | SRC260
tyo-cur-okada-toshiki | Toshiki Okada | Artistic director | tokyo | active | tyo-autumnmeteorite,tyo-geigeki
tyo-cur-shimizu-shogo | Shogo Shimizu | Curator | tokyo | active | tyo-4649
tyo-cur-soma-chiaki | Chiaki Soma | Festival director | tokyo | active | tyo-theatercommons
tyo-cur-takahashi-hiroko | Hiroko Takahashi | Organiser | tokyo | active | tyo-cinn
tyo-cur-takamizawa-yuu | Yuu Takamizawa | Curator | tokyo | active | tyo-4649
tyo-cur-ukawa-naohiro | Naohiro Ukawa | Programmer | tokyo | active | SRC069
tyo-cur-yama-yuki | Yama Yuki | Organiser | tokyo | active | tyo-miminoimi
tyo-cur-yamazaki-kota | Kota Yamazaki | Festival director | tokyo | active | tyo-bal
```

## E.3 Events already in the database (Tokyo + Kyoto): 141 rows

Format: `event_id | date | venue source_id | title`

```
kyo-evt-20261001-endomithusen | 2026-10-01 | kyo-kcua | Kaori Endo | Mithu Sen: The Sleep in the 22nd C. | Unwritten Intimacy
kyo-evt-20261002-imao | 2026-10-02 | SRC072 | Imao Takuma: something tactile
kyo-evt-20261003-futuredictionary | 2026-10-03 | kyo-kac | Future Dictionary (SKF exhibition)
kyo-evt-20261003-kansaistudies | 2026-10-03 | kyo-kac | Kansai Studies 2026: Topographical Map of River kondaba (exhibition)
kyo-evt-20261003-kojima | 2026-10-03 | SRC072 | Yasutaka Kojima: Berlin | Tokyo
tyo-evt-20261016-buoy-misyoux | 2026-10-16 | tyo-buoy | MISYOU X - Seki Fuya, Takayama Akira
kyo-evt-20261019-osushi | 2026-10-19 | kyo-kac | Shie Minamino / OSUSHI: OsuShiEGypto
tyo-evt-20261019-dommune-pond | 2026-10-19 | SRC069 | P.O.N.D. presents DOMMUNE x P.O.N.D. 2026 're/sort' NIGHT
tyo-evt-20261019-ftarri | 2026-10-19 | SRC070 | Frantz Loriot (viola), Marina Tantanozi (flute), Naoto Yamagishi (percussion)
kyo-evt-20261020-mizumono | 2026-10-20 | kyo-urbanguild | MIZUMONO IMA IV (Ima Tenko + ryotaro + Akito Sengoku) - KEX fringe
tyo-evt-20261020-gaga | 2026-10-20 | SRC075 | Mariko Kakizaki workshop: Gaga/people
kyo-evt-20261021-echoesnow | 2026-10-21 | SRC072 | Echoes Now 2026 showcase
kyo-evt-20261021-supergum | 2026-10-21 | kyo-urbanguild | Super Gum (Brussels) Japan Tour 2026 in Kyoto + quaeru
tyo-evt-20261021-ahe-workshop | 2026-10-21 | tyo-geigeki | Ahe Engineering Theatre workshop: 'Instructions for a well-tuned mistake'
tyo-evt-20261021-fl-s-e-r-e-n-d-i-p-i-t-y-massacre | 2026-10-21 | SRC259 | S/e/r/e/n/d/i/p/i/t/y MASSACRE
tyo-evt-20261021-ida-cell | 2026-10-21 | SRC075 | Asami Ida: 'Waking the body from the cell' (Ilan Lev-based open class)
tyo-evt-20261021-kondo-hirameki | 2026-10-21 | SRC075 | Ryohei Kondo: 'Flashes of movement' open class
tyo-evt-20261021-matsumoto-release | 2026-10-21 | SRC075 | Taiju Matsumoto: Release Technique (open class)
tyo-evt-20261021-nanahari-collin | 2026-10-21 | tyo-nanahari | Jon Collin (UK/SE), Rob Noyes & Takashi Masubuchi, Lost Wax
tyo-evt-20261021-ongoing-kawamoto | 2026-10-21 | SRC260 | Yoshinori Kawamoto: Figure Children (Zukei no kodomotachi)
kyo-evt-20261022-hirotafutakuchi | 2026-10-22 | kyo-urbanguild | Hirota Yumi + Futakuchi Daigaku: 'Kono michi wa itsuka kita michi' (Betsuyaku Minoru) - KEX fringe
kyo-evt-20261022-kiriko-ws | 2026-10-22 | kyo-kac | Meirin Workshop: KIRIKO DANCE PROJECT 'Ballet basics for dancers' + Kakaken (martial-arts dance)
kyo-evt-20261022-kondaba | 2026-10-22 | SRC072 | Nanako Ishihara, Hitoshi Kaneko / kondaba: Daily records of River kondaba
kyo-evt-20261022-shizukutachi-1400 | 2026-10-22 | kyo-kac | Zan Yamashita & Nhã Thuyên with Project Đẩy Sàn: giọt-giọt | shizukutachi
tyo-evt-20261022-fl-viva-party-1 | 2026-10-22 | SRC259 | Viva! party
tyo-evt-20261022-ito-basic-explore | 2026-10-22 | SRC075 | Naoko Ito: Dance Basic - exploration class (open class)
tyo-evt-20261022-permian-okagawa | 2026-10-22 | tyo-permian | Leo Okagawa (electronics) solo
tyo-evt-20261022-thursday-technique | 2026-10-22 | SRC075 | Thursday-morning Dance Technique Basics: Release & Flow (Ota), then Technique to Sequence (Hirata) from 3 Dec
kyo-evt-20261023-firefly | 2026-10-23 | SRC072 | Firefly@kamo-river Kyoto
kyo-evt-20261023-shizukutachi-1900 | 2026-10-23 | kyo-kac | Zan Yamashita & Nhã Thuyên with Project Đẩy Sàn: giọt-giọt | shizukutachi
tyo-evt-20261023-burninggirls | 2026-10-23 | tyo-geigeki | Nadia Beugre: Burning Girls (Filles-Petroles)
tyo-evt-20261023-fl-evilspa-10 | 2026-10-23 | SRC259 | evilspa 10
tyo-evt-20261023-knuttel-numata-nakamura | 2026-10-23 | tyo-knuttel | Jun Numata, Toshimaru Nakamura
kyo-evt-20261024-atthattime3 | 2026-10-24 | SRC072 | KIYOKAZU Matumoto: At That Time #3
kyo-evt-20261024-inamori | 2026-10-24 | kyo-urbanguild | Inamori Asuka: MAD movie.jnrk
kyo-evt-20261024-shizukutachi-1100 | 2026-10-24 | kyo-kac | Zan Yamashita & Nhã Thuyên with Project Đẩy Sàn: giọt-giọt | shizukutachi
tyo-evt-20261024-burninggirls | 2026-10-24 | tyo-geigeki | Nadia Beugre: Burning Girls (Filles-Petroles)
tyo-evt-20261024-fl-flashbax20 | 2026-10-24 | SRC259 | fLASHBAx20
tyo-evt-20261024-fl-midnight-error | 2026-10-24 | SRC259 | Midnight Error
tyo-evt-20261024-ftarri | 2026-10-24 | SRC070 | Yumiko Tanaka, Masashi Yamamoto, Masamichi Kinoshita: Kinoshita compositions + improvisation
tyo-evt-20261024-shala | 2026-10-24 | SRC075 | SHALA: Metamorphose - Le Ciel (solo dance ritual vol. III)
kyo-evt-20261025-shizukutachi-0600 | 2026-10-25 | kyo-kac | Zan Yamashita & Nhã Thuyên with Project Đẩy Sàn: giọt-giọt | shizukutachi
kyo-evt-20261025-shizukutachi-1200 | 2026-10-25 | kyo-kac | Zan Yamashita & Nhã Thuyên with Project Đẩy Sàn: giọt-giọt | shizukutachi
tyo-evt-20261025-21fes141-2 | 2026-10-25 | SRC075 | Dance Theater 21 Fes vol.141 (2): seven 10-minute pieces
tyo-evt-20261025-burninggirls | 2026-10-25 | tyo-geigeki | Nadia Beugre: Burning Girls (Filles-Petroles)
tyo-evt-20261025-fl-need-to-control-1 | 2026-10-25 | SRC259 | Need to Control
tyo-evt-20261025-ftarri | 2026-10-25 | SRC070 | Elena Kakaliagou (French horn) and Fumi Endo (piano)
tyo-evt-20261025-nijigumi | 2026-10-25 | tyo-geigeki | Nijigumi Fights: 11th Nijigumi Gakuen Autumn Culture Festival
tyo-evt-20261025-okadayamada | 2026-10-25 | tyo-geigeki | Toshiki Okada & Kazuki Yamada: A Punch of Silence (free atrium performance)
kyo-evt-20261026-butohpre | 2026-10-26 | kyo-urbanguild | 4th Kyoto International Butoh Festival pre-event: A Howl to the Moon - A Nocturne
tyo-evt-20261026-fl-kokutobasho | 2026-10-26 | SRC259 | Koku to Basho (Time and Place)
tyo-evt-20261026-ftarri | 2026-10-26 | SRC070 | Magnus Granberg ensemble w/ Miki Maruta, Ko Ishikawa, Toshimaru Nakamura
tyo-evt-20261026-morii-floorwork | 2026-10-26 | SRC075 | Jun Morii: Contemporary Dance Open Class - floorwork x flow x dynamics
tyo-evt-20261026-of-narita-butoh | 2026-10-26 | tyo-orientalforce | Mamoru Narita (Sounddance), Nira (guitar) x Renka (dance), Yasukichi (butoh)
kyo-evt-20261027-fourdancers364 | 2026-10-27 | kyo-urbanguild | FOuR DANCERS vol.364 - dance performance night
tyo-evt-20261027-fl-oyama | 2026-10-27 | SRC259 | Yo Oyama solo exhibition closing reception 'beside lulu'
tyo-evt-20261027-ito-basic-beginner | 2026-10-27 | SRC075 | Naoko Ito: Dance Basic - beginner class (open class)
tyo-evt-20261027-kogure-research | 2026-10-27 | SRC075 | Kaho Kogure: Movement Research (open class)
tyo-evt-20261028-isshee-mikawa | 2026-10-28 | tyo-barisshee | T. Mikawa, Masahiro Tobita, mito
tyo-evt-20261029-fl-gong-gong-gong-kokoko-in-japan-2026 | 2026-10-29 | SRC259 | GONG GONG GONG (Beijing) in Japan 2026
tyo-evt-20261029-hanagata | 2026-10-29 | tyo-geigeki | Hanagata Maki: Ergonomics Embryo
tyo-evt-20261029-isshee-vakvak | 2026-10-29 | tyo-barisshee | Vakvak Samandal (Ken Matsutani, SACHIKO), Kyohansya (isshee, Keiko Higuchi)
kyo-evt-20261030-cibeles | 2026-10-30 | kyo-urbanguild | Ima Tenko butoh: CIBELES (Imo no chikara series vol.16) - KEX fringe
kyo-evt-20261030-dancebox-showcase1 | 2026-10-30 | kyo-dancebox | Day trip - Kobe: Domestic Dance Residency 12th cohort, Newcomer/Showcase #1 - Hotta Chiaki new work
kyo-evt-20261030-hopes02 | 2026-10-30 | kyo-rohm | ROHM Theatre Repertory 'Hopes': See You on One Good Day
tyo-evt-20261030-yamashiro | 2026-10-30 | tyo-geigeki | Chikako Yamashiro: Recalling(s) - theatrical version
kyo-evt-20261031-atthattime3 | 2026-10-31 | SRC072 | KIYOKAZU Matumoto: At That Time #3
kyo-evt-20261031-borofesta-metro | 2026-10-31 | kyo-clubmetro | Boro Festa 2026 - Metro night session
kyo-evt-20261031-nigamushi-ws | 2026-10-31 | kyo-kac | Meirin Workshop: Gekidan Nigamushi x Mame Kikaku 'Play with Kenji Miyazawa' (sound + words session)
kyo-evt-20261031-psychotribe | 2026-10-31 | kyo-urbanguild | PSYCHO-TRIBE 5th album LUNA release party (drums + dance + live paint)
tyo-evt-20261031-ahe-whiteroom | 2026-10-31 | tyo-geigeki | Ahe Engineering Theatre: White Room
tyo-evt-20261031-fl-solitude-2-dancing-through-the-dark-halloween-party | 2026-10-31 | SRC259 | SOLITUDE 2 - Dancing Through the Dark (Halloween party)
tyo-evt-20261031-ftarri | 2026-10-31 | SRC070 | Eiko Yamada (recorders), Taku Sugimoto, Yoko Ikeda, Wakana Ikeda
tyo-evt-20261031-otooto-sexmagick | 2026-10-31 | tyo-otooto | Sex Magick Wizards [Norway]
tyo-evt-20261101-chitei-hosoo | 2026-11-01 | tyo-chitei | Hosoo and Taeyoon Kim (KR), The Lenticularz, Jan Urila Sas, MMORITA, Seibutsu, Sunagimo
tyo-evt-20261101-otooto-ikegami-gayle | 2026-11-01 | tyo-otooto | Hideo Ikegami, Philip Gayle, Kazushige Kinoshita
tyo-evt-20261102-fl-hyoi | 2026-11-02 | SRC259 | Hyoi (Possession)
tyo-evt-20261102-ftarri | 2026-11-02 | SRC070 | Yuki Nakagawa (cello), biki (mixer, gate), knd (computers)
tyo-evt-20261102-hashimoto-somatic | 2026-11-02 | SRC075 | Yuko Hashimoto: Somatic Dance class (LBMS-based year course) - drop-in enquiry
kyo-evt-20261103-atthemoment | 2026-11-03 | kyo-urbanguild | At the moment Vol.1 (Kyoto underground rock/noise night)
tyo-evt-20261103-21fes141-3 | 2026-11-03 | SRC075 | Dance Theater 21 Fes vol.141 (3): seven 10-minute pieces
kyo-evt-20261104-fourdancers365 | 2026-11-04 | kyo-urbanguild | FOuR DANCERS vol.365 - dance performance night
tyo-evt-20261104-artweektokyo | 2026-11-04 | tyo-artweektokyo | Art Week Tokyo 2026
tyo-evt-20261105-ikegami-contact | 2026-11-05 | SRC075 | Takkun Ikegami: Contemporary Contact Technique (open class)
kyo-evt-20261106-dancebox-street | 2026-11-06 | kyo-dancebox | Day trip - Kobe: Pre-Shitamachi Art Festival 2027 - Solo Dance Artists street performances 'Itsutsu no aki, odori meguri'
kyo-evt-20261106-hopes03 | 2026-11-06 | kyo-rohm | ROHM Theatre Repertory 'Hopes': Tourists
kyo-evt-20261106-muni | 2026-11-06 | kyo-kac | KAC Partnership Program 2026: Muni 'Kyotai'
tyo-evt-20261106-fl-neuron | 2026-11-06 | SRC259 | NEURON
kyo-evt-20261107-butohfes-day1 | 2026-11-07 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 1
tyo-evt-20261107-buoy-artlab | 2026-11-07 | tyo-buoy | Art Lab of Loss and Rebirth 2026 (Void Arts Project)
tyo-evt-20261107-fl-blindfold | 2026-11-07 | SRC259 | BLINDFOLD
tyo-evt-20261107-fl-honeycomb-vol-3 | 2026-11-07 | SRC259 | Honeycomb vol.3
tyo-evt-20261107-nishiogi-ci | 2026-11-07 | tyo-nishiogi-ci | Contact Improvisation Ws & Jam Nishiogikubo
kyo-evt-20261108-butohfes-day2 | 2026-11-08 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 2
kyo-evt-20261108-varietease | 2026-11-08 | kyo-urbanguild | VarieTEASE Kyoto vol.23 (burlesque/variety)
tyo-evt-20261108-ftarri | 2026-11-08 | SRC070 | Florence Cats and Ayami Suzuki, night 1: Improvisation
tyo-evt-20261108-nanahari-shihyang | 2026-11-08 | tyo-nanahari | Shih-Yang Lee (Taiwan), Shoji Hano, Cal Lyall, Daysuke Takaoka, Miki Naoe
kyo-evt-20261109-butohfes-day3 | 2026-11-09 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 3
tyo-evt-20261109-ftarri | 2026-11-09 | SRC070 | Florence Cats and Ayami Suzuki, night 2: Compositions
kyo-evt-20261110-butohfes-day4 | 2026-11-10 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 4
kyo-evt-20261110-ikasama | 2026-11-10 | kyo-urbanguild | Warit Tonnam (Thailand) meets Ikasama Duo - free improvisation
kyo-evt-20261110-rutsubo-talk | 2026-11-10 | kyo-kac | Talk series: The future of 'Rutsubo' - community and art making places
kyo-evt-20261111-butohfes-day5 | 2026-11-11 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 5
tyo-evt-20261111-chitei-voglsinger | 2026-11-11 | tyo-chitei | Paolo Gaiba Riva, Kazehito Seki, Stefan Voglsinger (Vienna), Toshimaru Nakamura, Cal Lyall, DJ MEMAI
kyo-evt-20261112-butohfes-day6 | 2026-11-12 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 6
kyo-evt-20261112-experimentallive | 2026-11-12 | kyo-urbanguild | Experimental Live: Wada Shinji, Vittoria Assembri, Vinicius Cajado + Kenji Herbert + Yamauchi Kota
kyo-evt-20261113-butohfes-day7 | 2026-11-13 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 7
kyo-evt-20261113-fourdancers366 | 2026-11-13 | kyo-urbanguild | FOuR DANCERS vol.366 - dance performance night
tyo-evt-20261113-fl-entundra | 2026-11-13 | SRC259 | entundra
tyo-evt-20261113-fl-phantasy-break-tokyo | 2026-11-13 | SRC259 | PHANTASY BREAK Tokyo
kyo-evt-20261114-butohfes-day8 | 2026-11-14 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 8
tyo-evt-20261114-ftarri | 2026-11-14 | SRC070 | Juliana Venter (vocals), Keiko Higuchi (piano, voice), Toshimaru Nakamura
tyo-evt-20261114-tengusaru-1600 | 2026-11-14 | SRC075 | Session House D-ZONE: Tengusaru Buyodan 'Kankyu no hazama de potsun'
tyo-evt-20261114-tengusaru-1900 | 2026-11-14 | SRC075 | Session House D-ZONE: Tengusaru Buyodan 'Kankyu no hazama de potsun'
kyo-evt-20261115-butohfes-day9 | 2026-11-15 | kyo-spacelfan | 4th Kyoto International Butoh Festival 'Drape yourself in light & shadow' - Day 9
tyo-evt-20261115-fl-red-tour-in-tokyo | 2026-11-15 | SRC259 | RED TOUR in Tokyo
tyo-evt-20261115-ftarri | 2026-11-15 | SRC070 | Clara de Asis (bells, electronics), Vittoria Assembri (tapes, objects), Leo Okagawa
kyo-evt-20261116-butohnight44 | 2026-11-16 | kyo-urbanguild | Butoh Night vol.44: 'Iki no yukisaki' - Masami Yurabe, Miwako Inagaki
kyo-evt-20261116-dancebox-intensiveD | 2026-11-16 | kyo-dancebox | Day trip - Kobe: Intensive Program D (open class) - Komatsu Nanako, Alan Sinandja, Kurakake Ayako
tyo-evt-20261116-ftarri | 2026-11-16 | SRC070 | Clara de Asis compositions: Yoko Ikeda, Shintaro Tanaka, Riko Kobayashi, Leo Okagawa
kyo-evt-20261117-deafkids | 2026-11-17 | kyo-urbanguild | DEAFKIDS (Brazil) Japan tour - Kyoto
kyo-evt-20261118-otomo | 2026-11-18 | kyo-urbanguild | Emilie Skrijelj, Tom Malmendier & Otomo Yoshihide: Cut-up Improvisation
kyo-evt-20261119-melmann | 2026-11-19 | kyo-urbanguild | Nicolas Melmann Japan Tour 2026 'Musica Aperta' + Hirotaka Shirotsubaki, Polar M, Matsumoto Kazuya
tyo-evt-20261119-fl-metalvol-5 | 2026-11-19 | SRC259 | METAL vol.5
kyo-evt-20261120-grubbs | 2026-11-20 | kyo-urbanguild | David Grubbs Japan Tour 2026 w/ Yokogawa Tadahiko + Funato Hiroshi
kyo-evt-20261121-gesu-ws | 2026-11-21 | kyo-kac | Meirin Workshop: Gesu◎ 'Workshop for (really) betting on the future'
kyo-evt-20261121-vazquez | 2026-11-21 | kyo-urbanguild | Santiago Vazquez x Yoshigaki Yasuhiro: Arcana Mundi + guests
tyo-evt-20261121-nishiogi-ci | 2026-11-21 | tyo-nishiogi-ci | Contact Improvisation Ws & Jam Nishiogikubo
kyo-evt-20261122-thelesson | 2026-11-22 | kyo-urbanguild | The Lesson (Shibuya Koji / Fumoto Kenichi) with Miyasaka Ryotaro + Kukangendai
tyo-evt-20261124-gaga | 2026-11-24 | SRC075 | Mariko Kakizaki workshop: Gaga/people
kyo-evt-20261126-fourdancers367 | 2026-11-26 | kyo-urbanguild | FOuR DANCERS vol.367 - dance performance night
kyo-evt-20261127-gesu-t1na | 2026-11-27 | kyo-theatre-e9 | Gesu◎: T1NA (new work)
kyo-evt-20261127-urshokudo | 2026-11-27 | kyo-urbanguild | Ur Shokudo LIVE: cumulus (Miyajima Saiko x ryotaro) + Akito Sengoku, Jerome Fouquet - free/donation
kyo-evt-20261129-gekiken-hands-ws | 2026-11-29 | kyo-kac | Meirin Workshop: 'My hands / your hands' body-memory workshop and demonstration (Gekiken)
kyo-evt-20261201-fourdancers368 | 2026-12-01 | kyo-urbanguild | FOuR DANCERS vol.368 - dance performance night
kyo-evt-20261202-takoashi-yamamoto | 2026-12-02 | kyo-urbanguild | Takoashi Earphones x Seiichi Yamamoto
kyo-evt-20261210-dancetogohan9 | 2026-12-10 | kyo-urbanguild | Dance to Gohan vol.9: Amijiro & junjun SCIENCE short dance works
tyo-evt-20261212-sano-nagashima | 2026-12-12 | SRC075 | Kana Sano & Yusuke Nagashima: Mitasu hoko e mukau (Toward the direction that fills)
tyo-evt-20261219-okuni | 2026-12-19 | SRC075 | Dance Bridge 2026: Mademoiselle Cinema 'Okuni Monogatari'
kyo-evt-20261223-holobiont | 2026-12-23 | kyo-urbanguild | Holobiont
kyo-evt-20261225-playground | 2026-12-25 | kyo-urbanguild | Seiichi Yamamoto & THE PLAYGROUND with Kota Yamauchi: vague believers on Holy Night
```

## E.4 Organisations in other cities

About 320 organisations for parked cities are in the database. They are out of scope for this round; ignore them.
