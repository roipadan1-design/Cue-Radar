import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EventRow from '@/components/radar/EventRow'
import EmptyState from '@/components/hub/EmptyState'
import type { HubFeedRow, EventRow as EventRowType, Profile, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams?: Promise<{ from?: string; to?: string }>
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

export default async function RadarCityPage(props: PageProps) {
  const params = await props.params
  const searchParams = (await props.searchParams) || {}
  const citySlug = params.city

  const defaults = defaultDateRange()
  const from = searchParams.from || defaults.from
  const to = searchParams.to || defaults.to

  const supabase = await createClient()

  const { data: market } = await supabase
    .from('markets')
    .select('*')
    .eq('slug', citySlug)
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
    console.error('Error querying hub_feed for radar:', oppError.message)
  }
  const closingOpportunities = (oppData || []) as HubFeedRow[]

  // Sections (b) and (c): events in this city and window.
  let eventQuery = supabase
    .from('events')
    .select('*')
    .eq('market', citySlug)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: true })

  if (process.env.NEXT_PUBLIC_SHOW_DEMO === 'false') {
    eventQuery = eventQuery.or('is_demo.eq.false,is_demo.is.null')
  }

  const { data: eventData, error: eventError } = await eventQuery
  if (eventError) {
    console.error('Error querying events for radar:', eventError.message)
  }
  const events = (eventData || []) as EventRowType[]

  const workshopsAndClasses = events.filter((e) => WORKSHOP_EVENT_TYPES.includes(e.event_type))
  const stageAndExhibitions = events.filter((e) => !WORKSHOP_EVENT_TYPES.includes(e.event_type))

  const hasAnyContent =
    closingOpportunities.length > 0 ||
    workshopsAndClasses.length > 0 ||
    stageAndExhibitions.length > 0

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 pb-24">
      <div className="mb-6 flex flex-col gap-1.5">
        <Link href="/radar" className="t-meta text-muted hover:text-fg transition-colors">
          ← Radar
        </Link>
        <h1 className="t-title text-fg text-2xl font-semibold">
          {market.display_name} · {formatHeaderDate(from)} – {formatHeaderDate(to)}
        </h1>
      </div>

      {!hasAnyContent && (
        <EmptyState
          title={`Nothing on in ${market.display_name} for these dates yet.`}
          body="Try a wider date range, or check back soon as more is verified."
        />
      )}

      {closingOpportunities.length > 0 && (
        <section className="mb-8">
          <h2 className="t-meta text-muted mb-1 pb-2 border-b border-line">
            Closing while you&apos;re there · {closingOpportunities.length}
          </h2>
          <div>
            {closingOpportunities.map((row) => (
              <OpportunityRow key={row.opp_id} row={row} profile={profile} vocab={vocab} />
            ))}
          </div>
        </section>
      )}

      {workshopsAndClasses.length > 0 && (
        <section className="mb-8">
          <h2 className="t-meta text-muted mb-1 pb-2 border-b border-line">
            Workshops & classes · {workshopsAndClasses.length}
          </h2>
          <div>
            {workshopsAndClasses.map((event) => (
              <EventRow key={event.event_id} event={event} vocab={vocab} />
            ))}
          </div>
        </section>
      )}

      {stageAndExhibitions.length > 0 && (
        <section className="mb-8">
          <h2 className="t-meta text-muted mb-1 pb-2 border-b border-line">
            On stage & exhibitions · {stageAndExhibitions.length}
          </h2>
          <div>
            {stageAndExhibitions.map((event) => (
              <EventRow key={event.event_id} event={event} vocab={vocab} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
