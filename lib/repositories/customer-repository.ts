import { prisma } from "../prisma"
import type { Customer } from "../types"
import bcrypt from "bcryptjs"

export class CustomerRepository {
  async create(data: Omit<Customer, "id" | "createdAt" | "updatedAt"> & { password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    return prisma.customer.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        addresses: true,
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.customer.findUnique({
      where: { email, isDeleted: false },
      include: {
        addresses: {
          where: { isDeleted: false },
        },
      },
    })
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id, isDeleted: false },
      include: {
        addresses: {
          where: { isDeleted: false },
        },
        orders: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })
  }

  async update(id: string, data: Partial<Customer>) {
    return prisma.customer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  async softDelete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    })
  }

  async validatePassword(email: string, password: string) {
    const customer = await prisma.customer.findUnique({
      where: { email, isDeleted: false },
    })

    if (!customer) return null

    const isValid = await bcrypt.compare(password, customer.password)
    return isValid ? customer : null
  }
}

export const customerRepository = new CustomerRepository()
