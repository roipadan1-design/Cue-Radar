# Fellow. — deep research brief for an external session

Paste this whole document into a fresh chat with a strong research-capable model. That session has no memory of this project — everything it needs to act usefully is below. It should do real, cited, verifiable research and hand back structured findings, not write any code.

---

## Part 1 — Context (read this first)

**What Fellow. is:** a Career OS for independent artists working across dance, choreography, performance, experimental sound, live electronics, music, painting, and sculpture — currently focused on ~23 cities across Europe, the Mediterranean, and East Asia, with five cities prioritized for an initial closed pilot: **Tel Aviv, Tokyo, Berlin, Vienna, Brussels**.

Three pillars:
1. **The Hub** — a feed of verified, real open calls, residencies, and grants. Every row must be a real institution and a real, currently-open call, verified by a human before it goes live. No scraping shortcuts, no invented listings.
2. **Circuit** (formerly called "Radar") — pick a city and a date range, see what's worth catching there while you're in town: closing deadlines, workshops, performances, exhibitions.
3. **Artist profile** — a LinkedIn-style page for an artist: bio, current location and travel dates, disciplines, showreel, gallery, social links, and (planned, not yet built) connections/follows between artists.

**What already exists and what's proven:** the app is built (Next.js + Supabase), live at `cue-radar.vercel.app`, with real Supabase-backed data. As of today it has real institutions from an earlier research pass — mostly European dance-world institutions found via the European Dancehouse Network and Aerowaves partner networks — but real coverage is thin, especially outside dance, and especially in Tel Aviv and Tokyo.

**The standing rule that matters most for this research:** every institution, call, deadline, or fact you report must be real and verifiable — something you actually found by visiting a real site or a real, checkable source. Never invent an institution name, a call, a statistic, or a competitor fact. If you can't verify something, say so plainly rather than filling the gap with a plausible guess. This product's entire value proposition to artists is "verified by people, not scraped" — research that quietly contains invented content defeats the product's purpose.

---

## Part 2 — What to actually research, in priority order

### 1. Real institutions and open calls — the 5 priority cities, especially the weak ones

Prior research found decent coverage for **Brussels** and **Berlin** (real institutions with currently-open calls), but **Tel Aviv** and **Vienna** came up with real institutions that are simply between application cycles right now, and **Tokyo**'s options mostly close within days. Go deeper on all five, but weight your effort toward Tel Aviv and Vienna specifically:

- For each city: find real dance, performance, sound/music, and visual-art (painting, sculpture) institutions, venues, festivals, residency programs, and grant-giving bodies. For each: name, website, what kind of opportunities they run, and — critically — whether they have an actual open call live right now (not just "this org exists and sometimes runs calls").
- Don't stop at the obvious flagship institutions (the ones any local artist already knows) — look for smaller venues, artist-run spaces, university/conservatory-affiliated programs, and city or national cultural-fund bodies.
- For Tel Aviv and Vienna specifically: if the big institutions are off-cycle, look harder for smaller or rolling-basis opportunities that might currently be open even if the flagship ones aren't.

### 2. Institutions specifically for music, painting, and sculpture

Prior institution research (the European Dancehouse Network / Aerowaves pass) skewed almost entirely toward contemporary dance. The product's discipline scope was recently expanded to explicitly include **music** (as distinct from experimental sound/live electronics) and **visual art** (painting, sculpture) — and there is currently no equivalent large network/aggregator found for those disciplines. Research:

- Music: what are the real equivalents of "Aerowaves" or a dance-house network for experimental/contemporary music, sound art, and cross-disciplinary music residencies? Real festivals, real commissioning bodies, real residency programs.
- Visual art (painting, sculpture): real open-call aggregators, residency networks, and grant bodies for visual artists — especially ones that would appeal to an artist whose practice might cross into performance or sound (the product's actual audience is cross-disciplinary, not siloed).
- Flag clearly if a discipline genuinely has no large-network equivalent (this was already found true for experimental sound) — that's a useful, honest finding, not a failure.

### 3. Competitive landscape — a deeper, more current pass

An earlier competitive scan found: dedicated dance/performance open-call aggregators exist but are narrow or tied to one annual program; a well-funded "creator profile" competitor (Polywork) shut down because a profile alone gave people no reason to return; nothing found combines an opportunities feed with a "what's worth doing while I'm in this city" layer. Go further:

- Are there any newer (last 12 months) entrants in the "career tools for artists/creatives" space worth knowing about?
- Look specifically for anything combining opportunity-tracking with location/travel-awareness, in any creative field (not just performing arts) — the closest comparisons found so far were music-tour tools (Bandsintown/Songkick) which solve a different problem (promoting your own booked shows, not discovering others' programming).
- Real pricing/monetization models used by comparable platforms (career tools, creative-industry job boards, residency directories) — what do they actually charge, and who pays (the artist, or the institution/employer side)?

### 4. Business model specifics — partnerships and monetization benchmarks

The product's Trip Radar pillar has a plausible future revenue path: partnerships or revenue-share with the venues/businesses being surfaced to traveling artists (workshops, performances, retreats). Research real, comparable examples:

- How do similar city-discovery or local-experience platforms (event discovery apps, local tourism/experience marketplaces) structure revenue-share or referral partnerships with venues?
- Realistic commission/referral rates in this kind of local-experience marketplace.
- Any examples of a "professional trust/verification" layer being successfully monetized (i.e., institutions or venues paying for a verified/featured listing) — and any cautionary examples where that damaged user trust.

### 5. Brand name validation — "Fellow."

The product was just renamed to **"Fellow."** (the trailing period is a deliberate part of the name, styled like "Yahoo!"). Before this is finalized for real-world use, check:

- Domain availability: `fellow.app`, `getfellow.com`, `usefellow.com`, `fellow.art`, and similar reasonable variants (the plain `fellow.com`/`fellow.co` are almost certainly taken — check what actually is and isn't available).
- Existing products/companies named "Fellow" in adjacent-enough spaces to cause real confusion (a meeting-notes SaaS tool called Fellow is known to exist in the productivity space — check how directly it would collide, and look for any others, especially in creative/arts/career tools).
- Social handle availability on Instagram, X/Twitter, and TikTok for reasonable variants (@fellow, @fellowapp, @getfellow, @joinfellow, etc.) — these matter for actually launching a consumer-facing brand.
- A basic trademark search (USPTO TESS or EUIPO, whichever you can access) for "Fellow" in software/creative-services classes — flag anything registered that looks like a real conflict risk, but this doesn't need to be a formal legal opinion, just a sanity check.

### 6. UX/UI and information architecture — how the app should actually be organized

This is a separate kind of research from the rest of this brief: not sourcing data, but studying how comparable real products are *structured* — screen by screen, tab by tab — so we can get more precise about Fellow.'s own layout and feature set. The visual design direction (dark, quiet, "museum wall label" register, Japanese-minimalist restraint) is already decided elsewhere — this research is about structure and features, not colors or fonts.

Fellow. currently has four tabs: **Hub** (opportunities feed), **Circuit** (city/date "what's on" discovery), **Saved** (a pipeline board — saved/drafting/submitted/accepted/rejected), and **Profile** (artist page + edit).

For each of the following, study 3–5 real, currently-live products (not hypothetical ones) and report concretely what they do well and what to borrow — cite the actual product and describe the actual screen, not a general impression:

- **A feed/list screen mixing filterable categories with time-sensitive items** (closest real comparisons: job boards with deadline urgency, event-discovery apps, grant/funding databases) — how do the best ones handle filtering without it taking over the screen, and how do they signal urgency/deadlines without looking alarmist?
- **A city + date-range picker feeding into a results screen** (closest real comparisons: travel/event-discovery apps, city guide apps) — what's the best pattern for picking a city and a window of time quickly, especially on mobile, and how do the best ones structure mixed-type results (some things are deadlines, some are dated events)?
- **A pipeline/status-tracking board for a small number of stages** (closest real comparisons: lightweight kanban/application-tracker tools, job-application trackers) — what's the minimum viable structure that still feels useful, without turning into a heavyweight project-management tool?
- **A professional profile page for a creative person specifically** (closest real comparisons: portfolio-site builders, music/DJ platform artist pages, film/casting industry profile pages — not generic LinkedIn) — what sections, in what order, actually get used and looked at, versus what's just decoration?
- **Feature ideas**: based on what you find, what are 5–10 concrete feature ideas (not vague "AI-powered" suggestions — specific, buildable ideas) that would make each of these four tabs meaningfully better, grounded in what real comparable products actually do? For each idea: which tab it belongs to, and the real product/pattern it's borrowed from.

Report this section the same way as the others: cite real products and real screens, be specific about what to borrow, and be honest about what doesn't apply to Fellow.'s specific dark/quiet register (a feature or layout pattern can be worth noting even if its visual execution wouldn't fit — separate the structural idea from the skin).

### 7. Anything else genuinely useful you find along the way

If you come across real, useful signal outside these six areas while researching — a data source worth knowing about, a pattern in how artists actually talk about this problem (forums, subreddits, artist community discussions of pain points around finding opportunities or residencies), a regulatory/visa consideration relevant to touring artists working across the EU/Schengen/UK/Israel/Japan — include it. Don't force it if there's nothing real to report.

---

## Part 3 — How to report back

Structure your findings by the seven sections above. For every factual claim (an institution, a competitor, a statistic, a domain's availability), say how you verified it and link the source. Where you couldn't verify something or a city/discipline came up thin, say that plainly — a clearly-labeled gap is more useful than a padded list. Do not invent institutions, facts, or numbers to fill out a section.
