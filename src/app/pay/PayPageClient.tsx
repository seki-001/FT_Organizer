'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import PaymentTrustBadges from '@/components/payments/PaymentTrustBadges'
import { formatPrice } from '@/lib/utils'

function generateRef() {
  return 'PAY-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

export default function PayPageClient() {
  const [amount, setAmount] = useState('')
  const [orderRef, setOrderRef] = useState(generateRef)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const parsedAmount = Number(amount)
  const total = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0
  const canPay = total > 0 && orderRef.trim().length > 0 && email.trim().length > 0

  async function handlePay() {
    if (!canPay) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payments/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, orderRef, email }),
      })
      const data = await res.json() as { redirectUrl?: string; error?: string }
      if (data.error) throw new Error(data.error)
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }
      throw new Error('No payment page returned. Try again.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-dark mb-2">Make a Payment</h1>
          <p className="text-dark/50 text-sm">
            Pay securely via Paystack — M-Pesa, Visa, Mastercard, or bank transfer.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-dark/8 p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="text-sm font-medium text-dark">Amount (KSh)</label>
              <input
                id="amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 2500"
                className="mt-1.5 w-full bg-muted rounded-lg px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="ref" className="text-sm font-medium text-dark">Payment Reference</label>
              <input
                id="ref"
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                placeholder="ORD-XXXXXX or invoice number"
                className="mt-1.5 w-full bg-muted rounded-lg px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-dark">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full bg-muted rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {total > 0 && (
            <div className="bg-primary/5 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-dark/60 text-sm">Total due</span>
              <span className="font-mono font-bold text-primary text-lg">{formatPrice(total)}</span>
            </div>
          )}

          <p className="text-dark/60 text-sm leading-relaxed bg-muted rounded-xl px-4 py-3">
            You&apos;ll be redirected to Paystack&apos;s secure checkout to complete payment.
            M-Pesa, cards, and bank transfer are available on the same page.
          </p>

          {error && (
            <p className="text-danger text-sm">{error}</p>
          )}

          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={!canPay || loading}
            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors min-h-[54px]"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Redirecting to Paystack…</>
            ) : (
              <>Pay {total > 0 ? formatPrice(total) : ''} with Paystack</>
            )}
          </button>

          {!canPay && !loading && (
            <p className="text-dark/40 text-sm text-center">
              Enter amount, reference, and email to continue.
            </p>
          )}

          <PaymentTrustBadges className="pt-2" />
        </div>

        <p className="text-center text-dark/40 text-xs mt-6">
          Shopping online?{' '}
          <Link href="/checkout" className="text-primary hover:underline">Go to checkout</Link>
        </p>
      </div>
    </main>
  )
}
