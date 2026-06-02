import Link from 'next/link'
import { getServiceIcon } from '@/lib/service-icons'
import { formatPrice } from '@/lib/utils'

interface ServiceCardProps {
  slug: string
  title: string
  icon: string
  priceFrom: number
  description?: string
}

export default function ServiceCard({ slug, title, icon, priceFrom, description }: ServiceCardProps) {
  const Icon = getServiceIcon(icon)

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col p-6 gap-4 min-w-[240px] xl:min-w-0 snap-start">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
        <Icon size={20} className="text-dark/50" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-dark leading-snug">{title}</h3>

      {/* Placeholder description */}
      <p className="text-dark/60 text-sm leading-relaxed line-clamp-3">
        {description ?? 'Professional, calm support tailored to your space and timeline.'}
      </p>

      {/* Price + link row */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-mono text-sm text-primary">
          From {formatPrice(priceFrom)}
        </span>
        <Link
          href={`/services/${slug}`}
          className="text-dark/50 hover:text-dark text-sm font-medium"
          aria-label={`Learn more about ${title}`}
        >
          Learn more →
        </Link>
      </div>
    </article>
  )
}
