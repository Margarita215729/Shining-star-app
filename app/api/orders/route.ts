import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: session.user.id,
        isDeleted: false,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        address: true,
        assignment: {
          include: {
            cleaner: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data for frontend
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.total,
      depositPaid: order.depositPaid,
      depositAmount: order.depositAmount,
      balanceDue: order.balanceDue,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      estimatedDuration: order.estimatedDuration,
      serviceName: order.items[0]?.service?.name || "Cleaning Service",
      assignedCleaner: order.assignment?.cleaner?.name,
      address: order.address,
      items: order.items.map((item) => ({
        serviceName: item.service?.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
      invoiceNumber: `INV-${order.id}`,
      rating: order.rating,
    }))

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
