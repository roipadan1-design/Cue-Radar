import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OpportunityRow from '@/components/hub/OpportunityRow'
import GroupHeader from '@/components/hub/GroupHeader'
import EventRow from '@/components/radar/EventRow'
import EmptyState from '@/components/hub/EmptyState'
import ListingFilterBar from '@/components/filters/ListingFilterBar'
import { Suspense } from 'react'
import type { HubFeedRow, EventRow as EventRowType, Profile, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams?: Promise<{
    from?: string
    to?: string
    q?: string
    type?: string
    discipline?: string
    free?: string
    no_japanese?: string
  }>
}

// Event types shown under "Workshops & classes" (§7.2). Everything else in
// the `event_type` vocab category falls into "On stage & exhibitions" — this
// two-bucket split is a page-layout rule from the task spec itself, not a
// hard-coded copy of a DB option list (rule 4 targets the latter).
const WORKSHOP_EVENT_TYPES = ['workshop', 'class', 'lab', 'masterclass']

function defaultDateRange(): { from: string; to: string } {
  const today = new Date()
  const from = today.toISOString().split('T')[0]
  const future = new Date(today)
  future.setDate(future.getDate() + 14)
  const to = future.toISOString().split('T')[0]
  return { from, to }
}

function formatHeaderDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)
  } catch {
    return dateStr
  }
}

function computeDayCount(fromStr: string, toStr: string): number {
  const from = new Date(fromStr)
  const to = new Date(toStr)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0
  const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

export default async function CircuitCityPage(props: PageProps) {
  const params = await props.params
  const searchParams = (await props.searchParams) || {}
  const citySlug = params.city

  const defaults = defaultDateRange()
  const from = searchParams.from || defaults.from
  const to = searchParams.to || defaults.to

  const supabase = await createClient()

  // Scoped to active markets (migration 0009): a city parked outside the pilot
  // must 404 rather than render an empty day-by-day page for a place we do not
  // cover. The flag is read from the database, never a country list in code.
  const { data: market } = await supabase
    .from('markets')
    .select('*')
    .eq('slug', citySlug)
    .eq('is_active', true)
    .maybeSingle()

  if (!market) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: vocabData }, profileResult] = await Promise.all([
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    user
      ? supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const vocab = (vocabData || []) as VocabEntry[]
  const profile = profileResult.data as Profile | null

  // Section (a): opportunities closing in this city while the artist is there.
  let oppQuery = supabase
    .from('hub_feed')
    .select('*')
    .eq('city', citySlug)
    .gte('deadline', from)
    .lte('deadline', to)
    .order('deadline', { ascending: true })

  if (process.env.NEXT_PUBLIC_SHOW_DEMO === 'false') {
    oppQuery = oppQuery.or('is_demo.eq.false,is_demo.is.null')
  }

  const { data: oppData, error: oppError } = await oppQuery
  if (oppError) {
    console.error('Error querying hub_feed for circuit:', oppError.message)
  }
  const closingOpportunities = (oppData || []) as HubFeedRow[]

  // Sections (b) and (c): events in this city and window. A multi-day run
  // (exhibition, festival) that started before the window but is still open
  // counts too (end_date, migration 0012).
  let eventQuery = supabase
    .from('events')
    .select('*')
    .eq('market', citySlug)
    .lte('date', to)
    .or(`date.gte.${from},end_date.gte.${from}`)
    .order('date', { ascending: true })

  // Task 22 filter bar (ArtConnect layout). Every option comes from vocab.
  const { q, type, discipline } = searchParams
  if (q) {
    const e = q.replace(/[,()]/g, ' ').replace(/[%_]/g, '\\$&')
    eventQuery = eventQuery.or(`title.ilike.%${e}%,venue_name.ilike.%${e}%,lineup.ilike.%${e}%`)
  }
  if (type) eventQuery = eventQuery.eq('event_type', type)
  if (discipline) eventQuery = eventQuery.contains('disciplines', [discipline])
  if (searchParams.free === 'true') eventQuery = eventQuery.eq('price_min', 0)
  if (searchParams.no_japanese === 'true') eventQuery = eventQuery.eq('language_barrier', 'none')

  if (process.env.NEXT_PUBLIC_SHOW_DEMO === 'false') {
    eventQuery = eventQuery.or('is_demo.eq.false,is_demo.is.null')
  }

  const { data: eventData, error: eventError } = await eventQuery
  if (eventError) {
    console.error('Error querying events for circuit:', eventError.message)
  }
  const events = (eventData || []) as EventRowType[]

  const typeOptions = vocab
    .filter((v) => v.category === 'event_type')
    .map((v) => ({ value: v.value, label: v.label }))
  const disciplineOptions = vocab
    .filter((v) => v.category === 'discipline' && !v.deprecated)
    .map((v) => ({ value: v.value, label: v.label }))

  const workshopsAndClasses = events.filter((e) => WORKSHOP_EVENT_TYPES.includes(e.event_type))
  const stageAndExhibitions = events.filter((e) => !WORKSHOP_EVENT_TYPES.includes(e.event_type))

  const hasAnyContent =
    closingOpportunities.length > 0 ||
    workshopsAndClasses.length > 0 ||
    stageAndExhibitions.length > 0

  const dayCount = computeDayCount(from, to)

  return (
    <div className="container-reading py-8 pb-24">
      <div className="mb-[32px] flex flex-col">
        <Link href="/circuit" className="t-meta text-muted hover:text-fg transition-colors">
          ← Explore
        </Link>
        <h1 className="t-title text-fg mt-[8px]">{market.display_name}</h1>
        <div className="t-body text-muted mt-[4px]">
          <span className="t-num">{formatHeaderDate(from)}</span> &ndash;{' '}
          <span className="t-num">{formatHeaderDate(to)}</span>
          {dayCount > 0 && ` · ${dayCount} ${dayCount === 1 ? 'day' : 'days'}`}
        </div>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-[160px]" />}>
          <ListingFilterBar
            basePath={`/circuit/${citySlug}`}
            searchPlaceholder="Search events, venues, artists"
            dropdowns={[
              { param: 'type', label: 'Type', options: typeOptions },
              { param: 'discipline', label: 'Field', options: disciplineOptions },
            ]}
            toggles={[
              { param: 'free', label: 'Free' },
              { param: 'no_japanese', label: 'No Japanese needed' },
            ]}
            resultCount={events.length}
            resultNoun={['event', 'events']}
          />
        </Suspense>
      </div>

      {!hasAnyContent && (
        <EmptyState
          title={`Nothing on in ${market.display_name} for these dates yet.`}
          body="Try a wider date range, or check back soon as more is verified."
        />
      )}

      {closingOpportunities.length > 0 && (
        <section className="mb-8">
          <GroupHeader label="Closing while you're there" count={closingOpportunities.length} />
          <div className="flex flex-col gap-4 mt-4">
            {closingOpportunities.map((row) => (
              <OpportunityRow key={row.opp_id} row={row} profile={profile} vocab={vocab} />
            ))}
          </div>
        </section>
      )}

      {workshopsAndClasses.length > 0 && (
        <section className="mb-8">
          <GroupHeader label="Workshops & classes" count={workshopsAndClasses.length} />
          <div className="flex flex-col gap-4 mt-4">
            {workshopsAndClasses.map((event) => (
              <EventRow key={event.event_id} event={event} vocab={vocab} />
            ))}
          </div>
        </section>
      )}

      {stageAndExhibitions.length > 0 && (
        <section className="mb-8">
          <GroupHeader label="On stage & exhibitions" count={stageAndExhibitions.length} />
          <div className="flex flex-col gap-4 mt-4">
            {stageAndExhibitions.map((event) => (
              <EventRow key={event.event_id} event={event} vocab={vocab} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
