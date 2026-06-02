'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FooterNewsletter() {
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
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = (await res.json()) as { message?: string; error?: string }
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Could not subscribe. Please try again.')
        return
      }
      setStatus('success')
      setMessage(data.message ?? 'Thanks for subscribing!')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="footer-newsletter-email" className="text-sm font-medium text-white/90">
        Newsletter
      </label>
      <p className="text-xs text-white/55 mb-1">Organizing tips and offers across East Africa.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="footer-newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={status === 'loading'}
          className={cn(
            'flex-1 min-h-[44px] rounded-button border border-white/15 bg-white/10 px-4 py-2.5',
            'text-sm text-white placeholder:text-white/40',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-[44px] shrink-0 rounded-button bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-danger transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Subscribe'}
        </button>
      </div>
      {message ? (
        <p
          className={cn('text-xs', status === 'error' ? 'text-danger/90' : 'text-success/90')}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
