"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export type Role = "admin" | "client" | "editor"

interface AuthUser {
    id: string
    clerkId?: string
    name: string
    email: string
    role: Role
}

interface AuthContextType {
    user: AuthUser | null
    role: Role | null
    loading: boolean
    isAuthenticated: boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
    const { signOut } = useClerkAuth()
    const router = useRouter()
    const creating = useRef(false)
    
    // Fetch user from Convex database
    const convexUser = useQuery(
        api.users.getCurrentUser,
        isClerkLoaded && clerkUser ? {} : "skip"
    )

    // Mutation to create user if not exists
    const createUser = useMutation(api.users.createUser)

    const [authState, setAuthState] = useState<{
        user: AuthUser | null
        role: Role | null
        loading: boolean
        isAuthenticated: boolean
    }>({
        user: null,
        role: null,
        loading: true,
        isAuthenticated: false,
    })

    useEffect(() => {
        if (!isClerkLoaded) {
            setAuthState(prev => ({ ...prev, loading: true }))
            return
        }

        if (!clerkUser) {
            setAuthState({
                user: null,
                role: null,
                loading: false,
                isAuthenticated: false,
            })
            return
        }

        // If Convex user data is available, use it
        if (convexUser) {
            setAuthState({
                user: {
                    id: convexUser._id,
                    clerkId: convexUser.clerkId,
                    name: convexUser.name,
                    email: convexUser.email,
                    role: convexUser.role as Role,
                },
                role: convexUser.role as Role,
                loading: false,
                isAuthenticated: true,
            })
            return
        }

        // Wait for Convex query to finish loading (convexUser will be null if not found)
        if (convexUser === undefined || creating.current) {
            return
        }

        // User is authenticated with Clerk but not in Convex yet
        // Auto-create user using role from Clerk metadata (defaults to client)
        const email = clerkUser.primaryEmailAddress?.emailAddress
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User"
        
        // Extract role from Clerk public metadata
        const clerkRole = (clerkUser.publicMetadata?.role as Role) || "client"
        
        if (email) {
            creating.current = true
            createUser({
                clerkId: clerkUser.id,
                email,
                name,
                role: clerkRole,
            }).then((userId) => {
                setAuthState({
                    user: {
                        id: userId,
                        clerkId: clerkUser.id,
                        name,
                        email,
                        role: clerkRole,
                    },
                    role: clerkRole,
                    loading: false,
                    isAuthenticated: true,
                })
                creating.current = false
            }).catch((err) => {
                console.error("Failed to create user:", err)
                setAuthState({
                    user: null,
                    role: null,
                    loading: false,
                    isAuthenticated: true,
                })
                creating.current = false
            })
        } else {
            setAuthState({
                user: null,
                role: null,
                loading: false,
                isAuthenticated: true,
            })
        }
    }, [isClerkLoaded, clerkUser, convexUser, createUser])

    const logout = async () => {
        await signOut()
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ ...authState, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

// Helper hook for role-based access
export function useRequireRole(requiredRole: Role | Role[]) {
    const { role, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return

        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        if (role && !roles.includes(role)) {
            // Redirect to appropriate dashboard
            if (role === "admin") router.push("/dashboard")
            else if (role === "client") router.push("/dashboard")
            else if (role === "editor") router.push("/editor/dashboard")
        }
    }, [role, loading, isAuthenticated, requiredRole, router])

    return { role, loading }
}
