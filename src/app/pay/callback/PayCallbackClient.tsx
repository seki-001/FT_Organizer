'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function PayCallbackClient() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const orderRef = searchParams.get('ref')
  const method = searchParams.get('method')

  const [state, setState] = useState<'loading' | 'success' | 'failed'>('loading')
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    if (method === 'mpesa' && orderRef) {
      setState('success')
      return
    }

    if (!reference) {
      setState('failed')
      return
    }

    void (async () => {
      try {
        const res = await fetch(`/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`)
        const data = await res.json() as { paid?: boolean; amount?: number }
        if (data.paid) {
          setState('success')
          if (data.amount) setAmount(data.amount)
        } else {
          setState('failed')
        }
      } catch {
        setState('failed')
      }
    })()
  }, [reference, orderRef, method])

  if (state === 'loading') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-dark/60">Confirming your payment…</p>
      </main>
    )
  }

  if (state === 'failed') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={48} className="text-danger" />
        <h1 className="font-display text-2xl text-dark">Payment not confirmed</h1>
        <p className="text-dark/50 text-sm text-center max-w-sm">
          We couldn&apos;t verify this payment. If money was deducted, contact us with your M-Pesa or Paystack reference.
        </p>
        <Link href="/pay" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90">
          Try Again
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <CheckCircle2 size={56} className="text-success" />
      <h1 className="font-display text-2xl text-dark">Payment Received</h1>
      <p className="text-dark/50 text-sm text-center">
        {orderRef && <>Reference: <strong className="font-mono">{orderRef}</strong><br /></>}
        {reference && <>Transaction: <strong className="font-mono text-xs">{reference}</strong><br /></>}
        {amount != null && <>Amount: <strong>{formatPrice(amount)}</strong></>}
      </p>
      <div className="flex gap-3 mt-4">
        <Link href="/" className="border border-dark/15 px-6 py-3 rounded-xl text-sm hover:bg-muted">
          Home
        </Link>
        <Link href="/account/orders" className="bg-primary text-white px-6 py-3 rounded-xl text-sm hover:bg-primary/90">
          My Orders
        </Link>
      </div>
    </main>
  )
}
