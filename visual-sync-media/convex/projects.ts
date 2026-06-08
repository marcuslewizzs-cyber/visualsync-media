import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Create project from order (admin only)
export const createProject = mutation({
    args: {
        orderId: v.id("orders"),
        assigneeIds: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admin can create projects")

        console.log("createProject mutation started", args)
        
        const order = await ctx.db.get(args.orderId)
        if (!order) {
            console.error("Order not found", args.orderId)
            throw new Error("Order not found")
        }
        if (order.status !== "quoted") {
            console.error("Order not in quoted status", order.status)
            throw new Error("Order must be quoted first")
        }

        const now = Date.now()
        const projectId = await ctx.db.insert("projects", {
            orderId: args.orderId,
            title: order.title,
            description: order.requirements,
            clientId: order.clientId,
            dealValue: order.quote?.price || 0,
            status: "todo",
            assigneeIds: args.assigneeIds,
            progress: 0,
            dueDate: order.dueDate,
            driveLinks: {
                raw: order.rawAssetsLink || "",
                working: "",
            },
            mediaSpecs: {
                duration: "N/A",
                ratio: "16:9",
            },
            internalNotes: [],
            statusLine: "Waiting to Start",
            readyForClient: false,
            createdAt: now,
            updatedAt: now,
        })

        // Log activity
        await ctx.db.insert("activityLog", {
            projectId,
            userId: user._id,
            action: "created_project",
            details: `Project created from order: ${order.title}`,
            createdAt: now,
        })

        // Update order status
        await ctx.db.patch(args.orderId, {
            status: "approved",
            updatedAt: now,
        })

        return projectId
    },
})

// Create internal project (admin only)
export const createInternalProject = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        assigneeIds: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admin can create internal projects")

        const now = Date.now()
        const projectId = await ctx.db.insert("projects", {
            title: args.title,
            description: args.description,
            clientId: user._id, // Assign to admin themselves
            dealValue: 0,
            status: "todo",
            assigneeIds: args.assigneeIds,
            progress: 0,
            driveLinks: { raw: "", working: "" },
            mediaSpecs: { duration: "N/A", ratio: "16:9" },
            internalNotes: [],
            statusLine: "Getting Started",
            readyForClient: false,
            createdAt: now,
            updatedAt: now,
        })

        // Log activity
        await ctx.db.insert("activityLog", {
            projectId,
            userId: user._id,
            action: "created_project",
            details: `Internal project created: ${args.title}`,
            createdAt: now,
        })

        return projectId
    },
})

// Get projects assigned to current editor
export const getEditorProjects = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return []

        // For admin, return all projects
        if (user.role === "admin") {
            const projects = await ctx.db.query("projects").collect()
            return await populateProjectData(ctx, projects)
        }

        // For editor, return assigned projects
        if (user.role === "editor") {
            const allProjects = await ctx.db.query("projects").collect()
            const assignedProjects = allProjects.filter(p =>
                p.assigneeIds.some(id => id.toString() === user._id.toString())
            )
            return await populateProjectData(ctx, assignedProjects)
        }

        // For client, return their projects
        if (user.role === "client") {
            const projects = await ctx.db
                .query("projects")
                .withIndex("by_clientId", (q) => q.eq("clientId", user._id))
                .collect()
            return await populateProjectData(ctx, projects)
        }

        return []
    },
})

// Get active projects (not done)
export const getActiveProjects = query({
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
            .filter((q) => q.neq(q.field("status"), "done"))
            .collect()

        return await populateProjectData(ctx, projects)
    },
})

// DEBUG QUERY - NO ADMIN CHECK
export const getAllProjectsDebug = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db.query("projects").collect()
        return await populateProjectData(ctx, projects)
    },
})

// Get project by ID
export const getProjectById = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId)
        if (!project) return null

        return (await populateProjectData(ctx, [project]))[0]
    },
})

// Update project
export const updateProject = mutation({
    args: {
        projectId: v.id("projects"),
        status: v.optional(v.union(
            v.literal("todo"),
            v.literal("in-progress"),
            v.literal("in-review"),
            v.literal("done")
        )),
        progress: v.optional(v.number()),
        statusLine: v.optional(v.string()),
        driveLinks: v.optional(
            v.object({
                raw: v.string(),
                working: v.string(),
            })
        ),
        readyForClient: v.optional(v.boolean()),
        assigneeIds: v.optional(v.array(v.id("users"))),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const project = await ctx.db.get(args.projectId)
        if (!project) throw new Error("Project not found")

        // Check permissions - admin, assigned editor, or client
        const isAuthorized =
            user.role === "admin" ||
            user._id === project.clientId ||
            project.assigneeIds.some(id => id === user._id)

        if (!isAuthorized) throw new Error("Not authorized")

        const updates: any = {
            updatedAt: Date.now(),
        }

        if (args.status !== undefined) updates.status = args.status
        if (args.progress !== undefined) updates.progress = args.progress
        if (args.statusLine !== undefined) updates.statusLine = args.statusLine
        if (args.driveLinks !== undefined) updates.driveLinks = args.driveLinks
        if (args.readyForClient !== undefined) updates.readyForClient = args.readyForClient
        if (args.assigneeIds !== undefined) updates.assigneeIds = args.assigneeIds

        await ctx.db.patch(args.projectId, updates)
        return await ctx.db.get(args.projectId)
    },
})

// Add internal note to project
export const addProjectNote = mutation({
    args: {
        projectId: v.id("projects"),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const project = await ctx.db.get(args.projectId)
        if (!project) throw new Error("Project not found")

        // Only admin and assigned editors can add notes
        const isAuthorized =
            user.role === "admin" ||
            project.assigneeIds.some(id => id === user._id)

        if (!isAuthorized) throw new Error("Not authorized")

        const updatedNotes = [...project.internalNotes, args.note]
        await ctx.db.patch(args.projectId, {
            internalNotes: updatedNotes,
            updatedAt: Date.now(),
        })

        return await ctx.db.get(args.projectId)
    },
})

// Delete project (admin only)
export const deleteProject = mutation({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admin can delete projects")

        await ctx.db.delete(args.projectId)
    },
})

async function populateProjectData(ctx: any, projects: any[]) {
    return await Promise.all(
        projects.map(async (project) => {
            const client = await ctx.db.get(project.clientId)
            const order = project.orderId ? await ctx.db.get(project.orderId) : null
            const assignees = await Promise.all(
                project.assigneeIds.map((id: any) => ctx.db.get(id))
            )
            
            // Fetch tasks
            const tasks = await ctx.db
                .query("tasks")
                .withIndex("by_projectId", (q: any) => q.eq("projectId", project._id))
                .collect()
                
            const populatedTasks = await Promise.all(
                tasks.map(async (task: any) => {
                    const assignee = await ctx.db.get(task.assigneeId)
                    return { ...task, assignee, priority: task.priority || "medium" }
                })
            )

            // Fetch activity log (latest first)
            const logs = await ctx.db
                .query("activityLog")
                .withIndex("by_projectId", (q: any) => q.eq("projectId", project._id))
                .collect()
            
            const populatedLogs = await Promise.all(
                logs.sort((a: any, b: any) => b.createdAt - a.createdAt).map(async (log: any) => {
                    const user = await ctx.db.get(log.userId)
                    return { ...log, user }
                })
            )

            return {
                ...project,
                client,
                order,
                assignees: assignees.filter(Boolean),
                tasks: populatedTasks,
                activityLog: populatedLogs
            }
        })
    )
}
