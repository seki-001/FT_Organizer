'use client'

import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calendar, Download } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Expense, Purchase } from '@/lib/types'

interface Sale {
  id: string
  total: number
  subtotal: number
  discount: number
  paymentMethod: string
  customerName: string
  createdAt: string
  receiptNo: string
  items: { productName: string; category: string; quantity: number; unitPrice: number; total: number }[]
}

interface Customer { id: string; name: string; creditBalance: number; totalPurchases: number }

const loadJSON = <T,>(key: string): T[] => { try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] } }

function monthLabel(iso: string) {
  const [y, m] = iso.split('-')
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
}

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    setSales(loadJSON<Sale>('fto_sales'))
    setExpenses(loadJSON<Expense>('fto_expenses'))
    setPurchases(loadJSON<Purchase>('fto_purchases'))
    setCustomers(loadJSON<Customer>('fto_customers'))
  }, [])

  const data = useMemo(() => {
    const mSales = sales.filter(s => s.createdAt.startsWith(month))
    const mExpenses = expenses.filter(e => e.date.startsWith(month))
    const mPurchases = purchases.filter(p => p.date.startsWith(month))

    const revenue = mSales.reduce((s, x) => s + x.total, 0)
    const expenseTotal = mExpenses.reduce((s, x) => s + x.amount, 0)
    const purchaseTotal = mPurchases.reduce((s, x) => s + x.total, 0)
    const cogs = purchaseTotal // simplified: purchases = cost of goods
    const grossProfit = revenue - cogs
    const netProfit = grossProfit - expenseTotal
    const totalDebt = customers.reduce((s, c) => s + Math.max(0, c.creditBalance), 0)

    // Top products
    const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
    for (const sale of mSales) {
      for (const item of sale.items) {
        if (!productMap[item.productName]) productMap[item.productName] = { name: item.productName, qty: 0, revenue: 0 }
        productMap[item.productName].qty += item.quantity
        productMap[item.productName].revenue += item.total
      }
    }
    const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10)

    // Sales by payment method
    const paymentMap: Record<string, number> = {}
    for (const s of mSales) {
      paymentMap[s.paymentMethod] = (paymentMap[s.paymentMethod] ?? 0) + s.total
    }

    return {
      revenue, expenseTotal, purchaseTotal, cogs, grossProfit, netProfit,
      totalDebt, topProducts, paymentMap, saleCount: mSales.length,
      debtors: customers.filter(c => c.creditBalance > 0).sort((a, b) => b.creditBalance - a.creditBalance).slice(0, 5),
    }
  }, [sales, expenses, purchases, customers, month])

  function exportCSV() {
    const rows = [
      ['P&L Report — ' + monthLabel(month)],
      [],
      ['Revenue', data.revenue],
      ['Cost of Goods (Purchases)', data.cogs],
      ['Gross Profit', data.grossProfit],
      ['Operating Expenses', data.expenseTotal],
      ['Net Profit', data.netProfit],
      [],
      ['Total Outstanding Debt', data.totalDebt],
      ['Sales Count', data.saleCount],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `FTO-Report-${month}.csv`
    a.click()
  }

  const PAY_LABELS: Record<string, string> = { cash: 'Cash', mpesa: 'M-Pesa', card: 'Card', credit: 'Credit' }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Reports</h1>
          <p className="text-sm text-dark/50 mt-0.5">Profit & Loss, sales, expenses, and debtors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-dark/40" />
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white" />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 border border-dark/15 text-dark text-sm px-4 py-2 rounded-xl hover:bg-muted transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* P&L Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-success/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-success" />
            <p className="text-xs text-dark/40 uppercase tracking-wider">Revenue</p>
          </div>
          <p className="text-3xl font-bold text-success font-mono">{formatPrice(data.revenue)}</p>
          <p className="text-xs text-dark/35 mt-1">{data.saleCount} sale{data.saleCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white border border-danger/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-danger" />
            <p className="text-xs text-dark/40 uppercase tracking-wider">Total Expenses</p>
          </div>
          <p className="text-3xl font-bold text-danger font-mono">{formatPrice(data.expenseTotal)}</p>
          <p className="text-xs text-dark/35 mt-1">Excluding stock purchases</p>
        </div>
        <div className="bg-white border border-accent/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Package size={14} className="text-accent" />
            <p className="text-xs text-dark/40 uppercase tracking-wider">Stock Purchases</p>
          </div>
          <p className="text-3xl font-bold text-accent font-mono">{formatPrice(data.purchaseTotal)}</p>
          <p className="text-xs text-dark/35 mt-1">Cost of goods</p>
        </div>
        <div className={`bg-white border rounded-2xl p-5 ${data.grossProfit >= 0 ? 'border-success/20' : 'border-danger/20'}`}>
          <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Gross Profit</p>
          <p className={`text-3xl font-bold font-mono ${data.grossProfit >= 0 ? 'text-success' : 'text-danger'}`}>{formatPrice(data.grossProfit)}</p>
          <p className="text-xs text-dark/35 mt-1">Revenue − COGS</p>
        </div>
        <div className={`bg-white border rounded-2xl p-5 col-span-2 lg:col-span-2 ${data.netProfit >= 0 ? 'border-success/20' : 'border-danger/20'}`}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className={data.netProfit >= 0 ? 'text-success' : 'text-danger'} />
            <p className="text-xs text-dark/40 uppercase tracking-wider">Net Profit</p>
          </div>
          <p className={`text-4xl font-bold font-mono ${data.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>{formatPrice(data.netProfit)}</p>
          <p className="text-xs text-dark/35 mt-1">Gross Profit − Operating Expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="admin-card p-5">
          <h3 className="font-semibold text-dark mb-4 text-sm">Top Products by Revenue</h3>
          {data.topProducts.length === 0 ? (
            <p className="text-xs text-dark/30 py-4 text-center">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p, i) => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-dark/70 truncate max-w-[60%]"><span className="text-dark/30 mr-1">#{i+1}</span>{p.name}</span>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono font-semibold text-dark">{formatPrice(p.revenue)}</span>
                      <span className="text-dark/30 ml-1">({p.qty} sold)</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/50 rounded-full" style={{width: `${(p.revenue / (data.topProducts[0]?.revenue || 1)) * 100}%`}} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Payment breakdown + Debtors */}
        <div className="space-y-4">
          {/* Sales by payment method */}
          <div className="admin-card p-5">
            <h3 className="font-semibold text-dark mb-4 text-sm">Sales by Payment Method</h3>
            {Object.keys(data.paymentMap).length === 0 ? (
              <p className="text-xs text-dark/30 py-2 text-center">No sales data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(data.paymentMap).sort(([,a],[,b]) => b - a).map(([method, amount]) => (
                  <div key={method} className="flex justify-between items-center">
                    <span className="text-sm text-dark/60">{PAY_LABELS[method] ?? method}</span>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-dark text-sm">{formatPrice(amount)}</span>
                      <span className="text-xs text-dark/30 ml-1">{data.revenue > 0 ? Math.round((amount/data.revenue)*100) : 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top debtors */}
          <div className="bg-white border border-danger/15 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-dark text-sm flex items-center gap-2"><Users size={13} className="text-danger" /> Outstanding Debts</h3>
              <span className="font-mono font-bold text-danger text-sm">{formatPrice(data.totalDebt)}</span>
            </div>
            {data.debtors.length === 0 ? (
              <p className="text-xs text-dark/30 py-2 text-center">No outstanding debts</p>
            ) : (
              <div className="divide-y divide-[#ECEEF2]">
                {data.debtors.map(c => (
                  <div key={c.id} className="py-2 flex justify-between">
                    <span className="text-sm text-dark/70">{c.name}</span>
                    <span className="font-mono font-semibold text-danger text-sm">{formatPrice(c.creditBalance)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* P&L Summary Table */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#ECEEF2]">
          <h3 className="font-semibold text-dark text-sm">Profit & Loss Summary — {monthLabel(month)}</h3>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[#ECEEF2]">
            {[
              { label: 'Revenue (Sales)', value: data.revenue, bold: false, color: 'text-success' },
              { label: 'Less: Cost of Goods Sold', value: -data.cogs, bold: false, color: 'text-danger' },
              { label: 'Gross Profit', value: data.grossProfit, bold: true, color: data.grossProfit >= 0 ? 'text-success' : 'text-danger' },
              { label: 'Less: Operating Expenses', value: -data.expenseTotal, bold: false, color: 'text-danger' },
              { label: 'Net Profit', value: data.netProfit, bold: true, color: data.netProfit >= 0 ? 'text-success' : 'text-danger' },
            ].map(row => (
              <tr key={row.label} className={row.bold ? 'bg-muted/50' : ''}>
                <td className={`px-5 py-3 ${row.bold ? 'font-bold text-dark' : 'text-dark/60'}`}>{row.label}</td>
                <td className={`px-5 py-3 text-right font-mono ${row.bold ? 'font-bold' : 'font-medium'} ${row.color}`}>
                  {row.value < 0 ? `(${formatPrice(-row.value)})` : formatPrice(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
