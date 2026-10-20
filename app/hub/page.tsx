import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// Task 22: the open-calls Hub is paused while the pilot focuses on exploring
// the city. The full feed is parked, unrouted, in app/hub/_feed/ (Next.js
// ignores `_`-prefixed folders) and comes back by moving HubFeedPage.tsx
// back to app/hub/page.tsx.
export default function HubComingSoonPage() {
  return (
    <div className="container-reading min-h-[calc(100vh-200px)] flex flex-col justify-center py-12">
      <Badge tone="accent" uppercase className="self-start">
        Coming soon
      </Badge>
      <h1 className="t-display text-fg mt-5 max-w-[16ch]">Open calls are on their way.</h1>
      <p className="t-body text-muted mt-5 max-w-[52ch]">
        Residencies, grants and open calls, checked by people before they reach you. For now
        we&apos;re focused on what&apos;s happening in the city this week.
      </p>
      <div className="mt-8">
        <Button variant="primary" href="/circuit">
          Around me
        </Button>
      </div>
    </div>
  )
}
