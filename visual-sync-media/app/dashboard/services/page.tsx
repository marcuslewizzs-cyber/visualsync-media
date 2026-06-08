/**
 * Media Services Page - Dashboard Portal
 * 
 * Displays available media services.
 * Admins can add, edit, or delete services.
 * 
 * @added 2026-02-04
 * @updated 2026-02-07 - Added full CRUD (Create, Update, Delete) with local state
 * @route /dashboard/services
 */
"use client"

import { useState, type ChangeEvent } from 'react'
import {
    SlidersHorizontal,
    ArrowUpAZ,
    ArrowDownAZ,
    Plus,
    Edit2,
    Trash2,
    Video,
    Smartphone,
    BookOpen,
    Briefcase,
    Zap,
    Film,
    Camera,
    PlayCircle,
    Music,
    Image as ImageIcon,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { services as initialServices } from './data/services'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const ICONS = [
    { name: 'Video', icon: Video },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Zap', icon: Zap },
    { name: 'Film', icon: Film },
    { name: 'Camera', icon: Camera },
    { name: 'PlayCircle', icon: PlayCircle },
    { name: 'Music', icon: Music },
    { name: 'Image', icon: ImageIcon },
]

export default function ServicesPage() {
    const { role } = useAuth()
    const isAdmin = role === 'admin'

    const [servicesList, setServicesList] = useState(initialServices)
    const [sort, setSort] = useState<'asc' | 'desc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Form state
    const [formState, setFormState] = useState({
        name: '',
        category: 'Specialty',
        desc: '',
        iconName: 'Video'
    })

    const filteredServices = [...servicesList]
        .sort((a, b) =>
            sort === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        )
        .filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSortChange = (newSort: 'asc' | 'desc') => {
        setSort(newSort)
    }

    const openAddDialog = () => {
        setEditingIndex(null)
        setFormState({ name: '', category: 'Specialty', desc: '', iconName: 'Video' })
        setIsDialogOpen(true)
    }

    const openEditDialog = (index: number) => {
        const service = servicesList[index]
        // Find icon name from logo? Actually let's just use a default or store iconName in services
        // For simplicity with existing data, we'll try to match name or default to Video
        setEditingIndex(index)
        setFormState({
            name: service.name,
            category: service.category,
            desc: service.desc,
            iconName: 'Video' // Defaulting for now as existing data doesn't have iconName strings
        })
        setIsDialogOpen(true)
    }

    const handleSaveService = (e: React.FormEvent) => {
        e.preventDefault()

        const IconComponent = ICONS.find(i => i.name === formState.iconName)?.icon || Video

        const updatedService = {
            name: formState.name,
            logo: <IconComponent className="h-6 w-6" />,
            category: formState.category,
            desc: formState.desc,
        }

        if (editingIndex !== null) {
            const newList = [...servicesList]
            newList[editingIndex] = updatedService
            setServicesList(newList)
            toast.success("Service updated successfully!")
        } else {
            setServicesList([updatedService, ...servicesList])
            toast.success("New service added!")
        }

        setIsDialogOpen(false)
    }

    const handleDeleteService = (index: number) => {
        const newList = [...servicesList]
        newList.splice(index, 1)
        setServicesList(newList)
        toast.error("Service deleted")
    }

    return (
        <div className="space-y-6">
            {/* ===== Top Heading ===== */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        Media Services
                    </h1>
                    <p className='text-muted-foreground'>
                        Explore our range of professional media services!
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={openAddDialog} className="flex items-center gap-2">
                        <Plus size={18} />
                        <span>Add Service</span>
                    </Button>
                )}
            </div>

            {/* ===== Filters ===== */}
            <div className='flex items-end justify-between sm:items-center'>
                <div className='flex flex-col gap-4 sm:flex-row'>
                    <Input
                        placeholder='Filter services...'
                        className='h-9 w-40 lg:w-[250px]'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className='w-16'>
                        <SelectValue>
                            <SlidersHorizontal size={18} />
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent align='end'>
                        <SelectItem value='asc'>
                            <div className='flex items-center gap-4'>
                                <ArrowUpAZ size={16} />
                                <span>Ascending</span>
                            </div>
                        </SelectItem>
                        <SelectItem value='desc'>
                            <div className='flex items-center gap-4'>
                                <ArrowDownAZ size={16} />
                                <span>Descending</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator className='shadow-sm' />

            {/* ===== Services Grid ===== */}
            {filteredServices.length > 0 ? (
                <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredServices.map((service, idx) => {
                        // Find original index for state updates
                        const originalIndex = servicesList.findIndex(s => s.name === service.name)

                        return (
                            <li
                                key={`${service.name}-${idx}`}
                                className='group relative flex flex-col rounded-lg border p-4 hover:shadow-md transition-shadow'
                            >
                                <div className='mb-6 flex items-center justify-between'>
                                    <div
                                        className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary p-2'
                                    >
                                        {service.logo}
                                    </div>
                                    {isAdmin && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                                onClick={() => openEditDialog(originalIndex)}
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50'
                                                onClick={() => handleDeleteService(originalIndex)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <h2 className='font-semibold'>{service.name}</h2>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {service.category}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>{service.desc}</p>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => openEditDialog(originalIndex)}
                                    >
                                        Add More
                                    </Button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg bg-muted/30">
                    <AlertCircle className="size-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No services found</h3>
                    <p className="text-muted-foreground max-w-sm">
                        {searchTerm ? `We couldn't find any services matching "${searchTerm}".` : "Start by adding your first media service to the list!"}
                    </p>
                    {isAdmin && !searchTerm && (
                        <Button onClick={openAddDialog} variant="outline" className="mt-6">
                            <Plus size={18} className="mr-2" />
                            Add First Service
                        </Button>
                    )}
                </div>
            )}

            {/* ===== Add/Edit Dialog ===== */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSaveService}>
                        <DialogHeader>
                            <DialogTitle>{editingIndex !== null ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                            <DialogDescription>
                                {editingIndex !== null
                                    ? 'Update the service details below.'
                                    : 'Fill in the details below to create a new media service block.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Service Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. 4K Drone Filming"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formState.category}
                                    onValueChange={(val) => setFormState({ ...formState, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Specialty">Specialty</SelectItem>
                                        <SelectItem value="Premium">Premium</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Select Icon</Label>
                                <div className="grid grid-cols-5 gap-2 rounded-md border p-2">
                                    {ICONS.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Button
                                                key={item.name}
                                                type="button"
                                                variant={formState.iconName === item.name ? "default" : "ghost"}
                                                size="icon"
                                                className="h-10 w-10"
                                                onClick={() => setFormState({ ...formState, iconName: item.name })}
                                            >
                                                <Icon size={18} />
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what this service handles..."
                                    className="min-h-[100px]"
                                    value={formState.desc}
                                    onChange={(e) => setFormState({ ...formState, desc: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingIndex !== null ? 'Update Service' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
