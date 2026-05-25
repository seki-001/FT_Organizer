'use client'

import { useState, Suspense } from 'react'
import { Shield, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import BookingForm from '@/components/sections/BookingForm'
import { COMPANY } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Choose Service',   hint: 'Pick from 11 services'     },
  { n: 2, label: 'Select a Date',    hint: 'Choose a convenient date'  },
  { n: 3, label: 'Your Details',     hint: 'Name, email & phone'       },
  { n: 4, label: 'Review & Confirm', hint: 'Double-check everything'   },
]

// ─── Vertical stepper ─────────────────────────────────────────────────────────

function VerticalStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-dark/10" aria-hidden="true" />

      <div className="relative space-y-6">
        {STEPS.map(({ n, label, hint }) => {
          const done    = n < currentStep
          const current = n === currentStep
          const future  = n > currentStep

          return (
            <div key={n} className="flex items-start gap-4">
              {/* Circle indicator */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 relative z-10 transition-colors',
                done    && 'bg-primary text-white',
                current && 'bg-white border-2 border-primary text-primary',
                future  && 'bg-dark/8 text-dark/30 border border-dark/15'
              )}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : n}
              </div>

              {/* Labels */}
              <div className="pt-1">
                <p className={cn(
                  'text-sm font-medium leading-none',
                  current ? 'text-dark' : done ? 'text-dark/60' : 'text-dark/30'
                )}>
                  {label}
                </p>
                {current && (
                  <p className="text-xs text-dark/40 mt-1">{hint}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function FormSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-dark/35">
      <Loader2 size={28} className="animate-spin" />
      <p className="text-sm">Loading booking form…</p>
    </div>
  )
}

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">

              {/* Title + Stepper */}
              <div>
                <h1 className="font-display text-3xl text-dark mb-8">Book a Service</h1>
                <VerticalStepper currentStep={currentStep} />
              </div>

              {/* Confidentiality card */}
              <div className="bg-muted border border-dark/8 rounded-2xl p-6">
                <Shield size={22} className="text-dark/45 mb-3" aria-hidden="true" />
                <p className="font-display text-base text-dark leading-snug">
                  Confidentiality Agreement
                </p>
                <p className="text-dark/55 text-sm mt-2 leading-relaxed">
                  Signed on every job. Your information stays private — no exceptions.
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] uppercase tracking-widest text-dark/30 font-medium">
                  Questions? Contact Us
                </p>
                <a
                  href={COMPANY.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-dark/60 hover:text-dark transition-colors"
                >
                  <MessageCircle size={15} className="text-green-500 shrink-0" />
                  WhatsApp — fastest response
                </a>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm text-dark/60 hover:text-dark transition-colors"
                >
                  <Phone size={15} className="text-dark/45 shrink-0" />
                  {COMPANY.phone}
                </a>
              </div>

            </div>
          </aside>

          {/* ── Form ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-dark/8 shadow-sm p-6 sm:p-10">
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
