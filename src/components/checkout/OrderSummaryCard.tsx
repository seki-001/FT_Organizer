'use client'

import Image from 'next/image'
import { Lock, Shield } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface OrderSummaryCardProps {
  deliveryFee: number
  promoDiscount?: number
  className?: string
  showTrust?: boolean
}

export default function OrderSummaryCard({
  deliveryFee,
  promoDiscount = 0,
  className,
  showTrust = true,
}: OrderSummaryCardProps) {
  const { items, totalPrice } = useCart()
  const finalTotal = totalPrice - promoDiscount + deliveryFee

  return (
    <div className={className}>
      <div className="card-surface border border-dark/8 p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="font-display text-lg text-dark">Order summary</h2>

        <ul className="flex flex-col gap-3 max-h-64 overflow-y-auto">
          {items.map((item) => {
            const unitPrice =
              (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0)
            return (
              <li
                key={`${item.product.id}-${item.variant?.id ?? 'base'}`}
                className="flex items-center gap-3"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dark line-clamp-1">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-[10px] text-dark/45">{item.variant.value}</p>
                  )}
                </div>
                <span className="font-mono text-xs font-semibold text-dark shrink-0">
                  {formatPrice(unitPrice * item.quantity)}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-dark/8 pt-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-dark/60">
            <span>Subtotal</span>
            <span className="font-mono text-dark">{formatPrice(totalPrice)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span className="font-mono">−{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-dark/60">
            <span>Delivery</span>
            <span className="font-mono">
              {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between items-center font-semibold text-dark border-t border-dark/8 pt-3 mt-1">
            <span>Total</span>
            <span className="font-mono text-lg">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {showTrust && (
          <div className="flex flex-col gap-2 pt-1 text-xs text-dark/45">
            <p className="flex items-center gap-2">
              <Lock size={12} aria-hidden="true" />
              Secure checkout — your details stay private
            </p>
            <p className="flex items-center gap-2">
              <Shield size={12} aria-hidden="true" />
              Faith The Organizer — trusted Nairobi service
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
