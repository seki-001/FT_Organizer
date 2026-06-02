'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, ChevronLeft, Truck, Package, Store } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { DELIVERY_OPTIONS, PAYMENT_METHODS } from '@/lib/constants'
import { CheckoutFormSchema, type CheckoutFormValues } from '@/lib/validations'
import { formatPrice, cn } from '@/lib/utils'
import CheckoutStepper from '@/components/checkout/CheckoutStepper'
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard'
import CheckoutDevNotice from '@/components/checkout/CheckoutDevNotice'
import {
  MpesaPanel,
  CardPanel,
  CodPanel,
  PAYMENT_ICONS,
  paymentOptionClass,
} from './_components/PaymentPanels'

type DeliveryId = 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
type PaymentId = 'mpesa' | 'card' | 'cod'

const DELIVERY_DETAIL: Record<DeliveryId, { icon: typeof Truck; tagline: string }> = {
  'nairobi-same-day': { icon: Truck, tagline: 'Delivered today if ordered before 2 pm' },
  'standard-nationwide': { icon: Package, tagline: '2–4 business days nationwide' },
  pickup: { icon: Store, tagline: 'Collect from our Nairobi location' },
}

function generateOrderRef() {
  return 'ORD-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-danger text-xs mt-1" role="alert">
      {message}
    </p>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [deliveryId, setDeliveryId] = useState<DeliveryId>('nairobi-same-day')
  const [paymentId, setPaymentId] = useState<PaymentId>('mpesa')
  const [orderRef] = useState(generateOrderRef)
  const [promoCode, setPromoCode] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [promoValid, setPromoValid] = useState<boolean | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)
  const deliveryFee = deliveryOption?.price ?? 0
  const deliveryLabel = deliveryOption?.label ?? 'Delivery'
  const orderTotal = totalPrice - promoDiscount + deliveryFee

  const {
    register,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', address: '', city: '', notes: '' },
  })

  const watchedPhone = watch('phone')

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items, router])

  async function applyPromoCode() {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoLoading(true)
    setPromoMessage('')
    setPromoValid(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal: totalPrice }),
      })
      const data = (await res.json()) as {
        valid: boolean
        discountValue?: number
        message: string
      }
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
    setPromoInput('')
    setPromoCode('')
    setPromoDiscount(0)
    setPromoMessage('')
    setPromoValid(null)
  }

  async function nextStep() {
    if (step === 1) {
      const valid = await trigger(['name', 'email', 'phone', 'address', 'city'])
      if (!valid) return
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  if (items.length === 0) return null

  const customerName = getValues('name') || 'Customer'
  const customerEmail = getValues('email')
  const panelProps = {
    total: orderTotal,
    orderRef,
    customerName,
    customerEmail,
    deliveryLabel,
    itemCount: totalItems,
  }

  return (
    <main className="bg-surface min-h-screen">
      <div className="section-container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl text-dark mb-2">Checkout</h1>
        <p className="text-sm text-dark/55 mb-8">Reference: {orderRef}</p>

        {/* Mobile summary — collapsible feel via duplicate compact bar */}
        <div className="lg:hidden mb-6 card-surface border border-dark/8 p-4 flex justify-between items-center">
          <span className="text-sm text-dark/60">{totalItems} items</span>
          <span className="font-mono font-bold text-dark">{formatPrice(orderTotal)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="card-surface border border-dark/8 p-6 sm:p-8">
              <CheckoutStepper step={step} />

              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-display text-xl text-dark">Your details</h2>
                    <p className="text-sm text-dark/55 mt-1">
                      We use this for delivery updates and order confirmation.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-dark">
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        {...register('name')}
                        className={cn('input-base', errors.name && 'input-error')}
                      />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-dark">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="07XX XXX XXX"
                        {...register('phone')}
                        className={cn('input-base', errors.phone && 'input-error')}
                      />
                      <FieldError message={errors.phone?.message} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-dark">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        className={cn('input-base', errors.email && 'input-error')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="address" className="text-sm font-medium text-dark">
                        Delivery address
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        autoComplete="street-address"
                        {...register('address')}
                        className={cn('input-base resize-none', errors.address && 'input-error')}
                      />
                      <FieldError message={errors.address?.message} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="city" className="text-sm font-medium text-dark">
                        City / area
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="e.g. Westlands, Karen"
                        {...register('city')}
                        className={cn('input-base', errors.city && 'input-error')}
                      />
                      <FieldError message={errors.city?.message} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="notes" className="text-sm font-medium text-dark">
                        Delivery notes <span className="text-dark/40 font-normal">(optional)</span>
                      </label>
                      <input
                        id="notes"
                        type="text"
                        placeholder="Gate code, landmarks…"
                        {...register('notes')}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="font-display text-xl text-dark">Delivery</h2>
                    <p className="text-sm text-dark/55 mt-1">
                      Choose how you would like to receive your order.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const detail = DELIVERY_DETAIL[opt.id as DeliveryId]
                      const Icon = detail.icon
                      const active = deliveryId === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDeliveryId(opt.id as DeliveryId)}
                          aria-pressed={active}
                          className={paymentOptionClass(active)}
                        >
                          <div
                            className={cn(
                              'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
                              active ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                            )}
                          >
                            <Icon size={18} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between gap-2 flex-wrap">
                              <span
                                className={cn(
                                  'font-medium text-sm',
                                  active ? 'text-primary' : 'text-dark',
                                )}
                              >
                                {opt.label}
                              </span>
                              <span className="font-mono text-sm font-semibold">
                                {opt.price === 0 ? 'Free' : formatPrice(opt.price)}
                              </span>
                            </div>
                            <p className="text-xs text-dark/50 mt-0.5">{detail.tagline}</p>
                            <p className="text-xs text-dark/40 mt-1">{opt.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="font-display text-xl text-dark">Payment</h2>
                    <p className="text-sm text-dark/55 mt-1">
                      Select a method. Orders are not marked paid until payment is verified.
                    </p>
                  </div>
                  <CheckoutDevNotice />
                  <div className="flex flex-col gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = PAYMENT_ICONS[method.id as PaymentId]
                      const active = paymentId === method.id
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentId(method.id as PaymentId)}
                          aria-pressed={active}
                          className={paymentOptionClass(active)}
                        >
                          <div
                            className={cn(
                              'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
                              active ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                            )}
                          >
                            <Icon size={18} aria-hidden="true" />
                          </div>
                          <div className="text-left">
                            <p
                              className={cn(
                                'font-medium text-sm',
                                active ? 'text-primary' : 'text-dark',
                              )}
                            >
                              {method.label}
                            </p>
                            <p className="text-xs text-dark/50">{method.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {paymentId === 'mpesa' && (
                    <MpesaPanel {...panelProps} defaultPhone={watchedPhone} />
                  )}
                  {paymentId === 'card' && <CardPanel {...panelProps} />}
                  {paymentId === 'cod' && <CodPanel {...panelProps} />}
                </div>
              )}

              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark/8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 text-sm font-medium text-dark/60 hover:text-dark min-h-[44px]"
                    >
                      <ChevronLeft size={17} /> Back
                    </button>
                  ) : (
                    <Link
                      href="/cart"
                      className="flex items-center gap-1.5 text-sm font-medium text-dark/60 hover:text-dark"
                    >
                      <ChevronLeft size={17} /> Back to cart
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 min-h-[48px] px-6 rounded-button bg-primary text-white font-semibold hover:bg-danger transition-colors"
                  >
                    Continue <ChevronRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface border border-dark/8 p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-dark">Promo code</p>
              {promoCode ? (
                <div className="flex items-center justify-between bg-success/8 border border-success/20 rounded-button px-3 py-2">
                  <span className="text-sm font-mono font-bold text-success">{promoCode}</span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-xs text-dark/45 hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void applyPromoCode()
                      }
                    }}
                    placeholder="Enter code"
                    className="input-base flex-1 text-sm font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => void applyPromoCode()}
                    disabled={promoLoading || !promoInput.trim()}
                    className="px-4 rounded-button bg-dark text-white text-sm font-medium disabled:opacity-40"
                  >
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoMessage && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    promoValid ? 'text-success' : 'text-danger',
                  )}
                >
                  {promoMessage}
                </p>
              )}
            </div>

            <OrderSummaryCard deliveryFee={deliveryFee} promoDiscount={promoDiscount} />
          </div>
        </div>
      </div>
    </main>
  )
}
