"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Brain, Search, Shield, Zap, BarChart3 } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const featureKeys = [
  { icon: BarChart3, titleKey: "ai.feature1Title", descKey: "ai.feature1Desc" },
  { icon: Brain, titleKey: "ai.feature2Title", descKey: "ai.feature2Desc" },
  { icon: Zap, titleKey: "ai.feature3Title", descKey: "ai.feature3Desc" },
  { icon: Shield, titleKey: "ai.feature4Title", descKey: "ai.feature4Desc" },
]

export function AISection() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("ai.title")} <span className="text-primary">{t("ai.titleHighlight")}</span></h2>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-md">{t("ai.subtitle")}</p>

            <div className="mt-5 space-y-1.5">
              {featureKeys.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.titleKey}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors cursor-default"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{t(feature.titleKey)}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{t(feature.descKey)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-5 flex gap-2.5">
              <Link href="/ai-search">
                <Button className="gap-2 rounded-lg text-xs h-9">{t("ai.tryAISearch")} <Search className="h-3.5 w-3.5" /></Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" size="sm" className="rounded-lg text-xs h-9">{t("ai.learnMore")}</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80" alt="AI Technology" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/10 backdrop-blur-2xl rounded-xl p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-5 w-5 rounded-lg bg-primary flex items-center justify-center"><Sparkles className="h-2.5 w-2.5 text-white" /></div>
                    <span className="text-white font-medium text-[11px]">{t("ai.analysisActive")}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/70">
                    <span>3,847 {t("ai.propertiesAnalyzed")}</span>
                    <span className="text-white/80">98% {t("ai.accuracy")}</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
