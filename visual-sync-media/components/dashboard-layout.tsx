"use client"

import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search, Moon, Sun, Monitor, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchCommand } from "@/components/search-command"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, role, loading, logout } = useAuth()
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Only redirect to login if Clerk confirms NO user is signed in
        if (isClerkLoaded && !clerkUser) {
            window.location.href = "/login"
            return
        }

        // Role-based redirect: send non-admin users to their dashboard
        // This is a client-side fallback for when middleware can't check role
        if (user && role) {
            if (role === "client" && !pathname.startsWith("/client")) {
                window.location.href = "/client/dashboard"
            } else if (role === "editor" && !pathname.startsWith("/editor")) {
                window.location.href = "/editor/dashboard"
            }
        }
    }, [isClerkLoaded, clerkUser, user, role, pathname])

    // Show spinner while Clerk is loading OR while waiting for Convex user
    if (!isClerkLoaded || loading || !user) {
        // If Clerk says no user, don't show spinner — the redirect will handle it
        if (isClerkLoaded && !clerkUser) return null

        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground animate-pulse">
                        {!isClerkLoaded ? "Loading..." : loading ? "Loading your dashboard..." : "Setting up your account..."}
                    </p>
                </div>
            </div>
        )
    }

    // If user is loaded but not admin, show redirect spinner
    if (role && role !== "admin") {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground animate-pulse">Redirecting to your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1 w-full flex flex-col">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="hidden md:flex items-center gap-6 px-4">
                            {/* Navigation links removed for cleaner dashboard design */}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block w-64">
                            <SearchCommand />
                        </div>
                        <div className="flex items-center gap-3 mr-2">
                            <ModeToggle />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 ml-2 border cursor-pointer hover:opacity-80 transition-opacity">
                                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                        <AvatarFallback>{user.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {role}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings/account")}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6 bg-background/95">
                    {children}
                </main>
            </SidebarInset>
        </div>
    )
}
