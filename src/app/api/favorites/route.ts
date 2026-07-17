import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

async function getUserId(request: Request): Promise<string | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  const payload = await verifyToken(token)
  return (payload?.sub as string) || null
}

export async function GET(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            landlord: { select: { id: true, name: true, email: true } },
            reviews: { select: { rating: true } },
            _count: { select: { favorites: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const data = favorites.map((f) => {
      const avgRating =
        f.property.reviews.length > 0
          ? f.property.reviews.reduce((sum, r) => sum + r.rating, 0) / f.property.reviews.length
          : 0
      return {
        id: f.property.id,
        title: f.property.title,
        location: `${f.property.district}, ${f.property.sector}`,
        price: f.property.price,
        bedrooms: f.property.bedrooms,
        bathrooms: f.property.bathrooms,
        area: f.property.area,
        type: f.property.type.toLowerCase(),
        image: f.property.images[0] || "/placeholder.svg",
        rating: Math.round(avgRating * 10) / 10,
        isAvailable: f.property.status === "AVAILABLE",
        isFeatured: f.property.featured,
        isVerified: f.property.verified,
        hasParking: f.property.amenities.includes("parking"),
        hasInternet: f.property.amenities.includes("wifi"),
        landlord: f.property.landlord?.name || "Landlord",
        aiScore: f.property.aiScore || 0,
        createdAt: f.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Favorites fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    })

    if (existing) {
      return NextResponse.json({ success: true, propertyId })
    }

    await prisma.favorite.create({
      data: { userId, propertyId },
    })

    return NextResponse.json({ success: true, propertyId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: { userId, propertyId },
    })

    return NextResponse.json({ success: true, propertyId })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}