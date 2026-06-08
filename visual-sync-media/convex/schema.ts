import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    // Users table - synced from Clerk
    users: defineTable({
        clerkId: v.optional(v.string()),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
        isActive: v.optional(v.boolean()),
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerkId", ["clerkId"])
        .index("by_email", ["email"])
        .index("by_role", ["role"]),

    // Editors table - additional editor-specific data
    editors: defineTable({
        userId: v.id("users"),
        specialties: v.array(v.string()),
        currentlyEditing: v.optional(v.string()),
        isActive: v.boolean(),
    })
        .index("by_userId", ["userId"]),

    // Orders table - client orders
    orders: defineTable({
        clientId: v.id("users"),
        title: v.string(),
        service: v.string(),
        requirements: v.string(),
        dueDate: v.optional(v.string()),
        rawAssetsLink: v.optional(v.string()),
        targetPlatforms: v.optional(v.array(v.string())),
        stylePreset: v.optional(v.string()),
        status: v.union(
            v.literal("awaiting-quote"),
            v.literal("quoted"),
            v.literal("approved"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        quote: v.optional(
            v.object({
                price: v.number(),
                estimatedDays: v.number(),
                description: v.string(),
            })
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clientId", ["clientId"])
        .index("by_status", ["status"]),

    // Projects table - production projects linked to orders
    projects: defineTable({
        orderId: v.optional(v.id("orders")),
        title: v.string(),
        description: v.string(),
        clientId: v.id("users"),
        dealValue: v.number(),
        status: v.union(
            v.literal("todo"),
            v.literal("in-progress"),
            v.literal("in-review"),
            v.literal("done")
        ),
        assigneeIds: v.array(v.id("users")),
        progress: v.number(),
        dueDate: v.optional(v.string()),
        driveLinks: v.object({
            raw: v.string(),
            working: v.string(),
        }),
        mediaSpecs: v.object({
            duration: v.string(),
            ratio: v.union(v.literal("9:16"), v.literal("16:9")),
        }),
        internalNotes: v.array(v.string()),
        statusLine: v.string(),
        readyForClient: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_orderId", ["orderId"])
        .index("by_clientId", ["clientId"])
        .index("by_status", ["status"]),

    // Messages table - communication portal (contextual)
    messages: defineTable({
        orderId: v.optional(v.id("orders")),
        projectId: v.optional(v.id("projects")),
        senderId: v.id("users"),
        content: v.string(),
        createdAt: v.number(),
    })
        .index("by_orderId", ["orderId"])
        .index("by_projectId", ["projectId"]),

    // Project Tasks - granular tasks within a project
    tasks: defineTable({
        projectId: v.id("projects"),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        dueDate: v.optional(v.string()),
        assigneeId: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_projectId", ["projectId"])
        .index("by_assigneeId", ["assigneeId"]),

    // Activity Log - track changes to projects and tasks
    activityLog: defineTable({
        projectId: v.id("projects"),
        userId: v.id("users"),
        action: v.string(), // e.g. "created_task", "completed_task", "updated_status"
        details: v.string(),
        createdAt: v.number(),
    })
        .index("by_projectId", ["projectId"]),

    // Read Receipts - track when users last read messages in a conversation
    readReceipts: defineTable({
        userId: v.id("users"),
        orderId: v.optional(v.id("orders")),
        projectId: v.optional(v.id("projects")),
        lastReadAt: v.number(),
    })
        .index("by_user_convo", ["userId", "orderId", "projectId"])
        .index("by_orderId", ["orderId"])
        .index("by_projectId", ["projectId"]),
})
