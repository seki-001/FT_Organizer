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
        primary: '#F01A1B',
        accent: '#F0A824',
        dark: '#2D2D2D',
        surface: '#FAFAFA',
        muted: '#F4F4F4',
        success: '#2D7A47',
        danger: '#B91212',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'sfs-sm': '0 1px 3px rgba(45, 45, 45, 0.06), 0 1px 2px rgba(45, 45, 45, 0.04)',
        'sfs-md': '0 8px 24px rgba(45, 45, 45, 0.08), 0 2px 8px rgba(45, 45, 45, 0.04)',
        'sfs-lg': '0 16px 48px rgba(45, 45, 45, 0.10), 0 4px 16px rgba(45, 45, 45, 0.05)',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')],
}
export default config
