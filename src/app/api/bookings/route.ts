import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

async function getUserId(request: Request): Promise<string | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  const payload = await verifyToken(token)
  return (payload?.sub as string) || null
}

export async function POST(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "You must be logged in to schedule a viewing" }, { status: 401 })
  }

  try {
    const { propertyId, date, time, message } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 })
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, landlordId: true },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        tenantId: userId,
        date: new Date(date || Date.now()),
        time: time || "To be confirmed",
        message: message || null,
        status: "PENDING",
      },
    })

    // Notify the landlord
    try {
      await prisma.notification.create({
        data: {
          userId: property.landlordId,
          title: "New Viewing Request",
          message: `Someone wants to view "${property.title}"`,
          type: "BOOKING",
          link: `/dashboard/landlord`,
        },
      })
    } catch (e) {
      console.error("Failed to create notification:", e)
    }

    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (error) {
    console.error("Booking create error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
