'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import PasswordField from '@/components/auth/PasswordField'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import AuthDivider from '@/components/auth/AuthDivider'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { cn } from '@/lib/utils'

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})
type LoginForm = z.infer<typeof LoginSchema>

export default function LoginClient() {
  const params = useSearchParams()
  const verified = params.get('verified') === '1'
  const reset = params.get('reset') === '1'

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { remember: false },
  })

  async function onSubmit(_data: LoginForm) {
    setSubmitError('')
    try {
      await simulateAuthRequest()
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <AuthShell
        title="Request received"
        subtitle="We’ll enable sign-in for customer accounts soon."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-sm text-dark/50">
            Need help now?{' '}
            <Link href="/book" className="text-primary font-medium hover:underline">
              Book a site visit
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              contact us
            </Link>
            .
          </p>
        }
      >
        <AuthAlert variant="success" title="Not signed in yet">
          Customer sign-in is not live. Your details were not used to log in. When accounts launch,
          use the same email to access bookings and orders.
        </AuthAlert>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/book"
            className="inline-flex items-center justify-center w-full min-h-[48px] px-8 py-4 text-base font-medium rounded-button bg-primary text-white hover:bg-danger transition-colors"
          >
            Book a site visit
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full min-h-[48px] px-8 py-4 text-base font-medium rounded-button border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Return home
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to view bookings, orders, and your organizing profile."
      footer={
        <p className="text-center text-sm text-dark/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create account
          </Link>
        </p>
      }
    >
      {verified ? (
        <AuthAlert variant="success" title="Email verified">
          Your email is verified. Sign in will be available when customer accounts launch.
        </AuthAlert>
      ) : null}
      {reset ? (
        <AuthAlert variant="success" title="Password updated">
          Your new password is saved for when accounts go live. Sign in below (preview only).
        </AuthAlert>
      ) : null}

      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Email address" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn('input-base', errors.email && 'input-error')}
            {...register('email')}
          />
        </FormField>

        <PasswordField
          id="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          registerProps={register('password')}
          labelExtra={
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </Link>
          }
        />

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary rounded border-dark/20"
            {...register('remember')}
          />
          <span className="text-sm text-dark/60">Remember me on this device</span>
        </label>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-1">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <AuthDivider />
      <GoogleSignInButton />
    </AuthShell>
  )
}
