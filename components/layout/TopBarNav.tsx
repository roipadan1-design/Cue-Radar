'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutList, Route, Bookmark, User } from 'lucide-react'

interface TopBarNavProps {
  isSignedIn: boolean
}

export default function TopBarNav({ isSignedIn }: TopBarNavProps) {
  const pathname = usePathname()

  const items = [
    { label: 'Hub', href: '/hub', icon: LayoutList },
    { label: 'Currently', href: '/circuit', icon: Route },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: isSignedIn ? '/profile/edit' : '/signin?next=/profile/edit', icon: User },
  ]

  return (
    <nav className="hidden md:flex items-center gap-1 t-meta">
      {items.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href === '/hub' && pathname === '/') ||
          (item.href === '/circuit' && pathname.startsWith('/circuit'))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius)] transition-colors ${
              isActive ? 'bg-fg text-bg' : 'text-muted hover:text-fg'
            }`}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
