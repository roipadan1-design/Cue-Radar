'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutList, Route, Bookmark, User } from 'lucide-react'

interface MobileNavProps {
  isSignedIn?: boolean
}

export default function MobileNav({ isSignedIn = false }: MobileNavProps) {
  const pathname = usePathname()

  const items = [
    { label: 'Hub', href: '/hub', icon: LayoutList },
    { label: 'Currently', href: '/circuit', icon: Route },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: isSignedIn ? '/profile/edit' : '/signin?next=/profile/edit', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(56px+env(safe-area-inset-bottom))] bg-surface border-t border-line px-2 flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
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
            className="flex-1 h-full min-h-[44px] flex items-center justify-center"
          >
            <span
              className={`flex flex-col items-center justify-center gap-1 t-meta px-3 py-1 rounded-[var(--radius)] transition-colors ${
                isActive ? 'bg-fg text-bg font-semibold' : 'text-muted hover:text-fg'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] tracking-normal leading-none">{item.label}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
