'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

const ForgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type ForgotForm = z.infer<typeof ForgotSchema>

const inputClass =
  'w-full border border-dark/15 rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(ForgotSchema) })

  async function onSubmit(data: ForgotForm) {
    setApiError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      if (!res.ok) {
        const json = await res.json() as { error?: string }
        setApiError(json.error ?? 'Could not send reset email. Please try again.')
        return
      }
      setSent(true)
    } catch {
      setApiError('Network error. Check your connection and try again.')
    }
  }

  return (
    <main className="min-h-screen glass-grid-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <p className="text-primary font-bold text-sm tracking-wide">{COMPANY.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark">Forgot Password</h1>
          <p className="text-dark/50 text-sm">
            {sent
              ? 'Check your email for a reset link.'
              : 'Enter your email and we will send you a reset link.'}
          </p>
        </div>

        {apiError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {sent ? (
          <div className="bg-success/10 border border-success/20 text-dark text-sm px-4 py-4 rounded-lg flex flex-col gap-2">
            <p className="font-medium">Email sent</p>
            <p className="text-dark/60">
              If an account exists for that address, you will receive a password reset link shortly.
              Check your spam folder if you do not see it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors min-h-[48px]"
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                : <><Mail size={16} /> Send Reset Link</>
              }
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-primary font-medium hover:underline"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </main>
  )
}
