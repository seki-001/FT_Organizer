'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import PasswordField from '@/components/auth/PasswordField'
import PasswordStrength from '@/components/auth/PasswordStrength'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import AuthDivider from '@/components/auth/AuthDivider'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { cn } from '@/lib/utils'

const RegisterSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof RegisterSchema>

export default function RegisterClient() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) })

  const passwordReg = register('password')
  const displayPassword = passwordValue || watch('password', '')

  async function onSubmit(_data: RegisterForm) {
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
        title="Check your email"
        subtitle="We’ll send verification instructions when customer accounts launch."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-sm text-dark/50">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center text-success">
            <Mail size={28} aria-hidden="true" />
          </div>
          <AuthAlert variant="success" title="Registration preview complete">
            No account was created. When sign-up goes live, you&apos;ll verify your email before
            accessing your dashboard.
          </AuthAlert>
          <Link
            href="/verify-email?status=pending"
            className="text-sm text-primary font-medium hover:underline"
          >
            View verification status page →
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Faith The Organizer to track bookings, orders, and your organizing journey."
      footer={
        <p className="text-center text-sm text-dark/50">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={cn('input-base', errors.name && 'input-error')}
            {...register('name')}
          />
        </FormField>

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

        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            registerProps={{
              name: passwordReg.name,
              ref: passwordReg.ref,
              onBlur: passwordReg.onBlur,
              onChange: (e) => {
                void passwordReg.onChange(e)
                setPasswordValue(e.target.value)
              },
            }}
          />
          <PasswordStrength password={displayPassword} />
        </div>

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registerProps={register('confirmPassword')}
        />

        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 w-4 h-4 accent-primary cursor-pointer shrink-0"
            {...register('terms')}
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
        {errors.terms ? (
          <p className="text-xs text-danger -mt-2" role="alert">
            {errors.terms.message}
          </p>
        ) : null}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full mt-1">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <AuthDivider />
      <GoogleSignInButton />
    </AuthShell>
  )
}
