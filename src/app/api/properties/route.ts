import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const district = searchParams.get("district")
  const sector = searchParams.get("sector")
  const type = searchParams.get("type")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const bedrooms = searchParams.get("bedrooms")
  const bathrooms = searchParams.get("bathrooms")
  const furnished = searchParams.get("furnished")
  const sort = searchParams.get("sort") || "newest"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50)

  const where: Record<string, unknown> = {}

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
      { sector: { contains: q, mode: "insensitive" } },
    ]
  }
  if (district) where.district = { equals: district, mode: "insensitive" }
  if (sector) where.sector = { equals: sector, mode: "insensitive" }
  if (type) where.type = type.toUpperCase()
  if (minPrice) where.price = { ...(where.price as object || {}), gte: parseInt(minPrice) }
  if (maxPrice) where.price = { ...(where.price as object || {}), lte: parseInt(maxPrice) }
  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) }
  if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms) }
  if (furnished === "true") where.furnished = true
  where.status = "AVAILABLE"

  let orderBy: Record<string, string> = { createdAt: "desc" }
  if (sort === "price_asc") orderBy = { price: "asc" }
  else if (sort === "price_desc") orderBy = { price: "desc" }
  else if (sort === "popular") orderBy = { views: "desc" }

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          landlord: { select: { id: true, name: true, email: true, image: true } },
          reviews: { select: { rating: true } },
          _count: { select: { favorites: true } },
        },
      }),
      prisma.property.count({ where }),
    ])

    const data = properties.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0
      return {
        id: p.id,
        title: p.title,
        location: `${p.district}, ${p.sector}`,
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        type: p.type.toLowerCase(),
        image: p.images[0] || "/placeholder.svg",
        rating: Math.round(avgRating * 10) / 10,
        reviews: p.reviews.length,
        isAvailable: p.status === "AVAILABLE",
        isFeatured: p.featured,
        isVerified: p.verified,
        hasParking: p.amenities.includes("parking"),
        hasInternet: p.amenities.includes("wifi"),
        landlord: p.landlord?.name || "Landlord",
        landlordAvatar: p.landlord?.image || "",
        aiScore: p.aiScore || 0,
        district: p.district,
        sector: p.sector,
        images: p.images,
        description: p.description,
        furnished: p.furnished,
        amenities: p.amenities,
        aiEstimatedPrice: p.aiEstimatedPrice,
        views: p.views,
        favoriteCount: p._count.favorites,
      }
    })

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Properties fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const property = await prisma.property.create({ data: body })
    return NextResponse.json({ success: true, data: property }, { status: 201 })
  } catch (error) {
    console.error("Property create error:", error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
