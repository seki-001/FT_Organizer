import Image from 'next/image'

interface PaymentTrustBadgesProps {
  className?: string
  variant?: 'light' | 'dark'
}

/** M-Pesa, Paystack, Visa, Mastercard — shown at checkout / pay / footer */
export default function PaymentTrustBadges({ className = '', variant = 'light' }: PaymentTrustBadgesProps) {
  const labelClass = variant === 'dark' ? 'text-white/50' : 'text-dark/45'

  return (
    <div className={className}>
      <p className={`text-xs font-medium mb-2.5 ${labelClass}`}>Secure payments accepted</p>
      <div className="flex flex-wrap items-center gap-3">
        {/* M-Pesa */}
        <div className="flex items-center gap-1.5 bg-white border border-dark/10 rounded-lg px-3 py-2 shadow-sm">
          <span className="w-7 h-7 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-[8px] font-bold leading-none">
            M
          </span>
          <span className="text-[#4CAF50] font-bold text-xs tracking-tight">M-PESA</span>
        </div>

        {/* Paystack */}
        <div className="flex items-center bg-white border border-dark/10 rounded-lg px-3 py-2 shadow-sm">
          <span className="text-[#011B33] font-bold text-xs tracking-tight">
            pay<span className="text-[#3BB75E]">stack</span>
          </span>
        </div>

        {/* Visa */}
        <div className="flex items-center bg-white border border-dark/10 rounded-lg px-3 py-1.5 shadow-sm">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/320px-Visa_Inc._logo.svg.png"
            alt="Visa"
            width={44}
            height={14}
            className="h-3.5 w-auto object-contain"
            unoptimized
          />
        </div>

        {/* Mastercard */}
        <div className="flex items-center bg-white border border-dark/10 rounded-lg px-3 py-1.5 shadow-sm">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/320px-Mastercard-logo.svg.png"
            alt="Mastercard"
            width={36}
            height={22}
            className="h-5 w-auto object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
