
"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Plus,
    Calendar,
    Settings,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Video,
    Film,
    PlayCircle,
    MessageSquare,
    Paperclip,
    BarChart3,
    ArrowRight,
    Forward,
    Share2,
    Bell,
    Sparkles,
    Briefcase
} from "lucide-react"
import { getInitials, formatRelativeDate } from "@/lib/utils"
import { ChatInterface } from "@/components/chat-interface"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
} from "recharts"

interface ThreadMessage {
    id: string
    sender: {
        name: string
        avatar: string
        role: 'admin' | 'client' | 'editor'
    }
    content: string
    time: string
}

interface ProjectData {
    id: string
    title: string
    project: string
    time: string
    priority: string
    status: string
    comments: number
    attachments: number
    assignees: string[]
    thread: ThreadMessage[]
}

const projectsData: ProjectData[] = [
    {
        id: "p1",
        title: "Final Cut Review for 'Urban Pulse' Doc",
        project: "LumenForge",
        time: "In 2h 16m",
        priority: "High",
        status: "In Progress",
        comments: 3,
        attachments: 5,
        assignees: ["/avatars/01.png", "/avatars/02.png"],
        thread: [
            {
                id: "m1",
                sender: { name: "LumenForge Client", avatar: "/avatars/05.png", role: "client" },
                content: "Just uploaded the clearer voiceover files. Let me know if they sync well.",
                time: "2h ago"
            },
            {
                id: "m2",
                sender: { name: "Olivia Bennett", avatar: "/avatars/01.png", role: "editor" },
                content: "Received. They sound much better. I'm swapping them in now for the final mix.",
                time: "1h ago"
            },
            {
                id: "m3",
                sender: { name: "You", avatar: "/avatars/shadcn.jpg", role: "admin" },
                content: "Great. Please prioritize the intro sequence sync.",
                time: "Just now"
            }
        ]
    },
    {
        id: "p2",
        title: "Sound Design for Nike Summer Commercial",
        project: "Nike Campaign",
        time: "In 3h 25m",
        priority: "Medium",
        status: "Todo",
        comments: 1,
        attachments: 2,
        assignees: ["/avatars/03.png"],
        thread: [
            {
                id: "m1",
                sender: { name: "Nike Rep", avatar: "/avatars/06.png", role: "client" },
                content: "We need more bass in the shoe impact sound effects.",
                time: "5h ago"
            }
        ]
    },
    {
        id: "p3",
        title: "VFX Compositing for 'Echoes' Music Video",
        project: "Sony Music",
        time: "In 4h 12m",
        priority: "Medium",
        status: "Todo",
        comments: 4,
        attachments: 1,
        assignees: ["/avatars/04.png", "/avatars/05.png"],
        thread: []
    },
    {
        id: "p4",
        title: "Color Grading for Indie Short Film",
        project: "Pixeltrove",
        time: "No due date",
        priority: "Low",
        status: "Todo",
        comments: 0,
        attachments: 0,
        assignees: ["/avatars/06.png"],
        thread: []
    }
]

const editors = [
    { name: "Olivia Bennett", avatar: "/avatars/01.png", load: 90, role: "Senior Editor" },
    { name: "Daniel Morgan", avatar: "/avatars/02.png", load: 68, role: "Colorist" },
    { name: "Sophie Kim", avatar: "/avatars/03.png", load: 55, role: "Sound Engineer" },
    { name: "Michael Torres", avatar: "/avatars/04.png", load: 45, role: "Motion Graphics" },
]

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

const userGrowthData = [
    { month: 'Jan', users: 45 },
    { month: 'Feb', users: 52 },
    { month: 'Mar', users: 48 },
    { month: 'Apr', users: 61 },
    { month: 'May', users: 55 },
    { month: 'Jun', users: 67 },
    { month: 'Jul', users: 82 },
]

const salesData = [
    { category: 'Editing', revenue: 4200 },
    { category: 'VFX', revenue: 3800 },
    { category: 'Sound', revenue: 2900 },
    { category: 'Coloring', revenue: 3100 },
    { category: 'Motion', revenue: 2400 },
]

const calendarEvents = [
    { date: '2026-02-10', title: 'LumenForge Final Polish', type: 'deadline' },
    { date: '2026-02-12', title: 'Client Meeting: Nike', type: 'meeting' },
    { date: '2026-02-15', title: 'Sony Music Video Launch', type: 'event' },
]

export default function DashboardPage() {
    const stats = useQuery(api.admin.getDashboardStats)
    const liveProjects = useQuery(api.admin.getDashboardProjects) || []
    const pendingOrders = useQuery(api.orders.getPendingOrders) || []
    
    const [forwardingRequest, setForwardingRequest] = useState<any>(null)
    const [selectedProject, setSelectedProject] = useState<any>(null)

    const handleAssign = (editor: any) => {
        toast.success(`Forwarded "${forwardingRequest.request}" to ${editor.name} `)
        setForwardingRequest(null)
    }

    return (
        <div className="flex-1 space-y-6 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black rounded-full px-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-0 gap-6 h-auto">
                        <TabsTrigger
                            value="overview"
                            className="bg-transparent data-[state=active]:bg-muted/40 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="team"
                            className="bg-transparent data-[state=active]:bg-muted/40 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
                        >
                            Team
                        </TabsTrigger>
                        <TabsTrigger
                            value="projects"
                            className="bg-transparent data-[state=active]:bg-muted/40 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
                        >
                            Projects
                        </TabsTrigger>
                        <TabsTrigger
                            value="insights"
                            className="bg-transparent data-[state=active]:bg-muted/40 data-[state=active]:shadow-none rounded-full px-4 py-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
                        >
                            Insights
                        </TabsTrigger>
                    </TabsList>
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-full h-9">
                            <Settings className="mr-2 h-3.5 w-3.5" /> Customize
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full h-9">
                            <Calendar className="mr-2 h-3.5 w-3.5" /> Last week
                        </Button>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <KPICard
                            title="Videos Produced"
                            value={stats?.totalProduced?.toString() || "0"}
                            change="+3.2%"
                            trend="up"
                            icon={<Video className="h-4 w-4 text-purple-500" />}
                            chartColor="bg-purple-500"
                        />
                        <KPICard
                            title="On-Time Delivery"
                            value={`${stats?.onTimeDelivery || 0}%`}
                            change="+6.5%"
                            trend="up"
                            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                            chartColor="bg-green-500"
                        />
                        <Card className="rounded-2xl border bg-card/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Pending Approvals</span>
                                        <Clock className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-bold">{stats?.pendingApprovals || 0}</div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                                                    <AvatarImage src={`/avatars/0${i}.png`} />
                                                    <AvatarFallback>U{i}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium transition-colors hover:bg-muted/80">
                                                +4
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border bg-card/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Missed Deadlines</span>
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-bold">2</div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-100 font-normal px-2 py-1">
                                                LumenForge
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">+1</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column: Active Projects */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Active Projects Queue</h3>
                                <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground rounded-full h-8">
                                    View all
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {liveProjects.length === 0 ? (
                                    <div className="p-12 text-center border-2 border-dashed rounded-2xl opacity-50">
                                        <p className="font-medium">No active projects in queue.</p>
                                    </div>
                                ) : (
                                    liveProjects.map((project: any) => (
                                        <ProjectCard
                                            key={project._id}
                                            id={project._id}
                                            title={project.title}
                                            project={project.clientName}
                                            time={new Date(project.createdAt).toLocaleDateString()}
                                            priority="Medium"
                                            status={project.status}
                                            comments={0}
                                            attachments={0}
                                            assignees={project.assigneeDetails.map((a: any) => a.image || "")}
                                            onClick={() => setSelectedProject(project)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Column: Widgets */}
                        <div className="space-y-6">
                            {/* Editor Availability */}
                            <Card className="rounded-2xl border-none shadow-none bg-transparent">
                                <div className="flex items-center justify-between mb-4 px-4">
                                    <h3 className="text-lg font-semibold">Editor Availability</h3>
                                    <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground rounded-full h-8">
                                        View all
                                    </Button>
                                </div>
                                <div className="bg-card rounded-2xl border p-5 space-y-6">
                                    <AvailabilityRow
                                        name="Olivia Bennett"
                                        avatar="/avatars/01.png"
                                        load={90}
                                        color="bg-red-500"
                                    />
                                    <AvailabilityRow
                                        name="Daniel Morgan"
                                        avatar="/avatars/02.png"
                                        load={68}
                                        color="bg-green-500"
                                    />
                                    <AvailabilityRow
                                        name="Sophie Kim"
                                        avatar="/avatars/03.png"
                                        load={55}
                                        color="bg-green-500"
                                    />
                                </div>
                            </Card>

                            {/* Incoming Requests (Admin Triage) */}
                            <Card className="rounded-2xl border-none shadow-none bg-transparent">
                                <div className="flex items-center justify-between mb-4 px-4">
                                    <h3 className="text-lg font-semibold">Incoming Requests</h3>
                                    {stats?.awaitingQuotes && stats.awaitingQuotes > 0 ? (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">{stats.awaitingQuotes} New</Badge>
                                    ) : null}
                                </div>
                                <div className="bg-card rounded-2xl border p-5 space-y-6">
                                    {pendingOrders.length === 0 ? (
                                        <div className="py-4 text-center opacity-50">
                                            <p className="text-xs">No new requests</p>
                                        </div>
                                    ) : (
                                        pendingOrders.slice(0, 3).map((order: any) => (
                                            <RequestItem
                                                key={order._id}
                                                client={order.client?.name || "Unknown"}
                                                request={order.title}
                                                time={formatRelativeDate(new Date(order.createdAt).toISOString())}
                                                details={order.requirements}
                                                priority="high"
                                                onForward={() => setForwardingRequest({ client: order.client?.name, request: order.title })}
                                            />
                                        ))
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Team Overview</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member) => (
                            <TeamMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">My Personal Projects</h2>
                        <Button variant="outline" size="sm" className="rounded-full">
                            <Settings className="mr-2 h-3.5 w-3.5" /> Manage View
                        </Button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projectsData.slice(0, 3).map((project) => (
                            <ProjectCard
                                key={project.id}
                                {...project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                    {/* Insights Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Performance Insights</h2>
                            <p className="text-muted-foreground text-sm">Real-time analytics for your production studio.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Share2 className="mr-2 h-3.5 w-3.5" /> Export Report
                            </Button>
                        </div>
                    </div>

                    {/* KPI Analytics Row */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <KPICard
                            title="Total Revenue"
                            value="$24,500"
                            change="+12.5%"
                            trend="up"
                            icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
                            chartColor="bg-blue-500"
                        />
                        <KPICard
                            title="Active Projects"
                            value="12"
                            change="+2"
                            trend="up"
                            icon={<Briefcase className="h-4 w-4 text-orange-500" />}
                            chartColor="bg-orange-500"
                        />
                        <KPICard
                            title="Client Satisfaction"
                            value="4.9/5"
                            change="+0.2"
                            trend="up"
                            icon={<Sparkles className="h-4 w-4 text-green-500" />}
                            chartColor="bg-green-500"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* User Growth Chart */}
                        <Card className="rounded-2xl border bg-card shadow-sm p-6">
                            <div className="mb-6">
                                <h3 className="font-semibold text-base">User Growth</h3>
                                <p className="text-xs text-muted-foreground">New user signups per month</p>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={userGrowthData}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: 'currentColor' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            hide
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid hsl(var(--border))',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                backgroundColor: 'hsl(var(--card))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                            itemStyle={{ color: '#3b82f6' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Revenue by Service Chart */}
                        <Card className="rounded-2xl border bg-card shadow-sm p-6">
                            <div className="mb-6">
                                <h3 className="font-semibold text-base">Service Revenue</h3>
                                <p className="text-xs text-muted-foreground">Top performing categories by sales</p>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="category"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: 'currentColor' }}
                                            width={80}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid hsl(var(--border))',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                backgroundColor: 'hsl(var(--card))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                        />
                                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                            {salesData.map((entry, index) => {
                                                const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#6366f1']
                                                return (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                )
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Schedule & Calendar Section */}
                    <div className="grid gap-6 md:grid-cols-7">
                        <Card className="rounded-2xl border bg-card shadow-sm p-6 md:col-span-3 flex flex-col items-center">
                            <h3 className="font-semibold text-base mb-4 w-full">Event Calendar</h3>
                            <CalendarComponent
                                mode="single"
                                selected={new Date()}
                                className="rounded-md border-none"
                            />
                        </Card>
                        <Card className="rounded-2xl border bg-card shadow-sm p-6 md:col-span-4">
                            <h3 className="font-semibold text-base mb-4">Upcoming Schedule</h3>
                            <div className="space-y-4">
                                {calendarEvents.map((event, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                                        <div className={`p-2 rounded-lg ${event.type === 'deadline' ? 'bg-red-100 text-red-600' :
                                            event.type === 'meeting' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{event.title}</div>
                                            <div className="text-xs text-muted-foreground">{event.date}</div>
                                        </div>
                                        <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            View
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={!!forwardingRequest} onOpenChange={(open) => !open && setForwardingRequest(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Forward to Editor</DialogTitle>
                        <DialogDescription>
                            Select an editor to handle the <strong>{forwardingRequest?.request}</strong> from {forwardingRequest?.client}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        {editors.map((editor) => (
                            <div
                                key={editor.name}
                                onClick={() => handleAssign(editor)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={editor.avatar} />
                                        <AvatarFallback>{editor.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${editor.load > 80 ? 'bg-red-500' : 'bg-green-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{editor.name}</h4>
                                        <span className="text-xs text-muted-foreground">{editor.load}% Load</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{editor.role}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                <DialogContent className="sm:max-w-[600px] flex flex-col h-[80vh] p-0 gap-0">
                    <DialogHeader className="p-6 border-b">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{selectedProject?.project || selectedProject?.clientName}</Badge>
                            <span className="text-xs text-muted-foreground">{selectedProject?.time}</span>
                        </div>
                        <DialogTitle className="text-xl leading-normal">{selectedProject?.title}</DialogTitle>
                        <DialogDescription>
                            Managed by {selectedProject?.assigneeDetails?.length || 0} team members
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden p-4">
                        <ChatInterface 
                            projectId={selectedProject?._id}
                            orderId={selectedProject?.orderId}
                            title={selectedProject?.title}
                            showHead={false}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}

function KPICard({ title, value, change, trend, icon, chartColor }: any) {
    return (
        <Card className="rounded-2xl border bg-card/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">{title}</span>
                        <Badge variant="secondary" className={`font-normal ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                            {change}
                        </Badge>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                        <div className="text-3xl font-bold">{value}</div>
                        {/* Abstract Bar Chart Visualization */}
                        <div className="flex items-end gap-1 h-8">
                            {[40, 70, 45, 90, 60].map((h, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 rounded-t-sm ${chartColor} opacity-80`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ProjectCard({ title, project, time, priority, status, comments, attachments, assignees, onClick }: any) {
    const priorityColors = {
        High: "bg-red-50 text-red-700 border-red-100",
        Medium: "bg-blue-50 text-blue-700 border-blue-100",
        Low: "bg-green-50 text-green-700 border-green-100"
    }

    return (
        <Card
            className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary/50"
            onClick={onClick}
        >
            <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="flex items-center gap-1 text-xs hover:text-foreground transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs hover:text-foreground transition-colors">
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>{attachments}</span>
                            </div>
                        </div>
                    </div>

                    <h4 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h4>

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`font-normal border ${priorityColors[priority as keyof typeof priorityColors]}`}>
                                {priority}
                            </Badge>
                            {status === "In Progress" && (
                                <Badge variant="outline" className="font-normal bg-yellow-50 text-yellow-700 border-yellow-100 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    In Progress
                                </Badge>
                            )}
                            {status === "Todo" && (
                                <Badge variant="outline" className="font-normal text-muted-foreground flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full border border-current" />
                                    Todo
                                </Badge>
                            )}
                            <Badge variant="secondary" className="font-normal bg-muted text-muted-foreground">
                                {project}
                            </Badge>
                        </div>

                        <div className="flex -space-x-2">
                            {assignees.map((src: string, i: number) => (
                                <Avatar key={i} className="h-7 w-7 border-2 border-background">
                                    <AvatarImage src={src} />
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function AvailabilityRow({ name, avatar, load, color }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${load < 80 ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{name}</span>
                    <span className="text-xs font-bold">{load}%</span>
                </div>
                <Progress value={load} className={`h-1.5 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    )
}

function RequestItem({ client, request, time, details, priority, onForward }: any) {
    return (
        <div className="flex gap-3 items-start group">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 shrink-0">
                {priority === 'high' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{client}</span>
                    <span className="text-xs text-muted-foreground">{time}</span>
                </div>
                <div className="text-sm font-medium">{request}</div>
                <p className="text-xs text-muted-foreground leading-snug">
                    {details}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 text-xs gap-1 rounded-full w-full sm:w-auto hover:bg-primary hover:text-white transition-colors"
                    onClick={onForward}
                >
                    <Share2 className="w-3 h-3" />
                    Forward to Editor
                </Button>
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

