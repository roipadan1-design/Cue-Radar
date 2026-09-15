'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/auth'

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleBlur = (field: keyof SignUpFormData) => {
    const result = signUpSchema.shape[field].safeParse(formData[field])
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0]?.message || 'Invalid input',
      }))
    } else {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        <h1 className="t-title text-fg text-center">Create an account</h1>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <Button variant="secondary" disabled className="w-full">
            Continue with Google
          </Button>
          <Button variant="secondary" disabled className="w-full">
            Continue with Apple
          </Button>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <span className="relative px-3 bg-bg t-meta text-muted">OR</span>
        </div>

        {/* Form Fields */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <Field label="Full name" error={errors.full_name}>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              onBlur={() => handleBlur('full_name')}
              className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
            />
          </Field>

          <Field label="Password" error={errors.password} helpText="At least 8 characters">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
            />
          </Field>

          <Button variant="primary" disabled type="submit" className="w-full mt-2">
            Create account
          </Button>

          <p className="t-meta text-muted text-center mt-2">
            Sign-in is enabled in a later release.
          </p>
        </form>

        {/* Footer Link */}
        <div className="flex items-center justify-center gap-2 t-body text-muted text-sm pt-4 border-t border-line">
          <span>Already have an account?</span>
          <Link href="/signin" className="text-fg underline hover:opacity-80 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
