import ProfileForm from '@/components/profile/ProfileForm'

export default function ProfileEditPage() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6 pb-[120px] md:pb-[80px]">
      <h1 className="t-title text-fg mb-6">Profile</h1>
      <ProfileForm />
    </div>
  )
}
