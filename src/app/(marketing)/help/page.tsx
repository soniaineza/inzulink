"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, FileText, Shield, UserCheck, Building2, ArrowRight } from "lucide-react"

const helpCategories = [
  { icon: Search, title: "Finding a Home", desc: "How to search, filter, and find the perfect property", articles: 12 },
  { icon: MessageCircle, title: "Contacting Landlords", desc: "Messaging, scheduling viewings, and negotiating", articles: 8 },
  { icon: FileText, title: "Rental Agreements", desc: "Understanding leases, deposits, and contracts", articles: 6 },
  { icon: Shield, title: "Safety & Security", desc: "Staying safe, avoiding scams, and reporting issues", articles: 10 },
  { icon: UserCheck, title: "Account & Profile", desc: "Managing your account, verification, and settings", articles: 9 },
  { icon: Building2, title: "For Landlords", desc: "Listing properties, managing tenants, and analytics", articles: 14 },
]

export default function HelpPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">How can we help?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions and learn how to make the most of InzuLink.
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                placeholder="Search help articles..."
                className="flex h-14 w-full rounded-2xl border-2 border-input bg-background px-5 pl-12 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full group cursor-pointer hover:shadow-lg transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{category.articles} articles</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-12 rounded-3xl bg-muted/50"
          >
            <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
