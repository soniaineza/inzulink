"use client"

import { Suspense, useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { PropertyCard } from "@/components/property/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ListSkeleton } from "@/components/ui/skeleton"
import { FEATURED_PROPERTIES, LOCATIONS, PROPERTY_TYPES, BEDROOM_OPTIONS, BATHROOM_OPTIONS, SORT_OPTIONS, AMENITIES } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Bed,
  Bath,
  Home,
  SearchX,
} from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

function SearchPageInner() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    district: searchParams.get("district") || "",
    sector: searchParams.get("sector") || "",
    furnished: searchParams.get("furnished") === "true",
    sort: searchParams.get("sort") || "newest",
    amenities: searchParams.getAll("amenity"),
  })

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
    setFilters({
      type: searchParams.get("type") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      district: searchParams.get("district") || "",
      sector: searchParams.get("sector") || "",
      furnished: searchParams.get("furnished") === "true",
      sort: searchParams.get("sort") || "newest",
      amenities: searchParams.getAll("amenity"),
    })
  }, [searchParams])

  const filteredProperties = useMemo(() => {
    let results = [...FEATURED_PROPERTIES]

    if (query.trim()) {
      const q = query.toLowerCase().trim()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.landlord.toLowerCase().includes(q)
      )
    }

    if (filters.type) {
      results = results.filter((p) => p.type.toLowerCase() === filters.type.toLowerCase())
    }

    if (filters.district) {
      results = results.filter((p) => p.location.toLowerCase().includes(filters.district.toLowerCase()))
    }

    if (filters.sector) {
      results = results.filter((p) => p.location.toLowerCase().includes(filters.sector.toLowerCase()))
    }

    if (filters.minPrice) {
      results = results.filter((p) => p.price >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      results = results.filter((p) => p.price <= Number(filters.maxPrice))
    }

    if (filters.bedrooms) {
      const min = Number(filters.bedrooms)
      results = results.filter((p) => p.bedrooms >= min)
    }

    if (filters.bathrooms) {
      const min = Number(filters.bathrooms)
      results = results.filter((p) => p.bathrooms >= min)
    }

    if (filters.furnished) {
      results = results.filter((p) => p.hasInternet || p.hasParking)
    }

    if (filters.amenities.length > 0) {
      results = results.filter((p) => {
        if (filters.amenities.includes("wifi") && !p.hasInternet) return false
        if (filters.amenities.includes("parking") && !p.hasParking) return false
        return true
      })
    }

    switch (filters.sort) {
      case "price_asc":
        results.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        results.sort((a, b) => b.price - a.price)
        break
      case "popular":
        results.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        break
      default:
        results.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    }

    return results
  }, [query, filters])

  const clearFilters = () => {
    setFilters({
      type: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      district: "",
      sector: "",
      furnished: false,
      sort: "newest",
      amenities: [],
    })
    setQuery("")
    router.push("/search")
  }

  const hasFilters = Object.values(filters).some((v) => v !== "" && v !== false && !(Array.isArray(v) && v.length === 0)) || query.trim() !== ""

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t("search.title")}</h1>
          <p className="text-muted-foreground">
            {filteredProperties.length} {t("search.subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="font-semibold">{t("search.filters")}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("search.searchLabel")}</label>
                <Input
                  placeholder={t("search.searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("search.propertyType")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFilters({ ...filters, type: filters.type === type.value ? "" : type.value })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        filters.type === type.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("search.priceRange")}</label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder={t("search.min")}
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder={t("search.max")}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("search.bedrooms")}</label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters({ ...filters, bedrooms: filters.bedrooms === opt.value ? "" : opt.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        filters.bedrooms === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("search.bathrooms")}</label>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters({ ...filters, bathrooms: filters.bathrooms === opt.value ? "" : opt.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        filters.bathrooms === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("search.location")}</label>
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value, sector: "" })}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                >
                  <option value="">{t("search.allDistricts")}</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.district} value={loc.district}>
                      {loc.district}
                    </option>
                  ))}
                </select>
                {filters.district && (
                  <select
                    value={filters.sector}
                    onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm mt-2"
                  >
                    <option value="">{t("search.allSectors")}</option>
                    {LOCATIONS.find((l) => l.district === filters.district)?.sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("search.amenities")}</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.slice(0, 8).map((amenity) => (
                    <button
                      key={amenity.value}
                      onClick={() => {
                        const current = filters.amenities
                        if (current.includes(amenity.value)) {
                          setFilters({ ...filters, amenities: current.filter((a) => a !== amenity.value) })
                        } else {
                          setFilters({ ...filters, amenities: [...current, amenity.value] })
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        filters.amenities.includes(amenity.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      {amenity.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("search.furnished")}</label>
                <button
                  onClick={() => setFilters({ ...filters, furnished: !filters.furnished })}
                  className={`h-6 w-11 rounded-full transition-colors ${
                    filters.furnished ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      filters.furnished ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  {t("search.clearFilters")}
                </Button>
              )}
            </div>
          </motion.aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("search.filters")}
                </Button>

                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="h-9 rounded-xl border border-input bg-background px-3 text-xs"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.type && (
                  <Badge variant="secondary" className="gap-1">
                    {PROPERTY_TYPES.find((t) => t.value === filters.type)?.label}
                    <button onClick={() => setFilters({ ...filters, type: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {filters.district && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.district}{filters.sector ? ` / ${filters.sector}` : ""}
                    <button onClick={() => setFilters({ ...filters, district: "", sector: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.minPrice ? formatPrice(Number(filters.minPrice)) : "0"} - {filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : "∞"}
                    <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
                {filters.furnished && (
                  <Badge variant="secondary" className="gap-1">
                    Furnished
                    <button onClick={() => setFilters({ ...filters, furnished: false })}><X className="h-3 w-3" /></button>
                  </Badge>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <ListSkeleton />
              ) : filteredProperties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{t("common.noResults")}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">{t("search.noResults")}</p>
                  {hasFilters && (
                    <Button variant="outline" size="sm" className="mt-4 rounded-lg" onClick={clearFilters}>
                      {t("search.clearFilters")}
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-2"
                      : "space-y-4"
                  }
                >
                  {filteredProperties.map((property, index) => (
                    <PropertyCard key={property.id} {...property} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {filteredProperties.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("search.showing")} {filteredProperties.length} {t("search.subtitle")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen" />}>
      <SearchPageInner />
    </Suspense>
  )
}
