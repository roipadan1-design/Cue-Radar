'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, ArrowRight, Check } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDropdown {
  param: string
  label: string
  options: FilterOption[]
}

export interface FilterToggle {
  param: string
  label: string
}

interface ListingFilterBarProps {
  basePath: string
  searchPlaceholder: string
  searchHint?: string
  dropdowns?: FilterDropdown[]
  toggles?: FilterToggle[]
  resultCount: number
  resultNoun: [singular: string, plural: string]
  sort?: { param: string; options: FilterOption[] }
}

/**
 * Task 22 — ArtConnect's listing filter layout (owner reference, 2026-10-19):
 * one large search box with its own Search button, a row of dropdown buttons and
 * on/off toggle buttons under it, then a hairline, the result count on the left and
 * sort on the right. Their reward/type rows use emoji; ours never do — icons, if
 * any, are lucide line icons, and every option label comes from vocab, markets or
 * the query result (rule 4).
 *
 * Every control writes to the URL, so the server page does the filtering and any
 * other params on the page (tab, from, to) carry through untouched.
 */
export default function ListingFilterBar({
  basePath,
  searchPlaceholder,
  searchHint,
  dropdowns = [],
  toggles = [],
  resultCount,
  resultNoun,
  sort,
}: ListingFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openKey, setOpenKey] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const currentQ = searchParams.get('q') || ''
  const managed = [
    'q',
    ...dropdowns.map((d) => d.param),
    ...toggles.map((t) => t.param),
  ]
  const activeCount = managed.filter((p) => searchParams.get(p)).length

  useEffect(() => {
    if (!openKey) return
    function onPointer(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenKey(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenKey(null)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [openKey])

  function push(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    const str = params.toString()
    setOpenKey(null)
    router.push(str ? `${basePath}?${str}` : basePath)
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement
    push({ q: input.value.trim() || null })
  }

  function handleReset() {
    push(Object.fromEntries(managed.map((p) => [p, null])))
  }

  const pillBase =
    'inline-flex items-center gap-2 h-10 px-4 rounded-[var(--radius)] border text-[14px] font-medium whitespace-nowrap transition-colors'
  const pillIdle = 'border-line-strong text-fg-soft hover:border-fg hover:text-fg bg-bg'
  const pillOn = 'border-fg bg-fg text-bg'

  const currentSort = sort ? searchParams.get(sort.param) || sort.options[0]?.value : null
  const currentSortLabel = sort?.options.find((o) => o.value === currentSort)?.label

  return (
    <div ref={barRef} className="flex flex-col gap-4">
      <div>
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 h-14 pl-4 pr-2 bg-surface border border-line rounded-[var(--radius-lg)] focus-within:border-fg-soft transition-colors"
        >
          <Search size={18} className="text-muted shrink-0" aria-hidden="true" />
          <input
            type="text"
            name="q"
            key={currentQ}
            defaultValue={currentQ}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="flex-1 min-w-0 h-full bg-transparent t-body text-fg placeholder:text-muted focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[var(--radius)] border border-line-strong text-[14px] font-medium text-fg hover:border-fg transition-colors shrink-0"
          >
            Search
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>
        {searchHint && <p className="t-meta text-muted mt-2 ml-1">{searchHint}</p>}
      </div>

      {(dropdowns.length > 0 || toggles.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {dropdowns.map((d) => {
            const current = searchParams.get(d.param)
            const currentLabel = d.options.find((o) => o.value === current)?.label
            const isOpen = openKey === d.param
            return (
              <div key={d.param} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : d.param)}
                  className={`${pillBase} ${current ? pillOn : pillIdle}`}
                >
                  {currentLabel ? `${d.label}: ${currentLabel}` : d.label}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <ul
                    role="listbox"
                    aria-label={d.label}
                    className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[220px] max-h-[320px] overflow-y-auto py-1 bg-surface border border-line-strong rounded-[var(--radius)] shadow-[var(--shadow-raised)]"
                  >
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={!current}
                        onClick={() => push({ [d.param]: null })}
                        className="w-full flex items-center justify-between gap-3 px-3 h-10 text-left text-[14px] text-fg-soft hover:bg-surface-2 hover:text-fg"
                      >
                        Any
                        {!current && <Check size={14} aria-hidden="true" />}
                      </button>
                    </li>
                    {d.options.map((o) => (
                      <li key={o.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={current === o.value}
                          onClick={() => push({ [d.param]: o.value })}
                          className="w-full flex items-center justify-between gap-3 px-3 h-10 text-left text-[14px] text-fg-soft hover:bg-surface-2 hover:text-fg"
                        >
                          {o.label}
                          {current === o.value && <Check size={14} aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}

          {toggles.map((t) => {
            const on = searchParams.get(t.param) === 'true'
            return (
              <button
                key={t.param}
                type="button"
                aria-pressed={on}
                onClick={() => push({ [t.param]: on ? null : 'true' })}
                className={`${pillBase} ${on ? pillOn : pillIdle}`}
              >
                {t.label}
              </button>
            )
          })}

          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="h-10 px-2 t-meta text-muted hover:text-fg underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
        <p className="t-meta text-muted">
          <span className="t-num text-fg-soft">{resultCount}</span>{' '}
          {resultCount === 1 ? resultNoun[0] : resultNoun[1]}
        </p>
        {sort && (
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openKey === '__sort'}
              onClick={() => setOpenKey(openKey === '__sort' ? null : '__sort')}
              className="inline-flex items-center gap-1 t-meta text-muted hover:text-fg"
            >
              Sort: <span className="text-fg">{currentSortLabel}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {openKey === '__sort' && (
              <ul
                role="listbox"
                aria-label="Sort"
                className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[200px] py-1 bg-surface border border-line-strong rounded-[var(--radius)] shadow-[var(--shadow-raised)]"
              >
                {sort.options.map((o, i) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={currentSort === o.value}
                      onClick={() => push({ [sort.param]: i === 0 ? null : o.value })}
                      className="w-full flex items-center justify-between gap-3 px-3 h-10 text-left text-[14px] text-fg-soft hover:bg-surface-2 hover:text-fg"
                    >
                      {o.label}
                      {currentSort === o.value && <Check size={14} aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
