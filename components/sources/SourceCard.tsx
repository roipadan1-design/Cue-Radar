import Link from 'next/link'
import Chip from '@/components/ui/Chip'
import type { Source, VocabEntry } from '@/lib/types'

interface SourceCardProps {
  source: Source
  cityName?: string | null
  vocab: VocabEntry[]
}

export default function SourceCard({ source, cityName, vocab }: SourceCardProps) {
  const typeEntry = vocab.find((v) => v.category === 'source_type' && v.value === source.source_type)
  const typeLabel = typeEntry
    ? typeEntry.label
    : source.source_type
    ? source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)
    : ''

  const metaLine = [typeLabel, cityName].filter(Boolean).join('  ·  ')

  const disciplineLabels = (source.discipline_focus || [])
    .slice(0, 2)
    .map((code) => vocab.find((v) => v.category === 'discipline' && v.value === code)?.label || code)

  return (
    <Link
      href={`/sources/${source.source_id}`}
      className="block p-4 border border-line rounded-[var(--radius)] bg-bg hover:border-line-strong transition-colors"
    >
      <div className="flex flex-col gap-2">
        <h3 className="t-row text-fg line-clamp-2">{source.name}</h3>
        {metaLine && <div className="t-meta text-muted">{metaLine}</div>}
        {(disciplineLabels.length > 0 || source.is_demo) && (
          <div className="flex flex-wrap items-center gap-2">
            {disciplineLabels.map((label) => (
              <Chip key={label}>{label}</Chip>
            ))}
            {source.is_demo && <Chip>Demo</Chip>}
          </div>
        )}
      </div>
    </Link>
  )
}
