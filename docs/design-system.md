# Faith The Organizer — design system

Single source of truth: the `:root` block in `src/app/globals.css`. Tailwind reads it via `tailwind.config.ts`.
JS-only consumers (Recharts etc.) use `src/lib/brand-colors.ts`; `src/lib/__tests__/design-tokens.test.ts` fails if they drift.

## Colour

| Token | Value | Use |
|---|---|---|
| `primary` | `#E8191A` (logo red) | Buttons, accents. White text passes WCAG AA (4.6:1). |
| `primary-dark` | `#CC1212` | Hover, focus ring, red text on light surfaces, charts |
| `accent` | `#F0A824` | Highlights, "processing" status |
| `dark` / `ink` | `#2D2D2D` / `#1A1A1A` | Text, dark sections |
| `page` / `surface` / `muted` | `#F7F7F8` / `#FAFAFA` / `#F4F4F4` | Backgrounds |
| `success` / `danger` | `#2D7A47` / `#B91212` | Status |

Use `bg-primary/90`, `text-dark/60` etc. Never hard-code a brand hex.

## Type

Display: Playfair Display (`font-display`, `.head-serif`). Body/UI: Inter (`font-sans`, `.head-sans` at weight 800). Data: DM Mono (`font-mono`).
Eyebrows: `.eyebrow` on light surfaces, `.eyebrow-on-dark` on dark.

## Radii and elevation

`rounded-xl` (control, 1rem), `rounded-card` (1.75rem), `rounded-panel` (2rem), `rounded-full`. Shadows: `shadow-card-sm|md|lg`.

## Components

- `Button` (`ui/Button.tsx`) for actions; `.btn-primary` / `.btn-outline` for pill-style links.
- `Card` (`ui/Card.tsx`): `solid` (default), `glass`, `dark`. Prefer solid for content.
- `Badge` and `Chip` (`aria-pressed`) in `ui/`.
- Glass (`.glass-*`, `GlassPanel`): nav, floating panels and hero overlays only. Blur is halved on small screens and falls back to solid under `prefers-reduced-transparency` or when `backdrop-filter` is unsupported.
- Component CSS lives in `@layer components`, so Tailwind utilities always win (`glass-card rounded-3xl` works).

## Content

Public claims (homes organised, rating, years in business, clients) live in `src/lib/site-facts.ts`. Update them there only.
