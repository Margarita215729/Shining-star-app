import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      include: {
        orders: {
          select: {
            total: true,
            status: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedCustomers = customers.map((customer) => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone || "N/A",
      totalOrders: customer._count.orders,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.total, 0),
      status: customer.orders.some((order) => order.status === "CONFIRMED" || order.status === "IN_PROGRESS")
        ? "active"
        : "inactive",
      createdAt: customer.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error("[ADMIN_CUSTOMERS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
