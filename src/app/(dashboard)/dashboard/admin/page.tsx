"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/utils"
import { FEATURED_PROPERTIES } from "@/lib/constants"
import {
  BarChart3,
  Users,
  Building2,
  Shield,
  Flag,
  CheckCircle2,
  XCircle,
  Search,
  TrendingUp,
  DollarSign,
  Bell,
  Settings,
  FileText,
  MessageCircle,
  Activity,
  MoreHorizontal,
  Ban,
  Trash2,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "properties", label: "Properties", icon: Building2 },
    { id: "verification", label: "Verification", icon: Shield },
    { id: "reports", label: "Reports", icon: Flag },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ]

  const stats = [
    { label: "Total Users", value: "3,847", icon: Users, change: "+128 this week", color: "from-blue-500 to-indigo-500" },
    { label: "Listings", value: "2,593", icon: Building2, change: "+45 this week", color: "from-emerald-500 to-teal-500" },
    { label: "Pending Verification", value: "23", icon: Shield, change: "5 urgent", color: "from-amber-500 to-orange-500" },
    { label: "Reports", value: "12", icon: Flag, change: "3 new today", color: "from-rose-500 to-pink-500" },
    { label: "Revenue", value: "RWF 1.2M", icon: DollarSign, change: "+18% vs last month", color: "from-violet-500 to-purple-500" },
    { label: "Active Now", value: "47", icon: Activity, change: "12 landlords", color: "from-cyan-500 to-blue-500" },
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
              <BarChart3 className="h-7 w-7 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, properties, and platform operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                <h3 className="font-semibold mb-4">Pending Verifications</h3>
                <div className="space-y-3">
                  {[
                    { name: "Jean-Pierre Habimana", type: "Landlord", property: "Modern 2-Bedroom in Kimironko", time: "2 hours ago" },
                    { name: "Alice Mukamana", type: "Identity", property: "", time: "5 hours ago" },
                    { name: "Patrick Niyonzima", type: "Property", property: "Luxury Villa in Nyarutarama", time: "1 day ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {item.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.type} Verification</p>
                          {item.property && <p className="text-xs text-muted-foreground">{item.property}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="h-8 w-8 p-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Reports</h3>
                <div className="space-y-3">
                  {[
                    { reporter: "Grace Uwimana", type: "Fake Listing", property: "Studio in Kacyiru", status: "pending" },
                    { reporter: "Patrick Niyonzima", type: "Spam", property: "House in Remera", status: "resolved" },
                    { reporter: "Alice Mukamana", type: "Wrong Info", property: "Villa in Nyarutarama", status: "investigating" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{item.type}</p>
                        <p className="text-xs text-muted-foreground">{item.property} &middot; by {item.reporter}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "resolved" ? "success" :
                          item.status === "investigating" ? "warning" : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">All Users</h3>
              <Input placeholder="Search users..." className="max-w-xs" icon={<Search className="h-4 w-4" />} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">User</th>
                    <th className="pb-3 font-medium text-muted-foreground">Role</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Jean-Pierre Habimana", email: "jp@example.com", role: "Landlord", status: "verified", joined: "Jan 2026" },
                    { name: "Alice Mukamana", email: "alice@example.com", role: "Tenant", status: "verified", joined: "Feb 2026" },
                    { name: "Patrick Niyonzima", email: "patrick@example.com", role: "Landlord", status: "pending", joined: "Mar 2026" },
                    { name: "Grace Uwimana", email: "grace@example.com", role: "Tenant", status: "verified", joined: "Mar 2026" },
                  ].map((user, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><Badge variant="secondary">{user.role}</Badge></td>
                      <td className="py-3">
                        <Badge variant={user.status === "verified" ? "success" : "warning"}>{user.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{user.joined}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Ban className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "properties" && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Property Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Property</th>
                    <th className="pb-3 font-medium text-muted-foreground">Landlord</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Views</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURED_PROPERTIES.slice(0, 4).map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-sm">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm">Landlord Name</td>
                      <td className="py-3">
                        <Badge variant={p.isAvailable ? "success" : "secondary"}>
                          {p.isAvailable ? "Active" : "Rented"}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{100 + i * 87}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><CheckCircle2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Ban className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
