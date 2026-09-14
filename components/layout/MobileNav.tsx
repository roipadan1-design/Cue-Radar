'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
  const pathname = usePathname()

  const items = [
    { label: 'Hub', href: '/hub' },
    { label: 'Pipeline', href: '/saved' },
    { label: 'Profile', href: '/profile/edit' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[56px] bg-surface border-t border-line px-4 flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href === '/hub' && pathname === '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`t-meta ${isActive ? 'text-fg' : 'text-muted'} hover:text-fg transition-colors`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
