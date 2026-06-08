import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
    { id: 1, name: "Brand Video Campaign", client: "Acme Corp", progress: 75, status: "In Progress", dueDate: "Feb 15, 2026" },
    { id: 2, name: "Social Media Package", client: "TechStart", progress: 100, status: "Completed", dueDate: "Feb 10, 2026" },
    { id: 3, name: "Product Launch Video", client: "FreshFood", progress: 30, status: "In Progress", dueDate: "Feb 28, 2026" },
    { id: 4, name: "Corporate Training Series", client: "BigBank", progress: 50, status: "In Progress", dueDate: "Mar 5, 2026" },
    { id: 5, name: "Event Highlights Reel", client: "EventPro", progress: 0, status: "Pending", dueDate: "Mar 10, 2026" },
]

export default function AdminProjectsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">Manage and monitor all projects</p>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription>{project.client}</CardDescription>
                                </div>
                                <Badge variant={project.status === "Completed" ? "default" : project.status === "In Progress" ? "secondary" : "outline"}>
                                    {project.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">Due: {project.dueDate}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
