"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          padding: "12px 16px",
          border: "1px solid hsl(var(--border))",
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          fontSize: "14px",
        },
      }}
      richColors
      closeButton
    />
  )
}

export { toast } from "sonner"
