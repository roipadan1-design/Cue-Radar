import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import FilterBar from '@/components/hub/FilterBar'
import HubFeedView from '@/components/hub/HubFeedView'
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

  const hasActiveFilters = Boolean(
    city || type || discipline || noFee || funded || coversHousing || coversTravel,
  )

  const supabase = await createClient()

  // Build the hub_feed query (depends only on searchParams, not on auth) so it
  // can run concurrently with the auth/markets/vocab calls below instead of
  // waiting on them one by one — this was the main source of the multi-second
  // delay on every filter click (four sequential Supabase round-trips).
  let feedQuery = supabase
    .from('hub_feed')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false })

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

  const [
    {
      data: { user },
    },
    { data: marketsData },
    { data: vocabData },
    { data: rowsData, error },
  ] = await Promise.all([
    supabase.auth.getUser(),
    // Rule 4: dynamic, no hardcoding — markets/vocab come from the database
    supabase.from('markets').select('*').order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    feedQuery,
  ])

  const isGuest = !user
  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]

  if (error) {
    console.error('Error querying hub_feed:', error.message)
  }

  const rows = (rowsData || []) as HubFeedRow[]

  // Profile fetch depends on the user id above, so it can't join the batch
  // above — only signed-in users pay this extra round-trip.
  let profile: Profile | null = null
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    profile = profileData as Profile | null
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <Suspense fallback={<div className="h-[100px] py-4 border-b border-line" />}>
        <FilterBar markets={markets} vocab={vocab} />
      </Suspense>

      <HubFeedView
        rows={rows}
        locked={isGuest}
        hasActiveFilters={hasActiveFilters}
        profile={profile}
        vocab={vocab}
      />
    </div>
  )
}
