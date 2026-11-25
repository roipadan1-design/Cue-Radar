# Mission C: expand the organisations directory (all fields, much larger, with contact routes)

> Attach `00_CONTEXT.md`, `input/institutions_existing_japan.csv` and
> `input/institutions_existing_other_markets.md` (and `input/curators_current.csv` for context).
> Read `00_CONTEXT.md` fully, especially §5 (underground filter), §6 (ground rules, contact rules)
> and §8 (organisation types).

## 0. Why

The Organizations directory is the map of a city's scene. Today it has ~48 organisations for Japan,
heavy on dance and live music, thin on galleries, film, theatre, photography, schools, residencies
and the infrastructure around them. We want a directory an artist can use in **any field**, in
**any city we cover**, and where **every entry gives a way to get in touch**.

## 1. What to cover (all fields)

Map each city's ecosystem across **all** of these. Fields use the database keys: `dance`, `music`,
`sound`, `performance`, `theatre`, `visual_art`, `painting`, `sculpture`, `photography`, `film`.

| Group | Organisation types (`source_type`) | Examples of what to look for |
|---|---|---|
| Music & sound | `venue_music`, `live_house`, `club`, `label`, `shop_venue` | experimental/improv/noise rooms, DIY live houses, collective-run club nights, record shops with shows, small labels that run nights, electroacoustic/sound-art spaces |
| Dance & movement | `dance_studio`, `theatre_small`, `school_workshop`, `collective` | contemporary/butoh/improv studios, open-class studios, dance houses, companies and collectives that teach or host |
| Visual art | `gallery`, `artist_run_space`, `art_centre`, `museum`, `community_space` | artist-run and project spaces, independent galleries with emerging artists, university galleries, art centres with experimental programmes, open-studio hubs, contemporary museums *only* with a strong experimental programme (score 3) |
| Photography & film | `gallery`, `art_centre`, `festival`, `collective`, `venue` | photography galleries/centres/festivals, experimental film and video-art venues, artist-moving-image festivals, microcinemas, screening collectives |
| Theatre & performance | `theatre_small`, `festival`, `collective` | black boxes, experimental theatre companies, performance-art festivals and spaces |
| Festivals & events | `festival`, `platform` | all underground/experimental festivals, biennials, art weeks and fairs with an independent angle, **across the whole year** (give usual dates/season) |
| Residencies & learning | `residency`, `school_workshop` | **residencies for dance, performance and interdisciplinary artists**, residencies that take foreigners, intensives, masterclass series, artist-run schools |
| Infrastructure | `funder`, `institution`, `network`, `platform` | foundations, arts councils, cultural institutes (e.g. Japan Foundation, Goethe, Institut français) with programmes for independent artists, artists' networks/unions |
| Listings & media | `aggregator`, `media` | calendars, ticketing platforms used by small organisers, art and music media that list the scene, active public Discord/LINE/Telegram groups only if public |

**Not in scope:** large commercial galleries, mainstream venues, tourist experiences (score ≤ 2).
Borderline institutions are fine at score 3: say so in `underground_reason`.

## 2. Scope and targets

Work in **waves**; finish and save a wave before starting the next.

**Wave 1: Japan, Tokyo and Kyoto only.** Osaka, Kobe and Nara are NOT targets: do not research them, even as day trips. This is the pilot and the most valuable wave. These counts are **new** organisations on top of the 48
in the input:
| Area | `market` | Target |
|---|---|---|
| Tokyo (+ Yokohama as a day trip, still `market = tokyo`) | `tokyo` | **120** |
| Kyoto | `kyoto` | **70** |

Across the whole wave, make sure **every field in the table above is represented**; Japan currently
lacks: independent galleries (Kyoto especially), photography, film/video-art spaces, theatre,
residencies, schools, record shops/labels and clubs. Fill those gaps first.

**Wave 2: other cities**, in this order, each **30–50 new** organisations across all fields:
`tel_aviv` (and other Israeli cities with a scene), `berlin`, `seoul`, `vienna`, `brussels`,
`paris`, `amsterdam`, `lisbon`, `athens`, `barcelona`, then the remaining keys in `00_CONTEXT.md` §7.
The ~320 existing organisations are listed in `institutions_existing_other_markets.md`: skip them.
You may propose up to 5 more major cities (state why).

Targets are **minimums to aim for**. A short list of verified, active places beats a long list of
stale ones. If you cannot reach a target honestly, explain the gap in your log.

## 3. Deliverable columns: `places_new_<wave>_<city>.csv`

One file per city, e.g. `places_new_w1_tokyo.csv`. UTF-8, header exactly:

```
source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,instagram_evidence,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_notes,status,last_active_evidence,evidence_url,verified_at,notes,about,contact_email,email_type,email_evidence_url,contact_form_url,phone_public
```

| Column | Rule |
|---|---|
| `source_id` | `<city3>-<short slug>`, lowercase ASCII, unique across your files and the input |
| `existing_source_id` | Only if you are *updating* an organisation that is already in the input (then keep its id here and put the corrected data in the row). Otherwise empty |
| `name` / `name_ja` | The organisation's own English name; local-script name in `name_ja` (for any country) |
| `source_type` | One value from `00_CONTEXT.md` §8 |
| `market` | Database key or proposed slug |
| `neighborhood`, `address` | Public street address of the venue/office. Empty for online-only bodies |
| `lat`, `lng` | Decimal degrees **only** if you read them from a map link on the organisation's own page; otherwise empty |
| `discipline_focus` | From the database list, comma-separated |
| `scene_tags` | Short free tags, comma-separated (`butoh`, `improv`, `noise`, `artist_run`, `residency`, `zine`, `photo`, `film`…) |
| `underground_score` | 3–5 |
| `underground_reason` | One honest sentence (internal) |
| `tier` | `1` = must know, `2` = good to know, `3` = niche |
| `website_url`, `calendar_url`, `instagram_url` | Official only. Instagram per `00_CONTEXT.md` §6.2 (`instagram_evidence` required) |
| `other_links` | Other official channels, comma-separated |
| `listing_language` | `ja`, `en`, `ja+en`, or the local language code(s) |
| `ticketing` | Where tickets/booking happen (`door`, `peatix`, `ra`, `email`, …) |
| `scrape_method` | How events could be read later: `html_calendar`, `peatix`, `ra`, `instagram_only`, `x_only`, `newsletter`, `manual` |
| `newcomer_friendly` | `yes`, `no`, `unknown`: can someone with no contacts show up or sign up? |
| `foreigner_notes` | Practical line: "English-speaking staff", "Japanese-only reservations", "cash only, drink charge" |
| `status` | `active`, `dormant` (nothing in 6+ months), `closed` |
| `last_active_evidence` | Date of the most recent dated activity you found |
| `evidence_url` | Page proving it exists and is active |
| `verified_at` | `YYYY-MM-DD` |
| `notes` | Internal, 1–2 sentences: why it matters and how to get involved |
| `about` | **Shown on the site.** 2–4 short paragraphs, 400–1000 characters, English, your own words: what it is, what it programmes and for whom, its scene and lineage, how a visiting artist gets involved. Facts only from pages you opened. Blank line between paragraphs inside the quoted cell; no double quotes inside the cell |
| `contact_email`, `email_type`, `email_evidence_url`, `contact_form_url`, `phone_public` | Per `00_CONTEXT.md` §6.1. For organisations a public role address (`info@`) is expected and fine (`organisation_role`); a **public venue phone** is allowed here. Empty if not published |

**Closed and dormant places:** keep them, with `status = closed` or `dormant`, and the closure
date if known. This tells us not to send anyone there. Underground venues close often. Do not rely
on memory or older articles: confirm activity in the last 6 months (a recent event, post or live
calendar).

**Contact minimum:** every `active` organisation needs at least one of `contact_email`,
`contact_form_url`, `instagram_url`, or `website_url` that has a visible contact section. If none
exists, deliver the row anyway and write `no public contact found` at the start of `notes`.

## 4. How to search

1. **Search in the local language as well as English.** Japanese terms: `ギャラリー`, `オルタナティブスペース`,
   `アーティスト・ラン・スペース`, `ライブハウス`, `実験音楽`, `レコードショップ`, `スタジオ`, `舞踏`,
   `コンテンポラリーダンス`, `レジデンス`, `写真`, `映画`, `実験映像`, `小劇場`, `フェスティバル`,
   `ワークショップ`, `スペース`, `場所名 + スケジュール`. Apply the same logic in each wave-2 language.
2. **Follow the network.** Open one good place, read its past programme: the venues, collectives
   and artists it names lead to the next ones. Gallery and art-week "participating spaces" lists,
   festival venue lists, and open-studio maps are rich sources.
3. **Listing platforms** (Tokyo Art Beat, Resident Advisor, Peatix, Tiget, ArtSticker and their
   equivalents elsewhere) are good for *discovering* names; the organisation's own page is the
   evidence.
4. **Official source only** for `evidence_url`.
5. De-duplicate against the input files before adding anything (name, local name, website domain).
   Report near-matches you were unsure about in the log.

## 5. Also deliver

### `corrections_log.md`
Existing organisations (from the input) that are closed, moved, renamed, or have wrong data, with
the evidence URL for each.

### `MISSION_C_log.md`
- Counts per city, per `source_type` and per field (a small table).
- Organisations you checked and dropped, with the reason (score under 3, mainstream, closed with no
  evidence, duplicate).
- Proposed new markets and city prefixes.
- Gaps: sub-scenes you could not reach and why (Instagram-only, language, private venues).
- The ten feeds/calendars you found most useful per city (for the weekly refresh process).

## 6. Self-check before you hand back

- [ ] Every row has an `evidence_url` you opened and a `verified_at`.
- [ ] Every `active` row shows recent activity (`last_active_evidence` within ~6 months).
- [ ] No duplicates of the input files; ids are unique.
- [ ] Nothing invented; unverified cells are empty.
- [ ] Every non-empty e-mail has an `email_evidence_url`; no pattern-built addresses; no data brokers.
- [ ] Every non-empty `instagram_url` has `instagram_evidence`.
- [ ] `about` is your own words, 400–1000 characters, English.
- [ ] All fields in §1 are represented per city; no single field is more than ~45% of a city's rows.
- [ ] Wave 1 was delivered in full before Wave 2 began.
