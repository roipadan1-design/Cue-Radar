import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { vocabLabel, placeLine } from '@/lib/labels'
import type { Curator, VocabEntry } from '@/lib/types'

interface CuratorRowProps {
  curator: Curator
  cityName?: string | null
  country?: string | null
  vocab: VocabEntry[]
}

/**
 * Curators tab row: same anatomy as OrganizationRow. Initials only, never a
 * photo: these are researched public profiles, not people who uploaded one.
 */
export default function CuratorRow({ curator, cityName, country, vocab }: CuratorRowProps) {
  const metaLine = [curator.role_label, placeLine(cityName, country)].filter(Boolean).join(' · ')
  const disciplineLabels = (curator.disciplines || [])
    .slice(0, 3)
    .map((code) => vocabLabel(vocab, 'discipline', code))

  return (
    <Link
      href={`/curators/${curator.curator_id}`}
      className="card p-4 md:p-5 flex items-center gap-4 hover:border-line-strong transition-colors"
    >
      <Avatar name={curator.name} size={56} />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="t-row text-fg truncate">{curator.name}</h3>
        <p className="t-meta text-muted truncate">{metaLine}</p>
        {disciplineLabels.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {disciplineLabels.map((label) => (
              <Badge key={label} tone="outline">
                {label}
              </Badge>
            ))}
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
