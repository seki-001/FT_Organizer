'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Mail } from 'lucide-react'
import OfferBadge from './OfferBadge'

export default function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Subscription failed')
      setStatus('success')
      setMessage('You\'re on the list — watch for member-only sales.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <section className="py-14 md:py-16 glass-grid-bg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="sfs-card p-8 md:p-12 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
          <div className="flex-1 max-w-lg">
            <OfferBadge variant="glass-light" className="mb-4">Member perks</OfferBadge>
            <h2 className="font-display text-2xl md:text-3xl text-dark leading-tight mb-3">
              Get first access to sales, promos &amp; organizing tips
            </h2>
            <p className="text-dark/55 text-sm leading-relaxed">
              Join free for early sale alerts and exclusive codes like FIRSTORDER.
              Or{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                create an account
              </Link>{' '}
              to track orders too.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="flex-1 w-full max-w-md">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/35" aria-hidden="true" />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={status === 'loading'}
                  className="sfs-input pl-11 w-full"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="sfs-btn-primary whitespace-nowrap min-h-[48px] px-6"
              >
                {status === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Joining…</>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            {message && (
              <p className={`text-sm mt-2 ${status === 'error' ? 'text-danger' : 'text-success'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
