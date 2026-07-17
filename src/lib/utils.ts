import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "RWF"): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-RW", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

type TimeLabels = { justNow: string; m: string; h: string; d: string }

const timeLabels: Record<string, TimeLabels> = {
  en: { justNow: "just now", m: "m ago", h: "h ago", d: "d ago" },
  rw: { justNow: "ubu", m: "m ishize", h: "h ishize", d: "d ishize" },
  fr: { justNow: "à l'instant", m: "m", h: "h", d: "j" },
}

export function formatRelativeTime(date: Date | string, locale = "en"): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const labels = timeLabels[locale] || timeLabels.en

  if (seconds < 60) return labels.justNow
  if (minutes < 60) return `${minutes}${labels.m}`
  if (hours < 24) return `${hours}${labels.h}`
  if (days < 7) return `${days}${labels.d}`
  return formatDate(date)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export type AsyncFn<T = unknown> = (...args: unknown[]) => Promise<T>
