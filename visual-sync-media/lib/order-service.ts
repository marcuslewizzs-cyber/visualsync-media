// Order and Message types
export interface Order {
    id: string
    clientId: string
    clientName: string
    clientEmail: string
    title: string
    service: "talking-head" | "music-videos" | "podcasts" | "social-media"
    projectHeadline: string
    requirements: string
    rawAssetsLink?: string
    targetPlatforms: string[]
    stylePreset: "cinematic" | "corporate" | "social" | "documentary" | "viral" | "minimal"
    status: "awaiting-quote" | "in-progress" | "completed" | "quoted"
    createdAt: string
    dueDate?: string
    quote?: {
        price: number
        estimatedDays: number
        description: string
    }
}

export interface Message {
    id: string
    orderId: string
    sender: "client" | "admin"
    senderName: string
    senderEmail: string
    content: string
    createdAt: string
}

const ORDERS_STORAGE_KEY = "universal_media_orders"
const MESSAGES_STORAGE_KEY = "universal_media_messages"

// Orders
export function getOrders(): Order[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt" | "status">): Order {
    const order: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: "awaiting-quote",
    }

    const orders = getOrders()
    orders.push(order)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))

    // Auto-generate first message from system
    createMessage({
        orderId: order.id,
        sender: "admin",
        senderName: "Admin Team",
        senderEmail: "admin@universalmedia.com",
        content: `We've received your order and are reviewing the requirements. We'll have a quote for you shortly!`,
    })

    return order
}

export function getOrderById(id: string): Order | undefined {
    const orders = getOrders()
    return orders.find((order) => order.id === id)
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const orders = getOrders()
    const index = orders.findIndex((order) => order.id === id)

    if (index === -1) return undefined

    orders[index] = { ...orders[index], ...updates }
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    return orders[index]
}

export function getClientOrders(clientId: string): Order[] {
    const orders = getOrders()
    return orders.filter((order) => order.clientId === clientId)
}

export function getAdminIncomingOrders(): Order[] {
    const orders = getOrders()
    return orders.filter((order) => order.status === "awaiting-quote").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Messages
export function getOrderMessages(orderId: string): Message[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY)
    const messages = stored ? JSON.parse(stored) : []
    return messages.filter((msg: Message) => msg.orderId === orderId).sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function createMessage(messageData: Omit<Message, "id" | "createdAt">): Message {
    const message: Message = {
        ...messageData,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
    }

    const messages = (typeof window !== "undefined" && localStorage.getItem(MESSAGES_STORAGE_KEY)) ? JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY)!) : []
    messages.push(message)
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))

    return message
}

// Utility function to format date
export function formatDate(dateInput: string | number): string {
    const date = new Date(dateInput)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export function formatDateTime(dateInput: string | number): string {
    const date = new Date(dateInput)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}
