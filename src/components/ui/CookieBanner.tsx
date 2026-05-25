'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'ft_cookies_accepted'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show after mount to avoid SSR mismatch
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="
        fixed bottom-0 left-0 right-0 z-[60]
        bg-dark text-white
        px-4 py-4 sm:py-3
        shadow-2xl
        border-t border-white/10
        flex flex-col sm:flex-row items-start sm:items-center
        gap-4 sm:gap-6
      "
    >
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <Cookie size={20} className="text-accent flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <p className="text-sm text-white/80 leading-relaxed">
          We use cookies to improve your experience and analyse site traffic.
          No personal data is sold or shared with third parties.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/privacy-policy"
          className="text-white/50 hover:text-white text-xs underline underline-offset-2 transition-colors"
        >
          Learn More
        </Link>
        <button
          type="button"
          onClick={accept}
          className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors duration-200 min-h-[36px]"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
