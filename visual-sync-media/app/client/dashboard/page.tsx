"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    FolderKanban,
    Clock,
    CheckCircle2,
    ArrowRight,
    MessageSquare,
    ChevronRight,
    Box,
    Loader2,
    User,
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

// ─── Mobile 2×2 stat card ───────────────────────────────────────────────────
function MobileStatCard({ label, value, sub, icon: Icon, bg, iconBg }: any) {
    return (
        <div className={`relative rounded-2xl bg-gradient-to-br ${bg} p-4 text-white overflow-hidden`}>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
            <div className={`inline-flex items-center justify-center h-8 w-8 rounded-xl ${iconBg} mb-3`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{label}</p>
            <p className="text-3xl font-extrabold leading-tight mt-0.5">{value}</p>
            <p className="text-[11px] opacity-70 mt-0.5">{sub}</p>
        </div>
    )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ClientDashboardPage() {
    const orders = useQuery(api.orders.getClientOrders)
    const projects = useQuery(api.projects.getEditorProjects)
    const unreadCount = useQuery(api.messages.getTotalUnreadCount)
    const user = useQuery(api.users.getCurrentUser)

    if (orders === undefined || projects === undefined || unreadCount === undefined || user === undefined) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const activeProjects = projects.filter(p => p.status !== "done")
    const inReviewProjects = projects.filter(p => p.status === "in-review")
    const completedProjects = projects.filter(p => p.status === "done")

    const stats = [
        {
            label: "Active Projects",
            value: activeProjects.length.toString(),
            sub: "Currently in production",
            icon: FolderKanban,
            bg: "from-orange-500 to-rose-500",
            iconBg: "bg-white/20",
        },
        {
            label: "In Review",
            value: inReviewProjects.length.toString(),
            sub: "Awaiting approval",
            icon: Clock,
            bg: "from-emerald-500 to-teal-500",
            iconBg: "bg-white/20",
        },
        {
            label: "Messages",
            value: unreadCount.toString(),
            sub: "Unread updates",
            icon: MessageSquare,
            bg: "from-blue-500 to-violet-500",
            iconBg: "bg-white/20",
        },
        {
            label: "Completed",
            value: completedProjects.length.toString(),
            sub: "Total delivered",
            icon: CheckCircle2,
            bg: "from-purple-500 to-fuchsia-500",
            iconBg: "bg-white/20",
        },
    ]

    const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

    return (
        <>
            {/* ══════════ MOBILE LAYOUT (hidden on md+) ══════════ */}
            <div className="md:hidden space-y-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome, {user?.name?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">Here&apos;s your portal overview</p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-xl h-10">
                        <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
                        <TabsTrigger value="orders" className="rounded-lg text-xs font-semibold">Projects</TabsTrigger>
                    </TabsList>

                    {/* ── Overview tab ── */}
                    <TabsContent value="overview" className="space-y-5 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((stat) => (
                                <MobileStatCard key={stat.label} {...stat} />
                            ))}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-base">Recent Orders</p>
                                <Link href="/client/orders" className="text-xs text-primary font-semibold">
                                    View all
                                </Link>
                            </div>
                            <div className="rounded-2xl border bg-card divide-y overflow-hidden">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <Link
                                            key={order._id}
                                            href={`/client/orders`}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <Box className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{order.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge
                                                    variant={order.status === "quoted" ? "default" : "secondary"}
                                                    className="text-[10px] px-2 py-0.5"
                                                >
                                                    {order.status}
                                                </Badge>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-sm text-muted-foreground">
                                        No recent orders
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ── Projects tab ── */}
                    <TabsContent value="orders" className="mt-4 space-y-3">
                        <div className="rounded-2xl border bg-card divide-y overflow-hidden">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <div key={project._id} className="px-4 py-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-sm truncate">{project.title}</p>
                                            </div>
                                            <Badge
                                                variant={project.status === "in-review" ? "default" : "secondary"}
                                                className="ml-3 shrink-0 text-[10px] capitalize"
                                            >
                                                {project.status.replace("-", " ")}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress value={project.progress} className="flex-1 h-2" />
                                            <span className="text-xs font-bold text-muted-foreground w-9 text-right">
                                                {project.progress}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    No active projects
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ══════════ DESKTOP LAYOUT (hidden on mobile) ══════════ */}
            <div className="hidden md:block space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome, {user?.name?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-muted-foreground">Here&apos;s an overview of your projects and orders</p>
                </div>

                {/* Colorful gradient stat cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className={`relative rounded-2xl bg-gradient-to-br ${stat.bg} p-5 text-white overflow-hidden`}
                            >
                                <div className="absolute -bottom-5 -right-5 h-24 w-24 rounded-full bg-white/10" />
                                <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                                        {stat.label}
                                    </p>
                                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-white/20">
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <p className="text-4xl font-extrabold leading-none">{stat.value}</p>
                                <p className="text-xs opacity-70 mt-1.5">{stat.sub}</p>
                            </div>
                        )
                    })}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>Active Projects</CardTitle>
                            <CardDescription>Live status and progress tracking</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 pt-4">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <div key={project._id} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-lg">{project.title}</p>
                                            </div>
                                            <Badge 
                                                variant={project.status === "in-review" ? "default" : "secondary"}
                                                className="capitalize px-3 py-1"
                                            >
                                                {project.status.replace("-", " ")}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Progress value={project.progress} className="flex-1 h-2.5" />
                                            <span className="text-sm font-bold w-12 text-right">{project.progress}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                    No projects in production yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
