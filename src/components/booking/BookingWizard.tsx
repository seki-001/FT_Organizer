'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Upload,
  Plane,
} from 'lucide-react'
import { BookingFormSchema, type BookingFormValues } from '@/lib/validations'
import {
  SERVICES,
  SERVICE_GROUPS,
  SITE_VISIT,
  COMPANY,
  resolveServiceSlug,
} from '@/lib/constants'
import { getServiceIcon } from '@/lib/service-icons'
import { formatPrice, cn } from '@/lib/utils'
import BookingCalendar from './BookingCalendar'
import { getDateAvailability } from '@/lib/booking-availability'

const STEPS = [
  'Select service',
  'Site visit date',
  'Your details',
  'Review fee',
  'Confirm',
] as const

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'office', label: 'Office' },
] as const

const PROPERTY_SIZES = [
  { value: 'small', label: 'Small', hint: '1–2 rooms' },
  { value: 'medium', label: 'Medium', hint: '3–4 rooms' },
  { value: 'large', label: 'Large', hint: '5+ rooms' },
] as const

const inputClass =
  'input-base w-full bg-surface border-dark/12 text-sm text-dark placeholder:text-dark/35'

function formatDisplayDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-8">
      <div className="hidden sm:flex justify-between gap-1 mb-3">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={cn(
              'text-[10px] font-medium uppercase tracking-wide flex-1 text-center',
              i + 1 <= step ? 'text-primary' : 'text-dark/30',
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i + 1 <= step ? 'bg-primary' : 'bg-dark/10',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-dark/50 mt-2 sm:hidden">
        Step {step} of {STEPS.length}: {STEPS[step - 1]}
      </p>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-danger text-xs mt-1" role="alert">{message}</p>
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-dark/5 last:border-0">
      <span className="text-dark/50 text-xs uppercase tracking-wide sm:w-36 shrink-0">{label}</span>
      <span className="text-dark text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

interface BookingWizardProps {
  onStepChange?: (step: number) => void
}

export default function BookingWizard({ onStepChange }: BookingWizardProps) {
  const searchParams = useSearchParams()
  const preselectedSlug = resolveServiceSlug(searchParams.get('service') ?? '')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
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
      service: preselectedSlug,
      date: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      city: '',
      country: 'Kenya',
      propertyType: undefined,
      propertySize: undefined,
      notes: '',
    },
  })

  useEffect(() => {
    if (preselectedSlug) setValue('service', preselectedSlug)
  }, [preselectedSlug, setValue])

  const selectedService = watch('service')
  const selectedDate = watch('date')
  const watched = watch()

  const serviceObj = SERVICES.find((s) => s.slug === resolveServiceSlug(selectedService))
  const isRelocation = selectedService === 'relocation-transition'

  function goTo(next: number) {
    setStep(next)
    onStepChange?.(next)
    setSubmitError('')
  }

  async function nextStep() {
    let valid = false
    if (step === 1) valid = await trigger('service')
    if (step === 2) {
      valid = await trigger('date')
      if (valid && selectedDate) {
        const d = new Date(selectedDate + 'T12:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const status = getDateAvailability(d, today)
        if (status !== 'available') {
          setValue('date', '', { shouldValidate: true })
          valid = false
        }
      }
    }
    if (step === 3) {
      valid = await trigger([
        'name',
        'email',
        'phone',
        'location',
        'city',
        'country',
        'propertyType',
        'propertySize',
      ])
    }
    if (step === 4) valid = true
    if (valid) goTo(Math.min(step + 1, 5))
  }

  function prevStep() {
    goTo(Math.max(step - 1, 1))
  }

  async function onSubmit(data: BookingFormValues) {
    setLoading(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'new',
          createdAt: new Date().toISOString(),
        }),
      })
      const json = (await res.json()) as {
        success: boolean
        reference?: string
        error?: string
      }
      if (!res.ok || !json.success) {
        setSubmitError(json.error ?? 'Could not submit your booking. Please try again.')
        return
      }
      setBookingRef(json.reference ?? '')
      setSubmitted(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-10">
        <CheckCircle size={56} className="text-success" aria-hidden="true" />
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl text-dark">Site visit requested</h2>
          <p className="text-dark/60 max-w-md leading-relaxed">
            Thank you. We will confirm your site visit date within 24 hours and send details to{' '}
            <span className="font-medium text-dark">{getValues('email')}</span>.
          </p>
        </div>
        <div className="card-surface border border-dark/8 px-8 py-4">
          <p className="text-dark/50 text-xs uppercase tracking-widest mb-1">Reference</p>
          <p className="font-mono text-2xl font-bold text-dark">{bookingRef}</p>
        </div>
        <p className="text-sm text-dark/55 max-w-sm">
          Site visit fee: {formatPrice(SITE_VISIT.feeKsh)}. {SITE_VISIT.redeemableNote}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={COMPANY.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#25D366] text-white font-semibold px-6 min-h-[48px] rounded-button"
          >
            WhatsApp us
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center border-2 border-dark/15 px-6 min-h-[48px] rounded-button font-medium text-dark"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ProgressBar step={step} />

      {submitError && step === 5 ? (
        <div
          className="mb-6 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          {submitError}
        </div>
      ) : null}

      {/* Step 1 — Service */}
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark">Select your service</h2>
            <p className="text-dark/55 text-sm mt-2">
              Serving {SITE_VISIT.serviceArea}. All bookings start with an on-site visit.
            </p>
          </div>

          {!selectedService && (
            <p className="text-sm text-dark/45 italic border border-dashed border-dark/15 rounded-lg px-4 py-3 text-center">
              Choose a service to continue
            </p>
          )}

          {isRelocation && (
            <div className="flex gap-3 rounded-lg border border-primary/15 bg-cream px-4 py-3 text-sm text-dark/70">
              <Plane size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p>{SITE_VISIT.diasporaNote}</p>
            </div>
          )}

          <div className="flex flex-col gap-8">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="text-xs font-semibold uppercase tracking-widest text-dark/40 mb-3">
                  {group.label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          'flex items-start gap-3 p-4 rounded-card border-2 text-left transition-all min-h-[44px]',
                          checked
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-dark/10 hover:border-dark/20 bg-white',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                            checked ? 'bg-primary text-white' : 'bg-muted text-dark/45',
                          )}
                        >
                          <Icon size={18} aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn('font-medium text-sm leading-snug', checked && 'text-primary')}>
                            {service.title}
                          </p>
                          <p className="text-xs text-dark/50 mt-1 line-clamp-2">{service.description}</p>
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

      {/* Step 2 — Site visit date */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark">Choose site visit date</h2>
            <p className="text-dark/55 text-sm mt-2">
              On-site assessment · {formatPrice(SITE_VISIT.feeKsh)} · mainly {SITE_VISIT.primaryDays}
            </p>
          </div>

          <div className="rounded-card border border-primary/15 bg-cream px-4 py-3 text-sm text-dark/70">
            <p className="font-medium text-dark flex items-center gap-2">
              <Calendar size={16} className="text-primary" aria-hidden="true" />
              Book Site Visit
            </p>
            <p className="mt-1">{SITE_VISIT.redeemableNote}</p>
          </div>

          <BookingCalendar
            value={selectedDate}
            onChange={(iso) => setValue('date', iso, { shouldValidate: true })}
          />

          {selectedDate ? (
            <p className="text-center text-sm">
              <span className="text-dark/50">Preferred date: </span>
              <span className="font-medium text-dark">{formatDisplayDate(selectedDate)}</span>
            </p>
          ) : (
            <p className="text-center text-sm text-dark/40">No date selected yet</p>
          )}
          <FieldError message={errors.date?.message} />
        </div>
      )}

      {/* Step 3 — Details */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark">Your details</h2>
            <p className="text-dark/55 text-sm mt-2">
              We use this to confirm your site visit across {SITE_VISIT.serviceArea}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-dark">Full name</label>
              <input id="name" type="text" autoComplete="name" className={cn(inputClass, errors.name && 'border-danger')} {...register('name')} />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-dark">Phone</label>
              <input id="phone" type="tel" autoComplete="tel" className={cn(inputClass, errors.phone && 'border-danger')} {...register('phone')} />
              <FieldError message={errors.phone?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-dark">Email</label>
              <input id="email" type="email" autoComplete="email" className={cn(inputClass, errors.email && 'border-danger')} {...register('email')} />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-medium text-dark">Location / address</label>
              <input id="location" type="text" placeholder="Estate, street, building" className={cn(inputClass, errors.location && 'border-danger')} {...register('location')} />
              <FieldError message={errors.location?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-medium text-dark">City</label>
              <input id="city" type="text" className={cn(inputClass, errors.city && 'border-danger')} {...register('city')} />
              <FieldError message={errors.city?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-medium text-dark">Country</label>
              <input id="country" type="text" className={cn(inputClass, errors.country && 'border-danger')} {...register('country')} />
              <FieldError message={errors.country?.message} />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark">Property type</label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('propertyType', opt.value, { shouldValidate: true })}
                    className={cn(
                      'px-4 py-2.5 rounded-button border-2 text-sm font-medium min-h-[44px]',
                      watched.propertyType === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-dark/12 text-dark',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <FieldError message={errors.propertyType?.message} />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark">Property size</label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_SIZES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('propertySize', opt.value, { shouldValidate: true })}
                    className={cn(
                      'flex flex-col items-start px-4 py-2.5 rounded-button border-2 text-sm min-h-[44px]',
                      watched.propertySize === opt.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-dark/12 text-dark',
                    )}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-xs opacity-70">{opt.hint}</span>
                  </button>
                ))}
              </div>
              <FieldError message={errors.propertySize?.message} />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-dark">
                Notes <span className="text-dark/40 font-normal">(optional)</span>
              </label>
              <textarea id="notes" rows={3} className={cn(inputClass, 'resize-none')} {...register('notes')} />
            </div>

            <div className="sm:col-span-2">
              <div className="rounded-card border border-dashed border-dark/15 bg-muted/50 px-4 py-6 flex flex-col items-center gap-2 text-center">
                <Upload size={22} className="text-dark/30" aria-hidden="true" />
                <p className="text-sm font-medium text-dark/50">Photo upload</p>
                <p className="text-xs text-dark/40 max-w-xs">
                  Coming soon — share photos via WhatsApp after booking if helpful for your space.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Review fee */}
      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark">Review site visit fee</h2>
            <p className="text-dark/55 text-sm mt-2">Transparent pricing before you confirm.</p>
          </div>

          <div className="card-surface border border-dark/8 p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 border-b border-dark/8 pb-4">
              <span className="text-dark/60 text-sm">Site visit fee</span>
              <span className="font-mono text-2xl font-bold text-primary">
                {formatPrice(SITE_VISIT.feeKsh)}
              </span>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-dark/65">
              <li className="flex gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                {SITE_VISIT.serviceArea} — travel confirmed after booking
              </li>
              <li>Mainly {SITE_VISIT.primaryDays}; weekends closed</li>
              <li>{SITE_VISIT.redeemableNote}</li>
            </ul>
            {serviceObj && (
              <p className="text-sm text-dark/55 pt-2 border-t border-dark/8">
                Service: <span className="font-medium text-dark">{serviceObj.title}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 5 — Confirm */}
      {step === 5 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-dark">Confirm booking</h2>
            <p className="text-dark/55 text-sm mt-2">Review everything, then submit your site visit request.</p>
          </div>

          <div className="card-surface border border-dark/8 px-5 py-2">
            <ReviewRow label="Service" value={serviceObj?.title ?? watched.service} />
            <ReviewRow label="Preferred date" value={formatDisplayDate(watched.date)} />
            <ReviewRow label="Name" value={watched.name} />
            <ReviewRow label="Phone" value={watched.phone} />
            <ReviewRow label="Email" value={watched.email} />
            <ReviewRow label="Location" value={`${watched.location}, ${watched.city}, ${watched.country}`} />
            <ReviewRow label="Property" value={`${watched.propertyType ?? ''} · ${watched.propertySize ?? ''}`} />
            <ReviewRow label="Site visit fee" value={formatPrice(SITE_VISIT.feeKsh)} />
            {watched.notes ? <ReviewRow label="Notes" value={watched.notes} /> : null}
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-cream border border-dark/8 px-4 py-3">
            <Shield size={18} className="text-dark/45 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-dark/60 leading-relaxed">
              Your information is confidential. This request does not charge online — we confirm
              visit details and fee payment separately.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark/10">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 text-sm font-medium text-dark/60 hover:text-dark min-h-[44px]"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={(step === 1 && !selectedService) || (step === 2 && !selectedDate)}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 min-h-[48px] rounded-button hover:bg-danger disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 min-h-[48px] rounded-button hover:bg-danger disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting…
              </>
            ) : (
              'Confirm site visit'
            )}
          </button>
        )}
      </div>
    </form>
  )
}
