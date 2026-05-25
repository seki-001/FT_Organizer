'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams()
  const ref  = searchParams.get('ref') ?? 'N/A'

  // Parse a friendly name from the ref if it was passed as ?name=
  const name = searchParams.get('name') ?? ''

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-8">

      {/* Icon */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-50">
        <CheckCircle2 size={56} className="text-green-500" aria-hidden="true" />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-4xl md:text-5xl text-dark">
          Order Confirmed!
        </h1>
        <p className="text-dark/60 text-lg leading-relaxed">
          {name ? `Thank you, ${name}.` : 'Thank you!'} Your order has been received and
          we&apos;re getting it ready.
        </p>
      </div>

      {/* Reference number */}
      <div className="bg-muted rounded-2xl px-10 py-5 text-center w-full max-w-xs">
        <p className="text-dark/50 text-xs uppercase tracking-widest mb-1">Order Reference</p>
        <p className="font-mono text-3xl font-bold text-dark tracking-wider">{ref}</p>
        <p className="text-dark/40 text-xs mt-2">Save this for your records</p>
      </div>

      {/* What happens next */}
      <div className="bg-white border border-dark/8 rounded-2xl p-6 text-left w-full flex flex-col gap-4">
        <h2 className="font-display text-lg text-dark">What happens next?</h2>
        <ul className="flex flex-col gap-3">
          {[
            { step: '1', text: 'You\'ll receive a WhatsApp message from us confirming your order details.' },
            { step: '2', text: 'We\'ll prepare and dispatch your items. You\'ll be notified when it\'s on its way.' },
            { step: '3', text: 'Delivery to your door — or collect from Milestone Business Centre, Membley.' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-dark text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {item.step}
              </span>
              <span className="text-dark/70 text-sm leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* WhatsApp note */}
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-left w-full">
        <MessageCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-green-800 text-sm leading-relaxed">
          We&apos;ll WhatsApp you order updates at the number you provided. You can also reach us
          directly on WhatsApp with any questions.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <a
          href={COMPANY.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 min-h-[44px]"
        >
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp Us
        </a>
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 w-full sm:flex-1 border-2 border-dark/20 text-dark hover:border-primary hover:text-primary font-medium py-3 rounded-lg transition-all duration-200 min-h-[44px]"
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="flex items-center justify-center w-full sm:flex-1 text-dark/60 hover:text-primary text-sm font-medium transition-colors duration-150 min-h-[44px]"
        >
          View Your Orders →
        </Link>
      </div>

    </div>
  )
}
