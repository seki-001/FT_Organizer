import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { BRAND } from '../brand-colors'

const root = join(__dirname, '..', '..')
const css = readFileSync(join(root, 'app', 'globals.css'), 'utf8')

function tokenHex(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)`))
  if (!m) throw new Error(`token --color-${name} missing from globals.css`)
  return '#' + m.slice(1, 4).map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase()
}

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|css)$/.test(f)) out.push(p)
  }
  return out
}

describe('design tokens', () => {
  it('brand-colors.ts mirrors the CSS tokens', () => {
    expect(tokenHex('primary')).toBe(BRAND.primary)
    expect(tokenHex('primary-dark')).toBe(BRAND.primaryDark)
    expect(tokenHex('accent')).toBe(BRAND.accent)
    expect(tokenHex('dark')).toBe(BRAND.dark)
    expect(tokenHex('ink')).toBe(BRAND.ink)
  })

  it('primary red matches the logo red and passes WCAG AA with white text', () => {
    expect(BRAND.primary).toBe('#E8191A')
    const lin = (c: number) => {
      const s = c / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(BRAND.primary.slice(i, i + 2), 16))
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    expect(1.05 / (L + 0.05)).toBeGreaterThanOrEqual(4.5)
  })

  it('does not reference fonts the app never loads', () => {
    expect(css).not.toMatch(/dm-sans|DM Sans|--font-syne|'Syne'/i)
  })

  it('defines no duplicate selectors that previously drifted', () => {
    expect((css.match(/^\s*\.scrollbar-hide\s*\{/gm) ?? []).length).toBe(1)
  })

  it('no legacy class names remain in components', () => {
    const offenders = walk(join(root, 'components'))
      .concat(walk(join(root, 'app')))
      .filter((f) => f.endsWith('.tsx'))
      .filter((f) => /\b(sfs-[a-z-]+|section-label)\b/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('only the token files contain the old stray brand reds', () => {
    const allowed = new Set(['brand-colors.ts', 'design-tokens.test.ts', 'globals.css'])
    const offenders = walk(root)
      .filter((f) => !allowed.has(f.split('/').pop()!))
      .filter((f) => /#(F01A1B|CC1212|E8A020)/i.test(readFileSync(f, 'utf8')))
    expect(offenders.map((f) => f.replace(root, ''))).toEqual([])
  })
})
