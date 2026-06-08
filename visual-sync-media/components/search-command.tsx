"use client"

import * as React from "react"
import {
    Calendar as CalendarIcon,
    Mail,
    Smile as FaceIcon,
    Settings as GearIcon,
    User as PersonIcon,
    Rocket as RocketIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
    LogOut as ExitIcon,
    Monitor as DesktopIcon,
    Search,
    LayoutDashboard,
    Briefcase,
    Users,
    CreditCard,
    User,
    Check,
    ChevronsUpDown
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/use-auth"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { setTheme } = useTheme()
    const { logout } = useAuth()
    const updateTheme = useMutation(api.users.updateThemePreference)

    const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme)
        updateTheme({ theme: newTheme })
    }

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <div
                className="relative w-full md:w-64 cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    readOnly
                    className="w-full bg-background pl-8 h-9 text-sm cursor-pointer"
                />
                <div className="absolute right-2 top-2 h-5 hidden md:flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/projects"))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Projects</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/teams"))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Team</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/account"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Account</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/appearance"))}>
                            <GearIcon className="mr-2 h-4 w-4" />
                            <span>Appearance</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => handleThemeChange("light"))}>
                            <SunIcon className="mr-2 h-4 w-4" />
                            <span>Light Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => handleThemeChange("dark"))}>
                            <MoonIcon className="mr-2 h-4 w-4" />
                            <span>Dark Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => handleThemeChange("system"))}>
                            <DesktopIcon className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Account">
                        <CommandItem onSelect={() => runCommand(() => logout())}>
                            <ExitIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </CommandItem>
                    </CommandGroup>

                </CommandList>
            </CommandDialog>
        </>
    )
}
