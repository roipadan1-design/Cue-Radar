'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getNavItems } from '@/components/layout/nav-items'

interface TopBarNavProps {
  isSignedIn: boolean
}

/**
 * Desktop shell nav, ArtConnect-shaped: a horizontal row of sentence-case text
 * links (Dashboard/Opportunities/Discover/... over there is Hub/Currently/
 * Discover/Saved here), active item marked with an underline rather than the
 * old hard inverted block. Profile is deliberately excluded — it becomes the
 * account control TopBar renders on the far right, next to the primary CTA.
 */
export default function TopBarNav({ isSignedIn }: TopBarNavProps) {
  const pathname = usePathname()
  const items = getNavItems(isSignedIn).filter((item) => item.key !== 'profile')

  return (
    <nav className="hidden md:flex items-center gap-7 t-body">
      {items.map((item) => {
        const isActive = item.isActive(pathname)

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative py-2 transition-colors ${
              isActive ? 'text-fg' : 'text-fg-soft hover:text-fg'
            }`}
          >
            {item.label}
            <span
              className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full transition-colors ${
                isActive ? 'bg-accent' : 'bg-transparent'
              }`}
              aria-hidden="true"
            />
          </Link>
        )
      })}
    </nav>
  )
}
