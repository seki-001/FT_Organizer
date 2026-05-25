import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import Accordion from '@/components/ui/Accordion'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAQ | Faith The Organizer',
  description:
    "Frequently asked questions about Faith The Organizer's services and shop — pricing, delivery, confidentiality, and how to prepare for your first session.",
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const SERVICE_FAQS = [
  {
    question: 'What areas of Nairobi do you cover?',
    answer: 'We serve clients across all areas of Nairobi including Karen, Runda, Westlands, Kilimani, Lavington, Parklands, Kileleshwa, Muthaiga, Gigiri, Embakasi, South B, South C, Langata, and many more. If you are unsure whether we cover your area, send us a WhatsApp message and we will confirm within the hour.',
  },
  {
    question: 'How long does a home organizing session take?',
    answer: 'Session length depends on the scope of the project. A single room or kitchen typically takes half a day (3–5 hours). A full house or moving project may take one to two full days. During your free consultation, we will give you an accurate time estimate based on your specific space.',
  },
  {
    question: 'Do I need to be home during the session?',
    answer: 'We prefer that you or a trusted representative is present at the start of the session so we can walk through your priorities together. After that initial briefing, many clients choose to step out and let us work — you return to a transformed space. For offices and commercial spaces, a key contact is always required.',
  },
  {
    question: 'What happens to the items I want to discard?',
    answer: 'We will help you sort items into categories — keep, donate, sell, and discard. We can advise on the best donation centres in Nairobi and connect you with buyers for valuable items if needed. We do not remove items from your property without your explicit permission.',
  },
  {
    question: 'Is a confidentiality agreement really signed?',
    answer: 'Absolutely. A confidentiality agreement is signed before every single job — no exceptions. This is a founding principle of our business. We follow the NAPO Code of Ethics, which means your personal information, the contents of your home, and everything we observe during a session is kept strictly private.',
  },
  {
    question: 'How do I prepare for my first session?',
    answer: 'There is nothing you need to tidy or clean before we arrive — that is what we are here for. Simply be ready to make decisions about what to keep and what to let go. We recommend having some boxes or bags on hand for donations. Most importantly, come with an open mind and realistic expectations about the process.',
  },
  {
    question: 'Do you offer recurring organizing maintenance?',
    answer: 'Yes. Many of our clients book monthly or quarterly maintenance sessions after their initial full transformation. This keeps systems in place, adapts to changes in the household, and prevents clutter from creeping back. Ask us about our maintenance packages during your consultation.',
  },
  {
    question: "What's the difference between decluttering and organizing?",
    answer: 'Decluttering is the process of deciding what to keep and what to let go. Organizing comes after: putting what remains into a system that makes sense for your lifestyle. Both services are offered separately or together. A declutter without an organizing system will fill back up; organizing without decluttering first means organizing clutter.',
  },
]

const SHOP_FAQS = [
  {
    question: 'Do you deliver outside Nairobi?',
    answer: 'Yes. We offer standard nationwide delivery across Kenya via our courier partners. Delivery costs KSh 300 and takes 2–4 business days depending on your location. For remote areas, please contact us before placing an order.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Orders placed before 2 pm qualify for same-day delivery within Nairobi CBD and select surrounding areas (free). Standard nationwide delivery takes 2–4 business days. You can also collect in person from our Milestone Business Centre location at no extra charge.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery for items that are unused and in original packaging. To initiate a return, send us a WhatsApp message with your order reference and photos of the item. Once the return is received and inspected, a refund is processed within 3–5 business days.',
  },
  {
    question: 'Can I pay on delivery?',
    answer: 'Cash on Delivery is available for orders delivered within Nairobi. For nationwide deliveries, we require payment upfront via M-Pesa or card. COD orders must be confirmed via WhatsApp before dispatch.',
  },
  {
    question: 'Are the products the same ones Faith uses in her work?',
    answer: 'Yes — every product in our shop has been personally vetted by Faith through years of hands-on organizing work. We only list products we have actually used in real Nairobi homes and offices. If it is in our shop, we stand behind it.',
  },
  {
    question: 'Do you offer bulk or wholesale pricing?',
    answer: `Yes. We offer bulk pricing for orders of 5+ units of the same product, as well as wholesale pricing for interior designers, property managers, and businesses setting up offices. Send us an email at ${COMPANY.email} with your requirements for a custom quote.`,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  return (
    <main>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-dark py-20 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl text-white leading-tight">
            Got Questions?
          </h1>
          <p className="text-white/50 text-lg mt-4">
            Everything you need to know about our services and shop.
          </p>
        </div>
      </section>

      {/* ── 2. FAQ SECTIONS ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 space-y-16">

        {/* Services */}
        <section>
          <div className="mb-8 pb-4 border-b border-dark/8">
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-medium">
              Services
            </p>
          </div>
          <Accordion items={SERVICE_FAQS} />
        </section>

        {/* Shop */}
        <section>
          <div className="mb-8 pb-4 border-b border-dark/8">
            <p className="text-primary text-xs uppercase tracking-[0.3em] font-medium">
              Shop
            </p>
          </div>
          <Accordion items={SHOP_FAQS} />
        </section>

      </div>

      {/* ── 3. BOTTOM CTA ────────────────────────────────────────────────── */}
      <section className="bg-dark py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-white">
            Still have a question?
          </h2>
          <p className="text-white/50 mt-4 text-base max-w-sm mx-auto leading-relaxed">
            WhatsApp Faith directly — usually replies within the hour.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600
                         text-white font-medium px-8 py-4 rounded-xl transition-colors"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/20
                         text-white/70 hover:text-white hover:border-white font-medium px-8 py-4
                         rounded-xl transition-colors"
            >
              Send an Email
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
