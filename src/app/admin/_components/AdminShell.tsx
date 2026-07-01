'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Users, Calendar,
  FileText, Settings, Menu, X, ChevronRight, LogOut,
  BarChart2, Home, Receipt, TrendingDown, Truck, PieChart, Mail, Search, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clientAvatarForUser } from '@/lib/avatars'
import BrandLogo from '@/components/brand/BrandLogo'
import AdminNotifications from './AdminNotifications'

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
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
      { label: 'Activity Log', href: '/admin/activity', icon: Activity },
      { label: 'Reports',   href: '/admin/reports',   icon: PieChart        },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart2       },
    ],
  },
  {
    label: 'Shop',
    items: [
      { label: 'POS / Sales', href: '/admin/pos',      icon: Receipt     },
      { label: 'Orders',      href: '/admin/orders',   icon: ShoppingBag },
      { label: 'Products',    href: '/admin/products', icon: Package     },
      { label: 'Coupons',     href: '/admin/coupons',  icon: Tag         },
      { label: 'Customers',   href: '/admin/customers',icon: Users       },
    ],
  },
  {
    label: 'Accounts',
    items: [
      { label: 'Expenses',  href: '/admin/expenses',  icon: TrendingDown },
      { label: 'Purchases', href: '/admin/purchases', icon: Truck        },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Inquiries',      href: '/admin/inquiries', icon: Mail     },
      { label: 'Quote Requests', href: '/admin/bookings',  icon: Calendar },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

// ─── Breadcrumb builder ───────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  activity: 'Activity Log',
  analytics: 'Analytics',
  orders:    'Orders',
  products:  'Products',
  coupons:   'Coupons',
  customers: 'Customers',
  bookings:  'Quote Requests',
  inquiries: 'Inquiries',
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
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150',
        isActive ? 'admin-nav-active' : 'admin-nav-link',
      )}
    >
      <Icon size={18} aria-hidden="true" className={isActive ? 'text-primary' : 'text-dark/40'} />
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
    <div className="flex flex-col h-full admin-sidebar w-[260px] flex-shrink-0">

      {/* Brand */}
      <div className="px-4 h-16 flex items-center justify-between gap-2 border-b border-[#ECEEF2]">
        <BrandLogo variant="on-light" size="sm" href="/admin" className="max-w-[132px]" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-dark/40 hover:bg-[#F4F5F7] hover:text-dark transition-colors md:hidden flex-shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-6" aria-label="Admin navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-0.5">
            <p className="px-3 mb-1.5 text-[11px] font-medium text-dark/35 select-none">
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

      {/* View site */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark/45 hover:text-dark hover:bg-[#F4F5F7] transition-colors"
        >
          <Home size={15} className="text-dark/30" aria-hidden="true" />
          View Website ↗
        </Link>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#ECEEF2]">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#F4F5F7]">
            <Image
              src={clientAvatarForUser(userEmail)}
              alt=""
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-dark text-sm font-medium truncate">{userName}</p>
            <p className="text-dark/40 text-[11px] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-dark/50 hover:text-danger hover:bg-danger/5 transition-colors duration-150"
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
    <div className="flex h-screen overflow-hidden admin-shell">

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0">
        <Sidebar userEmail={userEmail} userName={userName} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-dark/20 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden flex flex-col shadow-xl">
            <Sidebar
              userEmail={userEmail}
              userName={userName}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <header className="admin-header h-16 flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-dark/50 hover:bg-[#F4F5F7] transition-colors flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          <span className="md:hidden text-dark font-semibold text-sm">FTO Admin</span>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
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
                  <span className="text-dark font-medium truncate text-sm">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm ml-4">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-[#ECEEF2] bg-[#F4F5F7] text-dark placeholder:text-dark/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                aria-label="Search admin"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <AdminNotifications />
            <div className="hidden sm:flex items-center gap-2.5 ml-2 pl-3 border-l border-[#ECEEF2]">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-[#F4F5F7]">
                <Image
                  src={clientAvatarForUser(userEmail)}
                  alt=""
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-dark hidden md:block">{userName.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
