/**
 * Brand colours for places CSS variables can't reach (Recharts SVG props,
 * canvas, OG images). These MUST mirror the tokens in src/app/globals.css —
 * `src/lib/__tests__/design-tokens.test.ts` fails if they drift.
 */
export const BRAND = {
  primary: '#E8191A',
  primaryDark: '#CC1212',
  accent: '#F0A824',
  dark: '#2D2D2D',
  ink: '#1A1A1A',
} as const
