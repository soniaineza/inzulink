import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, name, password, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        role: (role?.toUpperCase() === "LANDLORD" ? "LANDLORD" : "TENANT") as "TENANT" | "LANDLORD",
      },
    })

    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase(),
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        verified: user.verified,
      },
    }, { status: 201 })

    response.headers.set("Set-Cookie", setAuthCookie(token))
    return response
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
