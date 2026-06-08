import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Create message
export const createMessage = mutation({
    args: {
        orderId: v.optional(v.id("orders")),
        projectId: v.optional(v.id("projects")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        let isAuthorized = user.role === "admin"

        if (args.orderId) {
            const order = await ctx.db.get(args.orderId)
            if (!order) throw new Error("Order not found")
            if (order.clientId === user._id) isAuthorized = true
        } else if (args.projectId) {
            const project = await ctx.db.get(args.projectId)
            if (!project) throw new Error("Project not found")
            if (project.assigneeIds.some(id => id === user._id)) isAuthorized = true
        } else {
            throw new Error("Must specify orderId or projectId")
        }

        if (!isAuthorized) throw new Error("Not authorized")

        return await ctx.db.insert("messages", {
            orderId: args.orderId,
            projectId: args.projectId,
            senderId: user._id,
            content: args.content,
            createdAt: Date.now(),
        })
    },
})

// Get messages for an order
export const getOrderMessages = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return []

        const order = await ctx.db.get(args.orderId)
        if (!order) return []

        // Check authorization
        const isAuthorized =
            user.role === "admin" ||
            order.clientId === user._id

        if (!isAuthorized) return []

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
            .collect()

        // Populate sender info
        return await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId)
                return { ...msg, sender }
            })
        )
    },
})

// Get messages for a project
export const getProjectMessages = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return []

        const project = await ctx.db.get(args.projectId)
        if (!project) return []

        // Check authorization
        const isAuthorized =
            user.role === "admin" ||
            project.assigneeIds.some(id => id === user._id)

        if (!isAuthorized) return []

        const messages = await ctx.db
            .query("messages")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .collect()

        return await Promise.all(
            messages.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId)
                return { ...msg, sender }
            })
        )
    },
})

// Get all active conversations for Admin
export const getConversations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") return []

        // 1. Get unique conversation keys from recent messages
        // In a production app, we'd use a dedicated 'conversations' table.
        // Here we'll take the last 1000 messages to find active convos.
        const recentMessages = await ctx.db.query("messages").order("desc").take(1000)
        
        const convos: Record<string, any> = {}

        for (const msg of recentMessages) {
            const key = msg.orderId ? `order_${msg.orderId}` : `project_${msg.projectId}`
            if (!convos[key]) {
                convos[key] = {
                    id: msg.orderId || msg.projectId,
                    type: msg.orderId ? "client" : "editor",
                    orderId: msg.orderId,
                    projectId: msg.projectId,
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt,
                    lastSenderId: msg.senderId
                }
            }
        }

        // 3. Populate metadata and unread counts
        const result = await Promise.all(
            Object.values(convos).map(async (c: any) => {
                let title = "Unknown"
                let subtitle = ""
                
                if (c.orderId) {
                    const order = await ctx.db.get(c.orderId)
                    const client = order && "clientId" in order ? await ctx.db.get(order.clientId) : null
                    title = client?.name || "Client"
                    subtitle = (order && "title" in order) ? order.title : "Order"
                } else if (c.projectId) {
                    const project = await ctx.db.get(c.projectId)
                    title = (project && "title" in project) ? project.title : "Project"
                    subtitle = "Internal Team"
                }
                
                const lastSender = await ctx.db.get(c.lastSenderId)

                // Get unread count
                const lastRead = await ctx.db
                    .query("readReceipts")
                    .withIndex("by_user_convo", (q) => 
                        q.eq("userId", user._id).eq("orderId", c.orderId).eq("projectId", c.projectId)
                    )
                    .unique()
                
                const lastReadAt = lastRead?.lastReadAt || 0
                
                const unreadMessages = await ctx.db
                    .query("messages")
                    .withIndex(c.orderId ? "by_orderId" : "by_projectId", (q) => 
                        c.orderId ? q.eq("orderId", c.orderId) : q.eq("projectId", c.projectId)
                    )
                    .filter((q) => q.gt(q.field("createdAt"), lastReadAt))
                    .collect()

                return { 
                    ...c, 
                    title, 
                    subtitle, 
                    lastSender, 
                    unreadCount: unreadMessages.filter(m => m.senderId !== user._id).length 
                }
            })
        )

        return result.sort((a, b) => b.lastMessageAt - a.lastMessageAt)
    },
})

// Mark a conversation as read
export const markRead = mutation({
    args: {
        orderId: v.optional(v.id("orders")),
        projectId: v.optional(v.id("projects")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const existing = await ctx.db
            .query("readReceipts")
            .withIndex("by_user_convo", (q) => 
                q.eq("userId", user._id).eq("orderId", args.orderId).eq("projectId", args.projectId)
            )
            .unique()

        if (existing) {
            await ctx.db.patch(existing._id, { lastReadAt: Date.now() })
        } else {
            await ctx.db.insert("readReceipts", {
                userId: user._id,
                orderId: args.orderId,
                projectId: args.projectId,
                lastReadAt: Date.now(),
            })
        }
    },
})

// Delete message
export const deleteMessage = mutation({
    args: { messageId: v.id("messages") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const message = await ctx.db.get(args.messageId)
        if (!message) throw new Error("Message not found")

        if (message.senderId !== user._id && user.role !== "admin") {
            throw new Error("Not authorized")
        }

        await ctx.db.delete(args.messageId)
    },
})
// Get total unread count for the current user across all conversations
export const getTotalUnreadCount = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return 0

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return 0

        // Find all orders for client or assigned projects for editor
        let orderIds: any[] = []
        let projectIds: any[] = []

        if (user.role === "client") {
            const orders = await ctx.db
                .query("orders")
                .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
                .collect()
            orderIds = orders.map(o => o._id)

            const projects = await ctx.db
                .query("projects")
                .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
                .collect()
            projectIds = projects.map(p => p._id)
        } else if (user.role === "editor") {
            const allProjects = await ctx.db.query("projects").collect()
            const assignedProjects = allProjects.filter(p =>
                p.assigneeIds.some(id => id.toString() === user._id.toString())
            )
            projectIds = assignedProjects.map(p => p._id)
        } else if (user.role === "admin") {
            const allOrders = await ctx.db.query("orders").collect()
            orderIds = allOrders.map(o => o._id)
            const allProjects = await ctx.db.query("projects").collect()
            projectIds = allProjects.map(p => p._id)
        }

        let totalUnread = 0

        // Check unread in orders
        for (const orderId of orderIds) {
            const lastRead = await ctx.db
                .query("readReceipts")
                .withIndex("by_user_convo", (q) => q.eq("userId", user._id).eq("orderId", orderId).eq("projectId", undefined))
                .unique()
            
            const lastReadAt = lastRead?.lastReadAt || 0
            const unread = await ctx.db
                .query("messages")
                .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
                .filter((q) => q.gt(q.field("createdAt"), lastReadAt))
                .collect()
            
            totalUnread += unread.filter(m => m.senderId !== user._id).length
        }

        // Check unread in projects
        for (const projectId of projectIds) {
            const lastRead = await ctx.db
                .query("readReceipts")
                .withIndex("by_user_convo", (q) => q.eq("userId", user._id).eq("orderId", undefined).eq("projectId", projectId))
                .unique()
            
            const lastReadAt = lastRead?.lastReadAt || 0
            const unread = await ctx.db
                .query("messages")
                .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
                .filter((q) => q.gt(q.field("createdAt"), lastReadAt))
                .collect()
            
            totalUnread += unread.filter(m => m.senderId !== user._id).length
        }

        return totalUnread
    },
})
