import Link from 'next/link'
import GroupHeader from '@/components/hub/GroupHeader'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EmptyState from '@/components/hub/EmptyState'
import { groupHubRows } from '@/lib/seed'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface HubFeedViewProps {
  rows: HubFeedRow[]
  locked?: boolean
  hasActiveFilters?: boolean
  profile?: Profile | null
  vocab?: VocabEntry[]
}

export default function HubFeedView({
  rows,
  locked = true,
  hasActiveFilters = false,
  profile = null,
  vocab = [],
}: HubFeedViewProps) {
  if (rows.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          title="No open calls match these filters."
          action={{ label: 'Reset', href: '/hub' }}
        />
      )
    }
    return <EmptyState title="The feed is being curated — check back soon." />
  }

  const { closingThisWeek, thisMonth, later, rolling } = groupHubRows(rows)

  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  const openDeadlinesCount = rows.filter((r) => r.deadline || r.is_rolling).length
  const closingThisWeekCount = closingThisWeek.length
  const citiesCount = new Set(rows.map((r) => r.city).filter(Boolean)).size

  const groups = [
    { label: 'CLOSING THIS WEEK', rows: closingThisWeek },
    { label: 'THIS MONTH', rows: thisMonth },
    { label: 'LATER', rows: later },
    { label: 'ROLLING', rows: rolling },
  ].filter((g) => g.rows.length > 0)

  const metaParts = [`${openDeadlinesCount} open`]
  if (closingThisWeekCount > 0) {
    metaParts.push(`${closingThisWeekCount} closing this week`)
  }
  metaParts.push(`${citiesCount} ${citiesCount === 1 ? 'city' : 'cities'}`)

  return (
    <div className="mt-2">
      <div className="mb-6 flex flex-col gap-1">
        <div className="t-meta text-muted">{todayFormatted}</div>
        <h1 className="t-title text-fg">Opportunities</h1>
        <div className="t-body text-muted">{metaParts.join(' · ')}</div>
      </div>

      {groups.map((group, groupIdx) => (
        <div key={group.label} className="mb-4">
          <GroupHeader label={group.label} count={group.rows.length} />
          <div className="flex flex-col gap-2">
            {group.rows.map((row) => (
              <OpportunityRow key={row.opp_id} row={row} locked={locked} profile={profile} vocab={vocab} />
            ))}
          </div>
          {locked && groupIdx === 0 && (
            <div className="mt-4 py-3 text-center">
              <span className="t-body text-muted">
                Sign in to save calls and see which ones you&apos;re eligible for.{' '}
              </span>
              <Link
                href="/signin"
                className="t-body text-fg underline underline-offset-4 hover:opacity-80"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
