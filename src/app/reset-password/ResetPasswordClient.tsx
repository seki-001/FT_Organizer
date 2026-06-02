'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, KeyRound } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import PasswordField from '@/components/auth/PasswordField'
import PasswordStrength from '@/components/auth/PasswordStrength'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'

const ResetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetForm = z.infer<typeof ResetSchema>

export default function ResetPasswordClient() {
  const params = useSearchParams()
  const token = params.get('token')
  const [passwordValue, setPasswordValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ resolver: zodResolver(ResetSchema) })

  const passwordReg = register('password')
  const displayPassword = passwordValue || watch('password', '')

  async function onSubmit(_data: ResetForm) {
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
        title="Password saved"
        subtitle="Your new password will apply when customer accounts launch."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-sm text-dark/50">
            <Link
              href="/login?reset=1"
              className="text-primary font-medium hover:underline"
            >
              Continue to sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center text-success">
            <KeyRound size={28} aria-hidden="true" />
          </div>
          <AuthAlert variant="success" title="Preview only">
            No password was changed on a live account. This flow is ready for your auth provider.
          </AuthAlert>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password for your account."
      footer={
        <p className="text-center text-sm text-dark/50">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {token ? (
        <p className="text-xs text-dark/40 text-center font-mono truncate" title={token}>
          Reset token (preview): {token.slice(0, 12)}…
        </p>
      ) : (
        <AuthAlert variant="info">
          Open this page from your reset email link. Without a token, you can still preview the form.
        </AuthAlert>
      )}

      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <PasswordField
            id="password"
            label="New password"
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
          label="Confirm new password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registerProps={register('confirmPassword')}
        />

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Updating…
            </>
          ) : (
            'Update password'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
