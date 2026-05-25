import type { Metadata } from 'next'
import Link from 'next/link'
import LegalLayout from '@/components/layout/LegalLayout'
import { DELIVERY_OPTIONS, COMPANY } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shipping & Returns | Faith The Organizer',
  description:
    'Shipping, delivery and returns policy for the Faith The Organizer online shop. Same-day Nairobi delivery available. From Clutter to Order.',
}

export default function ShippingAndReturnsPage() {
  return (
    <LegalLayout
      title="Shipping & Returns"
      subtitle="Everything you need to know about delivery, tracking, and our returns policy."
      lastUpdated="March 2025"
    >

      {/* TODO: Client to confirm final policy wording before launch */}

      <h2>1. Delivery Areas &amp; Fees</h2>
      <p>
        We currently offer three delivery options for all shop orders:
      </p>
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Coverage</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          {DELIVERY_OPTIONS.map((opt) => (
            <tr key={opt.id}>
              <td><strong>{opt.label}</strong></td>
              <td>{opt.description}</td>
              <td>{opt.price === 0 ? 'Free' : formatPrice(opt.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Nairobi same-day delivery</strong> is available for orders placed before 2:00 pm,
        Monday to Saturday. Coverage includes Nairobi CBD, Westlands, Karen, Kilimani, Lavington,
        Parklands, Runda, Gigiri, and surrounding areas. If you are unsure whether your area qualifies,
        please{' '}
        <Link href="/contact">contact us</Link>{' '}
        before placing your order.
      </p>
      <p>
        <strong>Pick-up</strong> is available at no charge from our Milestone Business Centre location
        (Ground Floor, Shop A5, inside Total Petrol Station, Membley, Northern Bypass). Please
        WhatsApp us before collecting to confirm your order is ready.
      </p>

      <h2>2. Delivery Timeframes</h2>
      {/* TODO: Client to confirm exact cut-off times and operational days */}
      <p>
        Estimated delivery times are as follows:
      </p>
      <ul>
        <li>
          <strong>Nairobi Same Day:</strong> Orders placed before 2:00 pm are delivered the same
          day. Orders placed after 2:00 pm are delivered the next business day.
        </li>
        <li>
          <strong>Standard Nationwide:</strong> 2–4 business days after dispatch. Remote areas
          (outside main towns) may take up to 5–7 business days.
        </li>
        <li>
          <strong>Pick-Up:</strong> Same day or next business day — we will WhatsApp you when your
          order is ready for collection.
        </li>
      </ul>
      <p>
        All timeframes are estimates. We are not responsible for delays caused by courier services,
        public holidays, or events outside our control. We will proactively notify you of any
        significant delay.
      </p>

      <h2>3. Order Tracking</h2>
      {/* TODO: Client to confirm tracking method (WhatsApp updates vs. courier portal) */}
      <p>
        Once your order is dispatched, you will receive a WhatsApp message with your tracking
        information. For nationwide orders, a courier tracking number will be provided. For
        Nairobi same-day orders, our delivery team will contact you directly to confirm a delivery
        window.
      </p>
      <p>
        If you have not received a dispatch notification within 24 hours of placing your order,
        please contact us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or via{' '}
        <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
      </p>

      <h2>4. Returns Policy</h2>
      {/* TODO: Client to confirm 7-day return window and exact conditions */}
      <p>
        We accept returns within <strong>7 days of delivery</strong> under the following conditions:
      </p>
      <ul>
        <li>The item is unused and in its original, undamaged packaging.</li>
        <li>You have proof of purchase (order reference number).</li>
        <li>The return request is initiated within 7 days of the confirmed delivery date.</li>
      </ul>
      <p>
        Items that cannot be returned include:
      </p>
      <ul>
        <li>Products that have been opened, used, or assembled.</li>
        <li>Sale items (unless faulty or damaged on arrival).</li>
        <li>Personalised or custom-order products.</li>
      </ul>
      <p>
        To initiate a return, send us a WhatsApp message at{' '}
        <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer">
          {COMPANY.whatsapp}
        </a>{' '}
        with your order reference number and clear photos of the item. We will respond within one
        business day.
      </p>

      <h2>5. Damaged or Wrong Items</h2>
      {/* TODO: Client to confirm compensation process */}
      <p>
        If you receive an item that is damaged in transit or different from what you ordered, please
        contact us within <strong>48 hours of delivery</strong> with photos and your order reference.
        We will either:
      </p>
      <ul>
        <li>Send a free replacement as soon as possible, or</li>
        <li>Issue a full refund including the original delivery fee.</li>
      </ul>
      <p>
        We take quality control seriously. All orders are inspected before dispatch, but occasionally
        courier handling can cause damage. We apologise in advance and will make it right.
      </p>

      <h2>6. Refunds</h2>
      {/* TODO: Client to confirm refund timeline and method */}
      <p>
        Approved refunds are processed within <strong>3–5 business days</strong> of receiving and
        inspecting the returned item. Refunds are issued to the original payment method:
      </p>
      <ul>
        <li>
          <strong>M-Pesa payments:</strong> Refunded to the originating M-Pesa number.
        </li>
        <li>
          <strong>Card payments:</strong> Refunded to the originating card via Flutterwave.
          Bank processing times may add 2–3 additional business days.
        </li>
        <li>
          <strong>Cash on Delivery:</strong> Refunded via M-Pesa to the number provided at delivery.
        </li>
      </ul>
      <p>
        For any refund queries, email us at{' '}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your order reference.
      </p>

    </LegalLayout>
  )
}
