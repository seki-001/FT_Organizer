'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'
import {
  loadCheckoutConfirmation,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_MESSAGES,
  type PaymentMethodId,
  type PaymentStatusUi,
} from '@/lib/checkout-ui'

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams()

  const urlRef = searchParams.get('ref') ?? 'N/A'
  const urlName = searchParams.get('name') ?? ''
  const urlPayment = searchParams.get('payment') as PaymentMethodId | null

  const stored = useMemo(() => loadCheckoutConfirmation(), [])

  // Keep session payload for refresh; cleared when a new checkout saves confirmation data.

  const ref = stored?.ref ?? urlRef
  const name = stored?.name ?? urlName
  const paymentMethod: PaymentMethodId =
    stored?.paymentMethod ?? urlPayment ?? 'cod'
  const paymentStatus: PaymentStatusUi =
    stored?.paymentStatus ??
    (paymentMethod === 'cod' ? 'awaiting_delivery' : 'order_received')
  const deliveryLabel = stored?.deliveryLabel ?? 'Delivery'
  const total = stored?.total
  const itemCount = stored?.itemCount

  const recommended = MOCK_PRODUCTS.filter((p) => p.featured && p.inStock).slice(0, 4)

  return (
    <main className="bg-surface">
      <div className="section-container py-12 md:py-16 max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-success" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Order received
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-dark">
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-dark/60 text-sm leading-relaxed max-w-md mx-auto">
              We&apos;ve received your order. Payment is handled as noted below — we never mark
              orders as paid online until verified.
            </p>
          </div>

          <div className="w-full card-surface border border-dark/8 p-6 text-left flex flex-col gap-4">
            <div className="flex flex-wrap justify-between gap-4 pb-4 border-b border-dark/8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">
                  Order reference
                </p>
                <p className="font-mono text-2xl font-bold text-dark">{ref}</p>
              </div>
              {total !== undefined && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1">Total</p>
                  <p className="font-mono text-xl font-bold text-primary">{formatPrice(total)}</p>
                </div>
              )}
            </div>

            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {name && (
                <div>
                  <dt className="text-dark/45 text-xs uppercase tracking-wide mb-0.5">Customer</dt>
                  <dd className="font-medium text-dark">{name}</dd>
                </div>
              )}
              <div>
                <dt className="text-dark/45 text-xs uppercase tracking-wide mb-0.5">
                  Payment method
                </dt>
                <dd className="font-medium text-dark">{PAYMENT_METHOD_LABELS[paymentMethod]}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-dark/45 text-xs uppercase tracking-wide mb-0.5">Status</dt>
                <dd className="text-dark/70 leading-relaxed">
                  {PAYMENT_STATUS_MESSAGES[paymentStatus]}
                </dd>
              </div>
              <div>
                <dt className="text-dark/45 text-xs uppercase tracking-wide mb-0.5">Delivery</dt>
                <dd className="text-dark/70">{deliveryLabel}</dd>
              </div>
              {itemCount !== undefined && (
                <div>
                  <dt className="text-dark/45 text-xs uppercase tracking-wide mb-0.5">Items</dt>
                  <dd className="text-dark/70">{itemCount}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="w-full card-surface border border-dark/8 p-6 text-left">
            <h2 className="font-display text-lg text-dark mb-4">What happens next</h2>
            <ol className="flex flex-col gap-4">
              {[
                'We confirm your order and delivery window on WhatsApp.',
                'Your items are packed — you receive dispatch notification.',
                'Delivery to your door, or pickup from our Nairobi location.',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark/65">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ol>
          </div>

          <div className="w-full flex items-start gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/8 px-4 py-3 text-left">
            <MessageCircle size={20} className="text-[#25D366] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-dark/70 leading-relaxed">
              Questions about your order? Message us on WhatsApp with reference{' '}
              <strong className="font-mono text-dark">{ref}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] rounded-button bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-sm transition-colors"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp support
            </a>
            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] rounded-button border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              Continue shopping
            </Link>
          </div>

          <Link
            href="/account/orders"
            className="text-sm text-dark/50 hover:text-primary transition-colors"
          >
            View order history →
          </Link>
        </div>

        {recommended.length > 0 && (
          <section className="mt-16 pt-10 border-t border-dark/10" aria-labelledby="rec-heading">
            <h2 id="rec-heading" className="font-display text-2xl text-dark mb-6 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
