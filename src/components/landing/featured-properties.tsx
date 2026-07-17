"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FEATURED_PROPERTIES } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import { ArrowRight, MapPin, Bed, Bath, Star } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function FeaturedProperties() {
  const { t } = useLocale()
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
          {FEATURED_PROPERTIES.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link href={`/property/${property.id}`} className="group block rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img src={property.image} alt={property.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {property.isFeatured && <Badge className="text-[10px] px-2 py-0.5 bg-white/90 text-foreground border-0 shadow-sm">{t("feat.featured")}</Badge>}
                    {property.isAvailable && <Badge className="text-[10px] px-2 py-0.5 bg-primary text-white border-0 shadow-sm">{t("feat.available")}</Badge>}
                  </div>
                  {property.rating && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                      <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                      <span className="text-[10px] font-semibold">{property.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-lg font-bold mt-1.5">
                    {formatPrice(property.price)}
                    <span className="text-xs font-normal text-muted-foreground">{t("feat.perMonth")}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms}</span>
                    <span>{property.area}m²</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
