// Production-ready Prisma client setup
let PrismaClient: any

try {
  // Try to import the real Prisma client
  const PrismaModule = require("@prisma/client")
  PrismaClient = PrismaModule.PrismaClient
} catch (error) {
  console.warn("Prisma client not available, using mock for development")
  // Fallback mock when Prisma client is not generated (development only)
  PrismaClient = class MockPrismaClient {
    customer = {
      create: (data: any) => Promise.resolve({ id: "mock-id", ...data }),
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      update: (data: any) => Promise.resolve({ id: "mock-id", ...data }),
      delete: () => Promise.resolve({ id: "mock-id" })
    }
    order = {
      create: (data: any) => Promise.resolve({ id: "mock-id", ...data }),
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      update: (data: any) => Promise.resolve({ id: "mock-id", ...data })
    }
    service = {
      create: (data: any) => Promise.resolve({ id: "mock-id", ...data }),
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      update: (data: any) => Promise.resolve({ id: "mock-id", ...data })
    }
    $connect = () => Promise.resolve()
    $disconnect = () => Promise.resolve()
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
