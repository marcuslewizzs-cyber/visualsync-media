import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// User management and theme preference mutations

// Get user by Clerk ID
export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first()
    },
})

// Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first()
    },
})

// Create a new user (called from webhook, signup fallback, or admin)
export const createUser = mutation({
    args: {
        clerkId: v.optional(v.string()),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
    },
    handler: async (ctx, args) => {
        // Check if user already exists by email
        const existingByEmail = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first()

        if (existingByEmail) {
            // Update the existing user if clerkId is provided and missing
            if (args.clerkId && !existingByEmail.clerkId) {
                await ctx.db.patch(existingByEmail._id, {
                    clerkId: args.clerkId,
                    updatedAt: Date.now(),
                })
            }
            return existingByEmail._id
        }

        // Check if user already exists by clerkId (if provided)
        if (args.clerkId) {
            const existingByClerk = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
                .first()
            
            if (existingByClerk) return existingByClerk._id
        }

        const now = Date.now()
        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            role: args.role,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        })

        // If editor, create editor record too
        if (args.role === "editor") {
            await ctx.db.insert("editors", {
                userId: userId,
                specialties: [],
                isActive: true,
            })
        }

        return userId
    },
})

// Get all users (admin only)
export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!currentUser || currentUser.role !== "admin") return []

        return await ctx.db.query("users").collect()
    },
})

// Update user role (admin only)
export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("editor")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            role: args.role,
            updatedAt: Date.now(),
        })
    },
})

// Get current user with role
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return null

        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first()
    },
})

// Get all editors
export const getAllEditors = query({
    args: {},
    handler: async (ctx) => {
        const editors = await ctx.db
            .query("editors")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect()

        const editorsWithUsers = await Promise.all(
            editors.map(async (editor) => {
                const user = await ctx.db.get(editor.userId)
                return { ...editor, user }
            })
        )

        return editorsWithUsers
    },
})

// Update user's Clerk ID (for pre-created editors)
export const updateUserClerkId = mutation({
    args: {
        userId: v.id("users"),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            clerkId: args.clerkId,
            updatedAt: Date.now(),
        })
    },
})

// Update user info
export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const updates: any = {
            updatedAt: Date.now(),
        }
        if (args.name) updates.name = args.name
        if (args.email) updates.email = args.email
        await ctx.db.patch(args.userId, updates)
    },
})

// Deactivate user (soft delete)
export const deactivateUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            isActive: false,
            updatedAt: Date.now(),
        })

        // Also deactivate editor record if exists
        const editor = await ctx.db
            .query("editors")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first()

        if (editor) {
            await ctx.db.patch(editor._id, {
                isActive: false,
            })
        }
    },
})

// Update user theme preference
export const updateThemePreference = mutation({
    args: {
        theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        await ctx.db.patch(user._id, {
            theme: args.theme,
            updatedAt: Date.now(),
        })
    },
})
