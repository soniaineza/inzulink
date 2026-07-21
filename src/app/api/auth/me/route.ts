import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.sub) {
      // Token invalid/expired — clear the cookie
      return new NextResponse(JSON.stringify({ user: null }), {
        headers: { "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax" },
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        image: true,
        phone: true,
      },
    })

    if (!user) {
      return new NextResponse(JSON.stringify({ user: null }), {
        headers: { "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax" },
      })
    }

    return NextResponse.json({
      user: {
        ...user,
        role: user.role.toLowerCase(),
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null })
  }
}