import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, cleanerId, jobId, message } = await request.json()

    const cleaner = await prisma.cleaner.findUnique({
      where: { id: cleanerId },
    })

    if (!cleaner) {
      return NextResponse.json({ error: "Cleaner not found" }, { status: 404 })
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: cleaner.email,
      subject: "New Job Assignment - Shining Star Cleaning",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">New Job Assignment</h2>
          <p>Hello ${cleaner.firstName},</p>
          <p>${message}</p>
          <p>Please check your schedule and confirm your availability.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
            <p><strong>Job ID:</strong> ${jobId}</p>
            <p><strong>Assignment Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>Best regards,<br>Shining Star Cleaning Team</p>
        </div>
      `,
    })

    await prisma.auditLog.create({
      data: {
        action: "notification_sent",
        entityType: "cleaner",
        entityId: cleanerId,
        details: {
          type,
          jobId,
          message,
          method: "email",
        },
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ADMIN_NOTIFICATIONS_SEND]", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
