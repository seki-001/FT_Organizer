'use client'

import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import { COMPANY, SITE_VISIT } from '@/lib/constants'

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-dark/6">
        <h2 className="text-sm font-semibold text-dark">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase text-dark/40 tracking-wide">{label}</p>
      <p className="text-sm text-dark bg-[#FAFAF8] border border-dark/10 rounded-lg px-3 py-2">{value}</p>
    </div>
  )
}

function ToggleRow({ label, sub, on }: { label: string; sub?: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-dark/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-dark">{label}</p>
        {sub && <p className="text-xs text-dark/45 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-10 h-5 rounded-full relative ${on ? 'bg-success' : 'bg-dark/20'}`} aria-hidden>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow ${on ? 'right-0.5' : 'left-0.5'}`} />
      </div>
    </div>
  )
}

export default function AdminSettingsClient() {
  return (
    <AdminModuleFrame title="Settings" subtitle="Business profile, fees, payments, and team (preview)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsCard title="Business profile">
          <div className="flex flex-col gap-3">
            <Field label="Business name" value={COMPANY.name} />
            <Field label="Tagline" value={COMPANY.tagline} />
            <Field label="Phone" value={COMPANY.phone} />
            <Field label="Email" value={COMPANY.email} />
            <Field label="Address" value={COMPANY.address} />
          </div>
        </SettingsCard>

        <SettingsCard title="Service areas">
          <Field label="Primary market" value="Nairobi, Kenya" />
          <Field label="Areas served" value="Westlands, Karen, Kilimani, Runda, South B, Parklands, Lavington, and surrounds" />
          <p className="text-xs text-dark/40 mt-3">Map service zones when location backend is connected.</p>
        </SettingsCard>

        <SettingsCard title="Calendar & site visit">
          <Field label="Site visit fee" value={`KSh ${SITE_VISIT.feeKsh.toLocaleString('en-KE')}`} />
          <Field label="Redemption rule" value={`${SITE_VISIT.redeemablePercent}% of fee redeemable if client retains service`} />
          <Field label="Availability" value={`${SITE_VISIT.primaryDays} · Closed ${SITE_VISIT.closedDays.join(' & ')}`} />
          <Field label="Monday emphasis" value="Primary booking day for new site visits" />
        </SettingsCard>

        <SettingsCard title="Payment methods">
          <Field label="M-Pesa" value="Enabled (preview)" />
          <Field label="Card (Flutterwave)" value="Test mode" />
          <Field label="Cash on delivery" value="Shop orders only" />
          <p className="text-xs text-dark/40 mt-3">Live keys stay in environment variables — not edited here.</p>
        </SettingsCard>

        <SettingsCard title="Delivery rules">
          <Field label="Nairobi delivery" value="2–4 business days" />
          <Field label="Pickup" value="By appointment — Westlands area" />
          <Field label="Returns window" value="7 days unused items" />
        </SettingsCard>

        <SettingsCard title="Users & roles">
          <Field label="Admin users" value="Faith (owner), Operations (preview)" />
          <Field label="Roles" value="Admin · Staff · Read-only (preview)" />
          <p className="text-xs text-dark/40 mt-3">Invite flow at /admin/invite when auth backend is connected.</p>
        </SettingsCard>

        <SettingsCard title="Notifications">
          <ToggleRow label="New booking alert" sub="Email when a booking is submitted" on />
          <ToggleRow label="New order alert" sub="Email when a shop order is placed" on />
          <ToggleRow label="Low stock alert" sub="Email when SKU hits reorder level" on />
          <ToggleRow label="Overdue invoice reminder" sub="Daily summary to admin" on />
          <ToggleRow label="Newsletter signup" on={false} />
        </SettingsCard>

        <SettingsCard title="Social & brand">
          <div className="flex flex-col gap-3">
            <Field label="Instagram" value={COMPANY.instagram} />
            <Field label="Facebook" value={COMPANY.facebook} />
            <Field label="WhatsApp" value={COMPANY.whatsappLink} />
          </div>
        </SettingsCard>
      </div>
    </AdminModuleFrame>
  )
}
