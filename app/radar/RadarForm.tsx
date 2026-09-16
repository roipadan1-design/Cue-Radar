'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import type { Market } from '@/lib/types'

interface RadarFormProps {
  markets: Market[]
  defaultCity: string
  defaultFrom: string
  defaultTo: string
}

export default function RadarForm({
  markets,
  defaultCity,
  defaultFrom,
  defaultTo,
}: RadarFormProps) {
  const router = useRouter()
  const [city, setCity] = useState(defaultCity)
  const [fromDate, setFromDate] = useState(defaultFrom)
  const [toDate, setToDate] = useState(defaultTo)

  // Group markets by region
  const groupedMarkets: Record<string, Market[]> = {}
  markets.forEach((m) => {
    const r = m.region || 'Other'
    if (!groupedMarkets[r]) groupedMarkets[r] = []
    groupedMarkets[r].push(m)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city) return
    router.push(`/radar/${city}?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[400px]">
      <div className="flex flex-col gap-1.5">
        <label className="t-meta text-muted">City</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        >
          {Object.entries(groupedMarkets).map(([region, regionMarkets]) => (
            <optgroup key={region} label={region}>
              {regionMarkets.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.display_name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
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

      <Button variant="primary" type="submit" className="mt-2 min-h-[44px]">
        Explore city
      </Button>
    </form>
  )
}
