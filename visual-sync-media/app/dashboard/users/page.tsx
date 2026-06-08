/**
 * Users Page - Dashboard Portal
 * 
 * User management page with role and status filtering.
 * Features: search, role/status filters, stats cards, user table with actions.
 * 
 * @added 2026-02-04
 * @route /dashboard/users
 */
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import {
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Shield,
    User as UserIcon,
    PenTool,
    Trash2,
    Edit2
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRole = "admin" | "client" | "editor"
type UserStatus = "active" | "inactive" | "pending"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    status: UserStatus
    avatar?: string
    joinedDate: string
}

const roleConfig = {
    admin: {
        label: "Admin",
        icon: Shield,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    },
    client: {
        label: "Client",
        icon: UserIcon,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    editor: {
        label: "Editor",
        icon: PenTool,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
}

const statusConfig = {
    active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    deactivated: { label: "Deactivated", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export default function UsersPage() {
    const liveUsers = useQuery(api.users.getAllUsers) || []
    const createUser = useMutation(api.users.createUser)
    const updateUser = useMutation(api.users.updateUser)
    const updateUserRole = useMutation(api.users.updateUserRole)
    const deleteUser = useMutation(api.users.deactivateUser)

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
    const [statusFilter, setStatusFilter] = useState<string | "all">("all")
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "client" as UserRole
    })

    const filteredUsers = liveUsers
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => roleFilter === "all" || user.role === roleFilter)
        .filter((user) => {
            if (statusFilter === "all") return true
            if (statusFilter === "active") return user.clerkId && user.isActive !== false
            if (statusFilter === "pending") return !user.clerkId && user.isActive !== false
            if (statusFilter === "inactive") return user.isActive === false
            return true
        })

    const userStats = {
        total: liveUsers.length,
        active: liveUsers.filter(u => u.clerkId && u.isActive !== false).length,
        admins: liveUsers.filter(u => u.role === "admin").length,
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createUser({
                name: formData.name,
                email: formData.email,
                role: formData.role
            })
            toast.success("User created successfully")
            setIsCreateDialogOpen(false)
            setFormData({ name: "", email: "", role: "client" })
        } catch (error) {
            toast.error("Failed to create user")
        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return
        try {
            await updateUser({
                userId: selectedUser._id,
                name: formData.name,
                email: formData.email
            })
            await updateUserRole({
                userId: selectedUser._id,
                role: formData.role
            })
            toast.success("User updated successfully")
            setIsEditDialogOpen(false)
            setSelectedUser(null)
        } catch (error) {
            toast.error("Failed to update user")
        }
    }

    const handleDeleteUser = async (userId: Id<"users">) => {
        if (!confirm("Are you sure you want to deactivate this user?")) return
        try {
            await deleteUser({ userId })
            toast.success("User deactivated")
        } catch (error) {
            toast.error("Failed to deactivate user")
        }
    }

    const openEditDialog = (user: any) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role as UserRole
        })
        setIsEditDialogOpen(true)
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Add a new user to the system. They will be able to login once they sign up with this email.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="John Doe" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select 
                                    value={formData.role} 
                                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Create User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.admins}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 w-full pl-8 sm:w-[250px]"
                    />
                </div>
                <Select value={roleFilter} onValueChange={(v: string) => setRoleFilter(v as UserRole | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as UserStatus | "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users in your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user: any) => {
                                    const roleInfo = roleConfig[user.role as UserRole] || roleConfig.client
                                    
                                    // Derive status
                                    let status: "active" | "inactive" | "pending" | "deactivated" = "pending"
                                    if (user.isActive === false) status = "deactivated"
                                    else if (user.clerkId) status = "active"
                                    
                                    const statusInfo = statusConfig[status]

                                    return (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{user.name}</span>
                                                        {!user.clerkId && user.isActive !== false && (
                                                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Pending Invite</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={roleInfo.color}>
                                                    {roleInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusInfo.color}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input 
                                id="edit-name" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input 
                                id="edit-email" 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select 
                                value={formData.role} 
                                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
