import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Create editor (admin only) - creates user record for pre-invited editor
export const createEditor = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        specialties: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique()

        if (existing) {
            // Update to editor role if exists
            await ctx.db.patch(existing._id, {
                role: "editor",
                updatedAt: Date.now(),
            })

            // Check if editor record exists
            const existingEditor = await ctx.db
                .query("editors")
                .withIndex("by_userId", (q) => q.eq("userId", existing._id))
                .unique()

            if (!existingEditor) {
                await ctx.db.insert("editors", {
                    userId: existing._id,
                    specialties: args.specialties,
                    isActive: true,
                })
            }

            return existing._id
        }

        // Create placeholder user (will be linked when they sign up via Clerk)
        const now = Date.now()
        const userId = await ctx.db.insert("users", {
            clerkId: "pending", // Will be updated via webhook when they sign up
            email: args.email,
            name: args.name,
            role: "editor",
            createdAt: now,
            updatedAt: now,
        })

        await ctx.db.insert("editors", {
            userId,
            specialties: args.specialties,
            isActive: true,
        })

        return userId
    },
})

// Deactivate editor
export const deactivateEditor = mutation({
    args: { editorId: v.id("editors") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.editorId, {
            isActive: false,
        })
    },
})

// Update editor specialties
export const updateEditorSpecialties = mutation({
    args: {
        editorId: v.id("editors"),
        specialties: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.editorId, {
            specialties: args.specialties,
        })
    },
})

// Get all users by role (admin only)
export const getUsersByRole = query({
    args: { role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", args.role))
            .collect()
    },
})

// Check if user is admin
export const isAdmin = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return false

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        return user?.role === "admin"
    },
})

// Get Admin Dashboard Stats
export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return null

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") return null

        const allOrders = await ctx.db.query("orders").collect()
        const allProjects = await ctx.db.query("projects").collect()
        const allEditors = await ctx.db.query("editors").collect()

        // Calculate stats
        const totalRevenue = allOrders.reduce((acc, order) => acc + (order.quote?.price || 0), 0)
        const pendingApprovals = allOrders.filter(o => o.status === "quoted").length
        const awaitingQuotes = allOrders.filter(o => o.status === "awaiting-quote").length
        const activeProjectsCount = allProjects.filter(p => p.status !== "done").length
        const totalProduced = allProjects.filter(p => p.status === "done").length

        return {
            totalRevenue,
            pendingApprovals,
            awaitingQuotes,
            activeProjectsCount,
            totalProduced,
            onTimeDelivery: 92, // Mock for now
            missedDeadlines: 1, // Mock for now
        }
    },
})

// Get active projects for dashboard queue
export const getDashboardProjects = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") return []

        const projects = await ctx.db
            .query("projects")
            .order("desc")
            .take(10)

        return await Promise.all(
            projects.map(async (p) => {
                const client = await ctx.db.get(p.clientId)
                const assignees = await Promise.all(
                    p.assigneeIds.map(id => ctx.db.get(id))
                )
                
                // Get last message info
                const lastMessage = await ctx.db
                    .query("messages")
                    .withIndex("by_projectId", (q) => q.eq("projectId", p._id))
                    .order("desc")
                    .first()

                return {
                    ...p,
                    clientName: client?.name || "Unknown",
                    assigneeDetails: assignees.filter(Boolean),
                    lastMessage: lastMessage?.content || "No messages yet",
                    lastMessageAt: lastMessage?.createdAt || p.createdAt
                }
            })
        )
    },
})
