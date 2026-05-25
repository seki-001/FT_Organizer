import type { Metadata } from 'next'
import LegalLayout from '@/components/layout/LegalLayout'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy | Faith The Organizer',
  description:
    'Privacy policy for Faith The Organizer — how we collect, use and protect your personal information. From Clutter to Order.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
      lastUpdated="March 2025"
    >

      {/* TODO: Have a lawyer review this policy before launch */}

      <p>
        Faith The Organizer (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates
        the website at <strong>{COMPANY.website}</strong> and provides home and office organizing
        services and products in Nairobi, Kenya. This Privacy Policy explains how we collect,
        use, and protect the information you share with us.
      </p>
      <p>
        By using our website, booking our services, or purchasing from our shop, you agree to the
        terms of this policy.
      </p>

      <h2>1. Information We Collect</h2>
      {/* TODO: Confirm exact data collection scope with client and lawyer */}
      <p>We may collect the following information:</p>
      <ul>
        <li>
          <strong>Identity information:</strong> your full name and, if you create an account,
          a profile photo.
        </li>
        <li>
          <strong>Contact information:</strong> email address, phone number, and physical address
          (for delivery or service visits).
        </li>
        <li>
          <strong>Transaction data:</strong> details of products purchased, services booked, payment
          method, and order history.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, device information, and pages
          visited, collected automatically via cookies and standard server logs.
        </li>
        <li>
          <strong>Communications:</strong> records of enquiries submitted via our contact form,
          email, or WhatsApp.
        </li>
        <li>
          <strong>Service-related information:</strong> property type, size, and notes you provide
          when booking an organizing session.
        </li>
      </ul>
      <p>
        We do not collect sensitive personal data (such as health information, financial account
        numbers, or identification documents) unless strictly required for a specific service and
        with your explicit consent.
      </p>

      <h2>2. How We Use Your Information</h2>
      {/* TODO: Confirm all use cases with client */}
      <p>We use your information to:</p>
      <ul>
        <li>Process bookings and orders and communicate updates about them.</li>
        <li>Deliver products to your address or provide services at your property.</li>
        <li>Send booking confirmations, receipts, and service reminders.</li>
        <li>Respond to enquiries and provide customer support.</li>
        <li>Send our newsletter if you have subscribed (you may unsubscribe at any time).</li>
        <li>Improve our website, services, and product selection.</li>
        <li>Comply with legal obligations under Kenyan law.</li>
      </ul>
      <p>
        We will never use your information to send you unsolicited marketing from third parties,
        and we will not contact you for marketing purposes beyond the frequency you would reasonably
        expect.
      </p>

      <h2>3. Confidentiality Commitment</h2>
      <p>
        Faith The Organizer borrows from the written Code of Ethics as set forth by the{' '}
        <strong>National Association of Productivity and Organizing (NAPO)</strong> and those
        governing the Certified Professional Organizer designation. This means:
      </p>
      <ul>
        <li>
          We treat all personal information shared with us during service sessions with the strictest
          confidence.
        </li>
        <li>
          A signed confidentiality agreement is executed before every service engagement — no
          exceptions.
        </li>
        <li>
          Information about the contents of your home, your personal belongings, or anything
          observed during a session will never be shared with any third party.
        </li>
        <li>
          Team members are bound by the same confidentiality obligations as the company.
        </li>
      </ul>

      <h2>4. Data Sharing</h2>
      {/* TODO: Confirm third-party service providers used (e.g. Resend, payment gateway) */}
      <p>
        <strong>We do not sell, rent, or trade your personal data to any third party.</strong>
      </p>
      <p>
        We may share limited data with trusted service providers who help us operate the business,
        including:
      </p>
      <ul>
        <li>
          <strong>Payment processors</strong> (M-Pesa via Daraja/IntaSend, Flutterwave) — to
          process transactions securely. They receive only the data required to complete your
          payment.
        </li>
        <li>
          <strong>Email service providers</strong> — to send transactional emails (booking
          confirmations, order receipts). These providers are contractually required to protect
          your data.
        </li>
        <li>
          <strong>Delivery couriers</strong> — your name, phone number, and delivery address are
          shared only as required to fulfil your order.
        </li>
      </ul>
      <p>
        We may disclose information if required to do so by law or by a valid court order under
        Kenyan jurisdiction.
      </p>

      <h2>5. Cookies</h2>
      {/* TODO: Document specific cookies used once analytics/tracking is set up */}
      <p>
        Our website uses cookies — small text files stored on your device — to improve your
        browsing experience. We use:
      </p>
      <ul>
        <li>
          <strong>Strictly necessary cookies:</strong> required for the website to function
          (e.g. session management, shopping cart state). These cannot be disabled.
        </li>
        <li>
          <strong>Analytics cookies:</strong> help us understand how visitors use the website so
          we can improve it. We use anonymised data only.
        </li>
      </ul>
      <p>
        You can control cookies through your browser settings. Disabling cookies may affect some
        functionality of the website.
      </p>

      <h2>6. Your Rights</h2>
      {/* TODO: Confirm compliance with Kenya Data Protection Act 2019 */}
      <p>
        Under the <strong>Kenya Data Protection Act 2019</strong>, you have the right to:
      </p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of any inaccurate data.</li>
        <li>Request deletion of your data (subject to legal obligations).</li>
        <li>Withdraw consent to marketing communications at any time.</li>
        <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC).</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us using the details in Section 7 below.
        We will respond within 14 days.
      </p>

      <h2>7. Contact for Privacy Concerns</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle your data, please
        contact us:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </li>
        <li>
          <strong>WhatsApp:</strong>{' '}
          <a href={COMPANY.whatsappLink} target="_blank" rel="noopener noreferrer">
            {COMPANY.phone}
          </a>
        </li>
        <li>
          <strong>Post:</strong> {COMPANY.address}, {COMPANY.addressFull}
        </li>
      </ul>
      <p>
        This policy may be updated from time to time. Any significant changes will be communicated
        via email or a notice on our website.
      </p>

    </LegalLayout>
  )
}
