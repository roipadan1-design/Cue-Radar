import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicProfileView from '@/components/profile/PublicProfileView'
import type { Profile } from '@/lib/types'

interface PageProps {
  params: Promise<{ handle: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const resolvedParams = await params
  const handle = resolvedParams.handle

  const supabase = await createClient()

  // Fetch profile by handle
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .maybeSingle()

  if (!profile) {
    notFound()
  }

  // Get current session user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === profile.id

  // Enforce visibility: must be public or owned by user
  if (!profile.is_public && !isOwner) {
    notFound()
  }

  return <PublicProfileView profile={profile as Profile} isOwner={isOwner} />
}
