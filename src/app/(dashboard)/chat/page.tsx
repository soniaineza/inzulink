"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { Search, Send, Phone, Video, MoreHorizontal, ChevronLeft } from "lucide-react"

const conversations = [
  {
    id: "1",
    name: "Jean-Pierre",
    avatar: "",
    lastMessage: "The apartment is still available. Would you like to schedule a viewing?",
    time: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
    online: true,
    property: "Modern 2-Bedroom in Kimironko",
  },
  {
    id: "2",
    name: "Alice Mukamana",
    avatar: "",
    lastMessage: "Perfect, I'll be there at 10am tomorrow. Thank you!",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
    online: false,
    property: "Cozy Studio Near Kacyiru",
  },
  {
    id: "3",
    name: "Grace Uwimana",
    avatar: "",
    lastMessage: "Is the property still available for rent?",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 0,
    online: true,
    property: "Spacious 4-Bedroom in Remera",
  },
]

const messages = [
  { id: "1", senderId: "1", content: "Hello! I'm interested in your property.", time: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "2", senderId: "me", content: "Hi! Yes, it's still available. Would you like to schedule a viewing?", time: new Date(Date.now() - 1000 * 60 * 25) },
  { id: "3", senderId: "1", content: "That would be great. Is Saturday at 2pm possible?", time: new Date(Date.now() - 1000 * 60 * 20) },
  { id: "4", senderId: "me", content: "Saturday at 2pm works perfectly. I'll send you the address.", time: new Date(Date.now() - 1000 * 60 * 15) },
  { id: "5", senderId: "1", content: "The apartment is still available. Would you like to schedule a viewing?", time: new Date(Date.now() - 1000 * 60 * 5) },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [message, setMessage] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)

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
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => { setSelectedChat(conv); setShowMobileList(false) }}
                  className={`flex items-start gap-3 p-4 w-full text-left hover:bg-muted/50 transition-colors ${
                    selectedChat.id === conv.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conv.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{conv.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatRelativeTime(conv.time)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{conv.property}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="h-5 min-w-5 px-1 text-[10px]">{conv.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-2 flex flex-col ${showMobileList ? "hidden lg:flex" : "flex"}`}>
            {selectedChat ? (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <button className="lg:hidden" onClick={() => setShowMobileList(true)}>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedChat.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{selectedChat.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedChat.property}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 ${
                          msg.senderId === "me"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {formatRelativeTime(msg.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setMessage("")
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="shrink-0 rounded-xl">
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
