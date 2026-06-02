'use client'

import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  CALENDAR_INTEGRATION_NOTE,
  getDateAvailability,
  isMonday,
  toIsoDate,
} from '@/lib/booking-availability'
import { SITE_VISIT } from '@/lib/constants'
import { cn } from '@/lib/utils'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

interface BookingCalendarProps {
  value: string
  onChange: (iso: string) => void
}

export default function BookingCalendar({ value, onChange }: BookingCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekCol = mondayIndex(new Date(year, month, 1))

  const prevMonth = useCallback(() => setViewDate(new Date(year, month - 1, 1)), [year, month])
  const nextMonth = useCallback(() => setViewDate(new Date(year, month + 1, 1)), [year, month])

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1)

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekCol).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-dark/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary" aria-hidden="true" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-primary/40" aria-hidden="true" /> Monday (preferred)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-dark/15" aria-hidden="true" /> Unavailable
        </span>
      </div>

      <div className="select-none card-surface border border-dark/8 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
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
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                'text-center text-xs font-medium py-1',
                i >= 5 ? 'text-dark/25' : 'text-dark/45',
              )}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />

            const date = new Date(year, month, day)
            const iso = toIsoDate(date)
            const status = getDateAvailability(date, today)
            const disabled = status !== 'available'
            const selected = value === iso
            const preferredMonday = status === 'available' && isMonday(date)

            let ariaLabel = `${day} ${MONTHS[month]} ${year}`
            if (status === 'weekend') ariaLabel += ', closed (weekend)'
            else if (status === 'booked') ariaLabel += ', already booked'
            else if (status === 'past') ariaLabel += ', past date'
            else if (preferredMonday) ariaLabel += ', preferred site visit day'

            return (
              <div key={day} className="flex items-center justify-center py-0.5">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(iso)}
                  aria-label={ariaLabel}
                  aria-pressed={selected}
                  className={cn(
                    'relative w-10 h-10 rounded-full text-sm font-medium transition-all',
                    status === 'past' && 'text-dark/20 cursor-not-allowed',
                    status === 'weekend' && 'text-dark/20 cursor-not-allowed bg-dark/[0.03]',
                    status === 'booked' && 'text-dark/30 cursor-not-allowed line-through decoration-dark/30',
                    status === 'available' && !selected && 'text-dark hover:bg-cream cursor-pointer',
                    preferredMonday && !selected && 'ring-2 ring-primary/25',
                    selected && 'bg-primary text-white shadow-sm',
                  )}
                >
                  {day}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-dark/55 leading-relaxed text-center max-w-md mx-auto">
        {CALENDAR_INTEGRATION_NOTE} Site visits are mainly on {SITE_VISIT.primaryDays};{' '}
        {SITE_VISIT.closedDays.join(' & ')} closed.
      </p>
    </div>
  )
}
