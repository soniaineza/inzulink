"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TESTIMONIALS } from "@/lib/constants"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

export function Testimonials() {
  const { t } = useLocale()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = () => { setDirection(1); setCurrent((prev) => (prev + 1) % TESTIMONIALS.length) }
  const prev = () => { setDirection(-1); setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => { setDirection(1); setCurrent((prev) => (prev + 1) % TESTIMONIALS.length) }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const testimonial = TESTIMONIALS[current]

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("test.title")}</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">{t("test.subtitle")}</p>
        </div>

        <div className="max-w-2xl mx-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="relative min-h-[240px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <div className="p-6 rounded-xl bg-card border shadow-card text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center justify-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role} &middot; {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={prev} className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"}`}
                />
              ))}
            </div>
            <button onClick={next} className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
