"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Home, Users, TrendingUp, ShieldCheck } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

function AnimatedCounter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = Math.ceil(value / 125)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else { setCount(start) }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center p-5 rounded-xl bg-card border shadow-card">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold tracking-tight">
        <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3 }}>{count.toLocaleString()}</motion.span>
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="mt-0.5 text-muted-foreground text-[11px] font-medium">{label}</p>
    </div>
  )
}

const iconMap = [Home, Users, TrendingUp, ShieldCheck]
const statKeys = ["stats.houses", "stats.renters", "stats.landlords", "stats.verifiedListings"]

export function Statistics() {
  const { t } = useLocale()
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("stats.title")}</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">{t("stats.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statKeys.map((key, index) => (
            <motion.div key={key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.07 }}>
              <AnimatedCounter value={[12500, 8500, 1200, 1000][index]} suffix="+" label={t(key)} icon={iconMap[index]} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
