import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { vocabLabel, placeLine } from '@/lib/labels'
import type { Source, VocabEntry } from '@/lib/types'

interface OrganizationRowProps {
  source: Source
  cityName?: string | null
  country?: string | null
  vocab: VocabEntry[]
}

/**
 * The Organizations tab of Discover, ArtConnect row anatomy: round avatar, name,
 * "Type · City, Country", a few field tags, and a "View" action. We hold no logos,
 * so `Avatar` shows initials rather than a placeholder image (rule 1).
 */
export default function OrganizationRow({ source, cityName, country, vocab }: OrganizationRowProps) {
  const typeLabel = vocabLabel(vocab, 'source_type', source.source_type) || 'Organization'
  const metaLine = [typeLabel, placeLine(cityName, country)].filter(Boolean).join(' · ')

  const disciplineLabels = (source.discipline_focus || [])
    .slice(0, 3)
    .map((code) => vocabLabel(vocab, 'discipline', code))

  return (
    <Link
      href={`/sources/${source.source_id}`}
      className="card p-4 md:p-5 flex items-center gap-4 hover:border-line-strong transition-colors"
    >
      <Avatar name={source.name} size={56} />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="t-row text-fg truncate">{source.name}</h3>
        <p className="t-meta text-muted truncate">
          {metaLine}
          {source.neighborhood ? ` · ${source.neighborhood}` : ''}
        </p>
        {(disciplineLabels.length > 0 || source.is_demo) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {disciplineLabels.map((label) => (
              <Badge key={label} tone="outline">
                {label}
              </Badge>
            ))}
            {source.newcomer_friendly === 'yes' && <Badge tone="neutral">Open to newcomers</Badge>}
            {source.is_demo && <Badge tone="outline">Demo</Badge>}
          </div>
        )}
      </div>
      <span className="inline-flex items-center gap-1 shrink-0 text-[14px] font-semibold text-fg">
        <span className="hidden sm:inline">View</span>
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  )
}
