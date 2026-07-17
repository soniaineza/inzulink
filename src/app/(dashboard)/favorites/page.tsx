"use client"

import { motion } from "framer-motion"
import { PropertyCard } from "@/components/property/property-card"
import { Button } from "@/components/ui/button"
import { useFavoritesStore } from "@/store/use-favorites"
import { FEATURED_PROPERTIES } from "@/lib/constants"
import { Heart, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore()
  const favoriteProperties = FEATURED_PROPERTIES.filter((p) => favorites.includes(p.id))

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-7 w-7 text-red-500" />
            Saved Properties
          </h1>
          <p className="text-muted-foreground mt-1">
            {favoriteProperties.length} saved {favoriteProperties.length === 1 ? "property" : "properties"}
          </p>
        </motion.div>

        {favoriteProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProperties.map((property, index) => (
              <PropertyCard key={property.id} {...property} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No saved properties yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Start browsing and save properties you like by tapping the heart icon.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
