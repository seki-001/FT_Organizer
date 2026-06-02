import { Info } from 'lucide-react'
import { ACCOUNT_DEMO_NOTICE } from '@/lib/account-dashboard-data'

export default function AccountDemoNotice() {
  return (
    <div
      className="flex gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-dark/75"
      role="status"
    >
      <Info size={18} className="shrink-0 text-dark/50 mt-0.5" aria-hidden="true" />
      <p>{ACCOUNT_DEMO_NOTICE}</p>
    </div>
  )
}
