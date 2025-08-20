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

    const orders = await prisma.order.findMany({
      where: { isDeleted: false },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            service: {
              select: { name: true },
            },
          },
        },
        scheduleSlot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      customerEmail: order.customer.email,
      services: order.orderItems.map((item) => item.service.name),
      totalAmount: order.total,
      depositPaid: order.depositPaid,
      status: order.status,
      scheduledDate: order.scheduleSlot?.startTime?.toISOString() || null,
      createdAt: order.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("[ADMIN_ORDERS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
