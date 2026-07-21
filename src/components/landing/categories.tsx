"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CATEGORIES } from "@/lib/constants"
import { ChevronRight } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function Categories() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("cat.title")}</h2>
            <p className="mt-0.5 text-muted-foreground text-xs">{t("cat.subtitle")}</p>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-0.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors">
            {t("cat.allTypes")} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Link href={`/search?type=${category.typeValue}`} className="group block relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500">
                <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm bg-gradient-to-t from-black/40 to-transparent">
                  <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                  <p className="text-white/60 text-[11px] mt-0.5">{category.count.toLocaleString()} {t("cat.properties")}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
