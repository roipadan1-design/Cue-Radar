# VERIFICATION_LOG.md — Round 2, chat 3 (curators), batches 1–2

Date: 2026-10-20. Scope: Kyoto + Tokyo only.

## What this batch contains

| File | Rows | Note |
|---|---|---|
| `curators_backfill.csv` | 25 | all round-1 people, same `curator_id`s; only `website_url` and a suffix on `notes` changed |
| `curators_new.csv` | 9 | Batch 1 (Kyoto): Mitsuhiro Okamoto (KUNST ARZT), Satoshi Ago (THEATRE E9 KYOTO). Batch 2: Tokyo — COBRA, Futoshi Miyagi (XYZcollective); Yuhei Kobayashi, Shogo Shimizu, Yuu Takamizawa (4649). Kyoto — Kosei Sakamoto, Yuko Mori (Monochrome Circus) |
| `places_new.csv` | 3 | `kyo-kunstarzt`, `tyo-xyzcollective`, `tyo-4649` |

**Running total: 9 new people (5 Tokyo, 4 Kyoto) against a target of 35.** The backfill is complete (25 rows). Batch 1 cleared 2 people, batch 2 cleared 7. Reason: most candidate pages I opened carry no date, and the rule "2025–2026 mention or leave out" dropped the rest (see "Checked and not added"). Batch 2 will continue from the candidate list at the end.

## Backfill: how the contact routes were chosen

- Rule applied: no personal emails/phones; own site or own professional Instagram, else the organisation's official page, with `contact = organisation page` appended to `notes`.
- 24 of 25 rows now have a route. All are **organisation pages**, because no round-1 person's own professional site or Instagram was verified in this pass (candidates not checked: chelfitsch.net for Okada, makigami.com for Makigami, kotayamazaki.com for Yamazaki, minanishimura.com for Nishimura). These should be swapped in once opened.
- The URLs are the organisation **home pages** verified live in round 1 (`places.csv`, 2026-10-19), not dedicated contact sub-pages. I could not open the sub-pages in this pass. If the team prefers the contact form URL, these are the ones to look for: kyoto-ex.jp contact (the 2025 press release lists the office as the public PR contact), haps-kyoto.com consultation form, kac.or.jp inquiry page, buoy.or.jp, session-house.net reserve/contact, ongoing.jp, bodyartslabo.com, contactimprov-nn.com, the5thfloor.org, dommune.com, miminoimi.me.
- `borofesta.jp` (Iida, Mogura): official site confirmed today via OTOTOY news (12 Aug 2026) listing "公式ウェブサイト https://borofesta.jp/" and an English page; round 1 had written "borofesta.com". Not opened directly.
- **`tyo-cur-makigami-koichi`: NO CONTACT ROUTE.** The festival site jazzartsengawa.com did not load in round 1 and was not re-tried today; his own site was not verified. The Arts Council Tokyo grant page used as evidence is not a contact page. Team to decide.
- `notes` was changed only by appending `| contact = organisation page` or `| NO CONTACT ROUTE`, as the brief asks; no other field was touched.

## New rows: evidence

- **Mitsuhiro Okamoto** — kunstarzt.com home page opened 2026-10-20: current show text (24 Oct–1 Nov 2026) signed "KUNST ARZT 岡本光博"; "ボイス美術" booklet (Mar 2026) credited "岡本光博キュレーション"; gallery describes itself as "artist run". Earlier curated shows confirmed on nact.jp (VvK36 "Minimal Bijyutsu", Dec 2023) and Bijutsu Techo (2020). Contact route = gallery site (the gallery Instagram is an organisation account, so left out of `instagram_url`).
- **Satoshi Ago** — Natalie article syndicated on Pia (published 2026-03-09) names him 芸術監督 at the 2026 programme press conference and quotes his statement on finances and the cancelled succession (Taiki Murakami). Title and Arts Seed Kyoto role confirmed by publisher bios (Kinokuniya, hanmoto). Score 4 inherited from `kyo-theatre-e9`.

## Batch 2: evidence

- **COBRA, Futoshi Miyagi** — xyzcollective.jp/about (© 2026): "The directors of XYZcollective are COBRA and Futoshi". Home page shows the 2026 programme (Yui Usui, 8 Aug–13 Sep 2026) and a 2026 archive. Full name for 'Futoshi' from Bijutsu Techo. Soshiro Matsubara (director in 2011–2019 sources) is not on the current page → not added.
- **Yuhei Kobayashi, Shogo Shimizu, Yuu Takamizawa** — easteast.org 2025 exhibitor page carries the gallery's own text naming the three founders and listing 2025 activity (Supper Club Hong Kong). Director title also on tokyoartnavi (interview) and NADA profiles. **Gallery site 4-6-4-9.jp was not opened** — the URL comes from the NADA profile; open it before import.
- **Kosei Sakamoto, Yuko Mori** — artscape listing (2026) for the Feb 2026 show: "主宰、坂本公成+森裕子", 総合演出 Sakamoto, 演出助手 Mori. KIDWF 30th edition 2026 confirmed on artscape's KAC tag page; the KIDWF credit line naming Sakamoto was not opened — his `about` says he co-directs it, based on places.csv; soften if the team wants a stricter reading.

## Checked and not added (this pass)

| Person / org | Why not (yet) |
|---|---|
| Toshio Mizohata (溝端俊夫), NPO Dance Archive Network, Tokyo — representative director; TOKYO REAL UNDERGROUND producer | Role confirmed on dance-archive.net/en/about, but the English site's newest dated item is 2022 and no 2025–2026 mention was found in two searches. Hold; check the JP site/news before adding. |
| Dai Matsuoka (松岡大), LAND FES director, Tokyo — on the DAN board | LAND FES role confirmed only in a 2019 Bijutsu Techo article and undated Arts Council pages; no 2025–2026 edition found yet. Hold. |
| Takao Kawaguchi (川口隆夫), artistic director TOKYO REAL UNDERGROUND | Festival was 2021; no later edition found. Not a current programming role as far as I can see. |
| Hiroko & Tatsuhiko Murata (村田弘子・達彦), Youkobo Art Space, Tokyo — co-representatives | 2023 annual report names them; TAB lists the venue as 休館 (closed/on hiatus). Status unclear, same as the blank status on `tyo-youkobo` in round 1. Hold. |
| Yoshitaka Yazu (矢津吉隆), kumagusuku, Kyoto | Art hostel closed 2020; space reopened as a small complex. Current programming role not verified. Hold. |
| Ftarri (Tokyo) owner | The official schedule page names no proprietor; concert "organisers" listed are the performing musicians themselves. No official page names a booker → not added. |
| Yota Kageyama (蔭山陽太), THEATRE E9 KYOTO general manager (支配人) | Named in the same Mar 2026 article as Ago. Role is management rather than programming; team to decide whether to add as `Programmer`. |
| Taiki Murakami (村上太基) | Was announced (Apr 2024) as next E9 artistic director; per the Mar 2026 article the appointment is "completely blank" and he has moved to Kanto. Do not add. |
| Image Forum Festival (Tokyo, film) | No 2026 director credit surfaced in search; need to open imageforum.co.jp directly. |
| Masato Seto (瀬戸正人), Place M, Shinjuku — photographer-run gallery, 'Night Photo School' | Role solid (artscape, TAB, Bijutsu Techo) but every source found is 2017–2022; placem.com not opened. Hold pending a 2025–26 page. |
| Yoko Higashino / Toshio Kajiwara, ANTIBODIES Collective, Kyoto | Founders of the collective; latest dated item found is Jan 2024 (E9 solo). Hold. |
| VOU / 棒 (Kyoto artist-run shop-gallery) | Active (Villa Kujoyama show Dec 2025) but no official page names a director. Not added. |
| Komagome SOKO (Tokyo) | Space active, but no official page names who programmes it. Not added. |

## Still missing after batch 1

- New rows: 19 Tokyo + 7 Kyoto remain.
- Discipline broadening so far: visual_art 7 (incl. photography/film tags on 2), dance 2, theatre 1. Still missing entirely: music club bookers/DIY promoters, sound/noise/ambient series, residency directors, film.
- Own-site/Instagram routes for the 25 round-1 people (currently all organisation pages).
- Makigami contact route.

## Batch 2 candidate list (not yet verified — do not import)

Tokyo: Art Center Ongoing staff beyond Ogawa; mumei (Fuyumi Murata), LAVENDER OPENER CHAIR, im labor, Fig. (artist-run spaces named in the Artist Running Festival list); HAGISO (Mitsuyoshi Miyazaki); Tokyo Arts and Space residency programme (institution, score 3); Totem Pole Photo Gallery and Place M (photography, artist-run); Image Forum Festival (film); Ochiai Soup, Bar Isshee, Permian, Velvet Sun, Forestlimit bookers (music); Nanahari; Dance New Air; Dance Archive Network (pending 2025–26 evidence). Kyoto: Soda (Kazuto Tanaka, artist-run); UrBANGUILD owner/booker; KYOTOGRAPHIE / KG+ (Lucille Reyboz, Yusuke Nakanishi — score 3); Social Kitchen / Hanare; VOU; Lumen gallery (film/video); Live House nano (Mogura's venue, needs a places row).
