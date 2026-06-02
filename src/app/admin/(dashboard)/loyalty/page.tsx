'use client'

import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import { LOYALTY_TIERS, MOCK_REDEMPTIONS } from '@/lib/admin-business-mock'
import { AdminTableShell } from '@/components/admin/business/AdminListToolbar'

export default function AdminLoyaltyPage() {
  return (
    <AdminModuleFrame title="Loyalty program" subtitle="Tiers, rewards, discounts, and referral benefits (preview)">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LOYALTY_TIERS.map((tier) => (
          <div key={tier.id} className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm">
            <h2 className="font-display text-lg font-bold text-dark">{tier.name}</h2>
            <p className="text-xs text-dark/45 mt-1">{tier.minPoints}+ points · {tier.memberCount} members</p>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-dark/70">
              {tier.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-primary">•</span> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-dark text-sm mt-4">Redemption history</h2>
      <AdminTableShell>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['Client', 'Reward', 'Points', 'Date'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_REDEMPTIONS.map((r) => (
              <tr key={r.id} className="border-b border-dark/5">
                <td className="px-5 py-3 font-medium">{r.clientName}</td>
                <td className="px-5 py-3">{r.reward}</td>
                <td className="px-5 py-3 tabular-nums">{r.points}</td>
                <td className="px-5 py-3 text-xs text-dark/50">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
      <p className="text-xs text-dark/40">Referral bonuses and discount rules connect when loyalty backend is ready.</p>
    </AdminModuleFrame>
  )
}
