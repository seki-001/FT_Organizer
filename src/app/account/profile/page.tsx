'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { clientAvatarForUser } from '@/lib/avatars'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  phone:   z.string().regex(/^(\+?254|0)[17]\d{8}$/, 'Enter a valid Kenyan number').or(z.literal('')).optional(),
  address: z.string().optional(),
  city:    z.string().optional(),
})
type ProfileForm = z.infer<typeof ProfileSchema>

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})
type PasswordForm = z.infer<typeof PasswordSchema>

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label, error, children, hint,
}: {
  label: string
  error?: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-dark">{label}</label>
      {children}
      {hint  && !error && <p className="text-xs text-dark/40">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

const inputClass = 'w-full border border-dark/15 rounded-lg px-4 py-2.5 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:bg-muted disabled:text-dark/40'

// ─── Password input ───────────────────────────────────────────────────────────

function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={inputClass + ' pr-10'} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountProfilePage() {
  const { session, update } = useAuth()

  // Profile form
  const [profileSaved,   setProfileSaved]   = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  const {
    register:    regProfile,
    handleSubmit: handleProfile,
    formState:   { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name:    session?.user.name ?? '',
      phone:   '',
      address: '',
      city:    '',
    },
  })

  async function onSaveProfile(data: ProfileForm) {
    setProfileLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    // TODO: POST /api/account/profile
    update({ name: data.name })
    setProfileLoading(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  // Password form
  const [pwSaved,   setPwSaved]   = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const {
    register:    regPw,
    handleSubmit: handlePw,
    reset:       resetPw,
    formState:   { errors: pwErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(PasswordSchema) })

  async function onUpdatePassword(data: PasswordForm) {
    void data
    setPwLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    // TODO: POST /api/account/password
    setPwLoading(false)
    setPwSaved(true)
    resetPw()
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white border border-white/80 shadow-sm">
          <Image
            src={clientAvatarForUser(session?.user.email ?? session?.user.name ?? 'guest')}
            alt=""
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">My Profile</h1>
          <p className="text-dark/50 text-sm">{session?.user.email}</p>
        </div>
      </div>

      {/* ── Profile details ─────────────────────────────────────────────── */}
      <section className="glass-card p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-dark">Personal Details</h2>

        <form onSubmit={handleProfile(onSaveProfile)} className="flex flex-col gap-4">
          <Field label="Full Name" error={profileErrors.name?.message}>
            <input
              {...regProfile('name')}
              placeholder="Your full name"
              className={inputClass}
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              value={session?.user.email ?? ''}
              readOnly
              disabled
              className={inputClass}
            />
            <p className="text-xs text-dark/40 -mt-1">Email cannot be changed here.</p>
          </Field>

          <Field
            label="Phone Number"
            error={profileErrors.phone?.message}
            hint="Kenyan format: 07XX XXX XXX"
          >
            <input
              {...regProfile('phone')}
              type="tel"
              placeholder="07XX XXX XXX"
              className={inputClass}
            />
          </Field>

          <Field label="Default Delivery Address" error={profileErrors.address?.message}>
            <input
              {...regProfile('address')}
              placeholder="e.g. Apt 4B, Parklands Avenue"
              className={inputClass}
            />
          </Field>

          <Field label="City / Area" error={profileErrors.city?.message} hint="e.g. Westlands, Karen, CBD">
            <input
              {...regProfile('city')}
              placeholder="e.g. Westlands"
              className={inputClass}
            />
          </Field>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors min-h-[44px]"
            >
              {profileLoading && <Loader2 size={15} className="animate-spin" />}
              Save Changes
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 text-success text-sm">
                <CheckCircle2 size={15} />
                Saved!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* ── Password ────────────────────────────────────────────────────── */}
      <section className="glass-card p-6 flex flex-col gap-5">
        <h2 className="font-semibold text-dark">Change Password</h2>

        <form onSubmit={handlePw(onUpdatePassword)} className="flex flex-col gap-4">
          <Field label="Current Password" error={pwErrors.currentPassword?.message}>
            <PasswordInput {...regPw('currentPassword')} placeholder="Your current password" />
          </Field>

          <Field label="New Password" error={pwErrors.newPassword?.message} hint="Minimum 8 characters">
            <PasswordInput {...regPw('newPassword')} placeholder="New password" />
          </Field>

          <Field label="Confirm New Password" error={pwErrors.confirmPassword?.message}>
            <PasswordInput {...regPw('confirmPassword')} placeholder="Repeat new password" />
          </Field>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 bg-dark text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-dark/80 disabled:opacity-60 transition-colors min-h-[44px]"
            >
              {pwLoading && <Loader2 size={15} className="animate-spin" />}
              Update Password
            </button>
            {pwSaved && (
              <span className="flex items-center gap-1.5 text-success text-sm">
                <CheckCircle2 size={15} />
                Password updated!
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
