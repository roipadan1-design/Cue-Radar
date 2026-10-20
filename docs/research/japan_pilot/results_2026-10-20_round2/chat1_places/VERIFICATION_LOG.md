# VERIFICATION_LOG — Round 2, Chat 1 (Institutions)

Checked 20–21 Oct 2026. Every row in `places_new.csv` has an `evidence_url` that was opened. Where a fact came only from a secondary page, the row's `notes` say so.

## Totals after batch 2

| | Round 1 | New (this chat) | Total | Target |
|---|---|---|---|---|
| Tokyo | 25 | 13 (12 active, 1 closed) | 38 | 40 |
| Kyoto | 19 (18 if DANCE BOX is removed) | 7 (6 active, 1 dormant) | 26 (25) | 25 |

Kyoto is at target. Tokyo is 2 rows short.

## Backfills (7 of 7 done)

| source_id | Route found | Notes |
|---|---|---|
| kyo-spacelfan | Festival organiser only (Zaiko page, kyoto-butohfes.com) | No channel of its own found. Formerly "Space Isan"; near JR/Keihan Tofukuji; also used by Monochrome Circus (Feb 2024) and ARTS SEED KYOTO workshops. Weakest backfill. |
| kyo-kyotographie | kyotographie.jp, contact page, Instagram | 2027 edition: **17 Apr–16 May 2027**. |
| kyo-shunjuza | k-pac.org, events page, Instagram | Kyoto University of the Arts theatre (Shunjuza + studio21). |
| tyo-dairakudakan | dairakudakan.com, Facebook | **Correction:** round 1 said no Tokyo dates in the window. "Alter Ego" (Akaji Maro × Éric-Maria Couturier) runs **29 Oct–1 Nov 2026 at Theatre Tram**, with a post-show talk on 30 Oct. |
| tyo-miminoimi | miminoimi.me, Instagram, X, contact page | In-window event: **Food For Ears vol.12, 7 Nov 2026** at Black Bird Eatery. |
| tyo-superdeluxe | super-deluxe.com, contact, Instagram | Nishi-Azabu venue stays **closed**. The organisation continues as "SupernaturalDeluxe" in Kamogawa, Chiba (out of scope). |
| tyo-jazzartsengawa | jazzartsengawa.org, Instagram, X, Peatix | **Correction:** the domain is `.org`, not `.com`. 2026 edition confirmed **5–8 Nov 2026** (Sengawa Theater, POSTO, Sengawa Station Park); free CLUB JAZZ Byobu stage on 7–8 Nov. |

## Scope issue in round 1

**kyo-dancebox (DANCE BOX / ArtTheater dB) is in Kobe.** That breaks the round 2 scope rule. I recommend removing it or marking it out of scope. The Kyoto total above already accounts for this.

## Rows added, with the main source for each

**Batch 1:** tyo-terpsichore (own schedule), tyo-polaris (own schedule), tyo-blackbird (own site + MIMINOIMI page), tyo-stspot (own site), tyo-wwwbeta (RA event page), kyo-galerie16 (own exhibitions page + artscape), kyo-monade (own event post), kyo-delta (own schedule), kyo-galleryparc (own notice dated 2026-08-08).

**Batch 2:** kyo-soto (own schedule), kyo-underthrow (Chiten's site + Kyoto tourism night listing), kyo-terras (artscape + Tokyo Art Beat), tyo-karas (own Apparatus page), tyo-ypam (official newsroom), tyo-pitinn (own site), tyo-tokas (artscape + TOKAS pages), tyo-xyz (Tokyo Art Beat event and venue pages), tyo-morishita (ASEF culture360 call for the 2026 programme), tyo-bonobo (RA event pages), tyo-dsoko (theatre network page; closed).

## Rows that need a human check

- **tyo-polaris:** the site metadata says Minami-Aoyama, but a 2023 listing placed it in Kanda. The address is left blank.
- **tyo-wwwbeta:** the website URL comes from secondary listings and the site itself wasn't loaded. Evidence is the RA page for an event on 20 Jun 2026; I found no in-window night.
- **tyo-bonobo:** the Instagram URL was built from the handle shown on RA flyers. A secondary club guide lists parties on 1 and 14 Oct 2026, but I didn't confirm those on RA or the club's own site.
- **tyo-xyz, tyo-morishita:** neither official site was opened directly; the facts come from Tokyo Art Beat, culture360, AIR_J and TransArtists.
- **kyo-underthrow:** the address isn't on any official page I opened. "Jodoji area" comes from a city-guide article. The May 2026 *Fatzer* listing doesn't name the company, so I assumed Chiten.
- **kyo-delta:** the October calendar shows the Yoshida show into the week of 11–17 Oct, so `last_active_evidence` is set conservatively to 2026-10-11.
- **`last_active_evidence` convention:** following round 1, this is the nearest dated event on the venue's own calendar, which can be a few days in the future.

## Checked and dropped or held

| Candidate | Why |
|---|---|
| VOU/棒 (Kyoto) | Site is live, but the latest dated activity found was Nov 2025, so it is held as pending. |
| Ochiai Soup (Tokyo) | Latest dated event found was Oct 2025 (RA); Songkick shows one undated upcoming show. Held. |
| Kid Ailack Art Hall, Sound Café dzumi | No official page with recent dates found. |
| Bushbash (Koiwa) | Only Songkick listings found; also mostly hardcore/punk. |
| Kyoto University Seibu Kodo | No dated 2026 event found on any official source. |
| Gallery PARC (Kyoto) | Added, but as **dormant**: it stopped holding exhibitions in Jan 2025. |
| d-倉庫 (Tokyo) | Added as **closed** (end of Dec 2021, building demolished). |

## Personal data excluded

Personal mobile numbers (Jazz Art Sengawa producer, Soto's listing, organisers on Terpsichore's schedule) and individual organisers' emails were **not** copied. Contact routes are organisation websites, organisation social accounts, official contact pages and ticketing pages only.

## Still missing

- **Tokyo, 2 more rows.** Best leads: Ochiai Soup (needs a 2026 date), Koenji live houses with noise/improv nights, Za-Koenji, Dance New Air (festival; check for a 2027 edition), Kichijoji Star Pine's Cafe.
- **Lat/lng** is filled only where the venue's own map embed gave coordinates (Black Bird Eatery, ST Spot, KARAS APPARATUS).
