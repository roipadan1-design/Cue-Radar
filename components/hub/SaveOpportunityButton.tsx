'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface SaveOpportunityButtonProps {
  oppId: string
  slug: string
  initialSaved?: boolean
  userId?: string
  className?: string
}

export default function SaveOpportunityButton({
  oppId,
  slug,
  initialSaved = false,
  userId,
  className = '',
}: SaveOpportunityButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggleSave = async () => {
    if (!userId) {
      router.push(`/signin?next=/opportunities/${slug}`)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const nextSaved = !isSaved
    setIsSaved(nextSaved)

    if (nextSaved) {
      const { error } = await supabase
        .from('user_saved_opportunities')
        .upsert(
          { user_id: userId, opp_id: oppId, pipeline_status: 'saved' },
          { onConflict: 'user_id,opp_id' }
        )
      if (error) {
        setIsSaved(false)
      }
    } else {
      const { error } = await supabase
        .from('user_saved_opportunities')
        .delete()
        .eq('user_id', userId)
        .eq('opp_id', oppId)
      if (error) {
        setIsSaved(true)
      }
    }
    setLoading(false)
    router.refresh()
  }

  // Saved state uses an accent outline (never a fill) so it never collides
  // with a primary `bg-accent` action rendered alongside it (e.g. "Apply" on
  // the mobile sticky bar) — see docs/DECISIONS.md "Task 07 — accent rule,
  // final," fix 2. Built directly (not via <Button variant="secondary">
  // plus an override className) because two same-specificity utility
  // classes (`border-line-strong` vs `border-accent`) would otherwise race
  // on Tailwind's own generated stylesheet order rather than className order.
  if (isSaved) {
    return (
      <button
        type="button"
        onClick={handleToggleSave}
        disabled={loading}
        className={`inline-flex items-center justify-center font-semibold rounded-[var(--radius)] transition-colors focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border border-accent text-accent bg-transparent h-10 px-4 t-body ${className}`}
      >
        Saved
      </button>
    )
  }

  return (
    <Button variant="secondary" onClick={handleToggleSave} disabled={loading} className={className}>
      Save
    </Button>
  )
}
