"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import {
  Bell,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCheck,
  Trash2,
  Heart,
  Building2,
} from "lucide-react"

const initialNotifications = [
  {
    id: "1",
    title: "New Message",
    message: "Jean-Pierre responded to your inquiry about the Modern 2-Bedroom in Kimironko",
    type: "message",
    read: false,
    time: new Date(Date.now() - 1000 * 60 * 10),
    icon: MessageCircle,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "2",
    title: "Viewing Confirmed",
    message: "Your viewing for Cozy Studio Near Kacyiru is confirmed for Saturday at 2pm",
    type: "booking",
    read: false,
    time: new Date(Date.now() - 1000 * 60 * 60),
    icon: Calendar,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "3",
    title: "Price Drop Alert",
    message: "Modern 2-Bedroom in Kimironko dropped from 380,000 to 350,000 RWF",
    type: "alert",
    read: true,
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
    icon: Heart,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "4",
    title: "Property Verified",
    message: "Your property 'Spacious 4-Bedroom in Remera' has been verified successfully",
    type: "system",
    read: true,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: Building2,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "5",
    title: "New Review",
    message: "A tenant left a 5-star review for your property in Nyarutarama",
    type: "system",
    read: true,
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    icon: MessageCircle,
    color: "from-violet-500 to-purple-500",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unread = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bell className="h-7 w-7 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unread > 0 ? `You have ${unread} unread notification${unread > 1 ? "s" : ""}` : "No unread notifications"}
            </p>
          </div>
          <div className="flex gap-2">
            {unread > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={markAllRead}>
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification, index) => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                    !notification.read
                      ? "bg-primary/5 border border-primary/10"
                      : "bg-card border border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${notification.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(notification.time)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              No notifications yet. We&apos;ll let you know when something new arrives.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
