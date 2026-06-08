"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Play } from "lucide-react"
import { formatRelativeDate } from "@/lib/utils"

export default function EditorDashboardPage() {
    const tasks = useQuery(api.tasks.getEditorTasks) || []
    const projects = useQuery(api.projects.getEditorProjects) || []

    // Calculate stats
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length
    const completedTasks = tasks.filter(t => t.status === "done").length
    
    // For "Pending Review", we'll check projects assigned to the editor that are in review status
    const inReviewProjects = projects.filter(p => p.status === "in-review").length
    
    // Urgent tasks (High priority)
    const urgentTasksCount = tasks.filter(t => t.priority === "high" && t.status !== "done").length

    // Active assignments list (Tasks)
    const activeAssignments = tasks
        .filter(t => t.status !== "done")
        .sort((a, b) => {
            // Sort by priority (high first)
            const priorityMap = { high: 0, medium: 1, low: 2 }
            return priorityMap[a.priority as keyof typeof priorityMap] - priorityMap[b.priority as keyof typeof priorityMap]
        })
        .slice(0, 5) // Just show top 5

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editor Dashboard</h1>
                <p className="text-muted-foreground">Your tasks and assignments overview</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Play className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">Active tasks</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inReviewProjects}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedTasks}</div>
                        <p className="text-xs text-muted-foreground">Total finished tasks</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{urgentTasksCount}</div>
                        <p className="text-xs text-muted-foreground">High priority active</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Assignments</CardTitle>
                    <CardDescription>Your active tasks and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activeAssignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">No active assignments. Great job!</p>
                        ) : (
                            activeAssignments.map((task, i) => (
                                <div key={task._id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{task.title}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{task.projectName}</p>
                                            {task.dueDate && (
                                                <p className="text-xs text-muted-foreground">• Due: {formatRelativeDate(task.dueDate)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                                            {task.priority.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline" className="uppercase text-[10px]">
                                            {task.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
