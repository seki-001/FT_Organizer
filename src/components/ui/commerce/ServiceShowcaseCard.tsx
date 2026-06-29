import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceShowcaseCardProps {
  title: string
  description: string
  image: string
  href: string
  priceFrom?: string
  className?: string
  /** Use contain + white pad for flat cartoon PNGs */
  illustration?: boolean
}

export default function ServiceShowcaseCard({
  title,
  description,
  image,
  href,
  priceFrom,
  className,
  illustration = false,
}: ServiceShowcaseCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'sfs-card group flex flex-col overflow-hidden h-full',
        className,
      )}
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden m-3 mb-0 img-frame-lg',
          illustration ? 'bg-gradient-to-br from-primary/5 via-white to-accent/10 p-4' : 'img-zoom',
        )}
      >
        {illustration ? (
          <Image
            src={image}
            alt={title}
            width={400}
            height={300}
            className="w-full h-full object-contain"
          />
        ) : (
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        )}
      </div>
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-2 glass-subtle mx-3 mb-3 rounded-2xl">
        <h3 className="font-display text-xl text-dark group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-dark/55 text-sm leading-relaxed flex-1">{description}</p>
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-dark/6">
          {priceFrom ? (
            <span className="text-xs font-mono text-dark/45">{priceFrom}</span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Learn more <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
