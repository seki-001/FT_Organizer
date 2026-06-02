import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, LayoutDashboard, ArrowRight } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminDemoNotice from '@/components/admin/AdminDemoNotice'

export const metadata: Metadata = { title: 'Reports | FTO Admin' }

const REPORT_LINKS = [
  {
    title: 'Executive dashboard',
    description: 'KPIs, charts, and operational panels',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Detailed analytics',
    description: 'Date ranges, category breakdowns, and activity',
    href: '/admin/analytics',
    icon: BarChart3,
  },
]

export default function AdminReportsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <AdminDemoNotice />
      <AdminPageHeader
        title="Reports"
        subtitle="Choose a report view. All figures on linked pages use preview data until your backend is connected."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPORT_LINKS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={22} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-dark group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-dark/50 mt-1">{item.description}</p>
              </div>
              <span className="text-primary text-sm font-medium flex items-center gap-1 mt-auto">
                Open <ArrowRight size={14} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
