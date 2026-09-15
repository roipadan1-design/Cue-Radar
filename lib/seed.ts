import fs from 'node:fs'
import path from 'node:path'
import { parseCsv } from './csv'
import type { Market, VocabEntry, HubFeedRow, ProfileView } from './types'

function readSeedFile(filename: string): Record<string, string>[] {
  const filePath = path.join(process.cwd(), 'data', 'seed', filename)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required seed CSV file at: ${filePath}`)
  }
  const content = fs.readFileSync(filePath, 'utf-8')
  return parseCsv(content)
}

function parseArrayField(val: string | undefined): string[] {
  if (!val) return []
  let cleaned = val.trim()
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    cleaned = cleaned.slice(1, -1)
  }
  if (!cleaned) return []
  return cleaned.split(',').map((s) => s.trim().replace(/^"|"$/g, '')).filter(Boolean)
}

function parseNumberField(val: string | undefined): number | null {
  if (!val) return null
  const num = Number(val)
  return isNaN(num) ? null : num
}

export function getSeedMarkets(): Market[] {
  const rows = readSeedFile('markets.csv')
  return rows.map((r) => ({
    slug: r.slug,
    display_name: r.display_name,
    country: r.country,
    region: r.region,
    timezone: r.timezone,
    currency: r.currency,
    lat: Number(r.lat || 0),
    lng: Number(r.lng || 0),
  }))
}

export function getSeedVocab(): VocabEntry[] {
  const rows = readSeedFile('vocab.csv')
  return rows.map((r) => ({
    category: r.category,
    value: r.value,
    label: r.label,
    sort_order: Number(r.sort_order || 0),
  }))
}

export function getSeedSources(): Record<string, string>[] {
  return readSeedFile('sources.csv')
}

export function getDemoProfile(): ProfileView {
  const filePath = path.join(process.cwd(), 'data', 'seed', 'profile_demo.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required seed file at: ${filePath}`)
  }
  const content = fs.readFileSync(filePath, 'utf-8')
  const json = JSON.parse(content)

  return {
    id: 'demo-user-id',
    handle: json.handle,
    full_name: json.full_name,
    role_label: json.role_label || null,
    locations: json.locations || [],
    current_city: json.current_city || null,
    current_city_until: json.current_city_until || null,
    available_from: json.available_from || null,
    open_for_collab: Boolean(json.open_for_collab),
    bio: json.bio || null,
    disciplines: json.disciplines || [],
    active_since: json.active_since ?? null,
    languages: json.languages || [],
    showreel_url: json.showreel_url || null,
    avatar_url: json.avatar_url || null,
    social_links: {
      instagram: json.instagram || null,
      website: json.website || null,
    },
    is_public: Boolean(json.is_public),
    works: json.works || [],
  }
}

export function getSeedOpportunitiesStaging(): HubFeedRow[] {
  const rows = readSeedFile('opportunities_staging.csv')
  const markets = getSeedMarkets()
  const marketMap = new Map(markets.map((m) => [m.slug, m]))
  const sources = getSeedSources()
  const sourceMap = new Map(sources.map((s) => [s.source_id, s]))

  const todayStr = new Date().toISOString().split('T')[0]
  const today = new Date(todayStr).getTime()

  return rows.map((r) => {
    const deadline = r.deadline || null
    let days_left: number | null = null
    const is_rolling = !deadline

    if (deadline) {
      const d = new Date(deadline).getTime()
      days_left = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    }

    const citySlug = r.city || null
    const market = citySlug ? marketMap.get(citySlug) : null
    const source = sourceMap.get(r.source_id)

    return {
      opp_id: r.opp_id,
      source_id: r.source_id,
      title: r.title,
      slug: r.slug,
      summary: r.summary || null,
      type: r.type,
      discipline_flags: parseArrayField(r.discipline_flags),
      city: citySlug,
      deadline,
      funding_min: parseNumberField(r.funding_min),
      funding_max: parseNumberField(r.funding_max),
      currency: r.currency || null,
      funding_type: r.funding_type || null,
      covers: parseArrayField(r.covers),
      application_fee: Number(r.application_fee || 0),
      eligibility_geo: parseArrayField(r.eligibility_geo),
      career_stage: r.career_stage || null,
      materials_required: parseArrayField(r.materials_required),
      apply_url: r.apply_url,
      status: (r.status as HubFeedRow['status']) || 'draft',
      verified_at: r.verified_at || null,
      verified_by: r.verified_by || null,
      created_at: r.created_at,
      updated_at: r.updated_at,
      source_name: source?.name || r.source_id,
      city_name: market?.display_name || citySlug,
      region: market?.region || null,
      days_left,
      is_rolling,
    }
  })
}

export interface GroupedHubRows {
  closingThisWeek: HubFeedRow[]
  thisMonth: HubFeedRow[]
  later: HubFeedRow[]
  rolling: HubFeedRow[]
}

export function groupHubRows(rows: HubFeedRow[]): GroupedHubRows {
  const closingThisWeek: HubFeedRow[] = []
  const thisMonth: HubFeedRow[] = []
  const later: HubFeedRow[] = []
  const rolling: HubFeedRow[] = []

  rows.forEach((r) => {
    if (r.is_rolling || r.days_left === null || r.days_left === undefined) {
      rolling.push(r)
    } else if (r.days_left <= 7) {
      closingThisWeek.push(r)
    } else if (r.days_left <= 30) {
      thisMonth.push(r)
    } else {
      later.push(r)
    }
  })

  return { closingThisWeek, thisMonth, later, rolling }
}
