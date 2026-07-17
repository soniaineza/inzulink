"use client"

import { createContext, useContext, useCallback, useState, useSyncExternalStore } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
  isLandlord: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("inzulink_user")
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function parseUser(stored: string | null): User | null {
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const user = parseUser(stored)
  const [loading, setLoading] = useState(!stored)

  const login = useCallback(async (email: string, _password: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const mockUser: User = {
      id: "user_1",
      email,
      name: email.split("@")[0],
      role: email.includes("landlord") ? "landlord" : email.includes("admin") ? "admin" : "tenant",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    localStorage.setItem("inzulink_user", JSON.stringify(mockUser))
    window.dispatchEvent(new Event("storage"))
    setLoading(false)
  }, [])

  const register = useCallback(async (data: Partial<User> & { password: string }) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const mockUser: User = {
      id: "user_" + Date.now(),
      email: data.email || "",
      name: data.name || "",
      role: data.role || "tenant",
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    localStorage.setItem("inzulink_user", JSON.stringify(mockUser))
    window.dispatchEvent(new Event("storage"))
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("inzulink_user")
    window.dispatchEvent(new Event("storage"))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isLandlord: user?.role === "landlord",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
