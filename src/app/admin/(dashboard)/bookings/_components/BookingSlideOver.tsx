'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Phone, Mail, MapPin, Calendar, Clock, Home, Building2,
  Briefcase, Loader2, Mail as MailIcon, CheckCircle2,
  ExternalLink, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES, COMPANY, resolveServiceSlug } from '@/lib/constants'
import type { AdminBooking } from '@/lib/mock-admin-bookings'

// ─── Lookups ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: AdminBooking['status']; label: string }[] = [
  { value: 'new',       label: 'New'       },
  { value: 'quoted',    label: 'Quoted'    },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'retained',  label: 'Retained'  },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_META: Record<AdminBooking['status'], { label: string; class: string }> = {
  new:       { label: 'New',       class: 'bg-accent/15 text-amber-700'    },
  quoted:    { label: 'Quoted',    class: 'bg-blue-100 text-blue-700'      },
  confirmed: { label: 'Confirmed', class: 'bg-success/15 text-success'     },
  retained:  { label: 'Retained',  class: 'bg-primary/10 text-primary'     },
  completed: { label: 'Completed', class: 'bg-dark/10 text-dark/60'        },
  cancelled: { label: 'Cancelled', class: 'bg-danger/10 text-danger'       },
}

const PROPERTY_ICONS: Record<string, LucideIcon> = {
  apartment: Building2,
  house:     Home,
  office:    Briefcase,
}

const PROPERTY_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  house:     'House',
  office:    'Office',
}

const SIZE_LABELS: Record<string, string> = {
  small:  'Small (1–2 rooms)',
  medium: 'Medium (3–4 rooms)',
  large:  'Large (5+ rooms)',
}

const TIME_LABELS: Record<string, string> = {
  morning:   'Morning  (8 am – 12 pm)',
  afternoon: 'Afternoon (1 pm – 5 pm)',
  flexible:  'Flexible',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0'))   return `254${digits.slice(1)}`
  if (digits.startsWith('254')) return digits
  return `254${digits}`
}

function buildQuoteWhatsApp(booking: AdminBooking, amount: string): string {
  const service = SERVICES.find(s => s.slug === resolveServiceSlug(booking.service))
  const title   = service?.title ?? booking.service
  const amtText = amount ? `KSh ${Number(amount).toLocaleString('en-KE')}` : '[quote amount]'
  const text    = [
    `Hi ${booking.name},`,
    `Thank you for booking *${title}* with ${COMPANY.name}.`,
    `Here is your quote: *${amtText}*.`,
    `Reply to confirm your appointment.`,
    `— Faith`,
  ].join('\n')
  return `https://wa.me/${normalisePhone(booking.phone)}?text=${encodeURIComponent(text)}`
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-[10px] font-bold text-dark/35 uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-dark/80">
      <Icon size={14} className="text-dark/35 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  booking:        AdminBooking | null
  onClose:        () => void
  onStatusUpdate: (id: string, status: string) => void
  onNotesUpdate:  (id: string, notes: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingSlideOver({ booking, onClose, onStatusUpdate, onNotesUpdate }: Props) {
  const [newStatus,      setNewStatus]      = useState<AdminBooking['status']>('new')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const [internalNotes,  setInternalNotes]  = useState('')
  const [savingNotes,    setSavingNotes]    = useState(false)
  const [notesSaved,     setNotesSaved]     = useState(false)

  const [quoteAmount,    setQuoteAmount]    = useState('')

  const [sendingEmail,   setSendingEmail]   = useState(false)
  const [emailSent,      setEmailSent]      = useState(false)

  // Sync state when booking changes
  useEffect(() => {
    if (booking) {
      setNewStatus(booking.status)
      setInternalNotes(booking.internalNotes ?? '')
      setQuoteAmount(booking.quoteAmount?.toString() ?? '')
      setEmailSent(false)
      setNotesSaved(false)
    }
  }, [booking?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = booking ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [booking])

  // ── Status update ──────────────────────────────────────────────────────────
  const handleStatusUpdate = useCallback(async () => {
    if (!booking || newStatus === booking.status) return
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      onStatusUpdate(booking.id, newStatus)
    } finally {
      setUpdatingStatus(false)
    }
  }, [booking, newStatus, onStatusUpdate])

  // ── Notes save ────────────────────────────────────────────────────────────
  const handleSaveNotes = useCallback(async () => {
    if (!booking) return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/notes`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ notes: internalNotes }),
      })
      if (!res.ok) throw new Error()
      onNotesUpdate(booking.id, internalNotes)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2500)
    } finally {
      setSavingNotes(false)
    }
  }, [booking, internalNotes, onNotesUpdate])

  // ── Confirm email ─────────────────────────────────────────────────────────
  const handleConfirmEmail = useCallback(async () => {
    if (!booking) return
    setSendingEmail(true)
    try {
      await fetch(`/api/admin/bookings/${booking.id}/confirm-email`, { method: 'POST' })
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3500)
    } finally {
      setSendingEmail(false)
    }
  }, [booking])

  // ── Render ────────────────────────────────────────────────────────────────

  const service    = booking ? SERVICES.find(s => s.slug === resolveServiceSlug(booking.service)) : null
  const statusMeta = booking ? STATUS_META[booking.status] : null
  const PropIcon: LucideIcon = booking ? (PROPERTY_ICONS[booking.propertyType] ?? Home) : Home

  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0,      opacity: 1 }}
            exit={{ x: '100%',    opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-label={`Booking details: ${booking.name}`}
            aria-modal="true"
          >
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-dark/8 flex-shrink-0">
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-dark tracking-wider">{booking.id}</p>
                <p className="text-xs text-dark/40 mt-0.5">
                  Submitted {formatShortDate(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {statusMeta && (
                  <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', statusMeta.class)}>
                    {statusMeta.label}
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close booking details"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/40 hover:text-dark hover:bg-muted transition-colors"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* ── Scrollable body ───────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

              {/* Customer */}
              <Section title="Customer">
                <p className="font-semibold text-dark">{booking.name}</p>
                <InfoRow icon={Phone}>
                  <a
                    href={`tel:${booking.phone}`}
                    className="text-primary hover:underline"
                  >
                    {booking.phone}
                  </a>
                </InfoRow>
                <InfoRow icon={Mail}>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {booking.email}
                  </a>
                </InfoRow>
              </Section>

              {/* Service */}
              <Section title="Service Requested">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-dark">{service?.title ?? booking.service}</p>
                  <Link
                    href={`/services/${booking.service}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
                  >
                    View page
                    <ExternalLink size={11} aria-hidden="true" />
                  </Link>
                </div>
                {service && (
                  <p className="text-xs text-dark/50">From KSh {service.priceFrom.toLocaleString('en-KE')}</p>
                )}
              </Section>

              {/* Appointment */}
              <Section title="Appointment">
                <InfoRow icon={Calendar}>
                  {formatFullDate(booking.date)}
                </InfoRow>
                <InfoRow icon={Clock}>
                  {TIME_LABELS[booking.timePreference] ?? booking.timePreference}
                </InfoRow>
              </Section>

              {/* Property */}
              <Section title="Property">
                <InfoRow icon={PropIcon}>
                  {PROPERTY_LABELS[booking.propertyType]} · {SIZE_LABELS[booking.propertySize]}
                </InfoRow>
                <InfoRow icon={MapPin}>
                  {booking.area}
                </InfoRow>
              </Section>

              {/* Customer notes */}
              {booking.notes && (
                <Section title="Customer Notes">
                  <div className="bg-muted/40 rounded-lg px-4 py-3 text-sm text-dark/70 italic leading-relaxed">
                    &ldquo;{booking.notes}&rdquo;
                  </div>
                </Section>
              )}

              {/* Status update */}
              <Section title="Update Status">
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AdminBooking['status'])}
                    className="flex-1 border border-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    aria-label="New booking status"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || newStatus === booking.status}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {updatingStatus && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                    Update
                  </button>
                </div>
              </Section>

              {/* Internal notes */}
              <Section title="Internal Notes (Admin only)">
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add notes visible only to admin (not shown to the customer)…"
                  rows={3}
                  className="w-full border border-dark/15 rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
                />
                <div className="flex items-center justify-between gap-3">
                  {notesSaved ? (
                    <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                      <CheckCircle2 size={12} aria-hidden="true" /> Notes saved
                    </span>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-dark/8 hover:bg-dark/15 text-dark rounded-lg transition-colors disabled:opacity-40"
                  >
                    {savingNotes && <Loader2 size={11} className="animate-spin" aria-hidden="true" />}
                    Save Notes
                  </button>
                </div>
              </Section>

              {/* Quote amount */}
              <Section title="Quote Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/40 font-medium pointer-events-none">
                    KSh
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="Set before sending WhatsApp quote"
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
                  />
                </div>
                <p className="text-xs text-dark/40">Used in the WhatsApp quote message below.</p>
              </Section>

              {/* Action buttons */}
              <Section title="Actions">
                <div className="flex flex-col gap-2.5">

                  {/* WhatsApp quote */}
                  <a
                    href={buildQuoteWhatsApp(booking, quoteAmount)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] rounded-xl text-sm font-medium transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366] flex-shrink-0" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send Quote via WhatsApp
                  </a>

                  {/* Call customer */}
                  <a
                    href={`tel:${booking.phone}`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-dark/5 hover:bg-dark/10 border border-dark/10 text-dark rounded-xl text-sm font-medium transition-colors"
                  >
                    <Phone size={16} className="flex-shrink-0 text-dark/60" aria-hidden="true" />
                    Call Customer
                    <span className="ml-auto text-xs text-dark/40 font-mono">{booking.phone}</span>
                  </a>

                  {/* Confirmation email */}
                  <button
                    type="button"
                    onClick={handleConfirmEmail}
                    disabled={sendingEmail}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 border rounded-xl text-sm font-medium transition-colors',
                      emailSent
                        ? 'bg-success/10 border-success/20 text-success'
                        : 'bg-dark/5 hover:bg-dark/10 border-dark/10 text-dark',
                    )}
                  >
                    {sendingEmail ? (
                      <Loader2 size={16} className="animate-spin flex-shrink-0" aria-hidden="true" />
                    ) : emailSent ? (
                      <CheckCircle2 size={16} className="flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <MailIcon size={16} className="flex-shrink-0 text-dark/60" aria-hidden="true" />
                    )}
                    {emailSent ? 'Confirmation Email Sent!' : 'Send Confirmation Email'}
                  </button>

                </div>
              </Section>

            </div>
            {/* end scrollable body */}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
