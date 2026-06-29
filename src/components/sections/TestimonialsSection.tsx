import Image from 'next/image'
import type { Testimonial } from '@/lib/types'
import { IMG } from '@/lib/image-placeholders'

const galleryImages = [
  {
    src: IMG.gallery.testimonial1,
    alt: 'Organized living room',
    caption: 'Living Room',
    subcaption: 'Reveal',
  },
  {
    src: IMG.gallery.testimonial2,
    alt: 'Organized closet',
    caption: 'Bedroom & Closet',
    subcaption: 'Planning',
  },
]

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Fransisca Wambui',
    location: 'Westlands, Nairobi',
    rating: 5,
    text: 'Incredible service! Faith and her team were punctual, courteous, and so thorough. My home feels like a completely different space. I cannot believe the transformation — every drawer, shelf and cabinet is now perfectly organized. Highly recommend!',
    service: 'Whole House Organizing',
    avatar: IMG.avatars[0],
  },
  {
    id: '2',
    name: 'Gladys A',
    location: 'Runda, Nairobi',
    rating: 5,
    text: 'Amazing, quick and thorough. Faith understood exactly what I needed and delivered beyond my expectations. She reorganized my kitchen and home office in a single day. The systems she put in place are so intuitive — everything has a home now.',
    service: 'Home Organizing',
    avatar: IMG.avatars[1],
  },
]

export default function TestimonialsSection() {
  return (
    <section className="flex flex-col lg:flex-row min-h-[60vh]">
      <div className="lg:w-2/5 bg-dark p-8 lg:p-12 flex flex-col gap-4">
        <p className="section-label text-white/40">Gallery</p>
        <div className="flex flex-col gap-3 flex-1">
          {galleryImages.slice(0, 2).map((img, i) => (
            <div key={i} className="relative flex-1 min-h-[160px] rounded-2xl overflow-hidden img-zoom">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
              <p className="absolute bottom-3 left-4 text-white text-xs font-semibold">{img.caption}</p>
              <p className="absolute bottom-3 left-4 mt-4 text-white/40 caption-rotate right-3 top-1/2 -translate-y-1/2 text-[10px] italic font-display">
                {img.subcaption}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-3/5 bg-surface p-8 lg:p-16 flex flex-col justify-center">
        <div className="mb-2">
          <p className="head-sans text-5xl text-dark leading-none">2.5k</p>
          <p className="head-serif italic text-5xl text-dark/70 leading-none">Reviews</p>
        </div>
        <p className="text-dark/40 text-xs mb-10">Real feedback from Nairobi clients who organized better.</p>

        <p className="section-label text-dark/40 mb-4">Testimonials</p>
        <h2 className="text-dark text-4xl mb-10">
          <span className="head-sans block">Loved by Nairobi</span>
          <span className="head-serif italic block text-primary">Homeowners</span>
        </h2>

        <div className="flex flex-col gap-5">
          {testimonials.slice(0, 2).map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-dark/10">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-accent text-sm">★</span>
                ))}
              </div>
              <p className="text-dark/70 text-sm leading-relaxed italic font-display mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatar && (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
                  </div>
                )}
                <div>
                  <p className="text-dark font-semibold text-sm">{t.name}</p>
                  <p className="text-dark/40 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
