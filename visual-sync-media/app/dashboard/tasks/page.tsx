/**
 * Admin Production Terminal - Media SaaS
 * 
 * A simplified workflow for managing client requests, editor assignments, and internal reviews.
 * 
 * @updated 2026-02-07 - UI Simplification & Overflow Fixes
 * @route /dashboard/tasks
 */
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Filter,
    Calendar,
    FolderOpen,
    AlertTriangle,
    Video,
    Smartphone,
    Monitor,
    Trash2,
    Zap,
    Briefcase,
    Check,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Play,
    DollarSign,
    Clock,
    UserPlus,
    X,
    Users,
    RotateCcw,
    FolderPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

// --- Components ---

export default function TasksPage() {
    const { role } = useAuth()
    const isAdmin = role === 'admin'

    const currentUser = useQuery(api.users.getCurrentUser)
    const projects = useQuery(api.projects.getActiveProjects) || []
    const debugProjects = useQuery(api.projects.getAllProjectsDebug) || []
    const quotedOrders = useQuery(api.orders.getQuotedOrders) || []
    const editors = useQuery(api.users.getAllEditors) || []

    useEffect(() => {
        console.log("TasksPage Data Check:", {
            isAdmin,
            projectsCount: projects.length,
            debugProjectsCount: debugProjects.length,
            role
        })
    }, [isAdmin, projects, debugProjects, role])

    const createProjectMutation = useMutation(api.projects.createProject)
    const createInternalProjectMutation = useMutation(api.projects.createInternalProject)
    const updateProjectMutation = useMutation(api.projects.updateProject)
    const deleteProjectMutation = useMutation(api.projects.deleteProject)
    
    // Dialog states
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null)
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
    
    const [expandedProjectId, setExpandedProjectId] = useState<Id<"projects"> | null>(null)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false)
    const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)

    const [feedbackProjectId, setFeedbackProjectId] = useState<Id<"projects"> | null>(null)
    const [feedbackText, setFeedbackText] = useState("")

    const [progressProjectId, setProgressProjectId] = useState<Id<"projects"> | null>(null)
    const [progressValue, setProgressValue] = useState(0)
    const [progressStatusLine, setProgressStatusLine] = useState("")

    const [newTodoTitle, setNewTodoTitle] = useState("")
    const [newTodoDesc, setNewTodoDesc] = useState("")

    const [internalForwardingNote, setInternalForwardingNote] = useState("")

    const activeProjects = projects.filter(p => p.status !== "done")
    const doneProjects = projects.filter(p => p.status === "done")
    const selectedProjectForProgress = projects.find(p => p._id === progressProjectId)

    // --- Actions ---

    const handleCreateProject = async () => {
        if (!selectedOrderId) {
            toast.error("Please select an order.")
            return
        }
        if (selectedAssignees.length === 0) {
            toast.error("Please assign at least one editor.")
            return
        }

        console.log("Starting createProject mutation", {
            orderId: selectedOrderId,
            assigneeIds: selectedAssignees
        })

        try {
            await createProjectMutation({
                orderId: selectedOrderId,
                assigneeIds: selectedAssignees as Id<"users">[]
            })
            console.log("Project created successfully")
            setIsCreateProjectOpen(false)
            setSelectedOrderId(null)
            setSelectedAssignees([])
            toast.success("Project created and added to production pipeline.")
        } catch (error) {
            console.error("Create project error:", error)
            toast.error("Failed to create project.")
        }
    }

    const handleCreateSelfTodo = async () => {
        if (!newTodoTitle.trim()) {
            toast.error("Please enter a title.")
            return
        }

        try {
            await createInternalProjectMutation({
                title: newTodoTitle,
                description: newTodoDesc,
                // Assign the task to the current admin who creates it
                assigneeIds: currentUser ? [currentUser._id] : [],
            })
            setIsTodoDialogOpen(false)
            setNewTodoTitle("")
            setNewTodoDesc("")
            toast.success("Task added to your todo list.")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create task.")
        }
    }

    const handleToggleExpand = (id: Id<"projects">, currentAssignees: string[]) => {
        if (expandedProjectId === id) {
            setExpandedProjectId(null)
            setSelectedAssignees([])
        } else {
            setExpandedProjectId(id)
            setSelectedAssignees(currentAssignees)
        }
    }

    const toggleAssignee = (editorId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(editorId) ? prev.filter(id => id !== editorId) : [...prev, editorId]
        )
    }

    const handleForwardToProduction = async (projectId: Id<"projects">) => {
        if (selectedAssignees.length === 0) {
            toast.error("Please assign at least one member.")
            return
        }

        try {
            const project = projects.find((p: any) => p._id === projectId)
            await updateProjectMutation({
                projectId,
                status: "todo",
                assigneeIds: selectedAssignees as Id<"users">[],
                statusLine: "Waiting to Start"
            })
            // if we had addProjectNoteMutation we could use it here
            setExpandedProjectId(null)
            setInternalForwardingNote("")
            toast.success("Task assigned and forwarded.")
        } catch (e) {
            toast.error("Failed to forward task.")
        }
    }

    const handleDeleteProject = async (projectId: Id<"projects">) => {
        if (confirm("Permanently delete this project?")) {
            try {
                await deleteProjectMutation({ projectId })
                toast.error("Project deleted.")
            } catch (e) {
                toast.error("Failed to delete.")
            }
        }
    }

    const handleOpenProgressDialog = (project: any) => {
        setProgressProjectId(project._id)
        setProgressValue(project.progress)
        setProgressStatusLine(project.statusLine || "")
        setIsProgressDialogOpen(true)
    }

    const submitProgressUpdate = async () => {
        if (!progressProjectId) return
        try {
            await updateProjectMutation({ 
                projectId: progressProjectId,
                progress: progressValue, 
                statusLine: progressStatusLine 
            })
            setIsProgressDialogOpen(false)
            toast.success("Progress updated.")
        } catch (e) {
            toast.error("Failed to update.")
        }
    }

    const handleReviewDecision = async (id: Id<"projects">, decision: 'approve' | 'revise' | 'done') => {
        try {
            if (decision === 'approve') {
                await updateProjectMutation({ projectId: id, readyForClient: true })
                toast.success("Approved for client.")
            } else if (decision === 'done') {
                await updateProjectMutation({ projectId: id, status: 'done', progress: 100, readyForClient: true, statusLine: "Completed" })
                toast.success("Project marked as done.")
            } else {
                setFeedbackProjectId(id)
                setIsFeedbackOpen(true)
            }
        } catch (e) {
            toast.error("Failed to update.")
        }
    }

    const submitFeedback = async () => {
        if (!feedbackProjectId) return
        try {
            await updateProjectMutation({
                projectId: feedbackProjectId,
                status: "in-progress",
                progress: 80,
                statusLine: "Revising...",
            })
            // missing addProjectNoteMutation call
            setIsFeedbackOpen(false)
            setFeedbackText("")
            setFeedbackProjectId(null)
        } catch (e) {
            toast.error("Failed to submit feedback.")
        }
    }

    const getProjectsByStatus = (status: any) => {
        if (status === "done") return doneProjects
        return activeProjects.filter((p: any) => p.status === status)
    }

    return (
        <div className="space-y-8 max-w-full overflow-hidden">
            {/* Header with Create Project Button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Production Board</h1>
                    <p className="text-sm text-muted-foreground">Manage client requests and track production progress.</p>
                </div>
                {isAdmin && quotedOrders.length > 0 && (
                    <Button 
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                    >
                        <FolderPlus size={18} />
                        Create Project
                        {quotedOrders.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                                {quotedOrders.length}
                            </Badge>
                        )}
                    </Button>
                )}
            </div>

            {/* Kanban Pipeline */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Production Pipeline</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {(["todo", "in-progress", "in-review", "done"] as const).map(status => (
                        <div key={status} className="flex-1 min-w-[280px] max-w-[320px] bg-muted/30 rounded-xl p-3 space-y-3 border h-[calc(100vh-300px)] overflow-y-auto">
                            <div className="flex items-center justify-between pb-1 px-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest">{status.replace('-', ' ')}</h3>
                                    {status === 'todo' && isAdmin && (
                                        <button
                                            onClick={() => setIsTodoDialogOpen(true)}
                                            className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            <Plus size={10} />
                                        </button>
                                    )}
                                </div>
                                <Badge variant="outline" className="h-4 text-[9px] px-1">
                                    {getProjectsByStatus(status).length}
                                </Badge>
                            </div>

                            {getProjectsByStatus(status).map((project: any) => (
                                <Card key={project._id} className={cn(
                                    "border-none shadow-sm hover:shadow-md transition-all overflow-hidden",
                                    project.status === 'done' && "opacity-70 grayscale-[0.5]"
                                )}>
                                    {isAdmin && (
                                        <div className="px-3 py-2 bg-black/[0.03] flex justify-between items-center text-xs font-bold border-b">
                                            <span className="text-green-600">${project.dealValue}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleDeleteProject(project._id)} className="text-red-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                                <span className="text-muted-foreground uppercase opacity-70">{project.client?.name || project.clientName || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-3 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-xs font-bold leading-none truncate">{project.title}</h4>
                                            <div className="flex -space-x-2">
                                                {project.assigneeIds.map((id: any) => {
                                                    const assignedEditor = editors.find(e => e.user?._id === id)
                                                    const initials = assignedEditor?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'E'
                                                    return (
                                                        <div key={id} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold uppercase transition-transform hover:scale-110 shadow-sm" title={assignedEditor?.user?.name || "Editor"}>
                                                            {initials}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold uppercase">
                                                <button
                                                    onClick={() => project.status !== 'done' && handleOpenProgressDialog(project)}
                                                    className={cn("truncate text-left transition-colors", project.status !== 'done' && "text-primary hover:underline")}
                                                >
                                                    {project.statusLine || "Starting"}
                                                </button>
                                                <span className="text-muted-foreground">{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} className="h-1" />
                                        </div>

                                        {project.status === 'in-review' && (
                                            <div className="flex gap-1.5 pt-1">
                                                <Button size="sm" className="h-8 text-xs flex-1 font-bold bg-green-600 hover:bg-green-700" onClick={() => handleReviewDecision(project._id, 'done')}>
                                                    <Check size={14} className="mr-1" /> Complete
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8 text-xs flex-1 font-bold border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReviewDecision(project._id, 'revise')}>
                                                    <ArrowLeft size={14} className="mr-1" /> Revise
                                                </Button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-muted text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                                            <div className="flex items-center gap-2">
                                                {project.mediaSpecs.ratio === '9:16' ? <Smartphone size={12} /> : <Monitor size={12} />}
                                                <span>{project.dueDate ? project.dueDate.split('-').slice(1).join('/') : 'N/A'}</span>
                                            </div>
                                            {project.readyForClient && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-4 text-[10px]">SUBMITTED</Badge>}
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {status === 'todo' && projects.length === 0 && debugProjects.length > 0 && (
                                <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/5 rounded-lg">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 flex items-center gap-2">
                                        <Zap size={10} /> Debug Info: Projects found in DB
                                    </p>
                                    <div className="space-y-2">
                                        {debugProjects.map((p: any) => (
                                            <div key={p._id} className="text-[9px] text-muted-foreground flex justify-between">
                                                <span>{p.title}</span>
                                                <span className="font-mono">{p.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Create Project Dialog */}
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-orange-500">
                            <FolderPlus size={18} />
                            Create Project from Quoted Order
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Select a quoted order and assign editors to create a new production project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        {/* Order Selection */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Select Quoted Order</Label>
                            {quotedOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No quoted orders available.</p>
                            ) : (
                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {quotedOrders.map((order: any) => (
                                        <button
                                            key={order._id}
                                            onClick={() => setSelectedOrderId(order._id)}
                                            className={cn(
                                                "w-full p-4 rounded-xl border-2 text-left transition-all",
                                                selectedOrderId === order._id
                                                    ? "bg-orange-500/10 border-orange-500 shadow-sm"
                                                    : "bg-muted/20 border-transparent hover:border-muted hover:bg-muted/40"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold truncate">{order.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        <span className="font-semibold text-foreground/80">{order.client?.name || order.clientName || 'Unknown'}</span>
                                                        <span className="mx-1">•</span>
                                                        {order.service}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-black text-green-600">${order.quote?.price}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editor Assignment */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Assign Editors</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {editors.map(editorData => {
                                    const editorId = editorData.user?._id
                                    if (!editorId) return null
                                    
                                    const isSelected = selectedAssignees.includes(editorId)
                                    return (
                                        <button
                                            key={editorId}
                                            onClick={() => toggleAssignee(editorId)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                                                isSelected 
                                                    ? "bg-orange-500 text-white border-orange-500 shadow-md ring-2 ring-orange-500/20" 
                                                    : "bg-muted/30 border-muted/50 hover:border-orange-500/50 hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm",
                                                isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                                            )}>
                                                {editorData.user?.name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold truncate leading-tight">{editorData.user?.name}</div>
                                                <div className={cn(
                                                    "text-xs truncate mt-0.5",
                                                    isSelected ? "text-white/80" : "text-muted-foreground"
                                                )}>
                                                    {editorData.specialties?.join(', ') || "Editor"}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreateProjectOpen(false)}>Cancel</Button>
                        <Button 
                            size="sm" 
                            onClick={handleCreateProject} 
                            className="bg-orange-500 hover:bg-orange-600 px-6"
                            disabled={!selectedOrderId || selectedAssignees.length === 0}
                        >
                            Create Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revision Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            Return for Revision
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Provide specific feedback to the production team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Feedback Note</Label>
                        <Textarea
                            placeholder="State what needs to be fixed..."
                            className="text-sm min-h-[120px]"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsFeedbackOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={submitFeedback} className="bg-amber-600 hover:bg-amber-700 px-6">Send to Team</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Admin Self-Todo Dialog */}
            <Dialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                            <Plus size={18} />
                            Create Self-Todo
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Add a task to your own production queue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="todo-title" className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Task Title</Label>
                            <Input
                                id="todo-title"
                                placeholder="e.g. Review GlobalTech draft..."
                                className="text-sm"
                                value={newTodoTitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="todo-desc" className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Description</Label>
                            <Textarea
                                id="todo-desc"
                                placeholder="Details about this task..."
                                className="text-sm min-h-[100px]"
                                value={newTodoDesc}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTodoDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" size="sm" onClick={() => setIsTodoDialogOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleCreateSelfTodo} className="bg-primary hover:bg-primary/90 px-6">Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Progress Update Dialog */}
            <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary">
                            <RotateCcw size={18} />
                            Project Overview
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            {selectedProjectForProgress?.title}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedProjectForProgress && (
                        <div className="py-4 space-y-6">
                            {/* Team */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Assigned Team</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProjectForProgress.assignees?.map((assignee: any) => (
                                        <div key={assignee._id} className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-full border">
                                            <div className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] font-bold">
                                                {assignee.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <span className="text-[11px] font-medium">{assignee.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Stats */}
                            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Current Progress</span>
                                    <span className="text-lg font-black text-orange-500">{selectedProjectForProgress.progress}%</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Status Line</span>
                                    <span className="text-sm font-bold">{selectedProjectForProgress.statusLine}</span>
                                </div>
                            </div>

                            {/* Tasks Tracking */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Task Breakdown</Label>
                                    <Badge variant="outline" className="text-[10px]">{selectedProjectForProgress.tasks?.length || 0} Total</Badge>
                                </div>
                                
                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                    {selectedProjectForProgress.tasks?.length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic text-center py-4 border rounded-xl">No sub-tasks created yet.</p>
                                    ) : (
                                        selectedProjectForProgress.tasks?.map((task: any) => (
                                            <div key={task._id} className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                                task.status === 'done' ? "bg-green-500/5 border-green-500/20" : "bg-white border-muted shadow-sm"
                                            )}>
                                                <div className={cn(
                                                    "h-5 w-5 rounded-md border flex items-center justify-center",
                                                    task.status === 'done' ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground/30"
                                                )}>
                                                    {task.status === 'done' && <Check size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm font-bold truncate",
                                                        task.status === 'done' && "line-through text-muted-foreground"
                                                    )}>{task.title}</p>
                                                    <p className="text-[10px] text-muted-foreground">Editor: {task.assignee?.name}</p>
                                                </div>
                                                <Badge className={cn(
                                                    "text-[9px] h-5",
                                                    task.status === 'done' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {task.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Activity Tracking */}
                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Production Log</Label>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    {selectedProjectForProgress.activityLog?.length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic text-center py-4">No activity logged yet</p>
                                    ) : (
                                        selectedProjectForProgress.activityLog?.map((log: any) => (
                                            <div key={log._id} className="flex gap-3">
                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold shrink-0">
                                                    {log.user?.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px]">
                                                        <span className="font-bold">{log.user?.name}</span> {log.details}
                                                    </p>
                                                    <p className="text-[9px] text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter className="border-t pt-4">
                        <Button variant="ghost" size="sm" onClick={() => setIsProgressDialogOpen(false)}>Close Overview</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
