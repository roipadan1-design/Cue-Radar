import React from 'react';
import {
  ArrowUpRight,
  Check,
  Disc3,
  ExternalLink,
  Globe,
  Radio,
  Share2
} from 'lucide-react';

interface ExternalLinkItem {
  id: string;
  title: string;
  platform: string;
  url: string;
  badge?: string;
}

interface ReleaseItem {
  id: string;
  title: string;
  format: string;
  catalogNumber: string;
  year: string;
  label: string;
  url: string;
  role: string;
}

interface ArtistProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  location: string;
  verified: boolean;
  discipline: string;
  bio: string;
  links: ExternalLinkItem[];
  releases: ReleaseItem[];
}

// Fallback / Standalone Mock Data Structure
const MOCK_PROFILES: Record<string, ArtistProfile> = {
  default: {
    name: 'Roi Padan',
    handle: 'roipadan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    location: 'Cologne / NRW · Tel Aviv',
    verified: true,
    discipline: 'Choreography · Spatial Sound · Live Electronics',
    bio: 'Choreographer and sonic performance researcher experimenting with spatial acoustics, bodily kinetic feedback, and multi-channel field recordings across European independent stages.',
    links: [
      {
        id: 'l1',
        title: 'SoundCloud / Live Archives & Spatial Stems',
        platform: 'SoundCloud',
        url: 'https://soundcloud.com',
        badge: 'STREAM'
      },
      {
        id: 'l2',
        title: 'Bandcamp / Discography & Tape Editions',
        platform: 'Bandcamp',
        url: 'https://bandcamp.com',
        badge: 'BUY DIGITAL'
      },
      {
        id: 'l3',
        title: 'Resident Advisor Artist Hub',
        platform: 'Resident Advisor',
        url: 'https://ra.co',
        badge: 'LIVE DATES'
      },
      {
        id: 'l4',
        title: 'Vimeo Archive / Somatic Echoes (1080p Documentation)',
        platform: 'Vimeo',
        url: 'https://vimeo.com',
        badge: 'VIDEO'
      },
      {
        id: 'l5',
        title: 'Instagram / Studio Notebook & Process',
        platform: 'Instagram',
        url: 'https://instagram.com',
        badge: 'CONNECT'
      }
    ],
    releases: [
      {
        id: 'r1',
        title: 'Somatic Echoes (Acousmatic Suite for 16 Speakers)',
        format: 'Digital / 12" Vinyl',
        catalogNumber: 'CR-009',
        year: '2025',
        label: 'Sub-Resonance Editions',
        url: 'https://bandcamp.com',
        role: 'Composition & Spatialization'
      },
      {
        id: 'r2',
        title: 'Kinetic Drift / Field Recording Translations from Cologne',
        format: 'Cassette Edition',
        catalogNumber: 'KNT-04',
        year: '2024',
        label: 'TanzFaktur Sonic Archive',
        url: 'https://bandcamp.com',
        role: 'Field Synthesis & Master'
      },
      {
        id: 'r3',
        title: 'Bodily Feedback Loops (Live at PACT Zollverein)',
        format: 'Live Recording',
        catalogNumber: 'PACT-LIVE-24',
        year: '2024',
        label: 'Self-Released',
        url: 'https://soundcloud.com',
        role: 'Choreography & Sound Performance'
      }
    ]
  }
};

type PageProps = {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ArtistProfilePage({ params }: PageProps) {
  // Extract handle asynchronously per Next.js 15 App Router specifications
  const { handle } = await params;
  const normalizedHandle = handle?.toLowerCase().replace(/^@/, '');

  // Retrieve matching profile or cleanly fallback without crashing
  const profile = MOCK_PROFILES[normalizedHandle] || {
    ...MOCK_PROFILES.default,
    name: normalizedHandle
      ? normalizedHandle.charAt(0).toUpperCase() + normalizedHandle.slice(1)
      : MOCK_PROFILES.default.name,
    handle: normalizedHandle || MOCK_PROFILES.default.handle
  };

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] font-mono selection:bg-[#D7FF3F] selection:text-[#0B0B0C]">
      <div className="w-full max-w-[720px] mx-auto px-4 py-12 space-y-12">
        
        {/* ================================================================= */}
        {/* HEADER SECTION                                                    */}
        {/* ================================================================= */}
        <header className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            {/* Brutalist Avatar Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#0B0B0C] border border-[#26262A] rounded-md overflow-hidden">
              <img
                src={profile.avatarUrl}
                alt={`${profile.name} portrait`}
                className="w-full h-full object-cover grayscale contrast-125"
                loading="eager"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 border border-[#26262A] rounded text-xs font-mono text-[#8A8A93] hover:text-[#EDEDED] hover:border-[#D7FF3F] transition-colors"
                aria-label="Share profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SHARE</span>
              </button>
            </div>
          </div>

          {/* Identity & Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#EDEDED] font-display">
                {profile.name}
              </h1>

              {profile.verified && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#26262A] rounded text-[11px] font-mono text-[#D7FF3F]"
                  title="Verified Artist Identity"
                >
                  <Check className="w-3 h-3 text-[#D7FF3F]" strokeWidth={2.5} />
                  <span>VERIFIED</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8A8A93] font-mono">
              <span className="text-[#D7FF3F]">@{profile.handle}</span>
              <span className="text-[#26262A]">/</span>
              <span>{profile.location}</span>
            </div>

            <p className="text-xs text-[#8A8A93] font-mono tracking-wide uppercase pt-1">
              {profile.discipline}
            </p>
          </div>

          {/* Bio Statement */}
          <div className="border-t border-[#26262A] pt-4">
            <p className="text-sm text-[#EDEDED] font-mono leading-relaxed max-w-prose">
              {profile.bio}
            </p>
          </div>
        </header>

        {/* ================================================================= */}
        {/* EXTERNAL LINKS SECTION (Brutalist Stacking Cards)                */}
        {/* ================================================================= */}
        <section className="space-y-4" aria-labelledby="section-links">
          <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
            <h2 id="section-links" className="text-xs font-mono tracking-widest uppercase text-[#8A8A93]">
              // PLATFORMS & LINKS
            </h2>
            <span className="text-[10px] font-mono text-[#8A8A93]">
              [{profile.links.length}]
            </span>
          </div>

          <div className="space-y-2">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 border border-[#26262A] rounded-md bg-[#0B0B0C] hover:border-[#D7FF3F] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <Globe className="w-4 h-4 text-[#8A8A93] group-hover:text-[#D7FF3F] transition-colors shrink-0" />
                  <span className="text-sm font-mono text-[#EDEDED] group-hover:text-white truncate">
                    {link.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {link.badge && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#26262A] rounded text-[#8A8A93] group-hover:border-[#D7FF3F] group-hover:text-[#D7FF3F] transition-colors">
                      {link.badge}
                    </span>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-[#8A8A93] group-hover:text-[#D7FF3F] transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* RELEASES & CURATION SECTION                                       */}
        {/* ================================================================= */}
        <section className="space-y-4" aria-labelledby="section-releases">
          <div className="flex items-center justify-between pb-2 border-b border-[#26262A]">
            <h2 id="section-releases" className="text-xs font-mono tracking-widest uppercase text-[#8A8A93]">
              // DISCOGRAPHY & ARCHIVE
            </h2>
            <span className="text-[10px] font-mono text-[#8A8A93]">
              [{profile.releases.length}]
            </span>
          </div>

          <div className="space-y-3">
            {profile.releases.map((release) => (
              <article
                key={release.id}
                className="group p-4 border border-[#26262A] rounded-md bg-[#0B0B0C] hover:border-[#D7FF3F] transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A8A93]">
                      <span>{release.catalogNumber}</span>
                      <span>·</span>
                      <span>{release.year}</span>
                      <span>·</span>
                      <span className="text-[#EDEDED]">{release.label}</span>
                    </div>

                    <h3 className="text-base font-semibold text-[#EDEDED] font-display group-hover:text-[#D7FF3F] transition-colors">
                      {release.title}
                    </h3>
                  </div>

                  <a
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-[#26262A] rounded text-[#8A8A93] group-hover:border-[#D7FF3F] group-hover:text-[#D7FF3F] transition-colors shrink-0"
                    aria-label={`Listen to ${release.title}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#26262A] text-xs font-mono text-[#8A8A93]">
                  <div className="flex items-center gap-2">
                    <Disc3 className="w-3.5 h-3.5 text-[#8A8A93]" />
                    <span>{release.format}</span>
                  </div>
                  <span className="text-[11px] text-[#8A8A93]">
                    {release.role}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FOOTER / PLATFORM SYSTEM MARK                                    */}
        {/* ================================================================= */}
        <footer className="pt-8 border-t border-[#26262A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#8A8A93]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span className="text-[#EDEDED]">CUE RADAR</span>
            <span>//</span>
            <span>CAREER OS FOR ARTISTS</span>
          </div>

          <div className="text-[11px]">
            ARCHIVE ENCRYPTED · AUTONOMOUS FEED
          </div>
        </footer>

      </div>
    </main>
  );
}