import type { VocabEntry } from '@/lib/types'

/**
 * Label for a vocab-backed value. Falls back to a readable form of the raw value
 * ("artist_run_space" -> "Artist run space") when a row predates its vocab entry,
 * so a missing label never renders as a snake_case code.
 */
export function vocabLabel(vocab: VocabEntry[], category: string, value?: string | null): string {
  if (!value) return ''
  const entry = vocab.find((v) => v.category === category && v.value === value)
  if (entry) return entry.label
  const words = value.replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** "Kyoto, Japan" — the location half of ArtConnect's "Type · City, Country" line. */
export function placeLine(cityName?: string | null, country?: string | null): string {
  return [cityName, countryName(country)].filter(Boolean).join(', ')
}

// markets.country holds ISO codes for some rows ('JP', 'IL') and names for others
// ('Japan'); codes are spelled out so the page always says "Kyoto, Japan".
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
function countryName(country?: string | null): string {
  if (!country) return ''
  if (/^[A-Z]{2}$/.test(country)) return regionNames.of(country) ?? country
  return country
}
