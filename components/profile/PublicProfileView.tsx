import React from 'react'
import Link from 'next/link'
import ShareLink from './ShareLink'
import type { Profile } from '@/lib/types'

interface PublicProfileViewProps {
  profile: Profile
  isOwner?: boolean
}

export default function PublicProfileView({ profile, isOwner = false }: PublicProfileViewProps) {
  const locationsText =
    profile.locations && profile.locations.length > 0 ? profile.locations.join(' · ') : ''

  const subline = [profile.role_label, locationsText].filter(Boolean).join('  ·  ')

  // Parse showreel embed URL if present
  let embedUrl = ''
  if (profile.showreel_url) {
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

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
      {/* Top Header & Owner/Share Actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile avatar'}
              className="w-[72px] h-[72px] rounded-[var(--radius)] object-cover bg-surface"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-[var(--radius)] bg-surface border border-line" />
          )}

          <div>
            {profile.full_name && <h1 className="t-title text-fg">{profile.full_name}</h1>}
            {subline && <p className="t-meta text-muted mt-1">{subline}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && (
            <Link href="/profile/edit" className="t-meta text-muted hover:text-fg">
              Edit
            </Link>
          )}
          <ShareLink />
        </div>
      </div>

      {/* Status Lines */}
      <div className="flex flex-col gap-1 t-body text-fg">
        {profile.current_city && (
          <p>
            Currently in {profile.current_city}
            {profile.current_city_until ? ` until ${profile.current_city_until}` : ''}
          </p>
        )}
        {profile.open_for_collab && <p>Open for collaboration</p>}
        {profile.available_from && <p>Available from {profile.available_from}</p>}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="max-w-[60ch] t-body text-fg">
          <p>{profile.bio}</p>
        </div>
      )}

      {/* Showreel */}
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

      {/* Social Links */}
      {profile.social_links && (
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-line">
          {profile.social_links.instagram && (
            <a
              href={profile.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="t-meta text-muted hover:text-fg hover:underline hover:underline-offset-4"
            >
              Instagram
            </a>
          )}
          {profile.social_links.website && (
            <a
              href={profile.social_links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="t-meta text-muted hover:text-fg hover:underline hover:underline-offset-4"
            >
              Website
            </a>
          )}
          {profile.social_links.spotify && (
            <a
              href={profile.social_links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="t-meta text-muted hover:text-fg hover:underline hover:underline-offset-4"
            >
              Spotify
            </a>
          )}
          {profile.social_links.vimeo && (
            <a
              href={profile.social_links.vimeo}
              target="_blank"
              rel="noopener noreferrer"
              className="t-meta text-muted hover:text-fg hover:underline hover:underline-offset-4"
            >
              Vimeo
            </a>
          )}
        </div>
      )}
    </div>
  )
}
