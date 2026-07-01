export const WHY_CHOOSE_US = {
  title: 'Why Choose Faith The Organizer?',
  items: [
    'Professional and Experienced Team',
    'Customized Solutions',
    'Practical and Sustainable Systems',
    'Quality Products and Services',
    'Skilled and Trained Personnel',
    'Reliable Service Delivery',
    'Comprehensive Home and Workplace Solutions',
  ],
  closing:
    'Faith The Organizer is committed to helping individuals, families, and organizations create organized, productive, beautiful, and efficient spaces that support better living and working.',
} as const

export const COMPANY_MISSION = {
  tagline: 'Home, Workplace, Training & Staffing Solutions',
  about: [
    'Faith The Organizer is a professional service company committed to transforming homes, workplaces, and lifestyles through comprehensive organization, storage solutions, cleaning services, training programs, staffing solutions, relocation support, and event services.',
    'We support individuals, families, businesses, institutions, and organizations in creating functional, organized, productive, and aesthetically pleasing environments. In addition, we provide skilled personnel and practical training solutions that enhance quality of life and improve operational efficiency.',
    'Our mission is to deliver order, efficiency, comfort, and productivity through professional solutions tailored to meet each client\u2019s unique needs.',
  ],
} as const

export type ServiceSection = {
  title: string
  items: string[]
}

export type ServiceContent = {
  overview: string
  sections: ServiceSection[]
}

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  'professional-organizing': {
    overview:
      'Our Professional Organizing Services are designed to help clients regain control of their spaces, reduce stress, enhance productivity, and establish sustainable systems that simplify daily living.',
    sections: [
      {
        title: 'Home Organization',
        items: [
          'Bedrooms, kitchens, pantries, closets and wardrobes',
          'Bathrooms, children\u2019s rooms, playrooms, and laundry areas',
          'Garages and storage rooms',
        ],
      },
      {
        title: 'Home Decluttering',
        items: [
          'Sort and categorize belongings',
          'Reduce excess possessions',
          'Donate or responsibly dispose of unwanted items',
          'Maximize usable space and develop sustainable habits',
        ],
      },
      {
        title: 'Office Organization',
        items: [
          'Workspace organization and filing systems',
          'Storage optimization and workflow improvement',
        ],
      },
      {
        title: 'Home Staging',
        items: ['Sale, rental, property viewings, and photography sessions'],
      },
      {
        title: 'Digital Organization',
        items: ['Documents, computer files, photos, and digital records'],
      },
    ],
  },
  'storage-design-installation': {
    overview:
      'We design and implement customized storage systems that maximize space utilization, functionality, convenience, and visual appeal.',
    sections: [
      {
        title: 'Kitchen Storage Design',
        items: [
          'Kitchen cabinet planning and pantry organization systems',
          'Drawer organization solutions and space optimization designs',
        ],
      },
      {
        title: 'Wardrobe & Closet Design',
        items: [
          'Built-in wardrobes and walk-in closets',
          'Clothing storage and accessory organization solutions',
        ],
      },
      {
        title: 'Custom Storage Solutions',
        items: [
          'Shelving systems, garage storage, laundry room storage',
          'Utility room organization',
        ],
      },
      {
        title: 'Product Supply & Installation',
        items: [
          'Organizing containers, storage bins, shelving units',
          'Drawer organizers, labels, and storage accessories',
        ],
      },
    ],
  },
  'cleaning-housekeeping': {
    overview:
      'We provide professional cleaning and housekeeping services for residential, commercial, and institutional environments.',
    sections: [
      {
        title: 'Residential Cleaning',
        items: [
          'Deep cleaning, spring cleaning, and routine house cleaning',
          'Move-in and move-out cleaning',
        ],
      },
      {
        title: 'Commercial Cleaning',
        items: [
          'Office, retail space, facility, and common area cleaning',
        ],
      },
      {
        title: 'Specialized Cleaning',
        items: [
          'Post-construction cleaning, event cleanup, pre-occupancy cleaning',
        ],
      },
      {
        title: 'Housekeeping Services',
        items: [
          'Laundry management, linen care, household maintenance support',
          'Home care assistance',
        ],
      },
    ],
  },
  'relocation-transition': {
    overview:
      'Relocation can be complex and demanding. We streamline the process through structured and efficient relocation support services.',
    sections: [
      {
        title: 'Move Preparation',
        items: ['Pre-move decluttering, sorting, categorization, and relocation planning'],
      },
      {
        title: 'Packing Services',
        items: ['Professional packing, systematic labeling, and inventory management'],
      },
      {
        title: 'Unpacking Services',
        items: ['Unpacking and arrangement, space organization, and home setup'],
      },
      {
        title: 'New Home Setup',
        items: [
          'Kitchen organization, closet setup, storage implementation',
          'Functional room arrangement',
        ],
      },
    ],
  },
  'home-management': {
    overview:
      'We assist families and busy professionals in establishing systems that enhance household efficiency and improve daily living.',
    sections: [
      {
        title: 'Routine Optimization',
        items: ['Daily routines, weekly schedules, and household systems'],
      },
      {
        title: 'Household Systems Development',
        items: [
          'Cleaning schedules, shopping plans, meal planning, family coordination',
        ],
      },
      {
        title: 'Family Organization Coaching',
        items: [
          'Practical organization habits and long-term maintenance strategies',
        ],
      },
      {
        title: 'New Parent Support',
        items: [
          'Nursery setup, baby storage systems, household routine planning',
        ],
      },
    ],
  },
  'events-catering-decor': {
    overview:
      'We offer comprehensive event planning, d\u00e9cor styling, catering services, and event support solutions.',
    sections: [
      {
        title: 'Event D\u00e9cor',
        items: [
          'Birthday parties, baby showers, bridal showers',
          'Corporate events and family celebrations',
        ],
      },
      {
        title: 'Event Styling',
        items: ['Table styling, venue setup, theme design, decorative arrangements'],
      },
      {
        title: 'Catering Services',
        items: [
          'Food and beverage for corporate functions, private events',
          'Family gatherings and social celebrations',
        ],
      },
      {
        title: 'Event Support',
        items: ['Setup services, coordination assistance, and cleanup services'],
      },
    ],
  },
  'training-development': {
    overview:
      'We empower individuals with practical skills that enhance employability, professionalism, and entrepreneurial opportunities.',
    sections: [
      {
        title: 'Professional Organizer Training Program',
        items: [
          'Organizing principles, client management, business development',
          'Practical field experience',
        ],
      },
      {
        title: 'Housekeeping Course',
        items: [
          'Cleaning standards, laundry care, household management',
          'Professional conduct and customer service',
        ],
      },
      {
        title: 'Home Manager Training',
        items: [
          'Staff supervision, household systems management',
          'Basic budgeting and home operations management',
        ],
      },
      {
        title: 'Tidy Minds Club',
        items: [
          'School-based life skills: personal organization, time management',
          'Responsibility and study skills',
        ],
      },
      {
        title: 'Corporate Workshops',
        items: [
          'Productivity enhancement, workplace organization',
          'Time management and professional effectiveness',
        ],
      },
    ],
  },
  'staffing-workforce': {
    overview:
      'We recruit, train, vet, and place qualified domestic and support staff for homes, offices, businesses, and institutions.',
    sections: [
      {
        title: 'Domestic Staff Placement',
        items: [
          'Housekeepers, nannies, home managers, cooks, gardeners',
          'Caregivers, laundry attendants, domestic assistants',
        ],
      },
      {
        title: 'Office & Commercial Staff Placement',
        items: [
          'Office cleaners, tea attendants, office assistants',
          'Reception support, messengers, groundskeepers, janitorial staff',
        ],
      },
      {
        title: 'Temporary & Relief Staffing',
        items: [
          'Leave cover staff, temporary housekeepers and cleaners',
          'Event support staff, seasonal workers, emergency replacement',
        ],
      },
      {
        title: 'Staff Training & Certification',
        items: [
          'Housekeeping, childcare and nanny training',
          'Professional conduct, customer service, workplace safety',
          'Home management training',
        ],
      },
    ],
  },
  'organizing-products': {
    overview:
      'We offer a comprehensive range of organizing products and storage solutions designed to support efficient and well-structured living environments.',
    sections: [
      {
        title: 'Products',
        items: [
          'Storage bins, baskets, drawer organizers, pantry containers',
          'Wardrobe organizers, shelf organizers, labels, laundry organizers',
          'Office organizers and home storage solutions',
        ],
      },
    ],
  },
}

export function getServiceContent(slug: string): ServiceContent | null {
  return SERVICE_CONTENT[slug] ?? null
}

/** Flat list of included items for service detail pages */
export function getServiceIncludes(slug: string): string[] {
  const content = getServiceContent(slug)
  if (!content) return []

  return content.sections.flatMap((section) => {
    if (section.items.length === 1 && section.title !== 'Products') {
      return [`${section.title} — ${section.items[0]}`]
    }
    return section.items.map((item) => `${section.title}: ${item}`)
  })
}
