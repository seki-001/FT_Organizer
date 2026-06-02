import { z } from 'zod'

const propertyTypeEnum = z.enum(['apartment', 'house', 'office'])
const propertySizeEnum = z.enum(['small', 'medium', 'large'])
const bookingStatusEnum = z.enum(['new', 'quoted', 'confirmed', 'completed', 'cancelled'])

export const BookingFormSchema = z.object({
  id: z.string().optional(),
  service: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Preferred date is required'),
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  location: z.string().min(1, 'Location / address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  propertyType: propertyTypeEnum,
  propertySize: propertySizeEnum,
  notes: z.string().optional(),
  status: bookingStatusEnum.optional(),
  createdAt: z.string().optional(),
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

export const CheckoutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  notes: z.string().optional(),
})

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>
