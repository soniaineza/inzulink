import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: { id: true, name: true, email: true, image: true, phone: true },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { favorites: true, bookings: true } },
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    const avgRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
        : 0

    return NextResponse.json({
      ...property,
      avgRating: Math.round(avgRating * 10) / 10,
    })
  } catch (error) {
    console.error("Property detail error:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}
