import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import FilterBar from '@/components/hub/FilterBar'
import HubFeedView from '@/components/hub/HubFeedView'
import type { HubFeedRow, Market, VocabEntry } from '@/lib/types'

interface HubPageProps {
  searchParams?: Promise<{
    city?: string
    type?: string
    discipline?: string
  }>
}

export default async function HubPage(props: HubPageProps) {
  const searchParams = (await props.searchParams) || {}
  const city = searchParams.city
  const type = searchParams.type
  const discipline = searchParams.discipline

  const hasActiveFilters = Boolean(city || type || discipline)

  const supabase = await createClient()

  // 1. Auth check: determine if user is logged in or guest
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isGuest = !user

  // 2. Fetch markets and vocab from database (Rule 4: dynamic, no hardcoding)
  const [{ data: marketsData }, { data: vocabData }] = await Promise.all([
    supabase.from('markets').select('*').order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
  ])

  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]

  // 3. Query hub_feed view
  let query = supabase
    .from('hub_feed')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false })

  if (city) {
    query = query.eq('city', city)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (discipline) {
    query = query.contains('discipline_flags', [discipline])
  }

  const { data: rowsData, error } = await query
  if (error) {
    console.error('Error querying hub_feed:', error.message)
  }

  const rows = (rowsData || []) as HubFeedRow[]

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <Suspense fallback={<div className="h-[69px] py-4 border-b border-line" />}>
        <FilterBar markets={markets} vocab={vocab} />
      </Suspense>

      <HubFeedView rows={rows} locked={isGuest} hasActiveFilters={hasActiveFilters} />
    </div>
  )
}
