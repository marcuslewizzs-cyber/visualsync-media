"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface TeamMember {
    id: string
    name: string
    role: string
    avatar: string
    currentTask: string
    project: string
    hoursLogged: number
    capacity: number
    status: 'online' | 'busy' | 'offline'
}

const teamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Olivia Bennett",
        role: "Senior Editor",
        avatar: "/avatars/01.png",
        currentTask: "Reviewing final cut for LumenForge",
        project: "LumenForge Launch",
        hoursLogged: 34,
        capacity: 40,
        status: "online"
    },
    {
        id: "2",
        name: "Daniel Morgan",
        role: "Colorist",
        avatar: "/avatars/02.png",
        currentTask: "Grading sequence 4 for Nike Ad",
        project: "Nike Summer Campaign",
        hoursLogged: 28,
        capacity: 40,
        status: "busy"
    },
    {
        id: "3",
        name: "Sophie Kim",
        role: "Sound Engineer",
        avatar: "/avatars/03.png",
        currentTask: "Mixing audio for EchoSuite tutorial",
        project: "EchoSuite Onboarding",
        hoursLogged: 38,
        capacity: 40,
        status: "busy"
    },
    {
        id: "4",
        name: "Michael Torres",
        role: "Motion Graphics",
        avatar: "/avatars/04.png",
        currentTask: "Animating logo reveal",
        project: "NebulaCart Identity",
        hoursLogged: 12,
        capacity: 20,
        status: "online"
    },
    {
        id: "5",
        name: "Emily Chen",
        role: "Junior Editor",
        avatar: "/avatars/05.png",
        currentTask: "Syncing rough cuts",
        project: "Internal Training",
        hoursLogged: 40,
        capacity: 40,
        status: "offline"
    },
    {
        id: "6",
        name: "James Wilson",
        role: "VFX Artist",
        avatar: "/avatars/06.png",
        currentTask: "Compositing green screen shots",
        project: "Sci-Fi Short",
        hoursLogged: 5,
        capacity: 35,
        status: "online"
    }
]

export default function TeamsPage() {
    return (
        <div className="flex-1 space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    )
}

function TeamMemberCard({ member }: { member: TeamMember }) {
    const usagePercent = (member.hoursLogged / member.capacity) * 100

    // Determine color based on usage
    let progressColor = "bg-green-500"
    if (usagePercent > 90) progressColor = "bg-red-500"
    else if (usagePercent > 75) progressColor = "bg-yellow-500"

    const statusColors = {
        online: "bg-green-500",
        busy: "bg-red-500",
        offline: "bg-gray-300"
    }

    return (
        <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-background">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusColors[member.status]}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base">{member.name}</h3>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Workload</span>
                            <span className="font-medium">{member.hoursLogged}/{member.capacity}h</span>
                        </div>
                        <Progress value={usagePercent} className={`h-2 ${progressColor.replace("bg-", "text-")}`} />
                    </div>

                    <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Focus</span>
                        </div>
                        <p className="text-sm font-medium leading-tight">{member.currentTask}</p>
                        <p className="text-xs text-muted-foreground">on <span className="text-foreground font-medium">{member.project}</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
