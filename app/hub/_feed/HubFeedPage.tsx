import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import FilterBar from '@/components/hub/FilterBar'
import HubFeedView from '@/components/hub/HubFeedView'
import { effortLevel } from '@/lib/effort'
import type { HubFeedRow, Market, Profile, VocabEntry } from '@/lib/types'

interface HubPageProps {
  searchParams?: Promise<{
    city?: string
    type?: string
    discipline?: string
    no_fee?: string
    funded?: string
    covers_housing?: string
    covers_travel?: string
    q?: string
    effort?: string
    sort?: string
  }>
}

export default async function HubPage(props: HubPageProps) {
  const searchParams = (await props.searchParams) || {}
  const city = searchParams.city
  const type = searchParams.type
  const discipline = searchParams.discipline
  const noFee = searchParams.no_fee === 'true'
  const funded = searchParams.funded === 'true'
  const coversHousing = searchParams.covers_housing === 'true'
  const coversTravel = searchParams.covers_travel === 'true'
  const q = searchParams.q?.trim()
  const effort = searchParams.effort
  const sort = searchParams.sort === 'newest' ? 'newest' : 'deadline'

  const hasActiveFilters = Boolean(
    city ||
      type ||
      discipline ||
      noFee ||
      funded ||
      coversHousing ||
      coversTravel ||
      q ||
      effort,
  )

  const supabase = await createClient()

  // Israel-only pilot (migration 0009_market_scope.sql): markets carries an
  // additive `is_active` flag instead of deleting non-Israel rows (rule 6).
  // `hub_feed` is a view, and views don't retain the FK metadata PostgREST
  // needs for a `markets!inner(...)` embed, so the feed is scoped here by
  // fetching the active market slugs first and filtering hub_feed.city
  // against them — see docs/DECISIONS.md Task 21 for why. This also fetches
  // markets before the feed query, which is why it isn't in the Promise.all
  // batch below.
  const { data: marketsData } = await supabase
    .from('markets')
    .select('*')
    .eq('is_active', true)
    .order('display_name', { ascending: true })
  const markets = (marketsData || []) as Market[]
  const activeSlugs = markets.map((m) => m.slug)

  // Build the hub_feed query so it can run concurrently with the auth/vocab
  // calls below instead of waiting on them one by one — this was the main
  // source of the multi-second delay on every filter click (four sequential
  // Supabase round-trips).
  let feedQuery = supabase.from('hub_feed').select('*')

  feedQuery =
    sort === 'newest'
      ? feedQuery.order('created_at', { ascending: false, nullsFirst: false })
      : feedQuery.order('deadline', { ascending: true, nullsFirst: false })

  if (process.env.NEXT_PUBLIC_SHOW_DEMO === 'false') {
    feedQuery = feedQuery.or('is_demo.eq.false,is_demo.is.null')
  }

  // Scope to the pilot: rows tied to an active (Israeli) market, plus rows
  // with no market at all (rolling/remote calls aren't tied to a city we're
  // hiding). Never a hard-coded city or country list (rule 4) — the slugs
  // come straight out of the markets query above.
  if (activeSlugs.length > 0) {
    feedQuery = feedQuery.or(`city.in.(${activeSlugs.join(',')}),city.is.null`)
  } else {
    feedQuery = feedQuery.is('city', null)
  }

  if (city) {
    feedQuery = feedQuery.eq('city', city)
  }
  if (type) {
    feedQuery = feedQuery.eq('type', type)
  }
  if (discipline) {
    feedQuery = feedQuery.contains('discipline_flags', [discipline])
  }

  // Deliverable A: financial & eligibility boolean filters
  if (noFee) {
    feedQuery = feedQuery.eq('application_fee', 0)
  }
  if (funded) {
    feedQuery = feedQuery.or(
      'funding_min.gt.0,funding_type.in.(grant,stipend,artist_fee,salaried)',
    )
  }
  if (coversHousing) {
    feedQuery = feedQuery.contains('covers', ['housing'])
  }
  if (coversTravel) {
    feedQuery = feedQuery.contains('covers', ['travel'])
  }

  if (q) {
    feedQuery = feedQuery.or(`title.ilike.%${q}%,source_name.ilike.%${q}%,city_name.ilike.%${q}%`)
  }

  const [
    {
      data: { user },
    },
    { data: vocabData },
    { data: rowsData, error },
  ] = await Promise.all([
    supabase.auth.getUser(),
    // Rule 4: dynamic, no hardcoding — vocab comes from the database
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    feedQuery,
  ])

  const isGuest = !user
  const vocab = (vocabData || []) as VocabEntry[]

  if (error) {
    console.error('Error querying hub_feed:', error.message)
  }

  let rows = (rowsData || []) as HubFeedRow[]

  // effort has no column of its own — it's derived from materials_required —
  // so it's filtered client-side (server-side, post-query) rather than via
  // Supabase query builder, same as the pre-regression version of this page.
  if (effort === 'light') {
    rows = rows.filter((r) => effortLevel(r.materials_required) === 'light')
  }

  // Profile + saved-state fetch depend on the user id above, so they can't
  // join the batch above — only signed-in users pay this extra round-trip.
  let profile: Profile | null = null
  let savedOppIds: Set<string> | undefined
  if (user) {
    const [{ data: profileData }, { data: savedData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_saved_opportunities').select('opp_id').eq('user_id', user.id),
    ])
    profile = profileData as Profile | null
    savedOppIds = new Set((savedData || []).map((r) => r.opp_id as string))
  }

  return (
    <div className="container-page py-8 md:py-10">
      <div className="mb-6 md:mb-8 flex flex-col gap-2 max-w-[720px]">
        <h1 className="t-display text-fg">Opportunities</h1>
        <p className="t-body text-muted">
          Verified open calls, residencies and grants for independent artists — updated as sources
          are checked.
        </p>
      </div>

      <Suspense fallback={<div className="h-[140px] py-5 border-b border-line" />}>
        <FilterBar markets={markets} vocab={vocab} />
      </Suspense>

      <HubFeedView
        rows={rows}
        locked={isGuest}
        hasActiveFilters={hasActiveFilters}
        profile={profile}
        vocab={vocab}
        userId={user?.id}
        savedOppIds={savedOppIds}
        sort={sort}
      />
    </div>
  )
}
