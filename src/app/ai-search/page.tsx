"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PropertyCard } from "@/components/property/property-card"
import { FEATURED_PROPERTIES } from "@/lib/constants"
import {
  Sparkles,
  Send,
  Bot,
  User,
  Mic,
  Search,
  MapPin,
  Home,
  TrendingUp,
  Star,
} from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const suggestions = [
  "I need a 2-bedroom apartment in Kimironko under 400,000 RWF",
  "Looking for a furnished studio near Kacyiru for a student",
  "Family house with garden in Remera, 3+ bedrooms",
  "Modern villa with pool in Nyarutarama",
  "Affordable 1-bedroom near university in Nyamirambo",
]

const searchResults = [
  {
    query: "2-bedroom apartment in Kimironko under 400,000 RWF",
    results: FEATURED_PROPERTIES.slice(0, 3),
  },
]

export default function AISearchPage() {
  const { t } = useLocale()
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setMessages((prev) => [...prev, { role: "user", content: query }])
    setIsSearching(true)
    await new Promise((r) => setTimeout(r, 1500))
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content:
          "I found several properties matching your description. Here are the best options based on your preferences for location, budget, and size.",
      },
    ])
    setShowResults(true)
    setIsSearching(false)
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {t("ai.title")} {t("ai.titleHighlight")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("ai.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
            <Input
              placeholder='Try: "A 2-bedroom apartment in Kimironko with parking, under 400k RWF"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-14 pl-12 pr-24 text-base rounded-2xl border-2 shadow-xl shadow-amber-500/5"
              icon={null}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button className="h-10 w-10 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground">
                <Mic className="h-4 w-4" />
              </button>
              <Button size="sm" className="rounded-xl gap-1.5" onClick={handleSearch} loading={isSearching}>
                <Search className="h-4 w-4" />
                {t("hero.search")}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion)
                }}
                className="px-3 py-1.5 rounded-xl bg-muted text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all border"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "ai" && (
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Recommendations</h2>
                  <p className="text-xs text-muted-foreground">
                    Matched 3 properties based on your description
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURED_PROPERTIES.slice(0, 3).map((property, index) => (
                  <div key={property.id} className="relative">
                    <PropertyCard {...property} index={index} />
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="default" className="gap-1 shadow-lg">
                        <Star className="h-3 w-3 fill-current" />
                        AI Match {100 - index * 5}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Based on your search for a 2-bedroom apartment in Kimironko under 400,000 RWF,
                      the average market price is 380,000 RWF. The recommended properties offer the best
                      value with parking and WiFi included. Consider expanding your search to nearby
                      Remera for additional options.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showResults && messages.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {[
              { icon: Home, label: "Property Type", desc: "Apartment, House, Villa..." },
              { icon: MapPin, label: "Location", desc: "District, Sector, Village..." },
              { icon: Sparkles, label: "Amenities", desc: "WiFi, Parking, Pool..." },
              { icon: TrendingUp, label: "Budget", desc: "Price range preference" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl border bg-card text-center">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
