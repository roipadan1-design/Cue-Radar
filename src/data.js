/**
 * ============================================================================
 * CUE RADAR — Relational Database Layer (Supabase / REST API Schema)
 * Designed for independent artists across the Beachhead Market:
 * - Contemporary Dance & Physical Performance
 * - Experimental Sound & Electronic / Indie Music
 * Geographic Focus:
 * - Cologne (NRW, Germany)
 * - Berlin (Germany)
 * - Brussels (Belgium)
 * - Israel (Tel Aviv, Jerusalem, Bat Yam)
 * ============================================================================
 */

/**
 * 1. INSTITUTIONS TABLE
 * Permanent entities: Festivals, cultural foundations, independent theaters,
 * research labs, and sound workspaces.
 */
export const institutions = [
  {
    id: "inst-pact-nrw",
    name: "PACT Zollverein",
    city: "Essen",
    region: "Cologne / NRW",
    country: "Germany",
    type: "Residency & Performance House",
    focus: ["Contemporary Dance", "Performance Art", "Sonic Discourse"],
    website: "https://www.pact-zollverein.de",
    description: "Centrally situated in North Rhine-Westphalia's industrial heritage landscape, PACT is an acclaimed international center for contemporary dance, choreographic research, and sonic installations."
  },
  {
    id: "inst-tanzfaktur-koeln",
    name: "TanzFaktur Köln",
    city: "Cologne",
    region: "Cologne / NRW",
    country: "Germany",
    type: "Independent Dance Center & Venue",
    focus: ["Contemporary Movement", "Physical Theatre", "Improvisation"],
    website: "https://tanzfaktur.eu",
    description: "Cologne's vibrant anchor for autonomous dance ensembles, physical research, and international guest performances located in Köln-Poll."
  },
  {
    id: "inst-uferstudios-berlin",
    name: "Uferstudios Berlin",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    type: "Choreographic Production & Research Hub",
    focus: ["Contemporary Dance", "Experimental Movement", "Interdisciplinary"],
    website: "https://www.uferstudios.com",
    description: "A 14-studio complex in Berlin-Wedding housing HZT Berlin, Tanzfabrik, and Ada Studio, providing workspace and residencies for the independent performance scene."
  },
  {
    id: "inst-ctm-berlin",
    name: "CTM Festival & Workspace",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    type: "Festival & Sonic Research Initiative",
    focus: ["Experimental Music", "Club Culture", "Live Electronics"],
    website: "https://www.ctm-festival.de",
    description: "Berlin's forefront platform for adventurous, experimental music and sound art navigating contemporary club culture, critical theory, and spatial audio."
  },
  {
    id: "inst-kunstenfestival-brussels",
    name: "Kunstenfestivaldesarts",
    city: "Brussels",
    region: "Brussels",
    country: "Belgium",
    type: "International Contemporary Arts Festival",
    focus: ["Live Arts", "Choreography", "Mixed Media Performance"],
    website: "https://kfda.be",
    description: "Brussels' celebrated annual celebration of experimental performing arts, commissioning bold boundary-defying creations across international artists."
  },
  {
    id: "inst-charleroi-danse",
    name: "Charleroi danse (La Raffinerie)",
    city: "Brussels",
    region: "Brussels",
    country: "Belgium",
    type: "Choreographic Center of Wallonia-Brussels",
    focus: ["Dance Research", "Choreography", "Residencies"],
    website: "https://www.charleroi-danse.be",
    description: "Based across Charleroi and Brussels (La Raffinerie in Molenbeek), offering long-term creative incubation and technical labs for movement artists."
  },
  {
    id: "inst-kelim-israel",
    name: "Kelim Choreography Center",
    city: "Bat Yam / Tel Aviv",
    region: "Israel",
    country: "Israel",
    type: "Independent Choreographic Center",
    focus: ["Contemporary Dance", "Somatic Practice", "Artistic Research"],
    website: "https://kelim.org.il",
    description: "An artist-led workspace dedicated to choreographic research, professional dialogue, and the development of alternative movement practices outside commercial frameworks."
  },
  {
    id: "inst-tmuna-israel",
    name: "Tmuna Theater & Performance Lab",
    city: "Tel Aviv",
    region: "Israel",
    country: "Israel",
    type: "Fringe Performance Space & Music Venue",
    focus: ["Fringe Theatre", "Experimental Music", "Alternative Dance"],
    website: "https://www.tmuna.org.il",
    description: "Tel Aviv's underground cultural institution for exploratory contemporary dance, non-traditional music, fringe stage productions, and multidisciplinary open calls."
  },
  {
    id: "inst-pais-israel",
    name: "Mifal HaPais Arts & Culture Council",
    city: "Tel Aviv / National",
    region: "Israel",
    country: "Israel",
    type: "Public Arts Foundation & Grantor",
    focus: ["Production Grants", "Residency Support", "International Travel"],
    website: "https://culture.pais.co.il",
    description: "The primary grantmaker in Israel supporting autonomous creators with project production funding, translation grants, and overseas residency fellowships."
  }
];

/**
 * 2. LIVE OPPORTUNITIES TABLE
 * Open calls, production funding grants, and artistic residencies.
 * Relational link: institutionId -> institutions.id
 */
export const liveOpportunities = [
  {
    id: "cue-opp-nrw-01",
    institutionId: "inst-pact-nrw",
    title: "PACT Residency Programme 2026: Movement & Sonic Ecology",
    institution: "PACT Zollverein",
    city: "Essen",
    region: "Cologne / NRW",
    country: "Germany",
    category: ["Dance", "Residency"],
    disciplines: ["Contemporary Movement", "Physical Research", "Live Electronics"],
    grantAmount: "Studio + €3,400 Stipend + Travel",
    daysRemaining: 18,
    isUrgent: false,
    deadlineFormatted: "October 14, 2026",
    applicationFee: "Free to Apply",
    description: "Open to professional independent choreographers, dancers, sound artists, and interdisciplinary collectives. Includes 3–4 weeks of uninterrupted access to stage facilities, full technical support, sound engineering, and private accommodation.",
    eligibility: "Emerging and established independent artists based worldwide. Collective projects welcome.",
    applyUrl: "https://www.pact-zollverein.de"
  },
  {
    id: "cue-opp-nrw-02",
    institutionId: "inst-tanzfaktur-koeln",
    title: "Köln Dance Incubator & RHIZOME Open Call",
    institution: "TanzFaktur Köln",
    city: "Cologne",
    region: "Cologne / NRW",
    country: "Germany",
    category: ["Dance", "Funding"],
    disciplines: ["Contemporary Dance", "Site-Specific", "Physical Theatre"],
    grantAmount: "€6,500 Production Budget + Premiere Slot",
    daysRemaining: 5,
    isUrgent: true, // Urgent flag (< 7 days)
    deadlineFormatted: "September 19, 2026",
    applicationFee: "Free to Apply",
    description: "Production fellowship designed for bold choreographers developing site-specific or black-box contemporary movement work. Provides rehearsal hours in Cologne-Poll and guaranteed inclusion in the RHIZOME festival line-up.",
    eligibility: "Independent makers with an active base or collaborative link to the NRW cultural territory.",
    applyUrl: "https://tanzfaktur.eu"
  },
  {
    id: "cue-opp-ber-01",
    institutionId: "inst-uferstudios-berlin",
    title: "Uferstudios Choreographic Research Fellowship",
    institution: "Uferstudios Berlin",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    category: ["Dance", "Residency"],
    disciplines: ["Choreography", "Somatic Research", "Experimental Dance"],
    grantAmount: "Studio Access + €2,800 Monthly",
    daysRemaining: 12,
    isUrgent: false,
    deadlineFormatted: "October 8, 2026",
    applicationFee: "Free to Apply",
    description: "Offers independent performance researchers time and spatial freedom in Studio 14. Designed specifically for testing non-normative movement scores, peer feedback loops, and open laboratory sharing.",
    eligibility: "Autonomous choreographers and dancers residing in Berlin or traveling on an artist visa.",
    applyUrl: "https://www.uferstudios.com"
  },
  {
    id: "cue-opp-ber-02",
    institutionId: "inst-ctm-berlin",
    title: "CTM Radio Lab & Spatial Acoustics Commission",
    institution: "CTM Festival & Workspace",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    category: ["Sound", "Funding"],
    disciplines: ["Experimental Sound", "Modular Synthesis", "Spatial Audio"],
    grantAmount: "€5,000 Commission + Deutschlandfunk Kultur Broadcast",
    daysRemaining: 3,
    isUrgent: true, // Urgent (< 7 days)
    deadlineFormatted: "September 15, 2026",
    applicationFee: "None",
    description: "A prestigious commission celebrating sonic experimentation across radio, multichannel installations, and club architectures. Selected works are premiered during CTM Festival Berlin.",
    eligibility: "Solo experimental musicians, electronic producers, and sonic artists regardless of geographical origin.",
    applyUrl: "https://www.ctm-festival.de"
  },
  {
    id: "cue-opp-bru-01",
    institutionId: "inst-kunstenfestival-brussels",
    title: "Free School Performing Arts Co-Production Call",
    institution: "Kunstenfestivaldesarts",
    city: "Brussels",
    region: "Brussels",
    country: "Belgium",
    category: ["Dance", "Sound", "Residency"],
    disciplines: ["Experimental Performance", "Choreography", "Sound Art"],
    grantAmount: "€12,000 Co-production + Per Diems",
    daysRemaining: 24,
    isUrgent: false,
    deadlineFormatted: "November 2, 2026",
    applicationFee: "Free to Apply",
    description: "Support for radical hybrid creations that test the intersection of body, electronic score, and public space in Brussels. Selected projects receive residency time and premiere showcase.",
    eligibility: "Independent artists and underground collectives operating in Belgium and internationally.",
    applyUrl: "https://kfda.be"
  },
  {
    id: "cue-opp-bru-02",
    institutionId: "inst-charleroi-danse",
    title: "La Raffinerie Sound & Movement Laboratory",
    institution: "Charleroi danse (La Raffinerie)",
    city: "Brussels",
    region: "Brussels",
    country: "Belgium",
    category: ["Dance", "Residency"],
    disciplines: ["Contemporary Dance", "Contact Improvisation", "Live Score"],
    grantAmount: "Studio Residence + €2,200 Allowance",
    daysRemaining: 35,
    isUrgent: false,
    deadlineFormatted: "December 1, 2026",
    applicationFee: "Free to Apply",
    description: "Three-week research block inside the former sugar refinery in Molenbeek, Brussels. Features dance floors with natural light, audio monitors, and feedback sessions with dramaturgs.",
    eligibility: "Choreographers and movement artists proposing research without immediate production pressure.",
    applyUrl: "https://www.charleroi-danse.be"
  },
  {
    id: "cue-opp-isr-01",
    institutionId: "inst-kelim-israel",
    title: "Kelim Incubator & Annual Choreographic Track 2026",
    institution: "Kelim Choreography Center",
    city: "Bat Yam",
    region: "Israel",
    country: "Israel",
    category: ["Dance", "Residency"],
    disciplines: ["Choreography", "Contemporary Movement", "Somatic Theory"],
    grantAmount: "₪18,000 Project Stipend + 200 Rehearsal Hours",
    daysRemaining: 9,
    isUrgent: false,
    deadlineFormatted: "October 1, 2026",
    applicationFee: "Free to Apply",
    description: "Comprehensive 8-month incubator program in Bat Yam offering subsidized studio time, artistic mentoring from master choreographers, and a public showing at the Kelim Festival.",
    eligibility: "Independent choreographers in Israel seeking to deepen their conceptual and physical research.",
    applyUrl: "https://kelim.org.il"
  },
  {
    id: "cue-opp-isr-02",
    institutionId: "inst-tmuna-israel",
    title: "Tmuna Sound & Body Fringe Open Call",
    institution: "Tmuna Theater & Performance Lab",
    city: "Tel Aviv",
    region: "Israel",
    country: "Israel",
    category: ["Sound", "Dance", "Funding"],
    disciplines: ["Indie Music", "Avant-Garde Sound", "Physical Performance"],
    grantAmount: "₪10,000 Co-Production + 4 Run Performances",
    daysRemaining: 4,
    isUrgent: true, // Urgent (< 7 days)
    deadlineFormatted: "September 16, 2026",
    applicationFee: "Free to Apply",
    description: "Annual open call for boundary-pushing performance concerts, interdisciplinary movement pieces, and sound-poetry premieres for the underground halls of Tmuna.",
    eligibility: "Independent creators, fringe theater directors, and electronic music producers in Israel.",
    applyUrl: "https://www.tmuna.org.il"
  },
  {
    id: "cue-opp-isr-03",
    institutionId: "inst-pais-israel",
    title: "Mifal HaPais International Artist Trip & Travel Grant",
    institution: "Mifal HaPais Arts & Culture Council",
    city: "Tel Aviv / National",
    region: "Israel",
    country: "Israel",
    category: ["Funding"],
    disciplines: ["Choreography", "Electronic Music", "Performance"],
    grantAmount: "Up to ₪25,000 Travel & Production Support",
    daysRemaining: 15,
    isUrgent: false,
    deadlineFormatted: "October 10, 2026",
    applicationFee: "Free to Apply",
    description: "Targeted grant intended to cover flight tickets, accommodations, and per diems for independent creators invited to residencies or festivals abroad (such as in Berlin, Cologne, or Brussels).",
    eligibility: "Israeli independent artists with official invitation letters from accredited international cultural centers.",
    applyUrl: "https://culture.pais.co.il"
  }
];
