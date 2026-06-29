'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ShoppingBag, Users, AlertTriangle, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminCard from '@/components/admin/AdminCard'

interface Sale {
  id: string; total: number; createdAt: string; customerName: string; receiptNo: string; paymentMethod: string
  items: { productName: string; category: string; quantity: number; unitPrice: number; total: number }[]
}
interface Customer { id: string; creditBalance: number; name: string }
interface Expense { id: string; amount: number; date: string }

function thisMonthKey() { return new Date().toISOString().slice(0, 7) }
function lastMonthKey() {
  const d = new Date(); d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 7)
}

function loadJSON<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
}

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-dark/35 text-xs">No prior data</span>
  if (pct >= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-success text-xs font-semibold bg-success/8 px-2 py-1 rounded-md">
        <TrendingUp size={11} aria-hidden="true" />+{pct}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-danger text-xs font-semibold bg-danger/8 px-2 py-1 rounded-md">
      <TrendingDown size={11} aria-hidden="true" />{pct}%
    </span>
  )
}

export default function LiveKPICards() {
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    setSales(loadJSON<Sale>('fto_sales'))
    setCustomers(loadJSON<Customer>('fto_customers'))
    setExpenses(loadJSON<Expense>('fto_expenses'))
  }, [])

  const thisMonth = thisMonthKey()
  const lastMonth = lastMonthKey()

  const thisMoSales = sales.filter(s => s.createdAt.startsWith(thisMonth))
  const lastMoSales = sales.filter(s => s.createdAt.startsWith(lastMonth))

  const revenue = thisMoSales.reduce((s, x) => s + x.total, 0)
  const revPrev = lastMoSales.reduce((s, x) => s + x.total, 0)
  const revPct = revPrev > 0 ? Math.round(((revenue - revPrev) / revPrev) * 100) : null

  const salesCount = thisMoSales.length
  const salesCountPrev = lastMoSales.length
  const salesPct = salesCountPrev > 0 ? Math.round(((salesCount - salesCountPrev) / salesCountPrev) * 100) : null

  const totalDebt = customers.reduce((s, c) => s + Math.max(0, c.creditBalance), 0)
  const debtors = customers.filter(c => c.creditBalance > 0).length

  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0)

  const recentSales = [...sales].slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          icon={TrendingUp} iconBg="bg-primary/10" iconColor="text-primary"
          value={formatPrice(revenue)} label="POS revenue this month"
          sub={<TrendBadge pct={revPct} />}
        />
        <AdminStatCard
          icon={ShoppingBag} iconBg="bg-amber-50" iconColor="text-amber-600"
          value={String(salesCount)} label="POS sales this month"
          sub={<TrendBadge pct={salesPct} />}
        />
        <AdminStatCard
          icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-danger"
          value={formatPrice(totalDebt)} label="Outstanding debt"
          sub={<span className="text-dark/40 text-xs">{debtors} with balance</span>}
        />
        <AdminStatCard
          icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600"
          value={String(customers.length)} label="Customers on file"
          sub={<span className="text-dark/40 text-xs">Expenses: {formatPrice(thisMonthExpenses)}</span>}
        />
      </div>

      <AdminCard
        title="Recent POS Sales"
        subtitle="Latest transactions from the shop floor"
        href="/admin/pos"
      >
        {recentSales.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingBag size={28} className="text-dark/15 mx-auto mb-2" />
            <p className="text-dark/45 text-sm">No sales yet — record your first sale in POS</p>
            <Link href="/admin/pos" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Open POS <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#ECEEF2]">
            {recentSales.map(sale => (
              <div key={sale.id} className="px-5 py-3.5 flex items-center gap-4 admin-row-hover transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">{sale.customerName || 'Walk-in'}</p>
                  <p className="text-xs text-dark/40 mt-0.5 font-mono">
                    {sale.receiptNo} · {new Date(sale.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="text-[11px] bg-[#F4F5F7] text-dark/55 px-2 py-0.5 rounded-md uppercase font-medium flex-shrink-0">
                  {sale.paymentMethod}
                </span>
                <p className="font-mono font-semibold text-dark text-sm flex-shrink-0">{formatPrice(sale.total)}</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  )
}
