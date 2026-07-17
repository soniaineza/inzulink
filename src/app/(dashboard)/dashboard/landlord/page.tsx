"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { formatPrice, formatRelativeTime } from "@/lib/utils"
import { LOCATIONS, PROPERTY_TYPES, AMENITIES } from "@/lib/constants"
import {
  Plus, Building2, Eye, Heart, MessageCircle, Calendar,
  TrendingUp, BarChart3, Search, Loader2, X, Check,
  Edit, Trash2, ChevronRight, ChevronLeft, Home, MapPin,
  Bed, Bath, Move, DollarSign, Upload, Image as ImageIcon,
  Wifi, Car, Shield, Zap, Droplets, Clock, AlertCircle,
  CheckCircle2, XCircle,
} from "lucide-react"

interface PropertyItem {
  id: string
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  image: string
  images: string[]
  description: string
  district: string
  sector: string
  village?: string
  street?: string
  furnished: boolean
  amenities: string[]
  isVerified: boolean
  approvalStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string
  views: number
  createdAt: string
}

export default function LandlordDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", price: "", type: "apartment",
    bedrooms: "1", bathrooms: "1", area: "50",
    district: "", sector: "", village: "", street: "",
    furnished: false, petsAllowed: false, familyFriendly: true, studentFriendly: false,
    amenities: [] as string[], images: [] as string[],
    availableFrom: new Date().toISOString().split("T")[0],
  })

  const fetchProperties = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`/api/properties?landlordId=${user.id}`)
      const data = await res.json()
      setProperties(data.data || [])
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchProperties()
  }, [user])

  // Stats
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0)
  const approvedCount = properties.filter((p) => p.approvalStatus === "approved").length
  const pendingCount = properties.filter((p) => p.approvalStatus === "pending").length

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "properties", label: "My Properties", icon: Building2 },
    { id: "pending", label: `Pending (${pendingCount})`, icon: Clock },
  ]

  // Form handlers
  const openAddForm = () => {
    setEditingProperty(null)
    setForm({
      title: "", description: "", price: "", type: "apartment",
      bedrooms: "1", bathrooms: "1", area: "50",
      district: "", sector: "", village: "", street: "",
      furnished: false, petsAllowed: false, familyFriendly: true, studentFriendly: false,
      amenities: [], images: [],
      availableFrom: new Date().toISOString().split("T")[0],
    })
    setFormStep(0)
    setFormError("")
    setImageUrl("")
    setShowForm(true)
  }

  const openEditForm = (property: PropertyItem) => {
    setEditingProperty(property)
    setForm({
      title: property.title,
      description: property.description || "",
      price: property.price.toString(),
      type: property.type.toLowerCase(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      district: property.district,
      sector: property.sector,
      village: property.village || "",
      street: property.street || "",
      furnished: property.furnished,
      petsAllowed: false,
      familyFriendly: true,
      studentFriendly: false,
      amenities: property.amenities || [],
      images: property.images || (property.image ? [property.image] : []),
      availableFrom: new Date().toISOString().split("T")[0],
    })
    setFormStep(0)
    setFormError("")
    setImageUrl("")
    setShowForm(true)
  }

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError("")
  }

  const toggleFormAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const addFormImage = () => {
    if (imageUrl.trim() && !form.images.includes(imageUrl.trim())) {
      setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }))
      setImageUrl("")
    }
  }

  const removeFormImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const validateForm = (): boolean => {
    setFormError("")
    if (!form.title.trim()) { setFormError("Enter a property title"); return false }
    if (!form.description.trim()) { setFormError("Enter a description"); return false }
    if (!form.price || parseInt(form.price) <= 0) { setFormError("Enter a valid price"); return false }
    if (!form.bedrooms || parseInt(form.bedrooms) <= 0) { setFormError("Enter number of bedrooms"); return false }
    if (!form.bathrooms || parseInt(form.bathrooms) <= 0) { setFormError("Enter number of bathrooms"); return false }
    if (!form.area || parseInt(form.area) <= 0) { setFormError("Enter the area"); return false }
    if (!form.district) { setFormError("Select a district"); return false }
    if (!form.sector) { setFormError("Select a sector"); return false }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setSubmitting(true)

    try {
      const isEdit = !!editingProperty
      const url = isEdit ? `/api/properties/${editingProperty!.id}` : "/api/properties"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
          area: parseInt(form.area),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Something went wrong")
        return
      }

      toast.success(isEdit
        ? "Property updated! It needs re-approval by an admin."
        : "Property submitted for admin review!"
      )
      setShowForm(false)
      fetchProperties()
    } catch {
      setFormError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Property deleted")
        setConfirmDelete(null)
        fetchProperties()
      } else {
        toast.error("Failed to delete property")
      }
    } catch {
      toast.error("Network error")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>
      default:
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
    }
  }

  // Form modal
  const FormModal = () => {
    const steps = [
      { id: "basics", label: "Basic Info", icon: Home },
      { id: "details", label: "Details", icon: Bed },
      { id: "location", label: "Location", icon: MapPin },
      { id: "photos", label: "Photos", icon: ImageIcon },
    ]

    return (
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="fixed inset-4 sm:inset-auto sm:top-10 sm:bottom-10 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50 overflow-hidden rounded-2xl border bg-card shadow-2xl flex flex-col">
              
              <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
                <div>
                  <h2 className="text-xl font-bold">{editingProperty ? "Edit Property" : "List Your Property"}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {editingProperty ? "Update your property details" : "Fill in the details to list your property"}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)} className="h-9 w-9 rounded-xl hover:bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-0.5 px-4 sm:px-6 pt-4 pb-2 shrink-0">
                {steps.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={s.id} className="flex items-center gap-0.5 flex-1">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        i <= formStep ? "bg-primary/10 text-primary" : "text-muted-foreground/50"
                      }`}>
                        <Icon className="h-3 w-3" />
                        <span className="hidden sm:inline">{s.label}</span>
                      </div>
                      {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 ${i < formStep ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  )
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {formError && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{formError}</div>
                )}

                {formStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Property Title *</label>
                      <Input placeholder="e.g. Modern 2-Bedroom in Kimironko" value={form.title} onChange={(e) => updateForm("title", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Description *</label>
                      <textarea className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                        placeholder="Describe your property - nearby amenities, what makes it special..." value={form.description}
                        onChange={(e) => updateForm("description", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Monthly Rent (RWF) *</label>
                      <Input type="number" placeholder="e.g. 350000" value={form.price} onChange={(e) => updateForm("price", e.target.value)}
                        icon={<DollarSign className="h-4 w-4" />} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Property Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {PROPERTY_TYPES.map((type) => (
                          <button key={type.value} type="button" onClick={() => updateForm("type", type.value)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                              form.type === type.value ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-muted-foreground/30"
                            }`}>{type.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Bedrooms *</label>
                        <Input type="number" value={form.bedrooms} onChange={(e) => updateForm("bedrooms", e.target.value)} icon={<Bed className="h-4 w-4" />} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Bathrooms *</label>
                        <Input type="number" value={form.bathrooms} onChange={(e) => updateForm("bathrooms", e.target.value)} icon={<Bath className="h-4 w-4" />} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Area (m²) *</label>
                        <Input type="number" value={form.area} onChange={(e) => updateForm("area", e.target.value)} icon={<Move className="h-4 w-4" />} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Features</label>
                      <div className="flex flex-wrap gap-2">
                        {["Furnished", "Pets Allowed", "Family Friendly", "Student Friendly"].map((label) => {
                          const key = label.toLowerCase().replace(/\s+/g, "") as keyof typeof form
                          return (
                            <button key={label} type="button" onClick={() => updateForm(key, !(form as any)[key])}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${
                                (form as any)[key] ? "bg-primary/5 text-primary border-primary/30" : "bg-card hover:border-muted-foreground/30"
                              }`}>
                              <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${(form as any)[key] ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                                {(form as any)[key] && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {AMENITIES.slice(0, 10).map((amenity) => (
                          <button key={amenity.value} type="button" onClick={() => toggleFormAmenity(amenity.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                              form.amenities.includes(amenity.value) ? "bg-primary/10 text-primary border-primary/30" : "bg-card hover:border-muted-foreground/30"
                            }`}>
                            {amenity.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">District *</label>
                      <select value={form.district} onChange={(e) => { updateForm("district", e.target.value); updateForm("sector", "") }}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm">
                        <option value="">Select a district</option>
                        {LOCATIONS.map((loc) => (<option key={loc.district} value={loc.district}>{loc.district}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Sector *</label>
                      <select value={form.sector} onChange={(e) => updateForm("sector", e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm" disabled={!form.district}>
                        <option value="">Select a sector</option>
                        {LOCATIONS.find((l) => l.district === form.district)?.sectors.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Village</label>
                        <Input placeholder="e.g. Rugando" value={form.village} onChange={(e) => updateForm("village", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Street</label>
                        <Input placeholder="e.g. KG 220 St" value={form.street} onChange={(e) => updateForm("street", e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Photos</label>
                      <p className="text-xs text-muted-foreground mb-3">Properties with photos get more views.</p>
                      <div className="flex gap-2 mb-3">
                        <Input placeholder="Paste image URL..." value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFormImage())} />
                        <Button type="button" variant="outline" onClick={addFormImage} disabled={!imageUrl.trim()}>
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {form.images.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {form.images.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted">
                              <img src={url} alt="" className="h-full w-full object-cover" />
                              <button type="button" onClick={() => removeFormImage(idx)}
                                className="absolute top-1 right-1 h-6 w-6 rounded-lg bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-xl border-2 border-dashed text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No photos added yet</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        <strong>After submitting:</strong> An admin will review your property before it appears in search results.
                        You'll be notified once it's approved.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 sm:p-6 border-t shrink-0 bg-muted/30">
                <Button type="button" variant="ghost" onClick={formStep === 0 ? () => setShowForm(false) : () => setFormStep((s) => s - 1)} className="gap-1.5">
                  <ChevronLeft className="h-4 w-4" />{formStep === 0 ? "Cancel" : "Back"}
                </Button>
                {formStep < steps.length - 1 ? (
                  <Button type="button" onClick={() => setFormStep((s) => s + 1)} className="gap-1.5">
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} loading={submitting} className="gap-1.5">
                    {editingProperty ? "Update Property" : "Submit for Review"}
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

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
        <FormModal />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Building2 className="h-7 w-7 text-primary" />
              My Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your properties. Listings need admin approval before going live.
            </p>
          </div>
          <Button onClick={openAddForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </motion.div>

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

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-3">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{properties.length}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Total Properties</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount} approved</p>
              </Card>
              <Card className="p-5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg mb-3">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{totalViews}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Total Views</p>
              </Card>
              <Card className="p-5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg mb-3">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Pending Approval</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Awaiting admin review</p>
              </Card>
              <Card className="p-5">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg mb-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold">{new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", minimumFractionDigits: 0 }).format(properties.reduce((sum, p) => sum + p.price, 0))}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Total Monthly Value</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              {properties.length > 0 ? (
                <div className="space-y-3">
                  {properties.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-muted">
                        {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(p.createdAt)}</span>
                          {getStatusBadge(p.approvalStatus)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No properties yet. Click "Add Property" to list your first one.
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-4">
            {properties.length === 0 ? (
              <Card className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No properties listed yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start by adding your first property.</p>
                <Button onClick={openAddForm} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Your First Property
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {properties.map((property) => (
                  <Card key={property.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-32 rounded-xl overflow-hidden shrink-0 bg-muted">
                        {property.image ? (
                          <img src={property.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                            <Building2 className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{property.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {property.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {getStatusBadge(property.approvalStatus)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span>{formatPrice(property.price)}/mo</span>
                          <span>•</span>
                          <span>{property.bedrooms} bed</span>
                          <span>•</span>
                          <span>{property.bathrooms} bath</span>
                          <span>•</span>
                          <span>{property.area} m²</span>
                        </div>
                        {property.approvalStatus === "rejected" && property.rejectionReason && (
                          <div className="mt-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-destructive">
                            Reason: {property.rejectionReason}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => openEditForm(property)} className="h-8 gap-1.5">
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </Button>
                          {confirmDelete === property.id ? (
                            <div className="flex gap-1">
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(property.id)} className="h-8 text-xs">Confirm Delete</Button>
                              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)} className="h-8 text-xs">Cancel</Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(property.id)} className="h-8 gap-1.5 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </Button>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">{property.views} views</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingCount === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No properties pending approval.</p>
              </Card>
            ) : (
              properties.filter((p) => p.approvalStatus === "pending").map((property) => (
                <Card key={property.id} className="p-4 border-amber-200 dark:border-amber-800">
                  <div className="flex gap-4">
                    <div className="h-20 w-28 rounded-xl overflow-hidden shrink-0 bg-muted">
                      {property.image && <img src={property.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{property.title}</h3>
                        <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Pending Review</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <p className="text-sm font-medium text-primary mt-1">{formatPrice(property.price)}/mo</p>
                      <p className="text-xs text-muted-foreground mt-1">Submitted {formatRelativeTime(property.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
