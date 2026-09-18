import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import type { Source, VocabEntry } from '@/lib/types'

interface OrganizationRowProps {
  source: Source
  cityName?: string | null
  vocab: VocabEntry[]
}

/**
 * The Organizations tab of Discover — same row anatomy as ArtistRow, backed by
 * the real `sources` directory (344 rows) instead of invented org data. We hold
 * no logo for a source, so `Avatar` falls back to initials rather than a
 * placeholder image (rule 1). No recent-work strip — sources have no gallery.
 */
export default function OrganizationRow({ source, cityName, vocab }: OrganizationRowProps) {
  const typeEntry = vocab.find((v) => v.category === 'source_type' && v.value === source.source_type)
  const typeLabel = typeEntry
    ? typeEntry.label
    : source.source_type
    ? source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)
    : 'Organization'

  const metaLine = [typeLabel, cityName].filter(Boolean).join(' · ')

  const disciplineLabels = (source.discipline_focus || [])
    .slice(0, 3)
    .map((code) => vocab.find((v) => v.category === 'discipline' && v.value === code)?.label || code)

  return (
    <div className="card p-4 md:p-5 flex items-center gap-4">
      <Avatar name={source.name} size={56} rounded="md" />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="t-row text-fg truncate">{source.name}</h3>
        {metaLine && <p className="t-meta truncate">{metaLine}</p>}
        {(disciplineLabels.length > 0 || source.is_demo) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {disciplineLabels.map((label) => (
              <Badge key={label} tone="outline">
                {label}
              </Badge>
            ))}
            {source.is_demo && <Badge tone="outline">Demo</Badge>}
          </div>
        )}
      </div>
      <Link
        href={`/sources/${source.source_id}`}
        className="inline-flex items-center gap-1 shrink-0 text-[14px] font-semibold text-fg hover:text-muted transition-colors"
      >
        <span className="hidden sm:inline">View</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
