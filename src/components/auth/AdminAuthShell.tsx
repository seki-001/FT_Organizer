import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import AuthAlert from './AuthAlert'
import { ADMIN_AUTH_NOTICE } from '@/lib/admin-auth-ui'
import { cn } from '@/lib/utils'

interface AdminAuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
  showLaunchNotice?: boolean
  noticeTitle?: string
  noticeBody?: string
  className?: string
}

export default function AdminAuthShell({
  title,
  subtitle,
  children,
  footer,
  showLaunchNotice = true,
  noticeTitle = 'Preview mode',
  noticeBody = ADMIN_AUTH_NOTICE,
  className,
}: AdminAuthShellProps) {
  return (
    <div
      className={cn(
        'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#ebeae6] border-y border-dark/10',
        className,
      )}
    >
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 md:py-14">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-dark/45 hover:text-dark w-fit transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to website
          </Link>

          <div className="bg-white rounded-2xl border border-dark/10 shadow-[0_8px_30px_rgba(26,26,26,0.06)] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-dark/20" aria-hidden="true" />

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-full rounded-xl bg-surface border border-dark/8 px-4 py-3">
                  <BrandLogo heightClass="h-9 sm:h-10" priority href="/" />
                  <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-dark/45">
                    <Shield size={12} className="text-primary" aria-hidden="true" />
                    Staff portal
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h1 className="font-display text-xl sm:text-2xl text-dark">{title}</h1>
                  <p className="text-sm text-dark/55 leading-relaxed max-w-sm mx-auto">{subtitle}</p>
                </div>
              </div>

              {showLaunchNotice ? (
                <AuthAlert variant="info" title={noticeTitle}>
                  {noticeBody}
                </AuthAlert>
              ) : null}

              {children}

              {footer ? <div className="pt-4 border-t border-dark/8">{footer}</div> : null}
            </div>
          </div>

          <p className="text-center text-[11px] text-dark/40 leading-relaxed px-2">
            Authorized staff only. Activity may be logged when admin auth is enabled.
          </p>
        </div>
      </main>
    </div>
  )
}
