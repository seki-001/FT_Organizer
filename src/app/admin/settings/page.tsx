import type { Metadata } from 'next'
import AdminPageHeader   from '@/components/admin/AdminPageHeader'
import { COMPANY }       from '@/lib/constants'

export const metadata: Metadata = { title: 'Settings | FTO Admin' }

// ─── Sub-components (Server-renderable — no interactivity yet) ────────────────

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-dark/8">
        <h2 className="font-semibold text-dark text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-dark/50 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-dark bg-muted px-4 py-2.5 rounded-lg border border-dark/8">
        {value}
      </p>
    </div>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={`w-10 h-5 rounded-full relative flex-shrink-0 ${on ? 'bg-success' : 'bg-dark/20'}`}
      aria-hidden="true"
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${on ? 'right-0.5' : 'left-0.5'}`}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">

      <AdminPageHeader
        title="Settings"
        subtitle="Business information and store configuration"
      />

      {/* TODO: Wrap these cards in a react-hook-form <form> with server action to make them editable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">

        {/* Business Information */}
        <SettingsCard title="Business Information">
          <div className="flex flex-col gap-4">
            <ReadonlyField label="Business Name"  value={COMPANY.name} />
            <ReadonlyField label="Tagline"         value={COMPANY.tagline} />
            <ReadonlyField label="Phone"           value={COMPANY.phone} />
            <ReadonlyField label="Primary Email"   value={COMPANY.email} />
            <ReadonlyField label="Address"         value={COMPANY.address} />
          </div>
        </SettingsCard>

        {/* Social Media */}
        <SettingsCard title="Social Media">
          <div className="flex flex-col gap-4">
            <ReadonlyField label="Instagram"    value={COMPANY.instagram} />
            <ReadonlyField label="Facebook"     value={COMPANY.facebook} />
            <ReadonlyField label="YouTube"      value={COMPANY.youtube} />
            <ReadonlyField label="WhatsApp URL" value={COMPANY.whatsappLink} />
          </div>
        </SettingsCard>

        {/* Payment Settings */}
        <SettingsCard title="Payment Settings">
          <div className="flex flex-col gap-4">
            <ReadonlyField label="M-Pesa Mode"       value="Daraja (Paybill / Till)" />
            <ReadonlyField label="Card Payments"     value="Paystack" />
            <p className="text-dark/40 text-xs leading-relaxed">
              Payment gateway keys are managed via environment variables.
              See{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">
                .env.local
              </code>
              {' '}and{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">
                .env.local.example
              </code>.
            </p>
          </div>
        </SettingsCard>

        {/* Email Notifications */}
        <SettingsCard title="Email Notifications">
          <div className="flex flex-col gap-1">
            {[
              {
                label: 'New Booking Alert',
                sub:   'Email when a new booking is submitted',
                on:    true,
              },
              {
                label: 'New Order Alert',
                sub:   'Email when a new order is placed',
                on:    true,
              },
              {
                label: 'Newsletter Signup',
                sub:   'Email when someone subscribes to the newsletter',
                on:    false,
              },
              {
                label: 'Contact Form Reply',
                sub:   'Email when a contact form message is received',
                on:    true,
              },
            ].map(({ label, sub, on }, i, arr) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-dark/5' : ''}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark">{label}</p>
                  <p className="text-dark/40 text-xs mt-0.5">{sub}</p>
                </div>
                <Toggle on={on} />
              </div>
            ))}

            <p className="text-dark/35 text-xs mt-3 pt-3 border-t border-dark/5">
              {/* TODO: Connect to Resend — set RESEND_API_KEY in .env.local */}
              Email delivery powered by Resend. Configure{' '}
              <code className="bg-muted px-1 py-0.5 rounded font-mono text-[10px]">
                RESEND_API_KEY
              </code>{' '}
              to activate.
            </p>
          </div>
        </SettingsCard>

      </div>
    </div>
  )
}
