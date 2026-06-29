import Image from 'next/image'
import { IMG } from '@/lib/image-placeholders'

export default function TransformationShowcase() {
  return (
    <section className="bg-surface border-t border-dark/8 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-start gap-8 mb-12">
          <div>
            <p className="head-sans text-6xl text-dark leading-none">2.5k+</p>
            <p className="text-dark/45 text-xs mt-2 max-w-[140px]">Happy clients, unforgettable spaces.</p>
          </div>
          <div className="ml-auto text-right">
            <p className="section-label text-dark/40 mb-2">Gallery</p>
            <h2 className="text-dark text-3xl">
              <span className="head-sans block">Before & After</span>
              <span className="head-serif italic text-primary">Moments</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-72 img-zoom group">
            <Image
              src={IMG.gallery.transform1}
              alt="Home transformation"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <p
                className="caption-rotate text-white/60 text-xs tracking-widest uppercase"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
              >
                Living Room Reveal
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-72 img-zoom">
            <Image
              src={IMG.gallery.transform2}
              alt="Organized bedroom"
              fill
              className="object-cover"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs font-semibold">Bedroom & Closet</p>
              <p className="text-white/50 text-[10px] italic font-display">Space Planning</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
            <Image
              src={IMG.gallery.transform3}
              alt="Organized kitchen"
              fill
              className="object-cover"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-xs font-semibold">Kitchen</p>
              <p className="text-white/40 text-[10px] italic font-display">Decluttering</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
            <Image
              src={IMG.gallery.transform4}
              alt="Organized office"
              fill
              className="object-cover"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-xs font-semibold">Home Office</p>
              <p className="text-white/40 text-[10px] italic font-display">Organization</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
            <Image
              src={IMG.gallery.transform5}
              alt="Storage solutions"
              fill
              className="object-cover"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-xs font-semibold">Storage & Shelving</p>
              <p className="text-white/40 text-[10px] italic font-display">Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
