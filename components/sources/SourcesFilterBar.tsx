'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Sheet from '@/components/ui/Sheet'
import Chip from '@/components/ui/Chip'
import type { Market, VocabEntry } from '@/lib/types'

interface SourcesFilterBarProps {
  markets: Market[]
  vocab: VocabEntry[]
}

export default function SourcesFilterBar({ markets, vocab }: SourcesFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const currentCity = searchParams.get('city') || ''
  const currentDiscipline = searchParams.get('discipline') || ''
  const currentQ = searchParams.get('q') || ''

  const activeCount = [currentCity, currentDiscipline, currentQ].filter(Boolean).length
  const panelActiveCount = [currentCity, currentDiscipline].filter(Boolean).length

  const disciplineOptions = vocab.filter((v) => v.category === 'discipline' && !v.deprecated)

  const groupedMarkets = useMemo(() => {
    const groups: Record<string, Market[]> = {}
    markets
      .filter((m) => m.display_name.toLowerCase().includes(citySearch.trim().toLowerCase()))
      .forEach((m) => {
        const r = m.region || 'Other'
        if (!groups[r]) groups[r] = []
        groups[r].push(m)
      })
    return groups
  }, [markets, citySearch])

  function getToggleUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const str = params.toString()
    return str ? `/sources?${str}` : '/sources'
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('q') as HTMLInputElement
    const params = new URLSearchParams(searchParams.toString())
    if (input.value.trim()) {
      params.set('q', input.value.trim())
    } else {
      params.delete('q')
    }
    router.push(`/sources?${params.toString()}`)
  }

  function handleReset() {
    router.push('/sources')
    setCitySearch('')
    setIsSheetOpen(false)
  }

  return (
    <div className="py-4 border-b border-line flex flex-col gap-3">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          name="q"
          defaultValue={currentQ}
          key={currentQ}
          placeholder="Search institutions"
          className="w-full h-10 px-3 pr-16 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
        />
        {currentQ ? (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('q')
              router.push(`/sources?${params.toString()}`)
            }}
            className="absolute right-3 t-meta text-muted hover:text-fg text-xs"
          >
            Clear
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-3 t-meta text-muted hover:text-fg text-xs font-medium"
          >
            Search
          </button>
        )}
      </form>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="min-h-[44px] px-3 border border-line-strong rounded-[var(--radius)] t-meta text-fg hover:border-fg transition-colors"
        >
          Filters{panelActiveCount > 0 ? ` · ${panelActiveCount}` : ''}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="t-meta text-muted hover:text-fg underline underline-offset-4"
          >
            Reset all
          </button>
        )}
      </div>

      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Filters">
        <div className="flex flex-col gap-6 py-2">
          {/* City */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="t-meta text-muted">City</span>
              {currentCity && (
                <button
                  type="button"
                  onClick={() => router.push(getToggleUrl('city', currentCity))}
                  className="t-meta text-muted hover:text-fg underline underline-offset-4"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search cities"
              className="h-10 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
            />
            <div className="flex flex-col max-h-[260px] overflow-y-auto border border-line rounded-[var(--radius)] p-1">
              {Object.entries(groupedMarkets).map(([region, regionMarkets]) => (
                <div key={region} className="mt-3 first:mt-1">
                  <div className="t-meta text-muted px-2 mb-1">{region}</div>
                  <div className="flex flex-col">
                    {regionMarkets.map((m) => (
                      <Link
                        key={m.slug}
                        href={getToggleUrl('city', m.slug)}
                        className={`min-h-[44px] px-2 flex items-center t-body text-sm rounded-[var(--radius)] transition-colors ${
                          m.slug === currentCity ? 'bg-fg text-bg' : 'text-fg hover:bg-surface'
                        }`}
                      >
                        {m.display_name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedMarkets).length === 0 && (
                <div className="t-body text-muted text-sm py-4 px-2">
                  No cities match &quot;{citySearch}&quot;.
                </div>
              )}
            </div>
          </div>

          {/* Discipline */}
          <div className="flex flex-col gap-2">
            <span className="t-meta text-muted">Discipline</span>
            <div className="flex flex-wrap gap-2">
              {disciplineOptions.map((d) => (
                <Chip
                  key={d.value}
                  active={currentDiscipline === d.value}
                  href={getToggleUrl('discipline', d.value)}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-line">
            <button
              type="button"
              onClick={handleReset}
              className="t-meta text-muted hover:text-fg underline underline-offset-4"
            >
              Reset filters
            </button>
            <button
              type="button"
              onClick={() => setIsSheetOpen(false)}
              className="h-10 px-4 bg-fg text-bg rounded-[var(--radius)] t-body font-semibold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
