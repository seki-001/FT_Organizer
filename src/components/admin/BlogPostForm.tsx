'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  UploadCloud, X, Plus, ChevronDown, ChevronUp, Loader2, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BLOG_CATEGORIES } from '@/lib/mock-admin-blog'
import { BLOG_COVER_PICKER, blogCoverForCategory } from '@/lib/site-image-picker'
import SiteImagePicker from '@/components/admin/SiteImagePicker'
import type { BlogCategory } from '@/lib/types'

// Lazy-load the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title:           z.string().min(5, 'At least 5 characters'),
  slug:            z.string().regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only').min(3),
  category:        z.string().min(1),
  excerpt:         z.string().min(10, 'At least 10 characters').max(160, 'Max 160 characters'),
  author:          z.string().min(2, 'Required'),
  metaTitle:       z.string().max(70, 'Max 70 characters').optional(),
  metaDescription: z.string().max(160, 'Max 160 characters').optional(),
})
type FormValues = z.infer<typeof schema>

// ─── Initial data shape ────────────────────────────────────────────────────────

export interface BlogFormInitialData {
  title:            string
  slug:             string
  category:         BlogCategory
  excerpt:          string
  author:           string
  coverImage?:      string
  content?:         string
  tags?:            string[]
  metaTitle?:       string
  metaDescription?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

function wordsToReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function FormCard({ title, children, collapsible = false }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen(o => !o)}
        className={cn('w-full flex items-center justify-between px-5 py-3.5 border-b border-[#ECEEF2]', collapsible && 'hover:bg-muted/30 transition-colors')}
      >
        <h2 className="text-sm font-semibold text-dark text-left">{title}</h2>
        {collapsible && (open ? <ChevronUp size={14} className="text-dark/40" /> : <ChevronDown size={14} className="text-dark/40" />)}
      </button>
      {open && <div className="p-5">{children}</div>}
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
  return <p className="flex items-center gap-1 text-xs text-danger mt-1.5"><AlertCircle size={11} />{message}</p>
}

const inputBase = 'w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white placeholder:text-dark/30 transition-shadow'
const inputOk  = cn(inputBase, 'border-dark/15 focus:ring-primary/30')
const inputErr = cn(inputBase, 'border-danger/40 focus:ring-danger/20')

// ─── Tag chip input ───────────────────────────────────────────────────────────

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  function add() {
    const tag = input.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setInput('')
  }
  return (
    <div className="flex flex-wrap gap-1.5 p-2.5 border border-dark/15 rounded-lg min-h-[44px] focus-within:ring-2 focus-within:ring-primary/30 bg-white">
      {value.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 bg-primary/8 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-danger transition-colors"><X size={10} /></button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
        onBlur={add}
        placeholder={value.length === 0 ? 'Type a tag and press Enter…' : ''}
        className="flex-1 min-w-[120px] text-sm bg-transparent outline-none placeholder:text-dark/30"
      />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  mode:         'new' | 'edit'
  initialData?: BlogFormInitialData
  editSlug?:    string
}

export default function BlogPostForm({ mode, initialData, editSlug }: Props) {
  const router      = useRouter()
  const saveModeRef = useRef<'draft' | 'publish'>('publish')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [coverImage,  setCoverImage]  = useState(initialData?.coverImage ?? '')
  const [imageUrl,    setImageUrl]    = useState('')
  const [isDragOver,  setIsDragOver]  = useState(false)
  const [content,     setContent]     = useState(initialData?.content ?? '')
  const [tags,        setTags]        = useState<string[]>(initialData?.tags ?? [])
  const [slugEdited,  setSlugEdited]  = useState(mode === 'edit')
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')

  const readTime = wordsToReadTime(content)

  const {
    register, handleSubmit, control, watch, setValue, formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:           initialData?.title           ?? '',
      slug:            initialData?.slug            ?? '',
      category:        initialData?.category        ?? 'home-tips',
      excerpt:         initialData?.excerpt         ?? '',
      author:          initialData?.author          ?? 'Faith The Organizer',
      metaTitle:       initialData?.metaTitle       ?? '',
      metaDescription: initialData?.metaDescription ?? '',
    },
  })

  const watchTitle   = watch('title')
  const watchExcerpt = watch('excerpt')
  const watchCategory = watch('category')
  const metaTitle    = watch('metaTitle')
  const metaDesc     = watch('metaDescription')

  // Auto-slug from title
  useEffect(() => {
    if (!slugEdited && watchTitle) setValue('slug', slugify(watchTitle), { shouldDirty: true })
  }, [watchTitle, slugEdited, setValue])

  // Auto-fill meta fields when empty
  useEffect(() => {
    if (!metaTitle   && watchTitle)   setValue('metaTitle',       watchTitle.slice(0, 70))
  }, [watchTitle, metaTitle, setValue])
  useEffect(() => {
    if (!metaDesc && watchExcerpt) setValue('metaDescription', watchExcerpt.slice(0, 160))
  }, [watchExcerpt, metaDesc, setValue])

  useEffect(() => {
    if (mode === 'new' && !coverImage && watchCategory) {
      setCoverImage(blogCoverForCategory(watchCategory))
    }
  }, [mode, watchCategory, coverImage])

  // Unsaved-changes browser warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty || content) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, content])

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = handleSubmit(async (data) => {
    setSaveError('')
    setSaving(true)
    try {
      const payload = {
        ...data,
        content, tags, coverImage, readTime,
        publishStatus: saveModeRef.current,
        publishedAt:   saveModeRef.current === 'publish' ? new Date().toISOString().split('T')[0] : '',
      }
      const url    = mode === 'new' ? '/api/admin/blog' : `/api/admin/blog/${editSlug}`
      const method = mode === 'new' ? 'POST' : 'PATCH'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      router.push('/admin/blog')
    } catch {
      setSaveError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  })

  const excerptLen = watchExcerpt?.length ?? 0

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">

        {/* ── Left main column ────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Basic Info */}
          <FormCard title="Post Details">
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <input id="title" type="text" {...register('title')}
                  placeholder="e.g. 10 Ways to Organize Your Nairobi Kitchen"
                  className={cn(errors.title ? inputErr : inputOk, 'text-base font-display')}
                />
                <ErrorMsg message={errors.title?.message} />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-dark/35 font-mono pointer-events-none">/blog/</span>
                    <input id="slug" type="text" {...register('slug')}
                      className={cn(errors.slug ? inputErr : inputOk, 'pl-12 font-mono text-xs')}
                      onChange={e => { setSlugEdited(true); register('slug').onChange(e) }}
                    />
                  </div>
                  {slugEdited && (
                    <button type="button" onClick={() => { setSlugEdited(false); setValue('slug', slugify(watchTitle)) }}
                      className="text-xs text-primary hover:underline px-2">Re-generate</button>
                  )}
                </div>
                <ErrorMsg message={errors.slug?.message} />
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <span className={cn('text-xs', excerptLen > 160 ? 'text-danger' : excerptLen > 130 ? 'text-amber-600' : 'text-dark/35')}>
                    {excerptLen} / 160
                  </span>
                </div>
                <textarea id="excerpt" rows={3} {...register('excerpt')}
                  placeholder="A short summary shown in post cards and search results."
                  className={cn(errors.excerpt ? inputErr : inputOk, 'resize-none')}
                  maxLength={160}
                />
                <ErrorMsg message={errors.excerpt?.message} />
              </div>

              {/* Author */}
              <div>
                <Label htmlFor="author">Author</Label>
                <input id="author" type="text" {...register('author')} className={errors.author ? inputErr : inputOk} />
                <ErrorMsg message={errors.author?.message} />
              </div>
            </div>
          </FormCard>

          {/* Cover Image */}
          <FormCard title="Cover Image">
            <div className="flex flex-col gap-4">
              {/* Drop zone */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                  isDragOver ? 'border-primary bg-primary/5' : 'border-dark/15 hover:border-primary/40 bg-muted/20',
                )}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setIsDragOver(false)
                  const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
                  if (url?.startsWith('http')) setCoverImage(url)
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button" aria-label="Upload cover image"
              >
                <UploadCloud size={28} className="mx-auto mb-2 text-dark/30" />
                <p className="text-sm font-medium text-dark/60">Drop image here or click to upload</p>
                <p className="text-xs text-dark/35 mt-1">Recommended: 1200 × 630 px, PNG or JPG</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    // Dev fallback: no real upload wired yet.
                    // Use a real local placeholder so we never depend on external placeholder services.
                    if (file) setCoverImage(blogCoverForCategory(watchCategory))
                    e.target.value = ''
                  }}
                />
              </div>

              {/* URL input */}
              <div className="flex gap-2">
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (imageUrl.trim()) { setCoverImage(imageUrl.trim()); setImageUrl('') } } }}
                  placeholder="Or paste an image URL…"
                  className={cn(inputOk, 'flex-1')}
                />
                <button type="button" onClick={() => { if (imageUrl.trim()) { setCoverImage(imageUrl.trim()); setImageUrl('') } }}
                  className="px-4 py-2 bg-dark/8 hover:bg-dark/15 text-dark text-sm font-medium rounded-lg transition-colors">Set</button>
              </div>

              <SiteImagePicker
                label="Site cover images"
                images={BLOG_COVER_PICKER}
                selected={coverImage ? [coverImage] : []}
                onSelect={setCoverImage}
              />

              {/* Preview */}
              {coverImage && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted group">
                  <Image src={coverImage} alt="Cover preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" />
                  <button type="button" onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 w-7 h-7 bg-dark/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </FormCard>

          {/* Content Editor */}
          <FormCard title={`Content  •  ${readTime} min read`}>
            <div data-color-mode="light" className="flex flex-col gap-2">
              <MDEditor
                value={content}
                onChange={v => setContent(v ?? '')}
                height={500}
                preview="edit"
                className="!border-dark/15 !rounded-lg !text-sm"
              />
              <p className="text-xs text-dark/35 text-right">
                {content.trim().split(/\s+/).filter(Boolean).length} words · {readTime} min read
              </p>
            </div>
          </FormCard>

          {/* SEO — collapsible */}
          <FormCard title="SEO Settings" collapsible>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="metaTitle" optional>Meta Title</Label>
                  <span className={cn('text-xs', (metaTitle?.length ?? 0) > 70 ? 'text-danger' : 'text-dark/35')}>
                    {metaTitle?.length ?? 0} / 70
                  </span>
                </div>
                <input id="metaTitle" type="text" {...register('metaTitle')} maxLength={70}
                  className={errors.metaTitle ? inputErr : inputOk}
                  placeholder="Defaults to post title" />
                <ErrorMsg message={errors.metaTitle?.message} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="metaDescription" optional>Meta Description</Label>
                  <span className={cn('text-xs', (metaDesc?.length ?? 0) > 160 ? 'text-danger' : 'text-dark/35')}>
                    {metaDesc?.length ?? 0} / 160
                  </span>
                </div>
                <textarea id="metaDescription" rows={3} {...register('metaDescription')} maxLength={160}
                  className={cn(errors.metaDescription ? inputErr : inputOk, 'resize-none')}
                  placeholder="Defaults to excerpt" />
                <ErrorMsg message={errors.metaDescription?.message} />
              </div>
            </div>
          </FormCard>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Category */}
          <div className="admin-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#ECEEF2]"><h2 className="text-sm font-semibold text-dark">Category</h2></div>
            <div className="p-5">
              <select {...register('category')} className={cn(inputOk, 'appearance-none cursor-pointer')}>
                {BLOG_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ErrorMsg message={errors.category?.message} />
            </div>
          </div>

          {/* Tags */}
          <div className="admin-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#ECEEF2]"><h2 className="text-sm font-semibold text-dark">Tags</h2></div>
            <div className="p-5 flex flex-col gap-2">
              <TagInput value={tags} onChange={setTags} />
              <p className="text-xs text-dark/35">Press Enter or comma to add a tag.</p>
            </div>
          </div>

          {/* Read Time */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-dark">Estimated Read Time</p>
              <p className="text-lg font-bold font-display text-primary">{readTime} min</p>
            </div>
            <p className="text-xs text-dark/40 mt-1">Auto-calculated from word count (200 words/min)</p>
          </div>

        </div>
      </div>

      {/* ── Sticky action bar ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[260px] z-20 bg-white border-t border-dark/10 shadow-lg">
        <div className="flex items-center justify-between gap-4 px-6 py-3.5 max-w-5xl">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/blog" className="text-sm text-dark/50 hover:text-dark transition-colors">← Cancel</Link>
            {(isDirty || content) && (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                Unsaved changes
              </span>
            )}
            {saveError && <span className="text-xs text-danger font-medium flex items-center gap-1"><AlertCircle size={12} />{saveError}</span>}
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <button type="button" disabled={saving}
              onClick={() => { saveModeRef.current = 'draft'; void onSubmit() }}
              className="px-4 py-2.5 text-sm font-medium border-2 border-dark/20 text-dark/70 rounded-lg hover:border-dark/40 transition-colors disabled:opacity-40">
              Save Draft
            </button>
            {/* Preview link (only if slug exists) */}
            <a href={`/blog/${watch('slug') || 'preview'}`} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2.5 text-sm font-medium border-2 border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors">
              Preview
            </a>
            <button type="button" disabled={saving}
              onClick={() => { saveModeRef.current = 'publish'; void onSubmit() }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : mode === 'new' ? 'Publish Post' : 'Update Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
