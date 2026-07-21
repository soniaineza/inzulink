"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { formatRelativeTime, formatPrice } from "@/lib/utils"
import {
  BarChart3, Users, Building2, Shield, Flag, CheckCircle2,
  XCircle, Search, TrendingUp, DollarSign, Bell, Settings,
  Activity, MoreHorizontal, Loader2, Clock, Home, MapPin,
  Eye, Ban, Trash2, MessageCircle, AlertTriangle, Check,
  X, Calendar, ChevronRight,
} from "lucide-react"

interface PendingProperty {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  image: string
  images: string[]
  district: string
  sector: string
  furnished: boolean
  amenities: string[]
  landlord: string
  landlordId: string
  landlordEmail?: string
  views: number
  isVerified: boolean
  approvalStatus: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([])
  const [allProperties, setAllProperties] = useState<PendingProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState<PendingProperty | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch pending (unverified) properties
      const pendingRes = await fetch("/api/properties?status=pending&limit=50")
      const pendingData = await pendingRes.json()
      setPendingProperties(pendingData.data || [])

      // Fetch all properties
      const allRes = await fetch("/api/properties?limit=50")
      const allData = await allRes.json()
      setAllProperties(allData.data || [])
    } catch {
      setPendingProperties([])
      setAllProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (id: string) => {
    setReviewingId(id)
    try {
      const res = await fetch(`/api/properties/${id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Property approved! It's now visible to tenants.")
        setReviewModal(null)
        fetchData()
      } else {
        toast.error(data.error || "Failed to approve")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setReviewingId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    setReviewingId(id)
    try {
      const res = await fetch(`/api/properties/${id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: rejectionReason }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Property rejected. Landlord has been notified.")
        setReviewModal(null)
        setRejectionReason("")
        fetchData()
      } else {
        toast.error(data.error || "Failed to reject")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setReviewingId(null)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "pending", label: `Pending (${pendingProperties.length})`, icon: Clock },
    { id: "all", label: "All Properties", icon: Building2 },
  ]

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Review Modal */}
        {reviewModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => { setReviewModal(null); setRejectionReason("") }} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed inset-4 sm:inset-auto sm:top-20 sm:bottom-20 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 overflow-hidden rounded-2xl border bg-card shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold">Review Property</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Approve or reject this listing</p>
                </div>
                <button onClick={() => { setReviewModal(null); setRejectionReason("") }} className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex gap-4">
                  {reviewModal.image && (
                    <img src={reviewModal.image} alt="" className="h-32 w-48 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{reviewModal.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" /> {reviewModal.district}, {reviewModal.sector}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-2">
                      {formatPrice(reviewModal.price)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{reviewModal.bedrooms} bed</span>
                      <span>{reviewModal.bathrooms} bath</span>
                      <span>{reviewModal.area} m²</span>
                      <span>{reviewModal.furnished ? "Furnished" : "Unfurnished"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{reviewModal.description}</p>
                </div>

                {reviewModal.amenities && reviewModal.amenities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Amenities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {reviewModal.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Listed by <strong>{reviewModal.landlord}</strong></span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted {formatRelativeTime(reviewModal.createdAt)}
                  </p>
                </div>

                {/* Rejection reason input */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Rejection Reason (required if rejecting)
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Explain why the property needs changes..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-t bg-muted/30">
                <Button variant="outline" onClick={() => { setReviewModal(null); setRejectionReason("") }}>
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  {reviewingId === reviewModal.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(reviewModal.id)}
                        disabled={!rejectionReason.trim()}
                        className="gap-1.5"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(reviewModal.id)}
                        className="gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage property listings. {pendingProperties.length} pending approval.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={fetchData}>
            Refresh
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card className="p-5">
            <p className="text-2xl font-bold">{pendingProperties.length}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Pending Approval</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Awaiting your review</p>
          </Card>
          <Card className="p-5">
            <p className="text-2xl font-bold">{allProperties.length}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Approved Listings</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Live on platform</p>
          </Card>
          <Card className="p-5">
            <p className="text-2xl font-bold">{allProperties.filter(p => p.approvalStatus === "rejected").length}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Rejected</p>
            <p className="text-xs text-destructive mt-1">Properties needing changes</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card rounded-2xl p-1.5 border mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Pending Properties Tab */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingProperties.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-1">All properties reviewed!</h3>
                <p className="text-sm text-muted-foreground">No pending properties awaiting approval.</p>
              </Card>
            ) : (
              pendingProperties.map((property) => (
                <Card key={property.id} className="p-4 border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => { setReviewModal(property); setRejectionReason("") }}>
                  <div className="flex gap-4">
                    <div className="h-24 w-36 rounded-xl overflow-hidden shrink-0 bg-muted">
                      {property.image ? (
                        <img src={property.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                          <Home className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {property.district}, {property.sector}
                          </p>
                        </div>
                        <Badge variant="warning" className="shrink-0 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="font-semibold text-primary">{formatPrice(property.price)}/mo</span>
                        <span className="text-muted-foreground">{property.bedrooms} bed</span>
                        <span className="text-muted-foreground">{property.bathrooms} bath</span>
                        <span className="text-muted-foreground">{property.area} m²</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{property.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" /> {property.landlord}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(property.createdAt)}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default" onClick={(e) => { e.stopPropagation(); handleApprove(property.id) }}
                          loading={reviewingId === property.id} className="h-8 gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setReviewModal(property); setRejectionReason("") }}
                          className="h-8 gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Review & Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-between" onClick={() => setActiveTab("pending")}>
                  Review Pending Properties <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => setActiveTab("all")}>
                  View All Properties <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Pending Properties</h3>
              {pendingProperties.length > 0 ? (
                <div className="space-y-3">
                  {pendingProperties.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer"
                      onClick={() => { setReviewModal(p); setRejectionReason("") }}>
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.landlord} • {formatRelativeTime(p.createdAt)}</p>
                      </div>
                      <Badge variant="warning" className="text-[10px]">New</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No pending properties
                </div>
              )}
            </Card>
          </div>
        )}

        {/* All Properties Tab */}
        {activeTab === "all" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">All Properties ({allProperties.length})</h3>
              <Input placeholder="Search properties..." className="max-w-xs" />
            </div>
            {allProperties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No properties found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Property</th>
                      <th className="pb-3 font-medium text-muted-foreground">Landlord</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Price</th>
                      <th className="pb-3 font-medium text-muted-foreground">Views</th>
                      <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProperties.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image || "/placeholder.svg"} alt="" className="h-10 w-14 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate max-w-[200px]">{p.title}</p>
                              <p className="text-xs text-muted-foreground">{p.district}, {p.sector}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm">{p.landlord}</td>
                        <td className="py-3">
                          {p.approvalStatus === "approved" ? (
                            <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Approved</Badge>
                          ) : p.approvalStatus === "rejected" ? (
                            <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> Rejected</Badge>
                          ) : (
                            <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
                          )}
                        </td>
                        <td className="py-3 text-sm">{formatPrice(p.price)}</td>
                        <td className="py-3 text-muted-foreground">{p.views || 0}</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {p.approvalStatus === "pending" ? (
                              <>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-500"
                                  onClick={() => handleApprove(p.id)} loading={reviewingId === p.id}>
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"
                                  onClick={() => { setReviewModal(p); setRejectionReason("") }}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                onClick={() => { setReviewModal(p); setRejectionReason("") }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                              onClick={() => window.open(`/property/${p.id}`, "_blank")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}


