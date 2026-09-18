import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Pilot scope, in one place.
 *
 * The pilot is Israel-only. That is expressed as `markets.is_active` in the database
 * (migrations 0009 and 0010) rather than as a country check in code, so there is still
 * no hard-coded country or city list anywhere in the app (rule 4) and widening the
 * pilot later is one UPDATE, not a code change.
 *
 * Rows for the 22 non-Israel cities are kept, not deleted — they are backup, and the
 * app simply never asks for them.
 *
 * These helpers exist because scoping the feed alone is not enough: a European
 * opportunity or source detail page was still reachable by direct URL, which is exactly
 * the "every mention of a European city" the owner asked to be gone from the site.
 */

export async function getActiveMarketSlugs(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('markets')
    .select('slug')
    .eq('is_active', true)

  if (error) {
    // No silent fallback (rule 2): scope is a correctness question, and guessing it
    // would leak out-of-scope cities rather than fail visibly.
    throw new Error(`Could not load active markets to scope the pilot: ${error.message}`)
  }

  return (data || []).map((m) => m.slug as string)
}

/**
 * True when a row's city/market belongs to the current pilot.
 *
 * A null or empty city is treated as in-scope: rolling and online-only calls have no
 * host city and are not "a city outside Israel". Callers that want to exclude those
 * should check separately.
 */
export function isInPilotScope(
  citySlug: string | null | undefined,
  activeSlugs: string[],
): boolean {
  if (!citySlug) return true
  return activeSlugs.includes(citySlug)
}
