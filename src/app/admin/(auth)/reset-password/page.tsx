import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AdminResetPasswordClient from './AdminResetPasswordClient'

export const metadata: Metadata = {
  title: 'Reset Password | FTO Admin',
  description: 'Set a new password for your Faith The Organizer staff account.',
  robots: { index: false, follow: false },
}

function ResetFallback() {
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen bg-[#ebeae6] min-h-[50vh] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-dark/30" />
    </div>
  )
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <AdminResetPasswordClient />
    </Suspense>
  )
}
