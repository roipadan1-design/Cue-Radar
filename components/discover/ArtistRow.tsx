import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import type { Market, Profile, VocabEntry } from '@/lib/types'

interface ArtistRowProps {
  profile: Profile
  markets: Market[]
  vocab: VocabEntry[]
}

/**
 * ArtConnect's Discover row: avatar, name, a quiet "Artist · City, Country" meta
 * line, a "View Profile →" action, and a horizontal strip of the artist's recent
 * work underneath when they have one.
 *
 * The work strip reads from `profile.gallery` (real, artist-uploaded images).
 * When it's empty the row renders cleanly without it — never a placeholder
 * image (rule 1).
 */
export default function ArtistRow({ profile, markets, vocab }: ArtistRowProps) {
  const cityEntry = profile.current_city
    ? markets.find((m) => m.slug === profile.current_city)
    : undefined
  // City name only. Joining in `markets.country` printed the raw two-letter code
  // ("Tel Aviv, IL"), and with the pilot scoped to one country the country half
  // is redundant anyway. There is no full-country-name column to use instead.
  const cityLabel = cityEntry?.display_name ?? null

  const disciplineLabel = (profile.disciplines || [])
    .map((code) => vocab.find((v) => v.category === 'discipline' && v.value === code)?.label || code)
    .find(Boolean)

  const metaLine = [profile.role_label || disciplineLabel || 'Artist', cityLabel]
    .filter(Boolean)
    .join(' · ')

  const gallery = (profile.gallery || []).filter(Boolean).slice(0, 6)

  return (
    <div className="card p-4 md:p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar src={profile.avatar_url} name={profile.full_name} size={56} />
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h3 className="t-row text-fg truncate">{profile.full_name}</h3>
          {metaLine && <p className="t-meta truncate">{metaLine}</p>}
        </div>
        <Link
          href={`/a/${profile.handle}`}
          className="inline-flex items-center gap-1 shrink-0 text-[14px] font-semibold text-fg hover:text-muted transition-colors"
        >
          <span className="hidden sm:inline">View Profile</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {gallery.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((src, idx) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src + idx}
              src={src}
              alt=""
              loading="lazy"
              className="w-[96px] h-[96px] shrink-0 object-cover rounded-[var(--radius-sm)] border border-line bg-surface-2"
            />
          ))}
        </div>
      )}
    </div>
  )
}
