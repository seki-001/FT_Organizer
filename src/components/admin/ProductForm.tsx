'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  UploadCloud, X, Plus, Trash2, Loader2, GripVertical, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHOP_CATEGORIES } from '@/lib/constants'
import { imagesForProduct } from '@/lib/product-images'
import { CATEGORY_PICKER, PRODUCT_SHOT_PICKER } from '@/lib/site-image-picker'
import SiteImagePicker from '@/components/admin/SiteImagePicker'
import type { ProductCategory } from '@/lib/types'

const CATEGORIES = SHOP_CATEGORIES.map((c) => ({
  value: c.slug as ProductCategory,
  label: c.label,
}))

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(3, 'At least 3 characters'),
  slug: z.string()
    .min(3, 'At least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  category:    z.string().min(1, 'Select a category'),
  description: z.string().min(20, 'At least 20 characters'),
  price:       z.coerce.number().positive('Must be a positive number'),
  salePrice:   z.preprocess(
    (v) => (v === '' || v === null || v === undefined) ? undefined : Number(v),
    z.number().positive('Must be a positive number').optional(),
  ),
  stockCount:  z.coerce.number().int().min(0, 'Cannot be negative'),
  featured:    z.boolean(),
  hasVariants: z.boolean(),
  variants: z.array(z.object({
    id:            z.string(),
    name:          z.string().min(1, 'Required'),
    value:         z.string().min(1, 'Required'),
    priceModifier: z.preprocess(
      (v) => (v === '' || v === null || v === undefined) ? undefined : Number(v),
      z.number().optional(),
    ),
    inStock: z.boolean(),
  })).default([]),
  specs: z.array(z.object({
    key:   z.string().min(1, 'Required'),
    value: z.string().min(1, 'Required'),
  })).default([]),
})

type FormValues = z.infer<typeof schema>

// ─── Initial data shape (for edit mode) ──────────────────────────────────────

export interface ProductFormInitialData {
  name:        string
  slug:        string
  category:    ProductCategory
  description: string
  price:       number
  salePrice?:  number
  stockCount:  number
  featured:    boolean
  images:      string[]
  variants?:   { id: string; name: string; value: string; priceModifier?: number; inStock: boolean }[]
  specs?:      Record<string, string>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#ECEEF2]">
        <h2 className="text-sm font-semibold text-dark">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-dark mb-1.5">
      {children}
      {optional && <span className="ml-1.5 text-xs font-normal text-dark/40">Optional</span>}
    </label>
  )
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-xs text-danger mt-1.5">
      <AlertCircle size={11} aria-hidden="true" />
      {message}
    </p>
  )
}

const inputBase = 'w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white placeholder:text-dark/30 transition-shadow'
const inputNormal = cn(inputBase, 'border-dark/15 focus:ring-primary/30')
const inputError  = cn(inputBase, 'border-danger/40 focus:ring-danger/20')

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-dark/20',
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200',
        checked ? 'right-0.5' : 'left-0.5',
      )} />
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  mode:         'new' | 'edit'
  initialData?: ProductFormInitialData
  /** Slug of the product being edited (for API route) */
  editSlug?:    string
}

export default function ProductForm({ mode, initialData, editSlug }: Props) {
  const router = useRouter()
  const saveModeRef = useRef<'draft' | 'publish'>('publish')

  // Images (managed outside react-hook-form due to drag-and-drop complexity)
  const [images,      setImages]      = useState<string[]>(initialData?.images ?? [])
  const [imageUrl,    setImageUrl]    = useState('')
  const [isDragOver,  setIsDragOver]  = useState(false)
  const [dragIndex,   setDragIndex]   = useState<number | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [slugEdited,  setSlugEdited]  = useState(mode === 'edit')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Form ──────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        initialData?.name        ?? '',
      slug:        initialData?.slug        ?? '',
      category:    initialData?.category    ?? 'kitchen',
      description: initialData?.description ?? '',
      price:       initialData?.price       ?? ('' as unknown as number),
      salePrice:   initialData?.salePrice   ?? ('' as unknown as undefined),
      stockCount:  initialData?.stockCount  ?? 0,
      featured:    initialData?.featured    ?? false,
      hasVariants: (initialData?.variants?.length ?? 0) > 0,
      variants:    initialData?.variants    ?? [],
      specs:       Object.entries(initialData?.specs ?? {}).map(([key, value]) => ({ key, value })),
    },
  })

  const hasVariants = watch('hasVariants')
  const watchName   = watch('name')
  const watchCategory = watch('category')
  const watchSlug   = watch('slug')

  // Auto-generate slug from name (only if not manually edited)
  useEffect(() => {
    if (!slugEdited && watchName) {
      setValue('slug', slugify(watchName), { shouldDirty: true })
    }
  }, [watchName, slugEdited, setValue])

  function applyCategoryDefaults() {
    const slug = watchSlug || slugify(watchName) || 'new-product'
    setImages(imagesForProduct(slug, watchCategory))
  }

  // Unsaved-changes browser warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty || images.length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, images])

  // ── Variants + Specs field arrays ─────────────────────────────────────────

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: 'variants' })

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: 'specs' })

  // ── Image helpers ─────────────────────────────────────────────────────────

  function addImageByUrl() {
    const url = imageUrl.trim()
    if (!url) return
    setImages(prev => [...prev, url])
    setImageUrl('')
  }

  function reorderImage(from: number, to: number) {
    if (from === to) return
    setImages(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = handleSubmit(async (data) => {
    setSaveError('')
    setSaving(true)
    try {
      const payload = {
        ...data,
        images,
        inStock:       data.stockCount > 0,
        specs:         Object.fromEntries(data.specs.map(s => [s.key, s.value])),
        publishStatus: saveModeRef.current,
      }

      const url    = mode === 'new' ? '/api/admin/products' : `/api/admin/products/${editSlug}`
      const method = mode === 'new' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Save failed')
      router.push('/admin/products')
    } catch {
      setSaveError('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">

        {/* ─────────────────────────────────────────────────────────── */}
        {/* Left main column                                            */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Basic Info */}
          <FormCard title="Product Information">
            <div className="flex flex-col gap-4">

              {/* Name */}
              <div>
                <Label htmlFor="name">Product Name</Label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Rotating Cup & Mug Organizer"
                  className={errors.name ? inputError : inputNormal}
                />
                <ErrorMsg message={errors.name?.message} />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-dark/35 font-mono pointer-events-none">
                      /shop/
                    </span>
                    <input
                      id="slug"
                      type="text"
                      {...register('slug')}
                      placeholder="rotating-cup-organizer"
                      className={cn(
                        errors.slug ? inputError : inputNormal,
                        'pl-14 font-mono text-xs',
                      )}
                      onChange={(e) => {
                        setSlugEdited(true)
                        register('slug').onChange(e)
                      }}
                    />
                  </div>
                  {slugEdited && (
                    <button
                      type="button"
                      onClick={() => { setSlugEdited(false); setValue('slug', slugify(watchName)) }}
                      className="text-xs text-primary hover:underline whitespace-nowrap px-2"
                    >
                      Re-generate
                    </button>
                  )}
                </div>
                <ErrorMsg message={errors.slug?.message} />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  placeholder="Describe the product — what it does, who it's for, and why customers will love it."
                  className={cn(errors.description ? inputError : inputNormal, 'resize-y min-h-[96px]')}
                />
                <ErrorMsg message={errors.description?.message} />
              </div>
            </div>
          </FormCard>

          {/* Images */}
          <FormCard title="Product Images">
            <div className="flex flex-col gap-4">

              {/* Drop zone */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150',
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-dark/15 hover:border-primary/40 bg-muted/20',
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragOver(false)
                  // Accept dragged URL (e.g. dragged from browser)
                  const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
                  if (url?.startsWith('http')) {
                    setImages(prev => [...prev, url])
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                aria-label="Upload product images"
              >
                <UploadCloud size={28} className="mx-auto mb-2 text-dark/30" aria-hidden="true" />
                <p className="text-sm font-medium text-dark/60">Drop images here or click to upload</p>
                <p className="text-xs text-dark/35 mt-1">PNG, JPG, WebP — up to 5 MB each</p>
                {/* TODO: Connect to Cloudinary or Vercel Blob for actual file uploads */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    // Dev fallback: use local placeholder images since no real upload is wired
                    Array.from(e.target.files ?? []).forEach(() => {
                      const slug = watchSlug || slugify(watchName) || 'new-product'
                      const defaults = imagesForProduct(slug, watchCategory)
                      setImages((prev) => [...prev, defaults[0] ?? '/images/site/img-02.png'])
                    })
                    e.target.value = ''
                  }}
                />
              </div>

              {/* URL input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageByUrl() } }}
                  placeholder="Or paste an image URL and press Enter…"
                  className={cn(inputNormal, 'flex-1')}
                />
                <button
                  type="button"
                  onClick={addImageByUrl}
                  disabled={!imageUrl.trim()}
                  className="px-4 py-2 bg-dark/8 hover:bg-dark/15 text-dark text-sm font-medium rounded-lg transition-colors disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              <SiteImagePicker
                label="Category image"
                images={CATEGORY_PICKER}
                selected={images}
                onSelect={(src) => setImages((prev) => (prev.includes(src) ? prev : [...prev, src]))}
              />

              <SiteImagePicker
                label="Product photos"
                images={PRODUCT_SHOT_PICKER}
                selected={images}
                onSelect={(src) => setImages((prev) => (prev.includes(src) ? prev : [...prev, src]))}
              />

              <button
                type="button"
                onClick={applyCategoryDefaults}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors w-fit"
              >
                Auto-fill images for this category
              </button>

              {/* Image grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {images.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (dragIndex !== null) reorderImage(dragIndex, i)
                        setDragIndex(null)
                      }}
                      onDragEnd={() => setDragIndex(null)}
                      className={cn(
                        'relative group aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-all cursor-grab active:cursor-grabbing',
                        dragIndex === i ? 'opacity-50 border-primary scale-95' : 'border-transparent',
                      )}
                    >
                      <Image
                        src={url}
                        alt={`Product image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      {/* Drag handle overlay */}
                      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
                        <GripVertical size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </div>
                      {/* Main badge */}
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                          MAIN
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setImages(prev => prev.filter((_, idx) => idx !== i))
                        }}
                        aria-label={`Remove image ${i + 1}`}
                        className="absolute top-1 right-1 w-5 h-5 bg-dark/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger"
                      >
                        <X size={10} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <p className="text-xs text-dark/40 text-center py-2">
                  No images added yet. The first image will be used as the main product image.
                </p>
              )}
            </div>
          </FormCard>

          {/* Specifications */}
          <FormCard title="Specifications">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-dark/50">
                Add key-value spec pairs (e.g. Material → Bamboo, Dimensions → 30×20×10 cm).
              </p>

              {specFields.length > 0 && (
                <div className="flex flex-col gap-2">
                  {specFields.map((field, i) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                      <div>
                        <input
                          {...register(`specs.${i}.key`)}
                          placeholder="e.g. Material"
                          className={errors.specs?.[i]?.key ? inputError : inputNormal}
                        />
                        <ErrorMsg message={errors.specs?.[i]?.key?.message} />
                      </div>
                      <div>
                        <input
                          {...register(`specs.${i}.value`)}
                          placeholder="e.g. Bamboo"
                          className={errors.specs?.[i]?.value ? inputError : inputNormal}
                        />
                        <ErrorMsg message={errors.specs?.[i]?.value?.message} />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        aria-label="Remove specification"
                        className="mt-0.5 w-9 h-[42px] flex items-center justify-center text-dark/30 hover:text-danger hover:bg-danger/8 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => appendSpec({ key: '', value: '' })}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors self-start"
              >
                <Plus size={15} aria-hidden="true" />
                Add Specification
              </button>
            </div>
          </FormCard>

        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* Right sidebar                                               */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Pricing & Stock */}
          <FormCard title="Pricing & Stock">
            <div className="flex flex-col gap-4">

              {/* Price */}
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/40 font-medium pointer-events-none">
                    KSh
                  </span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="any"
                    {...register('price')}
                    placeholder="0"
                    className={cn(errors.price ? inputError : inputNormal, 'pl-11')}
                  />
                </div>
                <ErrorMsg message={errors.price?.message} />
              </div>

              {/* Sale Price */}
              <div>
                <Label htmlFor="salePrice" optional>Sale Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/40 font-medium pointer-events-none">
                    KSh
                  </span>
                  <input
                    id="salePrice"
                    type="number"
                    min="0"
                    step="any"
                    {...register('salePrice')}
                    placeholder="Leave empty for no sale"
                    className={cn(errors.salePrice ? inputError : inputNormal, 'pl-11')}
                  />
                </div>
                <ErrorMsg message={errors.salePrice?.message} />
                <p className="text-xs text-dark/35 mt-1">Leave empty if the product is not on sale.</p>
              </div>

              {/* Stock Count */}
              <div>
                <Label htmlFor="stockCount">Stock Count</Label>
                <input
                  id="stockCount"
                  type="number"
                  min="0"
                  {...register('stockCount')}
                  placeholder="0"
                  className={errors.stockCount ? inputError : inputNormal}
                />
                <ErrorMsg message={errors.stockCount?.message} />
                <p className="text-xs text-dark/35 mt-1">Set to 0 to mark as out of stock.</p>
              </div>
            </div>
          </FormCard>

          {/* Organisation */}
          <FormCard title="Organisation">
            <div className="flex flex-col gap-4">

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register('category')}
                  className={cn(errors.category ? inputError : inputNormal, 'appearance-none cursor-pointer')}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <ErrorMsg message={errors.category?.message} />
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark">Featured Product</p>
                  <p className="text-xs text-dark/45 mt-0.5">Show on the homepage featured strip</p>
                </div>
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={field.onChange}
                      label="Toggle featured status"
                    />
                  )}
                />
              </div>
            </div>
          </FormCard>

          {/* Variants */}
          <FormCard title="Product Variants">
            <div className="flex flex-col gap-4">

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark">Has Variants</p>
                  <p className="text-xs text-dark/45 mt-0.5">e.g. different colours or sizes</p>
                </div>
                <Controller
                  control={control}
                  name="hasVariants"
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={(v) => {
                        field.onChange(v)
                        if (!v) {
                          // Clear variants when toggled off
                          while (variantFields.length > 0) removeVariant(0)
                        }
                      }}
                      label="Toggle product variants"
                    />
                  )}
                />
              </div>

              {hasVariants && (
                <div className="flex flex-col gap-3 border-t border-[#ECEEF2] pt-4">
                  {/* Header row */}
                  {variantFields.length > 0 && (
                    <div className="grid grid-cols-[1fr_1fr_80px_24px] gap-1.5 text-[10px] font-semibold text-dark/40 uppercase tracking-wide px-0.5">
                      <span>Name</span>
                      <span>Value</span>
                      <span>+/- KSh</span>
                      <span />
                    </div>
                  )}

                  {variantFields.map((field, i) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_80px_32px] gap-1.5 items-start">
                      <input
                        {...register(`variants.${i}.name`)}
                        placeholder="e.g. Color"
                        className={cn(inputNormal, 'py-2 text-xs')}
                      />
                      <input
                        {...register(`variants.${i}.value`)}
                        placeholder="e.g. Red"
                        className={cn(inputNormal, 'py-2 text-xs')}
                      />
                      <input
                        type="number"
                        {...register(`variants.${i}.priceModifier`)}
                        placeholder="0"
                        className={cn(inputNormal, 'py-2 text-xs')}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        aria-label={`Remove variant ${i + 1}`}
                        className="h-9 flex items-center justify-center text-dark/30 hover:text-danger transition-colors"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => appendVariant({ id: `var-${Date.now()}`, name: '', value: '', priceModifier: undefined, inStock: true })}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <Plus size={13} aria-hidden="true" />
                    Add Variant
                  </button>
                </div>
              )}
            </div>
          </FormCard>

        </div>
      </div>

      {/* ─── Sticky action bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[260px] z-20 bg-white border-t border-dark/10 shadow-lg">
        <div className="flex items-center justify-between gap-4 px-6 py-3.5 max-w-5xl">

          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/products"
              className="text-sm text-dark/50 hover:text-dark transition-colors"
            >
              ← Cancel
            </Link>
            {(isDirty || images.length > 0) && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" aria-hidden="true" />
                Unsaved changes
              </span>
            )}
            {saveError && (
              <span className="flex items-center gap-1.5 text-xs text-danger font-medium">
                <AlertCircle size={12} aria-hidden="true" />
                {saveError}
              </span>
            )}
          </div>

          <div className="flex gap-2.5 flex-shrink-0">
            <button
              type="button"
              disabled={saving}
              onClick={() => { saveModeRef.current = 'draft'; void onSubmit() }}
              className="px-4 py-2.5 text-sm font-medium border-2 border-dark/20 text-dark/70 rounded-lg hover:border-dark/40 hover:text-dark transition-colors disabled:opacity-40"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => { saveModeRef.current = 'publish'; void onSubmit() }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {saving
                ? 'Saving…'
                : mode === 'new' ? 'Publish Product' : 'Update Product'
              }
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
