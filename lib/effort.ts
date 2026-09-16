export type EffortLevel = 'light' | 'medium' | 'heavy'

export function effortLevel(materialsRequired: string[] = []): EffortLevel {
  if (!materialsRequired || materialsRequired.length === 0) {
    return 'light'
  }

  const normalized = materialsRequired.map((m) => m.toLowerCase().trim())

  const heavyItems = ['budget', 'timeline', 'references', 'recommendation', 'recommendation_letter']
  const mediumItems = ['concept', 'motivation', 'proposal', 'motivation_letter', 'project_proposal']

  const hasHeavy = normalized.some((m) => heavyItems.includes(m))
  if (hasHeavy) {
    return 'heavy'
  }

  const hasMedium = normalized.some((m) => mediumItems.includes(m))
  if (hasMedium) {
    return 'medium'
  }

  return 'light'
}

export function effortLabel(level: EffortLevel): string {
  switch (level) {
    case 'light':
      return 'Light application'
    case 'medium':
      return 'Medium application'
    case 'heavy':
      return 'Heavy application'
  }
}
