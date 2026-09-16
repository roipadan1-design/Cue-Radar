import { notFound } from 'next/navigation'
import PublicProfileView from '@/components/profile/PublicProfileView'
import { getDemoProfile } from '@/lib/seed'

export default function ProfilePreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const profile = getDemoProfile()

  return (
    <div className="w-full">
      <PublicProfileView profile={profile} isOwner={true} />
    </div>
  )
}
