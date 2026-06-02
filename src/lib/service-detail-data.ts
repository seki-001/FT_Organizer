import type { CatalogService } from './services-data'
import { SERVICES, SITE_VISIT, getServiceBySlug } from './services-data'

export interface ServiceFaqItem {
  question: string
  answer: string
}

export interface ServiceDetailExtras {
  shortBenefit: string
  duration: string
  timeline: string
  whoIsFor: string[]
  faq: ServiceFaqItem[]
  relatedProductSlugs?: string[]
  /** When set, hub/detail show "Custom quote" instead of "From KSh …" */
  customQuote?: boolean
  relocationScope?: string[]
}

export type CatalogServiceFull = CatalogService & ServiceDetailExtras

export const RELOCATION_SCOPE: string[] = [
  'Local moves within Nairobi and surrounding areas',
  'Moves across East Africa with coordinated logistics',
  'Diaspora clients — remote planning and on-the-ground execution',
  'Professional packing and protective wrapping',
  'Unpacking and room-by-room setup',
  'Home setup and settling-in support',
  'Office setup and workspace organization',
  'Transition planning and move timelines',
  'Storage planning and short- or long-term coordination',
  'Coordination support with movers, landlords, and vendors',
]

const SITE_VISIT_FAQ: ServiceFaqItem = {
  question: 'How does the site visit fee work?',
  answer: `Site visits are KSh ${SITE_VISIT.feeKsh.toLocaleString()} and mainly scheduled on ${SITE_VISIT.primaryDays}. ${SITE_VISIT.redeemableNote}`,
}

export const SERVICE_DETAIL_EXTRAS: Record<string, ServiceDetailExtras> = {
  'professional-organizing-decluttering': {
    shortBenefit: 'Calm, functional spaces you can maintain every day.',
    duration: 'Half day to multi-day (by scope)',
    timeline: 'Site visit → quote within 48h → schedule within 1–2 weeks',
    whoIsFor: [
      'Homeowners and renters overwhelmed by clutter',
      'Families preparing for guests, a move, or a fresh start',
      'Home offices and paperwork zones that need systems',
      'Clients across East Africa who want hands-on expert support',
    ],
    relatedProductSlugs: ['rotating-cup-organizer', 'fridge-organizer-set', 'underbed-storage-bag'],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Do you work in homes outside Nairobi?',
        answer: `Yes. We are based in Nairobi and serve clients across ${SITE_VISIT.serviceArea}. Travel is confirmed during your site visit.`,
      },
      {
        question: 'Will you discard items without asking me?',
        answer:
          'Never without your approval. We sort with you (or to your written brief) and coordinate disposal or donation only when you agree.',
      },
    ],
  },
  'storage-design-installation': {
    shortBenefit: 'Storage that fits your space — planned, labeled, and installed.',
    duration: '1–3 days typical; larger homes may take longer',
    timeline: 'Assessment → design plan → install coordination → handover',
    whoIsFor: [
      'Homes needing shelves, closets, or pantry systems',
      'Clients who want labeled zones and container strategies',
      'Renovation or move-in projects requiring storage planning',
    ],
    relatedProductSlugs: ['fridge-organizer-set', 'underbed-storage-bag', 'cable-management-box'],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Do you supply shelving and products?',
        answer:
          'We recommend and can source organizers; installation may involve trusted partners. Product costs are quoted separately.',
      },
    ],
  },
  'organizing-products-storage-solutions': {
    shortBenefit: 'Curated products that help you keep order after we leave.',
    duration: 'Consultation 1–2 hours; delivery per shop timelines',
    timeline: 'Needs assessment → curated list → order & delivery',
    whoIsFor: [
      'DIY organizers who want quality containers and labels',
      'Past clients refreshing or extending their systems',
      'Gift and bundle buyers across Kenya',
    ],
    relatedProductSlugs: ['rotating-cup-organizer', 'fridge-organizer-set', 'wire-fruit-vegetable-holder'],
    faq: [
      {
        question: 'Can I buy products without a full organizing session?',
        answer: 'Yes. Browse the shop or ask us for a curated bundle matched to your space photos.',
      },
    ],
  },
  'cleaning-housekeeping': {
    shortBenefit: 'Clean, orderly homes with routines that last.',
    duration: 'Half day to ongoing scheduled visits',
    timeline: 'Walkthrough → routine design → first clean → maintenance plan',
    whoIsFor: [
      'Busy households after an organizing project',
      'Clients who want deep-clean support plus upkeep systems',
      'Homes with staff who need clear housekeeping standards',
    ],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Is this the same as a cleaning company?',
        answer:
          'We focus on systems and upkeep tied to organized spaces — often after organizing or alongside home management.',
      },
    ],
  },
  'home-management': {
    shortBenefit: 'Households that run smoothly — systems, staff, and schedules.',
    duration: 'Ongoing retainer or project-based setup',
    timeline: 'Discovery → systems documentation → rollout → check-ins',
    whoIsFor: [
      'Large or busy households with multiple staff',
      'Executives and families needing operational calm',
      'Estates requiring inventory, maintenance, and workflows',
    ],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Can you coordinate existing staff?',
        answer:
          'Yes. We document routines, train where needed, and align your team to the same standards.',
      },
    ],
  },
  'staffing-placement-workforce': {
    shortBenefit: 'The right people, trained to your household or office standards.',
    duration: 'Placement timeline varies by role',
    timeline: 'Brief → shortlist → interviews → placement → follow-up',
    customQuote: true,
    whoIsFor: [
      'Households seeking house managers or housekeepers',
      'Offices needing organized support staff',
      'Clients who want vetted, trained personnel',
    ],
    faq: [
      {
        question: 'How is pricing structured?',
        answer:
          'Placement and coordination fees depend on role, schedule, and scope. We provide a custom quote after your consultation.',
      },
    ],
  },
  'relocation-transition': {
    shortBenefit: 'Moves planned and executed with clarity — local, regional, or diaspora.',
    duration: '1 day to several weeks depending on move size',
    timeline: 'Planning → pack → move day → unpack → setup → follow-up',
    whoIsFor: [
      'Families moving within Nairobi or across East Africa',
      'Diaspora clients setting up homes while abroad',
      'Offices relocating or downsizing',
      'Anyone needing packing, unpacking, and setup under one calm plan',
    ],
    relocationScope: RELOCATION_SCOPE,
    relatedProductSlugs: ['underbed-storage-bag', 'fridge-organizer-set'],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Can you help if I am overseas?',
        answer:
          'Yes. We support diaspora clients with remote planning, vendor coordination, and on-the-ground setup when you arrive.',
      },
      {
        question: 'Do you provide moving trucks?',
        answer:
          'We coordinate with trusted movers; our focus is organizing, packing, unpacking, and setup.',
      },
    ],
  },
  'events-catering-decor': {
    shortBenefit: 'Events that look polished before, during, and after.',
    duration: 'Setup 4–8 hours; full event support by scope',
    timeline: 'Brief → plan → setup → event → breakdown & organization',
    whoIsFor: [
      'Private celebrations and corporate functions',
      'Clients who need space planning and décor coordination',
      'Hosts who want calm logistics, not last-minute chaos',
    ],
    faq: [
      SITE_VISIT_FAQ,
      {
        question: 'Do you provide catering?',
        answer: 'We coordinate catering partners; our core strength is organized setup and logistics.',
      },
    ],
  },
  'training-professional-development': {
    shortBenefit: 'Skills and systems for organizers, housekeepers, and teams.',
    duration: 'Half day to multi-day workshops',
    timeline: 'Needs call → curriculum → delivery → materials handover',
    whoIsFor: [
      'Aspiring professional organizers',
      'Household staff and home management teams',
      'Offices adopting workflow and paperwork systems',
    ],
    faq: [
      {
        question: 'Is training in person or online?',
        answer: 'We offer both, depending on group size and location across East Africa.',
      },
    ],
  },
}

export function getServiceDetail(slug: string): CatalogServiceFull | undefined {
  const base = getServiceBySlug(slug)
  if (!base) return undefined
  const extras = SERVICE_DETAIL_EXTRAS[base.slug]
  if (!extras) return { ...base, ...DEFAULT_EXTRAS(base) }
  return { ...base, ...extras }
}

function DEFAULT_EXTRAS(service: CatalogService): ServiceDetailExtras {
  return {
    shortBenefit: service.description.split('.')[0] + '.',
    duration: 'Varies by scope',
    timeline: 'Site visit → quote → scheduled delivery',
    whoIsFor: ['Homeowners and businesses across East Africa'],
    faq: [SITE_VISIT_FAQ],
  }
}

export function getAllServiceDetails(): CatalogServiceFull[] {
  return SERVICES.map((s) => getServiceDetail(s.slug)!)
}
