"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCompareStore } from "@/store/use-compare"
import { FEATURED_PROPERTIES, AMENITIES } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import { BarChart3, X, Search, Bed, Bath, Move, Check, Minus } from "lucide-react"

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useCompareStore()
  const compareProperties = FEATURED_PROPERTIES.filter((p) => compare.includes(p.id))

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-primary" />
              Compare Properties
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare up to 4 properties side by side
            </p>
          </div>
          {compareProperties.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </motion.div>

        {compareProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] gap-px bg-border rounded-2xl overflow-hidden">
                <div className="bg-card p-4" />
                {compareProperties.map((property) => (
                  <div key={property.id} className="bg-card p-4 relative">
                    <button
                      onClick={() => toggleCompare(property.id)}
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full aspect-[4/3] object-cover rounded-xl mb-3"
                    />
                    <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.price)}
                      <span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                ))}

                {[
                  { label: "Type", values: compareProperties.map((p) => p.type) },
                  { label: "Bedrooms", values: compareProperties.map((p) => `${p.bedrooms}`) },
                  { label: "Bathrooms", values: compareProperties.map((p) => `${p.bathrooms}`) },
                  { label: "Area", values: compareProperties.map((p) => `${p.area} m²`) },
                  { label: "Furnished", values: compareProperties.map((p) => (p.bedrooms > 2 ? "Yes" : "No")) },
                  { label: "Parking", values: compareProperties.map((p) => (p.bedrooms > 2 ? "Yes" : "No")) },
                  { label: "WiFi", values: compareProperties.map((p) => "Yes") },
                  { label: "Water", values: compareProperties.map((p) => "Yes") },
                  { label: "Electricity", values: compareProperties.map((p) => "Yes") },
                ].map((row) => (
                  <div key={row.label} className="contents">
                    <div className="bg-card p-4 flex items-center text-sm font-medium">
                      {row.label}
                    </div>
                    {row.values.map((value, i) => (
                      <div key={i} className="bg-card p-4 flex items-center justify-center text-sm">
                        {value === "Yes" ? (
                          <Check className="h-5 w-5 text-emerald-500" />
                        ) : value === "No" ? (
                          <Minus className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          value
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No properties to compare</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Add properties to compare by clicking the compare icon on any property card.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
