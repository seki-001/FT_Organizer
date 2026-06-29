'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Smartphone, CreditCard, AlertCircle, Copy, Check,
  Building2, Hash,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

type MpesaState = 'idle' | 'sending' | 'waiting' | 'success' | 'error'

export interface MpesaPaybillInfo {
  paybill: string
  till?: string
  accountName: string
  mode: 'paybill' | 'till'
}

interface MpesaPanelProps {
  total: number
  orderRef: string
  defaultPhone?: string
  paybillInfo?: MpesaPaybillInfo
  onSuccess?: () => void
  successRedirect?: string
}

function inputClass() {
  return 'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition'
}

export function MpesaPaymentPanel({
  total,
  orderRef,
  defaultPhone = '',
  paybillInfo,
  onSuccess,
  successRedirect,
}: MpesaPanelProps) {
  const router = useRouter()
  const [phone, setPhone] = useState(defaultPhone)
  const [mpesaState, setMpesaState] = useState<MpesaState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [checkoutReqId, setCheckoutReqId] = useState('')
  const [pollCount, setPollCount] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (defaultPhone && !phone) setPhone(defaultPhone)
  }, [defaultPhone, phone])

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  async function initiatePush() {
    setMpesaState('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: total, orderRef }),
      })
      const data = await res.json() as { success: boolean; checkoutRequestId?: string; error?: string }
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
    if (pollCount >= 15) {
      setMpesaState('error')
      setErrorMsg('Payment timed out. Please try again.')
      return
    }
    const timer = setTimeout(async () => {
      try {
        const pollParam = checkoutReqId.startsWith('mock_') ? `&poll=${pollCount}` : ''
        const res = await fetch(
          `/api/payments/mpesa/status?checkoutRequestId=${checkoutReqId}${pollParam}`,
        )
        const data = await res.json() as { status: 'pending' | 'success' | 'failed' }
        if (data.status === 'success') {
          setMpesaState('success')
          onSuccess?.()
          if (successRedirect) router.push(successRedirect)
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
  }, [mpesaState, checkoutReqId, pollCount, onSuccess, router, successRedirect])

  return (
    <div className="flex flex-col gap-4">
      {paybillInfo && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <p className="text-green-900 font-medium text-sm">Pay manually via M-Pesa</p>
          <div className="grid gap-2 text-sm">
            {paybillInfo.mode === 'paybill' && paybillInfo.paybill && (
              <div className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-green-800">
                  <Building2 size={16} />
                  <span>Paybill: <strong className="font-mono">{paybillInfo.paybill}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => void copyText('paybill', paybillInfo.paybill)}
                  className="text-green-700 hover:text-green-900 p-1"
                  aria-label="Copy paybill number"
                >
                  {copied === 'paybill' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
            {paybillInfo.till && (
              <div className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-green-800">
                  <Hash size={16} />
                  <span>Till: <strong className="font-mono">{paybillInfo.till}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => void copyText('till', paybillInfo.till!)}
                  className="text-green-700 hover:text-green-900 p-1"
                  aria-label="Copy till number"
                >
                  {copied === 'till' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-3 py-2">
              <span className="text-green-800">Account: <strong>{paybillInfo.accountName}</strong></span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white/70 rounded-lg px-3 py-2">
              <span className="text-green-800">Reference: <strong className="font-mono">{orderRef}</strong></span>
              <button
                type="button"
                onClick={() => void copyText('ref', orderRef)}
                className="text-green-700 hover:text-green-900 p-1"
                aria-label="Copy reference"
              >
                {copied === 'ref' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-green-700 text-xs">Amount: <strong>{formatPrice(total)}</strong></p>
          </div>
          <p className="text-green-700 text-xs border-t border-green-200 pt-2">
            Or use STK Push below — we&apos;ll prompt your phone automatically.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mpesa-phone" className="text-sm font-medium text-dark">
          M-Pesa Phone Number
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
        <p className="text-dark/40 text-xs">Format: 07XX XXX XXX</p>
      </div>

      {mpesaState === 'waiting' && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Smartphone size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium text-sm">Check your phone</p>
            <p className="text-green-700 text-xs mt-0.5">
              Enter your M-Pesa PIN to complete payment. Waiting for confirmation…
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-green-600 text-xs">
              <Loader2 size={13} className="animate-spin" />
              Polling ({pollCount}/15)…
            </div>
          </div>
        </div>
      )}

      {mpesaState === 'error' && (
        <div className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
          <p className="text-danger text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {(mpesaState === 'idle' || mpesaState === 'error') && (
        <button
          type="button"
          onClick={() => void initiatePush()}
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors min-h-[54px]"
        >
          <Smartphone size={20} />
          {mpesaState === 'error' ? 'Try Again' : `Pay ${formatPrice(total)} via M-Pesa`}
        </button>
      )}

      {mpesaState === 'sending' && (
        <button type="button" disabled className="flex items-center justify-center gap-2 w-full bg-green-600/70 text-white font-semibold py-4 rounded-xl min-h-[54px]">
          <Loader2 size={20} className="animate-spin" />
          Sending STK Push…
        </button>
      )}
    </div>
  )
}

interface PaystackPanelProps {
  total: number
  orderRef: string
  email: string
  onSuccess?: () => void
}

export function PaystackPaymentPanel({ total, orderRef, email, onSuccess }: PaystackPanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    if (!email) {
      setError('Enter your email address first.')
      return
    }
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
      onSuccess?.()
      if (data.redirectUrl) window.location.href = data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-dark/60 text-sm leading-relaxed bg-muted rounded-xl px-4 py-3">
        You&apos;ll be redirected to Paystack&apos;s secure page to pay by card, bank, or mobile money.
        Visa, Mastercard, and M-Pesa are accepted.
      </p>
      {error && (
        <p className="text-danger text-sm">{error}</p>
      )}
      <button
        type="button"
        onClick={() => void handlePay()}
        disabled={loading || !email}
        className={cn(
          'flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors min-h-[54px]',
        )}
      >
        {loading ? (
          <><Loader2 size={20} className="animate-spin" /> Redirecting…</>
        ) : (
          <><CreditCard size={20} /> Pay {formatPrice(total)} by Card</>
        )}
      </button>
    </div>
  )
}
