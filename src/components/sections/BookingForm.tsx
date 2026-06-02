'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Shield, CheckCircle, Loader2,
} from 'lucide-react'
import { BookingFormSchema, type BookingFormValues } from '@/lib/validations'
import { SERVICES, SERVICE_GROUPS, SITE_VISIT, COMPANY, resolveServiceSlug } from '@/lib/constants'
import { getServiceIcon } from '@/lib/service-icons'
import { formatPrice, cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Service', 'Date', 'Your Details', 'Review']

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house',     label: 'House' },
  { value: 'office',    label: 'Office' },
] as const

const PROPERTY_SIZES = [
  { value: 'small',  label: 'Small',  hint: '1–2 rooms' },
  { value: 'medium', label: 'Medium', hint: '3–4 rooms' },
  { value: 'large',  label: 'Large',  hint: '5+ rooms' },
] as const

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateRef() {
  return Math.random().toString(36).toUpperCase().slice(2, 8)
}

/** Returns 0-indexed col position for a date, with Monday = 0 */
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDisplayDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-8">
      {/* Labels */}
      <div className="flex justify-between mb-3">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={cn(
              'text-xs font-medium hidden sm:block',
              i + 1 <= step ? 'text-primary' : 'text-dark/30'
            )}
          >
            {label}
          </span>
        ))}
      </div>
      {/* Bar */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              i + 1 <= step ? 'bg-primary' : 'bg-dark/10'
            )}
          />
        ))}
      </div>
      {/* Mobile step indicator */}
      <p className="text-xs text-dark/50 mt-2 sm:hidden">
        Step {step} of {STEPS.length} — {STEPS[step - 1]}
      </p>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-danger text-xs mt-1">{message}</p>
}

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string
  options: readonly { value: T; label: string; hint?: string }[]
  value: T | ''
  onChange: (v: T) => void
  error?: string
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-start px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-150 min-h-[44px]',
              value === opt.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-dark/15 text-dark hover:border-dark/30'
            )}
          >
            <span>{opt.label}</span>
            {opt.hint && (
              <span className={cn('text-xs font-normal', value === opt.value ? 'text-dark/60' : 'text-dark/40')}>
                {opt.hint}
              </span>
            )}
          </button>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({
  value,
  onChange,
}: {
  value: string
  onChange: (iso: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const firstWeekCol = mondayIndex(new Date(year, month, 1))

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month])
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month])

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1)

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekCol).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-semibold text-dark text-sm">
          {MONTHS[month]} {year}
        </p>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-dark/40 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />

          const date = new Date(year, month, day)
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const isPast    = date < today
          const disabled  = isWeekend || isPast

          const isoStr  = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const selected = value === isoStr
          const isToday  = isSameDay(date, today)

          return (
            <div key={day} className="flex items-center justify-center py-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(isoStr)}
                aria-label={`${day} ${MONTHS[month]} ${year}${disabled ? ', unavailable' : ''}`}
                aria-pressed={selected}
                className={cn(
                  'w-9 h-9 rounded-full text-sm transition-all duration-150 font-medium',
                  disabled  && 'text-dark/20 cursor-not-allowed',
                  !disabled && !selected && 'text-dark hover:bg-muted cursor-pointer',
                  !disabled && isToday && !selected && 'border border-primary/40 text-primary',
                  selected  && 'bg-primary text-white shadow-sm',
                )}
              >
                {day}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Review row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-dark/5 last:border-b-0">
      <span className="text-dark/50 text-xs uppercase tracking-wide sm:w-40 flex-shrink-0">{label}</span>
      <span className="text-dark text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function BookingForm({ onStepChange }: { onStepChange?: (step: number) => void } = {}) {
  const searchParams = useSearchParams()
  const preselectedSlug = resolveServiceSlug(searchParams.get('service') ?? '')

  const [step, setStep]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      service:      preselectedSlug,
      date:         '',
      name:         '',
      email:        '',
      phone:        '',
      propertyType: undefined,
      propertySize: undefined,
      notes:        '',
    },
  })

  // Keep service pre-selection in sync if URL param changes after mount
  useEffect(() => {
    if (preselectedSlug) setValue('service', preselectedSlug)
  }, [preselectedSlug, setValue])

  const selectedService = watch('service')
  const selectedDate    = watch('date')
  const watchedValues   = watch()

  const serviceObj = SERVICES.find((s) => s.slug === resolveServiceSlug(selectedService))

  // ── Step navigation ──────────────────────────────────────────────────────

  async function nextStep() {
    let valid = false
    if (step === 1) valid = await trigger('service')
    if (step === 2) valid = await trigger('date')
    if (step === 3) valid = await trigger(['name', 'email', 'phone', 'propertyType', 'propertySize'])
    if (valid) {
      const next = Math.min(step + 1, 4)
      setStep(next)
      onStepChange?.(next)
    }
  }

  function prevStep() {
    const prev = Math.max(step - 1, 1)
    setStep(prev)
    onStepChange?.(prev)
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  async function onSubmit(data: BookingFormValues) {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: 'new', createdAt: new Date().toISOString() }),
      })
      const json = await res.json() as { success: boolean; reference: string }
      if (json.success) {
        setBookingRef(json.reference)
        setSubmitted(true)
      }
    } catch {
      // TODO: show toast error
    } finally {
      setLoading(false)
    }
  }

  // ─── Confirmation screen ──────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-12">
        <CheckCircle size={64} className="text-green-500" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl text-dark">Booking Received!</h2>
          <p className="text-dark/60 max-w-sm">
            We&apos;ll send your quote to{' '}
            <span className="font-medium text-dark">{getValues('email')}</span> within
            24 hours.
          </p>
        </div>
        <div className="bg-muted rounded-xl px-8 py-4 text-center">
          <p className="text-dark/50 text-xs uppercase tracking-widest mb-1">Reference</p>
          <p className="font-mono text-2xl font-bold text-dark">{bookingRef}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href={COMPANY.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center justify-center gap-2"
          >
            WhatsApp Us
          </a>
          <Link
            href="/"
            className="border-2 border-dark/20 text-dark hover:border-dark/40 font-medium px-6 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // ─── Form steps ───────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ProgressBar step={step} />

      {/* ── STEP 1 — Select Service ────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark mb-1">
              What service do you need?
            </h2>
            <p className="text-dark/50 text-sm">Select the service you&apos;d like to book.</p>
          </div>

          <div className="flex flex-col gap-8">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-dark/40">{group.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SERVICES.filter((s) => s.groupId === group.id).map((service) => {
                    const Icon = getServiceIcon(service.icon)
                    const checked = selectedService === service.slug
                    return (
                      <button
                        key={service.slug}
                        type="button"
                        onClick={() => setValue('service', service.slug, { shouldValidate: true })}
                        aria-pressed={checked}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 min-h-[44px]',
                          checked
                            ? 'border-primary bg-primary/5'
                            : 'border-dark/10 hover:border-dark/25 bg-white',
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0',
                            checked ? 'bg-primary text-white' : 'bg-muted text-dark/40',
                          )}
                        >
                          <Icon size={18} aria-hidden="true" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className={cn(
                              'font-medium text-sm leading-snug',
                              checked ? 'text-primary' : 'text-dark',
                            )}
                          >
                            {service.title}
                          </span>
                          <span
                            className={cn(
                              'font-mono text-xs',
                              checked ? 'text-primary/70' : 'text-dark/40',
                            )}
                          >
                            From {formatPrice(service.priceFrom)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <FieldError message={errors.service?.message} />
        </div>
      )}

      {/* ── STEP 2 — Pick a Date ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark mb-1">
              When works for you?
            </h2>
            <p className="text-dark/50 text-sm">
              Site visits are mainly on {SITE_VISIT.primaryDays}. {SITE_VISIT.closedDays.join(' and ')}{' '}
              are closed. Serving {SITE_VISIT.serviceArea}.
            </p>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-dark/70 max-w-lg mx-auto w-full text-center">
            Site visit fee: {formatPrice(SITE_VISIT.feeKsh)}. {SITE_VISIT.redeemableNote}
          </div>

          <div className="bg-white rounded-2xl border border-dark/10 p-6 max-w-sm mx-auto w-full">
            <Calendar
              value={selectedDate}
              onChange={(iso) => setValue('date', iso, { shouldValidate: true })}
            />
          </div>

          {selectedDate && (
            <p className="text-center text-sm text-dark/60">
              Selected: <span className="font-medium text-dark">{formatDisplayDate(selectedDate)}</span>
            </p>
          )}
          <FieldError message={errors.date?.message} />

          <p className="text-dark/50 text-xs text-center max-w-sm mx-auto">
            We&apos;ll confirm your exact time slot within 24 hours of booking.
          </p>
        </div>
      )}

      {/* ── STEP 3 — Your Details ─────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark mb-1">
              Tell us about yourself
            </h2>
            <p className="text-dark/50 text-sm">All fields are required unless marked optional.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full name */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium text-dark">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Faith Wanjiku"
                {...register('name')}
                className={cn(
                  'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition',
                  errors.name && 'ring-2 ring-danger/40'
                )}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-dark">Phone Number</label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="07XX XXX XXX"
                {...register('phone')}
                className={cn(
                  'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition',
                  errors.phone && 'ring-2 ring-danger/40'
                )}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-dark">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className={cn(
                  'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition',
                  errors.email && 'ring-2 ring-danger/40'
                )}
              />
              <FieldError message={errors.email?.message} />
            </div>

            {/* Property type */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-dark">Property Type</label>
              <RadioGroup
                name="propertyType"
                options={PROPERTY_TYPES}
                value={watchedValues.propertyType ?? ''}
                onChange={(v) => setValue('propertyType', v, { shouldValidate: true })}
                error={errors.propertyType?.message}
              />
            </div>

            {/* Property size */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-dark">Approximate Size</label>
              <RadioGroup
                name="propertySize"
                options={PROPERTY_SIZES}
                value={watchedValues.propertySize ?? ''}
                onChange={(v) => setValue('propertySize', v, { shouldValidate: true })}
                error={errors.propertySize?.message}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium text-dark">
                Special Notes
                <span className="text-dark/40 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Any specific areas of concern, access instructions, or other details..."
                {...register('notes')}
                className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4 — Review & Confirm ─────────────────────────────────── */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark mb-1">
              Review your booking
            </h2>
            <p className="text-dark/50 text-sm">Check everything looks right before confirming.</p>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-dark/10 px-6 py-2">
            <ReviewRow label="Service"       value={serviceObj?.title ?? watchedValues.service} />
            <ReviewRow label="Date"          value={formatDisplayDate(watchedValues.date)} />
            <ReviewRow label="Name"          value={watchedValues.name} />
            <ReviewRow label="Phone"         value={watchedValues.phone} />
            <ReviewRow label="Email"         value={watchedValues.email} />
            <ReviewRow label="Property type" value={watchedValues.propertyType ?? ''} />
            <ReviewRow label="Size"          value={watchedValues.propertySize ?? ''} />
            {watchedValues.notes && (
              <ReviewRow label="Notes" value={watchedValues.notes} />
            )}
          </div>

          {/* Confidentiality note */}
          <div className="flex items-start gap-3 bg-muted border border-dark/8 rounded-xl px-4 py-3">
            <Shield size={18} className="text-dark/45 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-dark/70 text-xs leading-relaxed">
              Your information is protected by our confidentiality agreement. We never share
              your personal details.
            </p>
          </div>
        </div>
      )}

      {/* ── Navigation buttons ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark/10">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-150 min-h-[44px] px-2"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={step === 1 && !selectedService}
            className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center gap-2"
          >
            Next
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Confirming…
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        )}
      </div>
    </form>
  )
}
