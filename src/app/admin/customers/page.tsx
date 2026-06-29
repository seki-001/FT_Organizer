'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, User, Phone, Mail, TrendingUp, TrendingDown, X, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { BusinessCustomer } from '@/lib/types'

const KEY = 'fto_customers'
const load = (): BusinessCustomer[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } }
const save = (d: BusinessCustomer[]) => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} }

const BLANK = { name: '', phone: '', email: '', address: '', notes: '' }

export default function CustomersPage() {
  const [list, setList] = useState<BusinessCustomer[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...BLANK })
  const [payModal, setPayModal] = useState<{ c: BusinessCustomer; amt: string } | null>(null)
  const [debtModal, setDebtModal] = useState<{ c: BusinessCustomer; amt: string } | null>(null)

  useEffect(() => setList(load()), [])

  const filtered = list.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  const totalDebt = list.reduce((s, c) => s + Math.max(0, c.creditBalance), 0)

  function add() {
    if (!form.name.trim() || !form.phone.trim()) return alert('Name and phone are required')
    const updated = [{ id: Date.now().toString(), ...form, creditBalance: 0, totalPurchases: 0, createdAt: new Date().toISOString() } as BusinessCustomer, ...list]
    setList(updated); save(updated); setForm({ ...BLANK }); setShowForm(false)
  }

  function recordPayment() {
    if (!payModal) return
    const amt = parseFloat(payModal.amt); if (!amt || amt <= 0) return
    const updated = list.map(c => c.id === payModal.c.id ? { ...c, creditBalance: c.creditBalance - amt } : c)
    setList(updated); save(updated); setPayModal(null)
  }

  function recordDebt() {
    if (!debtModal) return
    const amt = parseFloat(debtModal.amt); if (!amt || amt <= 0) return
    const updated = list.map(c => c.id === debtModal.c.id ? { ...c, creditBalance: c.creditBalance + amt, totalPurchases: c.totalPurchases + amt, lastPurchaseAt: new Date().toISOString() } : c)
    setList(updated); save(updated); setDebtModal(null)
  }

  function del(id: string) {
    if (!confirm('Delete this customer?')) return
    const updated = list.filter(c => c.id !== id); setList(updated); save(updated)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Customers</h1>
          <p className="text-sm text-dark/50 mt-0.5">Manage accounts and outstanding balances</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-dark">{list.length}</p>
        </div>
        <div className="bg-white border border-danger/20 rounded-2xl p-5">
          <p className="text-xs text-danger/70 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={11} /> Total Owed to Us</p>
          <p className="text-3xl font-bold text-danger">{formatPrice(totalDebt)}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs text-dark/40 uppercase tracking-wider mb-1">With Outstanding Debt</p>
          <p className="text-3xl font-bold text-dark">{list.filter(c => c.creditBalance > 0).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35" />
        <input type="text" placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-dark/15 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-dark/30" />
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-dark/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-dark">New Customer</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-dark/40" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([['name','Full Name *','Jane Wanjiku'],['phone','Phone *','+254 7XX XXX XXX'],['email','Email','jane@email.com'],['address','Area / Address','Westlands, Nairobi']] as [string,string,string][]).map(([k,l,p]) => (
              <div key={k}>
                <label className="text-xs font-medium text-dark/60 mb-1 block">{l}</label>
                <input type="text" placeholder={p} value={(form as Record<string,string>)[k]}
                  onChange={e => setForm(f => ({...f,[k]:e.target.value}))}
                  className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
            ))}
          </div>
          <input type="text" placeholder="Notes (optional)" value={form.notes ?? ''} onChange={e => setForm(f => ({...f,notes:e.target.value}))}
            className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <button onClick={add} className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">Save Customer</button>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="admin-card p-16 text-center">
          <User size={36} className="text-dark/15 mx-auto mb-3" />
          <p className="text-dark/40 text-sm">{search ? 'No results' : 'No customers yet — add your first customer above.'}</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="divide-y divide-[#ECEEF2]">
            {filtered.map(c => (
              <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">{c.name[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm">{c.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-dark/40 flex items-center gap-1"><Phone size={10}/>{c.phone}</span>
                    {c.email && <span className="text-xs text-dark/40 flex items-center gap-1"><Mail size={10}/>{c.email}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 mr-2">
                  {c.creditBalance > 0
                    ? <p className="text-sm font-bold text-danger">{formatPrice(c.creditBalance)} owed</p>
                    : c.creditBalance < 0
                    ? <p className="text-sm font-bold text-success">{formatPrice(-c.creditBalance)} credit</p>
                    : <p className="text-xs text-dark/30 flex items-center gap-1"><CheckCircle2 size={12}/>Settled</p>}
                  <p className="text-xs text-dark/35 mt-0.5">Lifetime: {formatPrice(c.totalPurchases)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setDebtModal({c, amt:''})} className="text-xs bg-danger/8 text-danger hover:bg-danger/15 px-2.5 py-1.5 rounded-lg font-medium transition-colors">+ Debt</button>
                  <button onClick={() => setPayModal({c, amt:''})} className="text-xs bg-success/8 text-success hover:bg-success/15 px-2.5 py-1.5 rounded-lg font-medium transition-colors">+ Payment</button>
                  <button onClick={() => del(c.id)} className="text-xs text-dark/20 hover:text-danger px-1.5 transition-colors"><X size={13}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {payModal && (
        <div className="fixed inset-0 bg-dark/40 z-50 flex items-center justify-center p-4" onClick={() => setPayModal(null)}>
          <div className="admin-card p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-dark">Record Payment</h3>
            <p className="text-sm text-dark/50">{payModal.c.name} owes <strong className="text-danger">{formatPrice(payModal.c.creditBalance)}</strong></p>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Amount Received (KSh)</label>
              <input type="number" min={0} value={payModal.amt} onChange={e => setPayModal(p => p ? {...p, amt: e.target.value} : p)}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono" autoFocus />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="flex-1 border border-dark/15 text-dark py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={recordPayment} className="flex-1 bg-success text-white py-2.5 rounded-xl text-sm font-semibold">Record Payment</button>
            </div>
          </div>
        </div>
      )}
      {debtModal && (
        <div className="fixed inset-0 bg-dark/40 z-50 flex items-center justify-center p-4" onClick={() => setDebtModal(null)}>
          <div className="admin-card p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-dark">Add Credit Sale (Debt)</h3>
            <p className="text-sm text-dark/50">Customer: <strong>{debtModal.c.name}</strong></p>
            <div>
              <label className="text-xs font-medium text-dark/60 mb-1 block">Amount (KSh)</label>
              <input type="number" min={0} value={debtModal.amt} onChange={e => setDebtModal(p => p ? {...p, amt: e.target.value} : p)}
                className="w-full text-sm border border-dark/15 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono" autoFocus />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDebtModal(null)} className="flex-1 border border-dark/15 text-dark py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={recordDebt} className="flex-1 bg-danger text-white py-2.5 rounded-xl text-sm font-semibold">Record Debt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
