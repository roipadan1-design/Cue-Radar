'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sheet from '@/components/ui/Sheet'
import Chip from '@/components/ui/Chip'
import type { Market, VocabEntry } from '@/lib/types'

interface FilterBarProps {
  markets: Market[]
  vocab: VocabEntry[]
}

export default function FilterBar({ markets, vocab }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const currentCity = searchParams.get('city') || ''
  const currentType = searchParams.get('type') || ''
  const currentDiscipline = searchParams.get('discipline') || ''
  const currentQ = searchParams.get('q') || ''
  const currentEffort = searchParams.get('effort') || ''

  const isNoFee = searchParams.get('no_fee') === 'true'
  const isFunded = searchParams.get('funded') === 'true'
  const isCoversHousing = searchParams.get('covers_housing') === 'true'
  const isCoversTravel = searchParams.get('covers_travel') === 'true'

  const activeCount = [
    currentCity,
    currentType,
    currentDiscipline,
    currentQ,
    currentEffort,
    isNoFee ? 'no_fee' : '',
    isFunded ? 'funded' : '',
    isCoversHousing ? 'covers_housing' : '',
    isCoversTravel ? 'covers_travel' : '',
  ].filter(Boolean).length

  const typeOptions = vocab.filter((v) => v.category === 'type')
  const disciplineOptions = vocab.filter((v) => v.category === 'discipline' && !v.deprecated)

  function getToggleUrl(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== undefined) {
      if (params.get(key) === value) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    } else {
      if (params.get(key) === 'true') {
        params.delete(key)
      } else {
        params.set(key, 'true')
      }
    }
    const str = params.toString()
    return str ? `/hub?${str}` : '/hub'
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
    router.push(`/hub?${params.toString()}`)
  }

  function handleReset() {
    router.push('/hub')
    setIsSheetOpen(false)
  }

  return (
    <div className="py-4 border-b border-line flex flex-col gap-3">
      {/* 1. Search text input */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          name="q"
          defaultValue={currentQ}
          key={currentQ}
          placeholder="Search title, institution, city"
          className="w-full h-10 px-3 pr-16 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
        />
        {currentQ ? (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('q')
              router.push(`/hub?${params.toString()}`)
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

      {/* 2. Horizontally scrolling chip row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-snap-x py-1 -mx-4 px-4 md:mx-0 md:px-0">
        <Chip active={isNoFee} href={getToggleUrl('no_fee')}>
          No fee
        </Chip>
        <Chip active={isFunded} href={getToggleUrl('funded')}>
          Funded
        </Chip>
        <Chip active={isCoversHousing} href={getToggleUrl('covers_housing')}>
          Housing
        </Chip>
        <Chip active={isCoversTravel} href={getToggleUrl('covers_travel')}>
          Travel
        </Chip>
        <Chip active={currentEffort === 'light'} href={getToggleUrl('effort', 'light')}>
          Light application
        </Chip>

        {/* 10 Types */}
        {typeOptions.map((t) => (
          <Chip
            key={t.value}
            active={currentType === t.value}
            href={getToggleUrl('type', t.value)}
          >
            {t.label}
          </Chip>
        ))}

        {/* 7 Disciplines */}
        {disciplineOptions.map((d) => (
          <Chip
            key={d.value}
            active={currentDiscipline === d.value}
            href={getToggleUrl('discipline', d.value)}
          >
            {d.label}
          </Chip>
        ))}

        {/* Reset Link at end of chip row if active */}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="t-meta text-muted hover:text-fg underline underline-offset-4 shrink-0 px-2 min-h-[44px] flex items-center"
          >
            Reset
          </button>
        )}
      </div>

      {/* Mobile City Filter Sheet trigger */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="h-9 px-3 border border-line-strong rounded-[var(--radius)] t-meta text-fg hover:border-fg transition-colors"
        >
          {currentCity ? `City: ${currentCity}` : activeCount > 0 ? `Filter · ${activeCount}` : 'Filter by city'}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="t-meta text-muted hover:text-fg underline underline-offset-4 md:hidden"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Filter Opportunities">
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="t-meta text-muted">City</label>
            <select
              value={currentCity}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString())
                if (e.target.value) params.set('city', e.target.value)
                else params.delete('city')
                router.push(`/hub?${params.toString()}`)
              }}
              className="bg-surface border border-line rounded-[var(--radius)] h-11 px-3 t-body text-sm text-fg"
            >
              <option value="">All cities</option>
              {markets.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.display_name}
                </option>
              ))}
            </select>
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
