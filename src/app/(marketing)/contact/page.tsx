'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactFormSchema, type ContactFormValues } from '@/lib/validations'
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import SocialLinks from '@/components/brand/SocialLinks'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
  })

  async function onSubmit(data: ContactFormValues) {
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28">
        <div className="mb-14">
          <p className="section-label mb-4">Contact</p>
          <h1 className="text-white">
            <span className="head-sans text-5xl lg:text-6xl block">Get in</span>
            <span className="head-serif italic text-5xl lg:text-6xl text-accent/90 block">Touch</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col gap-6">
            {[
              { icon: Phone, label: 'Phone / WhatsApp', value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
              { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', href: '#' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-5 rounded-2xl glass-card-dark hover:border-white/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white font-medium group-hover:text-accent/90 transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
            <SocialLinks variant="dark" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 transition-colors"
            >
              <MessageSquare size={18} className="text-[#25D366]" />
              <span className="text-[#25D366] font-semibold">WhatsApp — Fastest Response</span>
            </a>
          </div>

          {submitted ? (
            <div className="flex items-center justify-center rounded-3xl bg-white/4 border border-white/8 p-12">
              <div className="text-center">
                <p className="text-4xl mb-4">✓</p>
                <p className="text-white font-semibold text-lg mb-2">Message sent!</p>
                <p className="text-white/50 text-sm">Faith will get back to you within 24 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {[
                { name: 'name' as const, label: 'Your Name', type: 'text', placeholder: 'Jane Wanjiku' },
                { name: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
                { name: 'phone' as const, label: 'Phone / WhatsApp', type: 'tel', placeholder: '+254 7XX XXX XXX' },
                { name: 'subject' as const, label: 'Subject', type: 'text', placeholder: 'Home organizing inquiry' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">{field.label}</label>
                  <input
                    {...register(field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                  {errors[field.name] && (
                    <p className="text-danger text-xs mt-1">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Message</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Tell us about your space and what you need..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none"
                />
                {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
