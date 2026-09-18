import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import type { Source, VocabEntry } from '@/lib/types'

interface SourceCardProps {
  source: Source
  cityName?: string | null
  vocab: VocabEntry[]
}

/**
 * Organisation row, in the ArtConnect directory shape: an identity anchor on the
 * left, name, a quiet "Type · City" meta line, focus tags, and the action pushed
 * to the right edge. Previously this was a stack of text with three identical
 * grey chips, which gave a 344-row directory no scannable structure at all.
 *
 * We hold no logo for a source, so the Avatar renders its initials rather than a
 * placeholder image — omitting is correct, inventing imagery is a rule-1 breach.
 */
export default function SourceCard({ source, cityName, vocab }: SourceCardProps) {
  const typeEntry = vocab.find((v) => v.category === 'source_type' && v.value === source.source_type)
  const typeLabel = typeEntry
    ? typeEntry.label
    : source.source_type
    ? source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)
    : ''

  const metaLine = [typeLabel, cityName].filter(Boolean).join(' · ')

  const disciplineLabels = (source.discipline_focus || [])
    .slice(0, 3)
    .map((code) => vocab.find((v) => v.category === 'discipline' && v.value === code)?.label || code)

  return (
    <Link
      href={`/sources/${source.source_id}`}
      className="card card-interactive group block p-4 md:p-5"
    >
      <div className="flex items-start gap-4">
        <Avatar name={source.name} size={48} rounded="md" />

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <h3 className="t-row text-fg line-clamp-2">{source.name}</h3>
          {metaLine && <p className="t-meta">{metaLine}</p>}

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

        <span className="hidden sm:inline-flex items-center gap-1 shrink-0 self-center text-[14px] font-semibold text-muted group-hover:text-fg transition-colors">
          View <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
