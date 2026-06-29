import type { BlogPost } from '@/lib/types'
import { IMG } from '@/lib/image-placeholders'

const COVER = IMG.blog

const LOREM = `## Why This Matters in Nairobi Homes

Most Nairobi homes were not built with storage in mind. Whether you are in a two-bedroom apartment in Kilimani or a four-bedroom house in Karen, the struggle is the same: too much stuff, not enough intentional space. The good news is that with a clear system, any home can be transformed — without buying a single new storage product.

## The Core Organizing Principle

The most effective organizing method is not about buying more baskets or shelves. It starts with editing your possessions down to only what you genuinely use, love, or need. Everything after that is just placement. Once you own less, every item has a natural home and keeping tidy becomes effortless rather than exhausting.

### Step One — Empty and Edit

Pull everything out of the space you are organizing. Yes, everything. Lay it all out where you can see it clearly. Now ask yourself honestly: have I used this in the last 12 months? Does it work? Does it have a purpose in my current life? If the answer is no, it leaves the house. This single step removes 30–50% of clutter in most Nairobi homes.

### Step Two — Categorize and Contain

Once you have edited down, group similar items together. All kitchen tools in one zone. All cleaning supplies together. All documents in one place. Only after grouping should you measure and buy containers — if you need them at all. The container should fit the items you kept, not the other way around.

## Making It Last

The hardest part of organizing is not getting organized — it is staying organized. The system only holds if every item has a specific, logical home and every member of the household knows where that home is. Label. Communicate. Keep flat surfaces clear as a rule. And do a 10-minute reset every evening before bed. That single habit prevents 90% of the clutter from ever building back up.`

export const MOCK_POSTS: BlogPost[] = [
  {
    slug:        'organize-kitchen-nairobi-apartment',
    title:       'How to Organize Your Kitchen in a Nairobi Apartment',
    excerpt:     'Small kitchens are the norm in Nairobi apartments — but with the right systems and products, you can have a beautifully organized kitchen that works hard for you every day.',
    content:     LOREM,
    coverImage:  COVER.kitchen,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '2024-12-10',
    readTime:    6,
    tags:        ['kitchen', 'apartment', 'nairobi', 'small-spaces'],
  },
  {
    slug:        'before-after-runda-family-home',
    title:       'Before & After: Transforming a Runda Family Home',
    excerpt:     'A four-bedroom family home in Runda was bursting at the seams. See how we turned chaos into calm over two days — every room, every drawer, every shelf.',
    content:     LOREM,
    coverImage:  COVER.home,
    category:    'before-and-after',
    author:      'Faith The Organizer',
    publishedAt: '2024-11-18',
    readTime:    8,
    tags:        ['before-and-after', 'runda', 'whole-house', 'family'],
  },
  {
    slug:        'best-organizing-products-kenya',
    title:       'The Best Organizing Products You Can Buy in Kenya Right Now',
    excerpt:     'After organizing hundreds of homes, these are the products I recommend again and again — all available in Nairobi or deliverable across Kenya.',
    content:     LOREM,
    coverImage:  COVER.products,
    category:    'product-reviews',
    author:      'Faith The Organizer',
    publishedAt: '2024-11-02',
    readTime:    5,
    tags:        ['products', 'recommendations', 'kenya', 'storage'],
  },
  {
    slug:        'declutter-before-moving-house-nairobi',
    title:       'How to Declutter Before Moving House in Nairobi',
    excerpt:     'Moving is the perfect time to edit your possessions — but only if you plan it right. Here is a room-by-room guide to decluttering before your Nairobi move.',
    content:     LOREM,
    coverImage:  COVER.moving,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '2024-10-14',
    readTime:    7,
    tags:        ['moving', 'declutter', 'nairobi', 'packing'],
  },
  {
    slug:        '5-signs-you-need-professional-organizer',
    title:       '5 Signs You Need a Professional Organizer',
    excerpt:     'If you have ever lost your keys, missed a bill, or felt overwhelmed just walking into your own home — this article is for you.',
    content:     LOREM,
    coverImage:  COVER.tips,
    category:    'home-tips',
    author:      'Faith The Organizer',
    publishedAt: '2024-09-25',
    readTime:    4,
    tags:        ['tips', 'getting-started', 'stress', 'clutter'],
  },
  {
    slug:        'keep-home-office-organized-nairobi',
    title:       'How to Keep Your Home Office Organized in Nairobi',
    excerpt:     'Working from home in Nairobi comes with unique challenges — from power cuts to small spaces. Here is how to build a workspace that keeps you focused and productive.',
    content:     LOREM,
    coverImage:  COVER.office,
    category:    'office',
    author:      'Faith The Organizer',
    publishedAt: '2024-09-08',
    readTime:    5,
    tags:        ['office', 'productivity', 'work-from-home', 'nairobi'],
  },
]
