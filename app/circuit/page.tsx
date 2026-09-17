import { createClient } from '@/lib/supabase/server'
import type { Market } from '@/lib/types'
import CircuitForm from './CircuitForm'

export default async function CircuitPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: marketsData }, profileRes] = await Promise.all([
    supabase.from('markets').select('*').order('display_name', { ascending: true }),
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

  const defaultCity = profile?.current_city || 'berlin'
  const todayStr = new Date().toISOString().split('T')[0]

  const defaultFrom = profile?.current_city_from || todayStr

  let defaultTo = profile?.current_city_until
  if (!defaultTo) {
    const twoWeeks = new Date()
    twoWeeks.setDate(twoWeeks.getDate() + 14)
    defaultTo = twoWeeks.toISOString().split('T')[0]
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8">
      <div className="mb-[32px] flex flex-col gap-2">
        <h1 className="t-display text-fg">Circuit</h1>
        <div className="t-body text-muted">What&apos;s on where you&apos;ll be.</div>
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
