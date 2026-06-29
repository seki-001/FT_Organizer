'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ShoppingBag, Calendar, Users, AlertTriangle, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

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

function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub, borderColor }: {
  icon: React.ElementType; iconBg: string; iconColor: string; value: string
  label: string; sub: React.ReactNode; borderColor: string
}) {
  return (
    <div className={`bg-white rounded-2xl border border-dark/8 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        <p className="font-mono text-3xl font-bold text-dark leading-none">{value}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-dark/55 text-sm font-medium">{label}</p>
        {sub}
      </div>
    </div>
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

  // 5 most recent POS sales
  const recentSales = [...sales].slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} iconBg="bg-primary/10" iconColor="text-primary"
          value={formatPrice(revenue)} label="POS Revenue this month" borderColor="border-l-primary"
          sub={revPct !== null
            ? revPct >= 0
              ? <span className="flex items-center gap-1 text-success text-xs font-semibold"><TrendingUp size={11}/>+{revPct}% vs last month</span>
              : <span className="flex items-center gap-1 text-danger text-xs font-semibold"><TrendingDown size={11}/>{revPct}% vs last month</span>
            : <span className="text-dark/35 text-xs">No previous month data</span>}
        />
        <StatCard
          icon={ShoppingBag} iconBg="bg-accent/10" iconColor="text-accent"
          value={String(salesCount)} label="POS Sales this month" borderColor="border-l-accent"
          sub={salesPct !== null
            ? salesPct >= 0
              ? <span className="flex items-center gap-1 text-success text-xs font-semibold"><TrendingUp size={11}/>+{salesPct}% vs last month</span>
              : <span className="flex items-center gap-1 text-danger text-xs font-semibold"><TrendingDown size={11}/>{salesPct}% vs last month</span>
            : <span className="text-dark/35 text-xs">No previous month data</span>}
        />
        <StatCard
          icon={AlertTriangle} iconBg="bg-danger/10" iconColor="text-danger"
          value={formatPrice(totalDebt)} label="Outstanding debt" borderColor="border-l-danger"
          sub={<span className="text-dark/40 text-xs">{debtors} customer{debtors !== 1 ? 's' : ''} with balance</span>}
        />
        <StatCard
          icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600"
          value={String(customers.length)} label="Customers on file" borderColor="border-l-blue-400"
          sub={<span className="text-dark/40 text-xs">Expenses this month: {formatPrice(thisMonthExpenses)}</span>}
        />
      </div>

      {/* Recent POS Sales */}
      <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/6">
          <div>
            <h2 className="font-display text-base font-bold text-dark">Recent POS Sales</h2>
            <p className="text-dark/40 text-xs mt-0.5">Latest transactions from the shop floor</p>
          </div>
          <Link href="/admin/pos" className="flex items-center gap-1 text-primary text-xs font-medium hover:underline">
            Go to POS <ArrowRight size={12} />
          </Link>
        </div>
        {recentSales.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <ShoppingBag size={28} className="text-dark/15 mx-auto mb-2" />
            <p className="text-dark/40 text-sm">No sales yet — record your first sale in POS</p>
            <Link href="/admin/pos" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Open POS <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-dark/5">
            {recentSales.map(sale => (
              <div key={sale.id} className="px-6 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">{sale.customerName || 'Walk-in'}</p>
                  <p className="text-xs text-dark/40 mt-0.5 font-mono">{sale.receiptNo} · {new Date(sale.createdAt).toLocaleDateString('en-KE', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                <span className="text-xs bg-dark/5 text-dark/60 px-2 py-0.5 rounded-full uppercase font-medium flex-shrink-0">{sale.paymentMethod}</span>
                <p className="font-mono font-bold text-dark flex-shrink-0">{formatPrice(sale.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
