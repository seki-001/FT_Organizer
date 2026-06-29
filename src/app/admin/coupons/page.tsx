'use client'

import { useState } from 'react'
import {
  PlusCircle, Pencil, Trash2, RefreshCw, X, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { MOCK_COUPONS, generateCouponCode } from '@/lib/mock-admin-coupons'
import type { Coupon } from '@/lib/mock-admin-coupons'
import { cn, formatPrice } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn('w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-200', checked ? 'bg-primary' : 'bg-dark/20')}>
      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200', checked ? 'right-0.5' : 'left-0.5')} />
    </button>
  )
}

function DeleteDialog({ coupon, onConfirm, onCancel }: { coupon: Coupon; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="admin-card shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0"><Trash2 size={18} className="text-danger" /></div>
          <div>
            <h3 className="font-semibold text-dark">Delete Coupon?</h3>
            <p className="text-sm text-dark/60 mt-1">Coupon <span className="font-mono font-bold text-dark">{coupon.code}</span> will be permanently deleted.</p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel}  className="flex-1 px-4 py-2.5 border border-dark/15 text-dark text-sm font-medium rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────

interface ModalProps {
  coupon?:   Coupon   // present → edit mode
  onSave:    (data: Partial<Coupon>) => void
  onClose:   () => void
  isSaving:  boolean
}

function CouponModal({ coupon, onSave, onClose, isSaving }: ModalProps) {
  const isEdit = !!coupon
  const [code,       setCode]       = useState(coupon?.code        ?? generateCouponCode())
  const [type,       setType]       = useState<Coupon['type']>(coupon?.type ?? 'percentage')
  const [value,      setValue]      = useState(coupon?.value?.toString()     ?? '')
  const [minOrder,   setMinOrder]   = useState(coupon?.minOrder?.toString()  ?? '0')
  const [limit,      setLimit]      = useState(coupon?.usageLimit?.toString() ?? '')
  const [expiresAt,  setExpiresAt]  = useState(coupon?.expiresAt?.split('T')[0] ?? '')
  const [active,     setActive]     = useState(coupon?.active ?? true)
  const [error,      setError]      = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim())     { setError('Coupon code is required.'); return }
    if (!value || isNaN(Number(value)) || Number(value) <= 0) { setError('Discount value must be a positive number.'); return }
    if (type === 'percentage' && Number(value) > 100) { setError('Percentage cannot exceed 100.'); return }
    setError('')
    onSave({
      code:       code.toUpperCase().trim(),
      type,
      value:      Number(value),
      minOrder:   Number(minOrder) || 0,
      usageLimit: limit ? Number(limit) : null,
      expiresAt:  expiresAt || null,
      active,
    })
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white placeholder:text-dark/30'

  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="admin-card shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEEF2] flex-shrink-0">
          <h2 className="font-semibold text-dark">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-dark hover:bg-muted transition-colors"><X size={16} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="px-6 py-5 flex flex-col gap-4">

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Coupon Code</label>
              <div className="flex gap-2">
                <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                  className={cn(inputCls, 'flex-1 font-mono uppercase')} placeholder="e.g. SAVE20" maxLength={30} />
                <button type="button" onClick={() => setCode(generateCouponCode())}
                  className="w-10 h-[42px] flex items-center justify-center border border-dark/15 rounded-lg text-dark/50 hover:text-primary hover:border-primary transition-colors" title="Generate random code">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Discount Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['percentage', 'fixed'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={cn('px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors',
                      type === t ? 'border-primary bg-primary/5 text-primary' : 'border-dark/15 text-dark/60 hover:border-dark/30')}>
                    {t === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (KSh)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Discount Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/40 pointer-events-none">
                  {type === 'percentage' ? '%' : 'KSh'}
                </span>
                <input type="number" min="1" max={type === 'percentage' ? 100 : undefined}
                  value={value} onChange={e => setValue(e.target.value)}
                  className={cn(inputCls, 'pl-10')} placeholder="0" />
              </div>
            </div>

            {/* Min order */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Minimum Order Value <span className="text-xs font-normal text-dark/40">Optional</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/40 pointer-events-none">KSh</span>
                <input type="number" min="0" value={minOrder} onChange={e => setMinOrder(e.target.value)}
                  className={cn(inputCls, 'pl-10')} placeholder="0 = no minimum" />
              </div>
            </div>

            {/* Usage limit */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Usage Limit <span className="text-xs font-normal text-dark/40">Optional — blank = unlimited</span>
              </label>
              <input type="number" min="1" value={limit} onChange={e => setLimit(e.target.value)}
                className={inputCls} placeholder="e.g. 100" />
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Expiry Date <span className="text-xs font-normal text-dark/40">Optional</span>
              </label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={inputCls} />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark">Active</p>
                <p className="text-xs text-dark/45">Customers can use this coupon at checkout</p>
              </div>
              <Toggle checked={active} onChange={setActive} />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-danger font-medium"><AlertCircle size={12} />{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-[#ECEEF2] flex-shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-dark/15 text-dark text-sm font-medium rounded-lg hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {isSaving && <Loader2 size={13} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCouponsPage() {
  const [coupons,     setCoupons]     = useState<Coupon[]>(MOCK_COUPONS)
  const [showModal,   setShowModal]   = useState(false)
  const [editCoupon,  setEditCoupon]  = useState<Coupon | undefined>()
  const [deleteId,    setDeleteId]    = useState<string | null>(null)
  const [isSaving,    setIsSaving]    = useState(false)
  const [savedId,     setSavedId]     = useState<string | null>(null)

  const activeCount = coupons.filter(c => c.active).length

  function openCreate() { setEditCoupon(undefined); setShowModal(true) }
  function openEdit(c: Coupon) { setEditCoupon(c); setShowModal(true) }

  async function handleSave(data: Partial<Coupon>) {
    setIsSaving(true)
    try {
      if (editCoupon) {
        // Edit
        await fetch(`/api/admin/coupons/${editCoupon.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        })
        setCoupons(prev => prev.map(c => c.id === editCoupon.id ? { ...c, ...data } : c))
        setSavedId(editCoupon.id)
      } else {
        // Create
        const res = await fetch('/api/admin/coupons', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const json = await res.json() as { coupon: Coupon }
        const newCoupon: Coupon = {
          id: json.coupon?.id ?? `cp-${Date.now()}`,
          uses: 0, createdAt: new Date().toISOString(),
          code: data.code!, type: data.type!, value: data.value!,
          minOrder: data.minOrder ?? 0, usageLimit: data.usageLimit ?? null,
          expiresAt: data.expiresAt ?? null, active: data.active ?? true,
        }
        setCoupons(prev => [newCoupon, ...prev])
        setSavedId(newCoupon.id)
      }
      setTimeout(() => setSavedId(null), 2500)
      setShowModal(false)
    } finally {
      setIsSaving(false)
    }
  }

  function handleToggleActive(id: string) {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
    fetch(`/api/admin/coupons/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeToggle: true }),
    }).catch(() => {})
  }

  function handleDeleteConfirm() {
    if (!deleteId) return
    setCoupons(prev => prev.filter(c => c.id !== deleteId))
    fetch(`/api/admin/coupons/${deleteId}`, { method: 'DELETE' }).catch(() => {})
    setDeleteId(null)
  }

  const deleteCoupon = deleteId ? coupons.find(c => c.id === deleteId) : null

  return (
    <>
      <div className="flex flex-col gap-6">

        <AdminPageHeader
          title="Coupons"
          subtitle={`${activeCount} active discount code${activeCount !== 1 ? 's' : ''}`}
          action={{ label: 'Add Coupon', icon: PlusCircle, onClick: openCreate }}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {[
            { label: 'Total',    count: coupons.length,                    color: 'text-dark'    },
            { label: 'Active',   count: activeCount,                        color: 'text-success' },
            { label: 'Inactive', count: coupons.length - activeCount,       color: 'text-dark/40' },
          ].map(({ label, count, color }) => (
            <div key={label} className="admin-card p-4 text-center">
              <p className={cn('font-display text-2xl font-bold', color)}>{count}</p>
              <p className="text-dark/50 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-[#ECEEF2] bg-muted/30">
                  {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, i) => {
                  const usagePct = coupon.usageLimit ? Math.round(coupon.uses / coupon.usageLimit * 100) : null
                  const expired  = coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false
                  const isNew    = savedId === coupon.id

                  return (
                    <tr key={coupon.id} className={cn('border-b border-dark/5 hover:bg-muted/20 transition-colors', i % 2 !== 0 && 'bg-muted/10', isNew && 'bg-success/5')}>

                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-dark bg-muted px-2.5 py-1 rounded-lg">{coupon.code}</span>
                          {isNew && <CheckCircle2 size={14} className="text-success" />}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-dark/60 text-xs capitalize">{coupon.type}</td>

                      {/* Value */}
                      <td className="px-5 py-4 font-semibold text-dark text-sm">
                        {coupon.type === 'percentage' ? `${coupon.value}% off` : `${formatPrice(coupon.value)} off`}
                      </td>

                      {/* Min order */}
                      <td className="px-5 py-4 font-mono text-sm text-dark/60">
                        {coupon.minOrder > 0 ? formatPrice(coupon.minOrder) : <span className="text-dark/30 font-sans text-xs">None</span>}
                      </td>

                      {/* Uses */}
                      <td className="px-5 py-4">
                        <p className="text-dark text-sm font-medium">
                          {coupon.uses}
                          {coupon.usageLimit !== null && <span className="text-dark/35 font-normal"> / {coupon.usageLimit}</span>}
                        </p>
                        {usagePct !== null && (
                          <div className="w-16 h-1 bg-dark/8 rounded-full mt-1 overflow-hidden">
                            <div className={cn('h-full rounded-full', usagePct >= 90 ? 'bg-danger' : usagePct >= 60 ? 'bg-amber-400' : 'bg-success')}
                              style={{ width: `${Math.min(usagePct, 100)}%` }} />
                          </div>
                        )}
                      </td>

                      {/* Expires */}
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        {coupon.expiresAt
                          ? <span className={expired ? 'text-danger' : 'text-dark/50'}>
                              {new Date(coupon.expiresAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {expired && ' (expired)'}
                            </span>
                          : <span className="text-dark/30">Never</span>}
                      </td>

                      {/* Active toggle */}
                      <td className="px-5 py-4">
                        <Toggle checked={coupon.active} onChange={() => handleToggleActive(coupon.id)} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(coupon)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteId(coupon.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-danger hover:bg-danger/8 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-dark/5">
            <p className="text-xs text-dark/40">
              {coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total · Validate at <span className="font-mono text-dark/60">POST /api/coupons/validate</span>
            </p>
          </div>
        </div>

      </div>

      {showModal && (
        <CouponModal coupon={editCoupon} onSave={handleSave} onClose={() => setShowModal(false)} isSaving={isSaving} />
      )}

      {deleteId && deleteCoupon && (
        <DeleteDialog coupon={deleteCoupon} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteId(null)} />
      )}
    </>
  )
}
