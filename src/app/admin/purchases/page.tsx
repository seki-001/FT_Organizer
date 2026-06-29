'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Truck, Calendar, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Purchase, PaymentMethod } from '@/lib/types'

const KEY = 'fto_purchases'
const load = (): Purchase[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } }
const save = (d: Purchase[]) => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} }

const BLANK = {
  supplierName: '', itemName: '', quantity: '', unitCost: '',
  paymentMethod: 'cash' as PaymentMethod, date: new Date().toISOString().slice(0, 10), note: ''
}

export default function PurchasesPage() {
  const [list, setList] = useState<Purchase[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => setList(load()), [])

  const filtered = list.filter(p => p.date.startsWith(filterMonth))
  const totalCost = filtered.reduce((s, p) => s + p.total, 0)

  const qty = parseFloat(form.quantity) || 1
  const unitCost = parseFloat(form.unitCost) || 0
  const lineTotal = qty * unitCost

  function add() {
    if (!form.supplierName.trim() || !form.itemName.trim()) return alert('Supplier and item name are required')
    if (!form.unitCost || unitCost <= 0) return alert('Enter a valid unit cost')
    const p: Purchase = {
      id: Date.now().toString(),
      supplierName: form.supplierName,
      items: [{ productName: form.itemName, quantity: qty, unitCost, total: lineTotal }],
      subtotal: lineTotal,
      total: lineTotal,
      paymentMethod: form.paymentMethod,
      date: form.date,
      createdAt: new Date().toISOString(),
      note: form.note,
    }
    const updated = [p, ...list]; setList(updated); save(updated)
    setForm({ ...BLANK, date: form.date, supplierName: form.supplierName }); setShowForm(false)
  }

  function del(id: string) {
    if (!confirm('Delete this purchase record?')) return
    const updated = list.filter(p => p.id !== id); setList(updated); save(updated)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Purchases / Restocking</h1>
          <p className="text-sm text-dark/50 mt-0.5">Record stock purchases and supplier payments</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Record Purchase
        </button>
      </div>

      {/* Month filter + total */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-dark/40" />
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white" />
        </div>
        <div className="bg-white border border-accent/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <Truck size={16} className="text-accent" />
          <div>
            <p className="text-xs text-dark/40">Total Stock Cost This Month</p>
            <p className="text-xl font-bold text-accent font-mono">{formatPrice(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-dark/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-dark">New Purchase Entry</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-dark/40" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Supplier Name *</label>
              <input type="text" placeholder="e.g. Nairobi Wholesalers Ltd" value={form.supplierName}
                onChange={e => setForm(f => ({...f, supplierName: e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" autoFocus />
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Item / Description *</label>
              <input type="text" placeholder="e.g. 2L Storage Containers" value={form.itemName}
                onChange={e => setForm(f => ({...f, itemName: e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Quantity</label>
              <input type="number" min={1} placeholder="1" value={form.quantity}
                onChange={e => setForm(f => ({...f, quantity: e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Unit Cost (KSh) *</label>
              <input type="number" min={0} placeholder="0" value={form.unitCost}
                onChange={e => setForm(f => ({...f, unitCost: e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono" />
            </div>
            {form.quantity && form.unitCost && (
              <div className="col-span-2 bg-muted rounded-lg px-4 py-2.5 flex justify-between items-center">
                <span className="text-sm text-dark/50">{qty} × {formatPrice(unitCost)}</span>
                <span className="text-sm font-bold text-primary font-mono">= {formatPrice(lineTotal)}</span>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm(f => ({...f, paymentMethod: e.target.value as PaymentMethod}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white">
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="credit">Credit (Pay Later)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white" />
            </div>
          </div>
          <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}
            className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <button onClick={add} className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
            Save Purchase
          </button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dark/8 rounded-2xl p-16 text-center">
          <Package size={36} className="text-dark/15 mx-auto mb-3" />
          <p className="text-dark/40 text-sm">No purchases recorded for {filterMonth}.</p>
        </div>
      ) : (
        <div className="bg-white border border-dark/8 rounded-2xl overflow-hidden">
          <div className="divide-y divide-dark/5">
            {filtered.map(p => {
              const firstItem = p.items[0]
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Truck size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark">{firstItem?.productName ?? '—'}</p>
                    <p className="text-xs text-dark/40 mt-0.5">
                      {p.supplierName} · {p.date} · {p.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-dark">{formatPrice(p.total)}</p>
                    {firstItem && (
                      <p className="text-xs text-dark/35">{firstItem.quantity} unit{firstItem.quantity !== 1 ? 's' : ''} @ {formatPrice(firstItem.unitCost)}</p>
                    )}
                  </div>
                  <button onClick={() => del(p.id)} className="text-dark/20 hover:text-danger transition-colors flex-shrink-0 ml-1">
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
