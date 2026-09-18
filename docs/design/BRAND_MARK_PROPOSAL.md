# Fellow. — brand mark proposal

Status: proposal only. Nothing in `components/brand/Mark.tsx`, `lib/brand.ts`, or any other file has been changed by this document. The owner picks a concept (or asks for a fourth round); a separate frontend task wires it in, per Task 07 §8.

Written by the Creative Director role, 2026-09-17, in response to Task 07 §8's block on the old `間` mark. Grounded in `docs/design/DESIGN_BRIEF.md` (aesthetic thesis, locked tokens, anti-goals) and `docs/creative/NAMING_OPTIONS.md` (why "Fellow." was picked — the person-to-person meaning, not the touring/circuit meaning that "Rider" or "Circuit" carried).

---

## 1. The problem, stated plainly

`間` ("ma," the Japanese word for the interval/pause between things) was chosen when the product was still "Cue Radar" — it worked as a quiet pun on a stage cue and a gap in time. It has no relationship to "Fellow." at all, and keeping a kanji character as the mark for an English-language brand word invites exactly the "why is there Japanese here" question the owner has already flagged once (see `docs/DECISIONS.md`, "Rebrand" entry). It also isn't a real Japanese *design mark* — it's a dictionary character rendered in a display font, which is a different thing from an owned symbol.

## 2. Constraints this proposal works inside

- Does not touch the wordmark "Fellow." or its trailing period — that stays exactly as `lib/brand.ts` has it.
- Must read cleanly at 20px (nav/footer chrome) through 96px (intro splash, `lg` size in `Mark.tsx`) — the three sizes the component already defines.
- No new colors, gradients, or shadows (`docs/design/DESIGN_BRIEF.md` §3, §6). Default rendering uses `currentColor`, same as the existing `間` glyph does today, so it inherits `--fg` in normal chrome and inverts correctly wherever a dark-on-light or light-on-dark treatment is already used (active nav pill, etc.).
- **A real tension I'm flagging rather than resolving silently:** the design brief's Section 3 rule is "one accent per screen," not "one accent per mark." The mark itself is persistent chrome — it appears in the top bar and footer on every page, including pages that already spend their one accent on a primary button or the `Funded`/`No fee` chip. If the mark permanently carried `--accent` in its everyday (nav/footer) rendering, it would silently double the accent budget on almost every screen in the product, which is exactly the "spreads the accent for decoration" failure mode Section 3 and Section 6 rule out. So each concept below is specified in **two renderings**, not one:
  - **Chrome rendering** (nav, footer, favicon, anywhere the mark sits next to other UI) — `currentColor` only, no accent, functionally identical to how `間` behaves today.
  - **Splash rendering** (the intro screen only — a full-black frame with nothing else on it, so there is no competing accent to violate the one-per-screen rule) — the one accent-colored detail described per concept is allowed here, and only here, unless the owner explicitly decides otherwise.
- Implementation note, not a decision I'm making: all three concepts are drawn shapes, not a font character, so `components/brand/Mark.tsx` would move from rendering `BRAND.mark` as text (`Noto_Sans_JP`) to rendering an inline SVG or a CSS-drawn shape sized off the same `sm`/`md`/`lg` props. That's a real, if small, rewrite of the component — flagging it so the frontend task that wires this in doesn't discover it mid-PR.

## 3. Collision-check method

These are abstract geometric marks, not words, so there's no single "is this name taken" search the way `docs/creative/NAMING_OPTIONS.md` could run for "Fellow." Two different checks were run for each concept instead, both real searches, not assertions:
1. A **category-level search** (e.g. "two bars logo minimalist," "waypoint icon logo") to see how crowded the general shape-idea is in stock-icon libraries — crowded does not disqualify a concept (plenty of owned brand marks are simple shapes), but it means distinctiveness has to come from the specific proportions, not the base idea.
2. A **named-competitor search** specifically against the three existing "Fellow"-branded products already surfaced during naming (`fellow.ai` — AI meeting notes; `fellowproducts.com` — coffee gear; `fellow.so` / "Fellow: Social Community" — a social-club app), since those are the marks a viewer is most likely to actually confuse this with if they've seen any of them. `fellow.so`'s own site leans on circular emoji-in-circle imagery for its "circles" feature — noted below as a reason to avoid a pure circle motif.

---

## 4. Three concepts

### Concept 1 — "Two marks" (the companion mark) — top pick

**Shape:** two solid, sharp-cornered rectangles side by side with a fixed gap between them, both bottom-aligned, one full height and the other exactly half height — like two figures standing together, unequal but grounded on the same line. Stroke/fill in `currentColor`, corners at `var(--radius)` (2px, unchanged), same weight system as everything else in the token set.

**Why it fits:** it names the word "Fellow" itself, not a metaphor borrowed from travel or scanning — a fellow is literally someone standing alongside you. It reads naturally against every pillar the product actually has: the profile ("who's alongside you"), and the new Discover/Connect follow feature (Task 11) most directly of the three concepts. It also visually rhymes with the bracket pair `[` `]` that already flanks the wordmark in `Wordmark.tsx`/`IntroSplash.tsx` — two verticals of unequal height inside two verticals of equal height — without literally reusing the bracket shape (which would risk looking redundant sitting right next to it).

**Splash-only accent placement:** a single small square notch cut into the top-outer corner of the taller rectangle, filled `--accent` — one mark, one place, and it's the shape's only asymmetry, so it reads as a deliberate detail rather than decoration.

**Legibility:** at 20px it's two high-contrast solid blocks with one gap — this is about as simple a silhouette as exists, no risk of muddying. At 96px the accent notch (splash-only) is a small, clearly intentional detail rather than a large decorative area.

**Collision check:** "two bars logo minimalist duo," "duet icon" — both return large stock-icon-marketplace inventories (Flaticon, Icons8, Vecteezy, IconScout) of two-bar/duo glyphs, meaning the raw idea is generic at the category level; no single named, active brand in performing-arts, career-platform, or adjacent software categories was found using this specific unequal-height, bottom-aligned two-block silhouette. Checked against the three existing "Fellow"-named products above — none use a two-bar mark (fellow.ai's icon is not bar-based per available brand pages, fellow.so leans circular, fellow products/coffee gear's brand assets didn't return a described mark at all in search). Honest flag: this is a "usable, not clean" case in the same sense `docs/creative/NAMING_OPTIONS.md` used that phrase for "Ensemble" — the category is crowded in generic libraries, so this only stays distinctive if the specific proportions (the exact height ratio, the gap width) are followed precisely and not softened into a generic "two lines" glyph during implementation.

---

### Concept 2 — "The open corner" (the open-call mark)

**Shape:** a square frame drawn on three sides only — one corner is a deliberate gap instead of a closed joint, so the shape reads as a bracket that almost closes but doesn't. Monoline outline (not filled), `currentColor`, corners sharp (no rounding beyond `var(--radius)`).

**Why it fits:** this is the most literal, "wayfinding"-honest of the three under the design brief's own Section 2 rule 2 ("every mark must carry meaning, or it goes") — an *open call* is, by definition, a thing left open on purpose, and this mark is a frame with exactly one thing left open on purpose. It ties to the Hub specifically (the product's densest, most-visited screen and its actual primary object — an open call), more than to the "Fellow" name itself.

**Splash-only accent placement:** the two loose terminal ends at the opening — the two points where the frame doesn't meet — rendered as two short accent-colored ticks. This is the one place in the mark where "open" is literally visible, which is the most defensible possible use of a single accent detail (it marks the one meaningful fact, not a decoration).

**Legibility:** clean at 20px as long as the opening is a clearly asymmetric gap (not centered/symmetric) — see the execution risk below.

**Collision check:** "open square bracket logo minimalist" returns mostly four-corner "viewfinder/crosshair" framing icons — the camera-scan/QR-frame visual family, which is a real, worth-flagging adjacency. A three-sided frame with one symmetric opening could be misread at a glance as a scan/focus icon rather than an owned brand mark. No named performing-arts or career-platform competitor was found using this specific one-open-corner mark, but of the three concepts this one carries the highest execution risk — it only avoids the scan-icon reading if the opening is placed off-center and the remaining three corners stay sharp and unequal in length, which needs explicit direction to whoever builds it, not left to default judgment.

---

### Concept 3 — "The bearing mark" (the onward stroke)

**Shape:** a single diagonal stroke rising left to right, capped at its upper end by one short perpendicular tick — like a minimal bearing/heading mark, deliberately not a compass needle and not a map pin (the two shapes that dominate "travel" iconography and are the real collision risk in this space). Monoline, single stroke weight at all sizes, `currentColor`.

**Why it fits:** reads as "moving forward, toward something," which ties to the Circuit/Currently pillar (an artist moving city to city) and to the Hub's own deadline urgency (something ahead, in time) more than to the word "Fellow" itself — of the three, this is the one that names the *product's mechanics* rather than the *brand word*, worth weighing against Concept 1 on that basis alone.

**Splash-only accent placement:** the horizontal tick at the stroke's upper end — the "destination" point — is the one accent-colored element; the diagonal stroke itself stays `currentColor` always, even in the splash rendering.

**Legibility:** the simplest silhouette of the three — a single stroke plus one perpendicular cap holds up at 20px with no risk of loss of detail, and doesn't get more elaborate at 96px (it just gets bigger), which is arguably the most disciplined of the three under the "restraint" thesis in `docs/design/DESIGN_BRIEF.md` §2.

**Collision check:** "waypoint tick mark logo travel minimalist" and "bearing mark logo minimalist" both return categories dominated by literal map-pin (teardrop) and compass-needle shapes — this concept was deliberately built to avoid both of those specific, overused metaphors. No named competitor was found using a bare diagonal-stroke-with-tick mark in performing-arts, career-platform, or general travel-app categories. Of the three, this has the cleanest category-level collision profile, precisely because it avoids the two shapes everyone else in "travel/location" reaches for by default.

---

## 5. Recommendation

**Concept 1 ("Two marks") is the top pick.** The reasoning, in one paragraph: it is the only one of the three that names the brand word itself — a fellow is someone alongside you — rather than a mechanic of one pillar (Concept 2 names the Hub's core object; Concept 3 names Circuit/Currently's mechanic). That matters because the mark has to represent the whole product, all three pillars, not the one screen a given design session happens to be focused on — the same logic `docs/creative/NAMING_OPTIONS.md` used to reject "Rider" (too narrow to touring) in favor of "Fellow" (works across the full discipline range). It also has the lowest execution risk of the three: Concept 2 requires precise, non-default handling to avoid reading as a camera scan-frame, and Concept 3, while clean, is arguably too abstract to tell any story on its own without the accompanying wordmark doing all the work. Concept 1's stock-icon-category crowding is real but is the same class of risk the owner already accepted for the word "Fellow" itself (three unrelated existing brands, none competing for this audience) — acceptable if the specific proportions are followed, not diluted into a generic "two lines" treatment.

If the owner wants a fourth round instead (same pattern as the naming exercise, which took two), that's a five-minute ask — these three are a real range, not a single answer dressed up as three.

---

## What this document does not do

- Does not change `components/brand/Mark.tsx`, `lib/brand.ts`, `app/layout.tsx`'s font loading, or any other file.
- Does not run a formal design-trademark clearance search — the checks above are real web searches for existing, findable marks using a similar shape, sufficient to flag obvious conflicts, not a substitute for legal clearance before any commercial commitment.
- Does not specify exact SVG path coordinates — that's implementation work for whichever task wires the chosen concept in, once the owner picks one.
- Does not touch the wordmark "Fellow." itself, per the task's explicit instruction.
