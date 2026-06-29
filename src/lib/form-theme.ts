export function bookingFormClasses(dark: boolean) {
  return {
    title: dark ? 'text-white' : 'text-dark',
    sub: dark ? 'text-white/50' : 'text-dark/50',
    label: dark ? 'text-white/80' : 'text-dark',
    input: dark
      ? 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-primary/30 transition'
      : 'w-full bg-muted rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition',
    card: dark
      ? 'bg-white/5 border border-white/10'
      : 'bg-white border border-dark/10',
    cardMuted: dark
      ? 'bg-white/4 border border-white/8'
      : 'bg-muted border border-dark/8',
    divider: dark ? 'border-white/8' : 'border-dark/10',
    navMuted: dark ? 'text-white/60 hover:text-white' : 'text-dark/60 hover:text-dark',
    progressInactive: dark ? 'bg-white/10' : 'bg-dark/10',
    progressLabelInactive: dark ? 'text-white/30' : 'text-dark/30',
    serviceCard: (checked: boolean) =>
      checked
        ? 'border-primary bg-primary/10'
        : dark
          ? 'border-white/10 hover:border-primary/40 bg-white/5'
          : 'border-dark/10 hover:border-dark/25 bg-white',
    serviceIcon: (checked: boolean) =>
      checked
        ? 'bg-primary text-white'
        : dark
          ? 'bg-white/8 text-white/40'
          : 'bg-muted text-dark/40',
    serviceName: (checked: boolean) =>
      checked ? 'text-primary' : dark ? 'text-white font-medium' : 'text-dark',
    servicePrice: (checked: boolean) =>
      checked ? 'text-primary/70' : dark ? 'text-white/50 text-xs font-mono' : 'text-dark/40',
    radio: (selected: boolean) =>
      selected
        ? 'border-primary bg-primary/10 text-primary'
        : dark
          ? 'border-white/15 text-white hover:border-white/30'
          : 'border-dark/15 text-dark hover:border-dark/30',
    radioHint: (selected: boolean) =>
      selected
        ? dark ? 'text-white/60' : 'text-dark/60'
        : dark ? 'text-white/40' : 'text-dark/40',
    calDay: (disabled: boolean, selected: boolean, isToday: boolean) => {
      if (disabled) return dark ? 'text-white/20 cursor-not-allowed' : 'text-dark/20 cursor-not-allowed'
      if (selected) return 'bg-primary text-white shadow-sm'
      if (isToday) return 'border border-primary/40 text-primary'
      return dark ? 'text-white hover:bg-white/8 cursor-pointer' : 'text-dark hover:bg-muted cursor-pointer'
    },
    calHeader: dark ? 'text-white' : 'text-dark',
    calWeekday: dark ? 'text-white/40' : 'text-dark/40',
    reviewLabel: dark ? 'text-white/50' : 'text-dark/50',
    reviewValue: dark ? 'text-white' : 'text-dark',
    reviewRow: dark ? 'border-white/8' : 'border-dark/5',
  }
}
