# Naming options — proposal, not a decision

**DECIDED: Fellow.** (2026-09-17, see round two below.)

Written by the Creative Director role, 2026-09-17. This is a **proposal document only**. Nothing here has been implemented — `lib/brand.ts`, `app/radar/*`, nav labels, and all live copy stay exactly as they are until the owner picks an option and a task is written to carry it out.

Grounded in `docs/VISION.md` (three pillars: verified opportunities feed / Trip Radar / artist profile — "Career OS" for touring performing artists) and `docs/HANDOFF_V3.md` Part C. Register per the Task 02 design-decisions table in `docs/ROADMAP.md`: **museum wall label — precise, quiet, curated.** No cute wordplay, no forced portmanteaus, no "-ly" startup suffixes, sentence case, no exclamation marks, no emoji, no invented claims.

Every collision check below is a real search performed for this document (see reasoning per name), not a guess. "Collision" means an existing, findable product/trademark using the same or a confusingly similar name — flagged honestly even where it argues against a name I otherwise like.

---

## 1. New name options for the whole app (currently "Cue Radar")

### Ranked list

**1. Rider** — top pick.
One word that already means three things this product actually does, without inventing any of them: a **technical rider** is the literal performing-arts document listing what an act needs to perform (`docs/VISION.md` Pillar 1 names "technical rider requirements" as a real future field on `opportunities` — this word is already latent in the product's own vocabulary, not imported from outside it); a **tour rider** is industry shorthand for a touring act's requirements city to city, which is exactly Trip Radar's territory; and a **rider** is simply someone who travels between places for work, which is the artist this whole product is built for ("a Career OS... for artists who work between places" — current landing copy). It reads as one quiet, precise noun in the same register as "Cue" (a stage term repurposed as a brand word) rather than a coined word.
*Collision check:* searched "Rider app name existing product trademark." No active, confusingly-similar product found in this space. The only related US trademark hits were "RIDE APP" (filed 2019, abandoned/lapsed) and "RIDERS" (2023, food-delivery software) — different category, different mark, no live conflict. Clear.

**2. Ensemble.**
The word performing artists already use for the group they work within (a dance ensemble, a music ensemble), and also means "a number of things viewed as a whole" — apt for a product that bundles a feed, a city surface and a profile into one place, which is exactly the gap `docs/VISION.md`'s "why now" section describes. Quiet, precise, on-vocabulary for the actual audience.
*Collision check:* searched "Ensemble app product name company platform." Crowded name — an enterprise AI-agent platform, a co-parenting expense app, a "social music" iOS app, and a long-running IT consulting firm all currently use it. None compete in performing-arts opportunities/discovery, but the word is generically overused in tech naming right now, which weakens distinctiveness. Usable, not clean.

**3. Season.**
An artistic season is real institutional vocabulary (a theatre's or company's season of programming) and doubles as "a period when something is active," which fits a deadline-driven feed. Quiet, industry-native, no wordplay.
*Collision check:* searched "Season app platform product name existing." Real collision risk: **Season Health**, a well-funded, actively marketed food-as-medicine health app, currently uses "Season" as a standalone brand name in the US app stores — closer to a direct naming collision than the others on this list, even though the category differs. Flagging this as the reason it ranks third, not higher.

**4. Cue** (drop "Radar," keep half the current name).
Lowest-risk, lowest-effort option: it keeps brand equity already spent (the mark `間` and the wordmark pattern in `lib/brand.ts`, `components/brand/`), and "cue" (a performer's signal to act) already reads as "know what's open, before it closes" — the current landing headline. Worth listing precisely because it requires the least rework, not because it's the most original.
*Collision check:* "Cue" alone is a heavily-used word in tech (Cue Health — a large, well-known diagnostics company; Cue, a personal-assistant app Google acquired in 2013). Neither is a performing-arts competitor, so there's no confusion risk with the actual audience, but the bare word "Cue" would be hard to own in search/trademark terms if this ever mattered commercially. Flagging honestly rather than pretending it's clean.

### Why Rider is the top pick, one paragraph
It is the only option that is simultaneously (a) real industry vocabulary already implicit in the product's own future schema, not an outside metaphor; (b) a literal fit for all three pillars at once — the document, the travel, the person; (c) free of any real naming collision in this space; and (d) one plain word, which matches the quiet, unadorned register the whole product already committed to in Task 02.

---

## 2. New name options for the "Radar" feature (the city/date "what's on where you are" page)

The owner's complaint, exactly as given: "the name of Radar isn't related [to what the page does], need a name that connects to the essence of the page." The page (`app/radar/[city]/page.tsx`, spec in `docs/HANDOFF_V3.md` Part E and `docs/tasks/TASK_06_pilot_readiness.md` §7.2) shows an artist, for a chosen city and date range: opportunities closing while they're there, workshops/classes, and performances/exhibitions — the "what's on, and what's closing, while I'm physically in this city" surface. "Radar" is generic scanning/tech imagery; it says nothing about *being somewhere*.

### Ranked list

**1. Circuit** — top pick.
"The circuit" is what touring performers actually call the city-to-city path of festivals, venues and scenes they move through — it's the working artist's own word for exactly this page's subject, not a metaphor imported from tech. It reconnects the feature directly to "what's happening in the city I'm currently in" because being on the circuit *means* being where the activity is. One word, quiet, no wordplay — same register as "Rider" above.
*Collision check:* searched "Circuit app name trademark route delivery." There was a well-known "Circuit Route Planner" delivery-driver app (10M+ downloads) — but it rebranded to "Spoke" in late 2025, and even before that it was a logistics/route-optimization tool, a different category with no realistic user confusion against a performing-arts city discovery page. No live conflict in this space.

**2. Currently.**
Ties directly to the actual database fields already in the schema — `current_city`, `current_city_from`, `current_city_until` (`docs/HANDOFF_V3.md` Part D) — so the name would describe the underlying fact with no invention at all: "Currently: Berlin." Precise in the most literal possible sense.
*Collision check:* no active major product found under this exact name in any adjacent category; a discontinued Yahoo weather feature ("Yahoo Currently") turned up historically, not a live conflict. The risk with this option is not collision but tone — standing alone in a four-item nav bar it could read as a status widget rather than a discovery feature; would need to be tested with the actual nav copy before adopting.

**3. Ground** (short for "on the ground").
"On the ground" is an established idiom for being physically present somewhere, which is precisely the missing ingredient in "Radar." Shortened to one word for the nav, it stays in the same plain-noun register as the others.
*Collision check:* searched broadly for "Ground" as a product name; **Ground News**, a media/news-bias aggregator, is a real and reasonably well-known product under this exact single word. Different category (news vs. performing-arts discovery), so low confusion risk with this specific audience, but flagged because it is a live, named product, not a hypothetical.

**4. Landed.**
Evokes the moment of arriving somewhere new — "you've landed in Berlin, here's what's on" — which reads well as an onboarding line even if used only as copy rather than the nav label itself.
*Collision check:* **Landed, Inc.** is a real, funded US company (home-down-payment assistance for teachers/essential workers) using this exact name. Different sector, so no direct competitive confusion, but it is a named, live brand — ranked lowest for that reason, and because "arrival" describes only the start of a stay, not the ongoing "what's on while I'm here" the page actually covers.

*Rejected outright, not ranked:* **"In Town"** was considered and dropped before ranking — "InTown Suites" is a registered, actively-used US hotel-chain trademark (extended-stay hotels), a strong enough collision to exclude rather than merely flag.

### Why Circuit is the top pick, one paragraph
It's the only option that is the artist's own working vocabulary for this exact situation (moving between cities, catching what's on), which means it does real explanatory work the word "Radar" never did — it doesn't just sound nicer, it tells you what the page is for. It also happens to pair naturally with "Rider" as the whole-app name if the owner adopts both (an artist on tour, checking the circuit), though each recommendation stands on its own and neither depends on the other being adopted.

---

---

## 3. Whole-app name, round two — 2026-09-17

**"Rider" (round one's top pick) is rejected by the owner.** He judged it not good enough and asked for a second round. Do not re-propose "Rider" or close variants of it (e.g. "Rider Co.", "The Rider") in any future round.

**The brief for this round, in the owner's own terms:** a name that connects to two things at once, not mobility-between-cities alone:
1. **Connections between people and opportunities** — artists finding both other artists and the calls/residencies/grants that fit them, in one place.
2. **Exploring new mediums** — the product's discipline scope recently expanded beyond dance/performance/sound to include music, painting and sculpture (`docs/VISION.md` §1, updated framing), so the name should read as open across that range, not narrow to one discipline.

Six options below, as requested, so the owner has real range to react to rather than a single best guess. Register unchanged: museum wall label — precise, quiet, curated. No cute wordplay, no forced portmanteaus, no "-ly"/"-ify" startup suffixes. Every collision check is a real web search performed for this document, reported honestly including where it argues against an option I otherwise like.

### Ranked list

**1. Fellow** — top pick.
The single word that does both jobs in the brief without a stretch: a **fellow** is another person in the same pursuit ("a fellow artist"), which is the connections-between-people half; a **fellowship** is real, cross-medium funding vocabulary — used identically in dance, music, visual art and sculpture grants, unlike "residency" or "tour," which skew performing/visual-specific. It doesn't privilege one discipline over the others the way "Ensemble" (round one) leans toward performing arts, or "Rider" leaned toward touring. One plain word, sentence-case, no wordplay.
*Collision check:* searched "Fellow app product name platform." Three real hits, none in this category: **Fellow.ai** (formerly Fellow.app), an enterprise AI meeting-notes/compliance tool for finance and regulated industries — different audience, different function, no realistic confusion; **Fellow Products**, a coffee-brewing-equipment brand with a companion device app — physical goods, unrelated category; and a newer **"Fellow: Social Community"** iOS app for private friend groups — closer in spirit (connection-focused) but not arts- or opportunity-specific, small/unestablished. None compete for this audience. Flagging honestly rather than claiming it's spotless, but no live conflict in the performing/visual-arts-career space.

**2. Index.**
Reads as museum/archival register on its own (a catalogue's index cross-references entries — people, works, dates) and does real double duty: an index of artists and an index of opportunities, cross-referenced, is close to a literal description of what the Hub + profile layer already do. Medium-agnostic by nature — an index doesn't care what it's indexing, which fits the expanded discipline range cleanly.
*Collision check:* searched "Index app product name platform startup." Crowded: a product-management whiteboard tool (`index.inc`), a B2B analytics tool (`index.app`), a 2017 TechCrunch-launched content-organizing app, and "Index by TNW" (startup/investor matching) all currently use the bare word. All are enterprise/B2B SaaS, none in arts or opportunities discovery, so no direct-audience confusion — but the word is generically overused in tech naming right now, same weakness round one flagged for "Ensemble." Also weaker than "Fellow" in one respect: no artist actually says "check my index" the way they'd say "I got a fellowship" — the fit is conceptual, not vocabulary-native.

**3. Bureau.**
Real industry vocabulary, not imported: an artist's **bureau** (booking bureau, lecture bureau, talent bureau) is literally an organization whose job is connecting people to opportunities — the connections+opportunities half of the brief in the most literal available word. Cross-medium neutral in principle (a bureau can represent any kind of practitioner).
*Collision check:* searched "Bureau app product name platform trademark." One real, relevant hit: **Bureau, Inc.**, which holds a live US trademark filing on "BUREAU" for identity-verification/authentication SDK software (filed 2023) — a different category (fintech/identity infra vs. arts career platform) so low consumer-confusion risk, but a real registered mark using the bare word, which matters if trademark clearance is ever pursued. Ranked third rather than higher also because "bureau" carries a slightly institutional, agency-like connotation (closer to "a service that places you" than "a place you belong"), a small tonal mismatch with the quieter, more editorial register the product has otherwise built.

**4. Practice.**
The word contemporary artists across every one of the six listed disciplines actually use for their body of work regardless of medium — "an interdisciplinary practice spanning sculpture and sound" is real, natural language, not a stretch. Strongest single-word fit for the cross-medium half of the brief.
*Collision check:* searched "Practice app product name platform coaching scheduling." Real, closer-than-comfortable collisions: **Practice Better** (health/wellness-coach client management) and **Practice.do** (a general practice-management/coaching platform, "all the features you need for your practice"). Both are in the "manage your professional practice" software category, which is conceptually adjacent to what Cue Radar could be read as — flagged as a real risk, not just a namespace nuisance, which is why this ranks below Index and Bureau despite the strongest cross-medium fit of the six.

**5. Exchange.**
The most literal dual-fit on paper: an exchange is a place where people and things (here, opportunities) meet each other, and "artist exchange" is genuine, existing arts-sector terminology (cultural-exchange residencies, exchange programs). Medium-agnostic.
*Collision check:* searched "Exchange app product name platform trademark crowded." No single dominant same-category rival, but the word itself is one of the most generic in software (Microsoft Exchange is the first association for most people; stock exchanges are the second) and multiple unrelated "Exchange" marks and platforms exist across finance, IP-trading and logistics. Ranked low not for a specific competitor but because the word reads as infrastructure/finance before it reads as an editorial arts brand — the wrong first association for a museum-label register.

**6. Studio.**
The most universal cross-medium noun available — dancers, painters, sculptors, sound artists and musicians all plainly have "a studio," more so than any other word on this list. Open studios (real arts-world events) also connect people and opportunities in practice. Ranked last purely on distinctiveness, not on conceptual fit.
*Collision check:* searched "Studio app product name trademark crowded existing platforms." Confirmed the obvious: "Studio" is one of the most saturated words in creative-software naming — Adobe alone runs a family of "___ Studio" sub-brands, and it's a standard suffix/prefix for thousands of small creative businesses and apps. Legally and practically very hard to own as a standalone brand; the fit is excellent, the distinctiveness is close to zero.

### Why Fellow is the top pick, one paragraph

It is the only option that ties to both halves of the brief through real, already-in-use language rather than a conceptual stretch: "fellow" names the person-to-person connection directly, and "fellowship" is funding vocabulary that already treats dance, music, painting, sculpture and sound as equals rather than treating one as the default and the others as add-ons — which matters now that the discipline scope has genuinely widened. It also carries the lowest collision risk of the six in the category that matters (no arts-career or opportunities-discovery competitor uses it), and it keeps the one-plain-word register the product has used throughout ("Cue," "Rider," "Ensemble").

## What this document does not do

- Does not touch `lib/brand.ts`, any nav component, `app/radar/*`, or any live copy.
- Does not run a formal USPTO/EUIPO trademark clearance search — the checks above are real web searches for existing products/companies using each name, sufficient to flag obvious conflicts, not a substitute for legal trademark clearance before any commercial commitment to a final name.
- Does not propose a mark/wordmark treatment for any candidate — that's Task 03 (brand identity, still deferred per `docs/ROADMAP.md`) and should only start once a name is chosen.
