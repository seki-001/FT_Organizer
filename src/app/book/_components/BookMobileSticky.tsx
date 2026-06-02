'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'
import MobileStickyBar from '@/components/ui/MobileStickyBar'
import { formatPrice } from '@/lib/utils'
import { SITE_VISIT } from '@/lib/constants'

export default function BookMobileSticky() {
  return (
    <MobileStickyBar>
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <p className="hidden sm:block text-xs text-dark/50 flex-1 min-w-0 leading-snug">
          Site visit {formatPrice(SITE_VISIT.feeKsh)}
        </p>
        <Link
          href="#booking-form"
          className="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-button bg-primary text-white font-semibold text-sm hover:bg-danger transition-colors"
        >
          <Calendar size={18} aria-hidden="true" />
          Continue booking
        </Link>
      </div>
    </MobileStickyBar>
  )
}
