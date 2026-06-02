'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronRight, Menu, Search } from 'lucide-react'
import { buildAdminBreadcrumb } from '@/lib/admin-nav'
import { cn } from '@/lib/utils'

interface AdminTopBarProps {
  userName: string
  onMenuOpen: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export default function AdminTopBar({
  userName,
  onMenuOpen,
  searchQuery,
  onSearchChange,
}: AdminTopBarProps) {
  const pathname = usePathname()
  const breadcrumb = buildAdminBreadcrumb(pathname)
  const firstName = userName.split(' ')[0] ?? 'Admin'

  return (
    <header className="bg-white border-b border-dark/8 flex-shrink-0 z-10">
      <div className="h-14 flex items-center px-4 sm:px-6 gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation"
            className="md:hidden tap-target w-11 h-11 rounded-lg flex items-center justify-center text-dark/50 hover:bg-muted"
        >
          <Menu size={20} />
        </button>

        <span className="md:hidden font-display text-primary font-bold">FTO</span>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0 flex-1">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight size={13} className="text-dark/25 flex-shrink-0" aria-hidden="true" />}
              {i < breadcrumb.length - 1 ? (
                <Link href={crumb.href} className="text-dark/40 hover:text-primary text-xs truncate">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-dark font-semibold text-sm truncate">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <span className="sm:hidden font-semibold text-dark text-sm flex-1 truncate">
          {breadcrumb[breadcrumb.length - 1]?.label ?? 'Admin'}
        </span>

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <div className="relative hidden lg:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search orders, clients…"
              className={cn(
                'w-56 xl:w-72 pl-9 pr-3 py-2 text-sm rounded-xl border border-dark/10',
                'bg-[#FAFAF8] placeholder:text-dark/35 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30',
              )}
              aria-label="Search admin"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications (preview)"
              className="relative tap-target w-11 h-11 rounded-lg flex items-center justify-center text-dark/40 hover:bg-muted hover:text-dark"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" aria-hidden="true" />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-dark/8">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase">
              {userName?.[0] ?? 'F'}
            </div>
            <span className="text-sm font-medium text-dark hidden md:block">{firstName}</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden px-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-dark/10 bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search admin"
          />
        </div>
      </div>
    </header>
  )
}
