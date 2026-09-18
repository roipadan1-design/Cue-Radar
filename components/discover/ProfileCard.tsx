import Link from 'next/link'
import Chip from '@/components/ui/Chip'
import type { Market, Profile, VocabEntry } from '@/lib/types'

interface ProfileCardProps {
  profile: Profile
  markets: Market[]
  vocab: VocabEntry[]
}

function getInitials(name?: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfileCard({ profile, markets, vocab }: ProfileCardProps) {
  const initials = getInitials(profile.full_name)
  const cityLabel = profile.current_city
    ? markets.find((m) => m.slug === profile.current_city)?.display_name || profile.current_city
    : null

  const disciplineLabels = (profile.disciplines || [])
    .slice(0, 2)
    .map((code) => vocab.find((v) => v.category === 'discipline' && v.value === code)?.label || code)

  return (
    <Link
      href={`/a/${profile.handle}`}
      className="block p-4 border border-line rounded-[var(--radius)] bg-bg hover:border-line-strong transition-colors"
    >
      <div className="flex items-center gap-3">
        {profile.avatar_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'Profile avatar'}
            className="w-[44px] h-[44px] rounded-[var(--radius)] object-cover bg-surface border border-line flex-shrink-0"
          />
        ) : (
          <div className="w-[44px] h-[44px] rounded-[var(--radius)] bg-surface border border-line flex items-center justify-center flex-shrink-0">
            {initials ? <span className="t-meta text-fg select-none">{initials}</span> : null}
          </div>
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="t-row text-fg truncate">{profile.full_name}</div>
          {profile.role_label && <div className="t-meta text-muted truncate">{profile.role_label}</div>}
        </div>
      </div>

      {(cityLabel || disciplineLabels.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {cityLabel && <Chip>{cityLabel}</Chip>}
          {disciplineLabels.map((label) => (
            <Chip key={label}>{label}</Chip>
          ))}
        </div>
      )}
    </Link>
  )
}
