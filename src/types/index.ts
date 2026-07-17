export type UserRole = "tenant" | "landlord" | "admin"

export type User = {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  avatar?: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export type PropertyType = "apartment" | "house" | "villa" | "studio" | "shared" | "commercial"

export type PropertyStatus = "available" | "rented" | "unavailable"

export type Property = {
  id: string
  title: string
  description: string
  price: number
  type: PropertyType
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  area: number
  furnished: boolean
  petsAllowed: boolean
  familyFriendly: boolean
  studentFriendly: boolean
  district: string
  sector: string
  village?: string
  street?: string
  latitude: number
  longitude: number
  images: string[]
  video?: string
  virtualTour?: string
  amenities: string[]
  availableFrom: Date
  views: number
  featured: boolean
  verified: boolean
  aiScore?: number
  aiEstimatedPrice?: number
  landlordId: string
  landlord?: User
  createdAt: Date
  updatedAt: Date
}

export type Review = {
  id: string
  rating: number
  content: string
  userId: string
  user?: User
  propertyId: string
  createdAt: Date
}

export type Booking = {
  id: string
  propertyId: string
  tenantId: string
  date: Date
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  message?: string
  createdAt: Date
}

export type Message = {
  id: string
  conversationId: string
  senderId: string
  content: string
  read: boolean
  createdAt: Date
}

export type Conversation = {
  id: string
  participants: string[]
  propertyId?: string
  lastMessage?: Message
  updatedAt: Date
  createdAt: Date
}

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "message" | "alert" | "system"
  read: boolean
  link?: string
  createdAt: Date
}

export type SearchFilters = {
  query?: string
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  district?: string
  sector?: string
  furnished?: boolean
  petsAllowed?: boolean
  familyFriendly?: boolean
  studentFriendly?: boolean
  amenities?: string[]
  sort?: string
  page?: number
  limit?: number
}

export type SavedSearch = {
  id: string
  userId: string
  name: string
  filters: SearchFilters
  notify: boolean
  createdAt: Date
}

export type Favorite = {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}
