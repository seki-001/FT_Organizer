'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smartphone, CreditCard, Lock } from 'lucide-react'
import { MpesaPaymentPanel, PaystackPaymentPanel, type MpesaPaybillInfo } from '@/components/payments/PaymentPanels'
import { formatPrice, cn } from '@/lib/utils'

type PaymentId = 'mpesa' | 'card'

function generateRef() {
  return 'PAY-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

interface PayPageClientProps {
  paybillInfo: MpesaPaybillInfo
}

export default function PayPageClient({ paybillInfo }: PayPageClientProps) {
  const [amount, setAmount] = useState('')
  const [orderRef, setOrderRef] = useState(generateRef)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentId, setPaymentId] = useState<PaymentId>('mpesa')

  const parsedAmount = Number(amount)
  const total = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0
  const canPay = total > 0 && orderRef.trim().length > 0

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-dark mb-2">Make a Payment</h1>
          <p className="text-dark/50 text-sm">
            Pay via M-Pesa Paybill/Till or card. Use the reference from your invoice or order.
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

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-dark">Phone (for M-Pesa)</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
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

          <div className="flex flex-col gap-2">
            {([
              { id: 'mpesa' as const, label: 'M-Pesa', icon: Smartphone, desc: 'STK Push or Paybill/Till' },
              { id: 'card' as const, label: 'Card / Bank', icon: CreditCard, desc: 'Visa, Mastercard via Paystack' },
            ]).map((method) => {
              const Icon = method.icon
              const active = paymentId === method.id
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentId(method.id)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                    active ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-dark/25',
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    active ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                  )}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={cn('font-medium text-sm', active ? 'text-primary' : 'text-dark')}>{method.label}</p>
                    <p className="text-xs text-dark/50">{method.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {canPay && paymentId === 'mpesa' && (
            <MpesaPaymentPanel
              total={total}
              orderRef={orderRef}
              defaultPhone={phone}
              paybillInfo={paybillInfo}
              successRedirect={`/pay/callback?ref=${orderRef}&method=mpesa`}
            />
          )}

          {canPay && paymentId === 'card' && (
            <PaystackPaymentPanel total={total} orderRef={orderRef} email={email} />
          )}

          {!canPay && (
            <p className="text-dark/40 text-sm text-center py-4">
              Enter an amount and reference to continue.
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 text-dark/35 text-xs pt-2">
            <Lock size={12} />
            Secure payments via Safaricom Daraja &amp; Paystack
          </div>
        </div>

        <p className="text-center text-dark/40 text-xs mt-6">
          Shopping online?{' '}
          <Link href="/checkout" className="text-primary hover:underline">Go to checkout</Link>
        </p>
      </div>
    </main>
  )
}
