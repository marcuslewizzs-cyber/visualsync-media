"use client"

import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Shield, Calendar } from "lucide-react"

export function AccountPageContent() {
    const { user: clerkUser } = useUser()
    const user = useQuery(api.users.getCurrentUser)
    
    if (!user) return null

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Account Details</h2>
                <p className="text-muted-foreground">
                    View and manage your personal information and account security.
                </p>
            </div>
            
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your public identity on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <Avatar className="h-20 w-20 border-2 border-primary/10">
                                <AvatarImage src={clerkUser?.imageUrl} />
                                <AvatarFallback className="text-xl bg-primary/5">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left">
                                <h3 className="text-xl font-semibold">{user.name}</h3>
                                <Badge variant="secondary" className="mt-1 capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <User className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">Full Name</span>
                                    <span>{user.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">Email Address</span>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Account status and metadata.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">Account Role</span>
                                    <span className="capitalize">{user.role} Access</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">Member Since</span>
                                    <span>{new Date(user.createdAt).toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-foreground font-medium">Status</span>
                                    <span className="text-green-500 font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
