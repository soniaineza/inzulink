"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/providers/locale-provider"

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t } = useLocale()

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("faq.title")}</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">{t("faq.subtitle")}</p>
        </div>

        <div className="space-y-1.5">
          {faqKeys.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="rounded-xl border bg-card overflow-hidden"
            >
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between p-3.5 text-left">
                <span className="font-medium text-sm">{t(item.q)}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200", openIndex === index && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <p className="px-3.5 pb-3.5 text-sm text-muted-foreground leading-relaxed">{t(item.a)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
