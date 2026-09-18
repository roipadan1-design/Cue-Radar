'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/auth'
import { createClient } from '@/lib/supabase/client'

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox.'
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  return message
}

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next') || '/profile/edit?welcome=1'
  const showApple = process.env.NEXT_PUBLIC_AUTH_APPLE === 'true'

  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  const handleOAuthSignUp = async (provider: 'google' | 'apple') => {
    setFormError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
      },
    })
    if (error) {
      setFormError(mapAuthError(error.message))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const result = signUpSchema.safeParse(formData)
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

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
      },
    })

    setLoading(false)

    if (error) {
      setFormError(mapAuthError(error.message))
    } else if (data.session) {
      router.push(nextParam)
      router.refresh()
    } else {
      setSuccessMessage('Account created! Please check your email to confirm your account.')
    }
  }

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-6">
      <h1 className="t-title text-fg text-center">Create an account</h1>

      {formError && (
        <div className="p-3 bg-surface border border-urgent rounded-[var(--radius)] t-body text-urgent text-sm">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg text-sm">
          {successMessage}
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          onClick={() => handleOAuthSignUp('google')}
          disabled={loading}
          className="w-full"
        >
          Continue with Google
        </Button>
        {showApple && (
          <Button
            variant="secondary"
            onClick={() => handleOAuthSignUp('apple')}
            disabled={loading}
            className="w-full"
          >
            Continue with Apple
          </Button>
        )}
      </div>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <span className="relative px-3 bg-bg t-meta text-muted">OR</span>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name" error={errors.full_name}>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            onBlur={() => handleBlur('full_name')}
            className="input-shell"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className="input-shell"
          />
        </Field>

        <Field label="Password" error={errors.password} helpText="At least 8 characters">
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className="input-shell"
          />
        </Field>

        <Button variant="primary" type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="flex items-center justify-center gap-2 t-body text-muted text-sm pt-4 border-t border-line">
        <span>Already have an account?</span>
        <Link href="/signin" className="text-fg underline hover:opacity-80 font-medium">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-12 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <Suspense fallback={<div className="t-body text-muted">Loading...</div>}>
        <SignUpContent />
      </Suspense>
    </div>
  )
}
