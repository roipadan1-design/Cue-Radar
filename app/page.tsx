import Link from 'next/link'
import Button from '@/components/ui/Button'
import Mark from '@/components/brand/Mark'
import IntroSplash from '@/components/brand/IntroSplash'
import { BRAND } from '@/lib/brand'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: marketsData } = await supabase
    .from('markets')
    .select('slug, display_name')
    .order('display_name', { ascending: true })
  const markets = marketsData || []
  const visibleMarkets = markets.slice(0, 5)
  const remainingCount = markets.length - visibleMarkets.length

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-12">
      <IntroSplash />
      <div className="animate-mark-fade mb-[56px] flex items-center justify-center md:justify-start gap-2 text-fg">
        <span className="text-muted font-normal select-none t-title">[</span>
        <Mark size="sm" />
        <span className="t-title text-fg tracking-[0.04em] uppercase">{BRAND.wordmark}</span>
        <span className="text-muted font-normal select-none t-title">]</span>
      </div>

      <h1 className="t-display text-fg text-center md:text-left">
        Your connections and collabs
        <br />
        don&apos;t stay in one city.
      </h1>

      <div className="my-[32px] border-b border-line" />

      <p className="t-body text-muted max-w-[52ch] mx-auto md:mx-0 text-center md:text-left">
        Verified open calls, residencies and grants &#8212; plus what&apos;s worth catching in each city &#8212; for artists who work between places.
      </p>

      <div className="mt-[32px] flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6">
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

      <div className="mt-[64px] flex flex-col items-center md:items-start">
        <p className="t-meta text-muted mb-2">CITIES</p>
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {visibleMarkets.map((m) => (
            <span
              key={m.slug}
              className="t-meta text-muted border border-line rounded-[var(--radius)] px-2 py-1"
            >
              {m.display_name}
            </span>
          ))}
          {remainingCount > 0 && (
            <Link
              href="/hub"
              className="t-meta text-accent border border-line-strong rounded-[var(--radius)] px-2 py-1"
            >
              +{remainingCount} more
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
