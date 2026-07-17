import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, name, password, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: { id: "user_" + Date.now(), email, name, role: role || "tenant" },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
