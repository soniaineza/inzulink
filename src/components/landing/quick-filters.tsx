"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Bed, Bath, Car, Wallet, Users, Wifi, ShieldCheck, CalendarCheck } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const filterKeys = [
  { id: "bedrooms", key: "qf.bedrooms", icon: Bed },
  { id: "bathrooms", key: "qf.bathrooms", icon: Bath },
  { id: "parking", key: "qf.parking", icon: Car },
  { id: "budget", key: "qf.budget", icon: Wallet },
  { id: "family", key: "qf.family", icon: Users },
  { id: "wifi", key: "qf.wifi", icon: Wifi },
  { id: "verified", key: "qf.verified", icon: ShieldCheck },
  { id: "available", key: "qf.availableNow", icon: CalendarCheck },
]

export function QuickFilters() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const { t } = useLocale()

  return (
    <section className="py-5 -mt-7 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-card rounded-xl shadow-lg border p-1.5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {filterKeys.map((filter) => {
              const Icon = filter.icon
              const isActive = activeFilter === filter.id
              return (
                <Link
                  key={filter.id}
                  href={`/search?amenity=${filter.id}`}
                  onClick={() => setActiveFilter(isActive ? null : filter.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive && "text-primary-foreground")} />
                  {t(filter.key)}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
