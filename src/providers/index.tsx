"use client"

import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { ToastProvider } from "@/components/ui/toast"
import { LocaleProvider } from "./locale-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <LocaleProvider>
          {children}
          <ToastProvider />
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
