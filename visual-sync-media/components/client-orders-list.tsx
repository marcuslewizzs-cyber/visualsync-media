"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileVideo, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDate } from "@/lib/order-service"

const getStatusConfig = (status: string) => {
    switch (status) {
        case "awaiting-quote":
            return {
                label: "Awaiting Quote",
                icon: Clock,
                badgeVariant: "secondary" as const,
            }
        case "quoted":
            return {
                label: "Quoted",
                icon: FileText,
                badgeVariant: "default" as const,
            }
        case "in-progress":
            return {
                label: "In Progress",
                icon: FileText,
                badgeVariant: "default" as const,
            }
        case "completed":
            return {
                label: "Completed",
                icon: CheckCircle2,
                badgeVariant: "outline" as const,
            }
        default:
            return {
                label: "Pending",
                icon: AlertCircle,
                badgeVariant: "secondary" as const,
            }
    }
}

export function ClientOrdersList() {
    const { user } = useAuth()
    const orders = useQuery(api.orders.getClientOrders)

    if (orders === undefined) {
        return <div className="text-center py-8">Loading orders...</div>
    }

    return (
        <>
            {orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order) => {
                            const statusConfig = getStatusConfig(order.status)
                            const StatusIcon = statusConfig.icon

                            return (
                                <Card key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold">
                                                        {order.title}
                                                    </h3>
                                                    <Badge variant={statusConfig.badgeVariant}>
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Service:{" "}
                                                    <span className="font-medium">
                                                        {order.service.toUpperCase().replace(/-/g, " ")}
                                                    </span>
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                                                    <div>
                                                        <span className="font-medium">Created:</span>{" "}
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                    {order.dueDate && (
                                                        <div>
                                                            <span className="font-medium">Due:</span>{" "}
                                                            {formatDate(order.dueDate)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Link href={`/client/orders/${order._id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileVideo className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-6 text-center">
                            Create your first order to get started with our Quote Wizard
                        </p>
                        <Link href="/client/orders/create">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                Create Your First Order
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
