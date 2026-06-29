'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { COMPANY } from '@/lib/constants'

// ─── Schema ───────────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name:            z.string().min(2, 'Full name is required'),
  email:           z.string().email('Enter a valid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms:           z.literal(true, { errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})
type RegisterForm = z.infer<typeof RegisterSchema>

// ─── Google icon ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

const inputClass = 'w-full border border-dark/15 rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const router     = useRouter()

  const [showPw,        setShowPw]        = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [apiError,      setApiError]      = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) })

  async function onSubmit(data: RegisterForm) {
    setApiError('')
    const result = await signUp(data.email, data.password, data.name)
    if (result.ok) {
      if (result.needsEmailConfirmation) {
        router.push('/verify-email')
      } else {
        router.push('/account')
      }
    } else {
      setApiError(result.error ?? 'Could not create account. Please try again.')
    }
  }

  return (
    <main className="min-h-screen glass-grid-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card p-8 flex flex-col gap-6">

        {/* Brand */}
        <div className="text-center flex flex-col gap-1">
          <p className="text-primary font-bold text-sm tracking-wide">{COMPANY.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark">Create an Account</h1>
          <p className="text-dark/50 text-sm">Join us and start organizing</p>
        </div>

        {/* API error */}
        {apiError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Your full name"
              className={inputClass}
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark" htmlFor="password">Password</label>
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

          {/* Confirm Password */}
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

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 pt-1">
            <input
              id="terms"
              type="checkbox"
              {...register('terms')}
              className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"
            />
            <label htmlFor="terms" className="text-sm text-dark/60 leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link href="/terms-and-conditions" className="text-primary hover:underline">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-danger -mt-2">{errors.terms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors min-h-[48px] mt-1"
          >
            {isSubmitting
              ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              : <><CheckCircle2 size={16} /> Create Account</>
            }
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 text-dark/25">
          <div className="flex-1 h-px bg-dark/10" />
          <span className="text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-dark/10" />
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={async () => {
            setApiError('')
            setGoogleLoading(true)
            const result = await signInWithGoogle()
            if (!result.ok) {
              setApiError(result.error ?? 'Google sign-in failed.')
              setGoogleLoading(false)
            }
          }}
          className="flex items-center justify-center gap-3 w-full border border-dark/15 hover:border-dark/30 text-dark font-medium py-3 rounded-lg transition-colors text-sm min-h-[48px] disabled:opacity-60"
        >
          {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-dark/50">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
