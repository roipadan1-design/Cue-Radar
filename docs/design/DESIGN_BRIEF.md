# Fellow. — Design Brief

Status: brief only. No code, tokens, or components changed by this document.
Purpose: a single, self-contained document to hand to a focused design session ("Claude Design") refining Fellow.'s actual visual design. Written so someone with zero prior context can read this once and start making concrete visual decisions, without reading any other file first.
Consolidates: `docs/VISION.md`, `docs/design/AESTHETIC_REFERENCES.md`, `docs/HANDOFF_V3.md`, `app/globals.css`.
Date: 2026-09-17.

---

## 1. The product, in one paragraph

Fellow. is a Career OS for independent contemporary dance, performance, and experimental-sound artists working across roughly 23 European/Mediterranean/East-Asian scenes. It has three pillars. **The Hub** is a verified, deadline-sorted feed of opportunities — open calls, residencies, grants, co-productions, commissions, festival submissions, awards, lab/workshops, auditions, mentorships — built to be checked habitually, like a music-discovery app, not a reference desk visited twice a year. **Trip Radar** proactively surfaces what's on in a city while an artist is there or headed there — performances, workshops, festivals, studio drop-ins — across discipline boundaries, a gap no existing tool fills. **The artist profile** is one page that shows who an artist is — current/upcoming location as the organizing fact, discipline, showreel, who inspires them — deliberately not LinkedIn's job-title shape, and deliberately not a standalone destination (Polywork's failure is the cautionary tale): it's meant to fill in as a byproduct of using the other two pillars. The throughline across all three is trust: verified data, curated-not-algorithmic surfacing, and an identity layer that never asks an artist to perform a career they don't have. Nothing is ever fabricated — no placeholder opportunities, sources, or people.

---

## 2. The aesthetic direction, as a design thesis

Fellow.'s existing register is dark editorial — "museum wall label": precise, quiet, curated, never cluttered, generic, robotic, or "AI-generated"-looking. The owner has confirmed this dark base stays, and has asked to push the register further: not toward a different look, but toward **Japanese minimalist restraint** applied as a discipline, using the tokens that already exist. Four ideas carry that discipline:

1. **Space is content, not leftover (Ma).** A screen with fewer things, spaced more generously, reads as more considered than one with everything visible at once — even holding the same information constant. Reach for the larger end of the existing spacing scale between sections rather than compressing to fit more in.
2. **Every mark must carry meaning, or it goes.** No ornamental lines, no decorative fills, no color used for "rhythm." A divider, a weight, a color change is only there if it answers a specific question about the content (is this urgent, is this funded) — never to add visual interest for its own sake. This is a wayfinding-system level of discipline: a signal should mean the same thing everywhere it appears, with no exceptions.
3. **One thing is allowed to be loud per screen; everything else recedes.** Pick exactly one element of richness — a color accent, a weight, a size — and make everything around it quieter than it would otherwise be. Currently that one loud thing on a Hub row is the urgency signal; it should stay the only thing competing for attention.
4. **Precision over coverage.** Show the one or two facts that matter at this distance (a list/feed view) and defer the rest to the next level of detail (the detail page) — the way a gallery label describes a work in one or two lines, not a paragraph. This is already a stated product rule ("no summary on the card") but has drifted in practice as features accumulated; the design pass should re-enforce it everywhere, especially the Hub row.

None of this requires new colors, fonts, or components — it's a discipline applied to spacing, hierarchy, and what earns a place on a dense screen, inside the token system below.

---

## 3. Locked constraints — do not change without a dedicated task

These are settled. A design session should work inside them, not propose alternatives to them (a genuine case for changing one of these — e.g. the accent color, still open — should be flagged as a question, not silently changed).

**Exact current values, from `app/globals.css`:**

```
--bg:          #0A0A0A
--surface:     #111111   (reserved for top bar, bottom nav, sheets, empty states only —
                          never a general card/content background)
--line:        #1F1F1F
--line-strong: #2E2E2E
--fg:          #F2F2F2
--muted:       #8C8C8C
--accent:      #B39DFF   (placeholder value — Task 03 brand-identity work has not
                          finalized this; never yellow-family; see Section 4)
--urgent:      #E5484D   (the single "must-notice" signal — reserved for <7-days-left,
                          never reused for anything else)
--backdrop:    rgba(0,0,0,0.6)
--radius:      2px
--space-1..8:  4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
```

**Typography** (`app/layout.tsx`, `app/globals.css`): Archivo (variable `--font-display`, weight 800, uppercase, tight tracking) for display/titles; Manrope (variable `--font-body`, weights 400/500/600) for body and metadata; tabular numerals (`t-num`) for figures. No monospace, no third typeface. Five type styles exist and should stay closed at five: `t-display` (36/64px), `t-title` (22/28px), `t-row` (17/18px), `t-body` (15/16px), `t-meta` (11/12px, uppercase, muted). A future screen should resolve to one of these five, not invent a sixth.

**Surface logic:** dividers, not boxes, is the base instinct. No shadows, no gradients, anywhere in the token system (no shadow token exists). 2px radius everywhere a radius is used — never a larger, softer radius. This instinct holds even as the Hub introduces card boundaries (Section 4) — a card border in this system does the same job a divider does, just closed into a rectangle; it is not an invitation to add elevation, shadow, or fill.

**One accent per screen.** Whatever the final accent color is, it appears in at most one meaningful place per screen — not spread across multiple UI elements for decoration.

---

## 4. What's open for this design pass

### 4.1 The Hub's move to tagged cards

Task 02 already reversed cards to dividers once (`docs/ROADMAP.md`). This is not undoing that — it's a specific, tag-forward card anatomy the owner asked for directly, after reviewing two of his own references (Section 5). The concrete punch list:

- **Card boundary.** Replace the current bottom-divided row (`border-b border-line`) with a full outline: `border border-line`, `radius: var(--radius)` (2px, unchanged), background stays `--bg` — not `--surface` (using `--surface` as a card fill would break the existing rule that reserves it for chrome; if a session wants that, it must be a stated decision, not a side effect). Cards need visible gaps between them (`--space-3` or `--space-4`, 12–16px) — zero-gap bordered cards read as a broken grid, not discrete objects.
- **Six rules for tags that read as considered, not decorative:**
  1. No icons on tags — text-only, set in `t-meta`. A number/word already says what it needs to.
  2. Outline, not fill — reuse `border-line-strong` and `var(--radius)`, the same values the existing filter chip and the card border use, so tags read as the same object language, not a separate chip library dropped in. A filled, saturated pill reads as a marketing badge.
  3. One visual treatment per *kind* of fact, not per tag — discipline, city, and type are all dry/descriptive and should look identical to each other. Reserve any stronger treatment (fg-weight text, or eventually the accent) for the one fact that's an actual decision — funded / no-fee.
  4. Cap what's visible on the card face at two to three tags (discipline, city, the one differentiator that matters); defer the rest to the detail page.
  5. Consistent chip height and fixed horizontal gap (`--space-2`) — not auto-width chip soup wrapping unevenly.
  6. No hover-lift, no shadow, no gradient, anywhere — this alone is most of the "distinctive, not generic-template" win, and it costs nothing new since none of those exist in the token system today.
- **On imagery:** no image pipeline exists for opportunities today. Resist filling empty card space with stock photography, icon illustration, or a gradient placeholder to make a card "feel complete." An unadorned card is more consistent with the register than a decorated one. A real image pipeline, if ever built, is a separate task.
- **Type does the work of visual interest**, not color or imagery — setting the opportunity title in `t-display` or a heavier weight than a typical job-board title, inside an otherwise-quiet card, does more for "considered product" than any chip styling.

### 4.2 Accent color

`--accent` is currently `#B39DFF`, explicitly a placeholder pending Task 03 (brand identity). If still unset when this design pass starts, it's open — with the constraint that whatever is chosen must be disciplined enough that every use of `--accent` in the codebase could be explained in one sentence (the wayfinding-system standard from Section 2). Never yellow-family (reserved distinction from existing decisions).

### 4.3 Two smaller open questions, worth deciding explicitly rather than drifting

- **Divider weight.** `--line #1F1F1F` may be heavier than comparable quiet-UI systems use for internal row separators. Worth testing a lower-contrast internal divider, reserving `--line-strong` for section/group boundaries only. This is a token *value* change — needs an explicit decision, not a silent tweak.
- **Chip-bar density on the Hub.** The filter bar currently surfaces roughly 17 simultaneous options. A lighter-touch default would show a small number of high-value filters (no fee, funded, this week) with the rest reachable one tap away in the filter sheet — no capability removed, only what's visible by default.

---

## 5. Reference shorthand

Nine researched references plus the owner's own two. "Borrow" is literal — not a mood description.

| Reference | Borrow this |
|---|---|
| Muji (brand philosophy) | One fact, printed once, at one weight — no repeating the same info in two visual treatments on one row. No decorative icons on already-legible UI. |
| teenage engineering (product site) | Spend the whole typographic budget in one place, well — resolve everything to the existing 5 type styles rather than adding a 6th; keep exactly one loudest signal per row. |
| Nendo (studio portfolio) | Index restraint: one line to identify, one line to locate, nothing else until the reader commits to opening it. Not the visual style (Nendo is all-white; we stay dark). |
| Kinfolk (editorial site) | Margins carry as much compositional weight as the text — generous outer margins and inter-section spacing even on content-heavy pages. Not the typeface (serif; we keep Archivo/Manrope). |
| Aesop (retail site) | Copy register: short, factual, doesn't hedge or oversell ("non-accommodation"). Applies to opportunity summaries and card text as much as to visuals. |
| Are.na (content platform) | Proof that dense screens can feel calm using only hairline dividers and two text-contrast levels — no card backgrounds, no shadows, no per-item chrome. |
| Linear (linear.app) | Strict two-tier text hierarchy (near-white primary, mid-gray secondary, no third gray); generous vertical padding instead of a divider *between* large sections, hairlines only *within* a section. |
| Tokyo Metro / JR wayfinding | Absolute signal discipline — a color or number always means the same one thing, everywhere, no exceptions. The standard to audit `--accent`, `--urgent`, and chip states against. |
| **Perform Europe** (owner's ref — `performeurope.eu/category/news/`) | Dark card canvas close to our own `--bg`/`--fg`; outlined-not-shadowed cards; one small capitalized category label per card, top-left. **Do not copy:** four decorative colored dots on its filter tabs — that's undisciplined color, the opposite of the wayfinding rule. |
| **Backstage** (owner's ref — `backstage.com/casting/`) | Anatomy only: title → meta facts (pay/location/date) → tags in their own distinct band, not folded into a run-on line. **Honest verdict: do not copy the palette or chrome.** The actual page is close to textbook generic SaaS — three-plus competing accent colors, heavy chrome (dropdowns, tooltip popovers, a chat bubble), cards nested inside cards, and checkmark icons on tags repeating what the text already says. This is the exact "generic/AI-template" reflex the owner asked Fellow. to avoid. Borrow the skeleton, not the surface. |

---

## 6. Anti-goals — actively avoid

- Icons on tags (discipline/location/type tags are text-only).
- Filled or shadowed pill chips — outline only, sharing the system's existing border weight and radius.
- Multi-color decoration — no per-category colored dots, no palette of accent colors; one accent, used sparingly, per Section 3.
- Stock or placeholder imagery filling empty card space where no real photo exists.
- Gradient CTAs, or gradients anywhere — none exist in the token system; keep it that way.
- Hover-lift, drop shadows, soft/large border-radius — the default reflexes of generic card templates; Fellow.'s 2px radius and shadow-free system already rule these out structurally.
- A "second summary" on any card or row — tag lines or chip rows that re-list everything instead of surfacing the one or two decision-relevant facts.
- Anything that reads as generic SaaS or AI-generated template — the explicit standard the owner named: distinctive and professional, not banal.

---

## 7. Priority screen for this pass: the Hub feed

Start here. It's the densest, most-visited screen, and the clearest live gap between "museum label" and "Japanese minimalist" today.

- `app/hub/page.tsx` — renders search, the filter chip row, header/counts, then grouped sections.
- `components/hub/OpportunityRow.tsx` — the row/card itself. Currently: title → source · city → a joined tag line (up to 7 items via `tags.join('  ·  ')`, lines 76–85 and 110–115) → funding figure / eligibility label / deadline. This is the component the card-boundary and six tag rules in Section 4.1 apply to directly — the tag line in its current form is doing the "list everything" job Section 2's precision principle argues against.
- `components/hub/FilterBar.tsx` — the ~17-option always-visible chip row referenced in Section 4.3.

A design session should treat these three files as one unit: get the card anatomy, tag rules, and filter-bar density resolved here first, since every principle in this brief is easiest to test against the screen that currently carries the most information per square inch.
