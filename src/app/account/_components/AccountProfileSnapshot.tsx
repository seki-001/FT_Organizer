'use client'

import Link from 'next/link'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { useSession } from '@/context/AuthContext'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import { DEMO_SAVED_PROFILE } from '@/lib/account-dashboard-data'

export default function AccountProfileSnapshot() {
  const { data: session } = useSession()

  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6">
      <AccountSectionHeader
        title="Saved profile"
        subtitle="Your contact and delivery details"
        href="/account/profile"
        linkLabel="Edit profile"
      />

      <dl className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3 rounded-xl bg-surface border border-dark/8 p-3">
          <User size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <dt className="text-xs text-dark/45 uppercase tracking-wide">Name</dt>
            <dd className="font-medium text-dark mt-0.5">{session?.user.name ?? '—'}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-surface border border-dark/8 p-3">
          <Mail size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <dt className="text-xs text-dark/45 uppercase tracking-wide">Email</dt>
            <dd className="font-medium text-dark mt-0.5 truncate">{session?.user.email ?? '—'}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-surface border border-dark/8 p-3">
          <Phone size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <dt className="text-xs text-dark/45 uppercase tracking-wide">Phone</dt>
            <dd className="font-medium text-dark mt-0.5">{DEMO_SAVED_PROFILE.phone}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-surface border border-dark/8 p-3">
          <MapPin size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <dt className="text-xs text-dark/45 uppercase tracking-wide">Location</dt>
            <dd className="font-medium text-dark mt-0.5">
              {DEMO_SAVED_PROFILE.address}, {DEMO_SAVED_PROFILE.city}
            </dd>
          </div>
        </div>
      </dl>

      <p className="text-[11px] text-dark/40 mt-4">
        Profile saves are preview-only until customer accounts connect to the database.
      </p>
    </section>
  )
}
