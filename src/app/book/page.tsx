'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Shield, Phone, MessageCircle, MapPin, Loader2 } from 'lucide-react'
import BookingForm from '@/components/sections/BookingForm'
import { COMPANY, SITE_VISIT } from '@/lib/constants'
import { formatPrice, cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Select service', hint: 'Choose from 9 services' },
  { n: 2, label: 'Site visit date', hint: 'Mondays preferred · weekends closed' },
  { n: 3, label: 'Your details', hint: 'Contact & location' },
  { n: 4, label: 'Review fee', hint: formatPrice(SITE_VISIT.feeKsh) + ' site visit' },
  { n: 5, label: 'Confirm', hint: 'Submit your request' },
] as const

function VerticalStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-dark/10" aria-hidden="true" />
      <ol className="relative space-y-6">
        {STEPS.map(({ n, label, hint }) => {
          const done = n < currentStep
          const current = n === currentStep
          const future = n > currentStep
          return (
            <li key={n} className="flex items-start gap-4">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 z-10',
                  done && 'bg-primary text-white',
                  current && 'bg-white border-2 border-primary text-primary',
                  future && 'bg-muted text-dark/30 border border-dark/10',
                )}
              >
                {done ? '✓' : n}
              </div>
              <div className="pt-1">
                <p className={cn('text-sm font-medium', current ? 'text-dark' : done ? 'text-dark/60' : 'text-dark/30')}>
                  {label}
                </p>
                {current && <p className="text-xs text-dark/45 mt-1">{hint}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-dark/35">
      <Loader2 size={28} className="animate-spin" />
      <p className="text-sm">Loading booking…</p>
    </div>
  )
}

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <main className="bg-surface min-h-screen">
      <div className="section-container py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                  {SITE_VISIT.serviceArea}
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-dark leading-tight">
                  Book Site Visit
                </h1>
                <p className="text-dark/60 text-sm mt-4 leading-relaxed">
                  {formatPrice(SITE_VISIT.feeKsh)} on-site assessment. {SITE_VISIT.redeemablePercent}%
                  redeemable if you retain us. Mainly {SITE_VISIT.primaryDays}; weekends closed.
                </p>
              </div>

              <VerticalStepper currentStep={currentStep} />

              <div className="card-surface border border-dark/8 p-5 space-y-3 text-sm text-dark/65">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  Based in Nairobi · projects across East Africa
                </p>
                <p className="text-xs text-dark/50 leading-relaxed">
                  {SITE_VISIT.diasporaNote}
                </p>
              </div>

              <div className="card-surface border border-dark/8 p-5">
                <Shield size={20} className="text-dark/45 mb-2" aria-hidden="true" />
                <p className="font-display font-semibold text-dark">Confidentiality</p>
                <p className="text-dark/55 text-sm mt-1 leading-relaxed">
                  Signed on every engagement. Your details stay private.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] uppercase tracking-widest text-dark/35 font-medium">Questions?</p>
                <a
                  href={COMPANY.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark"
                >
                  <MessageCircle size={15} className="text-[#25D366]" />
                  WhatsApp
                </a>
                <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark">
                  <Phone size={15} />
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="card-surface border border-dark/8 p-6 sm:p-8 md:p-10">
              <Suspense fallback={<FormSkeleton />}>
                <BookingForm onStepChange={setCurrentStep} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
