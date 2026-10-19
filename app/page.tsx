import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Mark from '@/components/brand/Mark'
import { BRAND } from '@/lib/brand'
import { createClient } from '@/lib/supabase/server'

// "Kyoto and Tokyo" / "Kyoto, Osaka and Tokyo" — built from the active markets
// so the copy follows the pilot scope without naming a city in code (rule 4).
function joinCities(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pilot scope lives in the database, not in code (AGENTS.md rule 4): only
  // markets.is_active markets are the pilot's current cities.
  const { data: marketsData } = await supabase
    .from('markets')
    .select('slug, display_name')
    .eq('is_active', true)
    .order('display_name', { ascending: true })
  const markets = marketsData || []
  const cities = joinCities(markets.map((m) => m.display_name))

  return (
    <div className="container-page py-10 md:py-16">
      <div className="animate-mark-fade mb-10 flex items-center gap-2 text-fg">
        <span className="text-muted font-normal select-none t-title">[</span>
        <Mark size="sm" />
        <span className="t-title text-fg tracking-[0.04em] uppercase">{BRAND.wordmark}</span>
        <span className="text-muted font-normal select-none t-title">]</span>
      </div>

      {/* Task 22: the pilot is now about exploring the city (dance, music,
          exhibitions from the underground), not the open-calls feed, which is
          paused behind "coming soon" at /hub. */}
      <h1 className="t-display text-fg max-w-[20ch]">
        What&apos;s happening in your scene this week.
      </h1>

      <p id="about" className="t-body text-muted max-w-[60ch] mt-5 scroll-mt-16">
        Dance, music and exhibitions from the underground{cities ? ` of ${cities}` : ''}: the
        rooms, the people and the nights worth knowing, checked by people, not scraped.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <Button variant="primary" href="/circuit">
          Explore the city
        </Button>
        {user ? (
          <Link href="/profile/edit" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
            Your profile
          </Link>
        ) : (
          <Link href="/signin" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
            Sign in
          </Link>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-line">
        <p className="t-label mb-3">Cities in the pilot</p>
        <div className="flex flex-wrap gap-2">
          {markets.map((m) => (
            <Link key={m.slug} href={`/circuit/${m.slug}`} className="hover:opacity-80">
              <Badge tone="outline">{m.display_name}</Badge>
            </Link>
          ))}
        </div>
        <p className="t-meta text-muted mt-6">
          Open calls, residencies and grants: <Link href="/hub" className="underline underline-offset-4 hover:text-fg">coming soon</Link>.
        </p>
      </div>
    </div>
  )
}
