interface PaymentTrustBadgesProps {
  className?: string
  variant?: 'light' | 'dark'
}

function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-label="Visa" role="img">
      <text x="0" y="13" fill="#1A1F71" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif" fontStyle="italic">
        VISA
      </text>
    </svg>
  )
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 36 22" className="h-5 w-auto" aria-label="Mastercard" role="img">
      <circle cx="13" cy="11" r="9" fill="#EB001B" />
      <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.95" />
      <path d="M18 4.8a9 9 0 0 1 0 12.4A9 9 0 0 1 18 4.8Z" fill="#FF5F00" />
    </svg>
  )
}

/** M-Pesa, Paystack, Visa, Mastercard — shown at checkout / pay / footer */
export default function PaymentTrustBadges({ className = '', variant = 'light' }: PaymentTrustBadgesProps) {
  const labelClass = variant === 'dark' ? 'text-white/50' : 'text-dark/45'

  return (
    <div className={className}>
      <p className={`text-xs font-medium mb-2.5 ${labelClass}`}>Secure payments accepted</p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white border border-dark/10 rounded-lg px-3 py-2 shadow-sm">
          <span className="w-7 h-7 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-[8px] font-bold leading-none">
            M
          </span>
          <span className="text-[#4CAF50] font-bold text-xs tracking-tight">M-PESA</span>
        </div>

        <div className="flex items-center bg-white border border-dark/10 rounded-lg px-3 py-2 shadow-sm">
          <span className="text-[#011B33] font-bold text-xs tracking-tight">
            pay<span className="text-[#3BB75E]">stack</span>
          </span>
        </div>

        <div className="flex items-center justify-center bg-white border border-dark/10 rounded-lg px-3 py-1.5 shadow-sm min-w-[52px]">
          <VisaMark />
        </div>

        <div className="flex items-center justify-center bg-white border border-dark/10 rounded-lg px-3 py-1.5 shadow-sm min-w-[52px]">
          <MastercardMark />
        </div>
      </div>
    </div>
  )
}
