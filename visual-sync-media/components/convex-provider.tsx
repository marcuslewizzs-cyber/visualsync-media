"use client"

import { ConvexProviderWithClerk } from "convex/react-clerk"
import { useAuth } from "@clerk/nextjs"
import { ConvexReactClient } from "convex/react"
import { ReactNode, useMemo } from "react"

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL
        if (!url) {
            console.error("NEXT_PUBLIC_CONVEX_URL is not defined")
        }
        return new ConvexReactClient(url || "")
    }, [])

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    )
}
