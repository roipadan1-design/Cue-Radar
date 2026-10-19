import Link from 'next/link'

/**
 * Task 23: Saved moved out of the main nav and into the personal area. Both
 * /profile/edit and /saved carry this strip so the two read as one place.
 */
const TABS = [
  { key: 'profile', label: 'Your profile', href: '/profile/edit' },
  { key: 'saved', label: 'Saved', href: '/saved' },
] as const

export default function ProfileAreaTabs({ active }: { active: 'profile' | 'saved' }) {
  return (
    <div className="flex items-center gap-6 border-b border-line mb-8 overflow-x-auto overflow-y-hidden">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? 'page' : undefined}
          className={`pb-3 -mb-px shrink-0 t-row text-[15px] border-b-2 transition-colors ${
            active === tab.key ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
