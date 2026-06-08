"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Download, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatDateTime } from "@/lib/order-service"
import { useAuth } from "@/hooks/use-auth"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { ChatInterface } from "@/components/chat-interface"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const { user } = useAuth()
    
    // Check if it's a legacy ID from local storage
    const isLegacyId = id.startsWith("order_")
    
    const orderId = isLegacyId ? undefined : (id as Id<"orders">)
    const order = useQuery(api.orders.getOrderById, orderId ? { orderId } : "skip")

    if (isLegacyId) {
        return (
            <div className="space-y-6">
                <Link
                    href="/client/orders"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Legacy Order Not Found</p>
                        <p className="text-muted-foreground text-center mt-2">
                            This order was created on an older system and is no longer available.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (order === undefined) {
        return <div className="text-center py-8">Loading order...</div>
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <Link
                    href="/client/orders"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Order not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "awaiting-quote":
                return {
                    label: "Awaiting Quote",
                    color: "bg-yellow-100 text-yellow-800",
                }
            case "quoted":
                return {
                    label: "Quoted",
                    color: "bg-blue-100 text-blue-800",
                }
            case "in-progress":
                return {
                    label: "In Progress",
                    color: "bg-blue-100 text-blue-800",
                }
            case "completed":
                return {
                    label: "Completed",
                    color: "bg-green-100 text-green-800",
                }
            default:
                return {
                    label: "Pending",
                    color: "bg-gray-100 text-gray-800",
                }
        }
    }

    const statusConfig = getStatusConfig(order.status)

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/client/orders"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
            </Link>

            {/* Header — status badge inline with title */}
            <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                        {order.title}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                </div>
                <p className="text-muted-foreground text-sm">Order #{order._id}</p>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="quote">
                        {order.quote ? "Quote" : "Awaiting Quote"}
                    </TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* Details Tab — card bleeds to screen edges on mobile */}
                <TabsContent value="details" className="space-y-4">
                    <div className="-mx-4 sm:mx-0">
                        <Card className="rounded-none sm:rounded-lg border-x-0 sm:border-x shadow-none sm:shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        SERVICE TYPE
                                    </p>
                                    <p className="text-base">{order.service.toUpperCase().replace(/-/g, " ")}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        PROJECT HEADLINE
                                    </p>
                                    <p className="text-base">{order.title}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-2">
                                    CORE REQUIREMENTS
                                </p>
                                <p className="text-base text-gray-700">
                                    {order.requirements}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        TARGET PLATFORMS
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.targetPlatforms?.map((platform: string) => (
                                            <Badge key={platform}>{platform}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        STYLE PRESET
                                    </p>
                                    <p className="text-base">{order.stylePreset?.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        CREATED
                                    </p>
                                    <p className="text-base">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        DUE DATE
                                    </p>
                                    <p className="text-base">{order.dueDate ? formatDate(order.dueDate) : "Not set"}</p>
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Quote Tab — card bleeds to screen edges on mobile */}
                <TabsContent value="quote">
                    {order.quote ? (
                        <div className="-mx-4 sm:mx-0">
                            <Card className="rounded-none sm:rounded-lg border-x-0 sm:border-x shadow-none sm:shadow">
                            <CardHeader>
                                <CardTitle>Quote Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                                            ESTIMATED PRICE
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            ${order.quote.price}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                                            ESTIMATED TIMELINE
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {order.quote.estimatedDays} Days
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        QUOTE DESCRIPTION
                                    </p>
                                    <p className="text-base">
                                        {order.quote.description}
                                    </p>
                                </div>
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Quote PDF
                                </Button>
                            </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="-mx-4 sm:mx-0">
                            <Card className="rounded-none sm:rounded-lg border-x-0 sm:border-x shadow-none sm:shadow">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-lg font-semibold mb-2">Quote Pending</p>
                                <p className="text-muted-foreground text-center">
                                    Our team is reviewing your order. You&apos;ll receive a
                                    detailed quote within 24 hours.
                                </p>
                            </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Messages Tab — full-bleed on mobile, fills remaining viewport */}
                <TabsContent
                    value="messages"
                    className="-mx-4 sm:mx-0 flex flex-col"
                    style={{ height: "calc(100dvh - 240px)" }}
                >
                    <ChatInterface
                        orderId={orderId}
                        title={`Chat with ${order.title} Team`}
                        showHead={false}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
