import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
    "/",
    "/about",
    "/contact",
    "/login",
    "/signup",
    "/api/webhooks/clerk",
])

const isAdminRoute = createRouteMatcher([
    "/admin(.*)",
    "/dashboard(.*)",
])

const isClientRoute = createRouteMatcher([
    "/client(.*)",
])

const isEditorRoute = createRouteMatcher([
    "/editor(.*)",
])

// Helper to get the correct dashboard URL for a role
function getDashboardUrl(role: string | undefined): string {
    switch (role) {
        case "admin": return "/dashboard"
        case "client": return "/client/dashboard"
        case "editor": return "/editor/dashboard"
        default: return "/dashboard" // fallback — DashboardLayout will handle role check
    }
}

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth()
    const { pathname } = req.nextUrl
    const role = sessionClaims?.role as string | undefined

    // --- Signed-in users on public pages: redirect to their dashboard ---
    if (userId && (pathname === "/login" || pathname === "/signup")) {
        const dashboardUrl = getDashboardUrl(role)
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }

    // --- Public routes for non-authenticated users ---
    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    // --- Redirect unauthenticated users to login ---
    if (!userId) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // --- Role-based access control (only if role is known in claims) ---
    if (role) {
        if (isAdminRoute(req) && role !== "admin") {
            return NextResponse.redirect(new URL(getDashboardUrl(role), req.url))
        }

        if (isEditorRoute(req) && role !== "editor" && role !== "admin") {
            return NextResponse.redirect(new URL(getDashboardUrl(role), req.url))
        }

        if (isClientRoute(req) && role !== "client" && role !== "admin") {
            return NextResponse.redirect(new URL(getDashboardUrl(role), req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}
