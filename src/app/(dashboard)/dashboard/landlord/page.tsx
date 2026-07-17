"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property/property-card"
import { FEATURED_PROPERTIES } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import {
  Plus,
  Building2,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "properties", label: "My Properties", icon: Building2 },
    { id: "viewings", label: "Viewings", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ]

  const stats = [
    { label: "Active Listings", value: "4", icon: Building2, change: "+1 this month", color: "from-emerald-500 to-teal-500" },
    { label: "Total Views", value: "1,234", icon: Eye, change: "+12% vs last month", color: "from-blue-500 to-indigo-500" },
    { label: "Inquiries", value: "28", icon: MessageCircle, change: "+5 this week", color: "from-amber-500 to-orange-500" },
    { label: "Viewings", value: "12", icon: Calendar, change: "3 upcoming", color: "from-rose-500 to-pink-500" },
  ]

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Building2 className="h-7 w-7 text-primary" />
              Landlord Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your properties, viewings, and inquiries
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </motion.div>

        <div className="flex gap-1 bg-card rounded-2xl p-1.5 border mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{stat.change}</p>
                  </Card>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { icon: Eye, text: "Modern 2-Bedroom in Kimironko was viewed 5 times", time: "2 hours ago", color: "text-blue-500" },
                    { icon: MessageCircle, text: "New inquiry about Cozy Studio Near Kacyiru", time: "3 hours ago", color: "text-emerald-500" },
                    { icon: Calendar, text: "Viewing scheduled for Saturday at 2pm", time: "5 hours ago", color: "text-amber-500" },
                    { icon: CheckCircle2, text: "Property verification completed", time: "1 day ago", color: "text-green-500" },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <Icon className={`h-4 w-4 ${item.color} mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Upcoming Viewings</h3>
                <div className="space-y-4">
                  {[
                    { name: "Alice Mukamana", property: "Cozy Studio Near Kacyiru", date: "Sat, July 18", time: "2:00 PM", status: "confirmed" },
                    { name: "Grace Uwimana", property: "Spacious 4-Bedroom in Remera", date: "Mon, July 20", time: "10:00 AM", status: "pending" },
                    { name: "Patrick Niyonzima", property: "Modern 2-Bedroom in Kimironko", date: "Wed, July 22", time: "3:30 PM", status: "confirmed" },
                  ].map((viewing, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{viewing.name}</p>
                        <p className="text-xs text-muted-foreground">{viewing.property}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{viewing.date} at {viewing.time}</p>
                      </div>
                      <Badge variant={viewing.status === "confirmed" ? "success" : "warning"}>
                        {viewing.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_PROPERTIES.slice(0, 4).map((property, index) => (
                <div key={property.id} className="relative group">
                  <PropertyCard {...property} index={index} />
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "viewings" && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Viewing Requests</h3>
            <div className="space-y-3">
              {[
                { name: "Alice Mukamana", property: "Cozy Studio Near Kacyiru", date: "Sat, July 18", time: "2:00 PM", status: "confirmed", message: "Looking forward to seeing the studio!" },
                { name: "Grace Uwimana", property: "Spacious 4-Bedroom in Remera", date: "Mon, July 20", time: "10:00 AM", status: "pending", message: "Is parking available?" },
                { name: "Patrick Niyonzima", property: "Modern 2-Bedroom in Kimironko", date: "Wed, July 22", time: "3:30 PM", status: "confirmed", message: "I'll bring the deposit." },
              ].map((viewing, i) => (
                <div key={i} className="p-4 rounded-xl border">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">{viewing.name}</p>
                      <p className="text-xs text-muted-foreground">{viewing.property}</p>
                      <p className="text-xs text-muted-foreground mt-1">{viewing.date} at {viewing.time}</p>
                      {viewing.message && (
                        <p className="text-xs text-muted-foreground mt-2 italic">&ldquo;{viewing.message}&rdquo;</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {viewing.status === "pending" && (
                        <>
                          <Button size="sm" variant="default" className="h-8">Accept</Button>
                          <Button size="sm" variant="outline" className="h-8">Decline</Button>
                        </>
                      )}
                      <Badge variant={viewing.status === "confirmed" ? "success" : "warning"}>
                        {viewing.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "analytics" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Views Overview</h3>
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                Chart visualization would go here (using recharts)
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Inquiry Sources</h3>
              <div className="space-y-3">
                {[
                  { source: "Search", count: 45, color: "bg-emerald-500" },
                  { source: "AI Search", count: 28, color: "bg-amber-500" },
                  { source: "Direct Link", count: 15, color: "bg-blue-500" },
                  { source: "Social Media", count: 12, color: "bg-violet-500" },
                ].map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.source}</span>
                      <span className="text-muted-foreground">{item.count}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.count}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
