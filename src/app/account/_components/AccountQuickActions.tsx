import Link from 'next/link'
import { Calendar, ShoppingBag, MessageCircle } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

const ACTIONS = [
  {
    href: '/book',
    label: 'Book another service',
    description: 'Schedule a site visit or service',
    icon: Calendar,
    primary: true,
  },
  {
    href: '/shop',
    label: 'Shop products',
    description: 'Curated organizing essentials',
    icon: ShoppingBag,
    primary: false,
  },
  {
    href: COMPANY.whatsappLink,
    label: 'Contact support',
    description: 'WhatsApp Faith’s team',
    icon: MessageCircle,
    external: true,
    primary: false,
  },
] as const

export default function AccountQuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading">
      <h2 id="quick-actions-heading" className="sr-only">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          const className = action.primary
            ? 'card-surface border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3 hover:border-primary/40 transition-colors group'
            : 'card-surface border border-dark/8 p-4 flex flex-col gap-3 hover:shadow-card-hover transition-shadow group'

          const inner = (
            <>
              <span
                className={`flex w-10 h-10 items-center justify-center rounded-full ${
                  action.primary ? 'bg-primary text-white' : 'bg-muted text-primary'
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-dark text-sm group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-dark/50 mt-0.5">{action.description}</p>
              </div>
            </>
          )

          if ('external' in action && action.external) {
            return (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            )
          }

          return (
            <Link key={action.label} href={action.href} className={className}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
