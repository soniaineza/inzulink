"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/constants"
import { Home, Target, Eye, Heart, Shield, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

const values = [
  { icon: Target, title: "Our Mission", desc: "To democratize property rentals in Rwanda by eliminating broker commissions and creating a transparent, direct marketplace." },
  { icon: Eye, title: "Our Vision", desc: "A Rwanda where finding a home is simple, affordable, and accessible to everyone — powered by technology and trust." },
  { icon: Heart, title: "Our Promise", desc: "Every listing is verified. Every landlord is vetted. Every tenant is protected. No exceptions." },
]

const team = [
  { name: "Jean-Pierre Habimana", role: "CEO & Co-Founder", bio: "Former real estate tech lead with 10+ years in African property markets." },
  { name: "Alice Mukamana", role: "CTO & Co-Founder", bio: "Full-stack engineer passionate about building products that solve real problems." },
  { name: "Patrick Niyonzima", role: "Head of Operations", bio: "Expert in Rwandan real estate market with deep local knowledge." },
  { name: "Grace Uwimana", role: "Head of Design", bio: "Award-winning designer focused on creating delightful user experiences." },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              We&apos;re on a mission to transform how Rwanda <span className="text-primary">finds homes</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {SITE_CONFIG.name} was founded in 2024 with a simple belief: finding a home should be
              straightforward, affordable, and trustworthy. We&apos;re building Rwanda&apos;s most trusted
              property marketplace — connecting tenants directly with landlords, with zero commissions.
            </p>
            <div className="flex gap-4">
              <Link href="/search">
                <Button className="gap-2">
                  Browse Properties <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-8 h-full">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center mb-5">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Team</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Passionate people building the future of rentals in Rwanda
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join the Revolution</h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
              Whether you&apos;re a tenant looking for a home or a landlord wanting to list,
              {SITE_CONFIG.name} is the platform for you.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" variant="secondary" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="xl" variant="outline" className="border-white/20 text-white hover:text-white hover:bg-white/10">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
