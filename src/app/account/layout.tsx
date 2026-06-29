'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingBag, Calendar, Heart,
  User, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { useSession, useSignOut } from '@/context/AuthContext'
import { clientAvatarForUser } from '@/lib/avatars'
import { cn } from '@/lib/utils'

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/account',           icon: LayoutDashboard },
  { label: 'My Orders',   href: '/account/orders',    icon: ShoppingBag },
  { label: 'My Bookings', href: '/account/bookings',  icon: Calendar },
  { label: 'Wishlist',    href: '/account/wishlist',  icon: Heart },
  { label: 'Profile',     href: '/account/profile',   icon: User },
]

// ─── Sidebar nav link ─────────────────────────────────────────────────────────

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: typeof NAV_ITEMS[0]
  pathname: string
  onClick?: () => void
}) {
  const isActive = pathname === item.href
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-dark/60 hover:bg-muted hover:text-dark'
      )}
    >
      <Icon size={18} aria-hidden="true" />
      {item.label}
    </Link>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession()
  const signOut  = useSignOut()
  const router   = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(pathname))
    }
  }, [status, router, pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center glass-grid-bg">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  const userAvatar = clientAvatarForUser(session?.user.email ?? session?.user.name ?? 'guest')

  return (
    <div className="min-h-screen glass-grid-bg">
      {/* Mobile header bar */}
      <div className="md:hidden sticky top-16 z-30 glass-panel-light border-b border-white/50 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-dark text-sm">
          {session?.user.name ?? 'My Account'}
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 rounded-lg text-dark/60 hover:bg-muted transition-colors"
          aria-label="Toggle account menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile slide-down nav */}
      {mobileOpen && (
        <div className="md:hidden glass-panel-light border-b border-white/50 px-4 py-3 flex flex-col gap-1 sticky top-[105px] z-20">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); signOut() }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-danger/80 hover:bg-danger/10 transition-colors duration-150"
          >
            <LogOut size={18} aria-hidden="true" />
            Sign Out
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-60 flex-shrink-0">
            <div className="sticky top-24 glass-panel-light rounded-2xl p-4 flex flex-col gap-1">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-dark/8">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white border border-white/80">
                  <Image
                    src={userAvatar}
                    alt=""
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{session?.user.name}</p>
                  <p className="text-xs text-dark/40 truncate">{session?.user.email}</p>
                </div>
              </div>

              {/* Nav links */}
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}

              {/* Sign out */}
              <div className="mt-2 pt-2 border-t border-dark/8">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-danger/80 hover:bg-danger/10 transition-colors duration-150"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Page content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  )
}
