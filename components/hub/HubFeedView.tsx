import Link from 'next/link'
import GroupHeader from '@/components/hub/GroupHeader'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EmptyState from '@/components/hub/EmptyState'
import SortControl from '@/components/hub/SortControl'
import { groupHubRows } from '@/lib/seed'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface HubFeedViewProps {
  rows: HubFeedRow[]
  locked?: boolean
  hasActiveFilters?: boolean
  profile?: Profile | null
  vocab?: VocabEntry[]
  userId?: string
  savedOppIds?: Set<string>
  sort?: string
}

export default function HubFeedView({
  rows,
  locked = true,
  hasActiveFilters = false,
  profile = null,
  vocab = [],
  userId,
  savedOppIds,
  sort = 'deadline',
}: HubFeedViewProps) {
  const resultsRow = (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="t-body text-fg-soft">
        {rows.length} {rows.length === 1 ? 'opportunity' : 'opportunities'}
      </span>
      <SortControl currentSort={sort} />
    </div>
  )

  if (rows.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="mt-2">
          {resultsRow}
          <EmptyState
            title="No open calls match these filters."
            action={{ label: 'Reset', href: '/hub' }}
          />
        </div>
      )
    }
    return (
      <div className="mt-2">
        {resultsRow}
        <EmptyState title="The feed is being curated — check back soon." />
      </div>
    )
  }

  const renderRow = (row: HubFeedRow) => (
    <OpportunityRow
      key={row.opp_id}
      row={row}
      locked={locked}
      saved={savedOppIds?.has(row.opp_id) ?? false}
      userId={userId}
      profile={profile}
      vocab={vocab}
    />
  )

  const signInPrompt = locked && (
    <div className="mt-4 py-3 text-center">
      <span className="t-body text-muted">
        Sign in to save calls and see which ones you&apos;re eligible for.{' '}
      </span>
      <Link href="/signin" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
        Sign in
      </Link>
    </div>
  )

  // "Newest listed" sort is a flat, un-grouped list — grouping by deadline
  // urgency would fight a sort whose whole point is recency, so it only
  // applies to the default "Deadline: soonest" sort.
  if (sort === 'newest') {
    return (
      <div className="mt-2">
        {resultsRow}
        <div className="flex flex-col gap-3">{rows.map(renderRow)}</div>
        {signInPrompt}
      </div>
    )
  }

  const { closingThisWeek, thisMonth, later, rolling } = groupHubRows(rows)

  const groups = [
    { label: 'CLOSING THIS WEEK', rows: closingThisWeek },
    { label: 'THIS MONTH', rows: thisMonth },
    { label: 'LATER', rows: later },
    { label: 'ROLLING', rows: rolling },
  ].filter((g) => g.rows.length > 0)

  return (
    <div className="mt-2">
      {resultsRow}

      {groups.map((group, groupIdx) => (
        <div key={group.label} className="mb-4">
          <GroupHeader label={group.label} count={group.rows.length} />
          <div className="flex flex-col gap-3 pt-3">{group.rows.map(renderRow)}</div>
          {groupIdx === 0 && signInPrompt}
        </div>
      ))}
    </div>
  )
}
