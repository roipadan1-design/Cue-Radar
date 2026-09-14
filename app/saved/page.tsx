import EmptyState from '@/components/hub/EmptyState'

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Pipeline</h1>
      <EmptyState
        title="No saved opportunities yet"
        action={{ label: 'Explore feed', href: '/' }}
      />
    </div>
  )
}
