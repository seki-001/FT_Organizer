import type { Product } from '@/lib/types'

export const MOCK_PRODUCTS: Product[] = [
  // ── Kitchen Organization (3) ───────────────────────────────────────────────
  {
    id: 'k-001',
    slug: 'rotating-cup-organizer',
    name: 'Rotating Cup & Mug Organizer',
    description:
      '360° rotating carousel keeps cups and mugs accessible and neatly arranged on any countertop. Holds up to 12 cups.',
    price: 2800,
    salePrice: 2200,
    category: 'kitchen-organization',
    images: [
      '/images/shop/cup-organizer-main.jpg',
      '/images/shop/cup-organizer-lifestyle.jpg',
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 34,
    featured: true,
    specs: { Material: 'ABS Plastic', Capacity: '12 cups', Dimensions: '25 × 25 × 30 cm' },
  },
  {
    id: 'k-002',
    slug: 'fridge-organizer-set',
    name: 'Fridge Organizer Set (6 Pcs)',
    description:
      'Clear stackable fridge bins keep produce, drinks and condiments separated and visible. Wipe-clean BPA-free plastic.',
    price: 3500,
    category: 'kitchen-organization',
    images: [
      '/images/shop/fridge-organizer-main.jpg',
      '/images/shop/fridge-organizer-lifestyle.jpg',
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.9,
    reviewCount: 61,
    featured: true,
    specs: { Material: 'BPA-Free Plastic', Pieces: '6', Dishwasher: 'Safe' },
  },
  {
    id: 'k-003',
    slug: 'wire-fruit-vegetable-holder',
    name: 'Wire Fruit & Vegetable Holder',
    description:
      '3-tier countertop wire basket for fruit, vegetables or bread. Keeps produce fresh and kitchen benches clear.',
    price: 1800,
    salePrice: 1400,
    category: 'kitchen-organization',
    images: [
      '/images/shop/fruit-holder-main.jpg',
      '/images/shop/fruit-holder-lifestyle.jpg',
    ],
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviewCount: 18,
    featured: false,
    specs: { Material: 'Powder-Coated Wire', Tiers: '3', Load: '5 kg per tier' },
  },

  // ── Closet & Bedroom (2) ───────────────────────────────────────────────────
  {
    id: 'c-001',
    slug: 'velvet-hanger-set-50',
    name: 'Velvet Non-Slip Hangers (50 Pack)',
    description:
      'Ultra-thin velvet hangers prevent clothes slipping and take up 5× less space than plastic hangers.',
    price: 1200,
    category: 'closet-and-bedroom',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 60,
    rating: 4.7,
    reviewCount: 92,
    featured: false,
    specs: { Material: 'Velvet + ABS', Pack: '50 hangers', Capacity: '5 kg each' },
  },
  {
    id: 'c-002',
    slug: 'underbed-storage-bag',
    name: 'Under-Bed Storage Bag (2 Pack)',
    description:
      'Zippered fabric bags with handles maximize under-bed space for seasonal clothes, bedding and shoes.',
    price: 2200,
    salePrice: 1750,
    category: 'closet-and-bedroom',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.5,
    reviewCount: 27,
    featured: false,
    specs: { Material: 'Non-Woven Fabric', Pack: '2 bags', Size: '70 × 50 × 15 cm' },
  },

  // ── Office & Desk (2) ─────────────────────────────────────────────────────
  {
    id: 'o-001',
    slug: 'desktop-file-organizer',
    name: 'Desktop File & Document Organizer',
    description:
      '5-section vertical file holder keeps documents, folders and notebooks upright and labelled on your desk.',
    price: 1650,
    category: 'office-and-desk',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.4,
    reviewCount: 15,
    featured: true,
    specs: { Material: 'Bamboo', Sections: '5', Load: '3 kg' },
  },
  {
    id: 'o-002',
    slug: 'cable-management-box',
    name: 'Cable Management Box',
    description:
      'Hide power strips, cables and adapters in a ventilated wooden box. Keeps your desk clean and fire-safe.',
    price: 2900,
    category: 'office-and-desk',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviewCount: 33,
    featured: false,
    specs: { Material: 'MDF + ABS', Dimensions: '40 × 15 × 12 cm', Ventilation: 'Yes' },
  },

  // ── Storage Solutions (3) ─────────────────────────────────────────────────
  {
    id: 's-001',
    slug: 'clear-stackable-storage-bins',
    name: 'Clear Stackable Storage Bins (4 Pack)',
    description:
      'Heavy-duty clear bins with lids — perfect for pantries, laundry rooms and store rooms. Stackable up to 4 high.',
    price: 4200,
    category: 'storage-solutions',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.8,
    reviewCount: 47,
    featured: true,
    specs: { Material: 'Polypropylene', Pack: '4 bins', Capacity: '15 L each' },
  },
  {
    id: 's-002',
    slug: 'fabric-storage-baskets',
    name: 'Fabric Storage Baskets (3 Pack)',
    description:
      'Foldable jute-lined baskets for shelves, wardrobes and bathrooms. Includes label holder on each basket.',
    price: 2600,
    salePrice: 1999,
    category: 'storage-solutions',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 40,
    rating: 4.7,
    reviewCount: 58,
    featured: false,
    specs: { Material: 'Jute + Cotton', Pack: '3 baskets', Sizes: 'S / M / L' },
  },
  {
    id: 's-003',
    slug: 'over-door-shoe-rack',
    name: 'Over-Door Shoe Rack (16 Pairs)',
    description:
      'No-drill over-door shoe organiser with 8 reinforced shelves. Fits standard and thick doors.',
    price: 3200,
    category: 'storage-solutions',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: false,
    stockCount: 0,
    rating: 4.3,
    reviewCount: 22,
    featured: false,
    specs: { Material: 'Chrome Steel', Capacity: '16 pairs', Installation: 'No drill' },
  },

  // ── Bundles (2) ───────────────────────────────────────────────────────────
  {
    id: 'b-001',
    slug: 'kitchen-starter-bundle',
    name: 'Kitchen Starter Bundle',
    description:
      'Everything you need to transform your kitchen in one go — fridge organizer set, cup carousel and fruit holder.',
    price: 8100,
    salePrice: 6500,
    category: 'bundles',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 14,
    featured: true,
    specs: { Includes: '3 products', Saving: 'KSh 1,600', 'Best for': 'Kitchens' },
  },
  {
    id: 'b-002',
    slug: 'home-office-bundle',
    name: 'Home Office Bundle',
    description:
      'Desk file organizer + cable management box — the perfect pair to declutter your workspace in under an hour.',
    price: 4550,
    salePrice: 3800,
    category: 'bundles',
    images: [
      '/images/shop/shop-hero.jpg',
    ],
    inStock: true,
    stockCount: 10,
    rating: 4.8,
    reviewCount: 9,
    featured: true,
    specs: { Includes: '2 products', Saving: 'KSh 750', 'Best for': 'Home offices' },
  },
]
