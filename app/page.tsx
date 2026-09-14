import Link from 'next/link'
import Button from '@/components/ui/Button'
import { getSeedMarkets } from '@/lib/seed'

export default function LandingPage() {
  const markets = getSeedMarkets()

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6">
      <div id="mark-slot" />

      <h1 className="t-display text-fg mt-[64px]">
        Open calls, residencies
        <br />
        and grants for independent
        <br />
        dance, performance and sound.
      </h1>

      <div className="my-[32px] border-b border-line" />

      <p className="t-body text-muted max-w-[52ch]">
        A curated feed across European and Mediterranean scenes. Verified by people, not scraped. Built for artists who work between cities.
      </p>

      <div className="mt-[32px] flex items-center gap-4">
        <Link href="/hub">
          <Button variant="primary">Enter</Button>
        </Link>
        <Link href="/hub">
          <Button variant="ghost">Browse open calls</Button>
        </Link>
      </div>

      <div className="mt-[64px] pb-12">
        <p className="t-meta text-muted mb-2">CITIES</p>
        <p className="t-body text-muted">
          {markets.map((m) => m.display_name).join(' · ')}
        </p>
      </div>
    </div>
  )
}
