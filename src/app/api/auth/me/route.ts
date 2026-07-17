import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return NextResponse.json({ user: null })
  }

  const payload = await verifyToken(token)
  if (!payload || !payload.sub) {
    return NextResponse.json({ user: null })
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
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: {
      ...user,
      role: user.role.toLowerCase(),
    },
  })
}