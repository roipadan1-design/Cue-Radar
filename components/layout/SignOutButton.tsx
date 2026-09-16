'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/hub')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center justify-center h-8 px-3 text-muted hover:text-fg border border-line-strong rounded-[var(--radius)] t-body font-medium hover:border-fg transition-colors cursor-pointer"
    >
      Sign out
    </button>
  )
}
