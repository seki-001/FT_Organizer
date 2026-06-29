'use client'

import Link from 'next/link'
import { Sparkles, Tag, Package, ArrowRight } from 'lucide-react'
import { useSession } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

interface ShopMemberCtaProps {
  variant?: 'banner' | 'card' | 'mega'
  className?: string
}

const BENEFITS = [
  { icon: Tag, text: 'First access to sales & promos' },
  { icon: Sparkles, text: 'Organizing tips & new drops' },
  { icon: Package, text: 'Order tracking & wishlists' },
] as const

export default function ShopMemberCta({ variant = 'banner', className }: ShopMemberCtaProps) {
  const { data: session, status } = useSession()

  if (status === 'loading' || session) return null

  if (variant === 'mega') {
    return (
      <div className={cn(
        'mt-4 pt-4 border-t border-dark/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
        className,
      )}>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-dark">Join free for member perks</p>
          <p className="text-xs text-dark/55 mt-0.5">
            Sales, promos &amp; organizing tips before everyone else.
          </p>
        </div>
        <Link
          href="/register?callbackUrl=/shop"
          className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
        >
          Create Account <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'glass-panel-light rounded-3xl p-5 flex flex-col gap-4 border border-primary/15',
        className,
      )}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Members only</p>
          <h3 className="font-display text-lg text-dark leading-snug">
            Sign up for first access to sales &amp; perks
          </h3>
          <p className="text-dark/55 text-sm mt-1.5 leading-relaxed">
            Free account — unlock member promos, early sale alerts, and order history.
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-dark/70">
              <Icon size={14} className="text-primary flex-shrink-0" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/register?callbackUrl=/shop"
            className="flex-1 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3 rounded-xl transition-colors min-h-[44px]"
          >
            Create Free Account
          </Link>
          <Link
            href="/login?callbackUrl=/shop"
            className="inline-flex items-center justify-center text-dark/60 hover:text-primary text-sm font-medium py-3 px-4 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className={cn('bg-dark text-white', className)} aria-label="Create a shop account">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Free to join</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
              Create an account for first access to sales &amp; member perks
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Members get early sale alerts, exclusive promos like FIRSTORDER, organizing tips,
              and order tracking — before guest shoppers see them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end lg:min-w-[280px]">
            <ul className="flex flex-col gap-2 lg:items-end lg:text-right">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-white/75 lg:flex-row-reverse">
                  <Icon size={15} className="text-primary flex-shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
              <Link
                href="/register?callbackUrl=/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-colors min-h-[48px] shadow-lg shadow-primary/25"
              >
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link
                href="/login?callbackUrl=/shop"
                className="inline-flex items-center justify-center text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
