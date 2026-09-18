import type { LucideIcon } from 'lucide-react'
import { LayoutList, Route, Compass, Bookmark, User } from 'lucide-react'

/**
 * Single source of truth for the app's primary navigation destinations.
 * TopBarNav (desktop text nav) and MobileNav (bottom tab bar) both read from
 * this so they cannot drift apart again — previously each hard-coded its own
 * copy of the same four items and Discover was linked from neither.
 *
 * Real routes only (AGENTS.md rule: no nav item for a page that does not
 * exist). `profile` is included here because MobileNav still surfaces it as a
 * bottom tab; TopBarNav renders it separately as the account control on the
 * far right rather than as a sixth text link, matching the ArtConnect shell
 * (nav items, then CTA + avatar) — see docs/DECISIONS.md, Task 21.
 */
export interface NavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  isActive: (pathname: string) => boolean
}

export function getNavItems(isSignedIn: boolean): NavItem[] {
  return [
    {
      key: 'hub',
      label: 'Hub',
      href: '/hub',
      icon: LayoutList,
      isActive: (pathname) => pathname === '/hub' || pathname === '/',
    },
    {
      key: 'circuit',
      label: 'Currently',
      href: '/circuit',
      icon: Route,
      isActive: (pathname) => pathname.startsWith('/circuit'),
    },
    {
      key: 'discover',
      label: 'Discover',
      href: '/discover',
      icon: Compass,
      isActive: (pathname) => pathname.startsWith('/discover'),
    },
    {
      key: 'saved',
      label: 'Saved',
      href: '/saved',
      icon: Bookmark,
      isActive: (pathname) => pathname.startsWith('/saved'),
    },
    {
      key: 'profile',
      label: 'Profile',
      href: isSignedIn ? '/profile/edit' : '/signin?next=/profile/edit',
      icon: User,
      isActive: (pathname) => pathname.startsWith('/profile'),
    },
  ]
}
