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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUser(request)

  if (!user) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Only admins can review properties" }, { status: 403 })
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const body = await request.json()
    if (typeof body.action !== "string") {
      return NextResponse.json({ error: "action must be a string" }, { status: 400 })
    }
    const action = body.action

    if (action === "approve") {
      const updated = await prisma.property.update({
        where: { id },
        data: {
          verified: true,
          rejectionReason: null,
          reviewedBy: user.id,
          reviewedAt: new Date(),
        },
      })

      try {
        await prisma.notification.create({
          data: {
            userId: property.landlordId,
            title: "Property Approved ",
            message: `Your property "${property.title}" has been approved and is now visible in search results.`,
            type: "SYSTEM",
            link: `/property/${id}`,
          },
        })
      } catch (e) { console.error("Failed to create notification:", e) }

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Property approved successfully. It is now visible to tenants.",
      })
    } else if (action === "reject") {
      const reason = typeof body.reason === "string" && body.reason.trim()
        ? body.reason.trim()
        : "Does not meet our quality standards."

      const updated = await prisma.property.update({
        where: { id },
        data: {
          verified: false,
          rejectionReason: reason,
          reviewedBy: user.id,
          reviewedAt: new Date(),
        },
      })

      try {
        await prisma.notification.create({
          data: {
            userId: property.landlordId,
            title: "Property Needs Changes",
            message: `Your property "${property.title}" was not approved. Reason: ${reason}. Please edit and resubmit.`,
            type: "SYSTEM",
            link: `/property/${id}`,
          },
        })
      } catch (e) { console.error("Failed to create notification:", e) }

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Property rejected. The landlord has been notified.",
      })
    }

    return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 })
  } catch (error) {
    console.error("Admin review error:", error)
    return NextResponse.json({ error: "Failed to review property" }, { status: 500 })
  }
}
