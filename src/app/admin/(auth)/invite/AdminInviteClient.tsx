'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, UserPlus, Send } from 'lucide-react'
import AdminAuthShell from '@/components/auth/AdminAuthShell'
import AuthAlert from '@/components/auth/AuthAlert'
import PasswordField from '@/components/auth/PasswordField'
import PasswordStrength from '@/components/auth/PasswordStrength'
import FormField from '@/components/ui/FormField'
import Button from '@/components/ui/Button'
import { simulateAuthRequest } from '@/lib/auth-ui'
import { ADMIN_LOGIN_PATH, STAFF_INVITE_NOTICE } from '@/lib/admin-auth-ui'
import { cn } from '@/lib/utils'

const AcceptInviteSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    password: z.string().min(10, 'Use at least 10 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const SendInviteSchema = z.object({
  name: z.string().min(2, 'Staff name is required'),
  email: z.string().email('Enter a valid work email'),
  role: z.enum(['staff', 'admin'], { required_error: 'Select a role' }),
})

type AcceptInviteForm = z.infer<typeof AcceptInviteSchema>
type SendInviteForm = z.infer<typeof SendInviteSchema>

function AcceptInviteForm({ token, invitedEmail }: { token: string; invitedEmail: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteForm>({ resolver: zodResolver(AcceptInviteSchema) })

  const passwordReg = register('password')
  const displayPassword = passwordValue || watch('password', '')

  async function onSubmit(_data: AcceptInviteForm) {
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
        title="Account created"
        subtitle="Your staff profile will activate when admin auth is live."
        showLaunchNotice={false}
        noticeTitle=""
        noticeBody=""
        footer={
          <p className="text-center text-xs text-dark/50">
            <Link
              href={`${ADMIN_LOGIN_PATH}?invited=1`}
              className="text-primary font-medium hover:underline"
            >
              Go to admin sign in
            </Link>
          </p>
        }
      >
        <AuthAlert variant="success" title="Preview only">
          No staff account was saved. This flow is ready for invite tokens from your auth provider.
        </AuthAlert>
      </AdminAuthShell>
    )
  }

  return (
    <AdminAuthShell
      title="Create staff account"
      subtitle="Complete your profile using the invitation from your administrator."
      showLaunchNotice
      noticeTitle="Invitation required"
      noticeBody={STAFF_INVITE_NOTICE}
      footer={
        <p className="text-center text-xs text-dark/50">
          Already have access?{' '}
          <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
            Admin sign in
          </Link>
        </p>
      }
    >
      <p className="text-[11px] text-dark/40 text-center font-mono truncate" title={token}>
        Invite token (preview): {token.slice(0, 16)}…
      </p>

      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Work email" htmlFor="invite-email" hint="From your invitation">
          <input
            id="invite-email"
            type="email"
            readOnly
            value={invitedEmail}
            className="input-base bg-muted/80 text-dark/60 cursor-not-allowed"
          />
        </FormField>

        <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={cn('input-base bg-surface', errors.name && 'input-error')}
            {...register('name')}
          />
        </FormField>

        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="Minimum 10 characters"
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
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registerProps={register('confirmPassword')}
        />

        <Button type="submit" variant="premium" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create staff account
            </>
          )}
        </Button>
      </form>
    </AdminAuthShell>
  )
}

function SendInviteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SendInviteForm>({
    resolver: zodResolver(SendInviteSchema),
    defaultValues: { role: 'staff' },
  })

  async function onSubmit(_data: SendInviteForm) {
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
        title="Invitation queued"
        subtitle="Staff invite emails will send when admin auth is connected."
        showLaunchNotice={false}
        footer={
          <p className="text-center text-xs text-dark/50">
            <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
              Back to admin sign in
            </Link>
          </p>
        }
      >
        <AuthAlert variant="success" title="Preview only — no email sent">
          The invitation was not delivered. When live, staff will receive a link to{' '}
          <span className="font-mono text-[11px]">/admin/invite?token=…</span> to set their password.
        </AuthAlert>
      </AdminAuthShell>
    )
  }

  return (
    <AdminAuthShell
      title="Invite staff"
      subtitle="Send a secure invitation for a new team member. No public signup."
      showLaunchNotice
      noticeTitle="Admin only"
      noticeBody="Invitations should be sent by signed-in administrators when auth is live. This form is a UI preview."
      footer={
        <div className="flex flex-col gap-2 text-center text-xs text-dark/50">
          <p>
            Received an invite?{' '}
            <Link href="/admin/invite?token=preview" className="text-primary font-medium hover:underline">
              Create your account
            </Link>
          </p>
          <p>
            <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
              Admin sign in
            </Link>
          </p>
        </div>
      }
    >
      {submitError ? <AuthAlert variant="error">{submitError}</AuthAlert> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Staff name" htmlFor="staff-name" error={errors.name?.message} required>
          <input
            id="staff-name"
            type="text"
            placeholder="Team member name"
            className={cn('input-base bg-surface', errors.name && 'input-error')}
            {...register('name')}
          />
        </FormField>

        <FormField label="Work email" htmlFor="staff-email" error={errors.email?.message} required>
          <input
            id="staff-email"
            type="email"
            placeholder="colleague@organizer.co.ke"
            className={cn('input-base bg-surface', errors.email && 'input-error')}
            {...register('email')}
          />
        </FormField>

        <FormField label="Role" htmlFor="role" error={errors.role?.message} required>
          <select
            id="role"
            className={cn('input-base bg-surface', errors.role && 'input-error')}
            {...register('role')}
          >
            <option value="staff">Staff — bookings & orders</option>
            <option value="admin">Admin — full access</option>
          </select>
        </FormField>

        <Button type="submit" variant="premium" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending invite…
            </>
          ) : (
            <>
              <Send size={18} />
              Send invitation
            </>
          )}
        </Button>
      </form>
    </AdminAuthShell>
  )
}

export default function AdminInviteClient() {
  const params = useSearchParams()
  const token = params.get('token')
  const mode = params.get('mode')

  if (token) {
    const invitedEmail =
      token === 'preview' ? 'staff.preview@organizer.co.ke' : `invited+${token.slice(0, 6)}@organizer.co.ke`
    return <AcceptInviteForm token={token} invitedEmail={invitedEmail} />
  }

  if (mode === 'send') {
    return <SendInviteForm />
  }

  return (
    <AdminAuthShell
      title="Staff invitations"
      subtitle="Accounts are created only through administrator invitations."
      showLaunchNotice
      noticeTitle="No public signup"
      noticeBody={STAFF_INVITE_NOTICE}
      footer={
        <p className="text-center text-xs text-dark/50">
          <Link href={ADMIN_LOGIN_PATH} className="text-primary font-medium hover:underline">
            Admin sign in
          </Link>
        </p>
      }
    >
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/invite?token=preview"
          className="flex items-center justify-center gap-2 min-h-[48px] rounded-button bg-primary text-white text-sm font-medium hover:bg-danger transition-colors"
        >
          <UserPlus size={18} />
          Preview: accept invitation
        </Link>
        <Link
          href="/admin/invite?mode=send"
          className="flex items-center justify-center gap-2 min-h-[48px] rounded-button border border-dark/15 text-sm font-medium text-dark/70 hover:bg-muted transition-colors"
        >
          <Send size={18} />
          Preview: invite staff member
        </Link>
      </div>
    </AdminAuthShell>
  )
}
