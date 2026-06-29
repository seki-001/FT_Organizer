import { CATEGORY_IMAGES } from '@/lib/site-images'

export const SERVICES = [
  { slug: 'general-decluttering', title: 'General Decluttering', icon: 'Trash2', priceFrom: 5000 },
  { slug: 'whole-house-organizing', title: 'Whole House Organizing', icon: 'Home', priceFrom: 15000 },
  { slug: 'moving-house', title: 'Moving House', icon: 'Truck', priceFrom: 8000 },
  { slug: 'shelving-and-storage', title: 'Shelving & Storage', icon: 'Archive', priceFrom: 6000 },
  { slug: 'packing-and-removal', title: 'Packing & Removal', icon: 'Package', priceFrom: 7000 },
  { slug: 'paperwork-management', title: 'Paperwork Management', icon: 'FileText', priceFrom: 4000 },
  { slug: 'online-coaching', title: 'Online Coaching', icon: 'Video', priceFrom: 3000 },
  { slug: 'online-consulting', title: 'Online Consulting', icon: 'MessageSquare', priceFrom: 2500 },
  { slug: 'home-staging', title: 'Home Staging', icon: 'Sparkles', priceFrom: 12000 },
  { slug: 'space-planning', title: 'Space Planning', icon: 'Layout', priceFrom: 8000 },
  { slug: 'office-organizing', title: 'Office Organizing', icon: 'Briefcase', priceFrom: 10000 },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const SHOP_CATEGORIES = [
  { slug: 'kitchen',           label: 'Kitchen',              image: CATEGORY_IMAGES.kitchen },
  { slug: 'pantry',            label: 'Pantry',               image: CATEGORY_IMAGES.pantry },
  { slug: 'fridge',            label: 'Fridge',               image: CATEGORY_IMAGES.fridge },
  { slug: 'closet-bedroom',    label: 'Closet & Bedroom',     image: CATEGORY_IMAGES['closet-bedroom'] },
  { slug: 'bathroom',          label: 'Bathroom',             image: CATEGORY_IMAGES.bathroom },
  { slug: 'beauty-cosmetics',  label: 'Beauty & Cosmetics',   image: CATEGORY_IMAGES['beauty-cosmetics'] },
  { slug: 'stationery',        label: 'Stationery',           image: CATEGORY_IMAGES.stationery },
  { slug: 'laundry-cleaning',  label: 'Laundry & Cleaning',   image: CATEGORY_IMAGES['laundry-cleaning'] },
  { slug: 'shelves-drawers',   label: 'Shelves & Drawers',    image: CATEGORY_IMAGES['shelves-drawers'] },
  { slug: 'baskets',           label: 'Baskets',              image: CATEGORY_IMAGES.baskets },
  { slug: 'storage-containers',label: 'Storage & Containers', image: CATEGORY_IMAGES['storage-containers'] },
  { slug: 'travel',            label: 'Travel',               image: CATEGORY_IMAGES.travel },
  { slug: 'grooming-hygiene',  label: 'Grooming & Hygiene',   image: CATEGORY_IMAGES['grooming-hygiene'] },
  { slug: 'hardware',          label: 'Hardware',             image: CATEGORY_IMAGES.hardware },
  { slug: 'gadgets',           label: 'Gadgets',              image: CATEGORY_IMAGES.gadgets },
  { slug: 'interior-decor',    label: 'Interior Decor',       image: CATEGORY_IMAGES['interior-decor'] },
  { slug: 'kids-corner',       label: 'Kids Corner',          image: CATEGORY_IMAGES['kids-corner'] },
  { slug: 'furniture',         label: 'Furniture',            image: CATEGORY_IMAGES.furniture },
  { slug: 'stands-racks',      label: 'Stands & Racks',       image: CATEGORY_IMAGES['stands-racks'] },
  { slug: 'car-organizers',    label: 'Car Organizers',       image: CATEGORY_IMAGES['car-organizers'] },
  { slug: 'dining',            label: 'Dining',               image: CATEGORY_IMAGES.dining },
  { slug: 'spices',            label: 'Spices',               image: CATEGORY_IMAGES.spices },
  { slug: 'health',            label: 'Health',               image: CATEGORY_IMAGES.health },
  { slug: 'packaging',         label: 'Packaging',            image: CATEGORY_IMAGES.packaging },
]

export const DELIVERY_OPTIONS = [
  { id: 'nairobi-same-day', label: 'Nairobi Same Day', price: 0, description: 'Free — Nairobi CBD & select areas' },
  { id: 'standard-nationwide', label: 'Standard Nationwide', price: 300, description: '2–4 business days' },
  { id: 'pickup', label: 'Pick Up', price: 0, description: 'Collect from our location' },
]

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Pay Online', description: 'M-Pesa, Visa or Mastercard — secure Paystack checkout' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives — Nairobi only' },
]

export const MEDIA_FEATURES = [
  { name: 'EVE Magazine' },
  { name: 'The Standard' },
  { name: 'Daily Nation' },
  { name: 'Citizen TV' },
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
