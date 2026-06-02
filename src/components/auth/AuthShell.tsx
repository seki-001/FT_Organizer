import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import AuthAlert from './AuthAlert'
import { CUSTOMER_AUTH_NOTICE } from '@/lib/auth-ui'

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
  showLaunchNotice?: boolean
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  showLaunchNotice = true,
}: AuthShellProps) {
  return (
    <main className="bg-surface min-h-[calc(100vh-4rem)]">
      <div className="section-container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">
          {/* Lifestyle panel — desktop */}
          <aside className="hidden lg:flex lg:col-span-5 flex-col">
            <div className="relative flex-1 min-h-[520px] rounded-card overflow-hidden border border-dark/8 shadow-card">
              <Image
                src="/images/hero/transformation-after.jpg"
                alt="Organized living space after professional organizing"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 0px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/35 to-dark/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-4">
                  <Sparkles size={14} className="text-accent" aria-hidden="true" />
                  Faith The Organizer
                </p>
                <p className="font-display text-3xl leading-tight">
                  Calm spaces.
                  <br />
                  Clear minds.
                </p>
                <p className="text-sm text-white/75 mt-4 max-w-sm leading-relaxed">
                  Manage bookings, orders, and your organizing journey — all in one place when accounts go live.
                </p>
              </div>
            </div>
          </aside>

          {/* Form column */}
          <div className="lg:col-span-7 flex flex-col">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-dark mb-6 w-fit transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to website
            </Link>

            {/* Mobile lifestyle strip */}
            <div className="lg:hidden relative h-36 rounded-card overflow-hidden border border-dark/8 mb-6">
              <Image
                src="/images/hero/hero-main.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-dark/50" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-xl text-white">
                From clutter to order
              </p>
            </div>

            <div className="card-surface border border-dark/8 p-6 sm:p-8 md:p-10 flex flex-col gap-6 flex-1">
              <div className="flex justify-center pb-2">
                <BrandLogo heightClass="h-11 sm:h-12" priority href="/" />
              </div>

              <div className="text-center space-y-2">
                <h1 className="font-display text-2xl sm:text-3xl text-dark">{title}</h1>
                <p className="text-sm text-dark/55 leading-relaxed">{subtitle}</p>
              </div>

              {showLaunchNotice ? (
                <AuthAlert variant="info" title="Preview mode">
                  {CUSTOMER_AUTH_NOTICE}
                </AuthAlert>
              ) : null}

              {children}

              {footer ? <div className="pt-2 border-t border-dark/8">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
