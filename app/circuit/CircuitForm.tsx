'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Sheet from '@/components/ui/Sheet'
import type { Market } from '@/lib/types'

interface CircuitFormProps {
  markets: Market[]
  defaultCity: string
  defaultFrom: string
  defaultTo: string
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d)
}

// Computed fresh on each render from "today" — not a hard-coded list, just
// the fast-path date ranges the redesign spec calls for (RADAR_REDESIGN.md §3.3).
function computeDatePresets(): Record<string, { from: string; to: string }> {
  const today = new Date()
  const day = today.getDay()
  const weekendOffset = day === 0 ? -2 : day === 6 ? -1 : 5 - day
  const weekendFrom = addDays(today, weekendOffset)
  const weekendTo = addDays(weekendFrom, 2)

  return {
    'Next 2 weeks': { from: toISODate(today), to: toISODate(addDays(today, 14)) },
    'This weekend': { from: toISODate(weekendFrom), to: toISODate(weekendTo) },
    'Next 7 days': { from: toISODate(today), to: toISODate(addDays(today, 7)) },
    'Next 30 days': { from: toISODate(today), to: toISODate(addDays(today, 30)) },
  }
}

export default function CircuitForm({
  markets,
  defaultCity,
  defaultFrom,
  defaultTo,
}: CircuitFormProps) {
  const router = useRouter()
  const [city, setCity] = useState(defaultCity)
  const [fromDate, setFromDate] = useState(defaultFrom)
  const [toDate, setToDate] = useState(defaultTo)
  const [isCitySheetOpen, setIsCitySheetOpen] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [showCustomDates, setShowCustomDates] = useState(false)

  const presets = useMemo(() => computeDatePresets(), [])
  const selectedMarket = markets.find((m) => m.slug === city)

  const groupedMarkets: Record<string, Market[]> = {}
  markets
    .filter((m) => m.display_name.toLowerCase().includes(citySearch.trim().toLowerCase()))
    .forEach((m) => {
      const r = m.region || 'Other'
      if (!groupedMarkets[r]) groupedMarkets[r] = []
      groupedMarkets[r].push(m)
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city) return
    router.push(`/circuit/${city}?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[440px]">
      <div className="flex flex-col gap-1.5">
        <label className="t-meta text-muted">City</label>
        <button
          type="button"
          onClick={() => setIsCitySheetOpen(true)}
          className="h-14 px-4 bg-surface border border-line rounded-[var(--radius)] flex items-center justify-between hover:border-fg transition-colors focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2"
        >
          <span className="t-row text-fg">{selectedMarket?.display_name || 'Choose a city'}</span>
          <span className="text-muted" aria-hidden="true">
            ⌄
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="t-meta text-muted">Dates</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([label, range]) => (
            <Chip
              key={label}
              active={fromDate === range.from && toDate === range.to}
              onClick={() => {
                setFromDate(range.from)
                setToDate(range.to)
                setShowCustomDates(false)
              }}
            >
              {label}
            </Chip>
          ))}
          <Chip onClick={() => setShowCustomDates((v) => !v)}>Custom</Chip>
        </div>

        {showCustomDates && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex flex-col gap-1.5">
              <label className="t-meta text-muted">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="t-meta text-muted">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
              />
            </div>
          </div>
        )}

        <div className="t-meta text-muted mt-2">
          <span className="t-num">{formatShortDate(fromDate)}</span> &ndash;{' '}
          <span className="t-num">{formatShortDate(toDate)}</span>
        </div>
      </div>

      <Button variant="primary" type="submit" className="w-full h-12 mt-2">
        See what&apos;s on
      </Button>

      <Sheet isOpen={isCitySheetOpen} onClose={() => setIsCitySheetOpen(false)} title="Choose a city">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search cities"
            className="h-10 px-3 bg-bg border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
          />

          <div className="flex flex-col">
            {Object.entries(groupedMarkets).map(([region, regionMarkets]) => (
              <div key={region} className="mt-4 first:mt-0">
                <div className="t-meta text-muted mb-1">{region}</div>
                <div className="flex flex-col">
                  {regionMarkets.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => {
                        setCity(m.slug)
                        setIsCitySheetOpen(false)
                        setCitySearch('')
                      }}
                      className={`min-h-[44px] px-3 t-body text-left rounded-[var(--radius)] transition-colors ${
                        m.slug === city ? 'bg-fg text-bg' : 'text-fg hover:bg-surface'
                      }`}
                    >
                      {m.display_name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(groupedMarkets).length === 0 && (
              <div className="t-body text-muted py-4">No cities match &quot;{citySearch}&quot;.</div>
            )}
          </div>
        </div>
      </Sheet>
    </form>
  )
}
