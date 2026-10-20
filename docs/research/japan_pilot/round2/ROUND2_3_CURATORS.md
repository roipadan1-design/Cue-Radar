# Fellow. research, round 2. Chat 3 of 3: CURATORS AND PROGRAMMERS (the people)

> **This is the only file this research chat needs.** Everything is inside: the goal, the rules,
> the output format, the project context, and the data already collected in round 1 (appendices at
> the end). Read it top to bottom, then start. **Today is Tuesday 20 October 2026.**
> Deliver in **batches of at least 10 verified rows** instead of one big drop, and say what is
> still missing at the end of each batch.
>
> **Hand back:** `curators_new.csv` (new people, same columns as section 4), `curators_backfill.csv` (the existing people with contact routes filled in, same `curator_id`s, nothing else changed), `places_new.csv` (only for organisations missing from Appendix A), `VERIFICATION_LOG.md`.

---


> In the brief below, "the scoring rubric in FABLE_PROMPT.md §2.3" is included in this file as
> **Appendix B**. "`places.csv`" is **Appendix A**, and the people already collected are **Appendix C**.
> Disregard any deadline that says "tomorrow".

# Research mission: the curators and programmers of Kyoto and Tokyo's scene



## ROUND 2 (written Tuesday 20 October 2026): read this first, it overrides anything below that conflicts

Round 1 is delivered and live: **25 curators (Kyoto 9, Tokyo 16)**. Attached: round 1's
`curators.csv` and `places.csv`. The "tomorrow" deadline below is finished. Deliver in batches of
at least 10 verified rows. Round 2 fixes two gaps:

1. **Contact routes are missing: 0 of the 25 round-1 people have a `website_url` or `instagram_url`.**
   From now on **every person must have at least one public way to reach them**: their own
   website, their own professional Instagram, **or their organisation's official contact page or
   form** (put that page in `website_url` and write `contact = organisation page` in `notes`).
   No emails, phone numbers or private accounts, as before. If you find no route at all, still
   return the row, write `NO CONTACT ROUTE` in `notes`, and list the person in `VERIFICATION_LOG.md`;
   the team decides.
2. **Backfill round 1.** Return `curators_backfill.csv` with the same `curator_id`s and the contact
   fields filled in for the existing 25 people. Change nothing else in those rows.
3. **Broaden the disciplines.** Round 1 mix: dance 14, performance 14, music 9, theatre 6, visual
   art 5, sound 4, film 1. Add people from exhibitions and artist-run galleries (`visual_art`,
   `photography`, `film`), music club bookers and DIY promoters, sound, noise and ambient series,
   and residency directors. At least **40% of the new rows** should be from those groups.
4. **Full target:** 40 Tokyo + 20 Kyoto in total, so add about **24 Tokyo and 11 Kyoto**.
5. **Scope is Kyoto and Tokyo only.** No Osaka, Kobe or Nara.

---

## 0. What this is for

Fellow. has a **Curators** directory. Each person gets a page that looks like a professional
profile: name, "Role · City, Country", an **About** section, the organisations they work with,
and public contact links. For the Kyoto/Tokyo pilot, a visiting artist uses it to find out **who
programmes the scene**: who books the improv nights, who curates the artist-run gallery, who runs
the dance festival, and which collective's organiser to say hello to after a show.

**Deadline:** a first batch is needed by **Tuesday 20 October 2026**. Deliver
**15 Tokyo + 8 Kyoto** people first, then continue to the full target.

**Target (full):** **40 Tokyo + 20 Kyoto** people across dance, music and exhibitions.

## 1. Who counts

People who **shape what gets shown** in the underground and alternative scene (see the scoring
rubric in Appendix B; only scenes scoring 3 or higher):

- curators and directors of artist-run spaces, project spaces, independent galleries
- programmers and bookers of experimental music venues and series
- artistic directors and programmers of dance houses, small theatres, and festivals
- organisers of collectives, recurring parties, improv series, and dance labs
- residency directors, and curators of experimental programmes at institutions
  (role score 3: include, and say so)

Not in scope: commercial gallery sales staff, mainstream promoters, critics who don't programme
anything, artists with no programming role. Artists come later, in a separate directory.

## 2. Privacy and accuracy rules (stricter than the places brief)

These are real people. Follow these rules exactly:

1. **Public professional role only.** Include a person only if a public, official page (their
   organisation's site, a festival credits page, an official programme, a published interview
   or profile in arts media) names them in that role. `evidence_url` must point to that page.
2. **No private data.** No personal phone numbers, personal emails, home addresses, family,
   age, or anything outside their professional work. Contact links are limited to **their own
   public website** and **their own public professional Instagram**, if they have one, or the
   organisation's official contact page.
3. **No photos.** Don't collect or link portrait images. The product shows initials only.
4. **Nothing invented or inferred.** Don't guess a role from a single mention, and don't merge two
   people with similar names. If a role might be out of date (they may have left), check for a
   2025–2026 mention. If you can't find one, leave the person out, or mark `status = inactive`
   with a note in the log.
5. **Your own words.** `about` is a summary you write. Never paste a bio.
6. **Names as they publish them.** Use the romanised name the person or their organisation uses
   in English, and put the Japanese name in `name_ja`.

## 3. How to search

- Start from the places in `places.csv` (or the project context in Appendix D). For each one,
  open the About, staff, or ディレクター / キュレーター / 主宰 / プログラムディレクター pages and the
  credits of recent programmes.
- Festival and programme credits: `キュレーター`, `ディレクター`, `プログラマー`, `主宰`, `企画`,
  `芸術監督`, `ディレクション`, `企画・制作`.
- Arts media interviews (English and Japanese) are good evidence for role and background.
- Follow the network: the people who co-curate, or appear in each other's programmes, lead to
  the next person.

## 4. Deliverable: `curators.csv`

UTF-8 CSV, header exactly:

```
curator_id,name,name_ja,role_label,market,about,disciplines,affiliations,website_url,instagram_url,evidence_url,verified_at,status,underground_score,notes
```

| Column | Rule |
|---|---|
| `curator_id` | `tyo-cur-` / `kyo-cur-` + lowercase slug of the name, e.g. `tyo-cur-yamada-taro`. Unique. |
| `name` | Romanised name as they use it publicly |
| `name_ja` | Japanese name, if published |
| `role_label` | Short and specific, shown on the page: `Curator`, `Programmer`, `Artistic director`, `Festival director`, `Organiser`, `Residency director`, `Booker` |
| `market` | `kyoto` or `tokyo`: the city they mainly work in |
| `about` | **Shown as the "About" section.** 2–3 short paragraphs, 300–900 characters, English, your own words: current role(s), the kind of work they programme, notable recent programmes or series (with years), and what that means for a visiting artist. Professional facts only. Separate paragraphs with a blank line inside the quoted cell. |
| `disciplines` | Comma-separated, from: `dance`, `music`, `sound`, `performance`, `painting`, `sculpture`, `visual_art`, `photography`, `film`, `theatre` |
| `affiliations` | Comma-separated `source_id`s from `places.csv` (e.g. `tyo-forestlimit`) of organisations they currently work with. If the organisation is not in `places.csv`, add it there (it needs a row for the link to work). |
| `website_url` / `instagram_url` | Their **own** public professional pages only. Empty if none. |
| `evidence_url` | The official page that names them in this role |
| `verified_at` | YYYY-MM-DD |
| `status` | `active`, or `inactive` if you couldn't confirm the role for 2025–2026 |
| `underground_score` | 3–5, the score of the scene they programme |
| `notes` | Internal only, not shown: anything the team should know (e.g. "also runs a small label", "role confirmed only in Japanese press") |

Also append to `VERIFICATION_LOG.md`: how many people you checked, who you dropped and why (role
unconfirmed, outside scope, privacy concern), and every `inactive` row.

## 5. Self-check before handing back

- [ ] Every person has an `evidence_url` naming them in that role, from 2025 or 2026.
- [ ] No private contact details and no photos anywhere.
- [ ] Every `affiliations` id exists in `places.csv`.
- [ ] Every `about` is your own words and 900 characters or fewer.
- [ ] There's a balance across dance, music, and exhibitions in both cities.


---

# APPENDIX A: places (`places.csv`, 44 rows, the organisations people can be linked to)

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

# APPENDIX B: the scoring rubric and discipline focus

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

# APPENDIX C: people already collected in round 1 (`curators.csv`, 26 rows)

```csv
curator_id,name,name_ja,role_label,market,about,disciplines,affiliations,website_url,instagram_url,evidence_url,verified_at,status,underground_score,notes
kyo-cur-kawasaki-yoko,Yoko Kawasaki,川崎陽子,Artistic director,kyoto,"Yoko Kawasaki is co-artistic director of Kyoto Experiment, the Kyoto International Performing Arts Festival, a post shared with Yuya Tsukahara since the 2025 edition. The two directors shape the programme and write the festival's yearly directors' text.

The 2026 edition, the 17th, ran 3 to 25 October under the phrase 'Carrying a pebble in my pocket', with a Shows programme built around memories and stories passed on through the body, alongside the festival's other two programme strands.

For a visiting artist, Kyoto Experiment is the main yearly meeting point of the Kansai and international performing-arts world. Post-show talks are the natural place to say hello; the festival office is reachable through its official contact page.","dance,theatre,performance",kyo-kyotoexperiment,,,https://kyoto-ex.jp/en/news/2026-opening/,2026-10-19,active,4,"Signed the 2026 opening message (3 Oct 2026). Co-director structure since 2025 after the 2020-24 three-person team ended. The festival's organisation page is 404 at the moment."
kyo-cur-tsukahara-yuya,Yuya Tsukahara,塚原悠也,Artistic director,kyoto,"Yuya Tsukahara is co-artistic director of Kyoto Experiment, sharing the post with Yoko Kawasaki since the 2025 edition. Together they choose the works and set the festival's annual theme.

In 2026 the festival's 17th edition (3 to 25 October) took the idea of small pebbles carried in a pocket as its guide: works about memory, letters, migration and poetry conveyed through performance, presented across Kyoto's theatres and other sites.

For a visiting artist, the festival's closing week and its post-show events are the best chance to meet the people who programme contemporary performance in Kyoto. Contact goes through the festival's official contact page, not personal channels.","performance,dance,theatre",kyo-kyotoexperiment,,,https://kyoto-ex.jp/en/news/2026-opening/,2026-10-19,active,4,"Signed the 2026 opening message with Kawasaki. Also known as a member of the performance group contact Gonzo, but that was not checked in this pass, so it is left out of 'about'."
kyo-cur-katsura-kan,Kan Katsura,桂勘,Festival director,kyoto,"Kan Katsura is a butoh dancer who organises the Kyoto International Butoh Festival. The festival credits him as organiser together with its executive committee. The 4th edition runs 7 to 15 November 2026, with evening performances by Japanese and international butoh artists, a daily workshop series, and paid live streaming.

Katsura also performs in the festival (13 November) and teaches one of its workshops (8 November). A pre-festival evening presented by Katsura takes place at UrBANGUILD on 26 October 2026.

For a visiting artist, the workshops and the UrBANGUILD pre-event are the most direct way in. The festival lists a public contact address on its site.","dance,performance,music","kyo-butohfes,kyo-urbanguild,kyo-spacelfan",,,https://kyoto-butohfes.com/kbf-2026/,2026-10-19,active,5,"Credit on the 2026 page: 主催：桂勘＆京都国際舞踏祭実行委員会; co-organiser Arts PLAN DU. Romanised name as printed by the festival: 'Kan Katsura'. Pre-event confirmed on urbanguild.net/events."
kyo-cur-okuyama-riko,Riko Okuyama,奥山理子,Organiser,kyoto,"Riko Okuyama is representative director of HAPS (Higashiyama Artists Placement Service), the Kyoto organisation that helps young artists live, make work and show in the city. HAPS calls itself a general consultation point for artists and for the people who support art.

Beyond help with studios and housing, HAPS has run its 'Art and Inclusive Society' programme since 2017 and, since 2022, a commission from the Agency for Cultural Affairs to support arts activity by people with disabilities. It runs the HAPS office, HAPS HOUSE in Higashi-Kujo and the HAPS studio.

For a visiting artist, HAPS is the best first contact in Kyoto for practical questions and introductions to local people. Use the organisation's contact page.","visual_art,performance",kyo-haps,,,https://haps-kyoto.com/about/,2026-10-19,active,4,"Listed as 代表理事 of 一般社団法人HAPS; the same page lists the FY2025 balance sheet, so the listing is current. 'Art and Inclusive Society' is our translation of アートと共生社会."
kyo-cur-fujita-mizuho,Mizuho Fujita,藤田瑞穂,Curator,kyoto,"Mizuho Fujita is chief curator and programme director of @KCUA, the gallery of Kyoto City University of Arts. The gallery opened in 2010 as an off-campus space and moved onto the university's new campus east of Kyoto Station in October 2023.

@KCUA shows special exhibitions planned by its curatorial staff, open-call shows by faculty, students and alumni, and workshops and lectures with visiting artists. The gallery describes Fujita's work as cross-disciplinary exhibitions and projects made with specialists from other fields, recently around biodiversity and more-than-human perspectives.

For a visiting artist, openings and talks at @KCUA are where Kyoto's art-school scene gathers.","visual_art",kyo-kcua,,,https://gallery.kcua.ac.jp/about/,2026-10-19,active,3,"Institutional (university gallery): score 3, included as instructed. Staff page is on the live 2026 site (archive runs 2010-2026). NII researcher database also lists Fujita at KCUA for 2026 (search snippet only, not opened)."
kyo-cur-ogura-emi,Emi Ogura,小倉笑,Programmer,kyoto,"Emi Ogura is a Kyoto-based dancer, choreographer and director, and co-programme director of the Kyoto International Dance Workshop Festival ('Kyoto no Atsui Natsu'), which Kyoto Art Center co-organises. Ogura has worked in Kyoto since 2014 and founded the creative group SMILE in 2021.

At the festival's 2026 early-summer edition (2 to 6 May) Ogura led 'Dance in English', a session that prepares participants for classes given by visiting teachers in English. Ogura also performs on Kyoto's small stages, including FOuR DANCERS at UrBANGUILD on 27 October 2026.

For a visiting artist, the festival (main edition each August) is the easiest structured way into Kyoto's dance community.","dance,performance","kyo-kidwf,kyo-kac,kyo-urbanguild",,,https://www.kac.or.jp/events/20260330/,2026-10-19,active,4,"KAC event page bio: 当フェスティバルの共同プログラム・ディレクター. Festival co-organised by KAC and 一般社団法人ダンスアンドエンヴァイロメント."
kyo-cur-tani-ryuichi,Ryuichi Tani,谷竜一,Programmer,kyoto,"Ryuichi Tani is a programme director at Kyoto Art Center (KAC), the city-run arts centre in a former primary school in central Kyoto. On the centre's site Tani speaks for its studio programme: former classrooms lent as creation studios after a selection process, meant for young artists and new projects.

KAC also runs open calls, an artist-in-residence programme and free workshops, and co-organises Kyoto Experiment and the Kyoto International Dance Workshop Festival. Tani's programming work centres on theatre and dance.

For a visiting artist who needs rehearsal or studio space in Kyoto, the KAC studio programme is the door, and the centre invites informal questions before an application.","theatre,dance","kyo-kac",,,https://www.kac.or.jp/about/,2026-10-19,active,3,"Named as プログラムディレクター on the live KAC 'about' page (checked 2026-10-19), but that page carries no date. The theatre/dance focus comes from an artscape author bio (in post since 2021, last updated 2021). A separately dated 2025-26 mention would make this stronger."
kyo-cur-iida-jinichiro,Jinichiro Iida,飯田仁一郎,Organiser,kyoto,"Jinichiro Iida co-leads Boro Festa, Kyoto's self-produced autumn music festival, now in its 25th year. In a 2026 interview, co-organiser Mogura names Iida, of the band Limited Express (has gone?), and himself as the current core of organisation and production.

Boro Festa is booked and built in-house from booking to set-up, with student volunteers and the audience pitching in. The 2026 edition runs 31 October to 3 November at KBS Hall and Club Metro, with two all-night sessions.

For a visiting artist, the Club Metro night sessions are where the festival's more experimental side shows up.","music","kyo-borofesta,kyo-clubmetro",,,https://l-tike.com/borofesta/,2026-10-19,active,4,"Evidence is a published interview on the Lawson Ticket festival page (2026), not the festival's own site; borofesta.com did not load. Hall programme is mostly indie rock; Metro nights are the 4-score part."
kyo-cur-mogura,Mogura,土龍,Organiser,kyoto,"Mogura is one of Boro Festa's founding staff and, with Jinichiro Iida, the current core of its organisation and production. Day to day Mogura manages Live House nano in Kyoto.

Mogura describes a clear pipeline: young bands play nano, then the August pre-event Nano Boro, then Boro Festa itself. The 2026 festival, its 25th, runs 31 October to 3 November at KBS Hall and Club Metro, with staff and volunteers sharing the organising work.

For a visiting artist, Live House nano and the Nano Boro pre-event are the grassroots end of Kyoto's independent music circuit, and the place to ask about the scene.","music",kyo-borofesta,,,https://l-tike.com/borofesta/,2026-10-19,active,4,"Uses the name 土龍 (Mogura) publicly. Live House nano is not in places.csv yet (not verified separately), so it is not linked as an affiliation."
tyo-cur-okada-toshiki,Toshiki Okada,岡田利規,Artistic director,tokyo,"Toshiki Okada, a playwright, novelist and director, is artistic director of the performing-arts festival Autumn Meteorite 2026 Tokyo. From fiscal 2026 Okada is also artistic director of the performing-arts division of Tokyo Metropolitan Theatre.

The 2026 edition (9 October to 3 November, centred on the theatre in Ikebukuro) is the second under Okada's direction and part of Tokyo Festival 2026. It has 13 Japanese and international productions plus lectures, workshops and networking programmes. Its stated aims are new creation, international reach and training the next generation.

For a visiting artist, the festival's exchange programmes and post-show events are the realistic point of contact.","theatre,performance,dance","tyo-autumnmeteorite,tyo-geigeki",,,https://autumnmeteorite.jp/ja,2026-10-19,active,3,"Institutional festival with an experimental programme: score 3."
tyo-cur-kishimoto-kako,Kako Kishimoto,岸本佳子,Artistic director,tokyo,"Kako Kishimoto is artistic director of BUoY, the arts centre in Kita-Senju set in a building whose upper floor was once a bowling alley and whose basement was a public bath, renovated by BUoY's own members.

In BUoY's statement Kishimoto frames it as a place for young, sharp, intentional art that questions what is taken for granted. The programme mixes dance, performance, music and exhibitions in the basement and the upstairs galleries and café. In October 2026 it hosted the RAW PARTY performance night and the dance piece IGNIS.

For a visiting artist, BUoY's open-format nights are the way to show work here. RAW PARTY includes an open independent slot.","performance,dance,theatre,visual_art,music","tyo-buoy,tyo-rawparty",,,https://buoy.or.jp/about/,2026-10-19,active,5,"English name as BUoY prints it: 'Kako Kishimoto'. The about page carries no date. The 2026 programme on the same site is live, but no separately dated 2025-26 article naming Kishimoto was opened."
tyo-cur-itoh-naoko,Naoko Itoh,伊藤直子,Artistic director,tokyo,"Naoko Itoh founded Kagurazaka Session House in 1991 as a small theatre for dance. Itoh runs it as company representative and supervises the planning of its dance programme, and also leads the company Mademoiselle Cinema, formed in 1993.

Session House runs open dance classes and more than 40 performance and workshop projects a year, with platforms for young choreographers, international exchange, and calls for solo shows (Dzone 2027 applications opened in 2026). Mademoiselle Cinema presents 'Okuni Monogatari' there on 19 and 20 December 2026.

For a visiting artist, drop-in classes and the short-piece platforms are the most direct way into Tokyo's contemporary dance community.","dance",tyo-sessionhouse,,,https://session-house.net/about_sessionhouse.html,2026-10-19,active,4,"The home page shows the Dec 2026 show with a quote from Itoh (2026 evidence). Romanised as 'Naoko Itoh' after an older English event page; Session House's own English spelling was not checked."
tyo-cur-ogawa-nozomu,Nozomu Ogawa,小川希,Artistic director,tokyo,"Nozomu Ogawa founded and directs Art Center Ongoing in Kichijoji (2008). In June 2025 Ogawa also opened Art Center NEW, underground at Shin-Takashima Station in Yokohama. Ongoing combines exhibition space, a bar and a residency, and mostly shows emerging artists.

In Tokyo Art Beat's review of 2025 Ogawa described working outside the art mainstream and championed small non-commercial spaces, including Alternative Art Week, run by the Reigai network of independent art spaces.

For a visiting artist, Ongoing's openings and its bar are a standard meeting point for Tokyo's independent art scene.","visual_art,performance,music",tyo-ongoing,,,https://www.tokyoartbeat.com/articles/-/best-exhibitions-of-2025-nozomu-ogawa-202512,2026-10-19,active,5,"TAB (29 Dec 2025) title: Art Center Ongoing／Art Center NEW代表. Search snippets say Ogawa co-curated a 2026 show at Richmond Art Gallery (Canada); not opened, so left out."
tyo-cur-soma-chiaki,Chiaki Soma,相馬千秋,Festival director,tokyo,"Chiaki Soma is director of Theater Commons Tokyo and chairs its executive committee as representative director of Arts Commons Tokyo. The festival applies theatrical ideas to everyday life and the city, and presents performances and learning programmes at sites around Tokyo with partner cultural institutes such as the Goethe-Institut Tokyo and the Institut français du Japon.

Its 10th edition, 'Translating Commons', ran 22 February to 8 March 2026.

For a visiting artist, Theater Commons is a key node for experimental, lecture-format and site-based performance in Tokyo, and a festival to put in the calendar for early 2027.","theatre,performance",tyo-theatercommons,,,https://theatercommons.tokyo/en/about/,2026-10-19,active,4,"Added tyo-theatercommons to places.csv for this link. Also runs 'Commons Camp' for next-generation curators (search snippet, not opened)."
tyo-cur-takahashi-hiroko,Hiroko Takahashi,髙橋弘子,Organiser,tokyo,"Hiroko Takahashi is the representative of C.I.N.N. (Contact Improvisation Nippon Network), a non-profit group of Kanto-area dancers that promotes contact improvisation. Takahashi has led the group since it was founded as SPIRAL in 2003 and is in charge of planning, production and running its activities.

C.I.N.N. organises the Tokyo Contact Improvisation Festival. The 2026 edition ran 2 to 5 May 2026 at a training centre in Katsuura, Chiba. The group's site also lists CI workshops and jams around Tokyo.

For a visiting artist, Takahashi is the main contact for Tokyo's contact improvisation community and its yearly festival, which invites teachers from abroad.",dance,tyo-cinn,,,https://contactimprov-nn.com/about/staff/,2026-10-19,active,3,"Staff page (© 2026) gives the romanised name and the role 団体代表者. The 2026 festival is on the C.I.N.N. homepage (seen by the dance agent; re-checked staff page in browser). The festival is called 'Tokyo' but the 2026 edition was in Katsuura, Chiba. Nishiogikubo jam (tyo-nishiogi-ci) is listed on the C.I.N.N. site, but it is not confirmed that C.I.N.N. runs it, so it is not linked."
tyo-cur-fukumoto-maaya,Maaya Fukumoto,福本まあや,Organiser,tokyo,"Maaya Fukumoto has been on the staff of C.I.N.N. (Contact Improvisation Nippon Network) since it began as SPIRAL in 2003. Fukumoto mainly handles negotiations with the teachers invited from abroad for its events, including the Tokyo Contact Improvisation Festival.

Fukumoto is also a dancer and choreographer and a researcher of contact improvisation's history. In 2009 Fukumoto served as vice-chair of the committee that brought CI founders Steve Paxton and Lisa Nelson to Japan. C.I.N.N.'s 2026 festival ran 2 to 5 May 2026.

For a visiting CI teacher or dancer, Fukumoto is the person behind the festival's international invitations.",dance,tyo-cinn,,,https://contactimprov-nn.com/about/staff/,2026-10-19,active,3,"Role from the C.I.N.N. staff page (© 2026): 主に海外講師との交渉を担当. The page itself is undated; 2026 activity comes from the 2026 festival. A CI Roundtable (Apr 2025) reported by the dance agent was not re-checked."
tyo-cur-yamazaki-kota,Kota Yamazaki,山崎広太,Festival director,tokyo,"Kota Yamazaki is programme director of Body Arts Laboratory (BAL), an artist-run organisation for dance and performance founded in 2008. Through BAL Yamazaki runs the Whenever Wherever Festival (WWFes), an experimental dance and performance festival programmed by a collective of dancers and choreographers.

WWFes 2026, the 12th edition (28 January to 8 February 2026), was themed on alter-narrative and 'living space(s)' and used public and community sites in Minato ward. Yamazaki co-curated it and premiered a new dance work at the former Noguchi Room on the Keio University Mita campus.

For a visiting artist, WWFes is one of Tokyo's few artist-run festivals of experimental dance in non-theatre spaces.","dance,performance",tyo-bal,,,https://bodyartslabo.com/wwfes2026/festival,2026-10-19,active,4,"Romanised name confirmed on https://bodyartslabo.com/en/ (Program Director: Kota Yamazaki, © 2026). WWFes 2026 page credits キュレーター：Aokid、五月めい、西村未奈、山﨑広太. Note the spelling 山﨑 (festival page) vs 山崎 (about page)."
tyo-cur-aokid,Aokid,,Curator,tokyo,"Aokid is a Tokyo-based dancer and artist and one of the curators of Body Arts Laboratory, the artist-run organisation behind the Whenever Wherever Festival. Aokid is credited as a curator of WWFes 2026 (28 January to 8 February 2026), the festival's 12th edition, held at public and community sites in Minato ward, including SHIBAURA HOUSE.

Aokid also performs on Tokyo's open-format circuit, for example at RAW PARTY vol.5 at BUoY on 10 October 2026.

For a visiting artist, Aokid is a natural contact where experimental dance meets Tokyo's DIY performance scene.","dance,performance","tyo-bal,tyo-rawparty",,,https://bodyartslabo.com/wwfes2026/festival,2026-10-19,active,4,"Uses the single name Aokid publicly (BAL English page). name_ja left empty. RAW PARTY credit: buoy.or.jp/program/rawparty (performer, not organiser)."
tyo-cur-nishimura-mina,Mina Nishimura,西村未奈,Curator,tokyo,"Mina Nishimura is a curator at Body Arts Laboratory and one of the four curators credited for Whenever Wherever Festival 2026, alongside Kota Yamazaki and Aokid. Nishimura wrote the festival's published note on 'living space(s)'. That was the format of its closing two-day event at SHIBAURA HOUSE (7 to 8 February 2026), where several happenings shared one space at once and the line between audience and performers was left open.

For a visiting artist interested in process-based performance outside theatres, Nishimura is a good person to approach through Body Arts Laboratory's contact page.","dance,performance",tyo-bal,,,https://bodyartslabo.com/wwfes2026/festival,2026-10-19,active,4,"Romanised name from https://bodyartslabo.com/en/ curator list. Credited キュレーター on the WWFes 2026 page."
tyo-cur-iwanaka-kanako,Kanako Iwanaka,岩中可南子,Programmer,tokyo,"Kanako Iwanaka is listed as a curator of Body Arts Laboratory and ran production for Whenever Wherever Festival 2026, held 28 January to 8 February 2026 at sites in Minato ward. BAL describes the festival as run by a collective of dancers and choreographers. Its programme is laboratories, workshops, performances and round tables proposed by artists.

For a visiting artist, the production side of BAL is the practical route for questions about joining the festival's education programme or proposing to future editions.","dance,performance",tyo-bal,,,https://bodyartslabo.com/wwfes2026/festival,2026-10-19,active,4,"2026 credit is 制作 (production), not curator. The curator title comes from the BAL about pages (JA and EN, © 2026). Also listed as production staff of Dance New Air 2020 (dancenewair.tokyo)."
tyo-cur-iwata-tomoya,Tomoya Iwata,岩田智哉,Artistic director,tokyo,"Tomoya Iwata is a curator who has directed The 5th Floor since April 2022. The space is a curatorial venue on the fifth floor of a former dormitory building in Ikenohata, near Nezu station in Taito-ku. Since opening in 2020 it has focused on curating itself, with guest curators and a curator-in-residence programme.

Iwata curated 'Portal: AfroAsia' (16 October to 29 November 2026) with AfroAsia Collective. In 2025 the space hosted 'Phenomena and Records: One Record, Three Rooms'.

For a visiting artist or curator, Iwata is a good contact for small, research-led exhibitions and curatorial exchange in Tokyo, in a non-commercial setting.",visual_art,tyo-the5thfloor,,,https://the5thfloor.org/,2026-10-19,active,4,"Home page (checked in browser) credits 岩田智哉 for the current show. Director-since-2022 line from the curator bio on the same site (galleries agent). Opening year and residency from Forbes Japan 2024 (agent). role_label: director of the space, mapped to Artistic director."
tyo-cur-makigami-koichi,Koichi Makigami,巻上公一,Festival director,tokyo,"Koichi Makigami, a vocalist and theremin player, is one of the artists who produce and curate JAZZ ART SENGAWA, Tokyo's yearly festival of improvised music at Chofu's Sengawa Theater. Arts Council Tokyo names Makigami first among the six artist-producers who plan the festival. Since 2019 an executive committee of artists and staff has run it, continuing an event the theatre started in 2008.

The 2025 edition (11 to 14 September) took electronic music as its theme and mixed four days of genre-free improvised concerts with workshops, inclusive performances and a free outdoor stage. Makigami also played in the opening ensemble.

For a visiting improviser, this is the main festival of free improvisation in the Tokyo area.","music,sound,performance",tyo-jazzartsengawa,,,https://www.artscouncil-tokyo.jp/en/grants/program/27293/,2026-10-19,active,4,"Arts Council Tokyo FY2025 grant page (JAZZ ART SENGAWA 2025). Credits spell the name 'Koichi Makigami' and 'Kouichi MAKIGAMI'. Search snippets point to a 2026 edition on 5-8 Nov 2026 (iko-yo, returned 403), not confirmed on an opened page. Co-founders Hiromichi Sakamoto and Kiyoto Fujiwara appear only in older sources, so they are not added."
tyo-cur-ukawa-naohiro,Naohiro Ukawa,宇川直宏,Programmer,tokyo,"Naohiro Ukawa is the artist who opened DOMMUNE in March 2010 as a DIY live-streaming studio and channel, now broadcasting as SUPER DOMMUNE. Weekday evenings pair a talk programme with a music programme (BROADJ) of DJs and live acts from Japan and abroad. Ukawa treats the filming, streaming and recording of these programmes as an ongoing artwork.

Ukawa still hosts much of it in person: the October 2026 schedule has Ukawa as MC or interviewer on several nights, among them a programme marking 50 years of punk and a long talk night with young artists.

For a visiting artist, DOMMUNE is a live window on who is in town, and studio visits are possible on broadcast nights.","music,sound,film",tyo-dommune,,,https://www.dommune.com/about/,2026-10-19,active,4,"About page: founded DIY by the artist 宇川直宏 on 2010-03-01. The 2026 role comes from the live schedule on dommune.com (MC/聞き手, Oct 2026). role_label 'Programmer' is our reading of founder plus host; the site doesn't use a title."
tyo-cur-yama-yuki,Yama Yuki,,Organiser,tokyo,"Yama Yuki is a member of MIMINOIMI, the Tokyo collective that runs MIMINOIMI Ambient / Week, a seven-day city festival on the possibilities of ambient music. Yama Yuki also runs the archive label ato.archives and the event series re_location, and performs under several names.

The 2026 edition, the fourth, ran 4 to 10 May 2026 under the theme 'Attention In Motion', mainly at ADRIFT and reload in Shimokitazawa. It mixed workshops, lectures and concerts, with guests including Lawrence English. In a published interview about the first edition, Yama Yuki set out the festival's idea of ambient as a way of rethinking listening and environment.

For a visiting sound artist, MIMINOIMI is the most thoughtful entry point into Tokyo's ambient and listening scene.","music,sound",tyo-miminoimi,,,https://www.miminoimi.me/,2026-10-19,active,5,"2026 page lists 主催：MIMINOIMI and 'Yama Yuki (MIMINOIMI, ato.archives)'. Organising role from the Ucuuu interview with the MIMINOIMI team (2024-02-23, https://ucuuu.net/magazine/miminoimi/). Japanese name not published."
tyo-cur-nagata-kentaro,kentaro nagata,,Organiser,tokyo,"kentaro nagata is a member of MIMINOIMI, the collective behind the Tokyo festival MIMINOIMI Ambient / Week, and runs the label elect-low. nagata also works as a sound engineer and releases electronica, experimental and electroacoustic music.

nagata has run the event series TENbient since 2017. An expanded TENbient formed one day of the first MIMINOIMI week. At the 2026 edition (4 to 10 May, Shimokitazawa) nagata appeared on the lecture day and in the free programme at reload.

For a visiting electronic or sound artist, nagata is a direct link to Tokyo's ambient and electroacoustic network.","music,sound",tyo-miminoimi,,,https://www.miminoimi.me/,2026-10-19,active,5,"Name written in lower case as published. 2026 page lists 'kentaro nagata (MIMINOIMI, elect-low)'. TENbient and the organising role come from the Ucuuu interview (2024-02-23). The Tokyo Gig Guide 2026 listing was created by user 'ngtkntr' (probably the same person; not used as evidence)."
```

---

# APPENDIX D: project context

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
