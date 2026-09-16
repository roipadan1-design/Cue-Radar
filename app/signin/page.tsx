'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import { signInSchema, type SignInFormData } from '@/lib/schemas/auth'
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

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next') || '/hub'
  const showApple = process.env.NEXT_PUBLIC_AUTH_APPLE === 'true'

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleBlur = (field: keyof SignInFormData) => {
    const result = signInSchema.shape[field].safeParse(formData[field])
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

  const handleChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
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

    const result = signInSchema.safeParse(formData)
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
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    setLoading(false)

    if (error) {
      setFormError(mapAuthError(error.message))
    } else {
      router.push(nextParam)
      router.refresh()
    }
  }

  const handleMagicLink = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required for magic link' }))
      return
    }
    setFormError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
      },
    })
    setLoading(false)
    if (error) {
      setFormError(mapAuthError(error.message))
    } else {
      setMagicLinkSent(true)
    }
  }

  return (
    <div className="w-full max-w-[400px] flex flex-col gap-6">
      <h1 className="t-title text-fg text-center">Sign in</h1>

      {formError && (
        <div className="p-3 bg-surface border border-urgent rounded-[var(--radius)] t-body text-urgent text-sm">
          {formError}
        </div>
      )}

      {magicLinkSent && (
        <div className="p-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg text-sm">
          Check your email for the magic link!
        </div>
      )}

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
          className="w-full"
        >
          Continue with Google
        </Button>
        {showApple && (
          <Button
            variant="secondary"
            onClick={() => handleOAuthSignIn('apple')}
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

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className="w-full h-11 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-fg focus:outline-none focus:border-fg"
          />
        </Field>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="text-xs"
          >
            Send magic link
          </Button>
        </div>

        <Button variant="primary" type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="flex items-center justify-center gap-2 t-body text-muted text-sm pt-4 border-t border-line">
        <span>New here?</span>
        <Link href="/signup" className="text-fg underline hover:opacity-80 font-medium">
          Create an account
        </Link>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <Suspense fallback={<div className="t-body text-muted">Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  )
}
