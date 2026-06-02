'use client'

import { MessageCircle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import { DEMO_FOLLOW_UP } from '@/lib/account-dashboard-data'
import { followUpStatusVariant, formatStatusLabel } from '@/lib/account-status'
import { COMPANY } from '@/lib/constants'

function formatTimelineDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
  })
}

export default function AccountFollowUpTimeline() {
  const sorted = [...DEMO_FOLLOW_UP].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6">
      <AccountSectionHeader
        title="Follow-up timeline"
        subtitle="Reminders and check-ins after your project"
      />

      <ol className="relative border-l border-dark/15 ml-3 space-y-6 pl-6">
        {sorted.map((event) => (
          <li key={event.id} className="relative">
            <span
              className="absolute -left-[1.6rem] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"
              aria-hidden="true"
            />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <p className="text-xs text-dark/45 font-medium">{formatTimelineDate(event.date)}</p>
                <p className="font-medium text-dark text-sm mt-0.5">{event.title}</p>
                <p className="text-xs text-dark/55 mt-1 leading-relaxed">{event.description}</p>
              </div>
              <StatusBadge
                label={formatStatusLabel(event.status)}
                variant={followUpStatusVariant(event.status)}
                className="self-start"
              />
            </div>
          </li>
        ))}
      </ol>

      <a
        href={COMPANY.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
      >
        <MessageCircle size={16} aria-hidden="true" />
        Message us on WhatsApp
      </a>
    </section>
  )
}
