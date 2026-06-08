"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

function ThemeSync() {
    const { setTheme, theme } = useTheme()
    const user = useQuery(api.users.getCurrentUser)

    React.useEffect(() => {
        if (user?.theme && user.theme !== theme) {
            setTheme(user.theme)
        }
    }, [user?.theme, setTheme, theme])

    return null
}

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <ThemeSync />
            {children}
        </NextThemesProvider>
    )
}
