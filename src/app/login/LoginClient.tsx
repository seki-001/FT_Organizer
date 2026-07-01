'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { COMPANY } from '@/lib/constants'
import { humanizeAuthError, toAuthErrorMessage } from '@/lib/auth-errors'
import BrandLogo from '@/components/brand/BrandLogo'

const LoginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type LoginForm = z.infer<typeof LoginSchema>

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

const inputClass = 'w-full border border-dark/15 rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

export default function LoginClient() {
  const { signIn, signInWithGoogle } = useAuth()
  const router     = useRouter()
  const params     = useSearchParams()
  const callback   = params.get('callbackUrl') ?? '/account'

  const [showPw,        setShowPw]        = useState(false)
  const [apiError,      setApiError]      = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) })

  async function onSubmit(data: LoginForm) {
    setApiError('')
    const result = await signIn(data.email, data.password)
    if (result.ok) {
      router.push(callback)
    } else {
      setApiError(toAuthErrorMessage(result.error, 'Invalid email or password.'))
    }
  }

  return (
    <main className="min-h-screen glass-grid-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card p-8 flex flex-col gap-6">

        <div className="text-center flex flex-col items-center gap-3">
          <BrandLogo variant="on-light" size="lg" href="/" className="mx-auto object-center max-w-[180px]" />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-3xl font-bold text-dark">Welcome Back</h1>
            <p className="text-dark/50 text-sm">Sign in to your {COMPANY.name} account</p>
          </div>
        </div>

        {apiError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-dark" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                {...register('password')}
                placeholder="Your password"
                className={inputClass + ' pr-10'}
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors min-h-[48px] mt-1"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 text-dark/25">
          <div className="flex-1 h-px bg-dark/10" />
          <span className="text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-dark/10" />
        </div>

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

        <p className="text-center text-sm text-dark/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
