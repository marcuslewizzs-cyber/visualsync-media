"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    LayoutDashboard,
    ListTodo,
    Settings,
    LogOut,
    Film,
    FolderKanban
} from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
    { title: "Dashboard", url: "/editor/dashboard", icon: LayoutDashboard },
    { title: "My Projects", url: "/editor/projects", icon: FolderKanban },
    { title: "Tasks", url: "/editor/tasks", icon: ListTodo },
    { title: "Settings", url: "/editor/settings", icon: Settings },
]

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BadgeCheck, ChevronsUpDown } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function EditorSidebar() {
    const pathname = usePathname()
    const { user: clerkUser } = useUser()
    const user = useQuery(api.users.getCurrentUser)
    const { isMobile, setOpenMobile } = useSidebar()

    const closeMobileOnClick = () => {
        if (isMobile) setOpenMobile(false)
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
                <div className="flex items-center gap-2">
                    <Film className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Editor Portal</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url} onClick={closeMobileOnClick}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={clerkUser?.imageUrl} alt={user?.name} />
                                        <AvatarFallback className="rounded-lg">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.name}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={clerkUser?.imageUrl} alt={user?.name} />
                                            <AvatarFallback className="rounded-lg">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.name}</span>
                                            <span className="truncate text-xs">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/editor/account">
                                        <BadgeCheck className="mr-2 h-4 w-4" />
                                        Account
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <SignOutButton redirectUrl="/login">
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </SignOutButton>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
