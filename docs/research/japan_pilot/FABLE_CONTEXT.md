# Context: Fellow. and the Kyoto / Tokyo pilot

> Background for the researcher working from `FABLE_PROMPT.md`. Read this first. It explains what
> the product is, who it's for, why this research matters, and how your files get used. You don't
> need to act on anything in this file. The task is in the prompt file.

---

## 1. What Fellow. is

**Fellow.** is a small web product for **independent, cross-disciplinary artists**: contemporary
dancers, choreographers, performers, experimental musicians, sound artists, and visual artists
whose work often crosses into performance or sound.

It began as a feed of verified open calls, residencies, and grants. **As of this pilot, the focus
has shifted.** The open-calls feed (we call it the *Hub*) is paused and marked "coming soon". The
product is now built around one question:

> **"I'm in this city now. What's happening in my scene today and this week, and how do I get
> into it?"**

The product has three parts that matter for this pilot:

1. **Explore the city** (in the app it is called *Currently*): pick a city and a date range and see
   performances, concerts, exhibitions, classes, workshops, talks, parties, and meetups worth
   catching, grouped by day.
2. **Places**: a directory of the venues, spaces, collectives, and festivals that make up a city's
   scene, each with a short "why it matters / how to get involved" note.
3. **Artist profile**: one page that shows who the artist is (practice, disciplines, current city
   and dates, links), so they can introduce themselves to the people they meet.

Live app: `cue-radar.vercel.app` (the brand is "Fellow."; the repo is still called Cue Radar).

## 2. Who it's for: the underground

The audience is **underground and alternative**, not mainstream. Think of an artist who goes to an
improv night in a 40-person room, takes a butoh workshop, ends up at an artist-run gallery opening,
and goes to a club night run by a collective afterwards. They do **not** want stadium concerts,
idol shows, musicals, tourist-format traditional performance, or blockbuster "immersive" exhibitions.

What they value:
- **Signal over volume.** Ten strong picks beat a hundred listings.
- **Doors that open.** Places where a newcomer can take part, not just watch: open classes, jams,
  workshops, open studios, and meetups.
- **Context.** Who runs a space, what its scene is, and why it matters.
- **Trust.** Everything is checked by a person. Nothing is scraped blindly, and nothing is made up.

## 3. Why this pilot, and why Kyoto and Tokyo

The product team is running an **immediate pilot with one real client, an artist who is in Kyoto
and Tokyo right now**. The pilot answers three questions:

1. **Is our content relevant?** Does a well-researched, underground-filtered "what's on" actually
   help an artist in a city they don't know well?
2. **Does it connect them?** Do they end up meeting people, joining classes, finding
   collaborators, and spotting opportunities through it?
3. **Does it inspire?** Does exposure to other disciplines and media in the city feed their own
   practice?

The pilot was previously scoped to 16 Israeli cities. **That scope is set aside.** The product is
now **Kyoto and Tokyo only**, and the research you do is the content the client will see.

Japan was chosen because the client is there. The difficulty is also the reason it is worth doing:
much of the scene is in Japanese only, spread across Instagram and small venue calendars, and hard
for an outsider to find. If the product works here, it works.

## 4. Discipline focus

Primary: **dance, music, exhibitions**. These three come first in everything.

- *Dance* includes contemporary, butoh and post-butoh, improvisation, contact improvisation,
  experimental choreography, open classes, labs, showings.
- *Music* includes experimental, improvised, noise, free jazz, electroacoustic, sound art, ambient
  and drone, and avant-garde club and electronic music.
- *Exhibitions* includes artist-run and project spaces, independent galleries, open studios, and
  cross-media shows.

Secondary: performance art, experimental theatre, festivals, masterclasses, talks, artist meetups,
curated parties, experimental film and video.

## 5. How your output is used

Your CSVs are imported into the product's **master database**, a Google Sheet that syncs to the
app's Postgres database. A person reviews every row before it goes live. Here is the mapping, so
you know why the columns are shaped the way they are:

| Your file | Database table | Notes |
|---|---|---|
| `places.csv` | `sources` | `source_id`, `name`, `source_type`, `market`, `discipline_focus`, `tier`, `website_url`, `instagram_url`, `scrape_method`, `status`, `notes` map directly. The other columns (neighbourhood, address, score, newcomer-friendliness, etc.) are new fields the team is adding for this pilot. |
| `events.csv` | `events` | `event_id`, `market`, `venue_name`, `title`, `event_type`, `disciplines`, `date`, `time`, `price_min`, `ticket_url`, `lat`, `lng` map directly. `end_date`, `description`, `lineup`, `recurrence`, score and the rest are new fields for this pilot. |
| `feeds.csv` | — | Used to build the weekly refresh process. Not shown to users. |
| `REPORT.md` | — | Read by the team and used to write the city guide copy and pick the "this week" highlights. |

Technical limits worth knowing:
- `market` must be exactly `kyoto` or `tokyo` (these are database keys).
- Dates are `YYYY-MM-DD`, times `HH:MM` 24-hour, all local Japan time.
- Multi-value cells are comma-separated in one cell.
- Descriptions are capped at **200 characters** by the database.
- Prices are numbers in JPY.

## 6. What's already in the database for Japan

An earlier, lighter pass added the places below. **None are guaranteed current.** Re-check each
one, include it in `places.csv` with its id in `existing_source_id`, and correct anything that has
changed (including marking it `closed`). Note that *Kyoto Experiment* was stored under Tokyo by
mistake. It belongs to `kyoto`.

| id | name | type as stored | website |
|---|---|---|---|
| SRC068 | TOKION | media | tokion.jp/en |
| SRC069 | DOMMUNE (Super Dommune) | venue | dommune.com |
| SRC070 | Ftarri | venue | ftarri.com/suidobashi |
| SRC071 | Higashi-Koenji 20000V | venue | (listed via tokyogigguide.com) |
| SRC072 | Kyoto Experiment | festival | kyoto-ex.jp |
| SRC073 | YPAM (Yokohama Intl Performing Arts Meeting) | festival | ypam.jp |
| SRC074 | Yokohama Dance Collection | festival | yokohama-dance-collection.jp |
| SRC075 | Kagurazaka Session House | venue | session-house.net |
| SRC076 | Youkobo Art Space | institution | youkobo.co.jp |
| SRC077 | The Saison Foundation | funder | saison.or.jp |
| SRC078 | Agency for Cultural Affairs (Bunka-cho) | funder | bunka.go.jp |
| SRC079 | Tokyo Jardin | platform | tokyojardin.org |
| SRC080 | Tokyo Sound Healing Meetup Group | platform | meetup.com |
| SRC081 | studio PLAYA | venue | studioplaya.com |
| SRC259 | Forestlimit | venue | forestlimit.com |
| SRC260 | Art Center Ongoing | institution | ongoing.jp |
| SRC261 | Design Festa | festival | designfesta.com |

Some of these may fail the underground filter. For example, *Design Festa* is a very large
commercial art fair and *Agency for Cultural Affairs* is a government funder, not a scene venue.
That's fine: include them with an honest score. If one scores below 3, list it in
`VERIFICATION_LOG.md` as "existing, below threshold" instead of in `places.csv`, so we know to
retire it.

There are **no real Japan events** in the database yet.

## 7. Starting leads (unverified, so check every one)

These names come from general knowledge, **not** from verified research. Some may have closed,
moved, or changed character. Treat them as places to start looking, never as facts. Don't stop at
this list. The point of the job is to go well past it.

**Tokyo**
- Music, experimental and improv: Ftarri (Suidobashi), Forestlimit (Hatagaya), Higashi-Koenji
  20000V, Ochiai Soup, Shinjuku Pit Inn (jazz, free-improv nights), WWW / WWW X (Shibuya; mixed,
  often adventurous bookings), SCOOL (Mitaka), DOMMUNE (streaming studio).
- Dance: Kagurazaka Session House, Morishita Studio (Saison Foundation), studio PLAYA, butoh
  lineages and workshops, the Dance New Air festival.
- Art: Art Center Ongoing (Kichijoji), BUoY (Kita-Senju), XYZ collective, Tokyo Arts and Space
  (TOKAS), Youkobo Art Space, Spiral (Aoyama), Tokyo Experimental Festival (TOKAS).
- Festivals and platforms: Sound Live Tokyo, Theater Commons Tokyo, Tokyo Festival, YPAM and
  Yokohama Dance Collection (Yokohama, day trip).
- Known closures to confirm and record: SuperDeluxe (Roppongi), 3331 Arts Chiyoda. Don't send
  anyone to a closed venue.

**Kyoto**
- Kyoto Experiment (international performing arts festival; check whether the 2026 edition falls
  inside the window), Kyoto Art Center, ROHM Theatre Kyoto (institutional; experimental programme
  only), @KCUA (Kyoto City University of Arts gallery), Villa Kujoyama (residency), JCDN (Japan
  Contemporary Dance Network, Kyoto-based), Urbanguild (live venue, experimental and dance),
  Club Metro, Kyoto University's Seibu Kodo (西部講堂, a historic DIY hall), Kyoto Art Theater
  Shunjuza, Kyoto Performing Arts Center (KPAC). KYOTOGRAPHIE is a spring photography festival:
  put it in the festival calendar, not in events.

**Listing sources to evaluate**
- Tokyo Art Beat (English and Japanese, exhibitions), Resident Advisor (Tokyo and Kansai club
  listings), Tokyo Gig Guide, Peatix (ticketing used by many small organisers), Tiget, LivePocket,
  Performing Arts Network Japan (Japan Foundation), JCDN, ART iT, Bijutsu Techo, ArtSticker,
  REALTOKYO, TOKION, and each venue's own スケジュール (schedule) page and Instagram.

## 8. What "good" looks like

A great result lets the client open the app on Monday morning in Kyoto and see:

- tonight: an improv set in a small room, with the cover charge and whether to book ahead;
- Wednesday: an open contemporary class taught in a way a non-Japanese speaker can follow;
- Thursday: an artist-run gallery opening where they can meet people;
- the weekend: a dance showing at a festival, and a collective's club night afterwards;
- under each place: one honest line on why it matters and how to get in the door.

And it lets the product team see, in one report, **how each city's scene is wired**: who connects
to whom, where the weekly rhythm is, and which ten feeds keep it current.

## 9. Ground rules (the same as in the prompt, because they matter most)

- **Nothing invented**: no places, events, names, dates, prices, or numbers that you didn't read on
  a real page. Leave cells empty instead of guessing.
- **Evidence on every row**: an `evidence_url` you actually opened, plus `verified_at`.
- **No personal data**: organisations and public line-ups only, with official contact routes.
- **Your own words**: no pasted press text.
- **Underground filter**: score 3 or higher only, with closed places kept and marked `closed`.
