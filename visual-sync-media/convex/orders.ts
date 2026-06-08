import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Create a new order (client only)
export const createOrder = mutation({
    args: {
        title: v.string(),
        service: v.string(),
        requirements: v.string(),
        dueDate: v.optional(v.string()),
        rawAssetsLink: v.optional(v.string()),
        targetPlatforms: v.optional(v.array(v.string())),
        stylePreset: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "client") throw new Error("Only clients can create orders")

        const now = Date.now()
        return await ctx.db.insert("orders", {
            clientId: user._id,
            title: args.title,
            service: args.service,
            requirements: args.requirements,
            dueDate: args.dueDate,
            rawAssetsLink: args.rawAssetsLink,
            targetPlatforms: args.targetPlatforms,
            stylePreset: args.stylePreset,
            status: "awaiting-quote",
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Get orders for current client
export const getClientOrders = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "client") return []

        return await ctx.db
            .query("orders")
            .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
            .collect()
    },
})

// Get all orders (admin only)
export const getAllOrders = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") return []

        const orders = await ctx.db.query("orders").collect()

        return await Promise.all(
            orders.map(async (order) => {
                const client = await ctx.db.get(order.clientId)
                return { ...order, client }
            })
        )
    },
})

// Get all orders awaiting quote (admin only)
export const getPendingOrders = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        // If user is not an admin, we return a special object or empty array
        // but for debugging let's at least log or check
        if (!user || user.role !== "admin") {
            console.log("Access denied to getPendingOrders: user is not admin", user?.role)
            return []
        }

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_status", (q) => q.eq("status", "awaiting-quote"))
            .collect()

        // Include client info
        return await Promise.all(
            orders.map(async (order) => {
                const client = await ctx.db.get(order.clientId)
                return { ...order, client }
            })
        )
    },
})

// Get quoted orders (for project creation)
export const getQuotedOrders = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") return []

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_status", (q) => q.eq("status", "quoted"))
            .collect()

        return await Promise.all(
            orders.map(async (order) => {
                const client = await ctx.db.get(order.clientId)
                return { ...order, client }
            })
        )
    },
})

// Get single order by ID
export const getOrderById = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId)
        if (!order) return null

        const client = await ctx.db.get(order.clientId)
        return { ...order, client }
    },
})

// Update order (admin - add quote, client - approve, etc)
export const updateOrder = mutation({
    args: {
        orderId: v.id("orders"),
        status: v.optional(v.union(
            v.literal("awaiting-quote"),
            v.literal("quoted"),
            v.literal("approved"),
            v.literal("completed"),
            v.literal("cancelled")
        )),
        quote: v.optional(
            v.object({
                price: v.number(),
                estimatedDays: v.number(),
                description: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const order = await ctx.db.get(args.orderId)
        if (!order) throw new Error("Order not found")

        // Check permissions
        if (user.role === "client" && order.clientId !== user._id) {
            throw new Error("Not authorized")
        }

        const updates: any = {
            updatedAt: Date.now(),
        }

        if (args.status) updates.status = args.status
        if (args.quote) updates.quote = args.quote

        await ctx.db.patch(args.orderId, updates)
        return await ctx.db.get(args.orderId)
    },
})
