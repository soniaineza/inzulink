"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { POPULAR_LOCATIONS } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import { MapPin, Building2, ChevronRight, TrendingUp } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function PopularLocations() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("loc.title")}</h2>
            <p className="mt-0.5 text-muted-foreground text-xs">{t("loc.subtitle")}</p>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-0.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors">
            {t("loc.exploreAll")} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {POPULAR_LOCATIONS.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Link href={`/search?district=${location.district.split(" ")[0]}&sector=${location.name}`} className="group block relative rounded-xl overflow-hidden aspect-[3/4]">
                <img src={location.image} alt={location.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium">
                    <Building2 className="h-2.5 w-2.5 inline mr-1 -mt-0.5" /> {location.count}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1 text-white/50 text-[10px] uppercase tracking-wider">
                    <MapPin className="h-3 w-3" />
                    <span>{location.district}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{location.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5 text-white/60 text-[11px]">
                    <TrendingUp className="h-3 w-3" />
                    <span>{t("loc.avg")}. {formatPrice(location.avgRent)}/mo</span>
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
