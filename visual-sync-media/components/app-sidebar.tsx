"use client"

import * as React from "react"
import Link from "next/link"
import {
    AudioWaveform,
    BadgeCheck,
    Bell,
    BookOpen,
    Bot,
    ChevronRight,
    ChevronsUpDown,
    Command,
    CreditCard,
    Frame,
    GalleryVerticalEnd,
    LogOut,
    Map,
    MoreHorizontal,
    PieChart,
    Plus,
    Settings2,
    Sparkles,
    SquareTerminal,
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    Clock,
    CheckCircle2,
    ArrowRight,
    MessageSquare,
    Box,
    Loader2,
    User,
    Users,
    Lock,
    FileText,
    AlertTriangle,
    Settings,
    HelpCircle,
    ShieldAlert
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@clerk/nextjs"
import { getInitials } from "@/lib/utils"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

// Type definitions for menu items
interface SubMenuItem {
    title: string
    url: string
}

interface MenuItem {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    badge?: string
    items?: SubMenuItem[]
}

interface NavGroup {
    title: string
    items: MenuItem[]
}

interface SidebarData {
    user: {
        name: string
        email: string
        avatar: string
    }
    navMain: NavGroup[]
}

// Menu items for Admin
const adminNav: NavGroup[] = [
    {
        title: "General",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                isActive: true,
            },
            {
                title: "Incoming Requests",
                url: "/admin/requests",
                icon: Box,
                badge: "2",
            },
            {
                title: "Tasks",
                url: "/dashboard/tasks",
                icon: CheckSquare,
            },
            {
                title: "Services",
                url: "/dashboard/services",
                icon: Box,
            },
            {
                title: "Chats",
                url: "/dashboard/chats",
                icon: MessageSquare,
                badge: "3",
            },
            {
                title: "Users",
                url: "/dashboard/users",
                icon: Users,
            },
            {
                title: "Secured by Clerk",
                url: "#",
                icon: Lock,
                items: [
                    { title: "Settings", url: "#" },
                    { title: "Profile", url: "#" },
                ],
            },
        ],
    },
    {
        title: "Pages",
        items: [
            {
                title: "Auth",
                url: "#",
                icon: ShieldAlert,
                items: [
                    { title: "Login", url: "#" },
                    { title: "Register", url: "#" },
                ],
            },
            {
                title: "Errors",
                url: "#",
                icon: AlertTriangle,
                items: [
                    { title: "404", url: "#" },
                    { title: "500", url: "#" },
                ],
            },
        ],
    },
    {
        title: "Other",
        items: [
            {
                title: "Settings",
                url: "#",
                icon: Settings,
                items: [
                    { title: "General", url: "#" },
                    { title: "Security", url: "#" },
                ],
            },
            {
                title: "Help Center",
                url: "#",
                icon: HelpCircle,
            },
        ],
    },
]

// Menu items for Client
const clientNav: NavGroup[] = [
    {
        title: "Navigation",
        items: [
            {
                title: "My Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                isActive: true,
            },
            {
                title: "Orders",
                url: "/client/orders",
                icon: Box,
                badge: "2",
            },
        ],
    },
    {
        title: "Other",
        items: [
            {
                title: "Account Settings",
                url: "/client/account",
                icon: Settings,
            },
            {
                title: "Help & Support",
                url: "#",
                icon: HelpCircle,
            },
        ],
    },
]

// Menu items for Editor
const editorNav: NavGroup[] = [
    {
        title: "Content",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                isActive: true,
            },
            {
                title: "My Projects",
                url: "/editor/projects",
                icon: CheckSquare,
            },
            {
                title: "Articles",
                url: "#",
                icon: FileText,
            },
            {
                title: "Media Library",
                url: "#",
                icon: Box,
            },
        ],
    },
    {
        title: "Pages",
        items: [
            {
                title: "Manage Site",
                url: "#",
                icon: Settings2,
            },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, role, logout, loading } = useAuth()
    const { user: clerkUser } = useUser()
    const pathname = usePathname()
    const { isMobile, setOpenMobile } = useSidebar()

    const closeMobileOnClick = () => {
        if (isMobile) setOpenMobile(false)
    }

    const navMain = React.useMemo(() => {
        // Don't show any sidebar during loading or if role is missing
        if (loading || !role) return []
        switch (role) {
            case "client": return clientNav
            case "editor": return editorNav
            case "admin": return adminNav
            default: return []
        }
    }, [role, loading])

    const userName = user?.name || clerkUser?.fullName || "User"
    const userEmail = user?.email || clerkUser?.primaryEmailAddress?.emailAddress || ""
    const userAvatar = clerkUser?.imageUrl || ""

    return (
        <Sidebar variant="sidebar" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {role === 'admin' ? 'Shadcn Admin' : role === 'client' ? 'Client Portal' : role === 'editor' ? 'Editor Dashboard' : 'Universal Media'}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">Visual Sync Media</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {navMain.map((group) => (
                    <div key={group.title} className="mb-6 px-2">
                        <div className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {group.title}
                        </div>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = pathname === item.url || (item.items?.some(sub => pathname === sub.url))
                                return (
                                    <React.Fragment key={item.title}>
                                        {item.items ? (
                                            <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton
                                                            tooltip={item.title}
                                                            isActive={isActive}
                                                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                                                        >
                                                            {item.icon && <item.icon className="h-4 w-4" />}
                                                            <span className="font-medium">{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.items?.map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                                        <Link href={subItem.url} onClick={closeMobileOnClick}>
                                                                            <span className={pathname === subItem.url ? "font-semibold" : ""}>{subItem.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === item.url}
                                                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                                                >
                                                    <Link href={item.url} onClick={closeMobileOnClick}>
                                                        {item.icon && <item.icon className="h-4 w-4" />}
                                                        <span className="font-medium">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={userAvatar} alt={userName} />
                                        <AvatarFallback className="rounded-lg">{getInitials(userName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{userName}</span>
                                        <span className="truncate text-xs">{userEmail}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side={isMobile ? "top" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={userAvatar} alt={userName} />
                                            <AvatarFallback className="rounded-lg">{getInitials(userName)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{userName}</span>
                                            <span className="truncate text-xs">{userEmail}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`${role === 'admin' ? '/dashboard' : `/${role}`}/account`}>
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            Account
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell className="mr-2 h-4 w-4" />
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
