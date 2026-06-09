"use client"

import { useState } from "react"
import { Calendar, AlertCircle, CheckCircle2, Clock, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn, getDeadlineStatus, DeadlineStatus } from "@/lib/utils"

const STATUS_CONFIG: Record<DeadlineStatus, {
    icon: React.ElementType
    badge: string
    dot: string
}> = {
    'overdue': {
        icon: AlertCircle,
        badge: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
        dot: "bg-red-500",
    },
    'due-soon': {
        icon: Clock,
        badge: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
        dot: "bg-amber-500",
    },
    'on-track': {
        icon: Calendar,
        badge: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
        dot: "bg-green-500",
    },
    'completed-ontime': {
        icon: CheckCircle2,
        badge: "bg-green-100 text-green-700 border-green-200",
        dot: "bg-green-500",
    },
    'completed-late': {
        icon: Clock,
        badge: "bg-amber-50 text-amber-600 border-amber-100",
        dot: "bg-amber-400",
    },
    'none': {
        icon: Minus,
        badge: "bg-muted text-muted-foreground border-border",
        dot: "bg-muted-foreground/30",
    },
}

interface DeadlineChipProps {
    dueDate?: string | null
    /** Pass project.updatedAt when project is done for accurate on-time calculation */
    completedAt?: number
    isCompleted: boolean
    /** Set true only for admin — enables the edit popover */
    isAdmin?: boolean
    /** Called with new date string (e.g. "2026-06-20") or null to clear */
    onSave?: (date: string | null) => Promise<void>
    className?: string
}

export function DeadlineChip({
    dueDate,
    completedAt,
    isCompleted,
    isAdmin = false,
    onSave,
    className,
}: DeadlineChipProps) {
    const { status, label } = getDeadlineStatus(dueDate, isCompleted, completedAt)
    const config = STATUS_CONFIG[status]
    const Icon = config.icon

    const [open, setOpen] = useState(false)
    const [dateInput, setDateInput] = useState(dueDate ?? "")
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (!onSave) return
        setSaving(true)
        try {
            await onSave(dateInput || null)
            setOpen(false)
        } finally {
            setSaving(false)
        }
    }

    const handleClear = async () => {
        if (!onSave) return
        setSaving(true)
        try {
            await onSave(null)
            setDateInput("")
            setOpen(false)
        } finally {
            setSaving(false)
        }
    }

    const chip = (
        <Badge
            variant="outline"
            className={cn(
                "gap-1 text-[10px] font-semibold px-2 py-0.5 h-5 border select-none",
                config.badge,
                isAdmin && !isCompleted && "cursor-pointer",
                className
            )}
        >
            <Icon className="h-2.5 w-2.5 shrink-0" />
            {label}
        </Badge>
    )

    // Read-only for editors/clients and for completed projects
    if (!isAdmin || isCompleted) return chip

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{chip}</PopoverTrigger>
            <PopoverContent className="w-64 p-3 space-y-3" side="top" align="start">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Set Deadline
                    </p>
                    <input
                        type="date"
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        value={dateInput}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDateInput(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black"
                        disabled={!dateInput || saving}
                        onClick={handleSave}
                    >
                        {saving ? "Saving…" : "Save"}
                    </Button>
                    {dueDate && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            disabled={saving}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
