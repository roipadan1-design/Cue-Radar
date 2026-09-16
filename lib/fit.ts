import type { Profile, HubFeedRow } from '@/lib/types'

export interface EligibilityResult {
  isEligible: boolean
  reasons: string[]
}

/**
 * Checks whether an artist profile appears eligible for an opportunity.
 * This is an informational guide — it never hard-gates access.
 * All checks are client-side, read-only, and produce human-readable reason strings.
 */
export function checkEligibility(
  profile: Profile,
  opp: HubFeedRow,
): EligibilityResult {
  const reasons: string[] = []
  let eligible = true

  // 1. Discipline match
  if (opp.discipline_flags && opp.discipline_flags.length > 0) {
    const profileDisciplines = (profile.disciplines || []).map((d) =>
      d.toLowerCase(),
    )
    const oppDisciplines = opp.discipline_flags.map((d) => d.toLowerCase())
    const hasMatch = oppDisciplines.some((d) => profileDisciplines.includes(d))
    if (hasMatch) {
      reasons.push('Discipline match')
    } else if (profileDisciplines.length > 0) {
      eligible = false
      reasons.push(`Seeks: ${opp.discipline_flags.join(', ')}`)
    }
  }

  // 2. Geographic eligibility
  if (opp.eligibility_geo && opp.eligibility_geo.length > 0) {
    const geoTerms = opp.eligibility_geo.map((g) => g.toLowerCase())

    // Check profile locations (string array of slugs or free-text)
    const profileLocations = (profile.locations || []).map((l) =>
      l.toLowerCase(),
    )
    const currentCity = profile.current_city?.toLowerCase() ?? null

    const profileGeoEntries = currentCity
      ? [...profileLocations, currentCity]
      : profileLocations

    const geoMatch = geoTerms.some((geo) =>
      profileGeoEntries.some(
        (loc) => loc.includes(geo) || geo.includes(loc),
      ),
    )

    if (geoMatch) {
      reasons.push('Location eligible')
    } else if (profileGeoEntries.length > 0) {
      eligible = false
      reasons.push(`Open to: ${opp.eligibility_geo.join(', ')}`)
    }
  }

  // 3. Career stage (informational — no hard gate because Profile has no career_stage field)
  if (opp.career_stage && opp.career_stage !== 'any') {
    reasons.push(`Stage: ${opp.career_stage}`)
  }

  // If no checks produced a mismatch, default to eligible
  if (reasons.length === 0) {
    reasons.push('Check eligibility terms')
  }

  return { isEligible: eligible, reasons }
}
