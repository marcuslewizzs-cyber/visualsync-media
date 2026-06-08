"use client"

import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate, formatDateTime } from "@/lib/order-service"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { ChatInterface } from "@/components/chat-interface"

export default function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    
    // Check if it's a legacy ID from local storage
    const isLegacyId = id.startsWith("order_")
    
    const orderId = isLegacyId ? undefined : (id as Id<"orders">)
    const order = useQuery(api.orders.getOrderById, orderId ? { orderId } : "skip")
    
    const updateOrderMutation = useMutation(api.orders.updateOrder)
    const createMessageMutation = useMutation(api.messages.createMessage)

    // Quote form state
    const [quotePrice, setQuotePrice] = useState("")
    const [quoteDays, setQuoteDays] = useState("")
    const [quoteDescription, setQuoteDescription] = useState("")
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)

    const handleSubmitQuote = async () => {
        if (!quotePrice || !quoteDays || !quoteDescription || !order || !orderId) return

        setIsSubmittingQuote(true)
        try {
            await updateOrderMutation({
                orderId,
                quote: {
                    price: parseFloat(quotePrice),
                    estimatedDays: parseInt(quoteDays),
                    description: quoteDescription,
                },
                status: "quoted",
            })

            // Send a message to client about the quote
            await createMessageMutation({
                orderId,
                content: `We've prepared your quote! The estimated cost is $${quotePrice} and will take approximately ${quoteDays} days. Check the quote tab for more details.`,
            })

            // Reset form
            setQuotePrice("")
            setQuoteDays("")
            setQuoteDescription("")
        } catch (error) {
            console.error("Error submitting quote:", error)
        } finally {
            setIsSubmittingQuote(false)
        }
    }

    if (isLegacyId) {
        return (
            <div className="space-y-6">
                <Link
                    href="/admin/requests"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Legacy Request Not Found</p>
                        <p className="text-muted-foreground text-center mt-2">
                            This request was created on an older system and is no longer available.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (order === undefined) {
        return <div className="text-center py-8">Loading request...</div>
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <Link
                    href="/admin/requests"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Link>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-semibold">Request not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/admin/requests"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition w-fit"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Requests
            </Link>

            {/* Header */}
            <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {order.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">Order #{order._id}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            From: <span className="font-medium">{order.client?.name}</span> ({order.client?.email})
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === 'quoted'
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}>
                        {order.status === 'quoted' ? 'Quoted' : 'Awaiting Quote'}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Request Details</TabsTrigger>
                    <TabsTrigger value="quote">
                        {order.quote ? "Update Quote" : "Create Quote"}
                    </TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Request Information</CardTitle>
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

                            {order.rawAssetsLink && (
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                                        RAW ASSETS LINK
                                    </p>
                                    <a
                                        href={order.rawAssetsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {order.rawAssetsLink}
                                    </a>
                                </div>
                            )}

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
                                        REQUESTED
                                    </p>
                                    <p className="text-base">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quote Tab */}
                <TabsContent value="quote">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {order.quote ? "Update Quote" : "Create Quote"}
                            </CardTitle>
                            <CardDescription>
                                Provide pricing and timeline for this project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Estimated Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="5000"
                                        value={quotePrice}
                                        onChange={(e) => setQuotePrice(e.target.value)}
                                        step="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="days">Estimated Timeline (Days)</Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        placeholder="14"
                                        value={quoteDays}
                                        onChange={(e) => setQuoteDays(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Quote Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what's included in this quote, deliverables, revisions, etc..."
                                    value={quoteDescription}
                                    onChange={(e) => setQuoteDescription(e.target.value)}
                                    className="min-h-32"
                                />
                            </div>

                            <Button
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={handleSubmitQuote}
                                disabled={isSubmittingQuote || !quotePrice || !quoteDays || !quoteDescription}
                            >
                                {isSubmittingQuote ? "Submitting..." : "Submit Quote"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages" className="h-[500px]">
                    <ChatInterface 
                        orderId={orderId} 
                        title={`Chat with ${order.client?.name || "Client"}`}
                        showHead={false}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
