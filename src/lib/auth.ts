import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production")
}
const secret = new TextEncoder().encode(JWT_SECRET || "dev-jwt-secret-not-for-production")

export async function createToken(payload: Record<string, unknown>) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const idx = cookie.indexOf("=")
    if (idx === -1) { acc[cookie.trim()] = ""; return acc }
    const key = cookie.slice(0, idx).trim()
    const value = cookie.slice(idx + 1).trim()
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies["auth_token"] || null
}

export function setAuthCookie(token: string) {
  return `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
}

export function clearAuthCookie() {
  return `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
}