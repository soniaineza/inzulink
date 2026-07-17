"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ListSkeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { ArrowRight, MapPin, Bed, Bath, Star } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function FeaturedProperties() {
  const { t } = useLocale()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/properties?limit=6&sort=popular")
      .then((r) => r.json())
      .then((d) => { if (d.data) setProperties(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("feat.title")}</h2>
            <p className="mt-0.5 text-muted-foreground text-xs">{t("feat.subtitle")}</p>
          </div>
          <Link href="/search">
            <Button variant="ghost" className="gap-0.5 text-xs h-8 rounded-lg px-3">{t("feat.viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-card border shadow-card">
                <div className="aspect-[16/11] bg-muted animate-pulse" />
                <div className="p-3.5 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            properties.map((property: any, index: number) => (
              <motion.div
                key={property.id as string}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link href={`/property/${property.id}`} className="group block rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img src={property.image as string} alt={property.title as string} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      {property.isFeatured && <Badge className="text-[10px] px-2 py-0.5 bg-white/90 text-foreground border-0 shadow-sm">{t("feat.featured")}</Badge>}
                      {property.isAvailable && <Badge className="text-[10px] px-2 py-0.5 bg-primary text-white border-0 shadow-sm">{t("feat.available")}</Badge>}
                    </div>
                    {(property.rating as number) > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                        <span className="text-[10px] font-semibold">{property.rating as number}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{property.title as string}</h3>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{property.location as string}</span>
                    </div>
                    <p className="text-lg font-bold mt-1.5">
                      {formatPrice(property.price as number)}
                      <span className="text-xs font-normal text-muted-foreground">{t("feat.perMonth")}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.bedrooms as number}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms as number}</span>
                      <span>{(property.area as number)}m²</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
