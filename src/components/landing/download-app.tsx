"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Smartphone, Apple, Download, Sparkles } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"
import { SITE_CONFIG } from "@/lib/constants"

export function DownloadApp() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
          </div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 sm:p-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t("app.title")}</h2>
              <p className="mt-2 text-white/70 text-sm max-w-md leading-relaxed">{t("app.subtitle")}</p>
              <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                <a href={SITE_CONFIG.appStoreUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2.5 rounded-xl h-11 px-5 bg-white text-primary hover:bg-white/90 shadow-lg text-sm">
                    <Apple className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-[9px] opacity-70 font-normal">{t("app.downloadOn")}</div>
                      <div className="text-sm font-semibold -mt-0.5">{t("app.appStore")}</div>
                    </div>
                  </Button>
                </a>
                <a href={SITE_CONFIG.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2.5 rounded-xl h-11 px-5 border-white/30 text-white hover:bg-white/10 text-sm">
                    <Download className="h-5 w-5" />
                    <div className="text-left">
                      <div className="text-[9px] opacity-70 font-normal">{t("app.getItOn")}</div>
                      <div className="text-sm font-semibold -mt-0.5">{t("app.googlePlay")}</div>
                    </div>
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-white/50 text-xs">
                <div className="flex">{[1, 2, 3, 4, 5].map((i) => (<Sparkles key={i} className="h-3 w-3 text-white/80" />))}</div>
                <span>{t("app.rating")}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-[220px] h-[460px] rounded-[2.5rem] border-4 border-white/20 bg-gradient-to-b from-primary/20 to-primary/5 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <div className="h-5 w-28 mx-auto bg-white/10 rounded-b-2xl" />
                  <div className="flex justify-between px-5 py-2 text-white/40 text-[9px]">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-white/60" />
                      <div className="h-2 w-4 rounded-sm bg-white/30" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="h-5 w-24 rounded bg-white/15 mb-3" />
                    <div className="h-2 w-full rounded bg-white/8 mb-1" />
                    <div className="h-2 w-3/4 rounded bg-white/8 mb-3" />
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {[1, 2, 3, 4].map((i) => (<div key={i} className="aspect-[4/5] rounded-lg bg-white/10" />))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
