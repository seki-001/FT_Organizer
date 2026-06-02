export default function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-dark/25" role="separator">
      <div className="flex-1 h-px bg-dark/10" />
      <span className="text-xs uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-dark/10" />
    </div>
  )
}
