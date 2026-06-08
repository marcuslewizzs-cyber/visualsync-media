import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileVideo, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { ClientOrdersList } from "@/components/client-orders-list"

export const metadata = {
    title: "My Orders | Client Portal",
    description: "Manage your media production orders",
}

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                <p className="text-muted-foreground">
                    Create and manage your media production orders
                </p>
            </div>

            {/* Create Order Button */}
            <div>
                <Link href="/client/orders/create">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Create New Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Orders List */}
            <ClientOrdersList />
        </div>
    )
}