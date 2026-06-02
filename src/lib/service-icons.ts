import {
  Trash2,
  Home,
  Truck,
  Archive,
  Package,
  FileText,
  Video,
  MessageSquare,
  Sparkles,
  Layout,
  Briefcase,
  LayoutGrid,
  ShoppingBag,
  Calendar,
  GraduationCap,
  Users,
  type LucideIcon,
} from 'lucide-react'

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Trash2,
  Home,
  Truck,
  Archive,
  Package,
  FileText,
  Video,
  MessageSquare,
  Sparkles,
  Layout,
  Briefcase,
  LayoutGrid,
  ShoppingBag,
  Calendar,
  GraduationCap,
  Users,
}

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICON_MAP[name] ?? Briefcase
}
