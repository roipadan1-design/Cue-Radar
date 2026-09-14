import EmptyState from '@/components/hub/EmptyState'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Opportunities</h1>
      <EmptyState title="The feed is being curated — check back soon." />
    </div>
  )
}
