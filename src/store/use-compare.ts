"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CompareStore {
  compare: string[]
  toggleCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compare: [],
      toggleCompare: (id) => {
        const current = get().compare
        if (current.includes(id)) {
          set({ compare: current.filter((f) => f !== id) })
        } else {
          if (current.length >= 4) return
          set({ compare: [...current, id] })
        }
      },
      isInCompare: (id) => get().compare.includes(id),
      clearCompare: () => set({ compare: [] }),
    }),
    { name: "inzulink_compare" }
  )
)
