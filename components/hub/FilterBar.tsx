'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sheet from '@/components/ui/Sheet'
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

  const activeCount = [currentCity, currentType, currentDiscipline].filter(Boolean).length

  const typeOptions = vocab.filter((v) => v.category === 'type')
  const disciplineOptions = vocab.filter((v) => v.category === 'discipline')

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/hub?${params.toString()}`)
  }

  function handleReset() {
    router.push('/hub')
    setIsSheetOpen(false)
  }

  return (
    <div className="py-4 border-b border-line flex items-center justify-between">
      {/* Mobile filter button */}
      <div className="md:hidden flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="h-9 px-3 border border-line-strong rounded-[var(--radius)] t-meta text-fg hover:border-fg transition-colors"
        >
          {activeCount > 0 ? `Filter · ${activeCount}` : 'Filter'}
        </button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="t-meta text-muted hover:text-fg underline underline-offset-4"
          >
            Reset
          </button>
        )}
      </div>

      {/* Desktop inline selects */}
      <div className="hidden md:flex items-center gap-4">
        <select
          value={currentCity}
          onChange={(e) => updateParam('city', e.target.value)}
          className="bg-surface border border-line rounded-[var(--radius)] h-9 px-3 t-body text-xs text-fg focus:outline-none focus:border-fg"
        >
          <option value="">All cities</option>
          {markets.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.display_name}
            </option>
          ))}
        </select>

        <select
          value={currentType}
          onChange={(e) => updateParam('type', e.target.value)}
          className="bg-surface border border-line rounded-[var(--radius)] h-9 px-3 t-body text-xs text-fg focus:outline-none focus:border-fg"
        >
          <option value="">All types</option>
          {typeOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={currentDiscipline}
          onChange={(e) => updateParam('discipline', e.target.value)}
          className="bg-surface border border-line rounded-[var(--radius)] h-9 px-3 t-body text-xs text-fg focus:outline-none focus:border-fg"
        >
          <option value="">All disciplines</option>
          {disciplineOptions.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="t-meta text-muted hover:text-fg underline underline-offset-4"
          >
            Reset
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
              onChange={(e) => updateParam('city', e.target.value)}
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

          <div className="flex flex-col gap-1.5">
            <label className="t-meta text-muted">Type</label>
            <select
              value={currentType}
              onChange={(e) => updateParam('type', e.target.value)}
              className="bg-surface border border-line rounded-[var(--radius)] h-11 px-3 t-body text-sm text-fg"
            >
              <option value="">All types</option>
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="t-meta text-muted">Discipline</label>
            <select
              value={currentDiscipline}
              onChange={(e) => updateParam('discipline', e.target.value)}
              className="bg-surface border border-line rounded-[var(--radius)] h-11 px-3 t-body text-sm text-fg"
            >
              <option value="">All disciplines</option>
              {disciplineOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
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
