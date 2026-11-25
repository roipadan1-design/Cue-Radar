# Mission B: build the professional network (many more people, every field, with contact routes)

> Attach `00_CONTEXT.md`, `input/curators_current.csv`, `input/institutions_existing_japan.csv`
> and `input/institutions_existing_other_markets.md`. Read `00_CONTEXT.md` fully, especially §5
> (underground filter) and §6 (ground rules, contact rules, Instagram rule).
> If Mission C runs in parallel, do not wait for it: any organisation you need that is not in the
> input goes into your own `places_new_from_people.csv` (format in §5).

## 0. Why

We have 26 people. The product needs a **network**: hundreds of professionals, so that an artist in
any city we cover can find the right person and write to them. We want **everyone with a managerial
or programming role** in the fields we work with, not only "curators".

## 1. Who counts (role categories)

Every person must hold a **public, current professional role** that shapes what is shown, made or
funded in the scene. Use `role_category` for filtering:

| `role_category` | Who | `role_label` examples |
|---|---|---|
| `curator` | curators at artist-run spaces, project spaces, independent galleries; curators of experimental programmes at institutions | Curator, Chief curator |
| `programmer_booker` | programmers and bookers of music venues, live houses, clubs, series, dance and theatre houses | Programmer, Booker |
| `festival_leadership` | festival directors, artistic directors, festival producers and managers | Festival director, Artistic director, Festival producer |
| `residency_leadership` | **residency directors and managers, especially dance and performance residencies**; heads of artist-in-residence programmes | Residency director, Residency manager |
| `venue_leadership` | directors of galleries (independent), art centres, dance houses, small theatres, studios | Gallery director, Director |
| `producer` | **producers of art events**, performing-arts producers, production-company heads, touring producers, event organisers who put on exhibitions, performances, fairs, parties | Producer, Executive producer, Event producer |
| `organiser_collective` | organisers of collectives, recurring parties, improv series, dance labs, label owners who run nights | Organiser, Founder |
| `education_lead` | programme heads at schools, studios and workshop series that take outside artists | Programme director |
| `programme_officer` | **public-facing** programme officers/leads at foundations, arts councils and funders that fund independent artists (named on the funder's own page) | Programme officer, Head of grants |
| `platform_leadership` | directors/managers of networks, platforms and listings bodies (a dance network, an artists' platform) | Director, Managing director |

**Fields to cover** (`disciplines`): `dance`, `music`, `sound`, `performance`, `theatre`,
`visual_art`, `painting`, `sculpture`, `photography`, `film`. **Balance matters:** do not return a
list that is 80% one field. Dance, music and exhibitions come first, but film, theatre,
photography and cross-disciplinary people must be present too. If a person works across fields,
list all of them.

**Not in scope:** commercial sales staff, mainstream promoters, critics/journalists who programme
nothing, artists with no programming role, assistants and interns, anyone whose only evidence is
a private profile.

## 2. Scope and targets

Work in **waves**. Finish and save a wave before starting the next.

**Wave 1: Japan, Tokyo and Kyoto only. Osaka, Kobe and Nara are NOT targets: do not research them, even as day trips.** This is the pilot and the most valuable wave.
| Area | `market` | Target (new people) |
|---|---|---|
| Tokyo (+ Yokohama as a day trip, still `market = tokyo`) | `tokyo` | **80** |
| Kyoto | `kyoto` | **50** |

**Wave 2: other cities**, in this order, each **15–30 people**, covering all fields: `tel_aviv`
(and other Israeli cities), `berlin`, `seoul`, `vienna`, `brussels`, `paris`, `amsterdam`, `lisbon`,
`athens`, `barcelona`, then the remaining keys in `00_CONTEXT.md` §7. You may propose up to 5
additional major cities with a strong independent scene (state why).

The targets are **minimums to aim for, not a quota to fill at any cost**. 40 verified people beat 80
padded ones. If you cannot reach a target honestly, deliver what is verified and explain the gap
in your report (which sub-scenes are hidden behind Instagram or behind language).

## 3. How to find them (method)

1. **Start from organisations**, not names. For each organisation in `institutions_existing_japan.csv`
   (and any you find), open About / Staff / Team / スタッフ / 運営 / 代表 / ディレクター / 主宰 /
   キュレーター / プログラム pages and recent programme credits (企画, 制作, 主催, 共催,
   プロデューサー, 芸術監督).
2. **Follow credits.** Festival programmes and exhibition pages list curator, producer and
   organiser. The people who co-curate and appear in each other's programmes lead to the next person.
3. **Residencies:** search for dance, performance and interdisciplinary residencies in each city
   (レジデンス, アーティスト・イン・レジデンス, AIR) and name the person who runs the programme.
4. **Producers and event organisers:** art fairs, open-studio weeks, performing-arts markets,
   biennials and triennials, production companies for performance and festivals (制作会社, 制作,
   プロデュース). Include the *named* producer or director.
5. **Funders and support bodies:** named programme staff only where the funder's own page lists
   them in that role.
6. **Arts media** (interviews, profiles, festival press pages) are good evidence of role and
   background; they are not the only source of contact data.
7. Search **in the local language**. Useful Japanese terms: `キュレーター`, `ディレクター`,
   `プログラムディレクター`, `主宰`, `代表`, `芸術監督`, `プロデューサー`, `制作`, `企画`, `主催`,
   `レジデンス`, `スタッフ`, `運営`, `ブッカー`, `店主`, `オーガナイザー`. Use the equivalent terms
   in German, Hebrew, Korean, French, Dutch, etc. for Wave 2.

Quality gate per person (all five must be true):
- A page from **2025 or 2026** names them in this role at this organisation.
- You can say what they programme/run in one sentence of fact.
- At least one legitimate contact route exists (see §4). If none exists, you may still include the
  person, with `best_contact_route = none`, but this should be rare. Prefer people the artist can
  actually reach.
- Not already in `curators_current.csv` (match name and organisation).
- Underground score ≥ 3.

## 4. Contact data (new in this phase, mandatory to attempt)

For every person, collect what exists, following `00_CONTEXT.md` §6.1 and §6.2 exactly:
**website, portfolio, Instagram, e-mail, contact form**, and the organisation's official contact
route as fallback. Set `best_contact_route`. Never guess an address or a handle. Never use e-mail
finders or data brokers. Never contact anyone.

## 5. Deliverables

Save into your output folder (create it). Keep each file's header **exactly**.

### 5.1 `people_new_<wave>_<city>.csv`

One file per city, e.g. `people_new_w1_tokyo.csv`. UTF-8, header exactly:

```
curator_id,name,name_ja,role_label,role_category,market,about,disciplines,affiliations,website_url,portfolio_url,instagram_url,instagram_evidence,contact_email,email_type,email_evidence_url,contact_form_url,other_links,best_contact_route,evidence_url,verified_at,status,underground_score,notes
```

| Column | Rule |
|---|---|
| `curator_id` | `<city3>-cur-<family>-<given>`, lowercase, ASCII, unique across everything you deliver and across `curators_current.csv` |
| `name` / `name_ja` | Romanised name as the person or organisation publishes it in English; the local-script name in `name_ja` (the column name is historical; for any country it holds the name in the local script, e.g. Hebrew, Korean, Japanese). If no romanised name is published anywhere, log the person as skipped |
| `role_label` | Short, specific, shown on the page. Use the examples in §1; other labels are fine if they are accurate |
| `role_category` | One value from the §1 table |
| `market` | Database key or proposed slug |
| `about` | **Shown on the site.** 2–3 short paragraphs, 300–900 characters, English, your own words: current role(s); what they programme/run; notable recent programmes with years; what that means for a visiting artist (how to approach them). Professional facts only, only from pages you opened. Blank line between paragraphs inside the quoted cell. No double quotes inside the cell; use single quotes |
| `disciplines` | Comma-separated from the database list |
| `affiliations` | Comma-separated organisation ids (existing `source_id` from the input files, or a new id from your `places_new_from_people.csv`) |
| `website_url`, `portfolio_url`, `instagram_url`, `contact_email`, `contact_form_url` | Per `00_CONTEXT.md` §6; empty if not verified |
| `instagram_evidence` | `linked_from_site`, `bio_links_back` or `credited_by_org`, then the proving URL |
| `email_type` | `personal_published`, `organisation_role`, or empty |
| `email_evidence_url` | The page where you read the address |
| `other_links` | Other professional public links, comma-separated |
| `best_contact_route` | `email_personal`, `email_org`, `contact_form`, `website`, `instagram`, `org_page`, `none` |
| `evidence_url` | The official page that names them in this role (2025–26) |
| `verified_at` | `YYYY-MM-DD` |
| `status` | `active`, or `inactive` if the role could not be confirmed for 2025–26 (then explain in notes; prefer to omit the person) |
| `underground_score` | 3–5 (`00_CONTEXT.md` §5) |
| `notes` | Internal, not shown: how you found them, language of the evidence, ambiguity, "likely to respond in English?" if a public page says so, e.g. "festival lists English contact" |

### 5.2 `places_new_from_people.csv` (only organisations that are neither in the input nor in
Mission C's output)

Header exactly (same as the organisations master, plus the contact columns):

```
source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_notes,status,last_active_evidence,evidence_url,verified_at,notes,about,contact_email,email_type,email_evidence_url,contact_form_url
```

Leave unverified cells empty. `about` is 2–4 short paragraphs, 400–1000 characters. Rules for the
other columns are in `MISSION_C_expand_institutions.md` §3.

### 5.3 `MISSION_B_log.md`

- Counts per city and per `role_category` and per field (a small table).
- **People checked and dropped**, each with the reason (role not confirmed for 2025–26, out of scope,
  no romanised name, privacy concern, duplicate).
- Every `inactive` row.
- Proposed new markets and new city prefixes.
- Gaps: what you could not reach and why.

## 6. Self-check before you hand back

- [ ] Every person has an `evidence_url` from 2025–26 naming them in the stated role.
- [ ] Every non-empty e-mail has an `email_evidence_url` you opened; no pattern-built addresses.
- [ ] Every non-empty `instagram_url` has `instagram_evidence`.
- [ ] No photos, no personal phone numbers, no home addresses, no family or age details.
- [ ] `about` is your own words, ≤ 900 characters, facts only from pages you opened.
- [ ] No duplicates of `curators_current.csv`; ids are unique.
- [ ] Every id in `affiliations` exists in the input files or in `places_new_from_people.csv`.
- [ ] Mix of fields and role categories is reasonable per city (see the table in your log).
- [ ] You delivered Wave 1 in full before starting Wave 2.
