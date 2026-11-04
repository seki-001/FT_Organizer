import type { Config } from 'tailwindcss'

/**
 * Colours are driven by CSS variables (see :root in src/app/globals.css) stored
 * as space-separated RGB channels so Tailwind opacity modifiers keep working
 * (`bg-primary/90`, `text-dark/50`). Change a brand colour in ONE place.
 */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: token('primary'),
          dark: token('primary-dark'),
        },
        accent: token('accent'),
        page: token('page'),
        ink: token('ink'),
        dark: token('dark'),
        surface: token('surface'),
        muted: token('muted'),
        success: token('success'),
        danger: token('danger'),
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
      // Named radii: control → card → panel → pill. Prefer these over raw values.
      borderRadius: {
        xl: 'var(--radius-control)',
        lg: '0.5rem',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'card-sm': 'var(--shadow-sm)',
        'card-md': 'var(--shadow-md)',
        'card-lg': 'var(--shadow-lg)',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')],
}
export default config
