"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const cities = ["Kigali", "Musanze", "Rubavu", "Huye", "Nyagatare"]

export function Hero() {
  const [query, setQuery] = useState("")
  const { t } = useLocale()
  const router = useRouter()

  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 via-[#0a0e1a]/70 to-[#0a0e1a]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-24 pb-12">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white text-balance leading-[1.1]">
              {t("hero.title")}
              <br />
              <span className="text-blue-300">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/60 max-w-lg">{t("hero.subtitle")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mt-6">
            <div className="bg-white rounded-xl shadow-2xl p-1.5 flex items-center max-w-xl">
              <div className="flex items-center px-3 text-muted-foreground/40">
                <Search className="h-5 w-5" />
              </div>
              <input
                placeholder={t("hero.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-11 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none"
              />
              <Link href={query ? `/search?q=${encodeURIComponent(query)}` : "/search"}>
                <Button className="h-9 px-5 rounded-lg text-sm font-medium">{t("hero.search")}</Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <div className="flex items-center gap-1 text-white/50 text-xs mr-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t("hero.popular")}</span>
              </div>
              {cities.map((city) => (
                <button key={city} onClick={() => router.push(`/search?q=${encodeURIComponent(city)}`)} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-[11px] font-medium hover:bg-white/20 transition-colors">
                  {city}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-8 flex items-center gap-5 text-sm">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-400 to-blue-600" />
              ))}
            </div>
            <div className="text-white/60 text-xs">
              <span className="text-white font-semibold">10,000+</span> {t("hero.propertiesListed")}
              <span className="mx-2">&middot;</span>
              <span className="text-white font-semibold">{t("hero.zeroFees")}</span> {t("hero.brokerFees")}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
