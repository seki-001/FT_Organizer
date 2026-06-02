export {
  SERVICES,
  SERVICE_GROUPS,
  SITE_VISIT,
  LEGACY_SERVICE_SLUGS,
  resolveServiceSlug,
  getServiceBySlug,
  getServicesByGroup,
  getFeaturedService,
  SERVICE_GALLERY,
  DEFAULT_GALLERY,
  BOOKING_PROCESS_STEPS,
  type CatalogService,
  type ServiceGroup,
  type ServiceGroupId,
} from './services-data'

export {
  getServiceDetail,
  getAllServiceDetails,
  SERVICE_DETAIL_EXTRAS,
  RELOCATION_SCOPE,
  type CatalogServiceFull,
  type ServiceFaqItem,
} from './service-detail-data'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const SHOP_CATEGORIES = [
  { slug: 'kitchen-organization', label: 'Kitchen' },
  { slug: 'closet-and-bedroom', label: 'Closet & Bedroom' },
  { slug: 'office-and-desk', label: 'Office & Desk' },
  { slug: 'storage-solutions', label: 'Storage' },
  { slug: 'bundles', label: 'Bundles' },
]

export const DELIVERY_OPTIONS = [
  { id: 'nairobi-same-day', label: 'Nairobi Same Day', price: 0, description: 'Free — Nairobi CBD & select areas' },
  { id: 'standard-nationwide', label: 'Standard Nationwide', price: 300, description: '2–4 business days' },
  { id: 'pickup', label: 'Pick Up', price: 0, description: 'Collect from our location' },
]

export const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', description: 'Pay via M-Pesa STK Push' },
  { id: 'card', label: 'Card', description: 'Visa or Mastercard via Flutterwave' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Nairobi deliveries only' },
]

export const MEDIA_FEATURES = [
  { name: 'EVE Magazine', logo: '/images/media/eve-magazine.png' },
  { name: 'The Standard', logo: '/images/media/the-standard.png' },
  { name: 'Daily Nation', logo: '/images/media/daily-nation.png' },
  { name: 'Citizen TV', logo: '/images/media/citizen-tv.png' },
]

export const COMPANY = {
  name: 'Faith The Organizer',
  tagline: 'From Clutter to Order',
  phone: '+254 704 488 188',
  email: 'faith@organizer.co.ke',
  emailPersonal: 'faiththeorganizer@gmail.com',
  whatsapp: '254704488188',
  whatsappLink: 'https://wa.me/message/TFUU32A5KKSOG1',
  website: 'https://www.organizer.co.ke',
  address: 'Milestone Business Centre, Ground Floor, Shop A5',
  addressFull: 'Inside Total Petrol Station, Membley, Northern Bypass (near KU Referral Hospital), Nairobi',
  instagram: 'https://www.instagram.com/faiththeorganizer',
  facebook: 'https://www.facebook.com/FaithTheOrganizer/',
  youtube: 'https://www.youtube.com/channel/UC2_ZGDGcf92Sb-MrqC-0N1g',
}
