'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Chip from '@/components/ui/Chip'
import type { Market, VocabEntry } from '@/lib/types'

interface SourcesFilterBarProps {
  markets: Market[]
  vocab: VocabEntry[]
}

/**
 * Directory search bar in the ArtConnect pattern the owner asked for: two search
 * controls side by side — one by name, one by city — both visible on the page,
 * plus the discipline filter inline.
 *
 * This replaces a single search field whose city and discipline filters were
 * buried behind a "Filters" button that opened a bottom sheet with a scrolling
 * region-grouped city list. That made sense for 33 cities across 20 countries;
 * with the pilot scoped to Israel the whole city list fits in one <select>, and
 * hiding it behind two taps was costing far more than it saved.
 *
 * Cities come from `markets` (already scoped to is_active by the page) and
 * disciplines from `vocab` — no hard-coded lists (rule 4).
 */
export default function SourcesFilterBar({ markets, vocab }: SourcesFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCity = searchParams.get('city') || ''
  const currentDiscipline = searchParams.get('discipline') || ''
  const currentQ = searchParams.get('q') || ''

  const activeCount = [currentCity, currentDiscipline, currentQ].filter(Boolean).length
  const disciplineOptions = vocab.filter((v) => v.category === 'discipline' && !v.deprecated)

  function pushWith(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    const str = params.toString()
    router.push(str ? `/sources?${str}` : '/sources')
  }

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
    const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement
    const value = input.value.trim()
    pushWith((params) => {
      if (value) params.set('q', value)
      else params.delete('q')
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="search"
            name="q"
            defaultValue={currentQ}
            key={currentQ}
            aria-label="Search organisations by name"
            placeholder="Search by name"
            className="input-shell pr-20"
          />
          <button
            type="submit"
            className="absolute right-3 text-[13px] font-semibold text-muted hover:text-fg transition-colors"
          >
            Search
          </button>
        </form>

        <select
          aria-label="Filter by city"
          value={currentCity}
          onChange={(e) =>
            pushWith((params) => {
              if (e.target.value) params.set('city', e.target.value)
              else params.delete('city')
            })
          }
          className="input-shell"
        >
          <option value="">All cities</option>
          {markets.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.display_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {disciplineOptions.map((d) => (
          <Chip
            key={d.value}
            active={currentDiscipline === d.value}
            href={getToggleUrl('discipline', d.value)}
          >
            {d.label}
          </Chip>
        ))}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => router.push('/sources')}
            className="ml-auto text-[14px] font-medium text-muted hover:text-fg underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
