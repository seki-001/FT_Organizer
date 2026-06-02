'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import AdminAuthShell from '@/components/auth/AdminAuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { ADMIN_LOGIN_PATH } from '@/lib/admin-auth-ui'
import { cn } from '@/lib/utils'

const ForgotSchema = z.object({
  email: z.string().email('Enter a valid work email'),
})

type ForgotForm = z.infer<typeof ForgotSchema>

export default function AdminForgotPasswordClient() {
  const [submitted, setSubmitted] = useState(false)
  const [emailSent, setEmailSent] = useState('')
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(ForgotSchema) })

  async function onSubmit(data: ForgotForm) {
    setSubmitError('')
    try {
      await simulateAuthRequest()
      setEmailSent(data.email)
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <AdminAuthShell
        title="Check your inbox"
        subtitle="Password reset for staff accounts will be sent when admin auth is live."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-xs text-dark/50">
            <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
              Back to admin sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 py-1 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail size={24} aria-hidden="true" />
          </div>
          <AuthAlert variant="success" title="Preview only — no email sent">
            If <strong className="font-medium">{emailSent}</strong> is registered for staff access,
            reset instructions will be sent when this feature is enabled.
          </AuthAlert>
        </div>
      </AdminAuthShell>
    )
  }

  return (
    <AdminAuthShell
      title="Forgot password"
      subtitle="Enter your work email for reset instructions."
      footer={
        <p className="text-center text-xs text-dark/50">
          <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
            Back to admin sign in
          </Link>
        </p>
      }
    >
      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Work email" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@organizer.co.ke"
            className={cn('input-base bg-surface', errors.email && 'input-error')}
            {...register('email')}
          />
        </FormField>

        <Button type="submit" variant="premium" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending…
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </AdminAuthShell>
  )
}
