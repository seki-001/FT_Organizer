'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen glass-grid-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-card p-8 flex flex-col gap-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail size={28} className="text-primary" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-primary font-bold text-sm tracking-wide">{COMPANY.name}</p>
          <h1 className="font-display text-3xl font-bold text-dark">Check Your Email</h1>
          <p className="text-dark/60 text-sm leading-relaxed">
            We sent a confirmation link to your inbox. Click the link to activate your account,
            then come back here to sign in.
          </p>
        </div>

        <div className="bg-muted rounded-lg px-4 py-3 text-sm text-dark/60 text-left">
          <p className="font-medium text-dark mb-1">Did not receive it?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your spam or promotions folder</li>
            <li>Wait a minute and refresh your inbox</li>
            <li>Make sure you entered the correct email</li>
          </ul>
        </div>

        <Link
          href="/login"
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors min-h-[48px] flex items-center justify-center"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  )
}
