import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserInvoices } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoices = await getUserInvoices(session.user.id)

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
