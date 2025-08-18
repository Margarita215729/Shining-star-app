import { prisma } from "../prisma"
import type { Order, OrderStatus } from "@prisma/client"

export class OrderRepository {
  async create(data: Omit<Order, "id" | "createdAt" | "updatedAt" | "orderNumber">) {
    const orderNumber = await this.generateOrderNumber()

    return prisma.order.create({
      data: {
        ...data,
        orderNumber,
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        customer: true,
        address: true,
      },
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id, isDeleted: false },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        customer: true,
        address: true,
        assignments: {
          include: {
            cleaner: true,
          },
        },
      },
    })
  }

  async findByCustomer(customerId: string, status?: OrderStatus) {
    return prisma.order.findMany({
      where: {
        customerId,
        isDeleted: false,
        ...(status && { status }),
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
        address: true,
      },
      orderBy: { scheduledDate: "desc" },
    })
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    const prefix = `SS${year}${month}${day}`

    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: prefix,
        },
      },
      orderBy: { orderNumber: "desc" },
    })

    let sequence = 1
    if (lastOrder) {
      const lastSequence = Number.parseInt(lastOrder.orderNumber.slice(-4))
      sequence = lastSequence + 1
    }

    return `${prefix}${String(sequence).padStart(4, "0")}`
  }
}

export const orderRepository = new OrderRepository()
