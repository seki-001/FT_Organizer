import type { Metadata } from 'next'
import PayPageClient from './PayPageClient'
import { getMpesaConfig } from '@/lib/payments/config'

export const metadata: Metadata = {
  title: 'Pay | Faith The Organizer',
  description: 'Pay for your order via M-Pesa Paybill, Till, or card through Paystack.',
}

export default function PayPage() {
  const mpesa = getMpesaConfig()

  const paybillInfo = {
    paybill: mpesa.displayPaybill,
    till: mpesa.displayTill || undefined,
    accountName: mpesa.accountName,
    mode: mpesa.mode,
  }

  return <PayPageClient paybillInfo={paybillInfo} />
}
