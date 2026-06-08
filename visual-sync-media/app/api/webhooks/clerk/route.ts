import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { fetchMutation, fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
    if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET is not set")
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: any

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        })
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Get the event type
    const eventType = evt.type

    // Handle user.created event
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, public_metadata } = evt.data

        const email = email_addresses?.[0]?.email_address
        const name = `${first_name || ""} ${last_name || ""}`.trim() || "User"
        
        // Get role from public_metadata (set by admin when creating editor, or default to client)
        const role = public_metadata?.role || "client"

        try {
            // Check if user already exists (for pre-created editors)
            const existingUser = await fetchQuery(
                api.users.getUserByEmail,
                { email },
                { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
            )

            if (existingUser) {
                // Update the existing user with Clerk ID
                await fetchMutation(
                    api.users.updateUserClerkId,
                    { 
                        userId: existingUser._id, 
                        clerkId: id 
                    },
                    { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
                )
                console.log("Updated existing user with Clerk ID:", id)
            } else {
                // Create new user
                await fetchMutation(
                    api.users.createUser,
                    { 
                        clerkId: id, 
                        email, 
                        name, 
                        role 
                    },
                    { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
                )
                console.log("Created new user in Convex:", id)
            }

            return NextResponse.json({ success: true })
        } catch (error) {
            console.error("Error creating/updating user in Convex:", error)
            return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
        }
    }

    // Handle user.updated event
    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data
        
        const email = email_addresses?.[0]?.email_address
        const name = `${first_name || ""} ${last_name || ""}`.trim() || "User"

        try {
            // Get user by clerkId
            const user = await fetchQuery(
                api.users.getUserByClerkId,
                { clerkId: id },
                { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
            )

            if (user) {
                // Update user info
                await fetchMutation(
                    api.users.updateUser,
                    { 
                        userId: user._id, 
                        name, 
                        email 
                    },
                    { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
                )
                console.log("Updated user in Convex:", id)
            }

            return NextResponse.json({ success: true })
        } catch (error) {
            console.error("Error updating user in Convex:", error)
            return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
        }
    }

    // Handle user.deleted event
    if (eventType === "user.deleted") {
        const { id } = evt.data

        try {
            // Get user by clerkId
            const user = await fetchQuery(
                api.users.getUserByClerkId,
                { clerkId: id },
                { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
            )

            if (user) {
                // Soft delete by deactivating
                await fetchMutation(
                    api.users.deactivateUser,
                    { userId: user._id },
                    { url: process.env.NEXT_PUBLIC_CONVEX_URL! }
                )
                console.log("Deactivated user in Convex:", id)
            }

            return NextResponse.json({ success: true })
        } catch (error) {
            console.error("Error deactivating user in Convex:", error)
            return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 })
        }
    }

    return NextResponse.json({ success: true })
}
