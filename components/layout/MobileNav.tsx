'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutList, Route, Bookmark, User } from 'lucide-react'

export default function MobileNav() {
  const pathname = usePathname()

  const items = [
    { label: 'Hub', href: '/hub', icon: LayoutList },
    { label: 'Circuit', href: '/circuit', icon: Route },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: '/profile/edit', icon: User },
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
            className={`flex-1 h-full min-h-[44px] flex flex-col items-center justify-center gap-1 t-meta ${
              isActive ? 'text-fg font-semibold' : 'text-muted'
            } hover:text-fg transition-colors`}
          >
            <Icon size={20} className={isActive ? 'text-fg' : 'text-muted'} />
            <span className="text-[10px] tracking-normal leading-none">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
