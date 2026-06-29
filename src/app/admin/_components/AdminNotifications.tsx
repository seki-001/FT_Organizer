'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, Calendar, Package, ShoppingBag, AlertTriangle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ADMIN_PENDING_BOOKINGS,
  ADMIN_LOW_STOCK,
  ADMIN_RECENT_ORDERS,
} from '@/lib/mock-admin-data'

export interface AdminNotification {
  id: string
  title: string
  message: string
  href: string
  timeAgo: string
  type: 'booking' | 'order' | 'stock'
  read: boolean
}

function buildNotifications(): AdminNotification[] {
  const items: AdminNotification[] = []

  ADMIN_PENDING_BOOKINGS.filter((b) => b.status === 'new').forEach((b) => {
    items.push({
      id: `bk-${b.id}`,
      title: 'New booking request',
      message: `${b.customer} — ${b.service}`,
      href: '/admin/bookings',
      timeAgo: b.date,
      type: 'booking',
      read: false,
    })
  })

  ADMIN_RECENT_ORDERS.filter((o) => o.status === 'processing').slice(0, 2).forEach((o) => {
    items.push({
      id: `ord-${o.id}`,
      title: 'Order needs processing',
      message: `${o.customer} · ${o.id}`,
      href: '/admin/orders',
      timeAgo: o.timeAgo,
      type: 'order',
      read: false,
    })
  })

  ADMIN_LOW_STOCK.slice(0, 2).forEach((p) => {
    items.push({
      id: `stock-${p.slug}`,
      title: 'Low stock alert',
      message: `${p.name} — only ${p.stockCount} left`,
      href: '/admin/products',
      timeAgo: 'Today',
      type: 'stock',
      read: false,
    })
  })

  return items
}

const TYPE_ICON = {
  booking: Calendar,
  order: ShoppingBag,
  stock: AlertTriangle,
} as const

const TYPE_BG = {
  booking: 'bg-success/10 text-success',
  order: 'bg-primary/10 text-primary',
  stock: 'bg-danger/10 text-danger',
} as const

export default function AdminNotifications() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AdminNotification[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setItems(buildNotifications())
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const unread = items.filter((n) => !n.read).length

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}
        aria-expanded={open}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-colors relative',
          open ? 'bg-[#F4F5F7] text-dark' : 'text-dark/40 hover:text-dark hover:bg-[#F4F5F7]',
        )}
      >
        <Bell size={17} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,360px)] admin-card shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#ECEEF2]">
            <p className="text-sm font-semibold text-dark">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-dark/45">No notifications right now.</p>
            ) : (
              items.map((n) => {
                const Icon = TYPE_ICON[n.type]
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      markRead(n.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex gap-3 px-4 py-3 border-b border-[#ECEEF2] last:border-b-0 hover:bg-[#FAFBFC] transition-colors',
                      !n.read && 'bg-primary/[0.03]',
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', TYPE_BG[n.type])}>
                      <Icon size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-dark leading-snug">{n.title}</p>
                      <p className="text-xs text-dark/50 mt-0.5 truncate">{n.message}</p>
                      <p className="text-[11px] text-dark/35 mt-1">{n.timeAgo}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" aria-hidden="true" />
                    )}
                  </Link>
                )
              })
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[#ECEEF2] bg-[#FAFBFC]">
            <Link
              href="/admin/bookings"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all activity →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
