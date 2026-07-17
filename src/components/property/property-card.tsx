"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useFavoritesStore } from "@/store/use-favorites"
import { Heart, Bed, Bath, MapPin, Star, Calendar } from "lucide-react"
import { useLocale } from "@/providers/locale-provider"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  image: string
  rating?: number
  reviews?: number
  isAvailable?: boolean
  isFeatured?: boolean
  isVerified?: boolean
  hasParking?: boolean
  landlord?: string
  aiScore?: number
  index?: number
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  image,
  rating,
  reviews,
  isAvailable = true,
  isFeatured = false,
  landlord,
  aiScore,
  index = 0,
}: PropertyCardProps) {
  const { favorites, toggleFavorite } = useFavoritesStore()
  const isFav = favorites.includes(id)
  const { t } = useLocale()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="group rounded-xl overflow-hidden bg-card border shadow-card hover:shadow-card-hover transition-all duration-300">
        <Link href={`/property/${id}`}>
          <div className="relative aspect-[16/11] overflow-hidden">
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 left-3 flex gap-1.5">
              {isFeatured && <Badge className="text-[10px] px-2 py-0.5 bg-white/90 text-foreground border-0 shadow-sm">{t("prop.featured")}</Badge>}
              {isAvailable && <Badge className="text-[10px] px-2 py-0.5 bg-primary text-white border-0 shadow-sm">{t("prop.available")}</Badge>}
            </div>
            {rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-[10px] font-semibold">{rating}</span>
              </div>
            )}
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(id) }}
              className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all z-10"
            >
              <Heart className={`h-4 w-4 transition-all ${isFav ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} />
            </button>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/property/${id}`}>
            <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">{title}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <p className="text-lg font-bold mt-2">
            {formatPrice(price)}
            <span className="text-xs font-normal text-muted-foreground">{t("prop.perMonth")}</span>
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {bedrooms}</span>
            <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {bathrooms}</span>
            <span>{area}m²</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">{landlord || t("prop.landlord")}</span>
            <Link href={`/property/${id}`}>
              <Button size="sm" variant="ghost" className="h-7 text-xs px-2.5 rounded-lg">{t("prop.details")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
