"use client"

import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { PropertyCard } from "@/components/property/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ListSkeleton } from "@/components/ui/skeleton"
import { LOCATIONS, PROPERTY_TYPES, BEDROOM_OPTIONS, BATHROOM_OPTIONS, SORT_OPTIONS, AMENITIES } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import {
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

function SearchPageInner() {
  const { t } = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (filters.type) params.set("type", filters.type)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms)
    if (filters.bathrooms) params.set("bathrooms", filters.bathrooms)
    if (filters.district) params.set("district", filters.district)
    if (filters.sector) params.set("sector", filters.sector)
    if (filters.furnished) params.set("furnished", "true")
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort)
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","))
    if (page > 1) params.set("page", String(page))
    return params.toString()
  }, [query, filters, page])

  const fetchProperties = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/properties?${q}`)
      const data = await res.json()
      if (data.data) {
        setProperties(data.data)
        setTotal(data.pagination?.total ?? data.data.length)
        setTotalPages(data.pagination?.totalPages ?? 1)
      }
    } catch {
      setProperties([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const qs = buildQueryString()
    const newUrl = qs ? `/search?${qs}` : "/search"
    router.replace(newUrl, { scroll: false })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchProperties(qs), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [buildQueryString, fetchProperties, router])

  useEffect(() => {
    setPage(1)
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
            {loading ? "..." : `${total} ${t("search.subtitle")}`}
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
                      filters.furnished ? "translate-x-5" : "translate-x-0.5"
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
              ) : properties.length === 0 ? (
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
                  {properties.map((property, index) => (
                    <PropertyCard key={property.id as string} {...(property as any)} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {properties.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("search.showing")} {total} {t("search.subtitle")}
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const maxVisible = 5
                        const pages: (number | "...")[] = []
                        if (totalPages <= maxVisible + 2) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i)
                        } else {
                          pages.push(1)
                          const start = Math.max(2, page - 1)
                          const end = Math.min(totalPages - 1, page + 1)
                          if (start > 2) pages.push("...")
                          for (let i = start; i <= end; i++) pages.push(i)
                          if (end < totalPages - 1) pages.push("...")
                          pages.push(totalPages)
                        }
                        return pages.map((p, i) =>
                          p === "..." ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">...</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`h-9 w-9 rounded-xl text-sm font-medium transition-all ${
                                page === p
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )
                      })()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="gap-1"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
