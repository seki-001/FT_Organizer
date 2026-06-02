import type { Metadata } from 'next'
import Link from 'next/link'
import { MailCheck, MailWarning, Clock } from 'lucide-react'
import AuthShell from '@/components/auth/AuthShell'
import AuthAlert from '@/components/auth/AuthAlert'

export const metadata: Metadata = {
  title: 'Verify Email | Faith The Organizer',
  description: 'Verify your Faith The Organizer account email address.',
}

type VerifyStatus = 'pending' | 'success' | 'expired'

function resolveStatus(raw?: string): VerifyStatus {
  if (raw === 'success') return 'success'
  if (raw === 'expired') return 'expired'
  return 'pending'
}

const COPY: Record<
  VerifyStatus,
  { title: string; subtitle: string; variant: 'info' | 'success' | 'error'; alertTitle: string; body: string; icon: typeof Clock }
> = {
  pending: {
    title: 'Verify your email',
    subtitle: 'We sent a verification link when you signed up.',
    variant: 'info',
    alertTitle: 'Waiting for verification',
    body: 'Check your inbox and spam folder. Customer email verification will connect to your auth provider when accounts launch.',
    icon: Clock,
  },
  success: {
    title: 'Email verified',
    subtitle: 'Your email address is confirmed.',
    variant: 'success',
    alertTitle: 'You’re all set',
    body: 'Sign in will be available when customer accounts go live. You can return to the site or book a site visit in the meantime.',
    icon: MailCheck,
  },
  expired: {
    title: 'Link expired',
    subtitle: 'This verification link is no longer valid.',
    variant: 'error',
    alertTitle: 'Request a new link',
    body: 'Verification links will be reissued from your account settings when sign-up is live. Contact us if you need help sooner.',
    icon: MailWarning,
  },
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = resolveStatus(searchParams.status)
  const content = COPY[status]
  const Icon = content.icon

  return (
    <AuthShell
      title={content.title}
      subtitle={content.subtitle}
      showLaunchNotice={status === 'pending'}
      footer={
        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
          <Link href="/login" className="text-primary font-medium hover:underline text-center">
            Sign in
          </Link>
          <span className="hidden sm:inline text-dark/25" aria-hidden="true">
            ·
          </span>
          <Link href="/register" className="text-primary font-medium hover:underline text-center">
            Create account
          </Link>
          <span className="hidden sm:inline text-dark/25" aria-hidden="true">
            ·
          </span>
          <Link href="/" className="text-dark/50 hover:text-dark text-center">
            Home
          </Link>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-5 py-2 text-center">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            status === 'success'
              ? 'bg-success/15 text-success'
              : status === 'expired'
                ? 'bg-danger/10 text-danger'
                : 'bg-primary/10 text-primary'
          }`}
        >
          <Icon size={28} aria-hidden="true" />
        </div>
        <AuthAlert variant={content.variant} title={content.alertTitle}>
          {content.body}
        </AuthAlert>
        {status === 'expired' ? (
          <Link
            href="/forgot-password"
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password instead →
          </Link>
        ) : null}
        {status === 'success' ? (
          <Link
            href="/login?verified=1"
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-button bg-primary text-white font-medium hover:bg-danger transition-colors w-full sm:w-auto"
          >
            Continue to sign in
          </Link>
        ) : null}
      </div>
    </AuthShell>
  )
}
