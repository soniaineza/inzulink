"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function CTA() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />
          </div>

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">{t("cta.title")}</h2>
            <p className="mt-2 text-white/70 text-sm max-w-md mx-auto leading-relaxed">{t("cta.subtitle")}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link href="/search">
                <Button className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl px-7 font-medium h-11 text-sm">
                  {t("cta.browse")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="gap-2 rounded-xl border-white/30 text-white hover:bg-white/10 px-7 font-medium h-11 text-sm">
                  {t("cta.createAccount")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
