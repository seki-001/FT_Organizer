'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Lock, ChevronRight, ChevronLeft, Loader2,
  Smartphone, CreditCard, Banknote, Truck, Package, Store,
  CheckCircle2, User, UserPlus, Sparkles,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { DELIVERY_OPTIONS, PAYMENT_METHODS, COMPANY } from '@/lib/constants'
import { CheckoutFormSchema, type CheckoutFormValues } from '@/lib/validations'
import { formatPrice, cn } from '@/lib/utils'
import { MpesaPaymentPanel, PaystackPaymentPanel } from '@/components/payments/PaymentPanels'
import PaymentTrustBadges from '@/components/payments/PaymentTrustBadges'

// ─── Types ────────────────────────────────────────────────────────────────────

type DeliveryId = 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
type PaymentId  = 'mpesa' | 'card' | 'cod'
type CheckoutMode = 'guest' | 'account'

const MPESA_PAYBILL_INFO = {
  paybill: process.env.NEXT_PUBLIC_MPESA_PAYBILL ?? '174379',
  till: process.env.NEXT_PUBLIC_MPESA_TILL || undefined,
  accountName: process.env.NEXT_PUBLIC_MPESA_ACCOUNT_NAME ?? 'Faith The Organizer',
  mode: (process.env.NEXT_PUBLIC_MPESA_MODE ?? 'paybill') as 'paybill' | 'till',
}

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


const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

function CodPanel({
  total,
  onPlaceOrder,
  placing,
}: {
  total: number
  onPlaceOrder: () => Promise<string | null>
  placing: boolean
}) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  async function handlePlace() {
    setLoading(true)
    try {
      const ref = await onPlaceOrder()
      if (!ref) return
      clearCart()
      router.push(`/order-confirmation?ref=${ref}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <p className="text-dark/60 text-sm leading-relaxed bg-muted rounded-xl px-4 py-3">
        Pay when your order arrives. Available for Nairobi deliveries only.
        Our team will confirm your order via WhatsApp.
      </p>
      <button
        type="button"
        onClick={() => void handlePlace()}
        disabled={loading || placing}
        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors duration-200 min-h-[54px]"
      >
        {loading || placing ? (
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
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session, status: authStatus } = useAuth()

  const initialMode = (searchParams.get('mode') === 'account' ? 'account' : 'guest') as CheckoutMode

  const [checkoutMode, setCheckoutMode]   = useState<CheckoutMode>(initialMode)
  const [accountPassword, setAccountPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [step, setStep]                 = useState(1)
  const [deliveryId, setDeliveryId]     = useState<DeliveryId>('nairobi-same-day')
  const [paymentId, setPaymentId]       = useState<PaymentId>('mpesa')
  const [orderRef, setOrderRef]         = useState<string | null>(null)
  const [orderCreating, setOrderCreating] = useState(false)
  const [orderError, setOrderError]     = useState('')
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
    reset,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', address: '', city: '', notes: '', marketingOptIn: false },
  })

  const watchedPhone = watch('phone')
  const watchedEmail = watch('email')
  const isLoggedIn = authStatus === 'authenticated' && !!session

  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/account/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { name?: string; email?: string; phone?: string; address?: string; city?: string } | null) => {
        if (!data) return
        reset({
          name: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          notes: '',
          marketingOptIn: false,
        })
      })
      .catch(() => {})
  }, [isLoggedIn, reset])
  // Redirect empty cart away from checkout
  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  async function createCheckoutOrder(method: PaymentId = paymentId): Promise<string | null> {
    if (orderRef) {
      await fetch(`/api/orders/${orderRef}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method }),
      })
      return orderRef
    }

    setOrderCreating(true)
    setOrderError('')
    try {
      const customer = getValues()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryMethod: deliveryId,
          paymentMethod: method,
          subtotal: totalPrice,
          deliveryFee,
          discount: promoDiscount,
          total: orderTotal,
          promoCode: promoCode || undefined,
          checkoutMode: isLoggedIn ? 'account' : checkoutMode,
          accountPassword:
            !isLoggedIn && checkoutMode === 'account' ? accountPassword : undefined,
          customer,
          items: items.map((item) => ({
            productSlug: item.product.slug,
            productName: item.product.name,
            productId: UUID_RE.test(item.product.id) ? item.product.id : undefined,
            quantity: item.quantity,
            unitPrice: (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0),
            variant: item.variant
              ? { id: item.variant.id, name: item.variant.name, value: item.variant.value }
              : undefined,
          })),
        }),
      })
      const data = await res.json() as { reference?: string; error?: string }
      if (!res.ok || !data.reference) {
        throw new Error(data.error ?? 'Could not create your order.')
      }
      setOrderRef(data.reference)
      return data.reference
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Could not create your order.')
      return null
    } finally {
      setOrderCreating(false)
    }
  }

  useEffect(() => {
    if (step === 3 && !orderRef && !orderCreating) {
      void createCheckoutOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (orderRef && step === 3) {
      void fetch(`/api/orders/${orderRef}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: paymentId }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId])

  async function nextStep() {
    if (step === 1) {
      const valid = await trigger(['name', 'email', 'phone', 'address', 'city', 'marketingOptIn'])
      if (!valid) return

      if (!isLoggedIn && checkoutMode === 'account') {
        setPasswordError('')
        if (accountPassword.length < 8) {
          setPasswordError('Password must be at least 8 characters.')
          return
        }
        if (accountPassword !== confirmPassword) {
          setPasswordError('Passwords do not match.')
          return
        }
      }
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
                <div className="flex flex-col gap-6">
                  {/* Checkout mode */}
                  {isLoggedIn ? (
                    <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                      <p className="text-sm text-dark">
                        Checking out as <strong>{session?.user.name}</strong> — order history saved to your account.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <h2 className="font-display text-xl text-dark">How would you like to checkout?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => { setCheckoutMode('guest'); setPasswordError('') }}
                          aria-pressed={checkoutMode === 'guest'}
                          className={cn(
                            'flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-150',
                            checkoutMode === 'guest'
                              ? 'border-primary bg-primary/5'
                              : 'border-dark/10 hover:border-dark/25 bg-white',
                          )}
                        >
                          <User size={20} className={checkoutMode === 'guest' ? 'text-primary' : 'text-dark/50'} />
                          <span className="font-semibold text-sm text-dark">Continue as Guest</span>
                          <span className="text-xs text-dark/55 leading-relaxed">
                            Quick checkout. We&apos;ll use your details for delivery and order updates.
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckoutMode('account')}
                          aria-pressed={checkoutMode === 'account'}
                          className={cn(
                            'flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-150',
                            checkoutMode === 'account'
                              ? 'border-primary bg-primary/5'
                              : 'border-dark/10 hover:border-dark/25 bg-white',
                          )}
                        >
                          <UserPlus size={20} className={checkoutMode === 'account' ? 'text-primary' : 'text-dark/50'} />
                          <span className="font-semibold text-sm text-dark">Create an Account</span>
                          <span className="text-xs text-dark/55 leading-relaxed">
                            Track orders, get promos, organizing tips and early access to sales.
                          </span>
                        </button>
                      </div>
                      {checkoutMode === 'account' && (
                        <p className="text-xs text-dark/50">
                          Already have an account?{' '}
                          <Link href="/login?callbackUrl=/checkout" className="text-primary font-medium hover:underline">
                            Sign in
                          </Link>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-5">
                    <h2 className="font-display text-xl text-dark">Your Contact Details</h2>
                    <p className="text-sm text-dark/55 -mt-2">
                      We use this information to confirm your order, arrange delivery, and follow up if needed.
                    </p>
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

                  {!isLoggedIn && checkoutMode === 'account' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark/8">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-dark">Password</label>
                        <input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          value={accountPassword}
                          onChange={(e) => { setAccountPassword(e.target.value); setPasswordError('') }}
                          placeholder="At least 8 characters"
                          className={inputClass(!!passwordError)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-dark">Confirm Password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }}
                          placeholder="Repeat password"
                          className={inputClass(!!passwordError)}
                        />
                      </div>
                      {passwordError && <p className="sm:col-span-2 text-danger text-xs">{passwordError}</p>}
                    </div>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('marketingOptIn')}
                      className="mt-1 w-4 h-4 rounded border-dark/20 text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-dark/70 leading-relaxed">
                      <Sparkles size={14} className="inline text-primary mr-1 -mt-0.5" />
                      Send me promos, organizing tips and new product updates
                      <span className="block text-xs text-dark/45 mt-0.5">Optional — unsubscribe anytime.</span>
                    </span>
                  </label>
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

                  {orderCreating && (
                    <div className="flex items-center gap-2 text-dark/60 text-sm bg-muted rounded-xl px-4 py-3">
                      <Loader2 size={16} className="animate-spin" />
                      Creating your order…
                    </div>
                  )}

                  {orderError && (
                    <div className="bg-danger/5 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">
                      {orderError}
                      <button
                        type="button"
                        onClick={() => void createCheckoutOrder()}
                        className="block mt-2 underline font-medium"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {orderRef && (
                    <p className="text-dark/50 text-xs font-mono">
                      Order reference: <strong className="text-dark">{orderRef}</strong>
                    </p>
                  )}

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

                  <PaymentTrustBadges className="mt-2" />

                  {/* Payment panels */}
                  {orderRef && paymentId === 'mpesa' && (
                    <div className="mt-4">
                      <MpesaPaymentPanel
                        total={orderTotal}
                        orderRef={orderRef}
                        defaultPhone={watchedPhone}
                        paybillInfo={MPESA_PAYBILL_INFO}
                        onSuccess={clearCart}
                        successRedirect={`/order-confirmation?ref=${orderRef}`}
                      />
                    </div>
                  )}
                  {orderRef && paymentId === 'card' && (
                    <div className="mt-4">
                      <PaystackPaymentPanel
                        total={orderTotal}
                        orderRef={orderRef}
                        email={watchedEmail}
                        onSuccess={clearCart}
                      />
                    </div>
                  )}
                  {paymentId === 'cod' && (
                    <CodPanel
                      total={orderTotal}
                      placing={orderCreating}
                      onPlaceOrder={() => createCheckoutOrder('cod')}
                    />
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
