"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { type Locale, defaultLocale, t as translate, localeNames, locales } from "@/i18n"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  localeNames: Record<Locale, string>
  locales: Locale[]
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale
  try {
    const stored = localStorage.getItem("inzulink-locale") as Locale | null
    if (stored && locales.includes(stored)) return stored
  } catch {}
  return defaultLocale
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getInitialLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem("inzulink-locale", newLocale)
      document.documentElement.lang = newLocale
    } catch {}
  }, [])

  const translateFn = useCallback((key: string) => translate(key, locale), [locale])

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: defaultLocale, setLocale, t: (k) => k, localeNames, locales }}>
        {children}
      </LocaleContext.Provider>
    )
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translateFn, localeNames, locales }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
