'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Phone, MessageCircle, Mail, MapPin, Clock,
  CheckCircle2, Loader2, Send, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { COMPANY } from '@/lib/constants'
import { ContactFormSchema, type ContactFormValues } from '@/lib/validations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'
import type { Metadata } from 'next'

// ─── Contact form internals ────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  { value: 'general',  label: 'General Enquiry'   },
  { value: 'booking',  label: 'Service Booking'    },
  { value: 'product',  label: 'Product Question'   },
  { value: 'press',    label: 'Press & Media'      },
  { value: 'other',    label: 'Other'              },
]

const iClass =
  'w-full bg-white border-0 rounded-xl px-5 py-4 text-dark text-sm placeholder:text-dark/35 ' +
  'shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all'

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wider text-dark/40 font-medium">
        {label}{required && <span className="text-dark/40 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

function ContactForm() {
  const [submitted,   setSubmitted]   = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ContactFormValues>({ resolver: zodResolver(ContactFormSchema) })

  async function onSubmit(data: ContactFormValues) {
    setServerError('')
    try {
      const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = await res.json() as { success: boolean; error?: string }
      if (json.success) { setSubmitted(true); reset() }
      else setServerError(json.error ?? 'Something went wrong. Please try again.')
    } catch { setServerError('Network error. Please try again.') }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <CheckCircle2 size={48} className="text-green-500" />
        <p className="font-display text-2xl text-dark">Message Sent!</p>
        <p className="text-dark/55 text-sm">We&apos;ll reply within 24 hours.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="text-dark/50 text-sm hover:text-dark hover:underline">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" required error={errors.name?.message}>
          <input {...register('name')} type="text" placeholder="Your full name" className={iClass} autoComplete="name" />
        </Field>
        <Field label="Email Address" required error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="you@example.com" className={iClass} autoComplete="email" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Phone Number" required error={errors.phone?.message}>
          <input {...register('phone')} type="tel" placeholder="07XX XXX XXX" className={iClass} autoComplete="tel" />
        </Field>
        <Field label="Subject" required error={errors.subject?.message}>
          <select {...register('subject')} className={iClass + ' cursor-pointer'} defaultValue="">
            <option value="" disabled>Select a subject…</option>
            {SUBJECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Message" required error={errors.message?.message}>
        <textarea {...register('message')} rows={5} placeholder="Tell us how we can help…" className={iClass + ' resize-none'} />
      </Field>
      {serverError && (
        <p className="text-danger text-sm bg-danger/8 border border-danger/20 px-4 py-3 rounded-xl">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60
                   text-white font-medium py-4 rounded-xl transition-colors text-sm"
      >
        {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send Message</>}
      </button>
    </form>
  )
}

// ─── Contact detail card ──────────────────────────────────────────────────────

function ContactCard({
  icon: Icon, label, value, href,
  iconBg = 'bg-white text-dark/40',
}: {
  icon: React.ElementType; label: string; value: string
  href?: string; iconBg?: string
}) {
  const inner = (
    <div className="bg-muted rounded-2xl p-5 flex items-center gap-4 hover:bg-dark/5 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={17} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-dark/40 font-medium">{label}</p>
        <p className="text-dark font-medium text-sm mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
    : <div>{inner}</div>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { ref: heroRef,  isInView: heroInView  } = useScrollAnimation({ amount: 0.2 })
  const { ref: formRef,  isInView: formInView  } = useScrollAnimation({ amount: 0.08 })

  return (
    <main>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 border-b border-dark/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — headline */}
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, x: -20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE_STANDARD }}
            >
              <h1 className="font-display text-6xl md:text-7xl text-dark leading-none">
                Let&apos;s Talk.
              </h1>
              <p className="text-dark/50 text-lg mt-6 max-w-sm leading-relaxed">
                We&apos;re based in Membley, Nairobi and serve the entire city.
              </p>
            </motion.div>

            {/* Right — contact cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE_STANDARD }}
              className="space-y-3"
            >
              <ContactCard
                icon={Phone}
                label="Call or SMS"
                value={COMPANY.phone}
                href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
              />
              <ContactCard
                icon={MessageCircle}
                label="WhatsApp — Fastest Response"
                value="Chat with us on WhatsApp"
                href={COMPANY.whatsappLink}
                iconBg="bg-green-50 text-green-600"
              />
              <ContactCard
                icon={Mail}
                label="Email"
                value={COMPANY.email}
                href={`mailto:${COMPANY.email}`}
              />
              <ContactCard
                icon={MapPin}
                label="Our Location"
                value="Milestone Business Centre, Membley"
              />
              <ContactCard
                icon={Clock}
                label="Working Hours"
                value="Mon – Sat · 8am – 6pm"
              />

              {/* WhatsApp CTA */}
              <a
                href={COMPANY.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600
                           text-white font-medium py-4 rounded-2xl transition-colors mt-1"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Start a Conversation
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. CONTACT FORM ──────────────────────────────────────────────── */}
      <motion.section
        ref={formRef}
        initial={{ opacity: 0, y: 24 }}
        animate={formInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE_STANDARD }}
        className="py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-muted rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">

              {/* Form */}
              <div>
                <h2 className="font-display text-3xl text-dark mb-8">Send Us a Message</h2>
                <ContactForm />
              </div>

              {/* Free consultation card */}
              <div className="bg-primary rounded-2xl p-8 sm:p-10 text-white lg:w-72 shrink-0">
                <p className="text-xs tracking-widest uppercase text-white/50 font-medium mb-3">
                  No Commitment
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                  Free Consultation
                </h3>
                <p className="text-white/65 mt-4 leading-relaxed text-sm">
                  Not sure what service you need? Book a free 30-minute
                  consultation and we&apos;ll figure it out together.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 bg-white text-primary font-medium
                             px-6 py-3 rounded-xl mt-8 hover:bg-white/90 transition-colors text-sm"
                >
                  Book Now <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 3. MAP ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        <div className="rounded-3xl overflow-hidden h-72 sm:h-80 border border-dark/8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6!2d36.98!3d-1.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTEnMjMuNiJTIDM2wrA1OCc0OC4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Faith The Organizer — Milestone Business Centre, Membley"
          />
        </div>
      </div>

    </main>
  )
}
