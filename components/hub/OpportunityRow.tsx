import Link from 'next/link'
import type { HubFeedRow } from '@/lib/types'

interface OpportunityRowProps {
  row: HubFeedRow
  locked?: boolean
  saved?: boolean
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

export default function OpportunityRow({ row, locked = false }: OpportunityRowProps) {
  const sourceCity = [row.source_name, row.city_name].filter(Boolean).join(' · ')
  const fundingText = formatFunding(row)
  const deadlineInfo = formatDeadline(row)

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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
          <div className="flex items-center gap-2 t-body text-[14px] text-muted min-w-0">
            <span className="truncate">{sourceCity}</span>
            <span className="hidden md:inline text-muted">·</span>
            <span className="hidden md:inline t-num text-[14px] text-fg font-medium">
              {fundingText}
            </span>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2">
            <span className="md:hidden t-num text-[14px] text-fg font-medium">
              {fundingText}
            </span>
            <span
              className={`t-meta ${
                deadlineInfo.isUrgent ? 'text-urgent' : 'text-muted'
              }`}
            >
              {deadlineInfo.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
