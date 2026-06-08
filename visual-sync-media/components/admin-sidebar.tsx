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
    Users,
    FolderKanban,
    Settings,
    LogOut,
    Shield,
    Inbox
} from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Incoming Requests", url: "/admin/requests", icon: Inbox },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Projects", url: "/admin/projects", icon: FolderKanban },
    { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { isMobile, setOpenMobile } = useSidebar()

    const closeMobileOnClick = () => {
        if (isMobile) setOpenMobile(false)
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Admin Portal</span>
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

            <SidebarFooter className="border-t border-sidebar-border p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SignOutButton redirectUrl="/login">
                            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
                                <LogOut className="h-4 w-4" />
                                <span>Log out</span>
                            </SidebarMenuButton>
                        </SignOutButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
