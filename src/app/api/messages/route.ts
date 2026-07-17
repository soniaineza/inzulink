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

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversationId")

  try {
    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      })
      return NextResponse.json({ data: messages })
    }

    const conversations = await prisma.conversation.findMany({
      where: { participants: { has: userId } },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
        },
        property: { select: { id: true, title: true, images: true } },
      },
      orderBy: { updatedAt: "desc" },
    })

    const data = conversations.map((c) => ({
      id: c.id,
      propertyId: c.propertyId,
      propertyTitle: c.property?.title || null,
      propertyImage: c.property?.images[0] || null,
      participants: c.participants,
      lastMessage: c.messages[0] || null,
      updatedAt: c.updatedAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { conversationId, content } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json({ error: "conversationId and content are required" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: { conversationId, senderId: userId, content },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: content, lastMessageAt: new Date() },
    })

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}