'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { profileSchema, type ProfileFormData } from '@/lib/schemas/profile'
import { createClient } from '@/lib/supabase/client'
import type { Profile, VocabEntry } from '@/lib/types'

interface ProfileFormProps {
  initialProfile?: Profile | null
  userId?: string
  // Rule 4: dynamic, no hardcoding — discipline options come from the `vocab` table,
  // fetched server-side by the page and passed down (same pattern as FilterBar).
  disciplineOptions?: VocabEntry[]
}

export default function ProfileForm({ initialProfile, userId, disciplineOptions = [] }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    handle: initialProfile?.handle || '',
    full_name: initialProfile?.full_name || '',
    role_label: initialProfile?.role_label || '',
    disciplines: initialProfile?.disciplines || [],
    bio: initialProfile?.bio || '',
    locations: initialProfile?.locations ? initialProfile.locations.join(', ') : '',
    current_city: initialProfile?.current_city || '',
    current_city_until: initialProfile?.current_city_until || '',
    open_for_collab: initialProfile?.open_for_collab || false,
    available_from: initialProfile?.available_from || '',
    showreel_url: initialProfile?.showreel_url || '',
    instagram: initialProfile?.social_links?.instagram || '',
    website: initialProfile?.social_links?.website || '',
    is_public: initialProfile?.is_public || false,
  })

  const [avatarUrl, setAvatarUrl] = useState<string>(initialProfile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [activeUserId, setActiveUserId] = useState<string | undefined>(userId)

  useEffect(() => {
    if (!activeUserId) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setActiveUserId(user.id)
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                const p = data as Profile
                setFormData({
                  handle: p.handle || '',
                  full_name: p.full_name || '',
                  role_label: p.role_label || '',
                  disciplines: p.disciplines || [],
                  bio: p.bio || '',
                  locations: p.locations ? p.locations.join(', ') : '',
                  current_city: p.current_city || '',
                  current_city_until: p.current_city_until || '',
                  open_for_collab: p.open_for_collab || false,
                  available_from: p.available_from || '',
                  showreel_url: p.showreel_url || '',
                  instagram: p.social_links?.instagram || '',
                  website: p.social_links?.website || '',
                  is_public: p.is_public || false,
                })
                setAvatarUrl(p.avatar_url || '')
              }
            })
        }
      })
    }
  }, [activeUserId])

  function handleChange<K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleDiscipline(value: string) {
    setFormData((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(value)
        ? prev.disciplines.filter((d) => d !== value)
        : [...prev.disciplines, value],
    }))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !activeUserId) return

    setUploading(true)
    setFormError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const filePath = `${activeUserId}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error uploading avatar'
      setFormError(message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaveSuccess(false)

    const result = profileSchema.safeParse(formData)
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(formattedErrors)
      return
    }

    if (!activeUserId) {
      setFormError('You must be signed in to save profile updates.')
      return
    }

    setSaving(true)
    const supabase = createClient()

    const locationsArray = formData.locations
      ? formData.locations.split(',').map((l) => l.trim()).filter(Boolean)
      : []

    const socialLinks = {
      instagram: formData.instagram || '',
      website: formData.website || '',
      spotify: initialProfile?.social_links?.spotify || '',
      vimeo: initialProfile?.social_links?.vimeo || '',
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        handle: formData.handle,
        full_name: formData.full_name,
        role_label: formData.role_label || '',
        disciplines: formData.disciplines,
        bio: formData.bio || '',
        avatar_url: avatarUrl,
        locations: locationsArray,
        current_city: formData.current_city || null,
        current_city_until: formData.current_city_until || null,
        open_for_collab: formData.open_for_collab,
        available_from: formData.available_from || null,
        showreel_url: formData.showreel_url || '',
        social_links: socialLinks,
        is_public: formData.is_public,
      })
      .eq('id', activeUserId)

    setSaving(false)

    if (error) {
      setFormError(error.message)
    } else {
      setErrors({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {formError && (
        <div className="p-3 bg-surface border border-urgent rounded-[var(--radius)] t-body text-urgent text-sm">
          {formError}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg text-sm">
          Profile saved successfully!
        </div>
      )}

      {/* Avatar upload section */}
      <div className="flex items-center gap-4 py-2 border-b border-line">
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-[var(--radius)] object-cover bg-surface border border-line"
          />
        ) : (
          <div className="w-16 h-16 rounded-[var(--radius)] bg-surface border border-line flex items-center justify-center t-meta text-muted">
            NO IMAGE
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="t-meta text-fg cursor-pointer hover:underline">
            {uploading ? 'Uploading...' : 'Upload avatar'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading || !activeUserId}
              className="hidden"
            />
          </label>
          <span className="t-meta text-muted">JPG or PNG (max 2MB)</span>
        </div>
      </div>

      <Field label="Handle" error={errors.handle}>
        <input
          type="text"
          value={formData.handle}
          onChange={(e) => handleChange('handle', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Full name" error={errors.full_name}>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Role label" error={errors.role_label}>
        <input
          type="text"
          value={formData.role_label}
          onChange={(e) => handleChange('role_label', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Disciplines" error={errors.disciplines}>
        <div className="flex flex-wrap gap-2">
          {disciplineOptions.map((d) => (
            <Chip
              key={d.value}
              active={formData.disciplines.includes(d.value)}
              onClick={() => toggleDiscipline(d.value)}
            >
              {d.label}
            </Chip>
          ))}
          {disciplineOptions.length === 0 && (
            <span className="t-meta text-muted normal-case">No disciplines available.</span>
          )}
        </div>
      </Field>

      <Field label="Bio" error={errors.bio}>
        <textarea
          rows={4}
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="w-full p-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg resize-none"
        />
      </Field>

      <Field label="Locations (comma-separated)" error={errors.locations}>
        <input
          type="text"
          value={formData.locations}
          onChange={(e) => handleChange('locations', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Current city" error={errors.current_city}>
        <input
          type="text"
          value={formData.current_city}
          onChange={(e) => handleChange('current_city', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Current city until" error={errors.current_city_until}>
        <input
          type="date"
          value={formData.current_city_until}
          onChange={(e) => handleChange('current_city_until', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <div className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          id="open_for_collab"
          checked={formData.open_for_collab}
          onChange={(e) => handleChange('open_for_collab', e.target.checked)}
          className="w-4 h-4 rounded-[var(--radius)] bg-surface border-line accent-fg"
        />
        <label htmlFor="open_for_collab" className="t-body text-fg cursor-pointer">
          Open for collaboration
        </label>
      </div>

      <Field label="Available from" error={errors.available_from}>
        <input
          type="date"
          value={formData.available_from}
          onChange={(e) => handleChange('available_from', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Showreel URL" error={errors.showreel_url}>
        <input
          type="url"
          value={formData.showreel_url}
          onChange={(e) => handleChange('showreel_url', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Instagram" error={errors.instagram}>
        <input
          type="text"
          value={formData.instagram}
          onChange={(e) => handleChange('instagram', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <Field label="Website" error={errors.website}>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
        />
      </Field>

      <div className="flex flex-col gap-1 py-1">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => handleChange('is_public', e.target.checked)}
            className="w-4 h-4 rounded-[var(--radius)] bg-surface border-line accent-fg"
          />
          <label htmlFor="is_public" className="t-body text-fg cursor-pointer">
            Public profile
          </label>
        </div>
        <p className="t-meta text-muted normal-case ml-7">
          Anyone with the link can see this profile.
        </p>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-30 bg-surface border-t border-line p-4 flex items-center justify-between max-w-[720px] mx-auto">
        <div className="flex flex-col gap-1">
          <Button type="submit" variant="primary" disabled={saving || !activeUserId}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {!activeUserId && (
            <span className="t-meta text-muted">Saving is enabled once you sign in.</span>
          )}
        </div>

        <Link href={formData.handle ? `/a/${formData.handle}` : '/profile/edit'}>
          <Button type="button" variant="ghost">
            View profile
          </Button>
        </Link>
      </div>
    </form>
  )
}
