# Fellow. research, round 2. Chat 1 of 3: INSTITUTIONS (places, collectives, festivals, spaces)

> **This is the only file this research chat needs.** Everything is inside: the goal, the rules,
> the output format, the project context, and the data already collected in round 1 (appendices at
> the end). Read it top to bottom, then start. **Today is Tuesday 20 October 2026.**
> Deliver in **batches of at least 10 verified rows** instead of one big drop, and say what is
> still missing at the end of each batch.
>
> **Hand back:** `places_new.csv` (new rows only, same columns as Appendix A), `places_backfill.csv` (existing rows that gain contact routes, same `source_id`s, only the contact columns changed), `VERIFICATION_LOG.md` (what you checked, dropped and why).

---


## 0. Your job in this chat

Round 1 produced **44 places** (19 kyoto, 25 tokyo). They are in **Appendix A**.
Do not repeat them. Your job:

1. **Add at least 15 new Tokyo and 6 new Kyoto places**, which brings the totals to the targets
   (**40 Tokyo, 25 Kyoto**). Priority gaps from round 1:
   - Tokyo: clubs, parties and DIY music nights beyond the ones already listed.
   - Kyoto: independent galleries and artist-run spaces.
   - Both: exhibition spaces, studios that run classes and workshops, residencies, collectives,
     festivals.
   - We care about concerts, exhibitions, workshops, masterclasses and the people behind them.
2. **Backfill contact routes.** In round 1, **7 of 44 places have no website, Instagram or other link at all**. Find a public
   route for each and return them in `places_backfill.csv`.
3. Every new row follows the full format in section 4, including a real `about`.
4. Scope: **Kyoto and Tokyo only.**

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

---

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

**Scope note:** Kyoto and Tokyo only. Do not include places or events in Osaka, Kobe or Nara.
For Tokyo, a place in Yokohama may be included **only** when it is a major hub for these
disciplines: `market = tokyo`, `notes` beginning `Day trip – Yokohama:`.

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

---

## 4. Output format: `places_new.csv`

UTF-8 CSV, header row exactly as below. Multi-value fields are comma-separated inside one quoted
cell. Leave unknown cells **empty**. Never guess.

```
source_id,existing_source_id,name,name_ja,about,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_notes,status,last_active_evidence,evidence_url,verified_at,notes
```

| Column | Rule |
|---|---|
| `source_id` | `kyo-` or `tyo-` + short lowercase slug, e.g. `tyo-forestlimit`. Unique. |
| `existing_source_id` | If the place is already in our database (see Appendix A), its `SRC…` id. Otherwise empty. |
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
| `foreigner_notes` | e.g. "English-speaking staff", "Japanese-only reservations by email", "cash only, drink charge" |
| `status` | `active`, `dormant` (nothing for 6+ months), or `closed` |
| `last_active_evidence` | Date (YYYY-MM-DD) of the most recent dated activity you found |
| `evidence_url` | The page proving it exists and is active |
| `verified_at` | The date you checked, YYYY-MM-DD |
| `notes` | 1–2 sentences: why it matters to an underground artist, and how to get involved |
| `about` | **Shown as the "About" section of the organisation page.** 2–4 short paragraphs, 400–1000 characters, English, your own words: what the place is, what it programmes and for whom, its scene and lineage, and how a visiting artist gets involved. Separate paragraphs with a blank line inside the quoted cell. Facts only from pages you opened. |

---

## Rules you must not break

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

Round 2 additions:
- **Scope is Kyoto and Tokyo only.** Never include places, events or people in Osaka, Kobe or Nara. (A major hub in Yokohama is allowed for Tokyo, marked `Day trip – Yokohama:` in notes.)
- **Contact routes:** every place and every person needs at least one public way to reach them (own website, own professional Instagram, or an official contact page or form). No private emails, phone numbers or private accounts.

---

## Self-check before you hand a batch back

- [ ] Every row scores 3 or higher on the underground filter, with closed places kept and marked `closed`.
- [ ] Every new row has a real `about` (your own words), a verified `status` and `last_active_evidence`.
- [ ] Every row has at least one public contact route.
- [ ] No row duplicates a place in Appendix A (check name, Japanese name and website).
- [ ] Nothing in Osaka, Kobe or Nara.

---

# APPENDIX A: places already collected in round 1 (`places.csv`, 44 rows)

```csv
source_id,existing_source_id,name,name_ja,source_type,market,neighborhood,address,lat,lng,discipline_focus,scene_tags,underground_score,underground_reason,tier,website_url,calendar_url,instagram_url,other_links,listing_language,ticketing,scrape_method,newcomer_friendly,foreigner_friendly_notes,status,last_active_evidence,evidence_url,verified_at,notes
kyo-kyotoexperiment,SRC072,Kyoto Experiment,KYOTO EXPERIMENT 京都国際舞台芸術祭,festival,kyoto,"Citywide (KAC, ROHM, Shunjuza, E9)",,,,"dance,theatre,performance,music,visual_art","experimental,international,festival,fringe",4,Independent festival committee with a radical cross-genre programme; uses institutional venues but the fringe (More Experiments) is artist-run,1,https://kyoto-ex.jp/en/,https://kyoto-ex.jp/en/program/,https://www.instagram.com/kyotoexperiment/,"https://x.com/kyoto_ex,https://kyoto-ex.jp/newsletter/",ja+en,"e-get (online), day tickets +500",html_calendar,yes,Full English site; most shows subtitled or non-verbal; Festival Share Cafe after marked shows is a meeting point,active,2026-10-17,https://kyoto-ex.jp/en/program/,2026-10-19,"2026 edition 3-25 Oct, so the first week is the last week. Post-show talks and the Share Cafe are the easiest way to meet the Kansai performing-arts crowd."
kyo-urbanguild,,UrBANGUILD,アバンギルド,live_house,kyoto,Kiyamachi / Sanjo,"New Kyoto Bldg 3F, Kiyamachi Sanjo-sagaru, Nakagyo-ku, Kyoto",,,"music,dance,performance,theatre","butoh,improv,experimental,ambient,noise,contact_improv,candlelit",5,"Artist-run 120-cap room since 2006; monthly FOuR DANCERS dance night, Butoh Night, free-improv and experimental touring acts; no-charge bar after shows",1,https://urbanguild.net/,http://urbanguild.net/events/,https://www.instagram.com/urbanguild,"https://twitter.com/Ur_BANGUILD,webcal://urbanguild.net/?post_type=tribe_events&ical=1&eventDisplay=list",ja,"door, reservation form on site for advance-priced nights",html_calendar,yes,Listings in Japanese but lineups readable; +700 yen drink charge; bar stays open no-charge until 24:00 after events (best hang-out in Kyoto),active,2026-10-20,http://urbanguild.net/events/,2026-10-19,"The single most important Kyoto room for this client: dance nights (FOuR DANCERS has a reduced 'dancer' ticket), butoh, improv, ambient tours. Reserve via the site form; pay cash at door."
kyo-kac,,Kyoto Art Center,京都芸術センター,art_centre,kyoto,Muromachi / Shijo,"546-2 Yamabushiyama-cho, Muromachi-dori Takoyakushi-sagaru, Nakagyo-ku, Kyoto",,,"dance,theatre,visual_art,music","artist_studios,free_workshops,residency,festival_hub",3,"City-run former school; free studios for young companies (Monochrome Circus, ANTIBODIES Collective etc.), free Meirin workshops, KEX main venue",1,https://www.kac.or.jp/,https://www.kac.or.jp/events/,https://www.instagram.com/kyotoartcenter/,https://www.kac.or.jp/en/,ja+en,"teket, window",html_calendar,yes,"English site; free entry to building, library, cafe (11-18); workshops booked via teket form in Japanese",active,2026-10-19,https://www.kac.or.jp/,2026-10-19,"Walk in any day: the studio-user list on the site is a who's-who of Kyoto dance. Meirin workshops are free and taught by resident artists; open calls (Co-program, KIPPU U35, studio residency) posted here."
kyo-butohfes,,Kyoto International Butoh Festival,京都国際舞踏祭,festival,kyoto,Higashiyama (SPACE LFAN),"SPACE LFAN, 10-151-1 Honmachi, Higashiyama-ku, Kyoto",,,"dance,music","butoh,international,improv,festival",5,"Artist-run (Katsura Kan & committee), 60+ dancers from 47 regions over 9 nights with live musicians; the kind of room where you meet every butoh person in Japan",1,https://kyoto-butohfes.com/,https://kyoto-butohfes.com/,,"https://kyotobutohfes4.peatix.com/,https://kyotobutohfes4.zaiko.io/ja/e/kyoto-butoh-festival-4",ja+en,"peatix (adv 4000, 3-day 10000, 9-day 27000, door 4500)",peatix,yes,Bilingual statement; many foreign dancers perform; contact kyotobutohfes@gmail.com (public festival address),active,2026-10-13,https://kyoto-artbox.jp/event/95892,2026-10-19,4th edition 7-15 Nov 2026. Pre-event 26 Oct at UrBANGUILD with open stage ('surprise guest appearances by festival dancers') is the networking night before the festival.
kyo-spacelfan,,SPACE LFAN,,community_space,kyoto,Higashiyama / Honmachi,"10-151-1 Honmachi, Higashiyama-ku, Kyoto",,,"dance,performance","butoh,venue",4,Small private space hosting the 9-night butoh festival; little public info beyond that,3,,,,,ja,via organiser,manual,unknown,,active,2026-11-07,https://kyoto-artbox.jp/event/95892,2026-10-19,Only verified as the 2026 butoh festival venue. Near THEATRE E9 and @KCUA.
kyo-monochromecircus,,Monochrome Circus,モノクローム・サーカス,collective,kyoto,,,,,dance,"contact_improv,improv,company,workshops",5,Kyoto's contact-improvisation company (since 1990); runs CI workshops and jams at KAC and directs the Kyoto International Dance Workshop Festival,1,https://monochromecircus.com/,https://monochromecircus.com/news/,,,ja,email/form via company,manual,yes,"CI workshops are physical, not verbal; past KAC listings were Japanese-only but open to anyone",active,2026-05-09,https://www.kac.or.jp/events/20260509/,2026-10-19,The door into Kyoto contact improv. Watch KAC's Meirin Workshop page for their next CI jam; email the company (public address on their site) to ask about open classes.
kyo-kiraza,,Butoh company Kiraza (Ima Tenko),舞踏カンパニー倚羅座 / 今貂子,collective,kyoto,,,,,"dance,music","butoh,company",5,"Independent butoh company led by Ima Tenko; performs in small rooms (UrBANGUILD), KEX fringe participant",2,https://imakiraza.wixsite.com/kirabutoh,,,,ja+en,UrBANGUILD reservation form,manual,yes,Site has English notes; performances non-verbal,active,2026-10-20,https://imakiraza.wixsite.com/kirabutoh,2026-10-19,Ima Tenko performs MIZUMONO on 20 Oct and CIBELES on 30 Oct at UrBANGUILD. Ask at the bar after the show about workshops.
kyo-clubmetro,,CLUB METRO,クラブメトロ,club,kyoto,Jingu-Marutamachi (Keihan),"82 Shimotsutsumi-cho, Kawabata Marutamachi, Sakyo-ku, Kyoto",,,music,"club,electronic,experimental,collectives,techno",4,"Long-running basement club under a station with collective-run nights (ACTIVISM!!!, Sound Maneuvers x EXP, Deep Underground techno) alongside bands",1,,,,https://eplus.jp/borofesta,ja,"door, eplus for festivals",manual,yes,Cash at door; ID may be checked at night,active,2026-10-31,https://eplus.jp/borofesta,2026-10-19,Boro Festa's night session (31 Oct) with 食品まつり a.k.a foodman is the most experimental club night found in the window. Website not opened in this pass; use the e+ and kyoto.travel listings.
kyo-borofesta,,Boro Festa,ボロフェスタ,festival,kyoto,KBS Hall + Club Metro,,,,music,"indie,diy,festival,experimental_electronic",4,"Volunteer-run Kyoto indie festival; daytime hall stages are guitar-indie, the Metro night stage leans experimental (foodman, NATURE DANGER GANG)",2,,,,https://eplus.jp/borofesta,ja,eplus,manual,yes,e+ ticketing is Japanese-only; smartphone tickets,active,2026-10-31,https://eplus.jp/borofesta,2026-10-19,"31 Oct-3 Nov 2026. Go for the Metro night, skip the hall unless you like Japanese indie rock."
kyo-kcua,,@KCUA (Kyoto City University of Arts Gallery),京都市立芸術大学ギャラリー@KCUA,gallery,kyoto,Kyoto Station east / Higashiyama,,,,"visual_art,performance","university_gallery,experimental",3,University gallery with an experimental programme; hosts KEX exhibitions,2,https://gallery.kcua.ac.jp/,,,,ja+en,free,html_calendar,yes,"Free; 10:00-18:00, closed Mondays",active,2026-11-08,https://kyoto-ex.jp/en/program/,2026-10-19,Kaori Endo / Mithu Sen exhibition runs to 8 Nov. The art-school crowd hangs around here and HAPS.
kyo-rohm,,ROHM Theatre Kyoto,ロームシアター京都,art_centre,kyoto,Okazaki,,,,"theatre,dance,music","institution,repertory,kex_venue",3,Public theatre; include only for KEX and the 'Hopes' repertory premieres and the U35 KIPPU programme,2,https://rohmtheatrekyoto.jp/,,,,ja+en,ROHM box office / e-get,html_calendar,yes,English site,active,2026-11-08,https://kyoto-ex.jp/en/program/,2026-10-19,"Institutional. Worth it for 'Hopes' repertory (30 Oct-1 Nov, 6-8 Nov) and as KEX venue; otherwise skip."
kyo-theatre-e9,,THEATRE E9 KYOTO,シアターE9京都,theatre_small,kyoto,Higashi-Kujo (south of Kyoto Station),"9-1 Higashikujo Minamikawara-cho, Minami-ku, Kyoto",,,"theatre,dance","black_box,independent_theatre,kex_venue",4,Crowdfunded independent black box opened 2019; KEX venue; hosts Monochrome Circus and young companies,2,https://askyoto.or.jp/e9,,,,ja,via each company,html_calendar,yes,"Office hours 10-18, closed Tue",active,2026-10-25,https://kyoto-ex.jp/en/about/festival-overview/,2026-10-19,Listed as a 2026 KEX venue. Programme page not opened in this pass; check askyoto.or.jp/e9 weekly.
kyo-haps,,HAPS (Higashiyama Artists Placement Service),東山 アーティスツ・プレイスメント・サービス,community_space,kyoto,Higashiyama,,,,"visual_art,performance","artist_support,consultation,open_calls,gallery_club",4,"Artist-support office run by artists for artists: free consultation desk, studio/space listings, open-call digest, and 'Enjoy Exhibition Club' group gallery walks",1,https://haps-kyoto.com/,https://haps-kyoto.com/blog,https://www.instagram.com/hapskyoto/,"https://haps-kyoto.com/en/top_e/,https://haps-kyoto.com/about/support/open-calls/",ja+en,free,html_calendar,yes,English page; consultation by form,active,2026-10-16,https://haps-kyoto.com/,2026-10-19,Best first stop for a foreign artist who wants to meet Kyoto people: ask for a consultation slot and join the next Enjoy Exhibition Club walk (#14 announced 16 Oct).
kyo-kidwf,,Kyoto International Dance Workshop Festival (Kyoto no Atsui Natsu),京都国際ダンスワークショップフェスティバル「京都の暑い夏」,festival,kyoto,Kyoto Art Center,,,,dance,"workshops,contact_improv,international_teachers,intensive",4,"30-year-old workshop festival run by Dance & Environment / Monochrome Circus with KAC; international teachers, CI and improv strands, open enrolment",1,https://www.kac.or.jp/events/20260330/,,,,ja+en,KAC form,html_calendar,yes,International faculty; classes taught in English/Japanese,active,2026-08-09,https://digitalpr.jp/pdf.php?r=139061,2026-10-19,"2026: early-summer edition 2-6 May, main edition 1-9 Aug. Not in the window; put it in the client's calendar for 2027."
kyo-dancebox,,DANCE BOX / ArtTheater dB Kobe,NPO法人DANCE BOX／アートシアターdB神戸,theatre_small,kyoto,Day trip - Kobe: Shin-Nagata,"Asta Kunizuka 4-bankan 4F, 6-1-1 Kubo-cho, Nagata-ku, Kobe",,,dance,"contemporary,open_class,residency,butoh,community",5,"NPO-run 120-seat dance theatre in a shopping arcade; 8-month 'domestic dance study abroad' residency, open classes, AIR, butoh seasons",1,https://db-dancebox.org,https://db-dancebox.org/event,https://www.instagram.com/dancebox_kobe/,https://twitter.com/npo_dancebox,ja,form on site,html_calendar,yes,Japanese site; AIR programme hosts foreign artists so staff are used to English,active,2026-11-18,https://db-dancebox.org,2026-10-19,Day trip - Kobe: 1h from Kyoto by train. The most dancer-dense community in Kansai; the Nov 16-18 intensive is an 'open class' tagged event.
kyo-kyotoartbox,,Kyoto Art Box,京都文化芸術オフィシャルサイト Kyoto Art Box,aggregator,kyoto,,,,,"visual_art,dance,theatre,music","city_listing,searchable",3,City-run listing; mostly institutions but small organisers (butoh festival) post here too,2,https://kyoto-artbox.jp/,https://kyoto-artbox.jp/event/,,,ja,n/a,html_calendar,yes,,active,2026-10-19,https://kyoto-artbox.jp/event/,2026-10-19,Filter by ダンス/音楽 and 公演/ワークショップ. Low signal-to-noise but structured dates.
kyo-kyototravel-night,,Kyoto City Tourism 'Night events' listing (ja.kyoto.travel),京都観光Navi 夜観光イベント一覧,aggregator,kyoto,,,,,"music,performance","city_listing,club_nights,livehouse",3,"Tourism-board page, but it mirrors Club Metro and UrBANGUILD nights with dates",3,https://ja.kyoto.travel/times/night/event/,,,,ja,,html_calendar,yes,,active,2026-10-12,https://ja.kyoto.travel/times/night/event/,2026-10-19,Useful only as a cross-check of Metro/UrBANGUILD dates.
kyo-kyotographie,,KYOTOGRAPHIE / KYOTOPHONIE / KG+,,festival,kyoto,,,,,"photography,music,visual_art","photo_festival,spring,kg_plus_fringe",3,Large international photo festival; KG+ satellite programme is where emerging artists show in small spaces,2,,,,,ja+en,festival passport,manual,yes,,active,2026-04-18,https://ja.kyoto.travel/search-area01.php?area_id=2,2026-10-19,Spring (kick-off party 18 Apr 2026 at Club Metro). Not in window; festival calendar only. Verified via listing snippet only.
kyo-shunjuza,,Kyoto Art Theater Shunjuza,京都芸術劇場 春秋座,theatre_small,kyoto,Kitashirakawa (Kyoto University of the Arts),,,,"theatre,dance","university_theatre,kex_venue",3,University theatre; relevant as a KEX venue,3,,,,,ja+en,,manual,yes,,active,2026-10-25,https://kyoto-ex.jp/en/about/festival-overview/,2026-10-19,Only verified as a 2026 KEX venue.
tyo-ftarri,SRC070,Ftarri,Ftarri（水道橋）,venue_music,tokyo,Suidobashi / Hongo,"Okano Bldg B1F, 1-4-11 Hongo, Bunkyo-ku, Tokyo 113-0033",,,"music,sound","improv,experimental,electroacoustic,record_shop,20_seats",5,Label-run 20-seat basement shop/venue; nightly improvised and experimental concerts with visiting European players,1,https://www.ftarri.com/,https://www.ftarri.com/suidobashi/index-e.html,,,ja+en,email reservation (info@ftarri.com); walk-in +1000 yen if space,html_calendar,yes,"English schedule; reserve by email with name, date, number; cash only; BYO drinks allowed; no smoking",active,2026-10-17,https://www.ftarri.com/suidobashi/index-e.html,2026-10-19,"Concerts 20:00 (doors 19:30), 2000-4000 yen. With 20 seats you will talk to the musicians. Best Tokyo entry point for experimental music."
tyo-forestlimit,SRC259,FORESTLIMIT,幡ヶ谷フォレストリミット,club,tokyo,Hatagaya,,,,"music,visual_art","experimental_electronic,ambient,noise,collectives,all_night,exhibitions",5,"Independently run basement where collectives (Massacre series, nannou, experienc(e), Sustain) throw live/DJ nights; also hosts small exhibitions",1,https://www.forestlimit.com,https://www.forestlimit.com,https://www.instagram.com/forestlimit_info/,https://x.com/FORESTLIMIT,ja,"door (+1 drink), some adv via DM/form",html_calendar,yes,Lineups in roman letters; 2000-3500 yen + drink; many nights run 22:00-05:00,active,2026-10-18,https://www.forestlimit.com,2026-10-19,Ambient/experimental artists like yolabmi and Sofheso play here. Weeknight shows start ~18:30-19:00; weekend parties are all-nighters. Check event page for each lineup.
tyo-sessionhouse,SRC075,Kagurazaka Session House,神楽坂セッションハウス,dance_studio,tokyo,Kagurazaka,"158 Yarai-cho, Shinjuku-ku, Tokyo 162-0805",,,dance,"contemporary,open_class,gaga,somatic,showcase,small_theatre",4,"Independent dance house since 1991: weekday open classes (ballet, contemporary, somatic), weekend studio-theatre showcases (Dance Theater 21 Fes, D-Zone), Gaga workshops",1,https://session-house.net/,https://session-house.net/live_news.html,,"https://en.session-house.net/,https://session-house.net/classes.html,https://session-house.net/workshop.html",ja+en,"reserve.html form, teket, livepocket, zaiko stream",html_calendar,yes,English site; classes booked via Airreserve calendar or phone; drop-in classes exist,active,2026-10-25,https://session-house.net/live_news.html,2026-10-19,The place to take class in Tokyo and to see 10-minute pieces by local dancers (21 Fes). Also runs open calls (21 Fes slots open 4 Nov; Dzone 2027 deadline 31 Oct).
tyo-autumnmeteorite,,Tokyo Festival / Autumn Meteorite 2026 Tokyo,東京舞台芸術祭 舞台芸術祭「秋の隕石2026東京」,festival,tokyo,Ikebukuro (Tokyo Metropolitan Theatre),,,,"theatre,dance,performance","international,experimental,okada_toshiki,object_theatre",3,"Public festival directed by Toshiki Okada with a sharp international programme (Beugré, Ahe Engineering Theatre); institutional venue",1,https://autumnmeteorite.jp/,https://www.geigeki.jp/performance/theater415/,https://www.instagram.com/geigeki_info/,,ja+en,"Tokyo Metropolitan Theatre box office, pia, eplus",html_calendar,yes,Japanese/English surtitles on most shows; U29 3000 yen tickets,active,2026-11-03,https://www.geigeki.jp/performance/theater415/,2026-10-19,"9 Oct-3 Nov 2026. 'Next: look, talk' residency (22 Oct-2 Nov) brings young international makers to town - good people to meet at post-show talks."
tyo-geigeki,,Tokyo Metropolitan Theatre,東京芸術劇場,art_centre,tokyo,Ikebukuro,"1-8-1 Nishi-Ikebukuro, Toshima-ku, Tokyo",,,"theatre,dance,music","institution,festival_venue",3,Public theatre; only relevant while it hosts Autumn Meteorite under Okada,2,https://www.geigeki.jp/,https://www.geigeki.jp/calendar/,,,ja+en,box office online,html_calendar,yes,English site and box office,active,2026-11-03,https://www.geigeki.jp/performance/theater415/,2026-10-19,Venue row for festival events only.
tyo-ongoing,SRC260,Art Center Ongoing,アートセンター・オンゴーイング,artist_run_space,tokyo,Kichijoji,"1-8-7 Kichijoji Higashi-cho, Musashino-shi, Tokyo 180-0002",,,"visual_art,performance,sound","artist_run,bar,residency,talks",5,Artist-run gallery with a cafe/bar and artist library; residency; talks and live events; the Kichijoji art crowd's living room,1,https://www.ongoing.jp/,https://www.ongoing.jp/exhibition/,https://www.instagram.com/artcenter_ongoing/,https://www.ongoing.jp/en/,ja+en,door,html_calendar,yes,"English page; open Wed-Thu 18-21, Fri-Sun 12-21",active,2026-11-01,https://www.ongoing.jp,2026-10-19,"Go on a Friday evening, sit at the bar. Exhibition 'Figure Children' by Yoshinori Kawamoto runs 21 Oct-1 Nov."
tyo-buoy,,BUoY Arts Center Tokyo,北千住BUoY,art_centre,tokyo,Kita-Senju,"49-11 Senju Naka-cho, Adachi-ku, Tokyo 120-0036",,,"performance,dance,visual_art,music,theatre","artist_run,former_bathhouse,performance_art,nafas_festival,cafe",5,"Artist-run centre in a derelict bowling alley/bathhouse; hosts performance collectives (RAW PARTY), dance, experimental music and its own NAFAS festival",1,https://buoy.or.jp/,https://buoy.or.jp/#event,https://www.instagram.com/buoy_tokyo/,https://twitter.com/buoy_tokyo,ja,per event (peatix/forms),html_calendar,yes,Japanese site; cafe on site; 6 min from Kita-Senju station,active,2026-11-08,http://buoy.or.jp/,2026-10-19,East-side anchor. RAW PARTY nights include an 'independent' open slot for anyone who wants to perform.
tyo-rawparty,,RAW PARTY (牢),『牢／RAW PARTY』,collective,tokyo,Kita-Senju (BUoY),,,,"performance,dance","performance_art,open_stage,collective",5,Performance-art collective night at BUoY with an 'indépendants' open section for anyone to join,2,,,https://www.instagram.com/_raw_party,,ja,door 3500 / U23 2500,instagram_only,yes,Instagram only; performers include Aokid and other dance/performance names,active,2026-10-10,https://www.tokyoartbeat.com/events/-/Raw-Party-Vol5/704-F9579/2026-10-10,2026-10-19,vol.5 was 10 Oct 2026; next date not announced. Follow the Instagram and DM to join the open section.
tyo-dommune,SRC069,SUPER DOMMUNE,スーパードミューン,media,tokyo,Shibuya (PARCO 9F),,,,"music,sound,visual_art","livestream,studio,dj,talks,electronic",4,"Ukawa Naohiro's streaming studio; nightly DJ/live/talk programmes with limited studio audiences; curatorially extreme, physically a Parco floor",2,https://www.dommune.com/,https://www.dommune.com/,,,ja,free streams; some studio-audience nights ticketed,html_calendar,yes,Talk programmes are in Japanese; DJ nights (BROADJ) need no language,active,2026-10-20,https://dommune.com,2026-10-19,Moved to Shibuya PARCO 9F. Use it as a scanner of who is in town (touring DJs stream here before club dates) rather than as a venue.
tyo-20000v,SRC071,Higashi-Koenji Nijuuman Denatsu (20000V),東高円寺二万電圧,live_house,tokyo,Higashi-Koenji,"L-GRAZIA Higashi-Koenji B1, 1-7-23 Koenji-Minami, Suginami-ku, Tokyo",,,music,"livehouse,hardcore,noise,visual_kei_mix",3,Small DIY live house (16 years in Oct 2026) but recent bookings skew to visual-kei/idol nights; check each lineup,3,,,,https://eplus.jp/sf/venue/1660310,ja,"eplus, door",manual,yes,Japanese-only listings,active,2026-10-10,https://eplus.jp/sf/venue/1660310,2026-10-19,Keep in DB but demoted: programme in 2026 is mostly not experimental. Official site not opened in this pass.
tyo-nishiogi-ci,,Nishiogikubo Contact Improvisation WS & Jam,コンタクトインプロビゼーションWs＆Jam 西荻窪,collective,tokyo,Nishi-Ogikubo,"Izumida Ballet Studio, 4-2-1 Kamiogi, Suginami-ku, Tokyo",,,dance,"contact_improv,jam,open_class,english_info",5,Volunteer-run CI class + jam twice a month; 500-1500 yen; no booking; explicit English welcome,1,https://contactimprov-nn.com/workshop-list/nishiogi/,,,,ja+en,cash at door,manual,yes,English description on page; first-timers free on 1st Saturdays; contact nishiogici@gmail.com (public) or Facebook,,,https://contactimprov-nn.com/workshop-list/nishiogi/,2026-10-19,"1st Sat: 14:00 class, 15:30-18:00 jam; 3rd Sat: 14:00-18:00. Page is undated - confirm on Facebook before going (status left blank)."
tyo-dairakudakan,,Dairakudakan / Kochuten,大駱駝艦・壺中天,collective,tokyo,Kichijoji (studio) / Za-Koenji (shows),,,,dance,"butoh,company,temputenshiki",5,Maro Akaji's butoh company (since 1972); Kochuten studio series lets company members direct small-scale works,1,,,,,ja,company / theatre box office,manual,yes,Non-verbal; company site not opened in this pass,active,2026-07-05,https://natalie.mu/stage/news/671537,2026-10-19,No Tokyo dates found inside the window (their 2026 Kobe butoh season was at Dance Box). Ask about Kochuten studio workshops.
tyo-miminoimi,,MIMINOIMI Ambient Week,MIMINOIMI - Ambient / Week,collective,tokyo,,,,,"music,sound","ambient,drone,deep_listening,festival_week,talks",5,"Organiser collective (with 'TENbient') running a yearly week of ambient/drone concerts, talks and workshops across small Tokyo rooms and DOMMUNE",1,,,,,ja,peatix / door,manual,yes,Music is non-verbal; talks in Japanese,active,2026-05-08,https://dommune.com,2026-10-19,"2026 edition was in May (Day 5 on DOMMUNE 8 May). Directly matches the client's ambient taste; nothing in the window, but the network (Ayami Suzuki, soma hayato, Ken Ikeda) plays Ftarri and Forestlimit all year."
tyo-artweektokyo,,Art Week Tokyo,,festival,tokyo,Citywide; AWT Bar in Minami-Aoyama,,,,visual_art,"gallery_week,free_bus,awt_bar,institutional",3,"Art Basel-backed gallery week; mainstream institutions, but 55 galleries open free and the AWT Bar is where the whole art scene drinks for five nights",2,https://www.artweektokyo.com/,,,,ja+en,free wristband at bus stops,manual,yes,Fully English,active,2026-11-08,https://metropolisjapan.com/events/art-week-tokyo-2026/,2026-10-19,4-8 Nov 2026 (overlaps the client's last Tokyo days). Dates verified on secondary sources only; official site not opened.
tyo-tokyoartbeat,,Tokyo Art Beat,,aggregator,tokyo,,,,,"visual_art,performance","exhibition_listing,bilingual,map",3,Bilingual listing covering museums down to artist-run spaces (BUoY events appear here),1,https://www.tokyoartbeat.com/,https://www.tokyoartbeat.com/en/events,,,ja+en,,html_calendar,yes,,active,2026-10-10,https://www.tokyoartbeat.com/events/-/Raw-Party-Vol5/704-F9579/2026-10-10,2026-10-19,Media partner of Autumn Meteorite. Filter 'performance' and 'opening reception' tags.
tyo-tokyogigguide,,Tokyo Gig Guide,,aggregator,tokyo,,,,,music,"english_listing,experimental_tag,venue_pages",4,Community-run English gig listing; Ftarri posts its whole schedule here with 'experimental/improvised' tags,1,https://www.tokyogigguide.com/,https://www.tokyogigguide.com/en/gigs,,,en,,html_calendar,yes,,active,2026-06-08,https://tokyogigguide.com/ja/gigs/event/41309,2026-10-19,"Filter categories Experimental / Avant garde / Ambient. Structured date, venue and price fields."
tyo-ra,,Resident Advisor (Tokyo / Kansai),,aggregator,tokyo,,,,,music,"club_listing,ticketing,ambient_tag",4,"Standard club listing; small collective nights at Forestlimit, Bonobo, VENT are listed here with tickets",1,https://ra.co/,,,,en,ra,ra,yes,,active,2026-07-18,https://ra.co/events/2482323,2026-10-19,Event index not opened in this pass (fetch limit). Use ra.co/events/jp/tokyo weekly.
tyo-superdeluxe,,SuperDeluxe,スーパー・デラックス,venue_music,tokyo,Nishi-Azabu / Roppongi,"B1F, 3-1-25 Nishi-Azabu, Minato-ku, Tokyo",,,"music,performance,visual_art","closed,legendary",5,Was the city's avant-garde salon; closed for building works,3,,,,,ja+en,,manual,no,,closed,2019-01-15,https://www.timeout.com/tokyo/bars-and-pubs/superdeluxe,2026-10-19,CLOSED mid-January 2019. Do not send anyone here.
tyo-3331,,3331 Arts Chiyoda,アーツ千代田3331,art_centre,tokyo,Suehirocho / Akihabara,"6-11-14 Sotokanda, Chiyoda-ku, Tokyo",,,visual_art,closed,4,Former artist-run centre in a school; closed,3,https://www.3331.jp/,,,,,,manual,no,,closed,2023-03-31,https://www.3331.jp/en/news/202302/005870.html,2026-10-19,CLOSED 31 March 2023. The AIR 3331 residency continued separately (not verified in 2026).
tyo-youkobo,SRC076,Youkobo Art Space,遊工房アートスペース,residency,tokyo,Zempukuji / Nishi-Ogikubo,,,,visual_art,"residency,family_run,studio",3,Long-running family-run AIR with studios and critique sessions; site live but no dated 2026 activity found,3,https://youkobo.co.jp/,https://youkobo.co.jp/exhibition_events/archive.html,,,ja+en,,manual,yes,English site; residency takes foreign artists,,,https://youkobo.co.jp/exhibition_events/,2026-10-19,Status left blank: site is live but no dated event was visible on the pages opened. Verify by email before relying on it.
tyo-theatercommons,,Theater Commons Tokyo,シアターコモンズ,festival,tokyo,Citywide,,,,"theatre,performance","experimental,festival,lecture_performance,site_specific",4,"Independent festival run by Arts Commons Tokyo with partner cultural institutes; experimental, lecture-format and site-based performance outside theatres",2,https://theatercommons.tokyo/en/,https://theatercommons.tokyo/en/,,,ja+en,,html_calendar,unknown,English site,active,2026-03-08,https://theatercommons.tokyo/en/about/,2026-10-19,"10th edition ran 22 Feb-8 Mar 2026 (Translating Commons). Not in the client's window; put it in the calendar for early 2027. Added for the curators link (Chiaki Soma)."
tyo-cinn,,C.I.N.N. (Contact Improvisation Nippon Network),,collective,tokyo,,,,,dance,,3,Non-profit group of Kanto dancers that runs the Tokyo Contact Improvisation Festival and lists community CI workshops and jams,,https://www.contactimprov-nn.com/,https://contactimprov-nn.com/class-info/,,,ja,,,,,active,Tokyo Contact Improvisation Festival 2026 (2-5 May 2026),https://www.contactimprov-nn.com/,2026-10-19,"Founded as SPIRAL in 2003. The 2026 festival was held in Katsuura, Chiba. Possibly related to tyo-nishiogi-ci, which cites the same website, but I did not confirm the link; the main session should check before merging."
tyo-bal,,Body Arts Laboratory (Whenever Wherever Festival),,collective,tokyo,,,,,"dance,performance",,4,Artist-run dance and performance organisation; its festival uses public and community spaces rather than theatres,,https://bodyartslabo.com/,,,,ja,,,,,active,WWFes 2026 (12th edition) held February 2026 in Minato Ward,https://www.artscouncil-tokyo.jp/en/grants/program/27829/,2026-10-19,Founded 2008; became a general incorporated association in 2021 (per Arts Council Tokyo).
tyo-the5thfloor,,The 5th Floor,,venue,tokyo,Ikenohata (Nezu),"Hanazono Alley 5F, 3-3-9 Ikenohata, Taito-ku, Tokyo",,,visual_art,"curatorial space,alternative space,curator residency",4,Independent non-commercial curatorial space in a former dormitory building; programmes guest curators and runs a curator residency,,https://the5thfloor.org/,,,,ja,,,,,active,Portal: AfroAsia 2026-10-16 to 2026-11-29,https://the5thfloor.org/,2026-10-19,"Opened Feb 2020 (Forbes Japan 2024). Director Tomoya Iwata. 2025 show listed on TAB: https://www.tokyoartbeat.com/events/-/Phenomena-and-Records-One-Record-Three-Rooms/5-C2-E814-D/2025-08-29 (building: 花園アレイ 5F, Taito-ku). The address comes from that TAB listing and wasn't cross-checked on the official site."
tyo-jazzartsengawa,,JAZZ ART SENGAWA,JAZZ ART せんがわ,festival,tokyo,Sengawa (Chofu),,,,"music,sound,performance","improvisation,free_jazz,festival,outdoor_stage",4,"Artist-produced festival of improvised and genre-free music at a municipal small theatre; run by an artists' executive committee since 2019",2,,,,,ja,,manual,yes,"Free outdoor stage (CLUB JAZZ Byobu) needs no ticket",active,2025-09-14,https://www.artscouncil-tokyo.jp/en/grants/program/27293/,2026-10-19,"Annual since 2008 at Chofu City Sengawa Theater. 2025: 11-14 Sep. A 2026 edition on 5-8 Nov appears only in search snippets; official site jazzartsengawa.com did not load. Confirm before adding events."
```

---

# APPENDIX B: project context

## 1. What Fellow. is

**Fellow.** is a small web product for **independent, cross-disciplinary artists**: contemporary
dancers, choreographers, performers, experimental musicians, sound artists, and visual artists
whose work often crosses into performance or sound.

It began as a feed of verified open calls, residencies, and grants. **As of this pilot, the focus
has shifted.** The open-calls feed (we call it the *Hub*) is paused and marked "coming soon". The
product is now built around one question:

> **"I'm in this city now. What's happening in my scene today and this week, and how do I get
> into it?"**

The product has three parts that matter for this pilot:

1. **Explore the city** (in the app it is called *Currently*): pick a city and a date range and see
   performances, concerts, exhibitions, classes, workshops, talks, parties, and meetups worth
   catching, grouped by day.
2. **Discover → Organizations**: a directory of the venues, spaces, collectives, and festivals
   that make up a city's scene. Each one has its own page: name, "Type · City, Country", an
   **About** section (your `about` text), how to get in the door, its upcoming events, and its
   links.
   **Discover → Curators**: the same kind of page for the people who programme the scene (see
   `FABLE_CURATORS_PROMPT.md`).
3. **Artist profile**: one page that shows who the artist is (practice, disciplines, current city
   and dates, links), so they can introduce themselves to the people they meet.

Live app: `cue-radar.vercel.app` (the brand is "Fellow."; the repo is still called Cue Radar).

## 2. Who it's for: the underground

The audience is **underground and alternative**, not mainstream. Think of an artist who goes to an
improv night in a 40-person room, takes a butoh workshop, ends up at an artist-run gallery opening,
and goes to a club night run by a collective afterwards. They do **not** want stadium concerts,
idol shows, musicals, tourist-format traditional performance, or blockbuster "immersive" exhibitions.

What they value:
- **Signal over volume.** Ten strong picks beat a hundred listings.
- **Doors that open.** Places where a newcomer can take part, not just watch: open classes, jams,
  workshops, open studios, and meetups.
- **Context.** Who runs a space, what its scene is, and why it matters.
- **Trust.** Everything is checked by a person. Nothing is scraped blindly, and nothing is made up.

## 3. Why this pilot, and why Kyoto and Tokyo

The product team is running an **immediate pilot with one real client, an artist who is in Kyoto
and Tokyo right now**. The pilot answers three questions:

1. **Is our content relevant?** Does a well-researched, underground-filtered "what's on" actually
   help an artist in a city they don't know well?
2. **Does it connect them?** Do they end up meeting people, joining classes, finding
   collaborators, and spotting opportunities through it?
3. **Does it inspire?** Does exposure to other disciplines and media in the city feed their own
   practice?

The pilot was previously scoped to 16 Israeli cities. **That scope is set aside.** The product is
now **Kyoto and Tokyo only**, and the research you do is the content the client will see.

Japan was chosen because the client is there. The difficulty is also the reason it is worth doing:
much of the scene is in Japanese only, spread across Instagram and small venue calendars, and hard
for an outsider to find. If the product works here, it works.

## 4. Discipline focus

Primary: **dance, music, exhibitions**. These three come first in everything.

- *Dance* includes contemporary, butoh and post-butoh, improvisation, contact improvisation,
  experimental choreography, open classes, labs, showings.
- *Music* includes experimental, improvised, noise, free jazz, electroacoustic, sound art, ambient
  and drone, and avant-garde club and electronic music.
- *Exhibitions* includes artist-run and project spaces, independent galleries, open studios, and
  cross-media shows.

Secondary: performance art, experimental theatre, festivals, masterclasses, talks, artist meetups,
curated parties, experimental film and video.

## 5. How your output is used

Your CSVs are imported into the product's **master database**, a Google Sheet that syncs to the
app's Postgres database. A person reviews every row before it goes live. Here is the mapping, so
you know why the columns are shaped the way they are:

| Your file | Database table | Notes |
|---|---|---|
| `places.csv` | `sources` | `source_id`, `name`, `source_type`, `market`, `discipline_focus`, `tier`, `website_url`, `instagram_url`, `scrape_method`, `status`, `notes` map directly. The other columns (neighbourhood, address, score, newcomer-friendliness, etc.) are new fields the team is adding for this pilot. |
| `events.csv` | `events` | `event_id`, `market`, `venue_name`, `title`, `event_type`, `disciplines`, `date`, `time`, `price_min`, `ticket_url`, `lat`, `lng` map directly. `end_date`, `description`, `lineup`, `recurrence`, score and the rest are new fields for this pilot. |
| `feeds.csv` | — | Used to build the weekly refresh process. Not shown to users. |
| `REPORT.md` | — | Read by the team and used to write the city guide copy and pick the "this week" highlights. |

Technical limits worth knowing:
- `market` must be exactly `kyoto` or `tokyo` (these are database keys).
- Dates are `YYYY-MM-DD`, times `HH:MM` 24-hour, all local Japan time.
- Multi-value cells are comma-separated in one cell.
- Descriptions are capped at **200 characters** by the database.
- Prices are numbers in JPY.

## 8. What "good" looks like

A great result lets the client open the app in Kyoto or Tokyo and see:

- tonight: an improv set in a small room, with the cover charge and whether to book ahead;
- Wednesday: an open contemporary class taught in a way a non-Japanese speaker can follow;
- Thursday: an artist-run gallery opening where they can meet people;
- the weekend: a dance showing at a festival, and a collective's club night afterwards;
- under each place: one honest line on why it matters and how to get in the door.

And it lets the product team see, in one report, **how each city's scene is wired**: who connects
to whom, where the weekly rhythm is, and which ten feeds keep it current.

## 9. Ground rules (the same as in the prompt, because they matter most)

- **Nothing invented**: no places, events, names, dates, prices, or numbers that you didn't read on
  a real page. Leave cells empty instead of guessing.
- **Evidence on every row**: an `evidence_url` you actually opened, plus `verified_at`.
- **No personal data**: organisations and public line-ups only, with official contact routes.
- **Your own words**: no pasted press text.
- **Underground filter**: score 3 or higher only, with closed places kept and marked `closed`.
