import Link from 'next/link'
import Chip from '@/components/ui/Chip'
import { checkEligibility } from '@/lib/fit'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface OpportunityRowProps {
  row: HubFeedRow
  locked?: boolean
  saved?: boolean
  profile?: Profile | null
  vocab?: VocabEntry[]
}

export function formatFunding(row: HubFeedRow): string {
  if (row.funding_min || row.funding_max) {
    const symbol = row.currency === 'USD' ? '$' : row.currency === 'GBP' ? '£' : '€'
    if (row.funding_min && row.funding_max) {
      if (row.funding_min === row.funding_max) {
        return `${symbol}${row.funding_min.toLocaleString('en-US')}`
      }
      return `${symbol}${row.funding_min.toLocaleString('en-US')}–${row.funding_max.toLocaleString('en-US')}`
    }
    if (row.funding_min) return `${symbol}${row.funding_min.toLocaleString('en-US')}`
    if (row.funding_max) return `${symbol}${row.funding_max.toLocaleString('en-US')}`
  }
  if (row.funding_type === 'artist_fee' || row.funding_type === 'stipend') return 'Fee'
  if (row.funding_type === 'in_kind') return 'In-kind'
  return '—'
}

export function formatDeadline(row: HubFeedRow): { text: string; isUrgent: boolean } {
  if (row.is_rolling || !row.deadline) {
    return { text: 'Rolling', isUrgent: false }
  }

  if (row.days_left !== undefined && row.days_left !== null) {
    if (row.days_left < 0) {
      return { text: 'Closed', isUrgent: false }
    }
    if (row.days_left < 7) {
      return { text: `${row.days_left} ${row.days_left === 1 ? 'day' : 'days'} left`, isUrgent: true }
    }
    const deadlineDate = new Date(row.deadline)
    const month = deadlineDate.toLocaleString('en-US', { month: 'short' })
    const day = deadlineDate.getDate()
    return { text: `Closes ${month} ${day}`, isUrgent: false }
  }

  return { text: row.deadline, isUrgent: false }
}

/**
 * The single differentiator tag shown on a card face: whichever of
 * "funded" or "no fee" is the more decision-relevant fact for this row.
 * Returns null when neither applies, keeping the tag cap at two.
 */
export function getDifferentiatorTag(row: HubFeedRow): string | null {
  const isFunded =
    (row.funding_min ?? 0) > 0 ||
    (row.funding_max ?? 0) > 0 ||
    ['grant', 'stipend', 'artist_fee', 'salaried'].includes(row.funding_type ?? '')
  if (isFunded) return 'Funded'
  if (row.application_fee === 0) return 'No fee'
  return null
}

export default function OpportunityRow({
  row,
  locked = false,
  profile = null,
  vocab = [],
}: OpportunityRowProps) {
  const fundingText = formatFunding(row)
  const deadlineInfo = formatDeadline(row)

  // Card-face tags — capped at three: discipline, city, one differentiator.
  const disciplineCode = row.discipline_flags?.[0]
  const disciplineLabel = disciplineCode
    ? vocab.find((v) => v.category === 'discipline' && v.value === disciplineCode)?.label ||
      disciplineCode
    : null
  const cityLabel = row.city_name || row.city || null
  const differentiator = getDifferentiatorTag(row)

  // Eligibility badge — only for signed-in users (profile present)
  const eligibility = !locked && profile ? checkEligibility(profile, row) : null

  return (
    <Link
      href={`/opportunities/${row.slug}`}
      className="block p-4 border border-line rounded-[var(--radius)] bg-bg hover:border-line-strong transition-colors"
    >
      <div className="flex flex-col gap-2">
        <h3 className="t-row text-fg line-clamp-2">{row.title}</h3>

        <div className="t-meta text-muted truncate">{row.source_name}</div>

        {(disciplineLabel || cityLabel || differentiator) && (
          <div className="flex flex-wrap items-center gap-2">
            {disciplineLabel && <Chip>{disciplineLabel}</Chip>}
            {cityLabel && <Chip>{cityLabel}</Chip>}
            {differentiator && <Chip tone="accent">{differentiator}</Chip>}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
          <div className="hidden md:block t-num text-[14px] text-fg font-medium">
            {fundingText}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2">
            <span className="md:hidden t-num text-[14px] text-fg font-medium">
              {fundingText}
            </span>
            {eligibility && (
              <span
                className={`t-meta ${eligibility.isEligible ? 'text-accent' : 'text-muted'}`}
                title={eligibility.reasons.join(' · ')}
              >
                {eligibility.isEligible ? 'Eligible ✓' : 'Check terms'}
              </span>
            )}
            <span
              className={`t-meta ${deadlineInfo.isUrgent ? 'text-urgent' : 'text-muted'}`}
            >
              {deadlineInfo.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
