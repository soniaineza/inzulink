"use client"

import { motion } from "framer-motion"
import { Banknote, ShieldCheck, Sparkles, Users } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const whyItems = [
  { icon: Banknote, titleKey: "why.item1Title", descKey: "why.item1Desc" },
  { icon: ShieldCheck, titleKey: "why.item2Title", descKey: "why.item2Desc" },
  { icon: Sparkles, titleKey: "why.item3Title", descKey: "why.item3Desc" },
  { icon: Users, titleKey: "why.item4Title", descKey: "why.item4Desc" },
]

export function WhyInzuLink() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("why.title")}</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">{t("why.subtitle")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-5 rounded-xl bg-card border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{t(item.titleKey)}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
