"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { Search, Send, Loader2, MessageCircle, ChevronLeft } from "lucide-react"

interface Conversation {
  id: string
  propertyId: string | null
  propertyTitle: string | null
  propertyImage: string | null
  participants: string[]
  lastMessage: {
    id: string
    content: string
    sender: { id: string; name: string; image: string | null }
    createdAt: string
  } | null
  updatedAt: string
}

interface Message {
  id: string
  content: string
  senderId: string
  sender: { id: string; name: string; image: string | null }
  createdAt: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showMobileList, setShowMobileList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setConversations(data.data || [])
    } catch {
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convId}`)
      const data = await res.json()
      setMessages(data.data || [])
    } catch {
      setMessages([])
    }
  }

  useEffect(() => {
    if (user) fetchConversations()
    else setLoading(false)
  }, [user])

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId)
    }
  }, [selectedConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const selectedConv = conversations.find((c) => c.id === selectedConvId)
  const otherParticipantId = selectedConv?.participants.find((p) => p !== user?.id)
  const otherParticipantName = otherParticipantId
    ? selectedConv?.lastMessage?.sender.id === otherParticipantId
      ? selectedConv?.lastMessage?.sender.name
      : otherParticipantId === selectedConv?.lastMessage?.sender.id
        ? selectedConv.lastMessage.sender.name
        : "Unknown"
    : ""

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConvId) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConvId,
          content: messageText.trim(),
        }),
      })
      if (res.ok) {
        setMessageText("")
        fetchMessages(selectedConvId)
        fetchConversations()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to send")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1">Chat with landlords and tenants</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 rounded-2xl border bg-card overflow-hidden min-h-[600px]">
          <div className={`lg:col-span-1 border-r ${showMobileList ? "block" : "hidden lg:block"}`}>
            <div className="p-4 border-b">
              <Input placeholder="Search conversations..." icon={<Search className="h-4 w-4" />} />
            </div>
            <div className="divide-y overflow-y-auto max-h-[500px]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => { setSelectedConvId(conv.id); setShowMobileList(false) }}
                    className={`flex items-start gap-3 p-4 w-full text-left hover:bg-muted/50 transition-colors ${
                      selectedConvId === conv.id ? "bg-muted" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(conv.lastMessage?.sender.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate">{conv.lastMessage?.sender.name || "Unknown"}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatRelativeTime(conv.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                      {conv.propertyTitle && (
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{conv.propertyTitle}</p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`lg:col-span-2 flex flex-col ${showMobileList ? "hidden lg:flex" : "flex"}`}>
            {selectedConv ? (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <button className="lg:hidden" onClick={() => setShowMobileList(true)}>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(otherParticipantName || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{otherParticipantName}</p>
                      {selectedConv.propertyTitle && (
                        <p className="text-xs text-muted-foreground">{selectedConv.propertyTitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                  {messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 ${
                            msg.senderId === user?.id
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted rounded-tl-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-[10px] opacity-70 mt-1 text-right">
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="shrink-0 rounded-xl" loading={sending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
