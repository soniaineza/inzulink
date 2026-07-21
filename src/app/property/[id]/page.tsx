"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PropertyCard } from "@/components/property/property-card"
import { DetailSkeleton } from "@/components/ui/skeleton"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { useFavoritesStore } from "@/store/use-favorites"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
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
  Star,
  ChevronRight,
  Maximize2,
  Sparkles,
  CheckCircle,
  X,
  Loader2,
  Clock,
  Quote,
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
  const router = useRouter()
  const { favorites, toggleFavorite } = useFavoritesStore()
  const { user } = useAuth()
  const [property, setProperty] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)
  const [messaging, setMessaging] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/properties/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return
        setProperty(data)
        fetch(`/api/properties?district=${data.district || ""}&limit=3&sort=popular`)
          .then((r) => r.json())
          .then((d) => setSimilar((d.data || []).filter((p: Record<string, unknown>) => p.id !== data.id).slice(0, 3)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  const handleMessage = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    setMessaging(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: property.landlordId,
          propertyId: params.id,
          content: `Hi, I'm interested in "${property.title}". Is it still available?`,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Message sent!")
        router.push("/chat")
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setMessaging(false)
    }
  }

  const handleSchedule = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.id,
          date: new Date().toISOString(),
          time: "To be confirmed",
          message: `I'd like to schedule a viewing for "${property.title}".`,
        }),
      })
      if (res.ok) {
        toast.success("Viewing request sent! The landlord will contact you.")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to schedule viewing")
      }
    } catch {
      toast.error("Network error")
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: property.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleQR = () => {
    setShowQRModal(true)
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <DetailSkeleton />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <Link href="/search"><Button className="mt-4">Back to search</Button></Link>
        </div>
      </div>
    )
  }

  const isFav = favorites.includes(property.id as string)
  const images = (property.images as string[])?.length > 0
    ? property.images as string[]
    : [property.image as string]
  const landlord = property.landlord as Record<string, unknown> | undefined
  const avgRating = (property.avgRating as number) || 0

  return (
    <div className="pt-20 min-h-screen">
      {/* Image Gallery Modal */}
      {showAllImages && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={() => setShowAllImages(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-4 sm:inset-8 z-50 flex flex-col rounded-2xl bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">{property.title} - Gallery</h2>
              <button onClick={() => setShowAllImages(false)} className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-[4/3]">
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowQRModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:w-80 z-50 rounded-2xl bg-card p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">QR Code</h3>
              <button onClick={() => setShowQRModal(false)} className="h-8 w-8 rounded-xl hover:bg-muted flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-muted rounded-xl p-6 mb-4 flex items-center justify-center">
              <QrCode className="h-40 w-40 text-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Scan to view this property</p>
          </motion.div>
        </>
      )}

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
                    {i === 2 && images.length > 4 && (
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
                    {Boolean(property.isVerified) && (
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
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{property.title as string}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location as string}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleFavorite(property.id as string)}
                    className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button onClick={handleShare} className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bedrooms as number} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.bathrooms as number} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Move className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{property.area as number} m²</span>
                </div>
              </div>

              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-sm text-muted-foreground">({property.reviews?.length || property.reviews || 0} reviews)</span>
                </div>
              )}

              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price as number)}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold text-lg mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(property.amenities as string[] || []).map((amenity: string) => {
                    const Icon = amenityIcons[amenity] || Check
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm capitalize">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold text-lg mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {property.description as string}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="font-semibold text-lg mb-4">
                  Reviews ({property.reviews?.length || 0})
                </h2>
                {(property.reviews?.length > 0 ? property.reviews : []).map((review: any) => (
                  <div key={review.id} className="p-4 rounded-xl bg-muted/30 mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                        {((review.user?.name as string) || "U")?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.user?.name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
                      </div>
                      <div className="ml-auto flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                  </div>
                ))}
                {(!property.reviews || property.reviews.length === 0) && (
                  <p className="text-sm text-muted-foreground">No reviews yet for this property.</p>
                )}
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
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {((landlord?.name as string) || "L")?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{(landlord?.name as string) || (property.landlord as string) || "Landlord"}</p>
                    <p className="text-xs text-muted-foreground">Landlord &middot; {property.isVerified ? "Verified" : "Unverified"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full gap-2 rounded-xl" size="lg" onClick={handleMessage} loading={messaging}>
                    <MessageCircle className="h-4 w-4" />
                    Message Landlord
                  </Button>
                  <Button variant="outline" className="w-full gap-2 rounded-xl" size="lg" onClick={handleSchedule}>
                    <Calendar className="h-4 w-4" />
                    Schedule Viewing
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Eye className="h-3.5 w-3.5" />
                  Viewed {(property.views as number) || 0} times
                </div>
              </Card>

              {(property.aiScore as number) > 0 && (
                <Card className="p-6 space-y-4">
                  <h3 className="font-semibold text-sm">AI Price Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Score</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-medium text-amber-600">{property.aiScore as number}/100</span>
                      </div>
                    </div>
                    {(property.aiEstimatedPrice as number) && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Value</span>
                        <span className="font-medium">{formatPrice(property.aiEstimatedPrice as number)}</span>
                      </div>
                    )}
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min((property.aiScore as number), 100)}%` }} />
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Share Property
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handlePrint}>
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleQR}>
                    <QrCode className="h-3.5 w-3.5" />
                    QR Code
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        <Separator className="my-16" />

        {similar.length > 0 && (
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
              {similar.map((p, i) => (
                <PropertyCard key={p.id as string} {...(p as any)} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
