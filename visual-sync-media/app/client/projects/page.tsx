"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MessageSquare, Loader2 } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"

export default function ClientProjectsPage() {
    const projects = useQuery(api.projects.getEditorProjects)

    if (projects === undefined) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                <p className="text-muted-foreground">Monitor your project production and status</p>
            </div>

            <div className="grid gap-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <Card key={project._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>
                                            Status: <span className="capitalize">{project.status.replace("-", " ")}</span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={project.status === "in-review" ? "default" : "secondary"}>
                                        {project.status.replace("-", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Production Progress</span>
                                        <span className="font-bold">{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2.5" />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-xs text-muted-foreground">
                                        Last updated {new Date(project.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.orderId && (
                                            <Link href={`/client/orders/${project.orderId}`}>
                                                <Button variant="outline" size="sm">
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Chat with Team
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                        No active projects found.
                    </div>
                )}
            </div>
        </div>
    )
}
