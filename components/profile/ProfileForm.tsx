'use client'

import { useState } from 'react'
import Link from 'next/link'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { profileSchema, type ProfileFormData } from '@/lib/schemas/profile'

export default function ProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>({
    handle: '',
    full_name: '',
    role_label: '',
    bio: '',
    locations: '',
    current_city: '',
    current_city_until: '',
    open_for_collab: false,
    available_from: '',
    showreel_url: '',
    instagram: '',
    website: '',
    is_public: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange<K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = profileSchema.safeParse(formData)
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(formattedErrors)
    } else {
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          <Button type="submit" variant="primary" disabled>
            Save
          </Button>
          <span className="t-meta text-muted">Saving is enabled once you sign in.</span>
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
