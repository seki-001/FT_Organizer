import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface DarkProductCardProps {
  product: Product
}

export default function DarkProductCard({ product }: DarkProductCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 transition-colors"
    >
      <div className="relative h-52 overflow-hidden img-zoom">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        {product.salePrice && (
          <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
          {product.category.replace(/-/g, ' ')}
        </p>
        <p className="text-white font-semibold text-sm mb-2 line-clamp-1 group-hover:text-accent/90 transition-colors">
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-white font-mono text-sm">
            {formatPrice(product.salePrice ?? product.price)}
          </p>
          {product.salePrice && (
            <p className="text-white/30 font-mono text-xs line-through">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
