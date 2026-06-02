'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Smartphone,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice, cn } from '@/lib/utils'
import {
  saveCheckoutConfirmation,
  type PaymentMethodId,
} from '@/lib/checkout-ui'
import CheckoutDevNotice from '@/components/checkout/CheckoutDevNotice'

type MpesaState = 'idle' | 'sending' | 'waiting' | 'success' | 'error'

function inputClass() {
  return 'input-base w-full text-sm'
}

interface PanelBaseProps {
  total: number
  orderRef: string
  customerName: string
  customerEmail?: string
  deliveryLabel: string
  itemCount: number
}

export function MpesaPanel({
  total,
  orderRef,
  defaultPhone,
  customerName,
  customerEmail,
  deliveryLabel,
  itemCount,
}: PanelBaseProps & { defaultPhone: string }) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [phone, setPhone] = useState(defaultPhone)
  const [mpesaState, setMpesaState] = useState<MpesaState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [checkoutReqId, setCheckoutReqId] = useState('')
  const [pollCount, setPollCount] = useState(0)

  async function initiatePush() {
    setMpesaState('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: total, orderRef }),
      })
      const data = (await res.json()) as {
        success: boolean
        checkoutRequestId?: string
        error?: string
      }
      if (!data.success) throw new Error(data.error ?? 'Failed to send STK push')
      setCheckoutReqId(data.checkoutRequestId ?? '')
      setMpesaState('waiting')
      setPollCount(0)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setMpesaState('error')
    }
  }

  useEffect(() => {
    if (mpesaState !== 'waiting' || !checkoutReqId) return
    if (pollCount >= 10) {
      setMpesaState('error')
      setErrorMsg('Payment timed out. Please try again or choose another method.')
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/payments/mpesa/status?checkoutRequestId=${checkoutReqId}`,
        )
        const data = (await res.json()) as { status: 'pending' | 'success' | 'failed' }
        if (data.status === 'success') {
          setMpesaState('success')
          saveCheckoutConfirmation({
            ref: orderRef,
            name: customerName,
            email: customerEmail,
            paymentMethod: 'mpesa',
            paymentStatus: 'pending_verification',
            deliveryLabel,
            total,
            itemCount,
          })
          clearCart()
          router.push(
            `/order-confirmation?ref=${encodeURIComponent(orderRef)}&payment=mpesa&name=${encodeURIComponent(customerName)}`,
          )
        } else if (data.status === 'failed') {
          setMpesaState('error')
          setErrorMsg('Payment was declined. Please try again.')
        } else {
          setPollCount((c) => c + 1)
        }
      } catch {
        setPollCount((c) => c + 1)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [
    mpesaState,
    checkoutReqId,
    pollCount,
    clearCart,
    router,
    orderRef,
    customerName,
    customerEmail,
    deliveryLabel,
    total,
    itemCount,
  ])

  return (
    <div className="flex flex-col gap-4 mt-2">
      <CheckoutDevNotice />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mpesa-phone" className="text-sm font-medium text-dark">
          M-Pesa phone number
        </label>
        <input
          id="mpesa-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          disabled={mpesaState === 'waiting' || mpesaState === 'success'}
          className={inputClass()}
        />
        <p className="text-xs text-dark/45">You will receive an STK push to enter your PIN.</p>
      </div>

      {mpesaState === 'waiting' && (
        <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success/8 px-4 py-3">
          <Smartphone size={20} className="text-success shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-medium text-dark">Check your phone</p>
            <p className="text-dark/60 text-xs mt-1 leading-relaxed">
              Enter your M-Pesa PIN. We will verify payment before marking your order complete.
            </p>
            <p className="flex items-center gap-1.5 mt-2 text-xs text-dark/50">
              <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              Waiting for confirmation ({pollCount}/10)…
            </p>
          </div>
        </div>
      )}

      {mpesaState === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/8 px-4 py-3">
          <AlertCircle size={18} className="text-danger shrink-0" aria-hidden="true" />
          <p className="text-sm text-danger">{errorMsg}</p>
        </div>
      )}

      {(mpesaState === 'idle' || mpesaState === 'error') && (
        <button
          type="button"
          onClick={initiatePush}
          className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-button bg-[#00A651] hover:bg-[#008f47] text-white font-semibold transition-colors"
        >
          <Smartphone size={20} aria-hidden="true" />
          {mpesaState === 'error' ? 'Try again' : `Send STK push · ${formatPrice(total)}`}
        </button>
      )}

      {mpesaState === 'sending' && (
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-button bg-[#00A651]/70 text-white font-semibold"
        >
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          Sending STK push…
        </button>
      )}
    </div>
  )
}

export function CardPanel({
  total,
  orderRef,
  customerName,
  customerEmail,
  deliveryLabel,
  itemCount,
}: PanelBaseProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handlePay() {
    setLoading(true)
    setErrorMsg('')
    try {
      saveCheckoutConfirmation({
        ref: orderRef,
        name: customerName,
        email: customerEmail,
        paymentMethod: 'card',
        paymentStatus: 'redirected_to_gateway',
        deliveryLabel,
        total,
        itemCount,
      })
      const res = await fetch('/api/payments/flutterwave/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, orderRef }),
      })
      const data = (await res.json()) as { redirectUrl?: string; error?: string }
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.error ?? 'Could not start card payment')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <CheckoutDevNotice />
      <p className="text-sm text-dark/65 leading-relaxed card-surface border border-dark/8 p-4 bg-surface">
        Pay securely via Flutterwave (Visa / Mastercard). You will leave this site to complete
        payment. Your order is not marked paid until the gateway confirms success.
      </p>
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/8 px-4 py-3">
          <AlertCircle size={18} className="text-danger shrink-0" />
          <p className="text-sm text-danger">{errorMsg}</p>
        </div>
      )}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-button bg-primary text-white font-semibold hover:bg-danger disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <CreditCard size={20} aria-hidden="true" />
            Pay {formatPrice(total)} by card
          </>
        )}
      </button>
    </div>
  )
}

export function CodPanel({
  total,
  orderRef,
  customerName,
  customerEmail,
  deliveryLabel,
  itemCount,
}: PanelBaseProps) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  async function handlePlace() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    saveCheckoutConfirmation({
      ref: orderRef,
      name: customerName,
      email: customerEmail,
      paymentMethod: 'cod',
      paymentStatus: 'awaiting_delivery',
      deliveryLabel,
      total,
      itemCount,
    })
    clearCart()
    router.push(
      `/order-confirmation?ref=${encodeURIComponent(orderRef)}&payment=cod&name=${encodeURIComponent(customerName)}`,
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <p className="text-sm text-dark/65 leading-relaxed card-surface border border-dark/8 p-4 bg-surface">
        Pay when your order arrives (Nairobi deliveries). This places your order — it is{' '}
        <strong className="text-dark font-medium">not</strong> marked as paid online.
      </p>
      <button
        type="button"
        onClick={handlePlace}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-button bg-primary text-white font-semibold hover:bg-danger disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Placing order…
          </>
        ) : (
          <>
            <Banknote size={20} aria-hidden="true" />
            Place order · pay {formatPrice(total)} on delivery
          </>
        )}
      </button>
    </div>
  )
}

export const PAYMENT_ICONS: Record<PaymentMethodId, typeof Smartphone> = {
  mpesa: Smartphone,
  card: CreditCard,
  cod: Banknote,
}

export function paymentOptionClass(active: boolean) {
  return cn(
    'flex items-center gap-4 p-4 rounded-card border-2 text-left transition-all w-full min-h-[44px]',
    active ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-dark/20 bg-white',
  )
}
