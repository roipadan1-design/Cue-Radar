import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Mark from '@/components/brand/Mark'
import { BRAND } from '@/lib/brand'
import { createClient } from '@/lib/supabase/server'

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

  return (
    <div className="py-10 md:py-16">
      <div className="animate-mark-fade mb-10 flex items-center gap-2 text-fg">
        <span className="text-muted font-normal select-none t-title">[</span>
        <Mark size="sm" />
        <span className="t-title text-fg tracking-[0.04em] uppercase">{BRAND.wordmark}</span>
        <span className="text-muted font-normal select-none t-title">]</span>
      </div>

      <h1 className="t-display text-fg max-w-[18ch]">
        Open calls and connections that follow you between cities.
      </h1>

      <p id="about" className="t-body text-muted max-w-[60ch] mt-5 scroll-mt-16">
        Verified open calls, residencies and grants — for artists who work between places.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <Button variant="primary" href="/hub">
          Browse open calls
        </Button>
        {user ? (
          <Link href="/saved" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
            Go to your saved calls
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
            <Badge key={m.slug} tone="outline">
              {m.display_name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
