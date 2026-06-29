import { z } from 'zod'

const propertyTypeEnum = z.enum(['apartment', 'house', 'office'])
const propertySizeEnum = z.enum(['small', 'medium', 'large'])

export const BookingFormSchema = z.object({
  service: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Date is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  propertyType: propertyTypeEnum,
  propertySize: propertySizeEnum,
  notes: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof BookingFormSchema>

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

export type ContactFormValues = z.infer<typeof ContactFormSchema>

const kenyanPhoneSchema = z
  .string()
  .min(10, 'Phone number is required')
  .regex(/^(\+?254|0)[17]\d{8}$/, 'Use a valid Kenyan number (07XX XXX XXX)')

export const CheckoutFormSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: kenyanPhoneSchema,
  address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City or area is required'),
  notes: z.string().optional(),
  marketingOptIn: z.boolean().default(false),
})

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>

const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  productId: z.string().uuid().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
  variant: z.record(z.unknown()).optional(),
})

export const CreateOrderSchema = z.object({
  deliveryMethod: z.enum(['nairobi-same-day', 'standard-nationwide', 'pickup']),
  paymentMethod: z.enum(['mpesa', 'card', 'cod']),
  subtotal: z.number().int().nonnegative(),
  deliveryFee: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative().default(0),
  total: z.number().int().positive(),
  promoCode: z.string().optional(),
  checkoutMode: z.enum(['guest', 'account']).default('guest'),
  accountPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  customer: CheckoutFormSchema,
  items: z.array(orderItemSchema).min(1),
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
