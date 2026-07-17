"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PropertyCard } from "@/components/property/property-card"
import { DetailSkeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { FEATURED_PROPERTIES, AMENITIES } from "@/lib/constants"
import { useFavoritesStore } from "@/store/use-favorites"
import {
  ChevronLeft,
  Heart,
  Share2,
  Bed,
  Bath,
  Move,
  MapPin,
  Wifi,
  Droplets,
  Zap,
  Car,
  Sofa,
  Shield,
  Check,
  MessageCircle,
  Calendar,
  Printer,
  QrCode,
  Eye,
  Clock,
  Star,
  ChevronRight,
  Maximize2,
  Sparkles,
  CheckCircle,
} from "lucide-react"

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  water: Droplets,
  electricity: Zap,
  parking: Car,
  furnished: Sofa,
  security: Shield,
}

export default function PropertyDetailPage() {
  const params = useParams()
  const { favorites, toggleFavorite } = useFavoritesStore()
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  const property = FEATURED_PROPERTIES[0]
  const isFav = favorites.includes(property.id)

  const images = [
    property.image,
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.pexels.com/photos/31464449/pexels-photo-31464449.jpeg?auto=compress&cs=tinysrgb&w=800",
  ]

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <DetailSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to search
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setShowAllImages(true)}>
                  <img src={images[0]} alt="" className="h-full w-full object-cover aspect-[4/3]" />
                  <button className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
                {images.slice(1, 4).map((img, i) => (
                  <div key={i} className="relative group cursor-pointer overflow-hidden" onClick={() => { setSelectedImage(i + 1); setShowAllImages(true) }}>
                    <img src={img} alt="" className="h-full w-full object-cover aspect-[4/3]" loading="lazy" />
                    {i === 2 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">+{images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {property.isVerified && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    {property.isFeatured && (
                      <Badge variant="default" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={property.isAvailable ? "success" : "secondary"}>
                      {property.isAvailable ? "Available" : "Rented"}
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Move className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.area} m²</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(property.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{property.rating}</span>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold text-lg mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES.slice(0, 9).map((amenity) => {
                    const Icon = amenityIcons[amenity.value] || Check
                    return (
                      <div key={amenity.value} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold text-lg mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This beautiful {property.type.toLowerCase()} is located in one of Kigali&apos;s most desirable neighborhoods.
                  The property features modern finishes, plenty of natural light, and is walking distance to shops,
                  restaurants, and public transport. Perfect for professionals and families alike.
                  <br /><br />
                  The space includes a fully equipped kitchen, spacious living area, and comfortable bedrooms with
                  ample storage. The property is secure with 24/7 security and CCTV surveillance.
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ icon: MapPin, label: "Nearby Schools", value: "3 within 1km" },
                  { icon: MapPin, label: "Market", value: "5min walk" },
                  { icon: MapPin, label: "Bus Stop", value: "2min walk" },
                  { icon: MapPin, label: "Hospital", value: "10min drive" },
                ].map((item) => (
                  <Card key={item.label} className="p-4 text-center">
                    <item.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                    JP
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Jean-Pierre</p>
                    <p className="text-xs text-muted-foreground">Landlord &middot; Verified</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full gap-2 rounded-xl" size="lg">
                    <MessageCircle className="h-4 w-4" />
                    Message Landlord
                  </Button>
                  <Button variant="outline" className="w-full gap-2 rounded-xl" size="lg">
                    <Calendar className="h-4 w-4" />
                    Schedule Viewing
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Eye className="h-3.5 w-3.5" />
                  Viewed 234 times this week
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-sm">AI Price Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market Average</span>
                    <span className="font-medium">{formatPrice(320000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This Property</span>
                    <span className="font-medium text-primary">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Score</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-medium text-amber-600">Excellent Value</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Share Property
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <QrCode className="h-3.5 w-3.5" />
                    QR Code
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-sm mb-3">Affordability Calculator</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Estimated monthly cost including utilities
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rent</span>
                    <span className="font-medium">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilities (est.)</span>
                    <span className="font-medium">{formatPrice(45000)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">{formatPrice(property.price + 45000)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        <Separator className="my-16" />

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Similar Properties</h2>
              <p className="text-muted-foreground mt-1">You might also like these</p>
            </div>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PROPERTIES.slice(1, 4).map((p, i) => (
              <PropertyCard key={p.id} {...p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
