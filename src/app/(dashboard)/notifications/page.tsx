"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import {
  Bell,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCheck,
  Trash2,
  Heart,
  Building2,
  Loader2,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  message: MessageCircle,
  booking: Calendar,
  alert: AlertTriangle,
  system: Building2,
}

const colorMap: Record<string, string> = {
  message: "from-blue-500 to-indigo-500",
  booking: "from-emerald-500 to-teal-500",
  alert: "from-rose-500 to-pink-500",
  system: "from-amber-500 to-orange-500",
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(data.data || [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchNotifications()
    else setLoading(false)
  }, [user])

  const unread = notifications.filter((n: any) => !n.read).length

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      })
      if (res.ok) {
        setNotifications(notifications.map((n: any) => ({ ...n, read: true })))
        toast.success("All marked as read")
      }
    } catch {
      toast.error("Failed to mark as read")
    }
  }

  const clearAll = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      })
      if (res.ok) {
        setNotifications([])
        toast.success("All notifications cleared")
      }
    } catch {
      toast.error("Failed to clear notifications")
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
            {notifications.map((notification: any, index: number) => {
              const Icon = iconMap[notification.type] || Bell
              const color = colorMap[notification.type] || "from-gray-500 to-gray-600"
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={notification.link || "#"}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all block ${
                      !notification.read
                        ? "bg-primary/5 border border-primary/10"
                        : "bg-card border border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-lg`}>
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
                  </Link>
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
