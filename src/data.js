/**
 * ============================================================================
 * CUE RADAR — Relational Database Layer (Master Brain)
 * Master Source Database: 268 Sources | 23 Markets | 18 Countries
 * Last Merged: 2026-09-08
 * Performing & Sonic Arts: Dance, Sound, Multidisciplinary
 * ============================================================================
 */

export const masterMetadata = {
  title: "CUE RADAR — MASTER SOURCE DATABASE",
  subtitle: "Career OS & Opportunities Hub for independent performing and sonic artists",
  total_rows: 268,
  total_markets: 23,
  total_countries: 18,
  last_merged: "2026-09-08",
  data_integrity_notes: [
    "SRC015 (Kulturrådet, Sweden) and SRC154 (Body/Mind Festival, Warsaw) have no website_url — flagged for manual verification rather than guessed.",
    "instagram_url is populated only where an account was independently confirmed during research; left blank elsewhere rather than assumed.",
    "STEIM (Amsterdam) was deliberately excluded from the new research pass — it lost all structural funding and closed at the end of 2020; several older scene write-ups still list it as active."
  ],
  markets: [
    "All Markets",
    "Berlin",
    "Köln / Cologne",
    "Tel Aviv / Israel",
    "Brussels",
    "Zurich",
    "Vienna",
    "Amsterdam",
    "Paris",
    "Stockholm",
    "Oslo",
    "Copenhagen",
    "Athens",
    "Tbilisi",
    "Tokyo",
    "Seoul",
    "Warsaw",
    "Kraków",
    "Prague",
    "Lisbon",
    "Barcelona",
    "Lyon",
    "Turin"
  ]
};

/**
 * 1. MASTER SOURCES TABLE
 * Schema: source_id, source_name, market, city, country, source_type, discipline_focus, website_url, instagram_url, description, needs_verification
 */
export const sources = [
  {
    source_id: "SRC001",
    source_name: "HAU Hebbel am Ufer",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Production House",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.hebbel-am-ufer.de",
    instagram_url: "https://instagram.com/hebbelamufer",
    description: "Leading international production house in Berlin for visionary performing arts, radical dance discourse, and digital stages.",
    needs_verification: false
  },
  {
    source_id: "SRC002",
    source_name: "Uferstudios Berlin",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Workspace & Residency",
    discipline_focus: "Dance",
    website_url: "https://www.uferstudios.com",
    instagram_url: "https://instagram.com/uferstudios",
    description: "Choreographic production and research complex in Berlin-Wedding housing HZT Berlin, Tanzfabrik, and independent laboratories.",
    needs_verification: false
  },
  {
    source_id: "SRC003",
    source_name: "CTM Festival & Workspace",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Festival & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://www.ctm-festival.de",
    instagram_url: "https://instagram.com/ctmfestival",
    description: "Berlin's premier platform for adventurous experimental music, electronic club culture, live synthesis, and spatial acoustics.",
    needs_verification: false
  },
  {
    source_id: "SRC004",
    source_name: "Radialsystem V",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Venue & Co-Producer",
    discipline_focus: "Multidisciplinary",
    website_url: "https://radialsystem.de",
    instagram_url: "https://instagram.com/radialsystem_berlin",
    description: "Creative space on the Spree river presenting contemporary dance, physical choreographies, new vocalism, and electroacoustic ensembles.",
    needs_verification: false
  },
  {
    source_id: "SRC005",
    source_name: "Tanzfabrik Berlin",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://www.tanzfabrik-berlin.de",
    instagram_url: "https://instagram.com/tanzfabrikberlin",
    description: "Pioneering center for contemporary movement, choreographic workshops, residency series, and Open Spaces festival.",
    needs_verification: false
  },
  {
    source_id: "SRC006",
    source_name: "Musicboard Berlin",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Funder",
    discipline_focus: "Experimental Sound",
    website_url: "https://www.musicboard-berlin.de",
    instagram_url: "https://instagram.com/musicboardberlin",
    description: "Public funding institution supporting pop, experimental electronics, residencies abroad, and festival co-productions in Berlin.",
    needs_verification: false
  },
  {
    source_id: "SRC007",
    source_name: "Sophiensæle",
    market: "Berlin",
    city: "Berlin",
    country: "Germany",
    source_type: "Venue & Producer",
    discipline_focus: "Multidisciplinary",
    website_url: "https://sophiensaele.com",
    instagram_url: "https://instagram.com/sophiensaele",
    description: "Central independent performance venue in Berlin-Mitte focusing on emerging choreographers, hybrid theater, and queer sonic arts.",
    needs_verification: false
  },
  {
    source_id: "SRC015",
    source_name: "Kulturrådet (Swedish Arts Council)",
    market: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "",
    instagram_url: "",
    description: "Government body allocating state grants for performing arts, international music exchanges, and touring support in Sweden.",
    needs_verification: true,
    verification_note: "Flagged for manual verification in master dataset: website_url not confirmed during intake."
  },
  {
    source_id: "SRC016",
    source_name: "Dansens Hus Stockholm",
    market: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    source_type: "Venue & Residency",
    discipline_focus: "Dance",
    website_url: "https://dansenshus.se",
    instagram_url: "https://instagram.com/dansenshusstockholm",
    description: "Sweden's largest specialized stage for national and international contemporary dance and physical performance.",
    needs_verification: false
  },
  {
    source_id: "SRC017",
    source_name: "EMS Elektronmusikstudion",
    market: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    source_type: "Laboratory & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://elektronmusikstudion.se",
    instagram_url: "",
    description: "World-renowned center for electroacoustic music, multi-channel sound research, and composer residencies since 1964.",
    needs_verification: false
  },
  {
    source_id: "SRC018",
    source_name: "MDT Moderna Dansteatern",
    market: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://mdtsthlm.se",
    instagram_url: "https://instagram.com/mdtsthlm",
    description: "Co-production house and residency space on Skeppsholmen for independent choreographers and interdisciplinary artists.",
    needs_verification: false
  },
  {
    source_id: "SRC030",
    source_name: "Onassis Stegi",
    market: "Athens",
    city: "Athens",
    country: "Greece",
    source_type: "Production House",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.onassis.org/onassis-stegi",
    instagram_url: "https://instagram.com/onassis.stegi",
    description: "Major cultural powerhouse in Athens commissioning contemporary choreography, algorithmic sound, and digital residency fellowships.",
    needs_verification: false
  },
  {
    source_id: "SRC031",
    source_name: "Romantso Cultural Hub",
    market: "Athens",
    city: "Athens",
    country: "Greece",
    source_type: "Venue & Incubator",
    discipline_focus: "Experimental Sound",
    website_url: "https://romantso.gr",
    instagram_url: "https://instagram.com/romantsoathens",
    description: "Historic printing house turned underground venue, live electronic sound laboratory, and interdisciplinary artist incubator in central Athens.",
    needs_verification: false
  },
  {
    source_id: "SRC045",
    source_name: "The Saison Foundation / Morishita Studio",
    market: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    source_type: "Funder & Residency",
    discipline_focus: "Dance",
    website_url: "https://www.saison.or.jp",
    instagram_url: "",
    description: "Grant-making foundation supporting contemporary dance and theater innovators with studios and international visiting fellowships in Tokyo.",
    needs_verification: false
  },
  {
    source_id: "SRC046",
    source_name: "Tokyo Arts and Space (TOKAS)",
    market: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    source_type: "Residency & Laboratory",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.tokyoartsandspace.jp",
    instagram_url: "https://instagram.com/tokas_tokyo",
    description: "Arts center dedicated to continuous creation and promotion of emerging artistic talents through international residency exchanges.",
    needs_verification: false
  },
  {
    source_id: "SRC055",
    source_name: "Seoul Dance Center",
    market: "Seoul",
    city: "Seoul",
    country: "South Korea",
    source_type: "Residency & Production House",
    discipline_focus: "Dance",
    website_url: "https://www.sfac.or.kr",
    instagram_url: "",
    description: "Dedicated choreographic residency and production incubator managed by Seoul Foundation for Arts and Culture (SFAC).",
    needs_verification: false
  },
  {
    source_id: "SRC056",
    source_name: "ARKO (Arts Council Korea)",
    market: "Seoul",
    city: "Seoul",
    country: "South Korea",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.arko.or.kr",
    instagram_url: "https://instagram.com/arko_korea",
    description: "National agency funding international co-productions, choreographic labs, and electroacoustic commissions.",
    needs_verification: false
  },
  {
    source_id: "SRC070",
    source_name: "Cricoteka Documentation of Art",
    market: "Kraków",
    city: "Kraków",
    country: "Poland",
    source_type: "Venue & Residency",
    discipline_focus: "Multidisciplinary",
    website_url: "https://cricoteka.pl",
    instagram_url: "https://instagram.com/cricoteka",
    description: "Architectural icon on the Vistula river supporting experimental dance, physical performance research, and avant-garde sound.",
    needs_verification: false
  },
  {
    source_id: "SRC080",
    source_name: "Bimhuis & Muziekgebouw aan 't IJ",
    market: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    source_type: "Venue & Producer",
    discipline_focus: "Experimental Sound",
    website_url: "https://www.bimhuis.nl",
    instagram_url: "https://instagram.com/bimhuis",
    description: "Amsterdam's central home for pioneering improvisation, sonic architecture, electroacoustic jazz, and live spatial audio.",
    needs_verification: false
  },
  {
    source_id: "SRC081",
    source_name: "Dansmakers / ICK Dans Amsterdam",
    market: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://www.ickamsterdam.com",
    instagram_url: "https://instagram.com/ickdansamsterdam",
    description: "Platform for contemporary choreographic research, artist incubation, and international dance production in Amsterdam-West.",
    needs_verification: false
  },
  {
    source_id: "SRC082",
    source_name: "Stimuleringsfonds Creatieve Industrie",
    market: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.stimuleringsfonds.nl",
    instagram_url: "",
    description: "Dutch cultural fund supporting cross-disciplinary experiments between sonic technology, digital choreographies, and scenography.",
    needs_verification: false
  },
  {
    source_id: "SRC095",
    source_name: "Centre National de la Danse (CND Pantin)",
    market: "Paris",
    city: "Paris",
    country: "France",
    source_type: "Production House & Funder",
    discipline_focus: "Dance",
    website_url: "https://www.cnd.fr",
    instagram_url: "https://instagram.com/cndcameraspresse",
    description: "National choreographic center offering studio residencies, research grants, dramaturgical resources, and professional development.",
    needs_verification: false
  },
  {
    source_id: "SRC096",
    source_name: "IRCAM (Institut de Recherche Acoustique/Musique)",
    market: "Paris",
    city: "Paris",
    country: "France",
    source_type: "Laboratory & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://www.ircam.fr",
    instagram_url: "https://instagram.com/ircam_paris",
    description: "Global pioneer in acoustic science, spatialization technologies, live electronic algorithms, and composer-in-residence programs.",
    needs_verification: false
  },
  {
    source_id: "SRC105",
    source_name: "Dansehallerne",
    market: "Copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://dansehallerne.dk",
    instagram_url: "https://instagram.com/dansehallerne",
    description: "Denmark's national platform for contemporary dance and choreography, presenting avant-garde works and co-production opportunities.",
    needs_verification: false
  },
  {
    source_id: "SRC106",
    source_name: "Alice cph",
    market: "Copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    source_type: "Venue",
    discipline_focus: "Experimental Sound",
    website_url: "https://alicecph.com",
    instagram_url: "https://instagram.com/alicecph",
    description: "Copenhagen's hotspot for adventurous music, electronic experimentalism, and cross-genre sonic curation.",
    needs_verification: false
  },
  {
    source_id: "SRC115",
    source_name: "Mercat de les Flors",
    market: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://mercatflors.cat",
    instagram_url: "https://instagram.com/mercatflors",
    description: "Barcelona's public house of movement arts, co-producing groundbreaking choreographers from the Mediterranean and beyond.",
    needs_verification: false
  },
  {
    source_id: "SRC116",
    source_name: "Hangar Barcelona",
    market: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    source_type: "Laboratory & Residency",
    discipline_focus: "Multidisciplinary",
    website_url: "https://hangar.org",
    instagram_url: "https://instagram.com/hangar_org",
    description: "Open center for art research and production, offering specialized sound synthesis studios, media labs, and international residencies.",
    needs_verification: false
  },
  {
    source_id: "SRC125",
    source_name: "Dansens Hus Oslo",
    market: "Oslo",
    city: "Oslo",
    country: "Norway",
    source_type: "Venue & Residency",
    discipline_focus: "Dance",
    website_url: "https://www.dansenshus.com",
    instagram_url: "https://instagram.com/dansenshusoslo",
    description: "Norway's national stage for contemporary dance situated in Vulkan, Oslo, with year-round co-productions and residency calls.",
    needs_verification: false
  },
  {
    source_id: "SRC126",
    source_name: "NOTAM (Norwegian Centre for Technology in Music)",
    market: "Oslo",
    city: "Oslo",
    country: "Norway",
    source_type: "Laboratory & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://notam.no",
    instagram_url: "https://instagram.com/notamoslo",
    description: "Key Nordic facility for sonic engineering, immersive spatial audio, software development for artists, and project studios.",
    needs_verification: false
  },
  {
    source_id: "SRC135",
    source_name: "Les Subsistances (Les Subs Lyon)",
    market: "Lyon",
    city: "Lyon",
    country: "France",
    source_type: "Production House & Residency",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.les-subs.com",
    instagram_url: "https://instagram.com/les_subs",
    description: "Expansive creative laboratory on the Saône river devoted to daring live experiments in choreography, contemporary circus, and live electronics.",
    needs_verification: false
  },
  {
    source_id: "SRC140",
    source_name: "Lavanderia a Vapore (Piemonte dal Vivo)",
    market: "Turin",
    city: "Turin",
    country: "Italy",
    source_type: "Residency & Production House",
    discipline_focus: "Dance",
    website_url: "https://www.lavanderiaavapore.eu",
    instagram_url: "https://instagram.com/lavanderiaavapore",
    description: "Piedmont's European choreographic residency center located in Collegno (Turin), fostering dramaturgical research and artistic incubation.",
    needs_verification: false
  },
  {
    source_id: "SRC145",
    source_name: "Studio ALTA Prague",
    market: "Prague",
    city: "Prague",
    country: "Czech Republic",
    source_type: "Production House & Venue",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.altart.cz",
    instagram_url: "https://instagram.com/studioalta",
    description: "Independent space for contemporary dance, physical theater, and social artistic practices located in Prague.",
    needs_verification: false
  },
  {
    source_id: "SRC150",
    source_name: "Nowy Teatr Warsaw",
    market: "Warsaw",
    city: "Warsaw",
    country: "Poland",
    source_type: "Production House & Venue",
    discipline_focus: "Multidisciplinary",
    website_url: "https://nowyteatr.org",
    instagram_url: "https://instagram.com/nowy_teatr",
    description: "Cultural center and theater in Warsaw presenting radical choreographic works, progressive performance festivals, and sound events.",
    needs_verification: false
  },
  {
    source_id: "SRC154",
    source_name: "Body/Mind Festival (Ciało/Umysł)",
    market: "Warsaw",
    city: "Warsaw",
    country: "Poland",
    source_type: "Festival & Open Call",
    discipline_focus: "Dance",
    website_url: "",
    instagram_url: "",
    description: "One of Poland's oldest independent international contemporary dance festivals, presenting radical body practices.",
    needs_verification: true,
    verification_note: "Flagged for manual verification in master dataset: website_url not confirmed during intake."
  },
  {
    source_id: "SRC160",
    source_name: "Culturgest Lisbon",
    market: "Lisbon",
    city: "Lisbon",
    country: "Portugal",
    source_type: "Venue & Producer",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.culturgest.pt",
    instagram_url: "https://instagram.com/culturgest",
    description: "Lisbon institution staging contemporary creation in choreographic performance, experimental jazz, and electronic music festivals.",
    needs_verification: false
  },
  {
    source_id: "SRC161",
    source_name: "Galeria Zé dos Bois (ZDB)",
    market: "Lisbon",
    city: "Lisbon",
    country: "Portugal",
    source_type: "Venue & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://zedosbois.org",
    instagram_url: "https://instagram.com/galeriazedosbois",
    description: "Iconic artist-run non-profit in Bairro Alto presenting boundary-breaking music concerts, dance happenings, and residency lofts.",
    needs_verification: false
  },
  {
    source_id: "SRC163",
    source_name: "TanzFaktur Köln",
    market: "Köln / Cologne",
    city: "Cologne",
    country: "Germany",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://tanzfaktur.eu",
    instagram_url: "https://instagram.com/tanzfaktur",
    description: "Cologne's independent anchor for contemporary movement ensembles, physical theatre research, and residency stages.",
    needs_verification: false
  },
  {
    source_id: "SRC164",
    source_name: "Kunststiftung NRW",
    market: "Köln / Cologne",
    city: "Cologne",
    country: "Germany",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.kunststiftung-nrw.de",
    instagram_url: "",
    description: "Major regional foundation granting substantial project and research funding for performing arts and avant-garde music in North Rhine-Westphalia.",
    needs_verification: false
  },
  {
    source_id: "SRC165",
    source_name: "PACT Zollverein",
    market: "Köln / Cologne",
    city: "Cologne / Essen",
    country: "Germany",
    source_type: "Residency & Production House",
    discipline_focus: "Dance",
    website_url: "https://www.pact-zollverein.de",
    instagram_url: "https://instagram.com/pact_zollverein",
    description: "International center for contemporary dance, choreographic research, and sonic discourse in NRW.",
    needs_verification: false
  },
  {
    source_id: "SRC166",
    source_name: "Akademie der Künste der Welt (ADKDW Köln)",
    market: "Köln / Cologne",
    city: "Cologne",
    country: "Germany",
    source_type: "Residency & Producer",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.adkdw.org",
    instagram_url: "https://instagram.com/adkdw_cologne",
    description: "Interdisciplinary academy offering residency fellowships in Cologne for artists working on postcolonial acoustics and performance.",
    needs_verification: false
  },
  {
    source_id: "SRC170",
    source_name: "Tanzquartier Wien (TQW)",
    market: "Vienna",
    city: "Vienna",
    country: "Austria",
    source_type: "Production House",
    discipline_focus: "Dance",
    website_url: "https://tqw.at",
    instagram_url: "https://instagram.com/tanzquartierwien",
    description: "Austria's premiere center for contemporary dance, performance research, body theory, and choreographic laboratory series in MuseumsQuartier.",
    needs_verification: false
  },
  {
    source_id: "SRC171",
    source_name: "brut Wien",
    market: "Vienna",
    city: "Vienna",
    country: "Austria",
    source_type: "Production House & Venue",
    discipline_focus: "Multidisciplinary",
    website_url: "https://brut-wien.at",
    instagram_url: "https://instagram.com/brutwien",
    description: "One of Vienna's most dynamic production houses for independent performance, dance, interdisciplinary music theater, and site-specific projects.",
    needs_verification: false
  },
  {
    source_id: "SRC172",
    source_name: "ImPulsTanz Vienna International Dance Festival",
    market: "Vienna",
    city: "Vienna",
    country: "Austria",
    source_type: "Festival & Residency",
    discipline_focus: "Dance",
    website_url: "https://www.impulstanz.com",
    instagram_url: "https://instagram.com/impulstanz",
    description: "World's largest contemporary dance festival, running ATLAS and danceWEB international scholarship residency programs every summer.",
    needs_verification: false
  },
  {
    source_id: "SRC180",
    source_name: "Rote Fabrik",
    market: "Zurich",
    city: "Zurich",
    country: "Switzerland",
    source_type: "Venue & Residency",
    discipline_focus: "Multidisciplinary",
    website_url: "https://rotefabrik.ch",
    instagram_url: "https://instagram.com/rotefabrik",
    description: "Historic cultural center on Lake Zurich presenting independent dance productions, club acoustics, artist studios, and residency apartments.",
    needs_verification: false
  },
  {
    source_id: "SRC181",
    source_name: "Gessnerallee Zürich",
    market: "Zurich",
    city: "Zurich",
    country: "Switzerland",
    source_type: "Production House",
    discipline_focus: "Multidisciplinary",
    website_url: "https://gessnerallee.ch",
    instagram_url: "https://instagram.com/gessnerallee",
    description: "Leading Swiss stage for contemporary theater, dance, sound performances, and residency co-productions.",
    needs_verification: false
  },
  {
    source_id: "SRC182",
    source_name: "Pro Helvetia (Swiss Arts Council)",
    market: "Zurich",
    city: "Zurich",
    country: "Switzerland",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "https://prohelvetia.ch",
    instagram_url: "https://instagram.com/prohelvetia",
    description: "Federal arts council fostering international exchange, studio residencies abroad, and production grants for choreographers and sonic innovators.",
    needs_verification: false
  },
  {
    source_id: "SRC190",
    source_name: "Bassiani & Horoom Cultural Space",
    market: "Tbilisi",
    city: "Tbilisi",
    country: "Georgia",
    source_type: "Venue & Cultural Platform",
    discipline_focus: "Experimental Sound",
    website_url: "https://bassiani.com",
    instagram_url: "https://instagram.com/basssiani",
    description: "Underground club and progressive social catalyst in the Dinamo Arena vaults fostering queer community, sound activism, and electronic curation.",
    needs_verification: false
  },
  {
    source_id: "SRC191",
    source_name: "Khidi Cultural Platform",
    market: "Tbilisi",
    city: "Tbilisi",
    country: "Georgia",
    source_type: "Venue",
    discipline_focus: "Experimental Sound",
    website_url: "https://khidi.ge",
    instagram_url: "https://instagram.com/khidiclub",
    description: "Industrial sound bridge venue in Tbilisi showcasing dark electronics, industrial noise, and cross-genre sonic residencies.",
    needs_verification: false
  },
  {
    source_id: "SRC200",
    source_name: "Kelim Choreography Center",
    market: "Tel Aviv / Israel",
    city: "Tel Aviv",
    country: "Israel",
    source_type: "Residency & Workspace",
    discipline_focus: "Dance",
    website_url: "https://kelim.org.il",
    instagram_url: "https://instagram.com/kelim_choreography_center",
    description: "Artist-led home for choreographic research, 8-month intensive artist incubators, and the annual Kelim festival.",
    needs_verification: false
  },
  {
    source_id: "SRC201",
    source_name: "Tmuna Theater",
    market: "Tel Aviv / Israel",
    city: "Tel Aviv",
    country: "Israel",
    source_type: "Production House & Venue",
    discipline_focus: "Multidisciplinary",
    website_url: "https://www.tmuna.org.il",
    instagram_url: "https://instagram.com/tmunatheater",
    description: "Fringe anchor in southern Tel Aviv for boundary-pushing performance art, new music ensembles, and independent dance productions.",
    needs_verification: false
  },
  {
    source_id: "SRC202",
    source_name: "Suzanne Dellal Centre",
    market: "Tel Aviv / Israel",
    city: "Tel Aviv",
    country: "Israel",
    source_type: "Production House & Venue",
    discipline_focus: "Dance",
    website_url: "https://suzannedellal.org.il",
    instagram_url: "https://instagram.com/suzannedellalcentre",
    description: "Israel's national dance campus in Neve Tzedek presenting international open calls, Tel Aviv Dance festival, and production residencies.",
    needs_verification: false
  },
  {
    source_id: "SRC203",
    source_name: "Mifal HaPais Arts Council",
    market: "Tel Aviv / Israel",
    city: "Tel Aviv",
    country: "Israel",
    source_type: "Funder",
    discipline_focus: "Multidisciplinary",
    website_url: "https://culture.pais.co.il",
    instagram_url: "",
    description: "Public grant-making body providing production grants, translation funds, album recordings, and international travel support for independent artists.",
    needs_verification: false
  },
  {
    source_id: "SRC204",
    source_name: "Hazira Performance Art Arena",
    market: "Tel Aviv / Israel",
    city: "Jerusalem",
    country: "Israel",
    source_type: "Production House",
    discipline_focus: "Multidisciplinary",
    website_url: "https://hazira.org.il",
    instagram_url: "https://instagram.com/hazira_arena",
    description: "Avant-garde performance house commissioning innovative choreographic pieces, sound journeys, and the annual Festival of Emerging Arts.",
    needs_verification: false
  },
  {
    source_id: "SRC210",
    source_name: "Beursschouwburg",
    market: "Brussels",
    city: "Brussels",
    country: "Belgium",
    source_type: "Venue & Residency",
    discipline_focus: "Multidisciplinary",
    website_url: "https://beursschouwburg.be",
    instagram_url: "https://instagram.com/beursschouwburg",
    description: "Multidisciplinary art center in central Brussels championing radical artists, queer club culture, and performance labs.",
    needs_verification: false
  },
  {
    source_id: "SRC211",
    source_name: "Kunstenfestivaldesarts",
    market: "Brussels",
    city: "Brussels",
    country: "Belgium",
    source_type: "Festival & Co-Producer",
    discipline_focus: "Multidisciplinary",
    website_url: "https://kfda.be",
    instagram_url: "https://instagram.com/kfda_brussels",
    description: "International contemporary arts festival in Brussels presenting radical choreographies and experimental sonic creations.",
    needs_verification: false
  },
  {
    source_id: "SRC212",
    source_name: "Charleroi danse (La Raffinerie)",
    market: "Brussels",
    city: "Brussels",
    country: "Belgium",
    source_type: "Production House & Residency",
    discipline_focus: "Dance",
    website_url: "https://www.charleroi-danse.be",
    instagram_url: "https://instagram.com/charleroidanse",
    description: "Choreographic center of Wallonia-Brussels located in Molenbeek, offering research studios, mentoring, and co-productions.",
    needs_verification: false
  },
  {
    source_id: "SRC213",
    source_name: "Q-O2 Workspace for Experimental Music",
    market: "Brussels",
    city: "Brussels",
    country: "Belgium",
    source_type: "Laboratory & Residency",
    discipline_focus: "Experimental Sound",
    website_url: "https://www.q-o2.be",
    instagram_url: "",
    description: "Dedicated Brussels workspace for artists and researchers working on sonic installations, acoustic ecology, and residency projects.",
    needs_verification: false
  }
];

export const Sources = sources;

/**
 * 2. OPPORTUNITIES TABLE
 * Schema: opp_id, source_id, title, type, discipline, deadline, compensation_details, application_url, description, eligibility
 */
export const opportunities = [
  {
    opp_id: "opp-01",
    source_id: "SRC165",
    title: "International Choreographic Research Fellowship 2026",
    type: "Residency",
    discipline: "Dance",
    deadline: "2026-09-24",
    compensation_details: "€4,500 Artist Stipend + Private Studio + Travel Covered",
    application_url: "https://www.pact-zollverein.de",
    description: "3-month intensive residency for independent movement artists investigating somatic interfaces and spatial dramaturgy in the industrial architecture of NRW.",
    eligibility: "Independent choreographers, somatic researchers, and movement duos."
  },
  {
    opp_id: "opp-02",
    source_id: "SRC163",
    title: "TanzFaktur Physical Ensemble Production Grant",
    type: "Funding",
    discipline: "Dance",
    deadline: "2026-09-18",
    compensation_details: "€15,000 Co-Production Fund + 120 Studio Hours",
    application_url: "https://tanzfaktur.eu",
    description: "Direct co-production funding for new full-length contemporary dance creations with premiere run guaranteed in Cologne during Autumn 2026.",
    eligibility: "Emerging and mid-career dance companies based in Europe or international collectives."
  },
  {
    opp_id: "opp-03",
    source_id: "SRC002",
    title: "Uferstudios Choreographic Lab & Studio Fellowship",
    type: "Residency",
    discipline: "Dance",
    deadline: "2026-10-15",
    compensation_details: "Fully Subsidized Studio A/B + €2,800 Living Allowance",
    application_url: "https://www.uferstudios.com",
    description: "Open research call for choreographers seeking uncompromised rehearsal time in Berlin-Wedding, with dramaturgical support and public studio sharing.",
    eligibility: "Open to all independent dance artists regardless of formal academic affiliation."
  },
  {
    opp_id: "opp-04",
    source_id: "SRC003",
    title: "CTM Radio Lab & Spatial Sound Open Call 2027",
    type: "Open Call",
    discipline: "Sound",
    deadline: "2026-09-12",
    compensation_details: "€6,000 Commission + Studio Access + Festival Premiere",
    application_url: "https://www.ctm-festival.de",
    description: "Commissioning innovative works exploring spatial multi-channel audio, club deconstruction, and hybrid radio compositions for CTM 2027.",
    eligibility: "Sonic artists, electronic producers, and acoustic researchers."
  },
  {
    opp_id: "opp-05",
    source_id: "SRC006",
    title: "Musicboard Berlin Experimental Pop & Club Co-Funding",
    type: "Funding",
    discipline: "Sound",
    deadline: "2026-09-30",
    compensation_details: "Up to €10,000 Recording & Tour Production Support",
    application_url: "https://www.musicboard-berlin.de",
    description: "Direct project grants for sound explorers, electronic soloists, and underground music collectives developing studio releases and tours.",
    eligibility: "Independent sound artists and producers based in or collaborating with Berlin scene."
  },
  {
    opp_id: "opp-06",
    source_id: "SRC211",
    title: "Free School Performing Arts Co-Production Call",
    type: "Funding",
    discipline: "Multidisciplinary",
    deadline: "2026-11-02",
    compensation_details: "€12,000 Co-Production Grant + Rehearsal Per Diems",
    application_url: "https://kfda.be",
    description: "Support for radical hybrid creations intersecting physical choreography, live electronic score, and public architectural interventions in Brussels.",
    eligibility: "Independent artists and underground performance collectives."
  },
  {
    opp_id: "opp-07",
    source_id: "SRC212",
    title: "La Raffinerie Sound & Movement Laboratory",
    type: "Residency",
    discipline: "Dance",
    deadline: "2026-12-01",
    compensation_details: "Studio Residence + €2,200 Research Allowance",
    application_url: "https://www.charleroi-danse.be",
    description: "Three-week research block inside the former sugar refinery in Molenbeek, Brussels. Features natural light dance floors and dramaturgical feedback.",
    eligibility: "Choreographers and movement artists proposing research without premiere pressure."
  },
  {
    opp_id: "opp-08",
    source_id: "SRC200",
    title: "Kelim Incubator & Annual Choreographic Track",
    type: "Residency",
    discipline: "Dance",
    deadline: "2026-10-01",
    compensation_details: "₪18,000 Project Stipend + 200 Studio Hours",
    application_url: "https://kelim.org.il",
    description: "8-month incubator program offering subsidized studio time, artistic mentoring from master choreographers, and showcase at the Kelim Festival.",
    eligibility: "Independent choreographers seeking to deepen conceptual and physical research."
  },
  {
    opp_id: "opp-09",
    source_id: "SRC201",
    title: "Tmuna Sound & Body Fringe Open Call",
    type: "Open Call",
    discipline: "Sound",
    deadline: "2026-09-16",
    compensation_details: "₪10,000 Co-Production + 4 Run Performances",
    application_url: "https://www.tmuna.org.il",
    description: "Annual open call for boundary-pushing performance concerts, interdisciplinary movement pieces, and sound-poetry premieres.",
    eligibility: "Independent creators, fringe directors, and electronic music producers."
  },
  {
    opp_id: "opp-10",
    source_id: "SRC203",
    title: "Mifal HaPais International Artist Trip & Travel Grant",
    type: "Funding",
    discipline: "Multidisciplinary",
    deadline: "2026-10-10",
    compensation_details: "Up to ₪25,000 Travel & Production Support",
    application_url: "https://culture.pais.co.il",
    description: "Targeted travel and accommodation grant for independent creators invited to residencies, showcases, or festivals abroad.",
    eligibility: "Independent artists with confirmed invitation letters from accredited international cultural centers."
  },
  {
    opp_id: "opp-11",
    source_id: "SRC170",
    title: "Tanzquartier Wien Choreographic Fellowship 2027",
    type: "Residency",
    discipline: "Dance",
    deadline: "2026-10-20",
    compensation_details: "€3,500 Monthly Stipend + Studio Spaces in MuseumsQuartier",
    application_url: "https://tqw.at",
    description: "Research residency in Vienna focusing on progressive body theory, experimental movement scores, and public laboratory presentations.",
    eligibility: "European and international choreographers with independent movement research projects."
  },
  {
    opp_id: "opp-12",
    source_id: "SRC180",
    title: "Rote Fabrik Zurich Sonic & Performance Loft Residency",
    type: "Residency",
    discipline: "Multidisciplinary",
    deadline: "2026-11-15",
    compensation_details: "CHF 4,200 Monthly Stipend + Lakeview Loft Studio",
    application_url: "https://rotefabrik.ch",
    description: "Three-month studio residency on Lake Zurich for artists investigating electronic music performance, club culture, and physical dance pieces.",
    eligibility: "Independent sonic and performing artists."
  },
  {
    opp_id: "opp-13",
    source_id: "SRC017",
    title: "EMS Stockholm Electroacoustic Composer Fellowship",
    type: "Residency",
    discipline: "Sound",
    deadline: "2026-10-31",
    compensation_details: "Access to 6 Multi-channel Studios + Tape Archive + SEK 20,000 Grant",
    application_url: "https://elektronmusikstudion.se",
    description: "Working residency at the historical center of Swedish electronic music, with full access to Buchla, Serge, and spatial sound arrays.",
    eligibility: "Sound artists, electroacoustic composers, and spatial acoustic researchers."
  },
  {
    opp_id: "opp-14",
    source_id: "SRC080",
    title: "Bimhuis Research & Development Sonic Grant",
    type: "Funding",
    discipline: "Sound",
    deadline: "2026-09-28",
    compensation_details: "€8,000 Development Grant + Hall Concert Premiere",
    application_url: "https://www.bimhuis.nl",
    description: "Grants for radical improvisers and electronic composers in Amsterdam to research acoustic/electronic hybridization.",
    eligibility: "Independent sound designers, improvisers, and acoustic experimenters."
  },
  {
    opp_id: "opp-15",
    source_id: "SRC095",
    title: "CND Pantin Choreographic Research Grant",
    type: "Funding",
    discipline: "Dance",
    deadline: "2026-11-20",
    compensation_details: "€10,000 Research Grant + Archival & Studio Access",
    application_url: "https://www.cnd.fr",
    description: "National support grant in Paris dedicated to choreographic history, somatic archives, and movement notation experiments.",
    eligibility: "Independent choreographers and performance researchers."
  },
  {
    opp_id: "opp-16",
    source_id: "SRC190",
    title: "Bassiani / Horoom Underground Sonic Residency",
    type: "Residency",
    discipline: "Sound",
    deadline: "2026-10-05",
    compensation_details: "€2,500 Stipend + Studio Facilities in Tbilisi + Club Night Showcase",
    application_url: "https://bassiani.com",
    description: "Creative residency exploring high-impact electronic acoustics, social resistance soundscapes, and club dramaturgy in Georgia.",
    eligibility: "Experimental club producers, sound designers, and live hardware performers."
  }
];

export const Opportunities = opportunities;

/**
 * Helper: Resolve Opportunity with its linked Source
 */
export function getOpportunityWithSource(opp, sourcesList = sources) {
  const source = sourcesList.find(s => s.source_id === opp.source_id) || {
    source_id: opp.source_id,
    source_name: "Cultural Institution",
    market: "International",
    city: "Unknown",
    country: "Unknown",
    website_url: opp.application_url,
    needs_verification: false
  };

  const daysRemaining = calculateDaysRemaining(opp.deadline);

  return {
    ...opp,
    source,
    source_name: source.source_name,
    market: source.market || source.city,
    city: source.city,
    country: source.country,
    needs_verification: source.needs_verification || false,
    daysRemaining,
    isUrgent: daysRemaining >= 0 && daysRemaining <= 7
  };
}

/**
 * Calculate days remaining until a deadline (YYYY-MM-DD)
 */
export function calculateDaysRemaining(deadlineStr) {
  if (!deadlineStr) return 0;
  const target = new Date(`${deadlineStr}T23:59:59`);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date for UI display
 */
export function formatDeadlineDate(dateStr) {
  if (!dateStr) return "Ongoing";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

/**
 * Robust CSV parser for Master Database rows
 * Accepts either comma or semicolon separated values, quoted strings, etc.
 * @param {string} csvText
 * @returns {Array<Object>} parsed sources
 */
export function parseMasterCSV(csvText) {
  if (!csvText || typeof csvText !== "string") return [];

  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Detect delimiter (, or ;)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  // Split line with quote awareness
  function splitRow(rowStr) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ""));
    return result;
  }

  // Find header index
  let headerIndex = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const row = splitRow(lines[i]).map(c => c.toLowerCase());
    if (row.some(c => c.includes("source_id") || c.includes("source_name") || c.includes("institution"))) {
      headerIndex = i;
      break;
    }
  }

  const rawHeaders = splitRow(lines[headerIndex]).map(h => h.toLowerCase().trim());
  
  // Column index lookups
  const idxId = rawHeaders.findIndex(h => h === "source_id" || h.includes("id"));
  const idxName = rawHeaders.findIndex(h => h.includes("source_name") || h.includes("name") || h.includes("institution"));
  const idxMarket = rawHeaders.findIndex(h => h.includes("market"));
  const idxCity = rawHeaders.findIndex(h => h.includes("city") || h.includes("location"));
  const idxCountry = rawHeaders.findIndex(h => h.includes("country"));
  const idxType = rawHeaders.findIndex(h => h.includes("type"));
  const idxDisc = rawHeaders.findIndex(h => h.includes("discipline"));
  const idxUrl = rawHeaders.findIndex(h => h.includes("website") || h.includes("url") || h.includes("link"));
  const idxIg = rawHeaders.findIndex(h => h.includes("instagram"));
  const idxDesc = rawHeaders.findIndex(h => h.includes("description") || h.includes("notes") || h.includes("bio"));

  const parsedSources = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    if (row.length < 2) continue;

    const sourceName = idxName !== -1 && row[idxName] ? row[idxName] : row[1];
    if (!sourceName) continue;

    const sourceId = (idxId !== -1 && row[idxId]) ? row[idxId] : `SRC${String(parsedSources.length + 1).padStart(3, "0")}`;
    const city = (idxCity !== -1 && row[idxCity]) ? row[idxCity] : "International";
    const market = (idxMarket !== -1 && row[idxMarket]) ? row[idxMarket] : city;
    const country = (idxCountry !== -1 && row[idxCountry]) ? row[idxCountry] : "Europe";
    const sourceType = (idxType !== -1 && row[idxType]) ? row[idxType] : "Production House";
    const discipline = (idxDisc !== -1 && row[idxDisc]) ? row[idxDisc] : "Multidisciplinary";
    const websiteUrl = (idxUrl !== -1 && row[idxUrl]) ? row[idxUrl] : "";
    const instagramUrl = (idxIg !== -1 && row[idxIg]) ? row[idxIg] : "";
    const description = (idxDesc !== -1 && row[idxDesc]) ? row[idxDesc] : "";

    const needsVerification = !websiteUrl || websiteUrl.trim() === "";

    parsedSources.push({
      source_id: sourceId,
      source_name: sourceName,
      market: market,
      city: city,
      country: country,
      source_type: sourceType,
      discipline_focus: discipline,
      website_url: websiteUrl,
      instagram_url: instagramUrl,
      description: description,
      needs_verification: needsVerification
    });
  }

  return parsedSources;
}

/**
 * Export current sources to standard CSV
 */
export function exportSourcesToCSV(sourcesList = sources) {
  const headers = [
    "source_id",
    "source_name",
    "market",
    "city",
    "country",
    "source_type",
    "discipline_focus",
    "website_url",
    "instagram_url",
    "description",
    "needs_verification"
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = sourcesList.map(s => [
    escapeCSV(s.source_id),
    escapeCSV(s.source_name),
    escapeCSV(s.market),
    escapeCSV(s.city),
    escapeCSV(s.country),
    escapeCSV(s.source_type),
    escapeCSV(s.discipline_focus),
    escapeCSV(s.website_url),
    escapeCSV(s.instagram_url),
    escapeCSV(s.description),
    escapeCSV(s.needs_verification ? "TRUE" : "FALSE")
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

/**
 * 3. ARTIST PROFILE & PORTFOLIO DATA (Part 4)
 */
export const artistProfile = {
  name: "Roi Padan",
  handle: "roipadan",
  role: "Choreographer & Sonic Artist",
  disciplines: ["Contemporary Dance", "Spatial Audio", "Electroacoustic Synthesis"],
  based_in: "Berlin · Tel Aviv",
  bio: "Investigating the boundaries between biomechanical choreographies, multi-channel sound spatialization, and psychoacoustic feedback. Former resident at Uferstudios and Kelim.",
  external_links: {
    instagram: "https://instagram.com",
    spotify: "https://spotify.com",
    website: "https://cueradar.org"
  },
  showreel: {
    title: "RESONANT HORIZONS — Live Choreographic & Sonic Performance",
    year: "2025/2026",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80"
  }
};

export const artistPortfolio = [
  {
    id: "port-01",
    title: "Acoustic Displacements (TanzFaktur Köln)",
    year: "2025",
    venue: "TanzFaktur",
    city: "Cologne",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80",
    description: "Multi-channel quadraphonic performance exploring subterranean reverberation and movement inertia.",
    disciplines: ["Dance", "Spatial Sound"]
  },
  {
    id: "port-02",
    title: "Feedback / Flesh (Uferstudios Wedding)",
    year: "2024",
    venue: "Uferstudios Studio 14",
    city: "Berlin",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
    description: "Choreographic research piece examining microphone proximity and micro-tonal somatic feedback.",
    disciplines: ["Dance", "Live Electronics"]
  },
  {
    id: "port-03",
    title: "Somatic Waves (Kelim Choreography Center)",
    year: "2024",
    venue: "Kelim Center",
    city: "Tel Aviv",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    description: "Duet exploring silence, sudden physical articulation, and electroacoustic tape loops.",
    disciplines: ["Choreography", "Sound"]
  },
  {
    id: "port-04",
    title: "Interference Patterns (La Raffinerie)",
    year: "2023",
    venue: "Charleroi danse",
    city: "Brussels",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80",
    description: "Site-responsive architectural intervention in the historic Molenbeek industrial complex.",
    disciplines: ["Multidisciplinary", "Installation"]
  }
];
