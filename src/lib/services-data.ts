/**
 * Canonical Faith The Organizer service catalog (Stage 3).
 * Single source of truth for slugs, groups, descriptions, and site-visit rules.
 */

export type ServiceGroupId =
  | 'organizing-storage'
  | 'home-lifestyle'
  | 'relocation-events-training'

export interface ServiceGroup {
  id: ServiceGroupId
  label: string
}

export interface CatalogService {
  slug: string
  title: string
  /** Lucide icon component name */
  icon: string
  groupId: ServiceGroupId
  description: string
  priceFrom: number
  featured?: boolean
  includes: string[]
  categoryLabel: string
  image: string
}

export const SITE_VISIT = {
  feeKsh: 3000,
  redeemablePercent: 50,
  /** Site visits are mainly scheduled on Mondays */
  primaryDays: 'Mondays',
  closedDays: ['Saturday', 'Sunday'] as const,
  serviceArea: 'East Africa',
  redeemableNote:
    '50% of your site visit fee is redeemable toward your project when you retain Faith The Organizer.',
  diasporaNote:
    'Diaspora relocation and remote transition support available under Relocation & Transition Services.',
} as const

export const SERVICE_GROUPS: ServiceGroup[] = [
  { id: 'organizing-storage', label: 'Organizing & Storage' },
  { id: 'home-lifestyle', label: 'Home & Lifestyle Management' },
  { id: 'relocation-events-training', label: 'Relocation, Events & Training' },
]

export const SERVICES: CatalogService[] = [
  {
    slug: 'professional-organizing-decluttering',
    title: 'Professional Organizing & Decluttering',
    icon: 'LayoutGrid',
    groupId: 'organizing-storage',
    featured: true,
    description:
      'Homes, offices, wardrobes, kitchens, storage rooms, paperwork, and daily-use spaces. Creates calm, functional, beautiful, easy-to-maintain spaces.',
    priceFrom: 8000,
    categoryLabel: 'Organizing',
    image: '/images/services/decluttering-after-1.jpg',
    includes: [
      'Homes, offices, wardrobes, kitchens & storage rooms',
      'Paperwork and daily-use space systems',
      'Hands-on decluttering with calm, functional layouts',
      'Easy-to-maintain zones tailored to how you live',
    ],
  },
  {
    slug: 'storage-design-installation',
    title: 'Storage Design & Installation',
    icon: 'Archive',
    groupId: 'organizing-storage',
    description:
      'Custom storage planning, shelving, containers, labeling systems, space optimization, installation coordination, and practical storage solutions.',
    priceFrom: 10000,
    categoryLabel: 'Storage',
    image: '/images/services/shelving-after-1.jpg',
    includes: [
      'Custom storage planning and space optimization',
      'Shelving, containers, and labeling systems',
      'Installation coordination with trusted partners',
      'Practical solutions for every room',
    ],
  },
  {
    slug: 'organizing-products-storage-solutions',
    title: 'Organizing Products & Storage Solutions',
    icon: 'ShoppingBag',
    groupId: 'organizing-storage',
    description:
      'Organizers, containers, storage products, labels, baskets, shelving accessories, and curated products that help clients maintain organized spaces.',
    priceFrom: 1500,
    categoryLabel: 'Products',
    image: '/images/services/shelving-after-1.jpg',
    includes: [
      'Curated organizers, containers, and baskets',
      'Labels, dividers, and shelving accessories',
      'Product recommendations matched to your space',
      'Shop bundles that support long-term order',
    ],
  },
  {
    slug: 'cleaning-housekeeping',
    title: 'Cleaning & Housekeeping Services',
    icon: 'Sparkles',
    groupId: 'home-lifestyle',
    description:
      'Cleaning, deep cleaning support, housekeeping systems, home upkeep routines, and maintaining organized spaces after setup.',
    priceFrom: 6000,
    categoryLabel: 'Home Care',
    image: '/images/services/decluttering-after-1.jpg',
    includes: [
      'Cleaning and deep-cleaning support',
      'Housekeeping systems and routines',
      'Home upkeep schedules that stick',
      'Maintaining order after organizing sessions',
    ],
  },
  {
    slug: 'home-management',
    title: 'Home Management Services',
    icon: 'Home',
    groupId: 'home-lifestyle',
    description:
      'Household systems, routines, staff coordination, maintenance schedules, inventory lists, home operations, and family/home workflow management.',
    priceFrom: 10000,
    categoryLabel: 'Home Management',
    image: '/images/services/office-after-1.jpg',
    includes: [
      'Household systems and family workflows',
      'Staff coordination and maintenance schedules',
      'Inventory lists and home operations',
      'Ongoing support for busy households',
    ],
  },
  {
    slug: 'staffing-placement-workforce',
    title: 'Staffing, Placement & Workforce Solutions',
    icon: 'Users',
    groupId: 'home-lifestyle',
    description:
      'Placement and coordination of home managers, housekeepers, organizers, support staff, trained personnel, and workforce solutions for homes/offices.',
    priceFrom: 8000,
    categoryLabel: 'Staffing',
    image: '/images/services/office-after-1.jpg',
    includes: [
      'Home managers, housekeepers, and organizers',
      'Support staff placement and coordination',
      'Trained personnel for homes and offices',
      'Workforce solutions tailored to your needs',
    ],
  },
  {
    slug: 'relocation-transition',
    title: 'Relocation & Transition Services',
    icon: 'Truck',
    groupId: 'relocation-events-training',
    description:
      'Moving support, packing, unpacking, home setup, office setup, transition planning, diaspora relocation support, and moves across East Africa.',
    priceFrom: 12000,
    categoryLabel: 'Relocation',
    image: '/images/services/moving-after-1.jpg',
    includes: [
      'Packing, unpacking, and home or office setup',
      'Transition planning for local and diaspora moves',
      'Moves coordinated across East Africa',
      'Diaspora relocation support from abroad',
    ],
  },
  {
    slug: 'events-catering-decor',
    title: 'Events, Catering & Décor',
    icon: 'Calendar',
    groupId: 'relocation-events-training',
    description:
      'Organized event setup, décor coordination, catering support, space planning for events, post-event organization, and event-related logistics.',
    priceFrom: 15000,
    categoryLabel: 'Events',
    image: '/images/services/staging-after-1.jpg',
    includes: [
      'Organized event setup and space planning',
      'Décor and catering coordination',
      'Post-event breakdown and organization',
      'End-to-end event logistics support',
    ],
  },
  {
    slug: 'training-professional-development',
    title: 'Training & Professional Development',
    icon: 'GraduationCap',
    groupId: 'relocation-events-training',
    description:
      'Professional organizer training, home management training, housekeeping training, workflow training, and skills development for individuals or teams.',
    priceFrom: 5000,
    categoryLabel: 'Training',
    image: '/images/services/coaching-hero.jpg',
    includes: [
      'Professional organizer training',
      'Home management and housekeeping training',
      'Workflow and systems training for teams',
      'Skills development for individuals or staff',
    ],
  },
]

/** Previous slugs → current slugs (bookmarks, mock data, external links). */
export const LEGACY_SERVICE_SLUGS: Record<string, string> = {
  'general-decluttering': 'professional-organizing-decluttering',
  'whole-house-organizing': 'professional-organizing-decluttering',
  'moving-house': 'relocation-transition',
  'shelving-and-storage': 'storage-design-installation',
  'packing-and-removal': 'relocation-transition',
  'paperwork-management': 'professional-organizing-decluttering',
  'online-coaching': 'training-professional-development',
  'online-consulting': 'training-professional-development',
  'home-staging': 'events-catering-decor',
  'space-planning': 'storage-design-installation',
  'office-organizing': 'professional-organizing-decluttering',
}

export function resolveServiceSlug(slug: string): string {
  return LEGACY_SERVICE_SLUGS[slug] ?? slug
}

export function getServiceBySlug(slug: string): CatalogService | undefined {
  const resolved = resolveServiceSlug(slug)
  return SERVICES.find((s) => s.slug === resolved)
}

export function getServicesByGroup(groupId: ServiceGroupId): CatalogService[] {
  return SERVICES.filter((s) => s.groupId === groupId)
}

export function getFeaturedService(): CatalogService {
  return SERVICES.find((s) => s.featured) ?? SERVICES[0]
}

export const SERVICE_GALLERY: Record<string, { before: string; after: string }> = {
  'professional-organizing-decluttering': {
    before: '/images/services/decluttering-before-1.jpg',
    after: '/images/services/decluttering-after-1.jpg',
  },
  'storage-design-installation': {
    before: '/images/services/shelving-before-1.jpg',
    after: '/images/services/shelving-after-1.jpg',
  },
  'organizing-products-storage-solutions': {
    before: '/images/services/shelving-before-1.jpg',
    after: '/images/services/shelving-after-1.jpg',
  },
  'cleaning-housekeeping': {
    before: '/images/services/decluttering-before-1.jpg',
    after: '/images/services/decluttering-after-1.jpg',
  },
  'home-management': {
    before: '/images/services/office-before-1.jpg',
    after: '/images/services/office-after-1.jpg',
  },
  'staffing-placement-workforce': {
    before: '/images/services/office-before-1.jpg',
    after: '/images/services/office-after-1.jpg',
  },
  'relocation-transition': {
    before: '/images/services/moving-before-1.jpg',
    after: '/images/services/moving-after-1.jpg',
  },
  'events-catering-decor': {
    before: '/images/services/staging-before-1.jpg',
    after: '/images/services/staging-after-1.jpg',
  },
  'training-professional-development': {
    before: '/images/services/coaching-hero.jpg',
    after: '/images/services/coaching-hero.jpg',
  },
}

export const DEFAULT_GALLERY = SERVICE_GALLERY['professional-organizing-decluttering']

export const BOOKING_PROCESS_STEPS = [
  {
    title: 'Book a site visit',
    description:
      'Choose your service and request a visit. We confirm timing — mainly Mondays across East Africa.',
  },
  {
    title: 'We assess your space',
    description: `On-site walkthrough (${formatPriceLabel(SITE_VISIT.feeKsh)}). We listen, measure scope, and note priorities.`,
  },
  {
    title: 'You receive a plan & quote',
    description:
      'A clear proposal with timeline and investment — typically within 48 hours of your visit.',
  },
  {
    title: 'We organize, set up & follow up',
    description:
      'Hands-on delivery, coordination where needed, and guidance so your systems last.',
  },
] as const

function formatPriceLabel(amount: number) {
  return `KSh ${amount.toLocaleString()}`
}
