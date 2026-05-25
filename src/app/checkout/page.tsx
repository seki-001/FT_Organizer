'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Lock, ChevronRight, ChevronLeft, Loader2,
  Smartphone, CreditCard, Banknote, Truck, Package, Store,
  CheckCircle2, AlertCircle,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { DELIVERY_OPTIONS, PAYMENT_METHODS, COMPANY } from '@/lib/constants'
import { CheckoutFormSchema, type CheckoutFormValues } from '@/lib/validations'
import { formatPrice, cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type DeliveryId = 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
type PaymentId  = 'mpesa' | 'card' | 'cod'
type MpesaState = 'idle' | 'sending' | 'waiting' | 'success' | 'error'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Details', 'Delivery', 'Payment']

const DELIVERY_DETAIL: Record<DeliveryId, { icon: typeof Truck; tagline: string }> = {
  'nairobi-same-day':    { icon: Truck,   tagline: 'Delivered today if ordered before 2 pm' },
  'standard-nationwide': { icon: Package, tagline: '2–4 business days' },
  'pickup':              { icon: Store,   tagline: `Collect from ${COMPANY.address}` },
}

const PAYMENT_ICON: Record<PaymentId, typeof Smartphone> = {
  mpesa: Smartphone,
  card:  CreditCard,
  cod:   Banknote,
}

function generateOrderRef() {
  return 'ORD-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-danger text-xs mt-1">{message}</p>
}

function inputClass(hasError?: boolean) {
  return cn(
    'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition',
    hasError && 'ring-2 ring-danger/40'
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {STEPS.map((label, i) => {
          const done    = i + 1 < step
          const current = i + 1 === step
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                  done    && 'bg-primary border-primary text-white',
                  current && 'bg-white border-primary text-primary',
                  !done && !current && 'bg-white border-dark/20 text-dark/40'
                )}
              >
                {done ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={cn(
                'text-xs font-medium hidden sm:block',
                current ? 'text-primary' : done ? 'text-dark/60' : 'text-dark/30'
              )}>
                {label}
              </span>
            </div>
          )
        })}
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-dark/10 -z-0" aria-hidden="true">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  deliveryFee,
  promoDiscount,
}: {
  deliveryFee: number
  promoDiscount: number
}) {
  const { items, totalPrice } = useCart()
  const finalTotal = totalPrice - promoDiscount + deliveryFee

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 flex flex-col gap-4">
      <h2 className="font-display text-lg text-dark">Order Summary</h2>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const unitPrice = (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0)
          return (
            <div key={`${item.product.id}-${item.variant?.id ?? ''}`} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-dark text-xs font-medium line-clamp-1">{item.product.name}</p>
                {item.variant && <p className="text-dark/40 text-xs">{item.variant.value}</p>}
              </div>
              <span className="font-mono text-xs font-semibold text-dark flex-shrink-0">
                {formatPrice(unitPrice * item.quantity)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-dark/8 pt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-dark/60">
          <span>Subtotal</span>
          <span className="font-mono">{formatPrice(totalPrice)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-success">
            <span>Promo discount</span>
            <span className="font-mono">−{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-dark/60">
          <span>Delivery</span>
          <span className="font-mono">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-dark border-t border-dark/8 pt-2 mt-1">
          <span>Total</span>
          <span className="font-mono text-lg">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-1.5 text-dark/35 text-xs pt-1">
        <Lock size={12} aria-hidden="true" />
        256-bit secure checkout
      </div>
    </div>
  )
}

// ─── Payment panels ───────────────────────────────────────────────────────────

function MpesaPanel({
  total,
  orderRef,
  defaultPhone,
}: {
  total: number
  orderRef: string
  defaultPhone: string
}) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [phone, setPhone]         = useState(defaultPhone)
  const [mpesaState, setMpesaState] = useState<MpesaState>('idle')
  const [errorMsg, setErrorMsg]   = useState('')
  const [checkoutReqId, setCheckoutReqId] = useState('')
  const [pollCount, setPollCount] = useState(0)

  async function initiatePush() {
    setMpesaState('sending')
    setErrorMsg('')
    try {
      const res  = await fetch('/api/payments/mpesa/initiate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, amount: total, orderRef }),
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

  // Poll for payment status
  useEffect(() => {
    if (mpesaState !== 'waiting' || !checkoutReqId) return
    if (pollCount >= 10) {
      setMpesaState('error')
      setErrorMsg('Payment timed out. Please try again.')
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/payments/mpesa/status?checkoutRequestId=${checkoutReqId}`)
        const data = await res.json() as { status: 'pending' | 'success' | 'failed' }
        if (data.status === 'success') {
          setMpesaState('success')
          clearCart()
          router.push(`/order-confirmation?ref=${orderRef}`)
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
  }, [mpesaState, checkoutReqId, pollCount, clearCart, router, orderRef])

  return (
    <div className="flex flex-col gap-4 mt-4">
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

      {/* Waiting instruction */}
      {mpesaState === 'waiting' && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Smartphone size={20} className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-green-800 font-medium text-sm">Check your phone</p>
            <p className="text-green-700 text-xs mt-0.5 leading-relaxed">
              Enter your M-Pesa PIN to complete payment. Waiting for confirmation…
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-green-600 text-xs">
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
              Polling ({pollCount}/10)…
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {mpesaState === 'error' && (
        <div className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-danger text-sm font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      {(mpesaState === 'idle' || mpesaState === 'error') && (
        <button
          type="button"
          onClick={initiatePush}
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors duration-200 min-h-[54px]"
        >
          <Smartphone size={20} aria-hidden="true" />
          {mpesaState === 'error' ? 'Try Again' : `Pay ${formatPrice(total)} via M-Pesa`}
        </button>
      )}

      {mpesaState === 'sending' && (
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 w-full bg-green-600/70 text-white font-semibold py-4 rounded-xl min-h-[54px]"
        >
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          Sending STK Push…
        </button>
      )}
    </div>
  )
}

function CardPanel({ total, orderRef }: { total: number; orderRef: string }) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const res  = await fetch('/api/payments/flutterwave/initiate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: total, orderRef }),
      })
      const data = await res.json() as { redirectUrl?: string }
      if (data.redirectUrl) window.location.href = data.redirectUrl
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="text-dark/60 text-sm leading-relaxed bg-muted rounded-xl px-4 py-3">
        You&apos;ll be redirected to Flutterwave&apos;s secure payment page to enter your card details.
        Visa and Mastercard accepted.
      </p>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors duration-200 min-h-[54px]"
      >
        {loading ? (
          <><Loader2 size={20} className="animate-spin" /> Redirecting…</>
        ) : (
          <><CreditCard size={20} aria-hidden="true" /> Pay {formatPrice(total)} by Card</>
        )}
      </button>
    </div>
  )
}

function CodPanel({ total, orderRef }: { total: number; orderRef: string }) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  async function handlePlace() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    clearCart()
    router.push(`/order-confirmation?ref=${orderRef}`)
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="text-dark/60 text-sm leading-relaxed bg-muted rounded-xl px-4 py-3">
        Pay when your order arrives. Available for Nairobi deliveries only.
        Our team will confirm your order via WhatsApp.
      </p>
      <button
        type="button"
        onClick={handlePlace}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors duration-200 min-h-[54px]"
      >
        {loading ? (
          <><Loader2 size={20} className="animate-spin" /> Placing Order…</>
        ) : (
          <><Banknote size={20} aria-hidden="true" /> Place Order — {formatPrice(total)}</>
        )}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const router = useRouter()

  const [step, setStep]                 = useState(1)
  const [deliveryId, setDeliveryId]     = useState<DeliveryId>('nairobi-same-day')
  const [paymentId, setPaymentId]       = useState<PaymentId>('mpesa')
  const [orderRef]                      = useState(generateOrderRef)
  const [promoCode,     setPromoCode]     = useState('')
  const [promoInput,    setPromoInput]    = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage,  setPromoMessage]  = useState('')
  const [promoValid,    setPromoValid]    = useState<boolean | null>(null)
  const [promoLoading,  setPromoLoading]  = useState(false)

  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)?.price ?? 0
  const orderTotal  = totalPrice - promoDiscount + deliveryFee

  async function applyPromoCode() {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoLoading(true)
    setPromoMessage('')
    setPromoValid(null)
    try {
      const res  = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal: totalPrice }),
      })
      const data = await res.json() as { valid: boolean; discountValue?: number; message: string }
      setPromoValid(data.valid)
      setPromoMessage(data.message)
      if (data.valid && data.discountValue) {
        setPromoDiscount(data.discountValue)
        setPromoCode(code)
      }
    } catch {
      setPromoValid(false)
      setPromoMessage('Unable to validate code. Please try again.')
    } finally {
      setPromoLoading(false)
    }
  }

  function removePromo() {
    setPromoInput(''); setPromoCode(''); setPromoDiscount(0)
    setPromoMessage(''); setPromoValid(null)
  }

  const {
    register,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', address: '', city: '', notes: '' },
  })

  const watchedPhone = watch('phone')

  // Redirect empty cart away from checkout
  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  async function nextStep() {
    if (step === 1) {
      const valid = await trigger(['name', 'email', 'phone', 'address', 'city'])
      if (!valid) return
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  if (items.length === 0) return null

  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl text-dark mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Form ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-dark/8 p-6 sm:p-8">
              <ProgressBar step={step} />

              {/* STEP 1 — Details ─────────────────────────────────────── */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <h2 className="font-display text-xl text-dark">Delivery Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-dark">Full Name</label>
                      <input id="name" type="text" autoComplete="name" placeholder="Your full name" {...register('name')} className={inputClass(!!errors.name)} />
                      <FieldError message={errors.name?.message} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-dark">Phone Number</label>
                      <input id="phone" type="tel" autoComplete="tel" placeholder="07XX XXX XXX" {...register('phone')} className={inputClass(!!errors.phone)} />
                      <FieldError message={errors.phone?.message} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-dark">Email Address</label>
                      <input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} className={inputClass(!!errors.email)} />
                      <FieldError message={errors.email?.message} />
                    </div>

                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="address" className="text-sm font-medium text-dark">Delivery Address</label>
                      <textarea id="address" rows={3} placeholder="Street, building, apartment number..." autoComplete="street-address" {...register('address')} className={cn(inputClass(!!errors.address), 'resize-none')} />
                      <FieldError message={errors.address?.message} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="city" className="text-sm font-medium text-dark">City / Area</label>
                      <input id="city" type="text" placeholder="e.g. Westlands, Karen, CBD" autoComplete="address-level2" {...register('city')} className={inputClass(!!errors.city)} />
                      <FieldError message={errors.city?.message} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="notes" className="text-sm font-medium text-dark">
                        Delivery Notes
                        <span className="font-normal text-dark/40 ml-1">(optional)</span>
                      </label>
                      <input id="notes" type="text" placeholder="Gate code, landmarks..." {...register('notes')} className={inputClass()} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Delivery Method ─────────────────────────────── */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-display text-xl text-dark">Delivery Method</h2>
                  <div className="flex flex-col gap-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const detail = DELIVERY_DETAIL[opt.id as DeliveryId]
                      const Icon   = detail.icon
                      const active = deliveryId === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDeliveryId(opt.id as DeliveryId)}
                          aria-pressed={active}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
                            active ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-dark/25 bg-white'
                          )}
                        >
                          <div className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                            active ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                          )}>
                            <Icon size={18} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className={cn('font-medium text-sm', active ? 'text-primary' : 'text-dark')}>
                                {opt.label}
                              </span>
                              <span className={cn('font-mono text-sm font-semibold', active ? 'text-primary' : 'text-dark')}>
                                {opt.price === 0 ? 'Free' : formatPrice(opt.price)}
                              </span>
                            </div>
                            <p className={cn('text-xs mt-0.5', active ? 'text-primary/70' : 'text-dark/50')}>
                              {detail.tagline}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3 — Payment ─────────────────────────────────────── */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-display text-xl text-dark">Payment</h2>

                  {/* Payment method selector */}
                  <div className="flex flex-col gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon   = PAYMENT_ICON[method.id as PaymentId]
                      const active = paymentId === method.id
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentId(method.id as PaymentId)}
                          aria-pressed={active}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
                            active ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-dark/25 bg-white'
                          )}
                        >
                          <div className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                            active ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                          )}>
                            <Icon size={18} aria-hidden="true" />
                          </div>
                          <div>
                            <p className={cn('font-medium text-sm', active ? 'text-primary' : 'text-dark')}>
                              {method.label}
                            </p>
                            <p className={cn('text-xs', active ? 'text-primary/70' : 'text-dark/50')}>
                              {method.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Payment panels */}
                  {paymentId === 'mpesa' && (
                    <MpesaPanel total={orderTotal} orderRef={orderRef} defaultPhone={watchedPhone} />
                  )}
                  {paymentId === 'card' && (
                    <CardPanel total={orderTotal} orderRef={orderRef} />
                  )}
                  {paymentId === 'cod' && (
                    <CodPanel total={orderTotal} orderRef={orderRef} />
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark/8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-150 min-h-[44px]"
                    >
                      <ChevronLeft size={17} /> Back
                    </button>
                  ) : (
                    <Link
                      href="/cart"
                      className="flex items-center gap-1.5 text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-150"
                    >
                      <ChevronLeft size={17} /> Back to Cart
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 min-h-[44px]"
                  >
                    Continue <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Summary (sticky on desktop) ────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Promo code input */}
            <div className="bg-white rounded-2xl border border-dark/8 p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-dark">Promo Code</p>
              {promoCode ? (
                <div className="flex items-center justify-between bg-success/8 border border-success/20 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-mono font-bold text-success">{promoCode}</span>
                  <button onClick={removePromo} className="text-xs text-dark/40 hover:text-danger transition-colors">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text" value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void applyPromoCode() } }}
                    placeholder="Enter code…"
                    className="flex-1 px-3 py-2 text-sm border border-dark/15 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:normal-case placeholder:font-sans placeholder:text-dark/30"
                  />
                  <button onClick={() => void applyPromoCode()} disabled={promoLoading || !promoInput.trim()}
                    className="px-4 py-2 bg-dark text-white text-sm font-medium rounded-lg hover:bg-dark/80 transition-colors disabled:opacity-40">
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoMessage && (
                <p className={`text-xs font-medium ${promoValid ? 'text-success' : 'text-danger'}`}>{promoMessage}</p>
              )}
            </div>

            <OrderSummary deliveryFee={deliveryFee} promoDiscount={promoDiscount} />
          </div>

        </div>
      </div>
    </main>
  )
}
