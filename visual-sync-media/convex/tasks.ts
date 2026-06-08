import { query, mutation } from "./_generated/server"
import type { MutationCtx } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"

// Create a new task
export const createTask = mutation({
    args: {
        projectId: v.id("projects"),
        title: v.string(),
        description: v.optional(v.string()),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        dueDate: v.optional(v.string()),
        assigneeId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const now = Date.now()
        const taskId = await ctx.db.insert("tasks", {
            projectId: args.projectId,
            title: args.title,
            description: args.description,
            status: "todo",
            priority: args.priority,
            dueDate: args.dueDate,
            assigneeId: args.assigneeId,
            createdAt: now,
            updatedAt: now,
        })

        // Log activity
        await ctx.db.insert("activityLog", {
            projectId: args.projectId,
            userId: user._id,
            action: "created_task",
            details: `Created task: ${args.title} (Priority: ${args.priority})`,
            createdAt: now,
        })

        // Update project progress
        await updateProjectProgress(ctx, args.projectId)

        return taskId
    },
})

// Get all tasks assigned to the current editor
export const getEditorTasks = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) return []

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) return []

        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_assigneeId", (q) => q.eq("assigneeId", user._id))
            .collect()

        return await Promise.all(
            tasks.map(async (task) => {
                const project = await ctx.db.get(task.projectId)
                return { 
                    ...task, 
                    projectName: project?.title || "Unknown Project",
                    priority: task.priority || "medium"
                }
            })
        )
    },
})

// Update task status
export const updateTaskStatus = mutation({
    args: {
        taskId: v.id("tasks"),
        status: v.union(v.literal("todo"), v.literal("in-progress"), v.literal("done")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user) throw new Error("User not found")

        const task = await ctx.db.get(args.taskId)
        if (!task) throw new Error("Task not found")

        const now = Date.now()
        await ctx.db.patch(args.taskId, {
            status: args.status,
            updatedAt: now,
        })

        // Log activity
        await ctx.db.insert("activityLog", {
            projectId: task.projectId,
            userId: user._id,
            action: "updated_task_status",
            details: `Changed task "${task.title}" status to ${args.status}`,
            createdAt: now,
        })

        // Update project progress
        await updateProjectProgress(ctx, task.projectId)
    },
})

// Delete task
export const deleteTask = mutation({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Not authenticated")

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique()

        if (!user || user.role !== "admin") throw new Error("Only admin can delete tasks")

        const task = await ctx.db.get(args.taskId)
        if (!task) throw new Error("Task not found")

        const projectId = task.projectId
        await ctx.db.delete(args.taskId)

        // Update project progress
        await updateProjectProgress(ctx, projectId)
    },
})

// Get tasks for a project
export const getProjectTasks = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .collect()

        return await Promise.all(
            tasks.map(async (task) => {
                const assignee = await ctx.db.get(task.assigneeId)
                return { ...task, assignee }
            })
        )
    },
})

// Get activity log for a project
export const getProjectActivity = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("activityLog")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .collect()

        return await Promise.all(
            logs.map(async (log) => {
                const user = await ctx.db.get(log.userId)
                return { ...log, user }
            })
        )
    },
})

// Helper to update project progress based on tasks
async function updateProjectProgress(ctx: MutationCtx, projectId: Id<"projects">) {
    const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_projectId", (q: any) => q.eq("projectId", projectId))
        .collect()

    if (tasks.length === 0) return

    const completedTasks = tasks.filter((t: any) => t.status === "done").length
    const progress = Math.round((completedTasks / tasks.length) * 100)

    // Also update statusLine automatically
    let statusLine = "In Progress"
    if (progress === 0) statusLine = "Waiting to Start"
    if (progress > 0 && progress < 100) statusLine = `${completedTasks}/${tasks.length} Tasks Done`
    if (progress === 100) statusLine = "All Tasks Completed"

    await ctx.db.patch(projectId, {
        progress,
        statusLine,
        updatedAt: Date.now(),
    })
}
