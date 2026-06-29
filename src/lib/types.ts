export interface Service {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: string // Lucide icon name
  priceFrom: number // in KSh
  duration: string // e.g. "Half day" | "Full day" | "1–2 days"
  includes: string[]
  steps: { title: string; description: string }[]
  gallery: string[] // image URLs
  testimonials: Testimonial[]
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number // in KSh
  salePrice?: number // in KSh
  category: ProductCategory
  images: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  featured: boolean
  variants?: ProductVariant[]
  specs?: Record<string, string>
}

export type ProductCategory =
  | 'kitchen'
  | 'pantry'
  | 'fridge'
  | 'dining'
  | 'spices'
  | 'bathroom'
  | 'closet-bedroom'
  | 'beauty-cosmetics'
  | 'grooming-hygiene'
  | 'health'
  | 'baskets'
  | 'storage-containers'
  | 'shelves-drawers'
  | 'stands-racks'
  | 'furniture'
  | 'stationery'
  | 'interior-decor'
  | 'laundry-cleaning'
  | 'hardware'
  | 'travel'
  | 'car-organizers'
  | 'kids-corner'
  | 'gadgets'
  | 'packaging'
  | 'bundles'
  // legacy aliases kept for compatibility
  | 'kitchen-organization'
  | 'closet-and-bedroom'
  | 'office-and-desk'
  | 'storage-solutions'

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: ProductVariant
}

export interface Testimonial {
  id: string
  name: string
  location: string // e.g. "Westlands, Nairobi"
  rating: number
  text: string
  service?: string
  avatar?: string
}

export interface Booking {
  id: string
  service: string
  date: string
  name: string
  email: string
  phone: string
  propertyType: 'apartment' | 'house' | 'office'
  propertySize: 'small' | 'medium' | 'large'
  notes?: string
  status: 'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryMethod: 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
  deliveryFee: number
  paymentMethod: 'mpesa' | 'card' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
  customer: Customer
  createdAt: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  notes?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  author: string
  publishedAt: string
  readTime: number // in minutes
  tags: string[]
}

export type BlogCategory =
  | 'home-tips'
  | 'office'
  | 'before-and-after'
  | 'product-reviews'
  | 'nairobi-living'

// ── BUSINESS / POS TYPES ─────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'mpesa' | 'card' | 'credit'

export interface SaleItem {
  productId: string
  productName: string
  category: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  customerId?: string
  customerName?: string
  cashierName: string
  createdAt: string
  receiptNo: string
  note?: string
}

export interface BusinessCustomer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  creditBalance: number  // positive = they owe us
  totalPurchases: number
  lastPurchaseAt?: string
  createdAt: string
  notes?: string
}

export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'salaries'
  | 'stock-purchase'
  | 'transport'
  | 'marketing'
  | 'packaging'
  | 'equipment'
  | 'other'

export interface Expense {
  id: string
  description: string
  category: ExpenseCategory
  amount: number
  paymentMethod: PaymentMethod
  date: string
  createdAt: string
  attachmentUrl?: string
  note?: string
}

export interface Purchase {
  id: string
  supplierName: string
  items: Array<{
    productId?: string
    productName: string
    quantity: number
    unitCost: number
    total: number
  }>
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  date: string
  createdAt: string
  invoiceNo?: string
  note?: string
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: 'sale' | 'purchase' | 'adjustment' | 'return'
  quantity: number // positive = in, negative = out
  reference: string // sale ID, purchase ID, etc.
  date: string
}

export interface DailyReport {
  date: string
  totalSales: number
  totalExpenses: number
  salesCount: number
  topProducts: Array<{ name: string; qty: number; revenue: number }>
  paymentBreakdown: Record<PaymentMethod, number>
}
