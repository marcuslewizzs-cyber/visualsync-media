"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatDate } from "@/lib/order-service"
import { toast } from "sonner"
import {
    Clock,
    CheckCircle2,
    FileText,
    AlertCircle,
    Play,
    RotateCcw,
    Send,
    FolderOpen,
    MessageSquare,
    ChevronRight,
    User,
    Monitor,
    Smartphone,
    Check,
    Plus
} from "lucide-react"
import { cn, formatRelativeDate } from "@/lib/utils"
import { ChatInterface } from "@/components/chat-interface"

const statusConfig = {
    "todo": { label: "To Do", icon: Clock, color: "bg-gray-500", badgeVariant: "secondary" as const },
    "in-progress": { label: "In Progress", icon: Play, color: "bg-blue-500", badgeVariant: "default" as const },
    "in-review": { label: "In Review", icon: FileText, color: "bg-amber-500", badgeVariant: "outline" as const },
    "done": { label: "Completed", icon: CheckCircle2, color: "bg-green-500", badgeVariant: "outline" as const },
}

const statusFlow = ["todo", "in-progress", "in-review", "done"] as const

export default function EditorProjectsPage() {
    const { user } = useAuth()
    const projects = useQuery(api.projects.getEditorProjects) || []
    
    // Mutations
    const updateProjectMutation = useMutation(api.projects.updateProject)
    const addProjectNoteMutation = useMutation(api.projects.addProjectNote)
    const createTaskMutation = useMutation(api.tasks.createTask)
    const updateTaskStatusMutation = useMutation(api.tasks.updateTaskStatus)

    const [selectedProject, setSelectedProject] = useState<any | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    
    // Progress update state
    const [progressValue, setProgressValue] = useState(0)
    const [statusLine, setStatusLine] = useState("")
    
    // Note state
    const [newNote, setNewNote] = useState("")

    const handleOpenDetail = (project: any) => {
        setSelectedProject(project)
        setProgressValue(project.progress)
        setStatusLine(project.statusLine || "")
        setIsDetailOpen(true)
    }

    const handleUpdateProgress = async () => {
        if (!selectedProject) return
        
        try {
            await updateProjectMutation({
                projectId: selectedProject._id,
                progress: progressValue,
                statusLine: statusLine
            })
            toast.success("Progress updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update progress")
        }
    }

    const handleStatusAdvance = async () => {
        if (!selectedProject) return
        
        const currentIndex = statusFlow.indexOf(selectedProject.status as any)
        if (currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1]
            const updates: any = { 
                projectId: selectedProject._id,
                status: nextStatus 
            }
            
            if (nextStatus === "done") {
                updates.progress = 100
                updates.statusLine = "Completed"
            } else if (nextStatus === "in-review") {
                updates.statusLine = "Ready for Review"
            }
            
            try {
                await updateProjectMutation(updates)
                toast.success(`Status updated to ${statusConfig[nextStatus].label}`)
                // Update local selection if dialog is open
                setSelectedProject((prev: any) => ({ ...prev, ...updates }))
            } catch (error) {
                console.error(error)
                toast.error("Failed to update status")
            }
        }
    }

    const handleAddNote = async () => {
        if (!selectedProject || !newNote.trim()) return
        
        try {
            await addProjectNoteMutation({
                projectId: selectedProject._id,
                note: newNote
            })
            setNewNote("")
            toast.success("Note added")
        } catch (error) {
            console.error(error)
            toast.error("Failed to add note")
        }
    }

    const handleWorkingDriveUpdate = async (link: string) => {
        if (!selectedProject) return
        
        try {
            await updateProjectMutation({
                projectId: selectedProject._id,
                driveLinks: { ...selectedProject.driveLinks, working: link }
            })
            // Update local selection for immediate feedback
            setSelectedProject((prev: any) => ({
                ...prev,
                driveLinks: { ...prev.driveLinks, working: link }
            }))
        } catch (error) {
            console.error(error)
            toast.error("Failed to update link")
        }
    }

    if (projects === undefined) {
        return <div className="text-center py-8">Loading projects...</div>
    }

    if (projects.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
                    <p className="text-muted-foreground">View and manage your assigned production projects.</p>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Projects Assigned</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            You don't have any active projects assigned to you. Check back later or contact your admin.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
                <p className="text-muted-foreground">View and manage your assigned production projects.</p>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-4">
                {[...projects].sort((a: any, b: any) => b.createdAt - a.createdAt).map((project: any) => {
                    const config = statusConfig[project.status as keyof typeof statusConfig]
                    const StatusIcon = config.icon

                    return (
                        <Card key={project._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                                            <Badge variant={config.badgeVariant} className={cn("text-white", config.color)}>
                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>{project.client?.name || 'Unknown Client'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>Due: {project.dueDate ? formatDate(project.dueDate) : 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{project.internalNotes.length} notes</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-muted-foreground">{project.statusLine || "Starting"}</span>
                                                <span className="text-muted-foreground">{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} className="h-2" />
                                        </div>
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleOpenDetail(project)}
                                        className="shrink-0"
                                    >
                                        View Details
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Project Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                {selectedProject && (
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <Badge className={cn("text-white", statusConfig[selectedProject.status as keyof typeof statusConfig].color)}>
                                    {statusConfig[selectedProject.status as keyof typeof statusConfig].label}
                                </Badge>
                            </div>
                            <DialogTitle className="text-xl">{selectedProject.title}</DialogTitle>
                            <DialogDescription>
                                Client: {selectedProject.client?.name || 'Unknown'} • Service: {selectedProject.order?.service || 'Custom Project'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Team & Collaboration */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Assigned Team</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.assignees?.map((assignee: any) => (
                                        <div key={assignee._id} className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-full border">
                                            <div className="h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                {assignee.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <span className="text-xs font-medium">
                                                {assignee.name} {assignee._id === user?.id && "(You)"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl">
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Deal Value</span>
                                    <span className="font-semibold text-green-600">${selectedProject.dealValue}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Due Date</span>
                                    <span>{selectedProject.dueDate ? formatDate(selectedProject.dueDate) : 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Media Specs</span>
                                    <span>{selectedProject.mediaSpecs?.duration} • {selectedProject.mediaSpecs?.ratio}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Progress</span>
                                    <span className="font-bold text-orange-500">{selectedProject.progress}%</span>
                                </div>
                            </div>

                            {/* Tasks Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Project Tasks</Label>
                                    <Badge variant="outline" className="text-[10px]">{selectedProject.tasks?.length || 0} Total</Badge>
                                </div>
                                
                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                    {selectedProject.tasks?.length === 0 ? (
                                        <div className="text-center py-6 border-2 border-dashed rounded-xl bg-muted/10">
                                            <p className="text-xs text-muted-foreground italic">No tasks created yet</p>
                                        </div>
                                    ) : (
                                        selectedProject.tasks?.map((task: any) => (
                                            <div key={task._id} className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                                task.status === 'done' ? "bg-green-500/5 border-green-500/20" : "bg-white border-muted shadow-sm"
                                            )}>
                                                <button 
                                                    onClick={() => {
                                                        const nextStatus = task.status === 'done' ? 'todo' : 'done';
                                                        updateTaskStatusMutation({ taskId: task._id, status: nextStatus as any });
                                                    }}
                                                    className={cn(
                                                        "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                                                        task.status === 'done' ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground/30 hover:border-green-500"
                                                    )}
                                                >
                                                    {task.status === 'done' && <Check size={14} />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm font-bold truncate",
                                                        task.status === 'done' && "line-through text-muted-foreground"
                                                    )}>{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge variant="outline" className="text-[8px] h-4 uppercase px-1">
                                                            {task.priority}
                                                        </Badge>
                                                        {task.dueDate && (
                                                            <span className="text-[9px] text-muted-foreground">Due: {formatRelativeDate(task.dueDate)}</span>
                                                        )}
                                                    </div>
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

                            {/* Drive Links */}
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Raw Assets</Label>
                                    {selectedProject.driveLinks.raw ? (
                                        <a 
                                            href={selectedProject.driveLinks.raw} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                                        >
                                            <FolderOpen className="h-4 w-4" />
                                            Open Raw Assets
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No link provided</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Working Files</Label>
                                    <Input
                                        placeholder="Paste working drive link..."
                                        value={selectedProject.driveLinks.working}
                                        onChange={(e) => handleWorkingDriveUpdate(e.target.value)}
                                        className="text-xs h-8"
                                    />
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="space-y-3 border-t pt-4">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Activity History</Label>
                                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                                    {selectedProject.activityLog?.map((log: any) => (
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
                                    ))}
                                </div>
                            </div>

                            {/* Collaboration Chat */}
                            <div className="space-y-3 border-t pt-4 h-[300px]">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Collaboration Chat</Label>
                                <ChatInterface 
                                    projectId={selectedProject._id}
                                    title="Team Chat"
                                    showHead={false}
                                />
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <div className="flex-1 flex justify-start">
                                {selectedProject.status !== "done" && (
                                    <Button 
                                        onClick={handleStatusAdvance}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6"
                                        size="sm"
                                    >
                                        {selectedProject.status === "in-review" ? "MARK COMPLETE" : `ADVANCE TO ${statusFlow[statusFlow.indexOf(selectedProject.status as any) + 1]?.toUpperCase()}`}
                                    </Button>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsDetailOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
