import React from 'react'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import ShareLink from './ShareLink'
import Button from '@/components/ui/Button'
import type { ProfileView, Profile } from '@/lib/types'

interface PublicProfileViewProps {
  profile: Partial<ProfileView> & Profile
  isOwner?: boolean
}

function formatDateShort(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)
  } catch {
    return dateStr
  }
}

function formatDateFull(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

function getInitials(name?: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function PublicProfileView({ profile, isOwner = false }: PublicProfileViewProps) {
  const initials = getInitials(profile.full_name)
  const locationsText =
    profile.locations && profile.locations.length > 0 ? profile.locations.join(' · ') : ''

  // Parse showreel embed URL if present. The dev-only preview fixture uses the
  // sentinel "placeholder" to render a blank black player instead of real content.
  const showreelPlaceholder = profile.showreel_url === 'placeholder'
  let embedUrl = ''
  if (profile.showreel_url && !showreelPlaceholder) {
    try {
      const url = new URL(profile.showreel_url)
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        const v = url.searchParams.get('v') || url.pathname.slice(1)
        embedUrl = `https://www.youtube-nocookie.com/embed/${v}`
      } else if (url.hostname.includes('vimeo.com')) {
        const id = url.pathname.split('/')[1]
        embedUrl = `https://player.vimeo.com/video/${id}`
      }
    } catch {
      embedUrl = ''
    }
  }

  const bioParagraphs = profile.bio ? profile.bio.split('\n\n') : []
  const galleryImages = profile.gallery && profile.gallery.length > 0 ? profile.gallery : []

  // Facts rows calculation
  const factsRows: { label: string; value: string }[] = []
  if (locationsText) factsRows.push({ label: 'Location', value: locationsText })
  if (profile.disciplines && profile.disciplines.length > 0) {
    factsRows.push({ label: 'Disciplines', value: profile.disciplines.join(', ') })
  }
  if (profile.active_since) factsRows.push({ label: 'Active since', value: String(profile.active_since) })
  if (profile.languages && profile.languages.length > 0) {
    factsRows.push({ label: 'Languages', value: profile.languages.join(', ') })
  }
  if (profile.available_from) {
    factsRows.push({ label: 'Available from', value: formatDateFull(profile.available_from) })
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-[48px]">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {profile.avatar_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'Profile avatar'}
            className="w-[112px] h-[112px] md:w-[128px] md:h-[128px] rounded-[var(--radius)] object-cover bg-surface flex-shrink-0"
          />
        ) : (
          <div className="w-[112px] h-[112px] md:w-[128px] md:h-[128px] rounded-[var(--radius)] bg-surface border border-line flex items-center justify-center flex-shrink-0">
            {initials ? (
              <span className="t-title text-fg select-none">{initials}</span>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {profile.full_name && (
            <h1 className="t-display text-[40px] md:text-[64px] text-fg leading-none">
              {profile.full_name}
            </h1>
          )}
          {profile.role_label && (
            <div className="t-meta text-fg">{profile.role_label}</div>
          )}
          {locationsText && (
            <div className="t-meta text-muted">{locationsText}</div>
          )}
        </div>
      </div>

      {/* 2. Status */}
      <div className="flex flex-col gap-1.5 t-body text-fg">
        {profile.current_city && (
          <p>
            Currently in {profile.current_city}
            {profile.current_city_until ? ` until ${formatDateShort(profile.current_city_until)}` : ''}
          </p>
        )}
        {profile.open_for_collab && <p>Open for collaboration</p>}
        {profile.available_from && (
          <p>Available from {formatDateFull(profile.available_from)}</p>
        )}
      </div>

      {/* 3. Actions */}
      <div className="flex items-center gap-3">
        <ShareLink />
        {isOwner && (
          <Link href="/profile/edit">
            <Button variant="secondary">Edit profile</Button>
          </Link>
        )}
      </div>

      {/* 4. Bio */}
      {bioParagraphs.length > 0 && (
        <div className="max-w-[60ch] flex flex-col gap-4 t-body text-fg">
          {bioParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      )}

      {/* 5. Facts */}
      {factsRows.length > 0 && (
        <div className="py-4 border-y border-line grid grid-cols-[140px_1fr] gap-y-3">
          {factsRows.map((row) => (
            <React.Fragment key={row.label}>
              <div className="t-meta text-muted flex items-center">{row.label}</div>
              <div className="t-body text-fg">{row.value}</div>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 6. Selected works */}
      {profile.works && profile.works.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="t-meta text-muted">SELECTED WORKS</div>
          <div className="border-t border-line">
            {profile.works.map((work, idx) => (
              <div key={idx} className="py-3 border-b border-line flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="t-row text-fg">{work.title}</span>
                  <span className="t-num t-body text-muted">{work.year}</span>
                </div>
                <div className="t-meta text-muted">{work.kind}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Showreel */}
      {showreelPlaceholder && (
        <div className="w-full aspect-video bg-bg rounded-[var(--radius)] border border-line flex items-end p-3">
          <span className="t-meta text-muted">SHOWREEL</span>
        </div>
      )}
      {embedUrl && (
        <div className="w-full aspect-video bg-surface rounded-[var(--radius)] overflow-hidden border border-line">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Showreel"
          />
        </div>
      )}

      {/* 8. Gallery */}
      {galleryImages.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="t-meta text-muted">GALLERY</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galleryImages.map((src, idx) =>
              src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={src + idx}
                  src={src}
                  alt={`${profile.full_name || 'Artist'} — gallery image ${idx + 1}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover border border-line rounded-[var(--radius)]"
                />
              ) : (
                <div
                  key={`empty-${idx}`}
                  aria-hidden
                  className="aspect-square w-full bg-bg border border-line rounded-[var(--radius)]"
                />
              )
            )}
          </div>
        </div>
      )}

      {/* 9. Links */}
      {profile.social_links && (
        <div className="flex flex-wrap items-center gap-4">
          {profile.social_links.instagram && (
            <a
              href={profile.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="text-fg hover:text-muted"
            >
              <Instagram size={20} strokeWidth={1.75} />
            </a>
          )}
          {profile.social_links.website && (
            <a
              href={profile.social_links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="t-body text-fg hover:underline hover:underline-offset-4"
            >
              Website
            </a>
          )}
          {profile.social_links.spotify && (
            <a
              href={profile.social_links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="t-body text-fg hover:underline hover:underline-offset-4"
            >
              Spotify
            </a>
          )}
          {profile.social_links.vimeo && (
            <a
              href={profile.social_links.vimeo}
              target="_blank"
              rel="noopener noreferrer"
              className="t-body text-fg hover:underline hover:underline-offset-4"
            >
              Vimeo
            </a>
          )}
        </div>
      )}
    </div>
  )
}
