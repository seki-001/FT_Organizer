import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Receipt,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Package,
  Boxes,
  ShoppingCart,
  Wallet,
  ListChecks,
  Gift,
  BarChart3,
  Settings,
} from 'lucide-react'

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Route exists and is implemented */
  implemented?: boolean
}

export interface AdminNavSection {
  label: string
  items: AdminNavItem[]
}

/** Primary sidebar — Stage 12 Figma modules */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, implemented: true },
      { label: 'Reports', href: '/admin/reports', icon: BarChart3, implemented: true },
    ],
  },
  {
    label: 'Clients & services',
    items: [
      { label: 'Clients', href: '/admin/customers', icon: Users, implemented: true },
      { label: 'Bookings', href: '/admin/bookings', icon: Calendar, implemented: true },
      { label: 'Quotations', href: '/admin/quotations', icon: FileText, implemented: true },
      { label: 'Follow-ups', href: '/admin/follow-ups', icon: ListChecks, implemented: true },
      { label: 'Loyalty Program', href: '/admin/loyalty', icon: Gift, implemented: true },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Invoices', href: '/admin/invoices', icon: Receipt, implemented: true },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, implemented: true },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard, implemented: true },
      { label: 'Debtors', href: '/admin/debtors', icon: AlertCircle, implemented: true },
      { label: 'Expenses', href: '/admin/expenses', icon: Wallet, implemented: true },
    ],
  },
  {
    label: 'Inventory & shop',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package, implemented: true },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes, implemented: true },
      { label: 'Purchases', href: '/admin/purchases', icon: ShoppingCart, implemented: true },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings, implemented: true },
    ],
  },
]

export const ADMIN_PAGE_LABELS: Record<string, string> = {
  analytics: 'Analytics',
  reports: 'Reports',
  customers: 'Clients',
  bookings: 'Bookings',
  quotations: 'Quotations',
  invoices: 'Invoices',
  orders: 'Orders',
  payments: 'Payments',
  debtors: 'Debtors',
  products: 'Products',
  inventory: 'Inventory',
  purchases: 'Purchases',
  expenses: 'Expenses',
  'follow-ups': 'Follow-ups',
  loyalty: 'Loyalty Program',
  coupons: 'Coupons',
  blog: 'Blog',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
}

export function buildAdminBreadcrumb(pathname: string): { label: string; href: string }[] {
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = [{ label: 'Admin', href: '/admin' }]
  segments.forEach((seg, i) => {
    crumbs.push({
      label: ADMIN_PAGE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: '/admin/' + segments.slice(0, i + 1).join('/'),
    })
  })
  return crumbs
}
