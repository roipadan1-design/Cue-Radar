'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface FollowButtonProps {
  viewerId: string
  profileId: string
  fullName?: string | null
  initialFollowing?: boolean
}

export default function FollowButton({
  viewerId,
  profileId,
  fullName,
  initialFollowing = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const name = fullName || 'this artist'

  const handleToggleFollow = async () => {
    setLoading(true)
    const supabase = createClient()
    const nextFollowing = !isFollowing
    setIsFollowing(nextFollowing)

    if (nextFollowing) {
      const { error } = await supabase
        .from('follows')
        .upsert(
          { follower_id: viewerId, followee_id: profileId },
          { onConflict: 'follower_id,followee_id' },
        )
      if (error) {
        setIsFollowing(false)
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', viewerId)
        .eq('followee_id', profileId)
      if (error) {
        setIsFollowing(true)
      }
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleToggleFollow}
      disabled={loading}
      aria-label={isFollowing ? `Unfollow ${name}` : `Follow ${name}`}
      className={`min-h-[44px] inline-flex items-center px-2 -mx-2 border rounded-[var(--radius)] t-meta transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'border-accent text-accent'
          : 'border-transparent text-muted hover:text-fg'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
