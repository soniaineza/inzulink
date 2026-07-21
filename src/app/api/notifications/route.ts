import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

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
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({
      data: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type.toLowerCase(),
        read: n.read,
        link: n.link,
        time: n.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, readAll } = await request.json()

    if (readAll) {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true, message: "All marked as read" })
    }

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId },
        data: { read: true },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
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
    const { clearAll, id } = await request.json()

    if (clearAll) {
      await prisma.notification.deleteMany({ where: { userId } })
      return NextResponse.json({ success: true, message: "All notifications cleared" })
    }

    if (id) {
      const deleted = await prisma.notification.deleteMany({ where: { id, userId } })
      if (deleted.count === 0) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Provide id or clearAll" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
