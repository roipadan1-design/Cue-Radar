'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'deadline', label: 'Deadline: soonest' },
  { value: 'newest', label: 'Newest listed' },
]

interface SortControlProps {
  currentSort: string
}

/**
 * A real, working substitute for ArtConnect's "Sort:" control — two options,
 * both backed by an actual `order()` on the query in app/hub/page.tsx. No
 * fabricated sort modes (e.g. "Most popular") that we have no data to back.
 */
export default function SortControl({ currentSort }: SortControlProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'deadline') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    const str = params.toString()
    router.push(str ? `/hub?${str}` : '/hub')
  }

  return (
    <label className="flex items-center gap-2 t-meta text-muted">
      <span>Sort:</span>
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="h-8 rounded-[var(--radius-sm)] border border-line bg-surface px-2 t-meta text-fg focus:outline-none focus:border-fg"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
