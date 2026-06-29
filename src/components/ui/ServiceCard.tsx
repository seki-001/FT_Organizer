import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { IMG } from '@/lib/image-placeholders'

export interface ServiceCardService {
  slug: string
  title: string
  priceFrom: number
  image?: string
  duration?: string
}

interface ServiceCardProps {
  service: ServiceCardService
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden img-zoom">
        <Image
          src={service.image ?? IMG.services.default}
          alt={service.title}
          fill
          className="object-cover"
          sizes="400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
        <span className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-mono px-2.5 py-1 rounded-full">
          From {formatPrice(service.priceFrom)}
        </span>
      </div>

      <div className="p-5">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Organizing Service</p>
        <p className="text-white font-semibold text-sm group-hover:text-accent/90 transition-colors">{service.title}</p>
        <p className="text-white/40 text-xs mt-1">{service.duration ?? 'Half day – 2 days'}</p>
      </div>
    </Link>
  )
}
