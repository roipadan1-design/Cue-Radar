-- Japan pilot: curators batch 2 (2026-10-19). Source: docs/research/japan_pilot/results_2026-10-19/curators.csv, places.csv.
-- Upserts all 25 curators (refreshed text + 7 new Tokyo rows), 1 new place, hides Mai Endo (no delete).
BEGIN;
INSERT INTO public.sources (source_id, name, source_type, market, discipline_focus, tier, website_url, instagram_url, scrape_method, status, needs_verification, notes, name_ja, about, neighborhood, address, calendar_url, scene_tags, underground_score, newcomer_friendly, foreigner_notes, evidence_url, verified_at, is_demo) VALUES
  ('tyo-jazzartsengawa', 'JAZZ ART SENGAWA', 'festival', 'tokyo', ARRAY['music','sound','performance']::TEXT[], 2, NULL, NULL, 'manual', 'active', false, 'Artist-produced festival of improvised and genre-free music at a municipal small theatre; run by an artists'' executive committee since 2019', 'JAZZ ART せんがわ', 'Annual since 2008 at Chofu City Sengawa Theater. 2025: 11-14 Sep. A 2026 edition on 5-8 Nov appears only in search snippets; official site jazzartsengawa.com did not load. Confirm before adding events.', 'Sengawa (Chofu)', NULL, NULL, ARRAY['improvisation','free_jazz','festival','outdoor_stage']::TEXT[], 4, 'yes', 'Free outdoor stage (CLUB JAZZ Byobu) needs no ticket', 'https://www.artscouncil-tokyo.jp/en/grants/program/27293/', '2026-10-19', false)
ON CONFLICT (source_id) DO UPDATE SET name = EXCLUDED.name, about = EXCLUDED.about, notes = EXCLUDED.notes, evidence_url = EXCLUDED.evidence_url, verified_at = EXCLUDED.verified_at;
INSERT INTO public.curators (curator_id, name, name_ja, role_label, market, about, disciplines, affiliations, website_url, instagram_url, evidence_url, verified_at, status) VALUES
  ('kyo-cur-kawasaki-yoko', 'Yoko Kawasaki', '川崎陽子', 'Artistic director', 'kyoto', 'Yoko Kawasaki is co-artistic director of Kyoto Experiment, the Kyoto International Performing Arts Festival, a post shared with Yuya Tsukahara since the 2025 edition. The two directors shape the programme and write the festival''s yearly directors'' text.

The 2026 edition, the 17th, ran 3 to 25 October under the phrase ''Carrying a pebble in my pocket'', with a Shows programme built around memories and stories passed on through the body, alongside the festival''s other two programme strands.

For a visiting artist, Kyoto Experiment is the main yearly meeting point of the Kansai and international performing-arts world. Post-show talks are the natural place to say hello; the festival office is reachable through its official contact page.', ARRAY['dance','theatre','performance']::TEXT[], ARRAY['SRC072']::TEXT[], NULL, NULL, 'https://kyoto-ex.jp/en/news/2026-opening/', '2026-10-19', 'active'),
  ('kyo-cur-tsukahara-yuya', 'Yuya Tsukahara', '塚原悠也', 'Artistic director', 'kyoto', 'Yuya Tsukahara is co-artistic director of Kyoto Experiment, sharing the post with Yoko Kawasaki since the 2025 edition. Together they choose the works and set the festival''s annual theme.

In 2026 the festival''s 17th edition (3 to 25 October) took the idea of small pebbles carried in a pocket as its guide: works about memory, letters, migration and poetry conveyed through performance, presented across Kyoto''s theatres and other sites.

For a visiting artist, the festival''s closing week and its post-show events are the best chance to meet the people who programme contemporary performance in Kyoto. Contact goes through the festival''s official contact page, not personal channels.', ARRAY['performance','dance','theatre']::TEXT[], ARRAY['SRC072']::TEXT[], NULL, NULL, 'https://kyoto-ex.jp/en/news/2026-opening/', '2026-10-19', 'active'),
  ('kyo-cur-katsura-kan', 'Kan Katsura', '桂勘', 'Festival director', 'kyoto', 'Kan Katsura is a butoh dancer who organises the Kyoto International Butoh Festival. The festival credits him as organiser together with its executive committee. The 4th edition runs 7 to 15 November 2026, with evening performances by Japanese and international butoh artists, a daily workshop series, and paid live streaming.

Katsura also performs in the festival (13 November) and teaches one of its workshops (8 November). A pre-festival evening presented by Katsura takes place at UrBANGUILD on 26 October 2026.

For a visiting artist, the workshops and the UrBANGUILD pre-event are the most direct way in. The festival lists a public contact address on its site.', ARRAY['dance','performance','music']::TEXT[], ARRAY['kyo-butohfes','kyo-urbanguild','kyo-spacelfan']::TEXT[], NULL, NULL, 'https://kyoto-butohfes.com/kbf-2026/', '2026-10-19', 'active'),
  ('kyo-cur-okuyama-riko', 'Riko Okuyama', '奥山理子', 'Organiser', 'kyoto', 'Riko Okuyama is representative director of HAPS (Higashiyama Artists Placement Service), the Kyoto organisation that helps young artists live, make work and show in the city. HAPS calls itself a general consultation point for artists and for the people who support art.

Beyond help with studios and housing, HAPS has run its ''Art and Inclusive Society'' programme since 2017 and, since 2022, a commission from the Agency for Cultural Affairs to support arts activity by people with disabilities. It runs the HAPS office, HAPS HOUSE in Higashi-Kujo and the HAPS studio.

For a visiting artist, HAPS is the best first contact in Kyoto for practical questions and introductions to local people. Use the organisation''s contact page.', ARRAY['visual_art','performance']::TEXT[], ARRAY['kyo-haps']::TEXT[], NULL, NULL, 'https://haps-kyoto.com/about/', '2026-10-19', 'active'),
  ('kyo-cur-fujita-mizuho', 'Mizuho Fujita', '藤田瑞穂', 'Curator', 'kyoto', 'Mizuho Fujita is chief curator and programme director of @KCUA, the gallery of Kyoto City University of Arts. The gallery opened in 2010 as an off-campus space and moved onto the university''s new campus east of Kyoto Station in October 2023.

@KCUA shows special exhibitions planned by its curatorial staff, open-call shows by faculty, students and alumni, and workshops and lectures with visiting artists. The gallery describes Fujita''s work as cross-disciplinary exhibitions and projects made with specialists from other fields, recently around biodiversity and more-than-human perspectives.

For a visiting artist, openings and talks at @KCUA are where Kyoto''s art-school scene gathers.', ARRAY['visual_art']::TEXT[], ARRAY['kyo-kcua']::TEXT[], NULL, NULL, 'https://gallery.kcua.ac.jp/about/', '2026-10-19', 'active'),
  ('kyo-cur-ogura-emi', 'Emi Ogura', '小倉笑', 'Programmer', 'kyoto', 'Emi Ogura is a Kyoto-based dancer, choreographer and director, and co-programme director of the Kyoto International Dance Workshop Festival (''Kyoto no Atsui Natsu''), which Kyoto Art Center co-organises. Ogura has worked in Kyoto since 2014 and founded the creative group SMILE in 2021.

At the festival''s 2026 early-summer edition (2 to 6 May) Ogura led ''Dance in English'', a session that prepares participants for classes given by visiting teachers in English. Ogura also performs on Kyoto''s small stages, including FOuR DANCERS at UrBANGUILD on 27 October 2026.

For a visiting artist, the festival (main edition each August) is the easiest structured way into Kyoto''s dance community.', ARRAY['dance','performance']::TEXT[], ARRAY['kyo-kidwf','kyo-kac','kyo-urbanguild']::TEXT[], NULL, NULL, 'https://www.kac.or.jp/events/20260330/', '2026-10-19', 'active'),
  ('kyo-cur-tani-ryuichi', 'Ryuichi Tani', '谷竜一', 'Programmer', 'kyoto', 'Ryuichi Tani is a programme director at Kyoto Art Center (KAC), the city-run arts centre in a former primary school in central Kyoto. On the centre''s site Tani speaks for its studio programme: former classrooms lent as creation studios after a selection process, meant for young artists and new projects.

KAC also runs open calls, an artist-in-residence programme and free workshops, and co-organises Kyoto Experiment and the Kyoto International Dance Workshop Festival. Tani''s programming work centres on theatre and dance.

For a visiting artist who needs rehearsal or studio space in Kyoto, the KAC studio programme is the door, and the centre invites informal questions before an application.', ARRAY['theatre','dance']::TEXT[], ARRAY['kyo-kac']::TEXT[], NULL, NULL, 'https://www.kac.or.jp/about/', '2026-10-19', 'active'),
  ('kyo-cur-iida-jinichiro', 'Jinichiro Iida', '飯田仁一郎', 'Organiser', 'kyoto', 'Jinichiro Iida co-leads Boro Festa, Kyoto''s self-produced autumn music festival, now in its 25th year. In a 2026 interview, co-organiser Mogura names Iida, of the band Limited Express (has gone?), and himself as the current core of organisation and production.

Boro Festa is booked and built in-house from booking to set-up, with student volunteers and the audience pitching in. The 2026 edition runs 31 October to 3 November at KBS Hall and Club Metro, with two all-night sessions.

For a visiting artist, the Club Metro night sessions are where the festival''s more experimental side shows up.', ARRAY['music']::TEXT[], ARRAY['kyo-borofesta','kyo-clubmetro']::TEXT[], NULL, NULL, 'https://l-tike.com/borofesta/', '2026-10-19', 'active'),
  ('kyo-cur-mogura', 'Mogura', '土龍', 'Organiser', 'kyoto', 'Mogura is one of Boro Festa''s founding staff and, with Jinichiro Iida, the current core of its organisation and production. Day to day Mogura manages Live House nano in Kyoto.

Mogura describes a clear pipeline: young bands play nano, then the August pre-event Nano Boro, then Boro Festa itself. The 2026 festival, its 25th, runs 31 October to 3 November at KBS Hall and Club Metro, with staff and volunteers sharing the organising work.

For a visiting artist, Live House nano and the Nano Boro pre-event are the grassroots end of Kyoto''s independent music circuit, and the place to ask about the scene.', ARRAY['music']::TEXT[], ARRAY['kyo-borofesta']::TEXT[], NULL, NULL, 'https://l-tike.com/borofesta/', '2026-10-19', 'active'),
  ('tyo-cur-okada-toshiki', 'Toshiki Okada', '岡田利規', 'Artistic director', 'tokyo', 'Toshiki Okada, a playwright, novelist and director, is artistic director of the performing-arts festival Autumn Meteorite 2026 Tokyo. From fiscal 2026 Okada is also artistic director of the performing-arts division of Tokyo Metropolitan Theatre.

The 2026 edition (9 October to 3 November, centred on the theatre in Ikebukuro) is the second under Okada''s direction and part of Tokyo Festival 2026. It has 13 Japanese and international productions plus lectures, workshops and networking programmes. Its stated aims are new creation, international reach and training the next generation.

For a visiting artist, the festival''s exchange programmes and post-show events are the realistic point of contact.', ARRAY['theatre','performance','dance']::TEXT[], ARRAY['tyo-autumnmeteorite','tyo-geigeki']::TEXT[], NULL, NULL, 'https://autumnmeteorite.jp/ja', '2026-10-19', 'active'),
  ('tyo-cur-kishimoto-kako', 'Kako Kishimoto', '岸本佳子', 'Artistic director', 'tokyo', 'Kako Kishimoto is artistic director of BUoY, the arts centre in Kita-Senju set in a building whose upper floor was once a bowling alley and whose basement was a public bath, renovated by BUoY''s own members.

In BUoY''s statement Kishimoto frames it as a place for young, sharp, intentional art that questions what is taken for granted. The programme mixes dance, performance, music and exhibitions in the basement and the upstairs galleries and café. In October 2026 it hosted the RAW PARTY performance night and the dance piece IGNIS.

For a visiting artist, BUoY''s open-format nights are the way to show work here. RAW PARTY includes an open independent slot.', ARRAY['performance','dance','theatre','visual_art','music']::TEXT[], ARRAY['tyo-buoy','tyo-rawparty']::TEXT[], NULL, NULL, 'https://buoy.or.jp/about/', '2026-10-19', 'active'),
  ('tyo-cur-itoh-naoko', 'Naoko Itoh', '伊藤直子', 'Artistic director', 'tokyo', 'Naoko Itoh founded Kagurazaka Session House in 1991 as a small theatre for dance. Itoh runs it as company representative and supervises the planning of its dance programme, and also leads the company Mademoiselle Cinema, formed in 1993.

Session House runs open dance classes and more than 40 performance and workshop projects a year, with platforms for young choreographers, international exchange, and calls for solo shows (Dzone 2027 applications opened in 2026). Mademoiselle Cinema presents ''Okuni Monogatari'' there on 19 and 20 December 2026.

For a visiting artist, drop-in classes and the short-piece platforms are the most direct way into Tokyo''s contemporary dance community.', ARRAY['dance']::TEXT[], ARRAY['SRC075']::TEXT[], NULL, NULL, 'https://session-house.net/about_sessionhouse.html', '2026-10-19', 'active'),
  ('tyo-cur-ogawa-nozomu', 'Nozomu Ogawa', '小川希', 'Artistic director', 'tokyo', 'Nozomu Ogawa founded and directs Art Center Ongoing in Kichijoji (2008). In June 2025 Ogawa also opened Art Center NEW, underground at Shin-Takashima Station in Yokohama. Ongoing combines exhibition space, a bar and a residency, and mostly shows emerging artists.

In Tokyo Art Beat''s review of 2025 Ogawa described working outside the art mainstream and championed small non-commercial spaces, including Alternative Art Week, run by the Reigai network of independent art spaces.

For a visiting artist, Ongoing''s openings and its bar are a standard meeting point for Tokyo''s independent art scene.', ARRAY['visual_art','performance','music']::TEXT[], ARRAY['SRC260']::TEXT[], NULL, NULL, 'https://www.tokyoartbeat.com/articles/-/best-exhibitions-of-2025-nozomu-ogawa-202512', '2026-10-19', 'active'),
  ('tyo-cur-soma-chiaki', 'Chiaki Soma', '相馬千秋', 'Festival director', 'tokyo', 'Chiaki Soma is director of Theater Commons Tokyo and chairs its executive committee as representative director of Arts Commons Tokyo. The festival applies theatrical ideas to everyday life and the city, and presents performances and learning programmes at sites around Tokyo with partner cultural institutes such as the Goethe-Institut Tokyo and the Institut français du Japon.

Its 10th edition, ''Translating Commons'', ran 22 February to 8 March 2026.

For a visiting artist, Theater Commons is a key node for experimental, lecture-format and site-based performance in Tokyo, and a festival to put in the calendar for early 2027.', ARRAY['theatre','performance']::TEXT[], ARRAY['tyo-theatercommons']::TEXT[], NULL, NULL, 'https://theatercommons.tokyo/en/about/', '2026-10-19', 'active'),
  ('tyo-cur-takahashi-hiroko', 'Hiroko Takahashi', '髙橋弘子', 'Organiser', 'tokyo', 'Hiroko Takahashi is the representative of C.I.N.N. (Contact Improvisation Nippon Network), a non-profit group of Kanto-area dancers that promotes contact improvisation. Takahashi has led the group since it was founded as SPIRAL in 2003 and is in charge of planning, production and running its activities.

C.I.N.N. organises the Tokyo Contact Improvisation Festival. The 2026 edition ran 2 to 5 May 2026 at a training centre in Katsuura, Chiba. The group''s site also lists CI workshops and jams around Tokyo.

For a visiting artist, Takahashi is the main contact for Tokyo''s contact improvisation community and its yearly festival, which invites teachers from abroad.', ARRAY['dance']::TEXT[], ARRAY['tyo-cinn']::TEXT[], NULL, NULL, 'https://contactimprov-nn.com/about/staff/', '2026-10-19', 'active'),
  ('tyo-cur-fukumoto-maaya', 'Maaya Fukumoto', '福本まあや', 'Organiser', 'tokyo', 'Maaya Fukumoto has been on the staff of C.I.N.N. (Contact Improvisation Nippon Network) since it began as SPIRAL in 2003. Fukumoto mainly handles negotiations with the teachers invited from abroad for its events, including the Tokyo Contact Improvisation Festival.

Fukumoto is also a dancer and choreographer and a researcher of contact improvisation''s history. In 2009 Fukumoto served as vice-chair of the committee that brought CI founders Steve Paxton and Lisa Nelson to Japan. C.I.N.N.''s 2026 festival ran 2 to 5 May 2026.

For a visiting CI teacher or dancer, Fukumoto is the person behind the festival''s international invitations.', ARRAY['dance']::TEXT[], ARRAY['tyo-cinn']::TEXT[], NULL, NULL, 'https://contactimprov-nn.com/about/staff/', '2026-10-19', 'active'),
  ('tyo-cur-yamazaki-kota', 'Kota Yamazaki', '山崎広太', 'Festival director', 'tokyo', 'Kota Yamazaki is programme director of Body Arts Laboratory (BAL), an artist-run organisation for dance and performance founded in 2008. Through BAL Yamazaki runs the Whenever Wherever Festival (WWFes), an experimental dance and performance festival programmed by a collective of dancers and choreographers.

WWFes 2026, the 12th edition (28 January to 8 February 2026), was themed on alter-narrative and ''living space(s)'' and used public and community sites in Minato ward. Yamazaki co-curated it and premiered a new dance work at the former Noguchi Room on the Keio University Mita campus.

For a visiting artist, WWFes is one of Tokyo''s few artist-run festivals of experimental dance in non-theatre spaces.', ARRAY['dance','performance']::TEXT[], ARRAY['tyo-bal']::TEXT[], NULL, NULL, 'https://bodyartslabo.com/wwfes2026/festival', '2026-10-19', 'active'),
  ('tyo-cur-aokid', 'Aokid', NULL, 'Curator', 'tokyo', 'Aokid is a Tokyo-based dancer and artist and one of the curators of Body Arts Laboratory, the artist-run organisation behind the Whenever Wherever Festival. Aokid is credited as a curator of WWFes 2026 (28 January to 8 February 2026), the festival''s 12th edition, held at public and community sites in Minato ward, including SHIBAURA HOUSE.

Aokid also performs on Tokyo''s open-format circuit, for example at RAW PARTY vol.5 at BUoY on 10 October 2026.

For a visiting artist, Aokid is a natural contact where experimental dance meets Tokyo''s DIY performance scene.', ARRAY['dance','performance']::TEXT[], ARRAY['tyo-bal','tyo-rawparty']::TEXT[], NULL, NULL, 'https://bodyartslabo.com/wwfes2026/festival', '2026-10-19', 'active'),
  ('tyo-cur-nishimura-mina', 'Mina Nishimura', '西村未奈', 'Curator', 'tokyo', 'Mina Nishimura is a curator at Body Arts Laboratory and one of the four curators credited for Whenever Wherever Festival 2026, alongside Kota Yamazaki and Aokid. Nishimura wrote the festival''s published note on ''living space(s)''. That was the format of its closing two-day event at SHIBAURA HOUSE (7 to 8 February 2026), where several happenings shared one space at once and the line between audience and performers was left open.

For a visiting artist interested in process-based performance outside theatres, Nishimura is a good person to approach through Body Arts Laboratory''s contact page.', ARRAY['dance','performance']::TEXT[], ARRAY['tyo-bal']::TEXT[], NULL, NULL, 'https://bodyartslabo.com/wwfes2026/festival', '2026-10-19', 'active'),
  ('tyo-cur-iwanaka-kanako', 'Kanako Iwanaka', '岩中可南子', 'Programmer', 'tokyo', 'Kanako Iwanaka is listed as a curator of Body Arts Laboratory and ran production for Whenever Wherever Festival 2026, held 28 January to 8 February 2026 at sites in Minato ward. BAL describes the festival as run by a collective of dancers and choreographers. Its programme is laboratories, workshops, performances and round tables proposed by artists.

For a visiting artist, the production side of BAL is the practical route for questions about joining the festival''s education programme or proposing to future editions.', ARRAY['dance','performance']::TEXT[], ARRAY['tyo-bal']::TEXT[], NULL, NULL, 'https://bodyartslabo.com/wwfes2026/festival', '2026-10-19', 'active'),
  ('tyo-cur-iwata-tomoya', 'Tomoya Iwata', '岩田智哉', 'Artistic director', 'tokyo', 'Tomoya Iwata is a curator who has directed The 5th Floor since April 2022. The space is a curatorial venue on the fifth floor of a former dormitory building in Ikenohata, near Nezu station in Taito-ku. Since opening in 2020 it has focused on curating itself, with guest curators and a curator-in-residence programme.

Iwata curated ''Portal: AfroAsia'' (16 October to 29 November 2026) with AfroAsia Collective. In 2025 the space hosted ''Phenomena and Records: One Record, Three Rooms''.

For a visiting artist or curator, Iwata is a good contact for small, research-led exhibitions and curatorial exchange in Tokyo, in a non-commercial setting.', ARRAY['visual_art']::TEXT[], ARRAY['tyo-the5thfloor']::TEXT[], NULL, NULL, 'https://the5thfloor.org/', '2026-10-19', 'active'),
  ('tyo-cur-makigami-koichi', 'Koichi Makigami', '巻上公一', 'Festival director', 'tokyo', 'Koichi Makigami, a vocalist and theremin player, is one of the artists who produce and curate JAZZ ART SENGAWA, Tokyo''s yearly festival of improvised music at Chofu''s Sengawa Theater. Arts Council Tokyo names Makigami first among the six artist-producers who plan the festival. Since 2019 an executive committee of artists and staff has run it, continuing an event the theatre started in 2008.

The 2025 edition (11 to 14 September) took electronic music as its theme and mixed four days of genre-free improvised concerts with workshops, inclusive performances and a free outdoor stage. Makigami also played in the opening ensemble.

For a visiting improviser, this is the main festival of free improvisation in the Tokyo area.', ARRAY['music','sound','performance']::TEXT[], ARRAY['tyo-jazzartsengawa']::TEXT[], NULL, NULL, 'https://www.artscouncil-tokyo.jp/en/grants/program/27293/', '2026-10-19', 'active'),
  ('tyo-cur-ukawa-naohiro', 'Naohiro Ukawa', '宇川直宏', 'Programmer', 'tokyo', 'Naohiro Ukawa is the artist who opened DOMMUNE in March 2010 as a DIY live-streaming studio and channel, now broadcasting as SUPER DOMMUNE. Weekday evenings pair a talk programme with a music programme (BROADJ) of DJs and live acts from Japan and abroad. Ukawa treats the filming, streaming and recording of these programmes as an ongoing artwork.

Ukawa still hosts much of it in person: the October 2026 schedule has Ukawa as MC or interviewer on several nights, among them a programme marking 50 years of punk and a long talk night with young artists.

For a visiting artist, DOMMUNE is a live window on who is in town, and studio visits are possible on broadcast nights.', ARRAY['music','sound','film']::TEXT[], ARRAY['SRC069']::TEXT[], NULL, NULL, 'https://www.dommune.com/about/', '2026-10-19', 'active'),
  ('tyo-cur-yama-yuki', 'Yama Yuki', NULL, 'Organiser', 'tokyo', 'Yama Yuki is a member of MIMINOIMI, the Tokyo collective that runs MIMINOIMI Ambient / Week, a seven-day city festival on the possibilities of ambient music. Yama Yuki also runs the archive label ato.archives and the event series re_location, and performs under several names.

The 2026 edition, the fourth, ran 4 to 10 May 2026 under the theme ''Attention In Motion'', mainly at ADRIFT and reload in Shimokitazawa. It mixed workshops, lectures and concerts, with guests including Lawrence English. In a published interview about the first edition, Yama Yuki set out the festival''s idea of ambient as a way of rethinking listening and environment.

For a visiting sound artist, MIMINOIMI is the most thoughtful entry point into Tokyo''s ambient and listening scene.', ARRAY['music','sound']::TEXT[], ARRAY['tyo-miminoimi']::TEXT[], NULL, NULL, 'https://www.miminoimi.me/', '2026-10-19', 'active'),
  ('tyo-cur-nagata-kentaro', 'kentaro nagata', NULL, 'Organiser', 'tokyo', 'kentaro nagata is a member of MIMINOIMI, the collective behind the Tokyo festival MIMINOIMI Ambient / Week, and runs the label elect-low. nagata also works as a sound engineer and releases electronica, experimental and electroacoustic music.

nagata has run the event series TENbient since 2017. An expanded TENbient formed one day of the first MIMINOIMI week. At the 2026 edition (4 to 10 May, Shimokitazawa) nagata appeared on the lecture day and in the free programme at reload.

For a visiting electronic or sound artist, nagata is a direct link to Tokyo''s ambient and electroacoustic network.', ARRAY['music','sound']::TEXT[], ARRAY['tyo-miminoimi']::TEXT[], NULL, NULL, 'https://www.miminoimi.me/', '2026-10-19', 'active')
ON CONFLICT (curator_id) DO UPDATE SET name = EXCLUDED.name, name_ja = EXCLUDED.name_ja, role_label = EXCLUDED.role_label, market = EXCLUDED.market, about = EXCLUDED.about, disciplines = EXCLUDED.disciplines, affiliations = EXCLUDED.affiliations, website_url = EXCLUDED.website_url, instagram_url = EXCLUDED.instagram_url, evidence_url = EXCLUDED.evidence_url, verified_at = EXCLUDED.verified_at, status = EXCLUDED.status;
UPDATE public.curators SET status = 'inactive' WHERE curator_id = 'tyo-cur-endo-mai';
COMMIT;
