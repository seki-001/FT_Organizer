'use client'

import { useState, useEffect } from 'react'
import { Plus, X, TrendingDown, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Expense, ExpenseCategory, PaymentMethod } from '@/lib/types'

const KEY = 'fto_expenses'
const load = (): Expense[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } }
const save = (d: Expense[]) => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} }

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'rent', label: 'Rent' },
  { value: 'utilities', label: 'Utilities (Water, Power, Internet)' },
  { value: 'salaries', label: 'Salaries & Wages' },
  { value: 'stock-purchase', label: 'Stock Purchase' },
  { value: 'transport', label: 'Transport & Delivery' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'packaging', label: 'Packaging Materials' },
  { value: 'equipment', label: 'Equipment & Tools' },
  { value: 'other', label: 'Other' },
]
const PAYMENT: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'card', label: 'Card' },
]

const BLANK = { description: '', category: 'other' as ExpenseCategory, amount: '', paymentMethod: 'cash' as PaymentMethod, date: new Date().toISOString().slice(0,10), note: '' }

export default function ExpensesPage() {
  const [list, setList] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0,7))

  useEffect(() => setList(load()), [])

  const filtered = list.filter(e => e.date.startsWith(filterMonth))
  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const byCategory = CATEGORIES.map(c => ({
    ...c,
    total: filtered.filter(e => e.category === c.value).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.total > 0).sort((a,b) => b.total - a.total)

  function add() {
    if (!form.description.trim() || !form.amount) return alert('Description and amount are required')
    const amt = parseFloat(form.amount); if (!amt || amt <= 0) return alert('Enter a valid amount')
    const e: Expense = { id: Date.now().toString(), description: form.description, category: form.category, amount: amt,
      paymentMethod: form.paymentMethod, date: form.date, createdAt: new Date().toISOString(), note: form.note }
    const updated = [e, ...list]; setList(updated); save(updated)
    setForm({ ...BLANK, date: form.date }); setShowForm(false)
  }

  function del(id: string) {
    if (!confirm('Delete this expense?')) return
    const updated = list.filter(e => e.id !== id); setList(updated); save(updated)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Expenses</h1>
          <p className="text-sm text-dark/50 mt-0.5">Record all business expenses</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Record Expense
        </button>
      </div>

      {/* Month filter + total */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-dark/40" />
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white" />
        </div>
        <div className="bg-white border border-danger/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <TrendingDown size={16} className="text-danger" />
          <div>
            <p className="text-xs text-dark/40">Total Expenses This Month</p>
            <p className="text-xl font-bold text-danger">{formatPrice(total)}</p>
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-dark/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-dark">New Expense</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-dark/40" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-dark/60 mb-1 block">Description *</label>
              <input type="text" placeholder="e.g. Monthly rent payment" value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" autoFocus />
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value as ExpenseCategory}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Amount (KSh) *</label>
              <input type="number" min={0} placeholder="0" value={form.amount} onChange={e => setForm(f => ({...f,amount:e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm(f => ({...f,paymentMethod:e.target.value as PaymentMethod}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white">
                {PAYMENT.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white" />
            </div>
          </div>
          <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm(f => ({...f,note:e.target.value}))}
            className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <button onClick={add} className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">Save Expense</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="admin-card p-12 text-center">
              <TrendingDown size={32} className="text-dark/15 mx-auto mb-3" />
              <p className="text-dark/40 text-sm">No expenses recorded for {filterMonth}.</p>
            </div>
          ) : (
            <div className="admin-card overflow-hidden">
              <div className="divide-y divide-[#ECEEF2]">
                {filtered.map(e => (
                  <div key={e.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark">{e.description}</p>
                      <p className="text-xs text-dark/40 mt-0.5 capitalize">{CATEGORIES.find(c=>c.value===e.category)?.label} · {e.paymentMethod.toUpperCase()} · {e.date}</p>
                    </div>
                    <p className="font-mono font-bold text-danger text-sm flex-shrink-0">−{formatPrice(e.amount)}</p>
                    <button onClick={() => del(e.id)} className="text-dark/20 hover:text-danger transition-colors flex-shrink-0"><X size={13}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="admin-card p-5 space-y-3 h-fit">
          <h3 className="font-semibold text-dark text-sm">By Category</h3>
          {byCategory.length === 0 ? <p className="text-xs text-dark/30">No data yet</p> : byCategory.map(c => (
            <div key={c.value}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-dark/60">{c.label}</span>
                <span className="font-mono font-semibold text-dark">{formatPrice(c.total)}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-danger/60 rounded-full" style={{width: `${(c.total/total)*100}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
