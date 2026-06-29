import { NextRequest, NextResponse } from 'next/server'

const CAT_MAP: Record<string, string> = {
  'BASKETS': 'baskets',
  'BATHROOM': 'bathroom',
  'BEAUTY & COSMETICS': 'beauty-cosmetics',
  'CAR ORGANIZERS': 'car-organizers',
  'CLOSETS & WARDROBES': 'closet-bedroom',
  'CONTAINERS & STORAGE': 'storage-containers',
  'DINNING': 'dining',
  'FRIDGE': 'fridge',
  'FURNITURE': 'furniture',
  'GADGETS': 'gadgets',
  'GROOMING & HYGIENE': 'grooming-hygiene',
  'HARDWARE': 'hardware',
  'HEALTH': 'health',
  'INTERIOR DECOR': 'interior-decor',
  'KIDS CORNER': 'kids-corner',
  'KITCHEN': 'kitchen',
  'LAUNDRY & CLEANING': 'laundry-cleaning',
  'PACKAGING': 'packaging',
  'PANTRY ORGANIZERS': 'pantry',
  'SHELVES & DRAWERS': 'shelves-drawers',
  'SINK': 'bathroom',
  'SPICES': 'spices',
  'STANDS & RACKS': 'stands-racks',
  'STATIONERY': 'stationery',
  'TRAVEL': 'travel',
}

function toSlug(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function parseCSV(text: string): string[][] {
  return text
    .split('\n')
    .map(line => line.split(',').map(c => c.trim().replace(/^"|"$/g, '')))
    .filter(row => row.some(c => c.length > 0))
}

function groupProducts(rows: string[][]): Array<{
  name: string; category: string; price: number; stock: number; variants: number
}> {
  // Find header row
  let dataStart = 0
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    if (rows[i][0]?.toUpperCase() === 'CATEGORY' || rows[i][1]?.toUpperCase() === 'ITEM_NAME') {
      dataStart = i + 1
      break
    }
  }

  const map = new Map<string, { cat: string; prices: number[]; stocks: number[]; variants: number }>()

  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i]
    const cat = row[0]?.trim().toUpperCase() ?? ''
    const name = row[1]?.trim() ?? ''
    const price = parseFloat(row[3] ?? '0') || 0
    const stock = parseInt(row[5] ?? '0') || 0
    const hasVariant = (row[2]?.trim().length ?? 0) > 0

    if (!name || !cat || name === 'ITEM_NAME') continue

    const key = `${cat}::${name}`
    const existing = map.get(key)
    if (existing) {
      existing.prices.push(price)
      existing.stocks.push(stock)
      if (hasVariant) existing.variants++
    } else {
      map.set(key, { cat, prices: [price], stocks: [stock], variants: hasVariant ? 1 : 0 })
    }
  }

  return Array.from(map.entries()).map(([key, v]) => {
    const name = key.split('::')[1]
    const catSlug = CAT_MAP[v.cat] ?? 'storage-containers'
    const minPrice = Math.min(...v.prices.filter(p => p > 0)) || v.prices[0] || 0
    const totalStock = v.stocks.reduce((a, b) => a + b, 0)
    return { name, category: catSlug, price: minPrice, stock: totalStock, variants: v.variants }
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, errors: ['No file uploaded'] }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      return NextResponse.json({ success: false, errors: ['Only .xlsx, .xls, and .csv files are supported'] }, { status: 400 })
    }

    let rows: string[][]

    if (ext === 'csv') {
      const text = await file.text()
      rows = parseCSV(text)
    } else {
      // For xlsx: parse binary using a lightweight approach
      // In production this would use xlsx/exceljs library
      // For now return a helpful error guiding csv upload
      return NextResponse.json({
        success: false,
        imported: 0,
        skipped: 0,
        errors: ['For Excel files, please export as CSV first (File → Save As → CSV). CSV import is fully supported.'],
        products: [],
      })
    }

    if (rows.length < 2) {
      return NextResponse.json({ success: false, imported: 0, skipped: 0, errors: ['File appears empty or unreadable'], products: [] })
    }

    const products = groupProducts(rows)
    const errors: string[] = []

    // Validate
    const invalid = products.filter(p => !p.name || p.price <= 0)
    invalid.forEach(p => errors.push(`Skipped "${p.name}": missing name or price`))
    const valid = products.filter(p => p.name && p.price > 0)

    return NextResponse.json({
      success: true,
      imported: valid.length,
      skipped: invalid.length,
      errors,
      products: valid.slice(0, 100), // Preview first 100
    })
  } catch (err) {
    console.error('[import]', err)
    return NextResponse.json({
      success: false,
      imported: 0,
      skipped: 0,
      errors: ['Server error during import. Please check your file format.'],
      products: [],
    }, { status: 500 })
  }
}
