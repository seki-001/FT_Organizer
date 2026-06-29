/**
 * Illustrated client avatars — Sweet Flower Shop / Figma community style
 * (flat illustrated faces, not stock photography).
 * @see https://www.figma.com/community/file/1497437463361122374/sweet-flower-shop
 */

export const CLIENT_AVATARS = [
  '/images/avatars/avatar-1.svg',
  '/images/avatars/avatar-2.svg',
  '/images/avatars/avatar-3.svg',
  '/images/avatars/avatar-4.svg',
] as const

export function clientAvatar(index: number): string {
  return CLIENT_AVATARS[index % CLIENT_AVATARS.length]
}

/** Stable illustrated avatar from user id or email (no stock photos). */
export function clientAvatarForUser(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % CLIENT_AVATARS.length
  }
  return CLIENT_AVATARS[hash] ?? CLIENT_AVATARS[0]
}
