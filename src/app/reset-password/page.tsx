'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { COMPANY } from '@/lib/constants'
import { humanizeAuthError } from '@/lib/auth-errors'

const ResetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type ResetForm = z.infer<typeof ResetSchema>

const inputClass =
  'w-full border border-dark/15 rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ resolver: zodResolver(ResetSchema) })

  async function onSubmit(data: ResetForm) {
    setApiError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.password })

    if (error) {
      setApiError(humanizeAuthError(error.message))
      return
    }

    router.push('/account')
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card-light p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <p className="text-primary font-bold text-sm tracking-wide">{COMPANY.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark">New Password</h1>
          <p className="text-dark/50 text-sm">Choose a new password for your account.</p>
        </div>

        {apiError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark" htmlFor="password">New Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                {...register('password')}
                placeholder="Minimum 8 characters"
                className={inputClass + ' pr-10'}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPw ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Repeat your password"
                className={inputClass + ' pr-10'}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark"
                aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-danger">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors min-h-[48px]"
          >
            {isSubmitting
              ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : <><Lock size={16} /> Update Password</>
            }
          </button>
        </form>

        <p className="text-center text-sm text-dark/50">
          Link expired?{' '}
          <Link href="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new one
          </Link>
        </p>
      </div>
    </main>
  )
}
