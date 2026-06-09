import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 0) return ""
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
export function formatRelativeDate(dateStr: string) {
    if (!dateStr) return "N/A"
    try {
        const date = new Date(dateStr)
        const now = new Date()
        
        // Reset hours to compare dates only
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const n = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        const diffTime = d.getTime() - n.getTime()
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        if (diffDays === -1) return "Yesterday"
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch (e) {
        return dateStr
    }
}

export function formatChatDate(dateStr: string) {
    if (!dateStr) return ""
    try {
        const date = new Date(dateStr)
        const now = new Date()
        
        const isToday = date.toDateString() === now.toDateString()
        
        const yesterday = new Date()
        yesterday.setDate(now.getDate() - 1)
        const isYesterday = date.toDateString() === yesterday.toDateString()
        
        if (isToday) return "Today"
        if (isYesterday) return "Yesterday"
        
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffInDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'long' })
        }
        
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch (e) {
        return dateStr
    }
}

export type DeadlineStatus =
    | 'overdue'
    | 'due-soon'
    | 'on-track'
    | 'completed-late'
    | 'completed-ontime'
    | 'none'

const DEADLINE_SORT_ORDER: Record<DeadlineStatus, number> = {
    'overdue': 0,
    'due-soon': 1,
    'on-track': 2,
    'completed-late': 3,
    'completed-ontime': 4,
    'none': 5,
}

/**
 * Computes the deadline status for a project.
 * @param dueDate - ISO date string e.g. "2026-06-15"
 * @param isCompleted - whether project status === "done"
 * @param completedAt - Unix ms timestamp of when the project was marked done (updatedAt)
 */
export function getDeadlineStatus(
    dueDate?: string | null,
    isCompleted = false,
    completedAt?: number
): {
    status: DeadlineStatus
    daysLeft: number | null
    label: string
    sortOrder: number
} {
    if (!dueDate) {
        return { status: 'none', daysLeft: null, label: 'No deadline', sortOrder: DEADLINE_SORT_ORDER['none'] }
    }

    const due = new Date(dueDate)
    // Normalise to start-of-day for day-level comparisons
    due.setHours(0, 0, 0, 0)

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const daysLeft = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (isCompleted) {
        const refTime = completedAt ?? Date.now()
        const wasOnTime = refTime <= new Date(dueDate).setHours(23, 59, 59, 999)
        if (wasOnTime) {
            return { status: 'completed-ontime', daysLeft, label: 'Completed on time', sortOrder: DEADLINE_SORT_ORDER['completed-ontime'] }
        } else {
            return { status: 'completed-late', daysLeft, label: 'Completed late', sortOrder: DEADLINE_SORT_ORDER['completed-late'] }
        }
    }

    if (daysLeft < 0) {
        return { status: 'overdue', daysLeft, label: `${Math.abs(daysLeft)}d overdue`, sortOrder: DEADLINE_SORT_ORDER['overdue'] }
    }
    if (daysLeft <= 2) {
        return { status: 'due-soon', daysLeft, label: daysLeft === 0 ? 'Due today' : `${daysLeft}d left`, sortOrder: DEADLINE_SORT_ORDER['due-soon'] }
    }
    return { status: 'on-track', daysLeft, label: `${daysLeft}d left`, sortOrder: DEADLINE_SORT_ORDER['on-track'] }
}

