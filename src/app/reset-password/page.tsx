import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import ResetPasswordClient from './ResetPasswordClient'

export const metadata: Metadata = {
  title: 'Reset Password | Faith The Organizer',
  description: 'Set a new password for your Faith The Organizer account.',
}

function ResetFallback() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="flex items-center gap-2 text-dark/40">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <ResetPasswordClient />
    </Suspense>
  )
}
