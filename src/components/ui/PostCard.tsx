import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { BlogPost, BlogCategory } from '@/lib/types'

// ─── Category display map ─────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'home-tips':       'Home Tips',
  'office':          'Office',
  'before-and-after': 'Before & After',
  'product-reviews': 'Product Reviews',
  'nairobi-living':  'Nairobi Living',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function authorInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0][0]
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: BlogPost
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col group">
      {/* Cover image */}
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Category tag */}
        <span className="inline-flex self-start bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
          {CATEGORY_LABELS[post.category]}
        </span>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-dark leading-snug hover:text-primary transition-colors duration-150 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-dark/60 text-sm leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Footer: author + date + read time */}
        <div className="flex items-center gap-3 pt-2 border-t border-dark/5 mt-auto">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-dark text-white text-xs font-bold flex-shrink-0 uppercase"
            aria-hidden="true"
          >
            {authorInitials(post.author)}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-dark text-xs font-medium truncate">{post.author}</span>
            <div className="flex items-center gap-2 text-dark/40 text-xs">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} aria-hidden="true" />
                {post.readTime} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
