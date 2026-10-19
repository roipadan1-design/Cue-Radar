import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Mark from '@/components/brand/Mark'
import { BRAND } from '@/lib/brand'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const PILLARS: { label: string; line: string; href: string; soon?: boolean }[] = [
  { label: "What's on", line: 'Shows, classes, jams, parties and openings, today and this week.', href: '/circuit' },
  { label: 'People', line: 'Artists, curators, collectives and spaces, and a page that introduces you.', href: '/discover' },
  { label: 'Open calls', line: 'Residencies, commissions and calls for work, with the deadline up front.', href: '/hub', soon: true },
  { label: 'Funding', line: "Grants and support for independent work, checked before they're listed.", href: '/hub', soon: true },
]

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
    <div className="container-page py-10 md:py-16">
      <div className="animate-mark-fade mb-10 flex items-center gap-2 text-fg">
        <span className="text-muted font-normal select-none t-title">[</span>
        <Mark size="sm" />
        <span className="t-title text-fg tracking-[0.04em] uppercase">{BRAND.wordmark}</span>
        <span className="text-muted font-normal select-none t-title">]</span>
      </div>

      {/* Copy: docs/creative/HERO_COPY_FINAL_DRAFT_2026-10-19.md, shortened by the
          owner on 2026-10-19. No city names in the copy; the chips below come from the DB.
          Open calls and funding are in the future tense because the pillars below say "Soon". */}
      <h1 className="t-display text-fg max-w-[20ch]">
        Land anywhere. Someone is already making something.
      </h1>

      <p id="about" className="t-body text-muted max-w-[60ch] mt-5 scroll-mt-16">
        Wherever the work takes you, there are opportunities around every corner. Shows, classes
        and openings on your dates, the makers and curators behind them, and the open calls,
        residencies and funding on their way. Based in the city? Be found.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <Button variant="primary" href="/circuit">
          Land here
        </Button>
        {user ? (
          <Link href="/profile/edit" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
            Your profile
          </Link>
        ) : (
          <Link href="/signup" className="t-body text-fg underline underline-offset-4 hover:opacity-80">
            Create your profile
          </Link>
        )}
      </div>

      <h2 className="t-display text-fg max-w-[24ch] mt-16 md:mt-20">
        Art. Culture. Making. Production. Let&apos;s make connections.
      </h2>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((p) => (
          <Link
            key={p.label}
            href={p.href}
            className="group card p-5 flex flex-col gap-2 hover:border-line-strong transition-colors"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="t-row text-fg">
                {p.label}
                {p.soon && (
                  <span className="relative -top-1.5 ml-1.5 text-[10px] uppercase tracking-[0.06em] text-muted">
                    Soon
                  </span>
                )}
              </span>
              <ArrowRight size={16} aria-hidden="true" className="text-muted group-hover:text-accent transition-colors" />
            </span>
            <span className="t-body text-[14px] text-muted">{p.line}</span>
          </Link>
        ))}
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
      </div>
    </div>
  )
}
