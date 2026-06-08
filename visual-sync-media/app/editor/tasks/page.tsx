"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Plus, 
    Calendar, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Circle,
    Layout
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { cn, formatRelativeDate } from "@/lib/utils"

export default function EditorTasksPage() {
    const { user } = useAuth()
    const tasks = useQuery(api.tasks.getEditorTasks) || []
    const projects = useQuery(api.projects.getEditorProjects) || []
    
    const createTaskMutation = useMutation(api.tasks.createTask)
    const updateTaskStatusMutation = useMutation(api.tasks.updateTaskStatus)
    const deleteTaskMutation = useMutation(api.tasks.deleteTask)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTask, setNewTask] = useState({
        title: "",
        projectId: "",
        priority: "medium" as "low" | "medium" | "high",
        dueDate: ""
    })

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.projectId || !user?.id) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            await createTaskMutation({
                title: newTask.title,
                projectId: newTask.projectId as any,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                assigneeId: user.id as any
            })
            setIsCreateOpen(false)
            setNewTask({ title: "", projectId: "", priority: "medium", dueDate: "" })
            toast.success("Task created successfully")
        } catch (error) {
            toast.error("Failed to create task")
        }
    }

    const toggleTaskStatus = async (taskId: any, currentStatus: string) => {
        const nextStatus = currentStatus === "done" ? "todo" : "done"
        try {
            await updateTaskStatusMutation({ taskId, status: nextStatus as any })
            toast.success(nextStatus === "done" ? "Task completed!" : "Task moved to todo")
        } catch (error) {
            toast.error("Failed to update task")
        }
    }

    const priorityConfig = {
        low: { color: "bg-blue-500/10 text-blue-600 border-blue-200", label: "Low" },
        medium: { color: "bg-amber-500/10 text-amber-600 border-amber-200", label: "Medium" },
        high: { color: "bg-red-500/10 text-red-600 border-red-200", label: "High" }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <Layout className="text-orange-500" />
                        My Production Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your sub-tasks across all active projects</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 gap-2">
                            <Plus size={18} />
                            Create Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">Create Sub-task</DialogTitle>
                            <DialogDescription>
                                Add a specific task to one of your assigned projects.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="project" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Linked Project</Label>
                                <Select 
                                    value={newTask.projectId} 
                                    onValueChange={(val) => setNewTask({...newTask, projectId: val})}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => (
                                            <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Rough cut for brand video"
                                    className="h-11"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
                                    <Select 
                                        value={newTask.priority} 
                                        onValueChange={(val: any) => setNewTask({...newTask, priority: val})}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Due Date</Label>
                                    <Input
                                        type="date"
                                        className="h-11"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTask} className="bg-orange-500 hover:bg-orange-600">Create Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {/* Active Tasks */}
                <Card className="border-none shadow-xl shadow-black/5 bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-3 border-b border-muted/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black flex items-center gap-2">
                                    <Clock size={18} className="text-orange-500" />
                                    Active To-dos
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">Tasks you need to complete</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 font-bold text-orange-600 border-orange-100">
                                {tasks.filter(t => t.status !== 'done').length} Pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            {tasks.filter(t => t.status !== 'done').length === 0 ? (
                                <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-muted">
                                    <CheckCircle2 size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground font-medium">All caught up! No active tasks.</p>
                                </div>
                            ) : (
                                tasks.filter(t => t.status !== 'done').map((task) => (
                                    <div 
                                        key={task._id} 
                                        className="group flex items-center gap-4 p-4 rounded-2xl border border-muted bg-white hover:border-orange-500/50 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => toggleTaskStatus(task._id, task.status)}
                                    >
                                        <div className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-muted text-transparent group-hover:text-muted/50 group-hover:border-orange-500/30 transition-all">
                                            <Circle size={14} />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm md:text-base text-foreground leading-tight">{task.title}</h3>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-1">
                                                    <Layout size={10} />
                                                    {task.projectName}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                        <Calendar size={10} />
                                                        {formatRelativeDate(task.dueDate)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Badge className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter px-2 h-6 border",
                                            priorityConfig[task.priority as keyof typeof priorityConfig]?.color || ""
                                        )}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card className="border-none shadow-lg bg-muted/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            Recently Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 opacity-60">
                            {tasks.filter(t => t.status === 'done').map((task) => (
                                <div 
                                    key={task._id} 
                                    className="flex items-center gap-4 p-3 rounded-xl border border-muted/50 bg-white/50"
                                >
                                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm line-through text-muted-foreground">{task.title}</h3>
                                        <p className="text-[10px] text-muted-foreground">{task.projectName}</p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 text-[10px] font-bold hover:bg-muted"
                                        onClick={() => toggleTaskStatus(task._id, task.status)}
                                    >
                                        Undo
                                    </Button>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === 'done').length === 0 && (
                                <p className="text-xs text-center py-4 text-muted-foreground italic">No completed tasks yet this session.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
