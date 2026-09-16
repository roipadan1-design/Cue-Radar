import PublicProfileView from '@/components/profile/PublicProfileView'
import { getDemoProfile } from '@/lib/seed'

export default function ProfilePreviewPage() {
  // Temporarily visible everywhere (including production) while the owner is
  // actively reviewing the profile-page visual design — not linked from any
  // real navigation. Re-gate with `if (process.env.VERCEL_ENV === 'production') notFound()`
  // before the pilot opens to real users; see docs/DECISIONS.md.

  const profile = getDemoProfile()

  return (
    <div className="w-full">
      <PublicProfileView profile={profile} isOwner={true} />
    </div>
  )
}
