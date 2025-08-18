import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().optional(), // Honeypot field for spam protection
})

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }) // Fake success for bots
    }

    const validatedData = contactSchema.parse(body)

    // Send email notification
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@shiningstarphilly.com",
      to: "info@shiningstarphilly.com",
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ""}
        ${validatedData.service ? `<p><strong>Service:</strong> ${validatedData.service}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    // Send confirmation email to customer
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@shiningstarphilly.com",
      to: validatedData.email,
      subject: "Thank you for contacting Shining Star Cleaning",
      html: `
        <h2>Thank you for your inquiry!</h2>
        <p>Hi ${validatedData.name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to call us at (215) 555-0123 if you have any urgent questions.</p>
        <p>Best regards,<br>The Shining Star Team</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you within 24 hours!",
    })
  } catch (error) {
    console.error("Contact form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
