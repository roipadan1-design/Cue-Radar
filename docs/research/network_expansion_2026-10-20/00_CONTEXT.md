# Context: Fellow. and the professional network we are building

> Read this file first, completely. It is the shared background for the three missions in this
> folder (`MISSION_A_…`, `MISSION_B_…`, `MISSION_C_…`). You do not need to act on anything here.
> The tasks are in the mission files. You have no prior knowledge of this project; everything you
> need is in this folder. If something is missing, say so in your report. Do not guess.

---

## 1. What Fellow. is

**Fellow.** is a small web product for **independent, cross-disciplinary artists**: contemporary
dancers, choreographers, performers, experimental musicians, sound artists, and visual artists whose
work crosses into performance or sound. (Live app: `cue-radar.vercel.app`; the code repo is still
called Cue Radar.)

It started as a feed of verified open calls, residencies and grants. It is now built around one
question: **"I'm in this city now. What's happening in my scene, and how do I get into it?"**

Three parts matter for your work:

1. **Explore the city**: events (performances, concerts, exhibitions, classes, workshops, talks,
   parties, meetups) by city and date.
2. **Discover**, with two directories:
   - **Organizations**: venues, spaces, collectives, festivals, schools, residencies, funders. Each
     has a page: name, "Type · City, Country", an **About** text, how to get in the door, upcoming
     events, links.
   - **Curators**: the *people* who programme and run the scene. Each has a page that looks like a
     professional profile: name, "Role · City, Country", an **About** text, fields, the
     organisations they work with, and **Contact**.
3. **Artist profile**: the artist's own page, so they can introduce themselves to people they meet.

**The goal of this phase is to turn the two directories into a real professional network:** a
visiting or local independent artist should be able to find the right person (the programmer, the
residency director, the festival producer, the gallery director) and **reach them directly**.
That is why *contact routes are now mandatory* on the site: every person and every organisation
that is shown must have at least one working way to get in touch.

## 2. Who it is for: the underground

The audience is **underground and alternative**, not mainstream: an artist who goes to an improv night
in a 40-person room, a butoh workshop, an artist-run gallery opening, a collective's club night.
They do **not** want stadium concerts, idol shows, musicals, tourist-format traditional performance,
or blockbuster "immersive" exhibitions.

What they value: **signal over volume** (ten strong picks beat a hundred listings), **doors that
open** (places and people a newcomer can actually approach), **context** (who runs what and why it
matters), and **trust** (everything is checked by a human; nothing is invented).

## 3. Where we are today

- **Pilot cities: Tokyo and Kyoto** (market keys `tokyo`, `kyoto`). A real client, an artist, is
  there now. Earlier research already produced **26 curators** (25 active, 1 inactive) and about
  **48 organisations** for Japan (see `input/`).
- The database also holds ~320 organisations for **other cities** (Berlin, Brussels, Tel Aviv,
  Seoul, Vienna and others, listed by name in `input/institutions_existing_other_markets.md`).
  Those cities are parked for now but will be switched on later, so the network must eventually
  cover them too.
- Disciplines we work with (database keys): `dance`, `music`, `sound`, `performance`, `painting`,
  `sculpture`, `visual_art`, `photography`, `film`, `theatre`. Priority order for the pilot is
  **dance, music, exhibitions (visual art)**, then performance, theatre, festivals, film.
  **We now want every one of these fields covered**, in every city we research.

## 4. How your output is used

Your CSVs are reviewed by a person and then imported into the **master database**, a Google Sheet
(`Fellow_Master_Database_v2`) that feeds the app's Postgres database. You cannot see the Sheet;
the relevant parts are exported into `input/`. Mapping:

| Your file | Master tab | Shown where |
|---|---|---|
| curators (people) | `curators` | Discover → Curators; page shows About, Fields, Contact, "Works with" |
| institutions (places) | `sources` | Discover → Organizations; page shows About, how to get in, events, links |

Technical limits you must respect:
- `market` is a database key: `tokyo`, `kyoto`, or another existing key (list in §7). For a new city
  use a proposed lowercase slug and list it under "proposed new
  markets" in your report; the team will add it.
- Dates `YYYY-MM-DD`. Multi-value cells are comma-separated inside one cell.
- `about` is capped at **1200 characters** by the database; we ask for 300 to 900.
- IDs: lowercase, hyphenated. People: `<city3>-cur-<family>-<given>` (e.g. `tyo-cur-okada-toshiki`,
  `kyo-cur-…`, `ber-cur-…`). Organisations: `<city3>-<slug>` (e.g. `tyo-forestlimit`).
  City prefixes: `tyo`, `kyo`, `tlv`, `ber`, `bru`, `vie`, `sel`, `par`, `ams`,
  `lis`, `ath`, `bcn`, … (three letters, state any new one in your report).

## 5. The underground filter (applies to people and organisations)

Score from 1 to 5. **Only 3 or higher goes into the deliverables.**

| Score | Meaning | Typical examples (by kind) |
|---|---|---|
| **5** | Core underground: artist-run, DIY, experimental, small rooms | improv/noise venues of 20–80 people; artist-run spaces; butoh and improv dance studios; DIY halls; zine/record shops that host shows |
| **4** | Independent and curatorially adventurous | independent galleries with emerging artists; mid-size live houses with experimental programming; small contemporary dance houses; collective-run club nights |
| **3** | Institution with an experimental programme, or a body that gives independent artists *access* | public arts centre with an experimental festival/residency; university gallery; a residency or funder an independent artist can actually apply to. **Include, and say so.** |
| **2** | Mainstream with an occasional edge | large commercial galleries; big clubs with commercial bookings. Leave out. |
| **1** | Mainstream | arenas, idol/J-pop, musicals, tourist-format traditional shows, blockbuster museum shows, large EDM. Leave out. |

For a **person**, the score is the score of the scene they programme or run, plus whether an
independent artist can realistically approach them. Traditional forms (noh, kabuki, gagaku, etc.)
count only when the presentation is experimental or contemporary, never tourist format.

## 6. Ground rules (apply to every mission)

1. **Nothing invented.** No people, places, roles, dates, links, e-mails, handles. A cell you could
   not verify stays **empty**. An empty cell is correct; a guess is a defect.
2. **Evidence on every row.** An `evidence_url` you actually opened (not a search snippet), plus
   `verified_at` (the date you checked). Blogs and listicles are leads, never evidence.
3. **Open the page.** Every fact (role, handle, e-mail, address) comes from a page you opened and
   read. Do not copy from memory or from earlier articles. Venues close and people change jobs.
4. **Your own words.** `about` and `notes` are written by you. Never paste a bio or press text.
5. **Search in the local language as well as English.** Much of the scene never appears in English.
6. **Do not contact anyone.** No e-mails, DMs, follows, form submissions, or sign-ups. You only
   read public pages.
7. **Save as you go.** Write the output file after every ~15 verified rows. Do not keep everything
   for the end.
8. **Do not edit any file outside your output files.** The main session merges everything.

### 6.1 Contact data: what is allowed and what is not

Fellow. now **publishes contact routes** on person and organisation pages. This is a deliberate
product decision. It is only acceptable if the data is clean, so these rules are strict:

**Allowed**
- An e-mail address that the person or their organisation **publishes themselves** for professional
  contact, on a page you opened: their own site, the organisation's staff/contact page, a festival
  press/contact page, an open-call page. Copy it exactly. If the page shows it obfuscated
  ("name [at] example.com"), you may write it normally *only if the page itself spells it out*.
- Role or organisation addresses (`info@…`, `contact@…`, `program@…`, `press@…`): label them
  `organisation_role`, not personal.
- The person's **own professional website / portfolio**, their **own public professional
  Instagram** (see §6.2), and public professional pages (Linktree, note.com, X, Facebook page,
  LinkedIn) **only when linked from the person's own site or the organisation's official page, or
  the profile unmistakably belongs to the same person**.
- A **contact form URL** on the person's or organisation's official site.

**Not allowed, ever**
- **Guessing or constructing** an address (`firstname@domain`), even if the pattern is obvious.
- E-mail finders, data brokers, people-search sites, leaked databases, WHOIS, scraped directories.
- Personal phone numbers, home addresses, family information, age, anything outside professional
  work. (An organisation's **public venue phone and street address** are fine for organisations.)
- Private or clearly non-professional accounts (private Instagram, family/personal accounts).
- Portrait photos. The product shows initials only.

If you cannot find any legitimate route for a person, leave the contact cells empty and set
`best_contact_route = none`. The team will decide what to do. Do not fill the gap with a guess.

### 6.2 How to confirm an Instagram handle (the usual failure point)

A handle is accepted only if **at least one** of these is true, and you write which one in
`instagram_evidence`:
1. It is **linked from the person's/organisation's official website** or an official programme page.
2. The Instagram bio **links back to the official website** or names the organisation and role.
3. The organisation's official page **tags/credits that account** for that person.

A matching name alone is not enough. If you have a plausible candidate you cannot confirm, put it in
`instagram_candidate_url` with `identity_confidence = low` and leave `instagram_url` empty. Never
choose between two similar accounts by guessing; if unsure, say so in `contact_notes`.

## 7. Cities already in the database (market keys)

Active (pilot): `tokyo`, `kyoto`.
Parked: `akko`, `amsterdam`, `ashdod`, `athens`, `barcelona`, `bat_yam`, `beer_sheva`, `berlin`,
`brussels`, `caesarea`, `copenhagen`, `eilat`, `givatayim`, `haifa`, `herzliya`, `holon`,
`jerusalem`, `karmiel`, `krakow`, `cologne`, `lisbon`, `lyon`, `nazareth`, `oslo`, `paris`,
`prague`, `ramat_gan`, `rishon_lezion`, `seoul`, `stockholm`, `tbilisi`, `tel_aviv`, `turin`,
`vienna`, `warsaw`, `zurich`, plus `remote` (global networks).

## 8. Organisation types (`source_type`, database values)

`venue_music`, `live_house`, `club`, `dance_studio`, `theatre_small`, `gallery`, `artist_run_space`,
`art_centre`, `museum`, `festival`, `collective`, `label`, `school_workshop`, `residency`,
`shop_venue` (record shop, bookshop or café that hosts shows), `community_space`, `aggregator`,
`media`, `funder`, `platform`, `institution` (use only if nothing else fits), `network`.

## 9. What is in `input/`

| File | What it is |
|---|---|
| `curators_current.csv` | The 26 people already in the master, with their organisations' names and websites, and the links we already have |
| `institutions_existing_japan.csv` | The ~48 Japan organisations already in the master |
| `institutions_existing_other_markets.md` | Names of the ~320 organisations already in the master for other cities (for de-duplication) |

**De-duplicate against these files** before adding anything: match on name (romanised and local) and
on website domain. Do not add a person or an organisation that is already listed. If you find one
that is listed but has wrong or outdated data (closed venue, person left), report it in your
`corrections_log.md`.
