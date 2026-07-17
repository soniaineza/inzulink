import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ data: [] })
}

export async function POST(request: Request) {
  try {
    const { conversationId, content } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json({ error: "Conversation ID and content are required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: { id: "msg_" + Date.now(), conversationId, content, createdAt: new Date().toISOString() },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
