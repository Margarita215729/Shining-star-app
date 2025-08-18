import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = JSON.stringify({
        id: Date.now().toString(),
        content: "Connected to chat support",
        senderId: "system",
        senderName: "System",
        timestamp: new Date(),
        isAdmin: false,
      })
      controller.enqueue(`data: ${data}\n\n`)

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(`data: {"type":"heartbeat"}\n\n`)
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
