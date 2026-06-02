import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Brand — Figma redesign tokens */
        primary: '#CC1212',
        danger: '#991010',
        accent: '#E8A020',
        warning: '#E8A020',
        success: '#2D7A47',
        /* Neutrals */
        dark: '#111111',
        softBlack: '#1A1A1A',
        surface: '#FAFAF8',
        cream: '#F7F2EC',
        muted: '#F4F4F4',
        card: '#FFFFFF',
        border: 'rgba(26, 26, 26, 0.12)',
        /* Admin sidebar (semantic alias) */
        sidebar: '#1A1A1A',
        'sidebar-foreground': '#FAFAF8',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25' }],
      },
      maxWidth: {
        content: '1280px',
        wide: '1400px',
      },
      spacing: {
        section: '6rem',
        'section-sm': '3.5rem',
      },
      borderRadius: {
        button: '0.75rem',
        card: '1.25rem',
        modal: '1.5rem',
        xl: '1rem',
        lg: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(17, 17, 17, 0.04), 0 1px 3px 0 rgba(17, 17, 17, 0.06)',
        'card-hover':
          '0 4px 12px 0 rgba(17, 17, 17, 0.06), 0 2px 4px 0 rgba(17, 17, 17, 0.04)',
        soft: '0 1px 3px 0 rgba(17, 17, 17, 0.08)',
      },
      ringColor: {
        DEFAULT: '#CC1212',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')],
}
export default config
