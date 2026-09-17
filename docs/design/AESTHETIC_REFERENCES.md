# Aesthetic references — Japanese minimalist direction

Status: research and specification only. No code, tokens, or components changed by this document.
Audience: this document is written to brief a design session ("Claude Design") that has never seen Fellow. Every claim below is tied to a specific file, component, or token so the brief can be acted on without re-deriving context.
Author: UX/UI department, for the pilot-readiness push.
Date: 2026-09-16.

---

## 1. Where we are now (baseline, for contrast)

Fellow.'s current register, set by Task 02 (`docs/ROADMAP.md`, "Task 02 — Structure" table) and encoded in `app/globals.css`:

- **Voice:** "museum wall label" — precise, quiet, curated. Explicitly *not* cluttered, generic, robotic, or "AI-generated" looking.
- **Palette:** near-black (`--bg #0A0A0A`, `--surface #111111`), off-white text (`--fg #F2F2F2`), muted gray (`--muted #8C8C8C`), hairline dividers (`--line #1F1F1F` / `--line-strong #2E2E2E`), one accent (currently `--accent` = `var(--fg)` placeholder, to be set in Task 03, never yellow-family), one urgent red (`--urgent #E5484D`).
- **Type:** Archivo 800 uppercase for display/titles, Manrope 400/500/600 for body and metadata, tabular numbers for figures. No monospace.
- **Surface logic:** dividers, not boxes. `--surface` reserved for top bar, bottom nav, sheets, empty states. Radius 2px, no shadows, no gradients.
- **This is already a restrained, dark-editorial system** (explicitly modeled on Resident Advisor / Are.na / Ableton per `docs/HANDOFF_V3.md` Part C, later refined toward the quieter museum-label voice in Task 02). The owner's ask in this brief is to push it further — toward something closer to Japanese minimalist print and object design: *precise, refined, light-touch, not heavy.* That is a difference of degree and specific technique, not a change of premise. The references below were chosen to show exactly what "further" looks like in practice, not to replace the existing direction.

---

## 2. Mood and principles

Five principles extracted from the references in Section 3, stated so they can be checked against any future screen:

1. **Ma (間) — the space is part of the content, not the leftover.** In Japanese design and architecture, empty space is a compositional element with its own weight, not a gap to be filled. A screen with fewer things, spaced more generously, reads as more considered than a screen with everything visible at once — even when both contain the same information.
2. **Restraint is confidence, not decoration.** Nothing on the page should perform "minimalism" (no purely ornamental thin lines, no empty geometric shapes as filler). Every mark that appears — a divider, a color, a weight change — has to carry a specific piece of meaning, or it is removed. Aesop's "non-accommodation" and Muji's "emptiness" both describe the same idea: don't over-explain, don't soften, trust the reader.
3. **One element of richness per view, everything else recedes.** Japanese-minimalist systems rarely spread visual interest evenly. They pick exactly one thing to be vivid (a product render, a photograph, a single color accent) and make every surrounding element quieter than it would otherwise be, so the one thing reads clearly.
4. **Information hierarchy is exact, not layered for texture.** Wayfinding systems (Tokyo Metro / JR) never use color, size, or position for atmosphere — each visual distinction maps to exactly one fact (this color = this line, this number = this distance). Applied to product UI, this means a badge, a weight, or a color in Fellow. should always answer a specific question ("is this urgent," "is this funded"), never exist for rhythm or "visual interest."
5. **Precision over coverage.** A gallery label describes a work in one or two lines, not a paragraph. The instinct in a data-dense product is to show more fields per row to be "informative"; the Japanese-minimalist instinct is to show the one or two fields that matter at this distance and defer the rest to the next level of detail (the detail page).

None of this requires new colors or fonts — it is a discipline applied to spacing, hierarchy, and what earns a place on the dense screens, using the tokens that already exist.

---

## 3. References

Each reference includes what it is, a link, and what specifically to borrow — not a general mood description.

### 3.1 Muji — brand philosophy and retail site
**What it is:** Japanese household-goods and apparel brand; design philosophy authored largely by Kenya Hara (MUJI Art Director).
**Link:** https://www.muji.eu/pages/muji-stories/the-art-of-simple-design.html · https://www.muji.com
**What to borrow:** Hara describes the brand's core idea as "emptiness" — a container that doesn't dictate meaning but leaves room for the user to bring their own reading. Concretely for Fellow.: resist the urge to add explanatory copy or decorative iconography to already-legible UI (e.g., a deadline chip doesn't need a clock icon; the number and word "left" already say it). Borrow the packaging logic — a single fact printed once, in one place, at one weight, no repetition of the same information in two different visual treatments on the same row.

### 3.3 teenage engineering — product site
**What it is:** Swedish audio-hardware company (OP-1, Pocket Operators) whose web and product design is frequently cited alongside Japanese minimalist practice for its restraint, though the company itself is Scandinavian — included because the technique, not the origin, is what's transferable.
**Link:** https://teenage.engineering
**What to borrow:** A single typeface (Univers) at extremely light weights used everywhere, with zero secondary typefaces or decorative iconography — literally one design decision spent very well, rather than many small decisions spent adequately. For Fellow., this argues against adding new type treatments as the product grows: every future screen should still resolve to the existing five type styles (`t-display`, `t-title`, `t-row`, `t-body`, `t-meta`) rather than inventing a sixth for a new need. It also demonstrates "spend the budget in one place" — for us, that's the deadline/urgency signal, which should stay the single loudest thing on a Hub row, with nothing else competing for attention.

### 3.4 Nendo — design studio portfolio
**What it is:** Tokyo/Milan design studio (Oki Sato); the studio site is essentially a very long, disciplined index of projects.
**Link:** https://www.nendo.jp
**What to borrow:** Each project in the index gets one image and one short identifying line — no summary paragraph, no tags, no metadata cloud. This is the sharpest, most literal precedent for what a Hub row could look like at its most reduced: one line that identifies the thing (title), one line that locates it (source · city), and nothing else until the reader commits to opening it. Borrow the *index restraint*, not the visual style (Nendo's site is nearly all-white; ours stays dark per Section 4).

### 3.5 Kinfolk — editorial site and magazine
**What it is:** Quarterly lifestyle/design magazine, redesigned by creative consultancy Six; known for treating white space as a structural element rather than a byproduct of the grid.
**Link:** https://www.kinfolk.com
**What to borrow:** Breathable layouts can hold dense editorial content without feeling dense, because the *margins* carry as much of the composition's weight as the text does. Borrow the ratio, not the typeface (Kinfolk uses serif display faces; we keep Archivo/Manrope per the "never change tokens" rule) — specifically, generous outer margins and inter-section spacing even on a content-heavy page, rather than shrinking margins to fit more in.

### 3.6 Aesop — retail site
**What it is:** Australian skincare/grooming brand; site and packaging share one restrained palette (cream, olive, brown) and consistently spare product copy.
**Link:** https://www.aesop.com
**What to borrow:** Product description text is short, factual, and doesn't hedge or oversell — described by design critics as "non-accommodation": the brand doesn't soften its restraint to make the page more welcoming. For Fellow. this is a copy-register note as much as a visual one: opportunity summaries and card text should stay factual and short (this is already partly enforced — "No summary on the card," HANDOFF_V3 Part E) rather than growing more persuasive or friendly over time.

### 3.7 Are.na — content platform
**What it is:** A quiet, text-forward content-organizing tool already named as a direct precedent in `docs/HANDOFF_V3.md` Part C ("RA / Are.na / Ableton").
**Link:** https://www.are.na
**What to borrow:** Are.na proves that a screen can hold a lot of blocks (channels, connections) and still feel calm, because it uses only hairline dividers and two levels of text contrast (full-strength text vs. muted text) to separate items — no card backgrounds, no shadows, no per-item chrome. This validates and sharpens the existing "dividers not boxes" rule already in `app/globals.css` and Task 02's decisions table; the lesson to push further is that Are.na uses even *less* visual weight per divider than Fellow. currently does — worth testing a lighter-weight or lower-contrast divider than `--line #1F1F1F` for internal row separators, reserving `--line-strong` for section boundaries only.

### 3.8 Linear (linear.app) — dense dark-mode product UI
**What it is:** Project-management software; relevant here specifically as a proof point for keeping a *dense, dark, data-heavy screen* (their issue list is a close structural cousin of the Hub feed) feeling light-touch rather than heavy.
**Link:** https://linear.app
**What to borrow:** Two concrete techniques: (1) a strict two-tier text hierarchy (near-white primary text, mid-gray secondary text) with no third or fourth gray in between, so the eye never has to parse a subtle distinction; (2) using generous vertical padding *instead of* a divider between larger sections, reserving hairlines for separating items within a section. Applied to `HubFeedView.tsx`: group headers (`GroupHeader.tsx`) could rely on spacing alone to separate "Closing this week" from "This month," while hairlines stay only between individual rows.

### 3.9 Tokyo Metro / JR wayfinding system
**What it is:** Not a website — the signage and color-coding system across Tokyo's rail network, widely studied as an information-design precedent.
**Link:** https://www.andrewalexanderprice.com/blog20190830.php (survey with photos and analysis)
**What to borrow:** Absolute discipline in what a visual signal is allowed to mean: a line's color always means the same line, everywhere, with no exceptions; a number always means a distance or a station index, never a decorative label. This is the sharpest available precedent for auditing Fellow.'s badge/chip system: today, `--accent` and `--urgent` and the various chip states in `FilterBar.tsx` and `Chip.tsx` need a similar one-signal-one-meaning audit — e.g., confirm urgency red never appears for anything except "<7 days," and an active-filter chip state never borrows the same visual treatment as an eligibility signal.

---

## 4. Concrete implications for Fellow.'s token system

**Stays as-is (do not touch without a dedicated task, per the standing rule):**
- Dark base (`--bg`, `--surface`) — none of the references argue for a light-mode pivot; they argue for *doing more with the same restraint*, not for abandoning the dark-editorial premise the owner and Task 02 already chose.
- Archivo (display) + Manrope (body) pairing, no monospace, no new font families.
- `--urgent` red as the single "must-notice" signal.
- Dividers-not-boxes, no shadows, no gradients, 2px radius.
- Accent-in-at-most-one-place-per-screen rule from Task 02.

**Worth re-examining when Task 03 (brand identity / accent color) and any future visual-refinement task are briefed — flagged as questions for that session, not decided here:**
- **Divider weight.** `--line #1F1F1F` may be heavier than the Are.na/Linear precedent suggests. A future task could test a lower-contrast internal-row divider, keeping `--line-strong` for section/group boundaries — this is a candidate *value* change to an existing token, which per the standing rule needs its own explicit task.
- **Spacing scale usage.** The `--space-1..8` scale (4→64px) already exists; the references argue for consistently reaching for the *larger* end of that scale between sections (Kinfolk, Linear) rather than introducing new tokens. This is a usage discipline question for component work, not a token change.
- **Chip-bar density.** See Hub-specific note below — this is the clearest concrete case where "more restraint" and "current implementation" are furthest apart.
- **Accent color choice (Task 03, still open).** The wayfinding precedent (Section 3.9) argues the eventual accent should be reserved so tightly that a future audit could grep every use of `--accent` in the codebase and explain each one in one sentence. Worth stating explicitly as a acceptance criterion when Task 03 is briefed.

---

## 5. What this means for the Hub feed specifically

The Hub is named in the brief as the densest screen, and it is — currently `app/hub/page.tsx` renders, in order: a search input, a horizontally-scrolling chip row with roughly 17 filter options (`no fee`, `funded`, `housing`, `travel`, `light application`, 10 type chips, 7 discipline chips — `components/hub/FilterBar.tsx` lines 118–154), a header with a date line, title, and a meta-counts line, then grouped sections (`components/hub/HubFeedView.tsx`) each with a sticky group header and rows. Each row (`components/hub/OpportunityRow.tsx`) already carries: title, source · city, a tag line that can join up to seven items with " · " (type, disciplines, funding, "No fee," "Housing," "Travel," effort label, "Demo"), then a bottom line with funding figure, an eligibility label, and the deadline text.

That is measurably more per-row information than any reference in Section 3 shows on an index screen (Nendo: one line; Kinfolk: generous margins around short blocks; Are.na: title + one muted line). Two things follow, offered as implications for a future briefing, not as changes to make now:

1. **The chip bar is the single biggest gap between "museum label" and "Japanese minimalist."** Seventeen simultaneously visible filter options is a wall of controls; a light-touch treatment would default to a small number of high-value chips (the ones that map to real decisions an artist makes fast — no fee, funded, this week) with the rest reachable through the existing filter sheet rather than always on-screen. This does not require removing any filter capability, only changing what is visible by default versus one tap away.
2. **The row's tag line is doing the "list everything" job that these references consistently push to a second level of detail.** A future refinement should treat the tag line the way a gallery label treats a work's medium — pick the one or two facts an artist needs to decide whether to open the row (most often: funding and deadline, which already have their own dedicated positions), and move the rest (discipline, effort, covers) to the detail page, trusting the row's job to be triage, not summary. This is consistent with the existing product rule "no summary on the card" — the tag line has, over the course of feature work (fit score, effort, no-fee/funded toggles), become a second summary in practice.
3. **More vertical air between rows and between groups**, per the Are.na/Linear/Kinfolk technique of letting spacing do separation work that a rule or background currently does — a candidate direction for whichever task next touches `OpportunityRow.tsx` and `GroupHeader.tsx`, using the existing `--space-*` scale rather than new values.

None of the above changes anything today — it is meant to be handed to the design session referenced in the task brief as a concrete starting punch list against the Hub specifically. Section 6 below now carries the owner's own references and a specific card/tile direction for this same screen — read the two together.

---

## 6. Owner's references (received) and the move to cards/tiles

The owner sent two references of his own and specific direction, superseding the placeholder that was here. His direction in his own words: the Hub should be organized as cards/tiles tagged with dry factual details (discipline, location, etc.), not a dense text list, and the overall visual language should read as a quality professional product — explicitly *not* "banal AI-generated design." He wants Fellow. to feel more distinctive and unique, not generic. Both sites below were opened live (mobile viewport, 375–390px, matching Fellow.'s own breakpoint) rather than judged by domain name.

Worth noting for context before the two entries: Task 02 already made one card→divider reversal for the Hub (`docs/ROADMAP.md` §5: *"cards → dividers"* is listed among the Task 02 design reversals). The direction below is not simply undoing that — it is asking for a specific, tag-forward card anatomy, not a return to whatever the pre-Task-02 cards looked like. That distinction matters enough to state explicitly to whoever picks this up next.

### 6.1 Perform Europe — Activities/News index
**What it is:** The EU-funded performing-arts touring-support platform's public activities feed (`/category/news/`) — a live, in-the-wild example of a card-based feed for the same *kind* of content Fellow.'s Hub carries (opportunities, calls, listings for touring/performing artists).
**Link:** https://performeurope.eu/category/news/
**What the owner said he likes about it:** Sent as one of two references "that embody the direction he wants" for the Hub generally — read together with the direction above (cards/tiles, dry factual tags, professional/distinctive, not generic).
**What to borrow:**
- The canvas is near-black already — this is a dark card system, not a light one, and it sits close to Fellow.'s own `--bg`/`--fg` relationship. A card format does not require abandoning the dark-editorial base.
- Cards are *outlined*, not filled-and-shadowed: a thin rounded border on the dark canvas, no drop shadow, no background color shift. That is much closer to Fellow.'s "dividers not boxes" instinct than a typical card component — the border is doing the same job a divider does, just closed into a rectangle.
- Exactly one category label per card ("NEWS"), small, capitalized, placed top-left, and it answers exactly one question (what kind of listing this is) — consistent with the one-signal-one-meaning rule already in Section 3.9.
- The section title ("Activities") is set in a large, bold, uppercase display face — the same instinct as Fellow.'s `t-display` Archivo 800 uppercase.
**What to explicitly not copy:** The filter tabs (Events / News / Resources / Stories) each carry a small solid-color dot (yellow, red, green, magenta) with no stated meaning beyond "this is a different tab" — that is four extra accent colors doing decorative work, which conflicts directly with Fellow.'s one-accent rule and the wayfinding discipline in Section 3.9. Do not adopt multi-color category dots. Also: the image-led card format only works because every listing has real, specific production photography — Fellow.'s opportunities mostly don't have images, so a literal copy (photo fills most of the card) is not viable without a real image pipeline; see 6.2 below for how to handle that honestly rather than filling the gap with stock or placeholder art.

### 6.2 Backstage — casting-calls listings
**What it is:** A US casting/talent job board. The marketing homepage (backstage.com) is not the useful comparison — the actual `/casting/` search-results page is: a filterable list of paid opportunities, each with pay, location, a description, and a row of discipline/role tags. That page is the direct structural cousin of Fellow.'s Hub.
**Link:** https://www.backstage.com (marketing page); https://www.backstage.com/casting/ (the listings page actually reviewed)
**What the owner said he likes about it:** Sent alongside Perform Europe as embodying the "cards/tiles with dry factual tags" direction for the Hub.
**What to borrow:** The core anatomy is right and worth taking directly: title, then a short block of meta facts (pay, location, posted-date), then a one- or two-line description, then a *distinct row* of tag chips (discipline/role type) set apart from the body copy rather than folded into a run-on line. That last point is the most useful, concrete takeaway for `OpportunityRow.tsx`: tags need their own visual band, not the current inline `tags.join('  ·  ')` string (`components/hub/OpportunityRow.tsx` lines 110–115), because a joined text line can't read as "tags" the way a row of discrete chip shapes can.
**What to explicitly not copy — stated plainly, because this cuts against the owner's own brief:** the actual page, once open, is close to the textbook version of "generic professional SaaS," which is exactly what the owner said to move away from. Concretely: three-plus accent colors compete at once (indigo "Join"/"Search," mint-green "Save Search," coral "Staff Pick" and "Featured" badges sharing one tone so the color stops mapping to one meaning); heavy interface chrome (full-width filter dropdowns, an onboarding tooltip popover, a floating chat-widget bubble); nested cards inside cards (a "Roles" sub-panel stacked inside the listing card); and pill tags carry small checkmark icons that repeat information the text already states. None of this belongs in Fellow. If the design session needs a one-line caution to keep in view, it's this: Backstage shows what happens when a card-based listings page treats tags and badges as decoration instead of fact — multiple colors, icons-for-emphasis, and shadowed nested cards are the generic-template reflexes the owner is explicitly asking Fellow. not to have. Borrow the *anatomy* (title → meta → tags), not the palette or the chrome.

### 6.3 Concrete direction: moving `OpportunityRow.tsx` from list-row to tagged card

This section is the actionable punch list for whichever task next touches the Hub. It stays inside the existing token system (`app/globals.css`) throughout — no new colors, no new radius value, no new font.

**Card boundary.** Wrap what is currently a bottom-divided row (`border-b border-line`, `components/hub/OpportunityRow.tsx` line 101) in a full border instead — `border border-line`, `radius: var(--radius)` (2px, unchanged), background stays `--bg`, not `--surface`. Keep `--surface` reserved for top bar / bottom nav / sheets / empty states as Section 1 already states — turning every Hub card into a `--surface` fill would quietly break that existing rule, so if a future session wants cards to sit on `--surface` instead, that should be a stated decision, not a side effect of the card change. Cards need a visible gap between them (`--space-3` or `--space-4`, 12–16px) rather than sitting edge to edge — a border-only card with zero gap to its neighbor reads as a broken grid, not a set of discrete objects.

**What makes a tag read as considered, not decorative — six concrete rules, aimed directly at "not banal / not generic":**
1. **No icons on tags.** Backstage's checkmark-per-chip is decoration reinforcing text that already says the same thing. A museum label doesn't use icons; discipline/location/type tags should be text-only, set in `t-meta`.
2. **Outline, not fill.** A tag should share its border weight with the rest of the system — reuse `border-line-strong` and `var(--radius)`, the same values the existing filter `Chip` (`components/ui/Chip.tsx` lines 23–24) and card border above already use — so a tag looks like it belongs to the same object language as the card and the divider, not like a separate "chip library" was dropped in. A filled, saturated pill (Backstage's coral/mint) reads as a marketing badge, which is the generic-template tell the owner is naming.
3. **One visual treatment per kind of fact, not per tag.** Discipline, city, and type are all the same *kind* of thing — dry, descriptive, non-actionable — and should look identical to each other (same border, same muted text color). Reserve any stronger treatment (fg-weight text, or eventually the accent) for the one fact that is a real decision-relevant differentiator — funded / no-fee — consistent with the one-signal-one-meaning rule in Section 3.9. Do not invent four tag colors to "add interest."
4. **Cap what's visible on the card face.** Two to three tags on the card (discipline, city, and the one differentiator that matters — funded or no-fee), the rest deferred to the detail page. This is the same "no summary on the card" instinct already stated in Section 5, applied to tags specifically: a card with seven chips is the same density as the current tag line, just redrawn with more borders around it — that is not more distinctive, it's more cluttered.
5. **Consistent chip height and spacing**, not auto-width chip soup wrapping unevenly across lines — a shared baseline height and fixed horizontal gap (`--space-2`) makes the tag row read as one designed unit instead of a wrapped sentence broken into boxes.
6. **No hover-lift, no shadow, no gradient, anywhere.** This is most of the "distinctive, not AI-generated-template" win, and it costs nothing new — most generic card templates default to soft drop-shadows, large border-radius, and gradient CTA buttons; Fellow. already has none of these in its token system (2px radius, no shadow token exists). Simply not adding them when the card format arrives is the single highest-leverage move here.

**On imagery.** Perform Europe's cards work because of real, specific production photography per listing. Fellow. does not have that pipeline today. Resist filling the resulting empty space with a stock photo, generic icon illustration, or gradient placeholder to make the card "feel complete" the way a template would — an unadorned card (title, tags, facts, nothing else) is more consistent with the museum-label register than a decorated one. If a real image pipeline is ever built (source-provided event imagery), that's a separate, larger task — not a prerequisite for the card/tag work above.

**Distinctiveness beyond the mechanics.** The type system is already the tool that should carry visual interest instead of color or imagery (teenage engineering precedent, Section 3.3): setting the opportunity title in `t-display` or a heavier weight than a typical job-board title, inside a card that is otherwise quiet, does more for "feels like a considered product, not a generated one" than any amount of chip styling.

### 6.4 Bearing on the open dark-vs-light question

Section 4 currently states the dark base "stays as-is... none of the references argue for a light-mode pivot" — written before these two references arrived. Worth flagging plainly rather than assuming that line still holds unexamined: the owner's own two references split on theme. Perform Europe's activities feed is dark and sits close to Fellow.'s existing `--bg`/`--fg` pairing (Section 6.1) — it reinforces the dark base. Backstage's actual listings page is light, with several saturated accent colors throughout (Section 6.2) — taken as a literal palette reference it would argue against the dark base and against the one-accent rule both.

Because Backstage is flagged above as mostly a cautionary reference for chrome and color discipline rather than a visual model to follow, the more consistent reading is that its light background isn't an instruction to go light — the actionable borrow from it is the card anatomy (title → meta → tags), not its palette. That reading is not a decision, though, and this doc does not make it one: the owner sent one dark reference and one light one, and nothing above proves that was incidental rather than deliberate. This is worth a direct one-line question back to him before the design session locks the dark base in further — don't let "dark stays" quietly re-harden into settled fact between this doc and the next task brief without him confirming it once, now that he's seen he sent mixed signals on it himself.
