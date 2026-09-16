import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile/ProfileForm'
import type { Profile } from '@/lib/types'

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin?next=/profile/edit')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6 pb-[120px] md:pb-[80px]">
      <h1 className="t-title text-fg mb-6">Profile</h1>
      <ProfileForm initialProfile={(profile as Profile) || null} userId={user.id} />
    </div>
  )
}
