import type { Metadata } from 'next'
import Link from 'next/link'
import LegalLayout from '@/components/layout/LegalLayout'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Faith The Organizer',
  description:
    "Terms and conditions for using Faith The Organizer's website, booking services and purchasing products. From Clutter to Order.",
}

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout
      title="Terms &amp; Conditions"
      subtitle="Please read these terms carefully before using our services or website."
      lastUpdated="March 2025"
    >

      {/* TODO: Have a lawyer review these terms before launch */}

      <p>
        These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the Faith The Organizer
        website at <strong>{COMPANY.website}</strong> (&ldquo;the Website&rdquo;) and your engagement
        with our organizing services and shop. By accessing the Website, booking a service, or making
        a purchase, you accept these Terms in full.
      </p>
      <p>
        Faith The Organizer is a business registered in Kenya, operating from{' '}
        {COMPANY.address}, {COMPANY.addressFull}.
      </p>

      <h2>1. Services Terms</h2>
      {/* TODO: Confirm service terms with client, including scope, liability, and insurance */}
      <p>
        Faith The Organizer provides professional home and office organizing services in Nairobi,
        Kenya. By booking a service, you agree to the following:
      </p>
      <ul>
        <li>
          <strong>Scope of work:</strong> The scope of each service is agreed during the initial
          consultation. Any material changes to the agreed scope must be discussed and confirmed
          before work proceeds.
        </li>
        <li>
          <strong>Access to property:</strong> You agree to provide safe and reasonable access to
          the property at the agreed time. We reserve the right to reschedule if access is not
          available as arranged.
        </li>
        <li>
          <strong>Your responsibility:</strong> You are responsible for informing us of any items
          of particular value, sentimental significance, or that must not be moved or touched. We
          are not responsible for loss or damage to undisclosed valuable items.
        </li>
        <li>
          <strong>Confidentiality:</strong> A signed confidentiality agreement is required before
          all service engagements. See our{' '}
          <Link href="/privacy-policy">Privacy Policy</Link> for full details.
        </li>
        <li>
          <strong>Safety:</strong> We reserve the right to refuse or halt a service if working
          conditions are unsafe for our team.
        </li>
      </ul>

      <h2>2. Booking and Cancellation Policy</h2>
      {/* TODO: Confirm cancellation window and any deposit requirements with client */}
      <p>
        <strong>Booking:</strong> Service bookings are confirmed once a booking reference is issued
        via our website or WhatsApp. A booking is not confirmed until you receive written confirmation
        from us.
      </p>
      <p>
        <strong>Rescheduling:</strong> You may reschedule a booking at no charge if you notify us at
        least <strong>48 hours in advance</strong>. Rescheduling requests received with less than
        48 hours&apos; notice may incur a rescheduling fee.
      </p>
      <p>
        <strong>Cancellations:</strong>
      </p>
      <ul>
        <li>
          Cancellations made more than 48 hours before the booking: No charge.
        </li>
        <li>
          Cancellations made within 48 hours: May be subject to a cancellation fee of up to 25%
          of the quoted service price to cover preparation costs.
        </li>
        <li>
          No-shows (we arrive and cannot access the property): Full session fee applies.
        </li>
      </ul>
      <p>
        We reserve the right to cancel or reschedule a booking due to unforeseen circumstances
        (illness, emergency). In such cases, we will notify you as soon as possible and offer an
        alternative date or a full refund.
      </p>

      <h2>3. Shop Terms — Purchases &amp; Payments</h2>
      {/* TODO: Confirm shop terms including any warranty or quality guarantees */}
      <p>
        <strong>Orders:</strong> When you place an order through our shop, you are making an offer
        to purchase the selected products. We reserve the right to decline or cancel an order if a
        product is out of stock or if we suspect fraudulent activity. You will be notified and
        fully refunded in such cases.
      </p>
      <p>
        <strong>Pricing:</strong> All prices are displayed in Kenyan Shillings (KSh) and include
        applicable taxes. Delivery fees are stated separately during checkout. Prices may change
        without notice, but the price at the time of your confirmed order will always be honoured.
      </p>
      <p>
        <strong>Payment:</strong> We accept M-Pesa (via STK Push), card payments (Visa/Mastercard
        via Flutterwave), and Cash on Delivery for Nairobi orders. Payment must be completed before
        dispatch, except for Cash on Delivery orders.
      </p>
      <p>
        <strong>Returns &amp; Refunds:</strong> Please see our{' '}
        <Link href="/shipping-and-returns">Shipping &amp; Returns Policy</Link>{' '}
        for full details on returns, exchanges, and refunds.
      </p>

      <h2>4. Intellectual Property</h2>
      {/* TODO: Confirm IP ownership and any licensed content with client */}
      <p>
        All content on this Website — including text, images, videos, logos, graphics, and the
        &ldquo;From Clutter to Order&rdquo; tagline — is the intellectual property of Faith The
        Organizer and is protected under Kenyan and international copyright law.
      </p>
      <p>You may not:</p>
      <ul>
        <li>Reproduce, copy, or republish any content from this Website without written permission.</li>
        <li>Use our brand name, logo, or tagline in any commercial context without authorization.</li>
        <li>Scrape, crawl, or extract data from the Website for commercial purposes.</li>
      </ul>
      <p>
        For media enquiries, collaboration requests, or to request permission to use our content,
        please contact us at{' '}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>

      <h2>5. Limitation of Liability</h2>
      {/* TODO: Review liability cap and insurance coverage with lawyer */}
      <p>
        To the maximum extent permitted by Kenyan law, Faith The Organizer shall not be liable for:
      </p>
      <ul>
        <li>
          Indirect, incidental, or consequential losses arising from the use of our services or
          Website.
        </li>
        <li>
          Loss or damage to items not disclosed as valuable prior to a service session.
        </li>
        <li>
          Delays in delivery caused by third-party courier services or circumstances beyond our
          reasonable control (including floods, strikes, or public health emergencies).
        </li>
        <li>
          Technical failures of the Website including downtime, errors, or data loss.
        </li>
      </ul>
      <p>
        Our total liability to you for any claim arising from these Terms or our services shall not
        exceed the value of the specific service or product that gave rise to the claim.
      </p>
      <p>
        Nothing in these Terms limits our liability for death or personal injury caused by our
        negligence, or for fraud or fraudulent misrepresentation.
      </p>

      <h2>6. Governing Law</h2>
      <p>
        These Terms and Conditions are governed by and construed in accordance with the laws of the{' '}
        <strong>Republic of Kenya</strong>. Any disputes arising out of or in connection with these
        Terms shall be subject to the exclusive jurisdiction of the courts of Kenya.
      </p>
      <p>
        We encourage you to raise any concern with us directly before pursuing formal legal action.
        Most issues can be resolved quickly and amicably — please{' '}
        <Link href="/contact">contact us</Link> or reach out via{' '}
        <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
      </p>

      <hr />
      <p className="text-sm text-dark/40">
        If you have any questions about these Terms, contact us at{' '}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>

    </LegalLayout>
  )
}
