# ArtConnect Discover Page — how they sequenced it, and what it implies for Fellow. Discover v1

Written 2026-09-17 by the Research department. Question asked: did ArtConnect's Discover page (profile directory) launch on top of their existing member base or start thin/empty, and what moderation/spam-prevention pattern do they use — because this directly informs how thin Fellow.'s own Discover v1 (opt-in profile directory + one-directional follow) can look on day one without feeling embarrassingly empty.

## What I could not verify

I could not find the specific article "Introducing the ArtConnect Discover Page" dated December 1, 2025 on `magazine.artconnect.com`, despite multiple direct and site-scoped searches and URL guesses. It's possible the article has since been retitled, moved, or removed from the magazine's current navigation/sitemap, or that it exists at a URL my searches didn't surface. **I'm flagging this as unverified rather than reconstructing the launch narrative from adjacent pages** — the specific sequencing claims below come from other real, dated ArtConnect sources, not from that article.

## What I could verify

**Existing base, not a cold start.** ArtConnect did not launch any version of a public directory/opportunities product from zero. Their October 2021 relaunch announcement ("ArtConnect Relaunches with Exciting New Features," `magazine.artconnect.com/editorial/relaunch`) states the platform already had "more than 90,000 artists and art professionals from over 100 countries" visiting monthly *before* that relaunch — the relaunch was a redesign/feature-add (improved opportunity search, bookmarking, deadline reminders, an organization-verification badge system) on top of an already-large base, not a first launch. Current ArtConnect marketing copy (`artconnect.com`, `magazine.artconnect.com`) cites "65,000+" or "90,000+" members/professionals depending on the page — these are likely different metrics (registered members vs. monthly visitors) captured at different times, not a single consistent number; I'm not reconciling them into one figure.

Whatever the December 2025 "Discover Page" specifically was, it is near-certain it also launched on top of this pre-existing base (ArtConnect has been operating as a community platform since 2011), not as a from-scratch empty directory. I could not find a description of the Discover page specifically as a *new, separate* product from the rest of ArtConnect — the live `artconnect.com/discover` page today functions as a continuation of ArtConnect's existing artist/curator/organization profile system, with tabs for Artists / Curators / Organizations and pagination (i.e., it's deep, not a thin single page of five people — when I fetched it directly, five profiles rendered on the first page with working pagination controls, each with populated "Recently Added Artworks" galleries, no visible placeholder or empty-state content).

**Moderation/spam-prevention pattern.** Two real, verifiable mechanisms, both documented on ArtConnect's own help/magazine content:
1. **Verification badges for organizations, not individual artists.** A blue check mark denotes an organization ArtConnect has vetted as "well-established" with "positive feedback from the artist community or longevity in operations" (`magazine.artconnect.com/editorial/relaunch`; reiterated in `magazine.artconnect.com/a-safer-environment-for-artists`). This is opt-in/applied-for, not automatic. I found no equivalent verification badge described for individual artist profiles — moderation there appears to rely on the second mechanism.
2. **User-driven reporting, not upfront gating.** Every post/profile has a "Report" button; ArtConnect states it reviews reports and acts on confirmed abuse (`artconnect.zendesk.com` help article "How do I report spam or abuse?"; `magazine.artconnect.com/a-safer-environment-for-artists`). The safer-environment article also mentions *planned* (not yet live at time of writing) additions: a quality-scoring system, user reviews/ratings, and mandatory photos for residency listings. I could not confirm whether any of these shipped by the Dec 2025 Discover launch specifically.

I found no description of automated spam/bot detection, profile-completeness gating, or a minimum-activity threshold before a profile appears in Discover — the visible pattern is: open signup → profile appears → community reporting + org-side verification badges as the trust layer, not a moderation wall before appearing.

## What this implies for Fellow.'s Discover v1

- ArtConnect's directory has never had to solve the "day-one empty" problem in the way Fellow. will, because it always launched directory-style features on top of years of accumulated profiles. This is not a directly transferable precedent for how thin Fellow. can look — it's evidence that the comparison product's apparent depth is inherited, not evidence that a thin directory works fine on day one.
- The moderation model that *is* transferable and cheap: a visible Report control on every profile from day one, plus treating "verification" as something you can bootstrap manually while small (Fellow. already has the concept of trust stamps in the Hub — the same visible-badge pattern could extend to profiles without new infrastructure).
- Because I could not confirm the specific Dec 2025 launch mechanics, I'd treat "does ArtConnect's Discover look thin or dense on day one" as **still an open question** rather than resolved — if this matters for a go/no-go on Discover v1's launch cosmetics, it's worth a follow-up pass specifically trying to find that article via ArtConnect's own sitemap/RSS or an internet-archive lookup (I did not have Wayback Machine access in this session — `web.archive.org` fetches were blocked by my tooling).

## Sources actually opened

- https://www.magazine.artconnect.com/editorial/relaunch
- https://www.artconnect.com/discover
- https://www.magazine.artconnect.com/a-safer-environment-for-artists
- https://artconnect.zendesk.com/hc/en-us/articles/8171176109970-How-do-I-report-spam-or-abuse (via search result summary; page content matches Zendesk help-center conventions)
- https://www.trustpilot.com/review/artconnect.com (surfaced, not deeply read)
