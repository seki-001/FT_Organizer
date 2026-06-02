'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Users, Calendar,
  FileText, Settings, Menu, X, ChevronRight, LogOut, Bell,
  BarChart2,
  Home,
} from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import { cn } from '@/lib/utils'

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href:  string
  icon:  React.ElementType
}

interface NavSection {
  label: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart2       },
    ],
  },
  {
    label: 'STORE',
    items: [
      { label: 'Orders',    href: '/admin/orders',    icon: ShoppingBag },
      { label: 'Products',  href: '/admin/products',  icon: Package     },
      { label: 'Coupons',   href: '/admin/coupons',   icon: Tag         },
      { label: 'Customers', href: '/admin/customers', icon: Users       },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

// ─── Breadcrumb builder ───────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  analytics: 'Analytics',
  orders:    'Orders',
  products:  'Products',
  coupons:   'Coupons',
  customers: 'Customers',
  bookings:  'Bookings',
  blog:      'Blog Posts',
  settings:  'Settings',
  new:       'New',
  edit:      'Edit',
}

function buildBreadcrumb(pathname: string): { label: string; href: string }[] {
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = [
    { label: 'Admin', href: '/admin' },
  ]
  segments.forEach((seg, i) => {
    crumbs.push({
      label: PAGE_LABELS[seg] ?? (seg.charAt(0).toUpperCase() + seg.slice(1)),
      href:  '/admin/' + segments.slice(0, i + 1).join('/'),
    })
  })
  return crumbs
}

// ─── Sidebar nav link ─────────────────────────────────────────────────────────

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'text-dark/60 hover:text-dark hover:bg-muted',
      )}
    >
      <Icon size={17} aria-hidden="true" />
      {item.label}
    </Link>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  userEmail,
  userName,
  onClose,
}: {
  userEmail: string
  userName:  string
  onClose?:  () => void
}) {
  const pathname = usePathname()
  const router   = useRouter()

  function handleSignOut() {
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full bg-white w-[260px] flex-shrink-0 border-r border-dark/8">

      {/* ── Brand header ────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-dark/8 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 rounded-card bg-surface px-3 py-2.5">
          <BrandLogo heightClass="h-9 sm:h-10" href="/admin" className="max-w-full" />
          <p className="text-dark/45 text-[11px] mt-1 pl-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-dark/40 hover:bg-muted hover:text-dark transition-colors md:hidden flex-shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5" aria-label="Admin navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-0.5">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-dark/30 select-none">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClick={onClose}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* ── View site link ───────────────────────────────────────────────── */}
      <div className="px-3 pb-3 border-t border-dark/8 pt-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark/45 hover:text-dark hover:bg-muted transition-colors"
        >
          <Home size={15} className="text-dark/30" aria-hidden="true" />
          View Website ↗
        </Link>
      </div>

      {/* ── User section ─────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-dark/8">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
            {userName?.[0] ?? 'F'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-dark text-xs font-medium truncate">{userName}</p>
            <p className="text-dark/40 text-[11px] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-dark/50 hover:text-danger hover:bg-danger/5 transition-colors duration-150"
        >
          <LogOut size={15} aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────

export default function AdminShell({
  children,
  userEmail,
  userName,
}: {
  children:  React.ReactNode
  userEmail: string
  userName:  string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const breadcrumb = buildBreadcrumb(pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col flex-shrink-0 shadow-sm">
        <Sidebar userEmail={userEmail} userName={userName} />
      </div>

      {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-dark/30 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden flex flex-col shadow-2xl">
            <Sidebar
              userEmail={userEmail}
              userName={userName}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-dark/8 h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 shadow-sm">

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-dark/50 hover:bg-muted transition-colors flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Mobile brand */}
          <span className="md:hidden font-display text-primary font-bold text-base">FTO</span>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0 flex-1">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <ChevronRight size={13} className="text-dark/25 flex-shrink-0" aria-hidden="true" />
                )}
                {i < breadcrumb.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="text-dark/40 hover:text-primary transition-colors truncate text-xs"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-dark font-semibold truncate text-sm">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Mobile: current page label */}
          <span className="sm:hidden font-semibold text-dark text-sm flex-1">
            {breadcrumb[breadcrumb.length - 1]?.label ?? 'Admin'}
          </span>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              aria-label="Notifications"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-dark/40 hover:text-dark hover:bg-muted transition-colors relative"
            >
              <Bell size={17} aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" aria-hidden="true" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-dark/8">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase">
                {userName?.[0] ?? 'F'}
              </div>
              <span className="text-sm font-medium text-dark hidden md:block">{userName.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
