"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Inbox, Clock } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDate } from "@/lib/order-service"

export default function AdminRequestsPage() {
    const user = useQuery(api.users.getCurrentUser)
    const orders = useQuery(api.orders.getPendingOrders)
    const allOrders = useQuery(api.orders.getAllOrders)

    if (orders === undefined || user === undefined) {
        return <div className="text-center py-8">Loading incoming requests...</div>
    }

    // Debug info (remove later)
    console.log("AdminRequestsPage Debug:", {
        userRole: user?.role,
        pendingOrdersCount: orders?.length,
        allOrdersCount: allOrders?.length,
        hasIdentity: !!user
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
                <p className="text-muted-foreground">
                    Review client order requests and provide quotes
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    AWAITING QUOTES
                                </p>
                                <p className="text-3xl font-bold">{orders.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    TOTAL REQUESTS
                                </p>
                                <p className="text-3xl font-bold">{orders.length}</p>
                            </div>
                            <Inbox className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                    THIS WEEK
                                </p>
                                <p className="text-3xl font-bold">
                                    {orders.filter((order) => {
                                        const createdDate = new Date(order.createdAt)
                                        const oneWeekAgo = new Date()
                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
                                        return createdDate > oneWeekAgo
                                    }).length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests List */}
            {orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <Card key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold">
                                                {order.title}
                                            </h3>
                                            <Badge variant="secondary">
                                                <Clock className="mr-1 h-3 w-3" />
                                                Awaiting Quote
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                    CLIENT
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.client?.name || "Unknown Client"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.client?.email || "No Email"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                    SERVICE TYPE
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.service.toUpperCase().replace(/-/g, " ")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                                                REQUIREMENTS
                                            </p>
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {order.requirements}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                            <div>
                                                <span className="font-medium">Platforms:</span>{" "}
                                                {order.targetPlatforms?.join(", ") || "None"}
                                            </div>
                                            <div>
                                                <span className="font-medium">Style:</span>{" "}
                                                {order.stylePreset || "None"}
                                            </div>
                                            <div>
                                                <span className="font-medium">Requested:</span>{" "}
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/admin/requests/${order._id}`}>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                            Review & Quote
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : allOrders && allOrders.length > 0 ? (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                        <p className="font-bold mb-1">Debug Info:</p>
                        <p>No orders are currently in &quot;awaiting-quote&quot; status, but {allOrders.length} orders were found in the database. Showing them below with their current status.</p>
                    </div>
                    <div className="grid gap-4">
                        {allOrders.map((order) => (
                            <Card key={order._id} className="opacity-80">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{order.title}</h3>
                                            <p className="text-sm text-muted-foreground">{order.client?.name || "Unknown Client"} • {order.service}</p>
                                        </div>
                                        <Badge variant="outline" className="capitalize">{order.status.replace(/-/g, " ")}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Incoming Requests</h3>
                        <p className="text-muted-foreground text-center">
                            No orders were found in the database.
                        </p>
                        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-500">
                            Current Role: <span className="font-bold">{user?.role || "Unknown"}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
