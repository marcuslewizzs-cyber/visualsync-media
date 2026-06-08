"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Mail, Trash2, UserCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

const SPECIALTIES_OPTIONS = [
    "Video Editing",
    "Motion Graphics",
    "Color Grading",
    "Sound Design",
    "Animation",
    "VFX",
    "Short-form Content",
    "Long-form Content",
]

export default function AdminEditorsPage() {
    const editors = useQuery(api.users.getAllEditors)
    const createEditor = useMutation(api.admin.createEditor)
    const deactivateEditor = useMutation(api.admin.deactivateEditor)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialties: [] as string[],
    })

    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || formData.specialties.length === 0) {
            toast.error("Please fill in all fields")
            return
        }

        setIsSubmitting(true)
        try {
            await createEditor({
                name: formData.name,
                email: formData.email,
                specialties: formData.specialties,
            })
            toast.success("Editor created successfully")
            setIsDialogOpen(false)
            setFormData({ name: "", email: "", specialties: [] })
        } catch (error) {
            toast.error("Failed to create editor")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeactivate = async (editorId: string) => {
        try {
            await deactivateEditor({ editorId: editorId as any })
            toast.success("Editor deactivated")
        } catch (error) {
            toast.error("Failed to deactivate editor")
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Editors</h1>
                    <p className="text-muted-foreground">
                        Add and manage video editors on the platform
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Editor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Add New Editor</DialogTitle>
                                <DialogDescription>
                                    Create an editor account. They will receive an invitation email to set up their password.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="editor@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Specialties</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {SPECIALTIES_OPTIONS.map(specialty => (
                                            <Badge
                                                key={specialty}
                                                variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => handleSpecialtyToggle(specialty)}
                                            >
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Editor"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {!editors ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                            Loading editors...
                        </CardContent>
                    </Card>
                ) : editors.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p>No editors found</p>
                            <p className="text-sm">Add your first editor using the button above</p>
                        </CardContent>
                    </Card>
                ) : (
                    editors.map((editor) => (
                        <Card key={editor._id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>
                                                {editor.user?.name?.charAt(0) || "E"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{editor.user?.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {editor.user?.email}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {editor.specialties?.map((specialty: string) => (
                                                    <Badge key={specialty} variant="secondary" className="text-xs">
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={editor.isActive ? "default" : "secondary"}>
                                            {editor.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDeactivate(editor._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
