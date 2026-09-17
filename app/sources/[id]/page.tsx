import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SourceDetailView, { type ClosedOpportunity } from '@/components/sources/SourceDetailView'
import type { HubFeedRow, Profile, Source, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SourceDetailPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()

  const { data: sourceData } = await supabase
    .from('sources')
    .select('*, markets(display_name)')
    .eq('source_id', id)
    .maybeSingle()

  if (!sourceData) {
    notFound()
  }

  const marketObj = sourceData.markets as { display_name: string } | null
  const cityName = marketObj?.display_name ?? null
  const source = sourceData as Source

  const [
    {
      data: { user },
    },
    { data: vocabData },
    { data: liveRowsData },
    { data: allOppsData },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    supabase.from('hub_feed').select('*').eq('source_id', id).order('deadline', { ascending: true }),
    // Full history, excluding unverified draft/approved rows — this is a
    // public archive of calls that were actually live at some point, not a
    // preview of unverified pipeline content (AGENTS.md rule 1).
    supabase
      .from('opportunities')
      .select('opp_id, title, deadline, created_at, expected_next_open, status')
      .eq('source_id', id)
      .in('status', ['live', 'expired', 'archived'])
      .order('deadline', { ascending: false, nullsFirst: false }),
  ])

  const vocab = (vocabData || []) as VocabEntry[]
  const liveRows = (liveRowsData || []) as HubFeedRow[]

  let profile: Profile | null = null
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    profile = profileData as Profile | null
  }

  const sourceTypeEntry = vocab.find((v) => v.category === 'source_type' && v.value === source.source_type)
  const sourceTypeLabel = sourceTypeEntry
    ? sourceTypeEntry.label
    : source.source_type
    ? source.source_type.charAt(0).toUpperCase() + source.source_type.slice(1)
    : ''

  const allOpps = allOppsData || []
  const liveOppIds = new Set(liveRows.map((r) => r.opp_id))

  // Closed rows: everything not currently live on the Hub (expired/archived,
  // plus any 'live'-status row hub_feed itself excludes, e.g. a past deadline
  // not yet swept by the sync job).
  const closedRows: ClosedOpportunity[] = allOpps
    .filter((o) => !liveOppIds.has(o.opp_id))
    .map((o) => ({
      opp_id: o.opp_id,
      title: o.title,
      deadline: o.deadline,
      created_at: o.created_at,
    }))
    .sort((a, b) => {
      const aKey = a.deadline || a.created_at || ''
      const bKey = b.deadline || b.created_at || ''
      return bKey.localeCompare(aKey)
    })

  // "Usually opens in {month}" — most recently updated opportunity row with a
  // non-null expected_next_open, read directly from the column (Task 08),
  // never inferred client-side from deadline history.
  const withRecurrence = allOpps
    .filter((o) => o.expected_next_open)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  const recurrenceMonth = withRecurrence.length
    ? new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(new Date(withRecurrence[0].expected_next_open as string))
    : null

  return (
    <SourceDetailView
      source={source}
      cityName={cityName}
      sourceTypeLabel={sourceTypeLabel}
      liveRows={liveRows}
      closedRows={closedRows}
      recurrenceMonth={recurrenceMonth}
      vocab={vocab}
      profile={profile}
      sourcesDirectoryLive={true}
    />
  )
}
