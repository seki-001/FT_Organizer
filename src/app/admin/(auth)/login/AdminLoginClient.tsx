'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import AdminAuthShell from '@/components/auth/AdminAuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import PasswordField from '@/components/auth/PasswordField'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { ADMIN_FORGOT_PASSWORD_PATH, ADMIN_INVITE_PATH } from '@/lib/admin-auth-ui'
import { cn } from '@/lib/utils'

const AdminLoginSchema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type AdminLoginForm = z.infer<typeof AdminLoginSchema>

export default function AdminLoginClient() {
  const params = useSearchParams()
  const reset = params.get('reset') === '1'
  const invited = params.get('invited') === '1'

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { remember: false },
  })

  async function onSubmit(_data: AdminLoginForm) {
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
      <AdminAuthShell
        title="Request received"
        subtitle="Admin sign-in is not connected to a live session yet."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-xs text-dark/50">
            In development, the dashboard may still load via mock auth.{' '}
            <Link href="/admin" className="text-primary font-medium hover:underline">
              Open dashboard
            </Link>
          </p>
        }
      >
        <AuthAlert variant="success" title="Not signed in">
          No admin session was created. When credentials auth is enabled, you will return here to
          access bookings, orders, and store management.
        </AuthAlert>
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full min-h-[44px] rounded-button border border-dark/15 text-sm font-medium text-dark/70 hover:bg-muted transition-colors"
        >
          Return to website
        </Link>
      </AdminAuthShell>
    )
  }

  return (
    <AdminAuthShell
      title="Admin sign in"
      subtitle="Secure access for Faith The Organizer staff."
      footer={
        <div className="flex flex-col gap-2 text-center text-xs text-dark/50">
          <p>
            Received a staff invite?{' '}
            <Link href={ADMIN_INVITE_PATH} className="text-primary font-medium hover:underline">
              Create your account
            </Link>
          </p>
          <p className="text-dark/35">No public registration. Accounts are invitation-only.</p>
        </div>
      }
    >
      {reset ? (
        <AuthAlert variant="success" title="Password updated">
          Your new password will apply when admin auth goes live.
        </AuthAlert>
      ) : null}
      {invited ? (
        <AuthAlert variant="success" title="Account ready">
          Staff account setup complete. Sign in when admin auth is enabled.
        </AuthAlert>
      ) : null}

      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Work email" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@organizer.co.ke"
            className={cn('input-base bg-surface', errors.email && 'input-error')}
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
            <Link
              href={ADMIN_FORGOT_PASSWORD_PATH}
              className="text-xs text-primary hover:underline font-medium"
            >
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
          <span className="text-sm text-dark/60">Remember this device</span>
        </label>

        <Button type="submit" variant="premium" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in to admin'
          )}
        </Button>
      </form>
    </AdminAuthShell>
  )
}
