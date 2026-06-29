#!/usr/bin/env node
/**
 * Export Material 3 avatars from Figma into public/images/avatars/
 * Usage: node scripts/export-figma-avatars.mjs
 * Requires FIGMA_ACCESS_TOKEN in .env.local
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public/images/avatars')

const FIGMA_FILE_KEY = 'lUFFkUIPazgrOlvjz723wH'

/** Node IDs from Material 3 Design Kit — user-selected avatars */
const AVATAR_NODES = [
  '52767:23942',
  '52767:23931',
  '52767:23940',
  '52767:23944',
  '52767:23937',
  '52767:23936',
  '52767:23935',
  '52767:23921',
  '52767:23932',
  '52767:23941',
  '52767:23945',
]

function loadToken() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) throw new Error('Missing .env.local')
  const match = fs.readFileSync(envPath, 'utf8').match(/^FIGMA_ACCESS_TOKEN=(.+)$/m)
  const token = match?.[1]?.trim()
  if (!token) throw new Error('FIGMA_ACCESS_TOKEN not set in .env.local')
  return token
}

async function figmaGet(url, token) {
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Figma API ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

async function main() {
  const token = loadToken()
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const ids = AVATAR_NODES.join(',')
  const imagesUrl = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`
  const { images, err } = await figmaGet(imagesUrl, token)
  if (err) throw new Error(err)

  const exported = []
  let i = 1
  for (const nodeId of AVATAR_NODES) {
    const url = images[nodeId]
    if (!url) {
      console.warn(`No image URL for node ${nodeId}`)
      continue
    }
    const filename = `m3-avatar-${String(i).padStart(2, '0')}.png`
    const outPath = path.join(OUT_DIR, filename)
    const imgRes = await fetch(url)
    if (!imgRes.ok) throw new Error(`Download failed for ${nodeId}`)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    fs.writeFileSync(outPath, buf)
    exported.push(filename)
    console.log(`✓ ${filename} (${nodeId})`)
    i++
  }

  console.log(`\nExported ${exported.length} avatars to public/images/avatars/`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
