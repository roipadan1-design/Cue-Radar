import { createClient } from '@/lib/supabase/server'
import type { Market } from '@/lib/types'
import CircuitForm from './CircuitForm'

export default async function CircuitPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: marketsData }, profileRes] = await Promise.all([
    // `is_active` scopes the pilot (Israel-only right now, migration 0009). The
    // flag lives in the database so no city list is ever written into a .tsx.
    supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true }),
    user
      ? supabase
          .from('profiles')
          .select('current_city, current_city_from, current_city_until')
          .eq('id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const markets = (marketsData || []) as Market[]
  const profile = profileRes.data

  // Was hard-coded to 'berlin' — both a rule-4 violation and, since the pilot
  // went Israel-only, a default pointing at a city we no longer cover. Falls
  // back to the first active market instead, whatever the database says that is.
  const activeDefaultCity = markets[0]?.slug ?? ''
  const profileCityIsActive = markets.some((m) => m.slug === profile?.current_city)
  const defaultCity = profileCityIsActive ? (profile?.current_city as string) : activeDefaultCity
  const todayStr = new Date().toISOString().split('T')[0]

  const defaultFrom = profile?.current_city_from || todayStr

  let defaultTo = profile?.current_city_until
  if (!defaultTo) {
    const twoWeeks = new Date()
    twoWeeks.setDate(twoWeeks.getDate() + 14)
    defaultTo = twoWeeks.toISOString().split('T')[0]
  }

  return (
    <div className="container-reading py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="t-title text-fg">Currently</h1>
        <p className="t-body text-muted">What&apos;s on where you&apos;ll be.</p>
      </div>

      <CircuitForm
        markets={markets}
        defaultCity={defaultCity}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />
    </div>
  )
}
