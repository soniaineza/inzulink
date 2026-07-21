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
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { participants: true },
      })
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
      if (!conversation.participants.includes(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
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
    const { conversationId, content, receiverId, propertyId } = await request.json()

    let convId = conversationId

    if (!convId) {
      if (!receiverId || !propertyId || !content) {
        return NextResponse.json({ error: "receiverId, propertyId, and content are required to start a conversation" }, { status: 400 })
      }

      const existing = await prisma.conversation.findFirst({
        where: {
          propertyId,
          participants: { hasEvery: [userId, receiverId] },
        },
      })

      if (existing) {
        convId = existing.id
      } else {
        const conversation = await prisma.conversation.create({
          data: {
            propertyId,
            participants: [userId, receiverId],
          },
        })
        convId = conversation.id
      }
    } else if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: { conversationId: convId, senderId: userId, content: content || "" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    })

    await prisma.conversation.update({
      where: { id: convId },
      data: { lastMessage: content || message.content, lastMessageAt: new Date() },
    })

    return NextResponse.json({ success: true, message, conversationId: convId }, { status: 201 })
  } catch (error) {
    console.error("Message create error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}