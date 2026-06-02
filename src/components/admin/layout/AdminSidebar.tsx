'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LogOut, X } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import { ADMIN_NAV_SECTIONS, type AdminNavItem } from '@/lib/admin-nav'
import { cn } from '@/lib/utils'

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: AdminNavItem
  pathname: string
  onClick?: () => void
}) {
  const Icon = item.icon
  const isActive =
    pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        isActive ? 'bg-primary text-white shadow-sm' : 'text-dark/60 hover:text-dark hover:bg-muted',
      )}
    >
      <Icon size={17} aria-hidden="true" />
      <span className="flex-1 truncate">{item.label}</span>
      {!item.implemented && (
        <span className="text-[9px] uppercase tracking-wide opacity-60 font-semibold">Soon</span>
      )}
    </Link>
  )
}

export default function AdminSidebar({
  userEmail,
  userName,
  onClose,
}: {
  userEmail: string
  userName: string
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col h-full bg-white w-[268px] flex-shrink-0 border-r border-dark/8">
      <div className="px-4 py-4 border-b border-dark/8 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 rounded-xl bg-[#F7F2EC]/80 px-3 py-2.5">
          <BrandLogo heightClass="h-9" href="/admin" className="max-w-full" />
          <p className="text-dark/45 text-[11px] mt-1">Business console</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden flex w-8 h-8 items-center justify-center rounded-lg text-dark/40 hover:bg-muted"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5" aria-label="Admin navigation">
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-0.5">
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-dark/30 select-none">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3 border-t border-dark/8 pt-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark/45 hover:text-dark hover:bg-muted"
        >
          <Home size={15} aria-hidden="true" />
          View website
        </Link>
      </div>

      <div className="px-3 py-3 border-t border-dark/8">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase">
            {userName?.[0] ?? 'F'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-dark text-xs font-medium truncate">{userName}</p>
            <p className="text-dark/40 text-[11px] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/login')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-dark/50 hover:text-danger hover:bg-danger/5"
        >
          <LogOut size={15} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )
}
