import type { BlogPost, BlogCategory } from '@/lib/types'
import { IMG } from '@/lib/image-placeholders'

const BLOG_COVERS = [
  IMG.blog.kitchen,
  IMG.blog.home,
  IMG.blog.products,
  IMG.blog.moving,
  IMG.blog.tips,
  IMG.blog.office,
] as const

/** Admin-extended blog post with draft support and view counts */
export interface AdminPost extends BlogPost {
  status:    'draft' | 'published'
  views:     number
  metaTitle?:       string
  metaDescription?: string
}

const SAMPLE_CONTENT = `## Introduction

Organizing your home in Nairobi doesn't have to feel overwhelming. Whether you're in a compact Kilimani apartment or a spacious Karen villa, the same principles apply — start with what you have, edit ruthlessly, and create systems that work *for your life*.

## Step 1: Declutter First

Before buying a single storage product, go through every item in the space. Ask yourself: **Does this belong here? Do I use it? Do I love it?**

Create three piles:
- **Keep** — items that earn their place
- **Donate / Sell** — still useful but not for you  
- **Discard** — worn out, broken, or genuinely useless

> "Clutter is nothing more than postponed decisions." — Barbara Hemphill

## Step 2: Group Like with Like

Once you've edited, group similar items together. All kitchen tools in one zone. All cleaning products in one cupboard. This sounds obvious — but most homes skip this step and wonder why nothing stays organized.

## Step 3: Assign a Home to Everything

Every item needs a permanent home. When something doesn't have a home, it ends up on the nearest flat surface — and flat surfaces become clutter magnets.

\`\`\`
Rule of thumb:
Items used daily  → most accessible spots (waist to eye height)
Items used weekly → lower shelves or back of cupboards  
Items used rarely → high shelves, storage boxes, loft
\`\`\`

## Step 4: Label Everything

Labels aren't just for the obsessively organized — they're a communication tool for everyone in the home. When everyone knows where things belong, things actually get put back.

## Step 5: Maintain Weekly

Set aside 15 minutes every Sunday to do a "reset." Return stray items, wipe down surfaces, and check that systems are still working. Prevention is infinitely easier than cure.

---

Need help getting started? [Book a consultation](/book) and let Faith come to you.`

export const MOCK_ADMIN_POSTS: AdminPost[] = [
  {
    slug:            'organize-kitchen-nairobi-apartment',
    title:           'How to Organize Your Kitchen in a Nairobi Apartment',
    excerpt:         'Small kitchens are the norm in Nairobi apartments — but with the right systems and products, you can have a beautifully organized kitchen that works hard for you every day.',
    content:         SAMPLE_CONTENT,
    coverImage:  IMG.blog.kitchen,
    category:        'home-tips',
    author:          'Faith The Organizer',
    publishedAt:     '2026-03-10',
    readTime:        6,
    tags:            ['kitchen', 'apartment', 'nairobi', 'small-spaces'],
    status:          'published',
    views:           1_840,
    metaTitle:       'How to Organize Your Kitchen in a Nairobi Apartment | Faith The Organizer',
    metaDescription: 'Small kitchens are the norm in Nairobi apartments — but with the right systems and products, you can have a beautifully organized kitchen that works for you.',
  },
  {
    slug:        'before-after-runda-family-home',
    title:       'Before & After: Transforming a Runda Family Home',
    excerpt:     'A four-bedroom family home in Runda was bursting at the seams. See how we turned chaos into calm over two days — every room, every drawer, every shelf.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.home,
    category:    'before-and-after',
    author:      'Faith The Organizer',
    publishedAt: '2026-03-04',
    readTime:    8,
    tags:        ['before-and-after', 'runda', 'whole-house', 'family'],
    status:      'published',
    views:       2_310,
  },
  {
    slug:        'best-organizing-products-kenya',
    title:       'The Best Organizing Products You Can Buy in Kenya Right Now',
    excerpt:     'After organizing hundreds of homes, these are the products I recommend again and again — all available in Nairobi or deliverable across Kenya.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.products,
    category:    'product-reviews',
    author:      'Faith The Organizer',
    publishedAt: '2026-02-20',
    readTime:    5,
    tags:        ['products', 'recommendations', 'kenya', 'storage'],
    status:      'published',
    views:       3_120,
  },
  {
    slug:        'declutter-before-moving-house-nairobi',
    title:       'How to Declutter Before Moving House in Nairobi',
    excerpt:     'Moving is the perfect time to edit your possessions — but only if you plan it right. Here is a room-by-room guide to decluttering before your Nairobi move.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.moving,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '2026-02-08',
    readTime:    7,
    tags:        ['moving', 'declutter', 'nairobi', 'packing'],
    status:      'published',
    views:       980,
  },
  {
    slug:        '5-signs-you-need-professional-organizer',
    title:       '5 Signs You Need a Professional Organizer',
    excerpt:     'If you have ever lost your keys, missed a bill, or felt overwhelmed just walking into your own home — this article is for you.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.tips,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '2026-01-15',
    readTime:    4,
    tags:        ['tips', 'getting-started', 'stress', 'clutter'],
    status:      'published',
    views:       4_450,
  },
  {
    slug:        'keep-home-office-organized-nairobi',
    title:       'How to Keep Your Home Office Organized in Nairobi',
    excerpt:     'Working from home in Nairobi comes with unique challenges — from power cuts to small spaces. Here is how to build a workspace that keeps you focused.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.office,
    category:    'office',
    author:      'Faith The Organizer',
    publishedAt: '2025-12-08',
    readTime:    5,
    tags:        ['office', 'productivity', 'work-from-home', 'nairobi'],
    status:      'published',
    views:       1_560,
  },
  {
    slug:        'nairobi-apartment-storage-hacks',
    title:       'Nairobi Apartment Storage Hacks That Actually Work',
    excerpt:     'Vertical space, under-bed storage, and door organisers are game-changers in small Nairobi apartments. Here are 12 hacks that transform cramped spaces.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.kitchen,
    category:    'nairobi-living',
    author:      'Faith The Organizer',
    publishedAt: '2025-11-22',
    readTime:    6,
    tags:        ['nairobi', 'storage', 'hacks', 'apartment'],
    status:      'published',
    views:       2_070,
  },
  {
    slug:        'spring-clean-checklist-2026',
    title:       'The Ultimate Spring Clean Checklist for 2026',
    excerpt:     'Room-by-room, drawer-by-drawer — this is the most thorough spring cleaning guide you will find for Kenyan homes.',
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.home,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '',
    readTime:    9,
    tags:        ['checklist', 'spring-clean', 'seasonal'],
    status:      'draft',
    views:       0,
  },
  {
    slug:        'wardrobe-capsule-nairobi-guide',
    title:       'How to Build a Capsule Wardrobe for Nairobi Weather',
    excerpt:     "Nairobi's unpredictable weather doesn't have to mean a chaotic wardrobe. Learn how to build a capsule collection that works year-round.",
    content:     SAMPLE_CONTENT,
    coverImage:  IMG.blog.products,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '',
    readTime:    5,
    tags:        ['wardrobe', 'capsule', 'nairobi', 'fashion'],
    status:      'draft',
    views:       0,
  },
]

export const BLOG_CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'home-tips',        label: 'Home Tips'        },
  { value: 'office',           label: 'Office'           },
  { value: 'before-and-after', label: 'Before & After'   },
  { value: 'product-reviews',  label: 'Product Reviews'  },
  { value: 'nairobi-living',   label: 'Nairobi Living'   },
]
