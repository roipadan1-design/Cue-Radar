import type { HubFeedRow } from './types'

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

  // Sort: deadline asc, rolling last
  const sorted = [...rows].sort((a, b) => {
    if (a.is_rolling && !b.is_rolling) return 1
    if (!a.is_rolling && b.is_rolling) return -1
    if (!a.deadline || !b.deadline) return 0
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  sorted.forEach((r) => {
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
