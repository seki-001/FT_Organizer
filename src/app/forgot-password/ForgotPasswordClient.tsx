'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { cn } from '@/lib/utils'

const ForgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type ForgotForm = z.infer<typeof ForgotSchema>

export default function ForgotPasswordClient() {
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
      <AuthShell
        title="Check your inbox"
        subtitle="Password reset will be available when customer accounts launch."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-sm text-dark/50">
            <Link href="/login" className="text-primary font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail size={28} aria-hidden="true" />
          </div>
          <AuthAlert variant="success" title="Preview only — no email sent">
            If an account exists for <strong className="font-medium">{emailSent}</strong>, reset
            instructions will be sent when this feature is live. For urgent help,{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </AuthAlert>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we’ll send reset instructions when password recovery is live."
      footer={
        <p className="text-center text-sm text-dark/50">
          Remember your password?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
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

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
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
    </AuthShell>
  )
}
