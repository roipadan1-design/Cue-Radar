# Research mission: the underground arts map of Kyoto and Tokyo

> **How to use this file:** paste this whole file into a fresh research session, and attach
> `FABLE_CONTEXT.md` (the project context) alongside it. Fill in the **Client profile** block in
> section 1 before you send it. The researcher has never seen this project. Everything it needs
> is in these two files.

---

## 0. Who you are and what you're producing

You are the lead field researcher for **Fellow.**, a small product that helps independent artists
find their way into a city's arts scene. Read `FABLE_CONTEXT.md` first. It explains the product,
the audience, and the data format your output has to fit.

Your job is to build a **verified map of the underground and alternative arts scene in Kyoto and
Tokyo**, plus a **verified listing of what is on in both cities over the next four weeks**. A real
artist is in these cities right now and will use what you find, so every row has to be
something they can act on: go to the event, walk into the space, sign up for the class, meet the
collective.

You are not writing code. You produce research files (CSV and Markdown) that the product team
imports into its master database.

**Today is Monday 19 October 2026.** The event window is **19 Oct to 15 Nov 2026**. The first
week, **19 to 25 Oct**, matters most.

---

## 1. Client profile (the owner fills this in before sending)

```
Name / handle:            [fill in, or "anonymous"]
Practice:                 [e.g. contemporary dance + live electronics]
Currently in:             [Kyoto from __ to __ / Tokyo from __ to __]
Languages:                [e.g. English, Hebrew; no Japanese]
Looking for:              [e.g. classes to join, people to collaborate with, places to show work, inspiration]
Hard no's:                [anything they don't want to see]
```

If this block is still empty, assume: a cross-disciplinary artist working in **contemporary dance
and experimental music**, no Japanese, in both cities for the whole window, who wants to (a) see
work, (b) take part in classes, jams and workshops, and (c) meet the people running the scene.

---

## 2. Focus: what counts and what doesn't

### 2.1 Disciplines, in priority order

1. **Dance**: contemporary, butoh and its offshoots, improvisation, contact improvisation,
   experimental choreography, open classes, dance labs, showings and work-in-progress.
2. **Music**: experimental, improvised, noise, free jazz, electroacoustic, sound art, ambient and
   drone, avant-garde club and electronic music, DIY live-house shows, small-label nights.
3. **Exhibitions**: artist-run spaces, project spaces, independent galleries, small and
   mid-size contemporary galleries, open studios, exhibitions crossing into performance or sound.

Secondary. Include these when they are clearly underground or alternative: performance art,
experimental theatre, festivals, masterclasses, talks and lectures, artist meetups, parties with a
curatorial point of view, screenings of experimental film or video art.

### 2.2 Event types we track

Performances · festivals · masterclasses and workshops · open classes · jams · lectures and talks ·
exhibitions and openings · parties and club nights · artist meetups and open studios · showings and
work-in-progress · dance performances.

### 2.3 The underground filter (this is the core of the job)

Our audience is **underground and alternative, not mainstream**. Score every place and every event
from 1 to 5 using this rubric, and give a short reason.

| Score | Meaning | Typical examples (by kind, not by name) |
|---|---|---|
| **5** | Core underground: artist-run, DIY, experimental, small rooms | improv and noise venues of about 20 to 80 people; artist-run spaces; butoh and improv dance studios; DIY dorm or community halls; zine and record shops that host shows |
| **4** | Independent and curatorially adventurous | independent galleries showing emerging artists; mid-size live houses with experimental programming; small contemporary dance houses; club nights run by collectives |
| **3** | Institution, experimental programme | a public arts centre or theatre presenting an experimental festival or residency showing; a university gallery. **Include it, and say so.** |
| **2** | Mainstream with an occasional edge | large commercial galleries, big clubs with mainly commercial bookings. Leave out unless a specific event clearly scores 4 or higher. |
| **1** | Mainstream | arena and hall concerts, J-pop and idol shows, musicals, tourist-format traditional performance, blockbuster or "immersive" museum shows, large EDM events, tourist experiences. **Leave out.** |

**Only score 3 and above goes into the deliverables.** When something is borderline, include it,
score it honestly, and explain why in `underground_reason`. Traditional forms (noh, kabuki, gagaku,
shamisen and so on) count **only** when the presentation is experimental, contemporary, or
cross-disciplinary, never in tourist format.

---

## 3. What to research

### Part A: the scene map (places, collectives, festivals)

For **each city**, map the ecosystem. You are building the list of *who makes things happen*:

- **Venues**: experimental music venues, live houses, small clubs, dance studios that run open
  classes and showings, small theatres, black boxes, community or DIY halls.
- **Exhibition spaces**: artist-run spaces, project spaces, independent galleries, university
  galleries, contemporary art centres with an experimental programme.
- **Collectives and crews**: dance companies or collectives that run classes, improv collectives,
  party crews, sound-art collectives, small labels that run regular nights.
- **Festivals**: all underground and experimental festivals for dance, music, performance and art
  in or near the city, **across the whole year, not only this month**. Give the usual dates or
  season and whether there is an edition inside our window.
- **Learning**: places offering masterclasses, workshops, open classes, intensives, and residencies
  that take foreigners.
- **Infrastructure**: residencies, arts centres, foundations, and support bodies that an artist
  could approach for studio space, presentation, or a connection.
- **Listings and media**: where the scene actually announces itself, such as event aggregators,
  art and music calendars, ticketing platforms, newsletters, Instagram and X accounts, Discord or
  LINE communities if they are public. (See Part C.)

**Coverage target per city:** at least **40 places/collectives/festivals for Tokyo** and at least
**25 for Kyoto**, scored 3 to 5. Quality beats quantity: 25 solid Kyoto rows are worth more than
40 thin ones. Go past the first page of English results. Most of this scene only exists in
Japanese.

**Kyoto note:** treat the Kansai area around Kyoto (Osaka, Kobe, Nara) as a day trip. Include
places there **only** when they are major hubs for these disciplines, and mark them
`market = kyoto` with `notes` beginning `Day trip – Osaka:` (or Kobe, Nara). Same for Tokyo and
Yokohama: `market = tokyo`, `notes` beginning `Day trip – Yokohama:`.

### Part B: what's on (events in the window)

For every place in Part A that is active, check its own calendar for events between **19 Oct and
15 Nov 2026**. Then sweep the aggregators in Part C for anything you missed.

**Targets:** at least **60 Tokyo events** and **30 Kyoto events** in the window. At least
**20 Tokyo** and **10 Kyoto** in the first week (19 to 25 Oct). At least a third of all events
should be dance.

Also capture **recurring** activities that are open to visitors: weekly open classes, monthly jam
sessions, regular improv nights, recurring parties. Put each one in as **one row** with
`recurrence` filled in (e.g. `weekly Tue 19:30`), and `date` set to the next occurrence inside the
window.

### Part C: listing feeds (how we keep this current)

The product needs to refresh this every week. List **every source a person would check to find
out what's on** in each city, and say how usable it is: language, update frequency, whether events
have dates and URLs that can be read reliably, and whether you would need Instagram to get them.

### Part D: the written scene report

A Markdown report a newcomer can read in 15 minutes and come away knowing how the scene works.
Structure is in section 5.

---

## 4. How to search

1. **Search in Japanese as well as English.** This is required. A large share of the scene never
   appears in English. Useful terms:
   - Dance: `コンテンポラリーダンス` `舞踏` `即興` `コンタクト・インプロビゼーション` `ダンス WS`
     `ワークショップ` `オープンクラス` `ショーイング` `公演` `振付`
   - Music: `実験音楽` `即興演奏` `ノイズ` `フリージャズ` `電子音楽` `サウンドアート`
     `アンビエント` `ライブハウス` `スケジュール` `出演`
   - Art: `展覧会` `展示` `オルタナティブスペース` `アーティスト・ラン・スペース` `ギャラリー`
     `オープンスタジオ` `レジデンス`
   - General: `トーク` `レクチャー` `イベント` `今週` `10月` `11月` `京都` `東京` `予約` `入場料`
2. **Start from the edges.** Find one good underground venue, then read its past line-ups. The
   performers and collectives listed there lead you to the next venues. Follow the network.
3. **Use the official source.** For each event the `evidence_url` must be the venue's own page,
   the organiser's page, or the ticketing page (e.g. Peatix, Resident Advisor, Tiget, LivePocket,
   e+, Pia). Blogs and listicles are leads, never evidence.
4. **Check that places still exist.** Underground venues close often. Before you list a place,
   confirm it has been active in the last 6 months: a recent event, a recent post, a current
   calendar. If it has closed, keep it with `status = closed` and the closure date if known. This
   tells us not to send anyone there. Some well-known venues have closed in recent years, so don't
   rely on memory or older articles.
5. **Translate meaning, not just words.** Write English descriptions in your own words. Keep
   Japanese names in a `_ja` column and use the venue's own English name if it has one.

---

## 5. Deliverables (exactly these files)

Return a single folder (or zip) named `fellow_japan_research_2026-10/` containing:

### 5.1 `places.csv` (one row per venue, space, collective, festival, institution, or listing source)

UTF-8 CSV, header row exactly as below. Multi-value fields are comma-separated inside one quoted
cell. Leave unknown cells **empty**. Never guess.

```
source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_friendly_notes,status,last_active_evidence,evidence_url,verified_at,notes
```

| Column | Rule |
|---|---|
| `source_id` | `kyo-` or `tyo-` + short lowercase slug, e.g. `tyo-forestlimit`. Unique. |
| `existing_source_id` | If the place is already in our database (list in `FABLE_CONTEXT.md` §6), its `SRC…` id. Otherwise empty. |
| `source_type` | One of: `venue_music`, `live_house`, `club`, `dance_studio`, `theatre_small`, `gallery`, `artist_run_space`, `art_centre`, `museum`, `festival`, `collective`, `label`, `school_workshop`, `residency`, `shop_venue` (record shop, bookshop, or café that hosts shows), `community_space`, `aggregator`, `media` |
| `market` | `kyoto` or `tokyo` only |
| `discipline_focus` | From: `dance`, `music`, `sound`, `performance`, `painting`, `sculpture`, `visual_art`, `photography`, `film`, `theatre` |
| `scene_tags` | Free short tags, e.g. `butoh, improv, noise, techno, ambient, contact_improv, artist_run` |
| `underground_score` | 3, 4 or 5 (see 2.3). Rows scoring under 3 don't go in. |
| `tier` | Importance to *this* audience: `1` = must know, `2` = good to know, `3` = niche |
| `listing_language` | `ja`, `en`, or `ja+en` |
| `ticketing` | Where they sell, e.g. `door`, `email reservation`, `peatix`, `ra`, `tiget` |
| `scrape_method` | How we would get their events: `html_calendar`, `peatix`, `ra`, `instagram_only`, `x_only`, `newsletter`, `manual` |
| `newcomer_friendly` | `yes`, `no`, `unknown`: can someone with no contacts just show up or sign up? |
| `foreigner_friendly_notes` | e.g. "English-speaking staff", "Japanese-only reservations by email", "cash only, drink charge" |
| `status` | `active`, `dormant` (nothing for 6+ months), or `closed` |
| `last_active_evidence` | Date (YYYY-MM-DD) of the most recent dated activity you found |
| `evidence_url` | The page proving it exists and is active |
| `verified_at` | The date you checked, YYYY-MM-DD |
| `notes` | 1–2 sentences: why it matters to an underground artist, and how to get involved |

### 5.2 `events.csv` (one row per event or recurring activity in the window)

```
event_id,market,venue_source_id,venue_name,title,title_ja,event_type,disciplines,date,end_date,time,end_time,recurrence,price_min,price_max,currency,ticket_url,evidence_url,lat,lng,lineup,description,underground_score,underground_reason,newcomer_friendly,language_barrier,booking_required,verified_at,confidence
```

| Column | Rule |
|---|---|
| `event_id` | `kyo-evt-` / `tyo-evt-` + `YYYYMMDD` + short slug, unique |
| `venue_source_id` | The `source_id` from `places.csv`. **Every venue that appears in events must exist in places.** |
| `event_type` | One of: `performance`, `concert`, `dance`, `theatre`, `showing`, `exhibition`, `festival`, `workshop`, `class`, `masterclass`, `lab`, `talk`, `club`, `party`, `jam`, `meetup`, `open_studio`, `screening` |
| `disciplines` | Same list as `discipline_focus` |
| `date` / `end_date` | `YYYY-MM-DD`. Exhibitions and festivals: `date` = start, `end_date` = end. Single-night events: leave `end_date` empty. |
| `time` / `end_time` | `HH:MM`, 24-hour, local time. Use the start of the show, not doors, and note doors in `description` if different. |
| `recurrence` | Empty for one-offs; otherwise e.g. `weekly Thu 19:00`, `monthly 1st Sat` |
| `price_min` / `price_max` | Numbers only, JPY. `0` = free. Leave empty if unknown. Note drink charges in `description`. |
| `lineup` | Performer, artist and collective names **exactly as printed by the organiser**. Never add names. |
| `description` | **Max 200 characters**, English, your own words: what it is and why it's worth going |
| `language_barrier` | `none` (non-verbal or English OK), `some`, or `high` (Japanese talk or Japanese-only booking) |
| `booking_required` | `yes`, `no`, or `recommended` |
| `confidence` | `high` = confirmed on the official page; `medium` = confirmed only on a secondary listing; `low` = announced but details missing. **Low-confidence events still go in, with the gap explained in `description`.** |

### 5.3 `feeds.csv` (listing sources for keeping this up to date)

```
feed_id,name,market,url,feed_type,language,covers,update_frequency,has_structured_dates,requires_login,usefulness,notes
```

`feed_type`: `aggregator`, `ticketing`, `venue_calendar`, `instagram`, `x`, `newsletter`, `media`,
`community`. `covers`: which disciplines. `usefulness`: 1 to 5 for *our* audience.

### 5.4 `REPORT.md` (the scene report)

Sections, in this order:

1. **Summary**: ten lines max. What is strong in each city, where the gaps are, and the top 5
   places per city a newcomer should know.
2. **Tokyo scene map**: by discipline (dance / music / art), then by neighbourhood: the hubs, the
   weekly rhythm (which nights things happen, which areas), and which collectives connect them.
3. **Kyoto scene map**: same structure, plus how Kyoto connects to Osaka, Kobe and Tokyo.
4. **Festival calendar (12 months)**: one table per city of the underground and experimental
   festivals across the year, with usual dates, discipline, and whether they take open
   applications from artists.
5. **This week, the shortlist**: the 10 best things in each city for 19 to 25 Oct for a dance and
   music artist, ordered by date.
6. **How to plug in**: concrete, practical ways a foreign artist joins this scene: open classes,
   jams, open-mic or open-stage nights, artist meetups, residencies that take short stays, places
   where artists hang out after shows. Include practical etiquette: reservations (予約) by email
   or form, cash at the door, drink charges, start-time conventions, photography rules.
7. **Opportunities spotted**: any open calls, residencies, or application deadlines you came across
   while doing this (don't search for them on purpose; just record what you saw).
8. **Keeping it fresh**: which 10 feeds per city would cover 80% of what matters every week, and
   how much of it needs a human because it only exists on Instagram.
9. **Gaps and doubts**: what you couldn't verify, what looked promising but was closed, and where
   a local contact would help.

### 5.5 `VERIFICATION_LOG.md`

A short log: how many places and events you checked, how many you dropped and why (closed,
mainstream, couldn't verify), and every row marked `confidence = low` or `status = dormant`, with
the reason.

---

## 6. Rules you must not break

1. **Nothing invented.** Every place, event, date, price, and name must come from a page you
   actually opened. If you can't confirm it, leave the cell empty, or leave the row out. A thin,
   honest file is worth more to us than a full, plausible one. This product's whole promise to
   artists is that everything was checked by a person.
2. **Every row has an `evidence_url`** you opened, and a `verified_at` date.
3. **No personal data.** Use organisations, collectives, and performer names as they appear in
   public line-ups. **No** private phone numbers, private emails, or home addresses. For contact,
   use the organisation's official form or public email only.
4. **No copied text.** Descriptions are your own short summaries, not pasted press text.
5. **Mainstream stays out** (score 1–2), unless you flag a specific exception and explain it.
6. **Dates in the window only** for `events.csv` (19 Oct – 15 Nov 2026). Festivals outside the
   window go in `places.csv` and the festival calendar in `REPORT.md`, not in `events.csv`.
7. **Closed places stay in** with `status = closed`. Don't delete them, because that stops us
   from sending someone to a dead address later.

---

## 7. Before you hand it back: a self-check

- [ ] Every `venue_source_id` in `events.csv` exists in `places.csv`.
- [ ] No duplicate `source_id` / `event_id`.
- [ ] All dates are `YYYY-MM-DD`, inside the window for events.
- [ ] All `description` cells are 200 characters or fewer.
- [ ] Every row has `evidence_url` + `verified_at`.
- [ ] No row has `underground_score` below 3.
- [ ] At least a third of the events are dance.
- [ ] Coverage targets reached, or `REPORT.md` → *Gaps* explains why not.
- [ ] Japanese sources were searched in Japanese (say which terms worked best in the log).

When you're done, reply with a 10-line summary: counts per city, per discipline, per score, and
the three things that surprised you most.
