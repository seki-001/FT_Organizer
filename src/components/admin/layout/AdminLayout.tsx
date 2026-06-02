'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'

export default function AdminLayout({
  children,
  userEmail,
  userName,
}: {
  children: React.ReactNode
  userEmail: string
  userName: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F0EB]">
      <div className="hidden md:flex flex-col flex-shrink-0 shadow-sm">
        <AdminSidebar userEmail={userEmail} userName={userName} />
      </div>

      {sidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-dark/30 z-40 md:hidden backdrop-blur-sm"
            aria-label="Close menu overlay"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl">
            <AdminSidebar userEmail={userEmail} userName={userName} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopBar
          userName={userName}
          onMenuOpen={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
