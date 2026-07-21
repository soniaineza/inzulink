import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

async function getUser(request: Request): Promise<{ id: string; role: string } | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload || !payload.sub) return null
  return { id: payload.sub as string, role: (payload.role as string) || "tenant" }
}

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

    // Increment view count (non-critical, don't break the response on failure)
    prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    }).catch(() => {})

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUser(request)

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to edit a property" }, { status: 401 })
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Only the landlord who owns it or an admin can edit
    if (property.landlordId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "You don't have permission to edit this property" }, { status: 403 })
    }

    const body = await request.json()

    // If edited by landlord, reset verification (needs re-approval)
    const needsReApproval = user.role !== "admin" && property.verified

    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = parseInt(body.price)
    if (body.type !== undefined) updateData.type = body.type.toUpperCase()
    if (body.bedrooms !== undefined) updateData.bedrooms = parseInt(body.bedrooms)
    if (body.bathrooms !== undefined) updateData.bathrooms = parseInt(body.bathrooms)
    if (body.area !== undefined) updateData.area = parseInt(body.area)
    if (body.furnished !== undefined) updateData.furnished = body.furnished
    if (body.petsAllowed !== undefined) updateData.petsAllowed = body.petsAllowed
    if (body.familyFriendly !== undefined) updateData.familyFriendly = body.familyFriendly
    if (body.studentFriendly !== undefined) updateData.studentFriendly = body.studentFriendly
    if (body.district !== undefined) updateData.district = body.district
    if (body.sector !== undefined) updateData.sector = body.sector
    if (body.village !== undefined) updateData.village = body.village
    if (body.street !== undefined) updateData.street = body.street
    if (body.latitude !== undefined) updateData.latitude = parseFloat(body.latitude)
    if (body.longitude !== undefined) updateData.longitude = parseFloat(body.longitude)
    if (body.images !== undefined) updateData.images = body.images
    if (body.video !== undefined) updateData.video = body.video
    if (body.amenities !== undefined) updateData.amenities = body.amenities
    if (body.availableFrom !== undefined) updateData.availableFrom = new Date(body.availableFrom)
    if (body.status !== undefined) updateData.status = body.status.toUpperCase()

    // Reset verification if landlord edited
    if (needsReApproval) {
      updateData.verified = false
      updateData.rejectionReason = null
      updateData.reviewedBy = null
      updateData.reviewedAt = null
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: needsReApproval
        ? "Property updated. It needs to be re-approved by an admin before appearing in search."
        : "Property updated successfully.",
    })
  } catch (error) {
    console.error("Property update error:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUser(request)

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to delete a property" }, { status: 401 })
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Only the landlord who owns it or an admin can delete
    if (property.landlordId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "You don't have permission to delete this property" }, { status: 403 })
    }

    await prisma.property.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Property deleted successfully" })
  } catch (error) {
    console.error("Property delete error:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
