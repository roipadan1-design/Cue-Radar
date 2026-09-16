import Link from 'next/link'
import GroupHeader from '@/components/hub/GroupHeader'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EmptyState from '@/components/hub/EmptyState'
import { groupHubRows } from '@/lib/hub'
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
  locked = false,
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

  const openCount = rows.filter((r) => r.deadline || r.is_rolling).length
  const closingThisWeekCount = closingThisWeek.length
  const citiesCount = new Set(rows.map((r) => r.city).filter(Boolean)).size

  const metaCounts = [
    `${openCount} open`,
    closingThisWeekCount > 0 ? `${closingThisWeekCount} closing this week` : null,
    `${citiesCount} ${citiesCount === 1 ? 'city' : 'cities'}`,
  ]
    .filter(Boolean)
    .join('  ·  ')

  const groups = [
    { label: 'CLOSING THIS WEEK', rows: closingThisWeek },
    { label: 'THIS MONTH', rows: thisMonth },
    { label: 'LATER', rows: later },
    { label: 'ROLLING', rows: rolling },
  ].filter((g) => g.rows.length > 0)

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <div className="t-meta text-muted">{todayFormatted}</div>
        <h1 className="t-title text-fg text-2xl md:text-3xl font-semibold">
          Opportunities
        </h1>
        <div className="t-body text-muted text-sm">{metaCounts}</div>
      </div>

      {groups.map((group, groupIdx) => {
        const groupRows = group.rows

        return (
          <div key={group.label} className="mb-6">
            <GroupHeader label={group.label} count={groupRows.length} />
            <div>
              {groupRows.map((row) => (
                <OpportunityRow
                  key={row.opp_id}
                  row={row}
                  locked={false}
                  profile={profile}
                  vocab={vocab}
                />
              ))}
            </div>

            {/* Guest mode inline banner after the first group */}
            {locked && groupIdx === 0 && (
              <div className="my-6 p-4 bg-surface border border-line text-center rounded-[var(--radius)]">
                <div className="t-body text-fg text-sm">
                  Sign in to save calls and see which ones you&apos;re eligible for.
                </div>
                <div className="mt-2">
                  <Link
                    href="/signin"
                    className="t-meta text-fg underline underline-offset-4 hover:opacity-80"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
