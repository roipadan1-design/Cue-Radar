import Link from 'next/link'
import { checkEligibility } from '@/lib/fit'
import { effortLevel, effortLabel } from '@/lib/effort'
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
  if (row.funding_type === 'none') return 'None'
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
    return { text: `Closes ${day} ${month}`, isUrgent: false }
  }

  return { text: row.deadline, isUrgent: false }
}

export default function OpportunityRow({
  row,
  locked = false,
  profile = null,
  vocab = [],
}: OpportunityRowProps) {
  const sourceCity = [row.source_name, row.city_name].filter(Boolean).join(' · ')
  const fundingText = formatFunding(row)
  const deadlineInfo = formatDeadline(row)

  // Resolve type label from vocab
  const typeVocab = vocab.find((v) => v.category === 'type' && v.value === row.type)
  const typeLabel = typeVocab ? typeVocab.label : row.type

  // Resolve first 2 discipline labels from vocab
  const disciplineLabels = (row.discipline_flags || []).slice(0, 2).map((flag) => {
    const found = vocab.find((v) => v.category === 'discipline' && v.value === flag)
    return found ? found.label : flag
  })

  const effort = effortLevel(row.materials_required)
  const eLabel = effortLabel(effort)

  // Build tag line items
  const tags: string[] = []
  if (typeLabel) tags.push(typeLabel)
  if (disciplineLabels.length > 0) tags.push(disciplineLabels.join(', '))
  if (fundingText !== '—') tags.push(fundingText)
  if (row.application_fee === 0) tags.push('No fee')
  if (row.covers?.includes('housing')) tags.push('Housing')
  if (row.covers?.includes('travel')) tags.push('Travel')
  tags.push(eLabel)
  if (row.is_demo) tags.push('Demo')

  // Eligibility badge — only for signed-in users (profile present) on unlocked rows
  const eligibility = !locked && profile ? checkEligibility(profile, row) : null

  if (locked) {
    return (
      <div className="py-4 border-b border-line flex flex-col gap-1.5">
        <h3 className="t-row text-muted line-clamp-2">{row.title}</h3>
      </div>
    )
  }

  return (
    <Link
      href={`/opportunities/${row.slug}`}
      className="group block py-4 border-b border-line hover:bg-surface transition-colors"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="t-row text-fg line-clamp-2">{row.title}</h3>

        <div className="t-body text-[14px] text-muted truncate">
          {sourceCity}
        </div>

        {/* Tag line */}
        {tags.length > 0 && (
          <div className="t-meta text-muted text-[11px] line-clamp-2">
            {tags.join('  ·  ')}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="t-num text-[14px] text-fg font-medium">
            {fundingText}
          </span>
          <div className="flex items-center gap-2">
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
