'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { AdminBooking } from '@/lib/mock-admin-bookings'
import { SERVICES, resolveServiceSlug } from '@/lib/constants'

interface BookingsCalendarViewProps {
  bookings: AdminBooking[]
  onSelect: (id: string) => void
}

/** Month grid with Monday-first columns; weekends blocked; Mondays highlighted */
export default function BookingsCalendarView({ bookings, onSelect }: BookingsCalendarViewProps) {
  const { year, month, weeks, monthLabel } = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const first = new Date(y, m, 1)
    const last = new Date(y, m + 1, 0)
    const startPad = (first.getDay() + 6) % 7 // Monday = 0
    const days: (Date | null)[] = []
    for (let i = 0; i < startPad; i++) days.push(null)
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d))
    while (days.length % 7 !== 0) days.push(null)
    const weeks: (Date | null)[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    const monthLabel = first.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    return { year: y, month: m, weeks, monthLabel }
  }, [])

  const byDate = useMemo(() => {
    const map = new Map<string, AdminBooking[]>()
    bookings.forEach((b) => {
      const key = b.date.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(b)
    })
    return map
  }, [bookings])

  function dayKey(d: Date) {
    return d.toISOString().slice(0, 10)
  }

  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-dark/6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-dark text-sm">{monthLabel}</h2>
        <p className="text-xs text-dark/45">
          <span className="inline-block w-2 h-2 rounded bg-primary/30 mr-1 align-middle" />
          Monday — preferred site visits · Weekends blocked
        </p>
      </div>
      <div className="grid grid-cols-7 border-b border-dark/6 bg-muted/30">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div
            key={d}
            className={cn(
              'py-2 text-center text-[10px] font-semibold uppercase tracking-wide',
              i === 0 ? 'text-primary' : i >= 5 ? 'text-dark/30' : 'text-dark/45',
            )}
          >
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-dark/5 last:border-0 min-h-[88px]">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="bg-muted/10 border-r border-dark/5 last:border-0" />
            const isWeekend = di >= 5
            const isMonday = di === 0
            const key = dayKey(day)
            const dayBookings = byDate.get(key) ?? []
            const siteVisits = dayBookings.filter((b) => {
              const slug = resolveServiceSlug(b.service)
              return slug.includes('consult') || b.status === 'new' || b.status === 'quoted'
            })

            return (
              <div
                key={key}
                className={cn(
                  'border-r border-dark/5 last:border-0 p-1.5 flex flex-col gap-1',
                  isWeekend && 'bg-dark/[0.03] opacity-60',
                  isMonday && !isWeekend && 'bg-primary/[0.04]',
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                    isMonday && !isWeekend && 'bg-primary/15 text-primary',
                    isWeekend && 'text-dark/25',
                  )}
                >
                  {day.getDate()}
                </span>
                {isWeekend ? (
                  <span className="text-[9px] text-dark/30 text-center mt-auto pb-1">Blocked</span>
                ) : (
                  dayBookings.slice(0, 2).map((b) => {
                    const svc = SERVICES.find((s) => s.slug === resolveServiceSlug(b.service))
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => onSelect(b.id)}
                        className={cn(
                          'text-left text-[9px] leading-tight rounded px-1 py-0.5 truncate w-full',
                          siteVisits.length && b === siteVisits[0]
                            ? 'bg-accent/20 text-dark font-medium'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        {b.name.split(' ')[0]} · {svc?.title?.split(' ')[0] ?? 'Job'}
                      </button>
                    )
                  })
                )}
                {!isWeekend && dayBookings.length > 2 && (
                  <span className="text-[9px] text-dark/40">+{dayBookings.length - 2} more</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
