# Cue Radar — Source Aggregator Research (dancingopportunities.com and beyond)

Written 2026-09-16. Scope: (1) what dancingopportunities.com actually is and where its content comes from, (2) other major aggregators/directories across dance, performance art, experimental sound/live electronics and interdisciplinary work, and (3) a consolidated list of real, individually-verifiable institutions surfaced through that research, as candidates for `data/seed/sources.csv` / the sheet's `sources` tab.

**This does not duplicate `docs/RESEARCH_market_scan.md`.** That file already covers Res Artis, TransArtists, On the Move, e-flux, ArtConnect, CaFÉ, Submittable, ArtsHub, Aerowaves, Life Long Burning, dancEUA and DanceAuditionss as *products/competitors*. This file picks up where that one stops: it goes one layer deeper into the **underlying institutions** those (and new) aggregators actually draw from, because that's what feeds the sources sheet, not the competitive analysis.

**Method note:** dancingopportunities.com was visited directly (live browser session, 2026-09-16) — home page, About, Submit, and the client-logo image were all inspected first-hand. Other aggregators were checked via live web search and page fetches on the same date. Every institution listed in Part 3 was seen by name on a real page (EDN's member directory, Aerowaves' partner page, or DO's own client-logo wall) — none are inferred from a category or guessed. Where a claim came from an AI-summarized page fetch rather than something I read directly in the browser, that's noted so the confidence level is clear.

---

## Part 1 — dancingopportunities.com: what it actually is

**Not a scraper/aggregator in the technical sense — it's a submission-based editorial board.** Key facts, all confirmed on the live site:

- **Founded 2012 by Mihaela Griveva**, a dancer/choreographer, as "a central resource aimed specifically at contemporary dance artists." She is still the named editor. ([About](https://dancingopportunities.com/about/))
- **Content arrives via a public "Submit" form**, not via crawling other sites. The Submit page states: *"Dancing Opportunities helps dancers find dance jobs, residencies, apprenticeships, programmes, workshops, open calls and intensives worldwide. With over 80,000 visits per month..."* and separates submissions into "paid opportunities" (workshops/intensives/courses that charge participants) vs. "free opportunities." ([Submit](https://dancingopportunities.com/submit/))
- **Testimonials confirm the submission model is real, not decorative.** Quoted on the Submit page: Hope Vancleaf, Communications Assistant at **Princeton University's Lewis Center for the Arts** ("For the past 4 years DO has served our needs to get the Lewis Center's Fellowship application notices out..."); Luis Remelli, Program Coordinator at **Art Factory International**; and choreographer Nina Wijnmaalen describing getting "so many emails in a few hours" after posting. This is institutions self-posting for reach, not DO going out and finding them.
- **Content taxonomy**: Auditions, Open Calls, Workshops, Dance Programs, Screendance, Festivals, Dance Jobs, Residencies, Internships/Apprenticeships, Funding/Scholarships, Featured Videos — a WordPress category structure, browsable and searchable, no deadline-chip UX, no per-user matching, no profile/save layer.
- **It does disclose its client base**, unusually: the About page has a "Organisations that use our services" logo wall. I fetched the actual image file (`DO_Clients-logos.png`) directly and read the logos. Real, identifiable institutions shown: **Princeton University** (Lewis Center for the Arts), **Joffrey Ballet School**, **DV8 Physical Theatre** (Lloyd Newson, UK), **P.A.R.T.S.** (Anne Teresa De Keersmaeker's school, Brussels), **East London Dance (ELD)**, **The Place** (London), **Rambert** (UK), **TripSpace Projects** (London), **Nationale Reisopera** (Netherlands), **Middlesex University London**, **Pilobolus** (US), **Béjart Ballet Lausanne** (Switzerland), **National Dance Company Wales**, **Orchestre Philharmonique du Luxembourg**, **Greenwich Dance Agency (gDA)**, **Theater Regensburg** (Germany), **Ballet Junior de Genève (BJG)**, **Henny Jurriëns Studio** (Netherlands), **Art Factory International**, **University of Chichester**, **Gaga** (Ohad Naharin's movement language, associated with Batsheva Dance Company, Israel), **Royal Swedish Opera / Operan** (Stockholm), **Siobhan Davies Dance** (London), **Kibbutz Contemporary Dance Company** (Rami Be'er, Israel), and **Staatstheater Kassel** (Germany).
- **No visual-arts-default bias, unlike most of the aggregators in the earlier market scan.** DO is dance-native by design — that's the whole point of the site. But it has **no discipline breadth beyond dance/screendance**; performance art and experimental sound aren't covered.
- **80,000 visits/month is self-reported**, not independently verified — flagged, not treated as fact.

**Bottom line for the owner:** dancingopportunities.com is essentially what Cue Radar's sync pipeline would look like if it had no verification step — a trust-the-submitter classifieds board that real, well-known European dance institutions already use to get the word out. That's useful two ways: (1) its client-logo wall is itself a small, real, verifiable seed list (used in Part 3 below), and (2) it's evidence that the institutions Cue Radar wants to track *already* value this kind of channel enough to submit to a small independent site — a reachability signal, not just a competitor.

---

## Part 2 — Other major aggregators found (beyond the existing market scan)

| Aggregator | What it is | Source-list transparency | New institutions surfaced |
|---|---|---|---|
| **European Dancehouse Network (EDN)** ([old.ednetwork.eu/members](https://old.ednetwork.eu/members)) | An EU-funded network of **54 contemporary-dance development organisations in 28 European countries** — dance houses, national choreographic centres, production houses. Not an open-call feed itself, but each member independently runs open calls, residencies and auditions, and EDN's own site publishes cross-network opportunities. This is by far the highest-value find of this research: it is a **membership directory with a full public list**, one country filter and individual member profile pages, all real, all checkable. | Full — I read the member directory directly (55+ organisations with city/country, each linking to a profile page). | ~50 new institutions, see Part 3. |
| **Aerowaves** ([aerowaves.org/about-us/partners](https://aerowaves.org/about-us/partners/)) — already covered as a *program* in the market scan, but its **Partners page** (not analyzed there) lists the full network: **46 partner/member organisations across 34 countries** that host the annual "Aerowaves Twenty" touring program and feed the annual open call. | Full partner list with cities. Retrieved via a page fetch (AI-summarized extraction of the live partners page, not manually re-verified line-by-line — flagged as **secondary-confidence**, spot-check a few before bulk-adding). | ~25 institutions not already in EDN's list, see Part 3. |
| **Contemporary Performance Network** ([contemporaryperformance.com](https://contemporaryperformance.com/category/opportunities/open-calls/)) | A curated open-call/residency/grant hub specifically for **performance art** (broader than dance) — exactly the discipline gap the earlier market scan flagged as unclaimed. Subscription/Patreon-supported; ownership/governance not disclosed on the page. | Credits individual listings to their source org but doesn't publish its own "who we work with" list. Institutions seen in current listings (fetched via page summary, **secondary-confidence**): Athens Epidaurus Festival, CTM Festival (already a Cue Radar source), K3 Choreography Residency, Tanztage Berlin, Villa Medici (Rome), Baryshnikov Arts Center (NYC, out of Cue Radar's market scope). | A few EU-relevant leads; mostly reinforces institutions already known or out-of-region. Worth periodic monitoring, not a bulk source of new names. |
| **ArtRabbit** ([artrabbit.com/artist-opportunities](https://www.artrabbit.com/artist-opportunities)) | International open-call directory, visual-art-first but explicitly includes "Performance (dance, theatre, circus)"; ~57 live listings, weekly email reaching a self-reported 23,500 practitioners. | Credits source institutions per listing (fetched via page summary, **secondary-confidence**). Real institutions visible: Sadler's Wells (Rose Choreographic School), Ars Electronica (sound/media-art relevant), Royal Academy of Arts. | Reinforces Sadler's Wells (already surfaced via EDN) and adds Ars Electronica as an experimental-sound/media-art lead worth checking directly in a follow-up pass. |
| **netEX — calls & deadlines** ([netex.nmartproject.net](https://netex.nmartproject.net/?cat=5)), hosted by the New Museum of Networked Art | A small, apparently low-activity sound-art/net-art calls listing. Confirms the market scan's finding that **experimental sound has no large dedicated aggregator** — this is the closest thing found and it's niche/low-scale, not comparable to EDN or Res Artis in reach. | Sparse; institutions mentioned in past calls include Sonica Glasgow and MA/IN Festival (Matera, Italy) — both real but not independently re-verified beyond the page fetch. **Not recommended as a bulk source**; flagged as a lead only. |
| **On the Move network** ([on-the-move.org](https://on-the-move.org/)) | Already covered as a product in the market scan. Its current membership page (75+ organisations across 25+ countries) exists but did not render a full current list on the page fetched — only 2007 founding members were extractable. **Needs a direct follow-up visit** to `on-the-move.org/network/members` to pull the current list; not done in this pass due to time, flagged as an open item. | Partial/outdated only. | None added from this source this round — see Open Questions. |

**Confirmed finding, consistent with the existing market scan:** experimental sound / live electronics / installation art has **no dance-scale aggregator**. The two sound-specific hubs found (netEX, and US-focused Artist Communities Alliance / Sound and Music UK from earlier searches) are small, national, or niche. For this discipline, Cue Radar's existing strategy of adding individual institutions directly (Q-O2, IRCAM, CTM Festival, NOTAM, EMS Elektronmusikstudion — all already in `sources.csv`) remains the only real path; there is no directory to harvest in bulk the way EDN/Aerowaves work for dance.

---

## Part 3 — Consolidated new source candidates

**Cross-reference note:** I compared every name below against the current `data/seed/sources.csv` (58 rows). Institutions already present (CND/Centre National de la Danse, Dansehallerne, Dansens Hus Oslo, Dansens Hus Stockholm, Dansmakers/ICK Dans Amsterdam, Lavanderia a Vapore, Mercat de les Flors, Tanzquartier Wien) are **excluded** from the table below — their reappearance in both EDN's and Aerowaves' independent lists is a good cross-verification signal that the existing 58 are well-chosen, but they aren't "new." Everything below is not in the current seed file. **This is a candidates list only — per `AGENTS.md` rule 5, none of this has been written to `sources.csv` or any Supabase table.** Each row still needs a human to open the institution's real site, confirm it's active, and find/confirm the direct opencalls URL before it goes into the sheet.

Website URLs are only included where I directly saw or confidently know the institution's own domain. Where I didn't independently verify the direct URL, I've pointed to the network profile page I actually visited instead of guessing — do not paste a guessed URL into the sheet.

### From EDN member directory (verified by direct browse of old.ednetwork.eu/members) — high confidence, real network, but discipline is dance-only

| Name | City / Market fit | Notes |
|---|---|---|
| P.A.R.T.S. | Brussels — **direct Cue Radar market** | Anne Teresa De Keersmaeker's school; also on DO's client wall and Aerowaves' partner list (triple cross-verified). Likely website: parts.be — confirm before adding. |
| Tanzhaus Zürich | Zürich — **direct Cue Radar market** | Production/residency house. |
| Krakow Choreographic Centre (Nowohuckie Centrum Kultury) | Krakow — **direct Cue Radar market** | |
| Tanec Praha / PONEC dance venue | Prague — **direct Cue Radar market** | |
| Maison de la danse | Lyon — **direct Cue Radar market** | |
| Duncan Dance Research Center (DDRC) | Athens (Vyronas) — **direct Cue Radar market** | |
| Royal Swedish Opera / Operan | Stockholm — **direct Cue Radar market** | Also on DO's client wall. Opera house with dance programming, not dance-only — verify discipline fit. |
| Condeduque (Centro de Cultura Contemporánea) | Madrid — near Barcelona market, new Spanish city | |
| Tanzhaus nrw | Düsseldorf — near Cologne market, new German city | |
| HELLERAU (European Centre for the Arts) | Dresden — new German city | |
| K3 Zentrum für Choreographie / Kampnagel | Hamburg — new German city | |
| Theater an der Parkaue | Berlin — **direct Cue Radar market** | Children/youth-theatre focused — verify discipline/audience fit before adding. |
| STUK (House for Dance, Image and Sound) | Leuven, Belgium — near Brussels market | |
| VierNulVier (404) | Ghent, Belgium | |
| Korzo theater | Den Haag, Netherlands — near Amsterdam market | |
| DansBrabant | Tilburg, Netherlands | |
| Dansateliers | Rotterdam, Netherlands | |
| TROIS C-L (Maison pour la danse) | Luxembourg City | |
| Dampfzentrale Bern | Bern, Switzerland — near Zurich market | |
| Pavillon ADC (Association pour la Danse Contemporaine) | Genève, Switzerland | |
| Agora, Cité Internationale de la Danse | Montpellier, France | |
| KLAP (Maison pour la Danse) | Marseille, France | |
| Le Gymnase CDCN | Roubaix, France | |
| La Briqueterie (CDCN Val-de-Marne) | Vitry-sur-Seine, France — near Paris market | |
| HIPP – Croatian Institute for Movement and Dance | Zagreb, Croatia | |
| Croatian Cultural Centre Rijeka (HKD) | Rijeka, Croatia | |
| Station – Service for Contemporary Dance | Beograd, Serbia | |
| AREAL – Space for choreographic development | Bucharest, Romania | |
| Centro per la Scena Contemporanea (CSC) | Bassano del Grappa, Italy — near Turin market | |
| Oriente Occidente | Rovereto, Italy | |
| Lokomotiva | Skopje, North Macedonia | |
| Kino Šiška (Centre for Urban Culture) | Ljubljana, Slovenia | |
| Dance Gate Lefkosia / Dancehouse Lefkosia | Lefkosia, Cyprus | |
| Dance House Lemesos | Limassol, Cyprus | |
| Derida Dance Center | Sofia, Bulgaria | Also on Aerowaves partner list — cross-verified. |
| SÍN Arts Centre | Budapest, Hungary | |
| Trafó (House of Contemporary Arts) | Budapest, Hungary | |
| PLAST (Platform For Contemporary Dance) | Bratislava, Slovakia | |
| Divadlo Štúdio tanca | Banská Bystrica, Slovakia | |
| Lithuanian Dance Information Centre | Vilnius, Lithuania | |
| Tanssin Talo | Helsinki, Finland | |
| DeVIR \| CAPa | Faro, Portugal | |
| O Espaço do Tempo | Montemor-o-Novo, Portugal | Near Lisbon market. |
| Dance Ireland | Dublin, Ireland | Outside the current 22-market list — flag for owner if Ireland is in scope. |
| Dance Limerick | Limerick, Ireland | Same flag. |
| Sadler's Wells | London, UK | Also on DO's client wall and ArtRabbit — triple cross-verified. UK outside current market list — flag for owner. |
| The Place | London, UK | Also on DO's client wall — cross-verified. Same UK flag. |
| Dance Base | Edinburgh, UK | Same UK flag. |
| Dance City | Newcastle Upon Tyne, UK | Same UK flag. |
| DanceEast (Jerwood DanceHouse) | Ipswich, UK | Same UK flag. |

### From Aerowaves partner network (fetched via page summary — spot-check before bulk use) — not already in the EDN list above

| Name | City / Market fit | Notes |
|---|---|---|
| Albania Dance Meeting Festival | Tirana, Albania | New country for Cue Radar. |
| D.ID Dance Identity | Eisenstadt, Austria | Near Vienna market. |
| Mediterranean Dance Centre | Zagreb, Croatia | |
| Sõltumatu Tantsu Lava (STL) | Tallinn, Estonia | New country. |
| Latvian Dance Information Center | Riga, Latvia | New country. |
| La Place de la Danse | Toulouse, France | |
| Hessisches Staatsballett | Darmstadt, Germany | |
| Arc for Dance | Athens, Greece — **direct Cue Radar market** | |
| Reykjavík Dance Festival | Reykjavík, Iceland | New country. |
| Firkin Crane | Cork, Ireland | |
| Art Stations Foundation | Poznań, Poland — near Warsaw market | |
| Lubelski Teatr Tanca | Lublin, Poland | |
| Centro Cultural Vila Flor | Guimarães, Portugal | |
| SKCNS | Novi Sad, Serbia | |
| Bratislava in Movement Association | Bratislava, Slovakia | |
| EN-KNAP Productions | Ljubljana, Slovenia | |
| Paso a 2 Plataforma Coreográfica | Madrid, Spain | |
| Rum för Dans | Region Halland, Sweden | |
| Zelyonka Contemporary Dance Festival | Kyiv, Ukraine | New country. |
| Annantalo | Helsinki, Finland | |
| Workshop Foundation | Budapest, Hungary | |
| Operaestate Festival | Bassano del Grappa, Italy | |
| Fondazione Romaeuropa | Rome, Italy | |
| Théâtre Sévelin 36 | Lausanne, Switzerland — near Zurich market | |
| Istanbul Fringe Festival | Istanbul, Turkey | New country/market to consider. |
| National Centre for Dance | Bucharest, Romania | Distinct org from AREAL, same city — verify not a duplicate before adding both. |

### From dancingopportunities.com's client-logo wall (verified by direct image inspection) — not already covered above

| Name | City / Market fit | Notes |
|---|---|---|
| DV8 Physical Theatre (Lloyd Newson) | UK | Physical-theatre / interdisciplinary — good discipline fit for Cue Radar even though UK is outside the 22-market list. |
| East London Dance (ELD) | London, UK | |
| Rambert | London, UK | |
| TripSpace Projects | London, UK | |
| Nationale Reisopera | Netherlands (touring) | Opera touring company — verify discipline fit (music/interdisciplinary, not pure dance). |
| Middlesex University London | UK | |
| Béjart Ballet Lausanne | Lausanne, Switzerland — near Zurich market | |
| National Dance Company Wales | Wales, UK | |
| Orchestre Philharmonique du Luxembourg | Luxembourg | Music, not dance — verify discipline fit; could be interdisciplinary/sound adjacent. |
| Greenwich Dance Agency (gDA) | London, UK | |
| Theater Regensburg | Regensburg, Germany | |
| Ballet Junior de Genève (BJG) | Genève, Switzerland | |
| Henny Jurriëns Studio | Netherlands | |
| University of Chichester | UK | Academic — verify it posts real open calls vs. only student programs. |
| Gaga / Batsheva-adjacent | Israel — **direct Cue Radar market (tel_aviv)** | "Gaga" is Ohad Naharin's movement language, closely associated with Batsheva Dance Company; verify the actual organisational entity and URL before adding — do not conflate with Batsheva itself without confirming. |
| Kibbutz Contemporary Dance Company (Rami Be'er) | Kibbutz Ga'aton, Israel | Near but not literally in Tel Aviv — verify market tagging (could be its own market or tagged to the nearest hub). |
| Staatstheater Kassel | Kassel, Germany | |
| Art Factory International | Location unconfirmed from the page — needs a direct site visit before adding. | |

**Total new, named, individually-verifiable candidates: roughly 85–90** (the exact count depends on how the UK/Ireland/new-country entries are handled — see Open Questions). This is on top of the current 58-row seed and the project's reported ~314 live `sources` rows in Supabase, which I don't have access to and could not cross-check row-by-row — **the owner or sync pipeline must diff this list against the actual `sources` table before importing anything**, not just against the 58-row CSV seed I could read.

---

## Open Questions / things I could not verify in this pass

1. **UK and Ireland are not in the 22-market list in `HANDOFF_V3.md`**, but they showed up repeatedly and prominently across EDN, Aerowaves and DO (Sadler's Wells, The Place, Rambert, Dance Ireland, etc.) — real, high-quality dance institutions. Worth a product decision: is UK/Ireland in scope for a future market expansion, or intentionally excluded? I did not decide this myself.
2. **On the Move's current full member list** (75+ orgs, 25+ countries) did not render fully in the page fetch I ran — only 2007 founding members came through. A direct follow-up browse of `on-the-move.org/network/members` would likely surface another batch of real institutions; not completed here due to time.
3. **Res Artis's full member directory** is large (700+ members, 85+ countries) but is visual-art-weighted per the existing market scan, and I was not able to pull a clean Europe-filtered list from search alone — would need a direct browse of `resartis.org`'s member search with country filters, which I did not do (would likely yield mostly redundant residency-only listings, lower priority than EDN/Aerowaves which are dance-native).
4. **Aerowaves and ArtRabbit institution lists came from AI-summarized page fetches**, not a manual read of the live accessibility tree the way EDN and DO were verified. They're internally consistent and the names are real, well-known institutions (spot-checkable), but flagged as secondary-confidence — worth a quick manual spot-check of a handful of entries before bulk import.
5. **No experimental-sound/live-electronics-specific aggregator of any real scale was found**, confirming the existing market scan's conclusion. If the owner wants to grow that discipline's source count, it will likely have to be done institution-by-institution (festival/venue websites), not via a directory harvest.
6. **DO's own opencalls page structure** (category URLs like `/category/open-calls/`, `/category/residencies/`) could itself be monitored periodically as a low-maintenance secondary discovery channel, given it's dance-native and institutions actively submit to it — this is a suggestion, not something implemented here.

---

## Sources

- Dancing Opportunities: [Home](https://dancingopportunities.com/), [About](https://dancingopportunities.com/about/), [Submit](https://dancingopportunities.com/submit/), client-logo image directly inspected at `https://dancingopportunities.com/wp-content/uploads/2012/05/DO_Clients-logos.png`
- European Dancehouse Network: [Members directory](https://old.ednetwork.eu/members) (directly browsed, full list read from the live accessibility tree)
- Aerowaves: [Partners](https://aerowaves.org/about-us/partners/) (page-fetch extraction, secondary-confidence)
- Contemporary Performance Network: [Open Calls](https://contemporaryperformance.com/category/opportunities/open-calls/) (page-fetch extraction, secondary-confidence)
- ArtRabbit: [Artist Opportunities](https://www.artrabbit.com/artist-opportunities) (page-fetch extraction, secondary-confidence)
- netEX: [Sonic art calls](https://netex.nmartproject.net/?cat=5) (page-fetch extraction, secondary-confidence; flagged low-scale)
- On the Move: [Network](https://on-the-move.org/) (partial extraction only, follow-up needed)
- Existing project context: `docs/HANDOFF_V3.md` (schema, 22-market list, sources-sheet spec), `docs/RESEARCH_market_scan.md` (prior competitive research, not duplicated here), `data/seed/sources.csv` (58-row current seed, cross-referenced against)
