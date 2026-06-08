// Project Service - Links quoted orders to production pipeline
import { Order, getOrders, updateOrder } from "./order-service"

export interface Project {
    id: string
    orderId: string
    title: string
    description: string
    clientName: string
    clientEmail: string
    dealValue: number
    status: "todo" | "in-progress" | "in-review" | "done"
    assigneeIds: string[]
    progress: number
    dueDate?: string
    driveLinks: {
        raw: string
        working: string
    }
    mediaSpecs: {
        duration: string
        ratio: "9:16" | "16:9"
    }
    internalNotes: string[]
    statusLine: string
    readyForClient: boolean
    createdAt: string
    service: string
}

const PROJECTS_STORAGE_KEY = "universal_media_projects"

export function getProjects(): Project[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

export function saveProjects(projects: Project[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
}

export function getQuotedOrders(): Order[] {
    const orders = getOrders()
    return orders.filter(order => order.status === "quoted" && !isOrderConvertedToProject(order.id))
}

function isOrderConvertedToProject(orderId: string): boolean {
    const projects = getProjects()
    return projects.some(p => p.orderId === orderId)
}

export function createProject(orderId: string, assigneeIds: string[]): Project | null {
    const orders = getOrders()
    const order = orders.find(o => o.id === orderId)

    if (!order) return null
    if (order.status !== "quoted") return null

    const project: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        title: order.title,
        description: order.requirements,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        dealValue: order.quote?.price || 0,
        status: "todo",
        assigneeIds,
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
        createdAt: new Date().toISOString(),
        service: order.service,
    }

    const projects = getProjects()
    projects.push(project)
    saveProjects(projects)

    return project
}

export function getProjectById(id: string): Project | undefined {
    const projects = getProjects()
    return projects.find(p => p.id === id)
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = getProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) return null

    projects[index] = { ...projects[index], ...updates }
    saveProjects(projects)
    return projects[index]
}

export function getEditorProjects(editorId: string): Project[] {
    const projects = getProjects()
    return projects.filter(p => p.assigneeIds.includes(editorId))
}

export function getActiveProjects(): Project[] {
    const projects = getProjects()
    return projects.filter(p => p.status !== "done")
}

export function updateProjectStatus(
    projectId: string,
    status: Project["status"],
    progress?: number,
    statusLine?: string
): Project | null {
    const updates: Partial<Project> = { status }
    if (progress !== undefined) updates.progress = progress
    if (statusLine !== undefined) updates.statusLine = statusLine

    return updateProject(projectId, updates)
}

export function addProjectNote(projectId: string, note: string): Project | null {
    const project = getProjectById(projectId)
    if (!project) return null

    return updateProject(projectId, {
        internalNotes: [...project.internalNotes, note],
    })
}
