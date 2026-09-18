import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile/ProfileForm'
import type { Profile, VocabEntry } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ welcome?: string }>
}

export default async function ProfileEditPage({ searchParams }: PageProps) {
  const { welcome } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin?next=/profile/edit')
  }

  const [{ data: profile }, { data: vocabData }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    // Rule 4: dynamic, no hardcoding — discipline options come from the database
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
  ])

  const vocab = (vocabData || []) as VocabEntry[]
  const disciplineOptions = vocab.filter((v) => v.category === 'discipline' && !v.deprecated)

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6 pb-[120px] md:pb-[80px]">
      {welcome === '1' && (
        <div className="mb-6 p-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg text-sm">
          Add your disciplines so we can show what you&apos;re eligible for.
        </div>
      )}
      <h1 className="t-title text-fg mb-6">Profile</h1>
      <ProfileForm
        initialProfile={(profile as Profile) || null}
        userId={user.id}
        disciplineOptions={disciplineOptions}
      />
    </div>
  )
}
