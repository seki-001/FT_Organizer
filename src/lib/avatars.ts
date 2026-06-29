/**
 * Material 3 Design Kit avatars — exported from Figma community file.
 * @see https://www.figma.com/design/lUFFkUIPazgrOlvjz723wH/Material-3-Design-Kit--Community-
 * Re-export: node scripts/export-figma-avatars.mjs (requires FIGMA_ACCESS_TOKEN)
 */

export const CLIENT_AVATARS = [
  '/images/avatars/m3-avatar-01.png',
  '/images/avatars/m3-avatar-02.png',
  '/images/avatars/m3-avatar-03.png',
  '/images/avatars/m3-avatar-04.png',
  '/images/avatars/m3-avatar-05.png',
  '/images/avatars/m3-avatar-06.png',
  '/images/avatars/m3-avatar-07.png',
  '/images/avatars/m3-avatar-08.png',
  '/images/avatars/m3-avatar-09.png',
  '/images/avatars/m3-avatar-10.png',
  '/images/avatars/m3-avatar-11.png',
] as const

/** First four — hero cluster & compact UI */
export const HERO_AVATARS = CLIENT_AVATARS.slice(0, 4)

export function clientAvatar(index: number): string {
  return CLIENT_AVATARS[index % CLIENT_AVATARS.length]
}

/** Stable avatar from user id or email */
export function clientAvatarForUser(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % CLIENT_AVATARS.length
  }
  return CLIENT_AVATARS[hash] ?? CLIENT_AVATARS[0]
}
