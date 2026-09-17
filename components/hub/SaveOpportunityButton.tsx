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

  return (
    <Button
      variant="secondary"
      onClick={handleToggleSave}
      disabled={loading}
      className={isSaved ? `border-accent text-accent ${className}` : className}
    >
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  )
}
