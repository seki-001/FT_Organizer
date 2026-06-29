'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
  products: Array<{ name: string; category: string; price: number; stock: number; variants: number }>
}

export default function ProductImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      alert('Please upload an .xlsx, .xls, or .csv file')
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/products/import', { method: 'POST', body: formData })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, imported: 0, skipped: 0, errors: ['Upload failed. Please try again.'], products: [] })
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csv = 'CATEGORY,ITEM_NAME,VARIANT_NAME,PRICE,COST_PRICE,STOCK,NEW_QTY,DISCOUNT\nKITCHEN,Example Product,Small,1200,600,10,,\nKITCHEN,Example Product,Large,1800,900,5,,'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fto-import-template.csv'
    a.click()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark transition-colors">
          <ArrowLeft size={15} /> Back to Products
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">Bulk Import Products</h1>
          <p className="text-dark/50 text-sm mt-1">
            Upload a Zobaze-format Excel or CSV file to import products in bulk.
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark border border-dark/15 rounded-lg px-3 py-2 transition-colors"
        >
          <Download size={14} /> Download Template
        </button>
      </div>

      {/* Format guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-blue-800 mb-2">Expected columns (Zobaze format)</p>
        <div className="flex flex-wrap gap-2">
          {['CATEGORY', 'ITEM_NAME', 'VARIANT_NAME', 'PRICE', 'COST_PRICE', 'STOCK', 'NEW_QTY', 'DISCOUNT'].map(col => (
            <code key={col} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">{col}</code>
          ))}
        </div>
        <p className="text-xs text-blue-600 mt-2">Products with the same ITEM_NAME are grouped as variants. First row is skipped if it contains column headers.</p>
      </div>

      {/* Drop zone */}
      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragging ? 'border-primary bg-primary/5' : file ? 'border-success/40 bg-success/5' : 'border-dark/15 hover:border-primary/40 hover:bg-primary/3'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileSpreadsheet size={40} className="text-success" />
              <div>
                <p className="font-semibold text-dark">{file.name}</p>
                <p className="text-sm text-dark/40">{(file.size / 1024).toFixed(1)} KB — click to change</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="text-xs text-dark/40 hover:text-danger flex items-center gap-1"
              >
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload size={40} className="text-dark/25" />
              <div>
                <p className="font-semibold text-dark">Drop your file here or click to browse</p>
                <p className="text-sm text-dark/40 mt-1">Supports .xlsx, .xls, .csv</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Import button */}
      {file && !result && (
        <button
          onClick={handleImport}
          disabled={loading}
          className="mt-4 w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Importing…
            </>
          ) : (
            <>
              <FileSpreadsheet size={16} />
              Import Products
            </>
          )}
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className={`rounded-xl p-5 flex items-start gap-4 ${result.success ? 'bg-success/8 border border-success/20' : 'bg-danger/8 border border-danger/20'}`}>
            {result.success
              ? <CheckCircle2 size={22} className="text-success flex-shrink-0 mt-0.5" />
              : <AlertCircle size={22} className="text-danger flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className="font-semibold text-dark">
                {result.success ? `${result.imported} products imported successfully` : 'Import failed'}
              </p>
              <p className="text-sm text-dark/60 mt-0.5">
                {result.imported} imported · {result.skipped} skipped
              </p>
              {result.errors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-danger/80">• {e}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Product list preview */}
          {result.products.length > 0 && (
            <div className="border border-dark/10 rounded-xl overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b border-[#ECEEF2]">
                <p className="text-sm font-semibold text-dark">Imported Products ({result.products.length})</p>
              </div>
              <div className="divide-y divide-[#ECEEF2] max-h-80 overflow-y-auto">
                {result.products.map((p, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">{p.name}</p>
                      <p className="text-xs text-dark/40 capitalize">{p.category.replace(/-/g, ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-dark">KSh {p.price.toLocaleString()}</p>
                      <p className="text-xs text-dark/40">{p.stock} in stock · {p.variants} variant{p.variants !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setFile(null) }}
              className="flex-1 border border-dark/15 text-dark hover:bg-muted py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Import Another File
            </button>
            <Link
              href="/admin/products"
              className="flex-1 bg-primary text-white hover:bg-primary/90 py-2.5 rounded-xl text-sm font-semibold text-center transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
