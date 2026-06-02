import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Customer Sign In | Faith The Organizer',
  description: 'Sign in to your Faith The Organizer customer account.',
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
          <div className="flex items-center gap-2 text-dark/40">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
