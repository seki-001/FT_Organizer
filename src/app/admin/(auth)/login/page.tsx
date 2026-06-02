import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AdminLoginClient from './AdminLoginClient'

export const metadata: Metadata = {
  title: 'Admin Sign In | FTO Admin',
  description: 'Sign in to the Faith The Organizer admin panel.',
  robots: { index: false, follow: false },
}

function LoginFallback() {
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen bg-[#ebeae6] min-h-[50vh] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-dark/30" />
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginClient />
    </Suspense>
  )
}
