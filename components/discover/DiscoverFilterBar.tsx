'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Chip from '@/components/ui/Chip'
import type { Market, VocabEntry } from '@/lib/types'

interface DiscoverFilterBarProps {
  markets: Market[]
  vocab: VocabEntry[]
  namePlaceholder: string
}

/**
 * ArtConnect's Discover pattern: two search inputs side by side — by name, and
 * by city or country — plus a discipline filter row. Replaces the old single
 * combined search + a Sheet-based city/discipline modal; the owner asked for
 * "search rows for people, organisations etc." explicitly.
 *
 * City search resolves only against `markets` rows the page already scoped to
 * `is_active = true` (Israel-only pilot) — never a hard-coded city/country list
 * (rule 4). Typing something that doesn't match an active market's name shows an
 * inline message instead of silently filtering to nothing.
 */
export default function DiscoverFilterBar({ markets, vocab, namePlaceholder }: DiscoverFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentQ = searchParams.get('q') || ''
  const currentCity = searchParams.get('city') || ''
  const currentDiscipline = searchParams.get('discipline') || ''

  const currentCityLabel = markets.find((m) => m.slug === currentCity)?.display_name || ''
  const [cityInput, setCityInput] = useState(currentCityLabel)
  const [cityNotFound, setCityNotFound] = useState(false)

  const disciplineOptions = vocab.filter((v) => v.category === 'discipline' && !v.deprecated)
  const activeCount = [currentQ, currentCity, currentDiscipline].filter(Boolean).length

  function pushParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    const str = params.toString()
    router.push(str ? `/discover?${str}` : '/discover')
  }

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('q') as HTMLInputElement
    pushParams({ q: input.value.trim() || null })
  }

  function handleCitySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const typed = cityInput.trim()
    if (!typed) {
      setCityNotFound(false)
      pushParams({ city: null })
      return
    }
    const lower = typed.toLowerCase()
    const match =
      markets.find((m) => m.display_name.toLowerCase() === lower) ||
      markets.find((m) => m.display_name.toLowerCase().includes(lower)) ||
      markets.find((m) => m.country.toLowerCase() === lower)
    if (match) {
      setCityInput(match.display_name)
      setCityNotFound(false)
      pushParams({ city: match.slug })
    } else {
      setCityNotFound(true)
    }
  }

  function getDisciplineToggleUrl(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('discipline') === value) params.delete('discipline')
    else params.set('discipline', value)
    const str = params.toString()
    return str ? `/discover?${str}` : '/discover'
  }

  function handleReset() {
    setCityInput('')
    setCityNotFound(false)
    router.push('/discover')
  }

  return (
    <div className="py-4 border-b border-line flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleNameSubmit} className="relative flex items-center flex-1">
          <input
            type="text"
            name="q"
            defaultValue={currentQ}
            key={currentQ}
            placeholder={namePlaceholder}
            className="w-full h-11 px-3 pr-16 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
          />
          <button
            type="submit"
            className="absolute right-3 t-meta text-muted hover:text-fg text-xs font-medium"
          >
            Search
          </button>
        </form>

        <form onSubmit={handleCitySubmit} className="relative flex items-center flex-1">
          <input
            type="text"
            list="discover-cities"
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value)
              setCityNotFound(false)
            }}
            placeholder="Search by city or country"
            className="w-full h-11 px-3 pr-16 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg focus:outline-none focus:border-fg"
          />
          <datalist id="discover-cities">
            {markets.map((m) => (
              <option key={m.slug} value={m.display_name} />
            ))}
          </datalist>
          <button
            type="submit"
            className="absolute right-3 t-meta text-muted hover:text-fg text-xs font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {cityNotFound && (
        <p className="t-meta text-urgent">
          No pilot-market city or country matches &quot;{cityInput}&quot;.
        </p>
      )}

      {disciplineOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {disciplineOptions.map((d) => (
            <Chip
              key={d.value}
              active={currentDiscipline === d.value}
              href={getDisciplineToggleUrl(d.value)}
            >
              {d.label}
            </Chip>
          ))}
        </div>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="t-meta text-muted hover:text-fg underline underline-offset-4 w-fit"
        >
          Reset all
        </button>
      )}
    </div>
  )
}
