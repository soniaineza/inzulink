"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/providers/auth-provider"
import { Menu, Home, Sun, Moon, LogOut, ChevronDown, Search, Heart, LayoutDashboard, Globe, Shield } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/search", key: "nav.rent" },
  { href: "/search?type=house", key: "nav.buy" },
  { href: "/dashboard/landlord", key: "nav.listProperty" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [langOpen, setLangOpen] = React.useState(false)
  const { t, locale, setLocale, locales, localeNames } = useLocale()

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.split("?")[0]) || pathname === href.split("?")[0]
  }

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "glass-dark shadow-sm" : "bg-transparent")}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Inzu<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Sun className="h-4 w-4 block dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </button>

            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Globe className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-36 rounded-xl border bg-popover shadow-xl p-1 z-50"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setLangOpen(false) }}
                        className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          locale === l ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                        }`}
                      >
                        {localeNames[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>              {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-popover shadow-xl p-1 z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      {user.role === "admin" ? (
                        <Link href="/dashboard/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                          <Shield className="h-4 w-4 text-muted-foreground" /> Admin Dashboard
                        </Link>
                      ) : user.role === "landlord" ? (
                        <Link href="/dashboard/landlord" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> {t("nav.dashboard")}
                        </Link>
                      ) : null}
                      <Link href="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                        <Heart className="h-4 w-4 text-muted-foreground" /> {t("nav.saved")}
                      </Link>
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setUserMenuOpen(false) }} className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-lg text-sm">{t("nav.signIn")}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-lg text-sm shadow-sm">{t("nav.getStarted")}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden border-t bg-background"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive(link.href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted/50")}
                >
                  {t(link.key)}
                </Link>
              ))}
              <hr className="my-2" />
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false) }} className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                </button>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1"><Button variant="outline" className="w-full rounded-lg">{t("nav.signIn")}</Button></Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1"><Button className="w-full rounded-lg">{t("nav.getStarted")}</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
