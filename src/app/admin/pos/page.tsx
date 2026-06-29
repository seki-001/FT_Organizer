'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Receipt, User, DollarSign, Smartphone, CreditCard, X, CheckCircle2, Printer } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { SHOP_CATEGORIES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import type { SaleItem, PaymentMethod, Sale } from '@/lib/types'
import { POSReceipt, printPOSReceipt } from './POSReceipt'

interface CartLine {
  productId: string
  name: string
  category: string
  price: number
  qty: number
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'cash', label: 'Cash', icon: <DollarSign size={16} /> },
  { value: 'mpesa', label: 'M-Pesa', icon: <Smartphone size={16} /> },
  { value: 'card', label: 'Card', icon: <CreditCard size={16} /> },
  { value: 'credit', label: 'Credit (Debt)', icon: <User size={16} /> },
]

function generateReceiptNo() {
  return 'FTO-' + Date.now().toString(36).toUpperCase()
}

export default function POSPage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [customerName, setCustomerName] = useState('')
  const [discount, setDiscount] = useState(0)
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<string | null>(null)
  const [completedSale, setCompletedSale] = useState<Sale | null>(null)

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCat = selectedCat === 'all' || p.category === selectedCat
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch && p.inStock
    }).slice(0, 60)
  }, [search, selectedCat])

  const addToCart = useCallback((product: typeof MOCK_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(l => l.productId === product.id)
      if (existing) {
        return prev.map(l => l.productId === product.id ? { ...l, qty: l.qty + 1 } : l)
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.salePrice ?? product.price,
        qty: 1,
      }]
    })
  }, [])

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev
      .map(l => l.productId === id ? { ...l, qty: l.qty + delta } : l)
      .filter(l => l.qty > 0)
    )
  }

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const discountAmt = Math.min(discount, subtotal)
  const total = subtotal - discountAmt

  const completeSale = () => {
    if (cart.length === 0) return
    const receiptNo = generateReceiptNo()
    const sale: Sale = {
      id: receiptNo,
      items: cart.map(l => ({
        productId: l.productId,
        productName: l.name,
        category: l.category,
        quantity: l.qty,
        unitPrice: l.price,
        total: l.price * l.qty,
      } satisfies SaleItem)),
      subtotal,
      discount: discountAmt,
      total,
      paymentMethod,
      customerName: customerName || 'Walk-in',
      cashierName: 'Admin',
      createdAt: new Date().toISOString(),
      receiptNo,
      note,
    }

    // Persist to localStorage (until POS is wired to Supabase)
    try {
      const existing = JSON.parse(localStorage.getItem('fto_sales') ?? '[]')
      existing.unshift(sale)
      localStorage.setItem('fto_sales', JSON.stringify(existing.slice(0, 500)))
    } catch {}

    setCompletedSale(sale)
    setLastReceipt(receiptNo)
    setShowSuccess(true)
    setCart([])
    setDiscount(0)
    setCustomerName('')
    setNote('')
  }

  if (showSuccess && completedSale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="sr-only" aria-hidden="true">
          <POSReceipt sale={completedSale} />
        </div>
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark">Sale Complete!</h2>
          <p className="text-dark/50 mt-1">Receipt #{lastReceipt}</p>
          <p className="text-dark/40 text-sm mt-1 capitalize">
            Paid via {completedSale.paymentMethod}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => printPOSReceipt()}
            className="flex items-center gap-2 border border-dark/15 text-dark px-6 py-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Printer size={16} /> Print Receipt
          </button>
          <button
            onClick={() => { setShowSuccess(false); setCompletedSale(null) }}
            className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            New Sale
          </button>
          <a
            href="/admin/reports"
            className="border border-dark/15 text-dark px-6 py-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            View Reports
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] gap-0 overflow-hidden">
      {/* ── LEFT: Product Picker ─────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#ECEEF2]">
        {/* Search + Category Filter */}
        <div className="p-4 border-b border-[#ECEEF2] bg-white space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-dark/15 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 placeholder:text-dark/35"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCat('all')}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${selectedCat === 'all' ? 'bg-primary text-white' : 'bg-muted text-dark/60 hover:bg-dark/8'}`}
            >
              All
            </button>
            {SHOP_CATEGORIES.map(c => (
              <button
                key={c.slug}
                onClick={() => setSelectedCat(c.slug)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${selectedCat === c.slug ? 'bg-primary text-white' : 'bg-muted text-dark/60 hover:bg-dark/8'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="text-left bg-white border border-[#ECEEF2] rounded-lg p-3 hover:border-primary/30 hover:shadow-sm active:scale-95 transition-all group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="120px"
                  />
                </div>
                <p className="text-[10px] text-dark/35 uppercase tracking-wider mb-1 truncate">
                  {p.category.replace(/-/g, ' ')}
                </p>
                <p className="text-sm font-semibold text-dark line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {p.name}
                </p>
                <p className="text-sm font-mono font-bold text-primary">
                  {formatPrice(p.salePrice ?? p.price)}
                </p>
                {p.stockCount <= 5 && (
                  <p className="text-[10px] text-amber-600 mt-1">{p.stockCount} left</p>
                )}
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 text-dark/35">
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Cart + Payment ────────────────────────────── */}
      <div className="w-80 xl:w-96 flex flex-col bg-white">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#ECEEF2]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-dark flex items-center gap-2">
              <Receipt size={16} className="text-primary" />
              Current Sale
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-dark/35 hover:text-danger transition-colors flex items-center gap-1">
                <X size={12} /> Clear
              </button>
            )}
          </div>
          {/* Customer */}
          <div className="relative">
            <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35" />
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-dark/12 rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 placeholder:text-dark/30"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#ECEEF2]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-dark/25 gap-2">
              <Receipt size={32} />
              <p className="text-sm">Tap a product to add</p>
            </div>
          ) : (
            cart.map(line => (
              <div key={line.productId} className="px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark line-clamp-1">{line.name}</p>
                  <p className="text-xs text-dark/40 font-mono">{formatPrice(line.price)} × {line.qty}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => updateQty(line.productId, -1)} className="w-6 h-6 rounded-md bg-muted hover:bg-dark/10 flex items-center justify-center transition-colors">
                    <Minus size={11} />
                  </button>
                  <span className="w-6 text-center text-sm font-mono font-semibold">{line.qty}</span>
                  <button onClick={() => updateQty(line.productId, 1)} className="w-6 h-6 rounded-md bg-muted hover:bg-dark/10 flex items-center justify-center transition-colors">
                    <Plus size={11} />
                  </button>
                  <button onClick={() => setCart(c => c.filter(l => l.productId !== line.productId))} className="w-6 h-6 rounded-md text-dark/25 hover:text-danger hover:bg-danger/8 flex items-center justify-center ml-1 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals + Payment */}
        <div className="border-t border-[#ECEEF2] p-4 space-y-3">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-dark/50 w-20 flex-shrink-0">Discount</label>
            <input
              type="number"
              min={0}
              value={discount || ''}
              onChange={e => setDiscount(Number(e.target.value))}
              placeholder="KSh 0"
              className="flex-1 text-sm border border-dark/12 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono"
            />
          </div>

          {/* Totals */}
          <div className="bg-surface rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-sm text-dark/60">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount</span>
                <span className="font-mono">− {formatPrice(discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-dark text-base pt-1 border-t border-[#ECEEF2]">
              <span>Total</span>
              <span className="font-mono text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPaymentMethod(opt.value)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all ${
                  paymentMethod === opt.value
                    ? 'bg-primary/8 border-primary/30 text-primary'
                    : 'border-dark/12 text-dark/60 hover:border-dark/20'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          {/* Note */}
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full text-xs border border-dark/12 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-dark/30"
          />

          {/* Complete Sale */}
          <button
            onClick={completeSale}
            disabled={cart.length === 0}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Complete Sale · {formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  )
}
