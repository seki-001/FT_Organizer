'use client'

import Link from 'next/link'
import { BarChart3, ArrowRight } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import { REPORT_CATALOG } from '@/lib/admin-business-mock'

const CATEGORY_LABEL: Record<string, string> = {
  sales: 'Sales',
  operations: 'Operations',
  finance: 'Finance',
  inventory: 'Inventory',
  crm: 'Clients & CRM',
}

export default function AdminReportsPage() {
  const categories = Array.from(new Set(REPORT_CATALOG.map((r) => r.category)))

  return (
    <AdminModuleFrame
      title="Reports"
      subtitle="Business reports — preview layouts; connect data sources when ready"
    >
      <Link
        href="/admin/analytics"
        className="flex items-center justify-between gap-4 bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="text-primary" size={24} />
          <div>
            <p className="font-semibold text-dark">Detailed analytics</p>
            <p className="text-sm text-dark/50">Charts with date ranges and breakdowns</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-primary" />
      </Link>

      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dark/40 mb-3">
            {CATEGORY_LABEL[cat] ?? cat}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REPORT_CATALOG.filter((r) => r.category === cat).map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm hover:border-primary/20 transition-colors"
              >
                <p className="font-medium text-dark text-sm">{report.title}</p>
                <p className="text-xs text-dark/45 mt-1">{report.description}</p>
                <p className="text-[10px] text-accent mt-3 font-medium">Preview — export when backend connected</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </AdminModuleFrame>
  )
}
