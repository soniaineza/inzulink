import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // During build (SSG), return a mock client to avoid build failure
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      // Return a proxy that throws only on actual method calls
      return new Proxy({} as PrismaClient, {
        get() {
          throw new Error("PrismaClient is not available during build. DATABASE_URL must be set at runtime.")
        }
      })
    }
    throw new Error("DATABASE_URL is not set")
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

let prismaInstance: PrismaClient | undefined

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = globalForPrisma.prisma ?? createPrismaClient()
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance
  }
  return prismaInstance
}

// For backward compatibility - lazy via Proxy
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrismaClient()[prop as keyof PrismaClient]
  }
})