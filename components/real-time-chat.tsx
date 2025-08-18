"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, X } from "lucide-react"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: Date
  isAdmin: boolean
}

interface RealTimeChatProps {
  orderId?: string
  isOpen: boolean
  onClose: () => void
}

export default function RealTimeChat({ orderId, isOpen, onClose }: RealTimeChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!isOpen || !session?.user) return

    // Initialize SSE connection for real-time messages
    const connectToChat = () => {
      const eventSource = new EventSource(`/api/chat/stream?orderId=${orderId || "general"}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
      }

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setMessages((prev) => [...prev, message])
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        // Attempt to reconnect after 3 seconds
        setTimeout(connectToChat, 3000)
      }
    }

    // Load existing messages
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?orderId=${orderId || "general"}`)
        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error("Failed to load messages:", error)
      }
    }

    loadMessages()
    connectToChat()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [isOpen, orderId, session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user) return

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          orderId: orderId || "general",
        }),
      })

      if (response.ok) {
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat Support
            {isConnected && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Online
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === session?.user?.id
                        ? "bg-primary text-primary-foreground"
                        : message.isAdmin
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{message.senderName}</span>
                      <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
