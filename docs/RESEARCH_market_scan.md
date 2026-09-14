# Cue Radar — Trip Radar "event_sources" Seed Mapping (23 cities)

The single most important finding: across all 23 markets **almost no source publishes a public ICS/RSS/JSON feed**, so the crawler must be architected around HTML/DOM scraping and JSON-LD (`schema.org/Event`) extraction rather than feed ingestion — plan for per-site scrapers, not a feed reader. The pilot six (Berlin, Cologne, Brussels, Tel Aviv, Vienna, Amsterdam) are covered in depth below; the other 17 more briefly. Rows are marked **verified** (page opened, live dated calendar seen) or **unverified** (correct official domain/program path identified, live calendar not directly confirmed — validate before production crawl).

## TL;DR
- **Feeds are the binding constraint:** no ICS/RSS/JSON feed was confirmed anywhere (including tanzraumberlin.de). Build HTML scrapers + JSON-LD event extraction; auto-probe each page for `?ical=1`, `/feed`, `.ics`, and `<script type="application/ld+json">`.
- **Best "anchor" sources to build first:** city aggregators with dense dated listings — tanzraumberlin.de + field-notes.berlin + Berlin Bühnen (Berlin), MuseumsQuartier + TQW (Vienna), NRW Landesbüro Tanz (Cologne), Tokyo Art Beat (Tokyo), Danse Suisse Tanzkalender (Zurich), CPH Stage (Copenhagen), Karnet (Krakow), plus **Resident Advisor (ra.co)** as the cross-city backbone for experimental-electronic/sound events.
- **Weakest coverage / Instagram-newsletter fallback:** Tel Aviv experimental sound (Levontin 7, Hateiva), Tbilisi's contemporary/club scene (Instagram + RA only), and small Berlin sound micro-venues. Some entities are closed/relocated (STEIM, SuperDeluxe) or dormant (Centre Pompidou renovation to 2030) and must be excluded.

## Key Findings
- **Recommended crawl frequency by source kind:** `studio_schedule` = weekly; `venue_program` = twice weekly; `city_aggregator` = daily; `festival` = monthly, escalating to daily in the 8 weeks before an edition (periodic festivals only publish programmes shortly before); `museum_gallery` = weekly; `newsletter`/`instagram_only` = manual/weekly.
- **Richest structured markets:** Berlin, Vienna, Tokyo, Zurich — each has at least one dense, filterable dated aggregator.
- **Crawlability:** most modern venue calendars (Tanzhaus Zürich, TQW, Dansens Hus, Lavanderia a Vapore, Culturgest) are JS-rendered — budget for headless-browser rendering. Cookie/consent walls are common on German and Austrian sites (Tanzfabrik, Stadtgarten) but do not block content extraction.
- **Discipline coverage is uneven:** dance/choreography/performance are well served by institutional sites; experimental sound/live-electronics is disproportionately dependent on RA, micro-venue HTML pages, and newsletters.

## Details

### PILOT 1 — BERLIN
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| tanzraumberlin (Tanzbüro Berlin) | https://www.tanzraumberlin.de/en/dance-calendar/ | city_aggregator | performances/workshops | dance/choreography/performance | HTML calendar | rolling | EN/DE | central Berlin dance calendar; no ICS/RSS confirmed | verified |
| Tanzbüro Berlin workshops | https://www.tanzraumberlin.de/en/news/workshops/ | city_aggregator | workshops/classes | dance/performance | HTML | rolling | EN/DE | CPD/workshop listings | verified |
| Tanzfabrik Berlin – class schedule | https://www.tanzfabrik-berlin.de/en/kursplan | studio_schedule | classes | dance | HTML (bsport booking) | weekly | EN/DE | booking via bsport widget; cookie wall | verified |
| Tanzfabrik – workshop programme | https://www.tanzfabrik-berlin.de/de/workshop_programm | studio_schedule | workshops/intensives | dance/choreography | HTML | seasonal | DE/EN | Summer/ing (27 Jul–30 Aug 2026) + WinterTanz | verified |
| Uferstudios | https://www.uferstudios.com/de/dance/veranstaltungen/ | venue_program | performances/festivals | dance/choreography/performance | HTML | rolling | DE | events list; can be empty; hosts ada, HZT, Tanznacht | verified |
| HAU Hebbel am Ufer | https://www.hebbel-am-ufer.de/en/programme/schedule-tickets/ | venue_program | performances/festivals | dance/performance/interdisciplinary | HTML calendar | rolling | EN/DE | month-paginated URL; runs Tanz im August | verified |
| Sophiensæle | https://sophiensaele.com/en | venue_program | performances/festivals | dance/performance | HTML | rolling | EN/DE | calendar on program page; Tanztage in Jan | verified |
| Radialsystem | https://www.radialsystem.de/en/programm/programm/ | venue_program | performances/residencies | dance/sound/interdisciplinary | HTML calendar | rolling | EN/DE | Body Time Space residencies | verified |
| DOCK 11 / EDEN | https://dock11-berlin.de/ | studio_schedule + venue_program | classes/performances | dance | HTML | weekly/rolling | DE | 100+ courses + stage; Gaga sessions; Pool festival | verified |
| ausland | https://ausland.berlin | venue_program | performances | sound/live_electronics/improvisation | HTML | rolling | DE/EN | non-commercial micro-venue (Prenzlauer Berg) | unverified |
| KM28 | https://www.km28.de/ (series: /series) | venue_program | performances | sound/live_electronics | HTML | 2–3×/week | EN | volunteer-run; HTML only, no feed | verified |
| CTM Festival | https://www.ctm-festival.de/festival-2026/programme/schedule | festival | performances/workshops/installations | sound/live_electronics/interdisciplinary | HTML | annual (Jan/Feb) | EN | 27th ed. 23 Jan–1 Feb 2026; year-round events at /events | verified |
| Berlin Atonal / CONTRA | https://www.berlin-atonal.com | festival | performances/installations | sound/installation | HTML | annual | EN | also ra.co/promoters/46405 | unverified |
| field notes | https://field-notes.berlin/en/kalender | city_aggregator | performances | sound/live_electronics/new music | HTML calendar | rolling | EN/DE | month-of-contemporary-music scene calendar | verified |
| Digital in Berlin | https://www.digitalinberlin.de/ | city_aggregator/newsletter | performances | sound/experimental | HTML + newsletter | rolling | EN | scene listings + recommendations | unverified |
| KW Institute for Contemporary Art | https://www.kw-berlin.de/en/ | museum_gallery | exhibitions/performances | installation/performance | HTML | seasonal | EN/DE | Berlin Biennale organiser | verified |
| Hamburger Bahnhof – Nationalgalerie der Gegenwart | https://www.smb.museum/en/museums-institutions/hamburger-bahnhof/ | museum_gallery | exhibitions | installation | HTML | seasonal | EN/DE | large contemporary collection | unverified |
| Haus der Kulturen der Welt (HKW) | https://www.hkw.de/en/ | museum_gallery/venue_program | exhibitions/performances/festivals | sound/performance/interdisciplinary | HTML | seasonal | EN/DE | interdisciplinary programme | verified |
| Berlin Bühnen | https://www.berlin-buehnen.de/de/ | city_aggregator | performances | dance/performance | HTML | daily | DE | all Berlin stages aggregator | verified |
| Berlin.de tickets/events | https://www.berlin.de/en/tickets/ | city_aggregator/ticketing | performances/festivals | dance/performance/interdisciplinary | HTML | daily | EN/DE | municipal listings | verified |
| Tanz im August | https://www.tanzimaugust.de | festival | performances/workshops | dance/choreography | HTML | annual (Aug) | EN/DE | 38th ed. 13–29 Aug 2026, presented by HAU under AD Ricardo Carmona; "19 productions and 54 events across 11 venues, incl. 3 premieres, 6 German premieres" | verified |

### PILOT 2 — COLOGNE
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| TanzFaktur | https://tanzfaktur.eu | venue_program | performances/workshops | dance/performance | HTML | rolling | DE | central independent dance venue | unverified |
| Barnes Crossing (Wachsfabrik) | https://barnescrossing.de/en/home-english/ | venue_program + studio_schedule | performances/workshops | dance/performance | HTML | rolling | DE/EN | largest free-scene dance hall; 14 resident choreographers | verified |
| tanz.tausch festival | https://www.tanztausch-festival.de/ | festival | performances | dance/performance | HTML | annual (Jan) | DE | 13th ed. co-curated with TanzFaktur | verified |
| NRW Landesbüro Tanz — Tanzkalender | https://www.landesbuerotanz.de/tanzkalender/ | city_aggregator | performances/festivals | dance/performance | HTML calendar | rolling | DE | regional NRW dance calendar (Köln, Essen, Düsseldorf) | verified |
| PACT Zollverein (Essen, nearby) | https://www.pact-zollverein.de/en | venue_program | performances/residencies | dance/performance/sound | HTML | rolling | EN/DE | major NRW production house | unverified |
| Stadtgarten Köln | https://www.stadtgarten.de/en/program | venue_program | performances | sound/live_electronics/jazz | HTML | rolling | EN/DE | European Centre for Jazz & Contemporary Music | verified |
| LOFT Köln | https://www.loftkoeln.de/en/program-at-stadtgarten/ | venue_program | performances | sound/improvisation | HTML | rolling | EN/DE | experimental/improv | verified |
| ACHT BRÜCKEN | https://www.achtbruecken.de/en/festival | festival | performances | sound/live_electronics/new music | HTML | annual (May) | EN/DE | ran 2011–2025; confirm future editions before crawl | verified |
| tanzhaus nrw (Düsseldorf, nearby) | https://www.tanzhaus-nrw.de | venue_program + studio_schedule | performances/classes/festivals | dance/choreography | HTML | rolling | DE/EN | Claiming Common Spaces festival | unverified |
| Museum Ludwig / Kolumba | https://www.museum-ludwig.de/en / https://www.kolumba.de | museum_gallery | exhibitions | installation | HTML | seasonal | EN/DE | occasional sound programmes | unverified |

### PILOT 3 — BRUSSELS
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| Kaaitheater | https://kaaitheater.be/en | venue_program | performances/festivals | dance/performance/interdisciplinary | HTML | rolling | EN/NL/FR | It Takes a City festival partner | verified |
| Charleroi danse / La Raffinerie | https://charleroi-danse.be/en | venue_program + studio_schedule | performances/classes/workshops/residencies | dance/choreography | HTML | rolling | EN/FR | choreographic centre of Wallonia-Brussels Fed.; regular classes | unverified |
| Beursschouwburg | https://www.beursschouwburg.be | venue_program | performances/exhibitions | performance/interdisciplinary | HTML | rolling | EN/NL/FR | multidisciplinary | unverified |
| Les Brigittines | https://www.brigittines.be | venue_program | performances/festivals | dance/performance | HTML | rolling | FR/NL | Brigittines International Festival (Aug/Sep) | unverified |
| P.A.R.T.S. SummerSchool | https://www.parts.be/summerschool-2026 | studio_schedule | intensives/workshops | dance/choreography | HTML | annual (6 Jul–7 Aug 2026) | EN | open-classes/auditions signup form | verified |
| Rosas | https://www.rosas.be | venue_program | performances | dance/choreography | HTML | rolling | EN/FR/NL | company + performance space (Vorst/Forest) | unverified |
| Q-O2 | https://www.q-o2.be/en/ | venue_program | performances/residencies | sound/live_electronics/installation | HTML | rolling | EN | experimental music & sound-art workspace (canal zone) | verified |
| Kunstenfestivaldesarts | https://www.kfda.be/en | festival | performances | dance/performance/interdisciplinary | HTML | annual (May, ~3 weeks) | EN/FR/NL | Free School programme; ~30 venues | unverified |
| Brussels Dance Festival | https://brusselsdancefestival.be | city_aggregator/festival | performances/workshops | dance | HTML | annual (14–23 Aug 2026) | EN/FR/NL | now a free open-air edition on 4 central squares (Bourse, De Brouckère, Monnaie, Grand-Place); goal "Europe's dance capital by 2030" | verified |
| WIELS | https://www.wiels.org | museum_gallery | exhibitions/performances | installation/performance | HTML | seasonal | EN/FR/NL | contemporary art centre | unverified |
| Argos | https://www.argosarts.org | museum_gallery | exhibitions/screenings | installation/sound | HTML | seasonal | EN/NL/FR | audiovisual arts | unverified |
| Kunstenpunt / Flanders Arts Institute | https://www.kunsten.be/en/ | national centre/newsletter | programmes/meetings | dance/performance/interdisciplinary | HTML + newsletter | rolling | EN/NL | knowledge centre; biweekly newsletter; no comprehensive public calendar | verified |
| Agenda.brussels | https://agenda.brussels/en | city_aggregator | performances/festivals/exhibitions | interdisciplinary | HTML | daily | EN/FR/NL | municipal what's-on | unverified |

### PILOT 4 — TEL AVIV
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| Suzanne Dellal Centre | https://suzannedellal.org.il/en/ | venue_program + studio_schedule | performances/festivals/classes | dance/choreography | HTML | rolling | EN/HE | Pro-Mornings pro classes; Tel Aviv Dance Festival | verified |
| Tel Aviv Dance Festival | https://telavivdance.suzannedellal.org.il/en/ | festival | performances | dance/choreography | HTML | annual | EN/HE | Suzanne Dellal platform | verified |
| Kelim Choreography Center (Bat Yam) | https://www.kelim.org.il | studio_schedule + venue_program | workshops/performances | choreography/dance | HTML | rolling | HE | 2-year choreography program; Asif festival | unverified |
| Tmuna Theatre | https://www.tmu-na.org.il | venue_program | performances/music | performance/dance/sound | HTML | rolling | HE | fringe/avant-garde; hosted Intimadance | unverified |
| HaZira Performance Art Arena (Jerusalem, ref.) | https://hazira.org.il | venue_program | performances | performance/dance | HTML | rolling | HE | scene-adjacent (Jerusalem) | unverified |
| Levontin 7 | https://www.levontin7.com | venue_program | performances | sound/live_electronics/experimental | HTML + newsletter | weekly | HE | experimental music venue | unverified |
| Hateiva (Jaffa) | https://www.hateiva.co.il | venue_program | performances | sound/improvisation | HTML/Instagram | weekly | HE | improv/experimental music | unverified |
| Tel Aviv Museum of Art | https://www.tamuseum.org.il/en/ | museum_gallery | exhibitions | installation | HTML | seasonal | EN/HE | Contemporary Music Biennial | unverified |
| CCA Tel Aviv | https://cca.org.il/en/ | museum_gallery | exhibitions/screenings | installation/sound/performance | HTML | seasonal | EN/HE | | unverified |

*Gap:* TLV experimental-sound programming (Levontin 7, Hateiva) is largely newsletter/Instagram-driven — verify feeds manually.

### PILOT 5 — VIENNA
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| ImPulsTanz — festival | https://www.impulstanz.com/en/ | festival | performances/workshops/research | dance/choreography/performance | HTML | annual (9 Jul–9 Aug 2026) | EN/DE | 239 workshops at the Arsenal (per vienna.info); Public Moves free classes (~25,000 participants) | verified |
| ImPulsTanz — workshops | https://www.impulstanz.com/en/workshops | studio_schedule (seasonal) | workshops/intensives | dance/choreography | HTML | annual | EN/DE | Education apply tool | verified |
| Tanzquartier Wien (TQW) | https://www.tqw.at/en/program | venue_program + studio_schedule | performances/classes/workshops | dance/choreography/performance | HTML (JS calendar) | rolling | EN/DE | filterable calendar | verified |
| brut Wien | https://brut-wien.at/en/Programme/Calendar | venue_program | performances | dance/performance/interdisciplinary | HTML calendar | rolling | EN/DE | dated 2026 events | verified |
| WUK | https://www.wuk.at/en/events/ | venue_program | performances/festivals | performance/sound/interdisciplinary | HTML | rolling | EN/DE | hosts Unsafe+Sounds | verified |
| echoraum | https://echoraum.at | venue_program | performances | sound/live_electronics | HTML | rolling | DE | also via kultur.net/wien | unverified |
| rhiz | https://rhiz.wien | venue_program | performances | sound/electronics | HTML | rolling | DE | electronic/experimental | unverified |
| Wien Modern | https://www.wienmodern.at/calendar-en | festival | performances | sound/new music/live_electronics | HTML calendar | annual (Oct–Nov) | EN/DE | multi-venue; URL rolls per edition | verified |
| mumok | https://www.mumok.at/en/events | museum_gallery | exhibitions/events | installation/performance | HTML | seasonal | EN/DE | | unverified |
| Kunsthalle Wien | https://kunsthallewien.at/en/ | museum_gallery | exhibitions/performances | installation/performance | HTML | seasonal | EN/DE | | unverified |
| MuseumsQuartier calendar | https://www.mqw.at/en/program/category/danceperformancemusic | city_aggregator | performances | dance/performance/sound | HTML | daily | EN/DE | dense dated dance/perf/music listings | verified |

### PILOT 6 — AMSTERDAM
| Name | URL | Kind | Content | Disciplines | Format | Rhythm | Lang | Crawl notes | Conf |
|---|---|---|---|---|---|---|---|---|---|
| Henny Jurriëns Studio | https://hennyjurriensstudio.com/ | studio_schedule | classes/workshops/intensives | dance | HTML | weekly/seasonal | EN | pro training; Amsterdam Summer Intensive | verified |
| ICK Dans Amsterdam / Artist Space | https://www.ickamsterdam.com | venue_program + studio_schedule | performances/workshops | dance/choreography | HTML | rolling | EN/NL | The Artists Are Present festival | unverified |
| Frascati | https://www.frascatitheater.nl/en/agenda | venue_program | performances | dance/performance | HTML agenda | rolling | EN/NL | hosts ICK/independent makers | verified |
| Dansmakers (verify current branding) | https://www.dansmakers.nl | studio_schedule + venue_program | performances/development | dance/choreography | HTML | rolling | NL | verify current status before crawl | unverified |
| Veem House for Performance | https://www.veem.house | venue_program | performances | dance/performance | HTML | rolling | EN/NL | verify current status | unverified |
| Podium Mozaïek | https://www.podiummozaiek.nl | venue_program | performances | dance/performance/music | HTML | rolling | NL | intercultural programming | unverified |
| Bimhuis | https://www.bimhuis.nl/en/ | venue_program | performances | sound/improvisation/jazz | HTML | 250+ concerts/yr | EN/NL | improvised-music main stage (250–300 concerts/yr per venue channels) | unverified |
| OCCII / Splendor | https://occii.org ; https://splendoramsterdam.com | venue_program | performances | sound/experimental | HTML | rolling | EN/NL | experimental music venues | unverified |
| Sonic Acts (Biennial) | https://sonicacts.com/ (2026: https://2026.sonicacts.com/) | festival | performances/exhibitions/workshops | sound/installation/interdisciplinary | HTML | biennial | EN | 2026 ed. 5 Feb–29 Mar (intensive weekend 26 Feb–1 Mar); "more than 80 events... 200+ artists" across 15–25 venues | verified |
| Julidans | https://www.julidans.nl | festival | performances | dance/choreography | HTML | annual (Jul) | EN/NL | international contemporary dance | unverified |
| Holland Festival | https://www.hollandfestival.nl/en/ | festival | performances | dance/performance/sound/interdisciplinary | HTML | annual (Jun) | EN/NL | | unverified |
| Stedelijk Museum | https://www.stedelijk.nl/en | museum_gallery | exhibitions/performances | installation/performance | HTML | seasonal | EN/NL | | unverified |
| W139 | https://www.w139.nl | museum_gallery | exhibitions/performances | installation/performance | HTML | seasonal | EN/NL | artist-run | unverified |
| Rewire (The Hague, ~60 km) | https://www.rewirefestival.nl/ | festival | performances | sound/live_electronics/experimental | HTML | annual (Apr) | EN | regionally relevant | verified |

*Closed — do not list:* STEIM (closed 2020).

### REMAINING 17 CITIES

**ZURICH** — Tanzhaus Zürich `https://www.tanzhaus-zuerich.ch/programm/kalender/` (venue_program+studio_schedule, dance, HTML/JS, DE/EN, **verified**) · Gessnerallee `https://www.gessnerallee.ch` (venue_program, performance/dance, DE, unverified) · Rote Fabrik `https://rotefabrik.ch/de/programm.html` (venue_program, sound/performance, DE, **verified**) · Cabaret Voltaire `https://cabaretvoltaire.ch` (museum_gallery, performance/installation, DE/EN, unverified) · Kunsthalle Zürich `https://kunsthallezurich.ch` (museum_gallery, installation, DE/EN, unverified) · Danse Suisse Tanzkalender `https://www.dansesuisse.ch/de/tanzland-schweiz/kalender-veranstaltungen` (city_aggregator, dance, DE/FR, **verified**).

**PARIS** — Centre national de la danse (CN D) `https://www.cnd.fr/fr/agenda` (venue_program+studio_schedule, dance/choreography, FR, **verified**) · Théâtre de la Ville `https://www.theatredelaville-paris.com/en` (venue_program, dance/performance, EN/FR, unverified) · Ménagerie de Verre `https://menageriedeverre.com/agenda` (venue_program+studio_schedule, dance/performance, FR, **verified**) · IRCAM agenda `https://www.ircam.fr/agenda` (venue_program/festival, sound/live_electronics, FR/EN, **verified**) · Centre Pompidou `https://www.centrepompidou.fr/fr/programme/spectacles-concerts` (museum_gallery, performance/sound, FR — **building closed 22 Sept 2025 for ~€460m renovation, reopening ~2030; collection dispersed via "Constellation" programme — treat as dormant/offsite**) · Palais de Tokyo `https://palaisdetokyo.com/en/` (museum_gallery, installation/performance, EN/FR, unverified) · Micadanses `https://micadanses.com` (studio_schedule, dance, FR, unverified). *numeridanse.tv is a video archive, not an events calendar — excluded.*

**LYON** — Maison de la Danse `https://maisondeladanse.com/information/spectacles` (venue_program, dance, FR, **verified**) · Les Subsistances `https://www.les-subs.com/agenda/` (venue_program, dance/performance, FR, **verified**) · Grrrnd Zero `https://grrrndzero.org` (venue_program, sound/experimental, FR, unverified) · Biennale de la danse `https://labiennaledelyon.com` (festival, dance, FR, unverified — biennial).

**STOCKHOLM** — Dansens Hus Stockholm `https://dansenshus.se/en/program/` (venue_program, dance, EN/SV, **verified**) · MDT Stockholm `https://mdtsthlm.se` (venue_program, dance/performance, EN/SV, **verified**) · Weld `https://weld.se` (studio_schedule+venue_program, dance/performance, SV/EN, unverified) · Fylkingen `https://fylkingen.se` (venue_program, sound/live_electronics, SV/EN, unverified) · Moderna Museet `https://www.modernamuseet.se/stockholm/en/` (museum_gallery, installation, EN/SV, unverified).

**OSLO** — Dansens Hus Oslo `https://www.dansenshus.com/en/program` (venue_program, dance, EN/NO, **verified**; note `.com` vs Stockholm's `.se`) · Black Box teater `https://blackbox.no/en/` (venue_program, dance/performance, EN/NO, **verified**) · Ultima Contemporary Music Festival `https://ultima.no/en/` (festival, sound/live_electronics, EN, **verified**) · Kunstnernes Hus `https://kunstnerneshus.no` (museum_gallery, installation, NO/EN, unverified) · PRODA `https://proda.no` (studio_schedule, dance, NO, unverified).

**COPENHAGEN** — Dansehallerne `https://dansehallerne.dk/en/public-program/` (venue_program, dance, EN/DA, **verified**) · Metropolis / Københavns Internationale Teater `https://www.metropolis.dk/en/` (festival/city_aggregator, performance/dance, DA/EN, **verified**) · Alice CPH `https://alicecph.com` (venue_program, sound/live_electronics, DA/EN, unverified) · Louisiana `https://louisiana.dk/en/whats-on/calendar/` (museum_gallery, installation, EN/DA, **verified**) · Kunsthal Charlottenborg `https://kunsthalcharlottenborg.dk` (museum_gallery, installation/performance, DA/EN, unverified) · CPH Stage `https://cphstage.dk/en/publikum/program` (city_aggregator, dance/performance, EN/DA, **verified**).

**ATHENS** — Onassis Stegi `https://www.onassis.org/whats-on` (venue_program, dance/performance/sound, EN/GR, **verified**; includes Onassis Dance Days) · Athens & Epidaurus Festival `https://aefestival.gr/schedule/?lang=en` (festival, dance/performance, EN/GR, **verified**) · Duncan Dance Research Center `https://www.duncandancecenter.org/en/` (studio_schedule+venue_program, dance, EN/GR, **verified**) · EMST National Museum of Contemporary Art `https://www.emst.gr/en/` (museum_gallery, installation, EN/GR, unverified) · Romantso `https://www.romantso.gr` (venue_program, performance/sound, GR, unverified).

**TBILISI** — Movement Theatre (Kakha Bakuradze) `https://www.movementtheatre.ge/en` (venue_program, dance/performance, EN/GE — dated events likely on Facebook, unverified) · Kunsthalle Tbilisi `https://kunsthalle.ge` (museum_gallery, installation/performance, GE/EN, unverified) · YOLO.ge `https://yolo.ge/en/poster/movement-music` (city_aggregator/ticketing, performance/sound, EN/GE, **verified**) · Resident Advisor Tbilisi `https://ra.co/events/ge/tbilisi` (city_aggregator, sound/live_electronics, EN, unverified) · Tbilisi International Festival of Theatre `https://tbilisiinternational.com` (festival, performance, EN/GE, unverified). *Gap: contemporary/experimental scene (KHIDI, Mtkvarze, Left Bank, TES) is largely Instagram/RA-only — treat RA.co + YOLO.ge as primary structured feeds.*

**TOKYO** — Tokyo Art Beat `https://www.tokyoartbeat.com/en/events` (city_aggregator/museum_gallery, installation/performance/sound, EN, **verified** — 750+ venues, strong daily-crawl anchor) · Dance New Air `https://dancenewair.tokyo/` (festival, dance, EN/JP, **verified**) · Yokohama Dance Collection `https://yokohama-dance-collection.jp/en/` (festival, dance/choreography, EN/JP, **verified**) · Setagaya Public Theatre `https://setagaya-pt.jp/en/` (venue_program, dance/performance, EN/JP, unverified) · ST Spot Yokohama `https://stspot.jp` (venue_program, dance/performance, JP, unverified) · Ftarri `https://www.ftarri.com` (venue_program, sound/live_electronics, JP/EN, unverified) · Mori Art Museum `https://www.mori.art.museum/en/` (museum_gallery, installation, EN/JP, unverified). *Closed — do not list: SuperDeluxe (2019).*

**SEOUL** — MODAFE `https://modafe.org` (festival, dance, KR/EN, unverified) · SPAF – Seoul Performing Arts Festival `https://www.spaf.or.kr` (festival, dance/performance, KR/EN, unverified) · SIDance `https://www.sidance.org` (festival, dance, KR/EN, unverified) · Platform-L Contemporary Art Center `https://www.platform-l.org` (museum_gallery/venue_program, installation/performance, KR/EN, unverified) · Seoul Art Space Mullae `https://mullae.sfac.or.kr` (studio_schedule, interdisciplinary, KR, unverified) · WeSA festival `https://wesa.kr` (festival, sound/live_electronics, KR/EN, **verified via RA listing**) · Arko Arts Theater `https://www.arko.or.kr/eng` (venue_program, dance/performance, EN/KR, **verified**) · Visit Seoul events `https://english.visitseoul.net/events` (city_aggregator, performance/interdisciplinary, EN, **verified**). *Festival URLs roll annually — re-verify each edition.*

**WARSAW** — Nowy Teatr `https://nowyteatr.org/en` (venue_program, dance/performance, PL/EN, **verified**) · Komuna Warszawa `https://komuna.warszawa.pl/program-2/` (venue_program, dance/performance, PL/EN, **verified**) · CCA Ujazdowski `https://u-jazdowski.pl/en/programme` (museum_gallery, installation/performance, PL/EN, unverified) · Instytut Muzyki i Tańca (NIMiT) `https://nimit.pl` (national centre/aggregator, dance, PL, unverified) · Ciało/Umysł festival `https://cialoumysl.pl` (festival, dance, PL/EN, unverified).

**KRAKOW** — Cricoteka `https://cricoteka.pl/en/` (museum_gallery/venue_program, performance/installation, PL/EN, unverified) · Unsound festival `https://www.unsound.pl/` (festival, sound/live_electronics, EN/PL, **verified**; 2026 titled "Warszawa-Kraków") · Nowohuckie Centrum Kultury / Krakow Choreographic Centre `https://nck.krakow.pl/` (venue_program, dance/choreography, PL, **verified**; hosts BalletOFFFestival, SPACER) · MOCAK `https://www.mocak.pl/` (museum_gallery, installation, PL/EN, unverified) · Karnet Krakow Culture `https://karnet.krakowculture.pl` (city_aggregator, performance/interdisciplinary, PL/EN, **verified**).

**PRAGUE** — PONEC – divadlo pro tanec / Tanec Praha `https://divadloponec.cz/` (venue_program/festival, dance, CZ/EN, **verified**; TANEC PRAHA festival in June) · Studio ALTA `https://www.altart.cz/program/` (venue_program, dance/performance, CZ/EN, **verified**) · MeetFactory `https://www.meetfactory.cz/en/program` (venue_program, performance/sound/installation, CZ/EN, unverified) · DOX Centre for Contemporary Art `https://www.dox.cz/en` (museum_gallery, installation/performance, CZ/EN, unverified) · Taneční aktuality `https://www.tanecniaktuality.cz` (city_aggregator, dance, CZ, unverified) · Czech Dance Platform `https://tanecniplatforma.cz/en` (festival, dance, EN/CZ, **verified**).

**LISBON** — Culturgest `https://www.culturgest.pt/en/whats-on/by-event/` (venue_program, dance/performance/sound, PT/EN, **verified**) · Teatro do Bairro Alto `https://teatrodobairroalto.pt/en/` (venue_program, dance/performance, PT/EN, unverified) · Alkantara festival `https://alkantara.pt/en/` (festival, dance/performance, PT/EN, **verified**) · Galeria Zé dos Bois (ZDB) `https://zedosbois.org/en/programme/` (venue_program/museum_gallery, sound/performance/installation, EN/PT, **verified**) · Fundação Calouste Gulbenkian / CAM `https://gulbenkian.pt/en/agenda/` (museum_gallery, installation/sound, EN/PT, unverified) · MAAT `https://www.maat.pt/en` (museum_gallery, installation, EN/PT, unverified) · O Espaço do Tempo (Montemor-o-Novo) `https://oespacodotempo.pt` (venue_program/residency, dance/performance, PT, unverified). *Serralves is in Porto — correctly excluded.*

**BARCELONA** — Mercat de les Flors `https://mercatflors.cat/en/schedule/` (venue_program, dance, CA/EN, **verified**) · Graner `https://granerbcn.cat` (studio_schedule, dance, CA, unverified) · La Caldera `https://lacaldera.info` (studio_schedule+venue_program, dance, CA, unverified) · CCCB `https://www.cccb.org/en/whats-on` (museum_gallery, installation/interdisciplinary, EN/CA, unverified) · MACBA `https://www.macba.cat/en` (museum_gallery, installation, EN/CA, unverified) · Sónar festival `https://sonar.es` (festival, sound/live_electronics, EN/ES, unverified) · IF Barcelona / Ajuntament agenda `https://ifbarcelona.cat/en/programacio/` (city_aggregator, dance, CA/EN, **verified**).

**TURIN** — Lavanderia a Vapore `https://www.lavanderiaavapore.eu/en/calendar/` (venue_program/residency, dance, IT/EN, **verified**) · Torinodanza festival `https://www.torinodanzafestival.it/` (festival, dance, IT/EN, **verified**) · Club to Club (C2C) `https://www.clubtoclub.it` (festival, sound/live_electronics, IT/EN, unverified) · Castello di Rivoli `https://www.castellodirivoli.org/en/` (museum_gallery, installation, IT/EN, unverified) · Fondazione Merz `https://fondazionemerz.org/en/` (museum_gallery, installation, IT/EN, unverified) · Fondazione TPE `https://fondazionetpe.it` (venue_program, performance, IT, unverified).

**REMOTE / ONLINE** — Resident Advisor city pages `https://ra.co` (city_aggregator, cross-city experimental electronics/sound, structured, EN, unverified) · e-flux `https://www.e-flux.com` (city_aggregator, global exhibitions/performances/announcements, EN, unverified).

### Multi-city / online retreat & intensive directories
- **Contact Quarterly** — `https://contactquarterly.com/contact-improvisation/newsletter/` — global contact-improvisation jams/workshops.
- **b12 Berlin** — `https://www.b12.space` — annual summer contemporary dance/choreography workshop festival.
- **Tanzwerkstatt Europa (Munich)** — `https://www.jointadventures.net` — annual summer workshops + performances.
- **SEAD (Salzburg)** — `https://www.sead.at` — Bodhi Project / summer intensives.
- **Ponderosa / Tanzland (Stolzenhagen)** — `https://www.ponderosa-dance.de` — summer contemporary/improv intensives.
- **Deltebre Dansa (Catalonia)** — `https://www.deltebredansa.cat` — annual summer festival/intensive.
- **ImPulsTanz DanceWeb** — `https://www.impulstanz.com/en/danceweb/` — Europe-wide mobility scholarship (Vienna).
- **P.A.R.T.S. SummerSchool** — `https://www.parts.be/summerschool-2026` — 5-week Brussels intensive.

### RSS / ICS / JSON feeds found (raw URLs)
- **None confirmed.** No public ICS/RSS/JSON feed was verified for any source, including tanzraumberlin.de (web-only listing; no `?ical=` or `/events.ics` evidence). Design the crawler for HTML/DOM scraping plus JSON-LD extraction. Recommended automated probes per domain: `?ical=1`, `/feed`, `/feed/`, `.ics`, `?feed=events`, and `<script type="application/ld+json">` (many WordPress/Drupal venue sites embed `schema.org/Event` data even without an advertised feed — this is the highest-yield extraction path).

### Scene newsletters (name, city, subscribe URL)
- **Tanzfabrik Berlin newsletter** — Berlin — `https://www.tanzfabrik-berlin.de/en/` (footer signup).
- **Digital in Berlin** — Berlin — `https://www.digitalinberlin.de/` (experimental/sound recommendations).
- **field notes** — Berlin — `https://field-notes.berlin` (contemporary-music scene).
- **Kunstenpunt / Flanders Arts Institute** — Brussels — `https://www.kunsten.be/en/` (biweekly).
- **BARN – Brussels Artist Run Network** — Brussels — `https://www.brusselsartistrun.net` (monthly agenda + Telegram group).
- **Levontin 7** — Tel Aviv — `https://www.levontin7.com` (experimental-music mailing list).

## Recommendations
**Stage 1 (build now — highest ROI):** Stand up scrapers for the ~35 **verified** venue/aggregator calendars, starting with the daily aggregators (tanzraumberlin, field-notes, Berlin Bühnen, MuseumsQuartier, NRW Landesbüro Tanz, Tokyo Art Beat, Danse Suisse, CPH Stage, Karnet, IF Barcelona) plus the pilot-city verified venues. Implement JSON-LD extraction first; fall back to DOM scraping. Add ra.co as the experimental-sound backbone for Tbilisi, Seoul, and cross-city coverage.

**Stage 2 (validate & expand):** Convert the **unverified** rows to verified by fetching each page and confirming a live dated calendar and the correct scan URL; demote or drop any that turn out to be homepages-only or defunct. Prioritise the pilot-six unverifieds (Charleroi danse, Beursschouwburg, Les Brigittines, Kelim, Tmuna, Levontin 7, ICK, Bimhuis) and the strongest secondary-city venues (Théâtre de la Ville, Setagaya, Platform-L, CCA Ujazdowski, Cricoteka, MeetFactory, Culturgest neighbours).

**Stage 3 (festivals & long tail):** Register periodic festivals with an escalation rule — idle-crawl until ~8 weeks before the known edition window, then daily. Verify Amsterdam's Dansmakers/Veem House branding/status, and confirm whether ACHT BRÜCKEN continues past 2025.

**Benchmarks that should change the plan:**
- If a site exposes JSON-LD `Event` data or an ICS endpoint on probing → promote it to daily, low-cost crawl and drop headless rendering.
- If a verified calendar is JS-only with no JSON-LD → require headless-browser rendering (higher cost; batch these).
- If ≥3 crawls return no future-dated events for a "rolling" source → reclassify as seasonal/newsletter and reduce frequency.
- For any city where verified sources cover <3 of the five content types → add the city's Instagram/RA fallback and a scene newsletter to the pipeline.

## Caveats
- **Verification is partial.** "Verified" means a live dated calendar was seen (directly or in a page snippet); "unverified" rows have the right domain but need a confirmation fetch before production. Treat unverified URLs as leads, not guarantees, and never crawl a homepage as if it were a calendar.
- **No feeds anywhere** materially raises build cost and fragility — scrapers will break on redesigns; budget for monitoring and repair.
- **Volatile entities:** Centre Pompidou (closed to ~2030, events dispersed), STEIM (closed 2020) and SuperDeluxe (closed 2019) excluded; Oslo Internasjonale Teaterfestival paused 2026; ACHT BRÜCKEN ran 2011–2025 (future uncertain); Kaaitheater's Kaai Studios and several venues undergo periodic renovation. Re-check status quarterly.
- **Festival URLs roll per edition** (Wien Modern, Sonic Acts, Unsound, MODAFE/SPAF/SIDance, Torinodanza, Club to Club, Sónar) — the paths listed are current entry points, not stable per-edition schedule URLs.
- **Language & rendering:** many calendars are native-language-only (DE, FR, HE, CZ, PL, GR, KR, JP) and JS-rendered; plan for multilingual parsing and headless rendering.
- **East-Asian and Tbilisi coverage** leans on aggregators (Tokyo Art Beat, Visit Seoul, YOLO.ge, RA) because individual venue calendars were harder to verify in English; these aggregators are the pragmatic primary sources there.