"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Heart, ArrowRight } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import { toast } from "sonner"
import { useState } from "react"
import { useLocale } from "@/providers/locale-provider"

const footerSections = [
  { titleKey: "footer.company", links: [
    { labelKey: "footer.about", href: "/about" },
    { labelKey: "footer.blog", href: "/about" },
    { labelKey: "footer.careers", href: "/about" },
  ]},
  { titleKey: "footer.resources", links: [
    { labelKey: "footer.helpCenter", href: "/help" },
    { labelKey: "footer.safetyTips", href: "/help" },
    { labelKey: "footer.rentalGuide", href: "/help" },
  ]},
  { titleKey: "footer.support", links: [
    { labelKey: "footer.contact", href: "/contact" },
    { labelKey: "footer.privacy", href: "/privacy" },
    { labelKey: "footer.terms", href: "/terms" },
  ]},
  { titleKey: "footer.forLandlords", links: [
    { labelKey: "footer.listProperty", href: "/dashboard/landlord" },
    { labelKey: "footer.successStories", href: "/about" },
    { labelKey: "footer.verification", href: "/dashboard/landlord" },
  ]},
]

const socialLinks = [
  { label: "X", href: "https://x.com/inzulink" },
  { label: "Li", href: "https://linkedin.com/company/inzulink" },
  { label: "Ig", href: "https://instagram.com/inzulink" },
  { label: "Fb", href: "https://facebook.com/inzulink" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const { t } = useLocale()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success(t("footer.subscribed"))
    setEmail("")
  }

  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Inzu<span className="text-primary">Link</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">{t("footer.tagline")}</p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg border flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="font-medium text-sm mb-3">{t(section.titleKey)}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. {t("footer.allRights")}
          </p>
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
              <Input type="email" placeholder={t("footer.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs" required />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-lg shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <p className="text-xs text-muted-foreground/60 order-3 text-center sm:text-right flex items-center justify-center sm:justify-end gap-1">
            {t("footer.madeWith")} <Heart className="h-3 w-3 text-red-500 fill-red-500" /> {t("footer.inRwanda")}
          </p>
        </div>
      </div>
    </footer>
  )
}
