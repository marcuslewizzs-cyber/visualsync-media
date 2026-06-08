"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Bot, Paperclip } from "lucide-react"
import { cn, getInitials, formatChatDate } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

interface ChatInterfaceProps {
    orderId?: Id<"orders">
    projectId?: Id<"projects">
    title?: string
    showHead?: boolean
}

export function ChatInterface({ orderId, projectId, title, showHead = true }: ChatInterfaceProps) {
    const { user } = useAuth()
    const [newMessage, setNewMessage] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const messages = useQuery(
        orderId ? api.messages.getOrderMessages : api.messages.getProjectMessages,
        orderId ? { orderId } : { projectId: projectId! }
    ) || []

    const sendMessage = useMutation(api.messages.createMessage)
    const markRead = useMutation(api.messages.markRead)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        
        // Mark as read when messages change (if we are the one viewing it)
        if (messages.length > 0) {
            markRead({ orderId, projectId }).catch(console.error)
        }
    }, [messages, orderId, projectId, markRead])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim()) return

        try {
            await sendMessage({
                orderId,
                projectId,
                content: newMessage.trim(),
            })
            setNewMessage("")
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    const renderMessages = () => {
        const elements: React.ReactNode[] = []
        let lastDate = ""

        messages.forEach((msg) => {
            const date = new Date(msg.createdAt).toDateString()
            if (date !== lastDate) {
                elements.push(
                    <div key={`date-${date}`} className="flex justify-center my-6">
                        <span className="bg-muted/80 backdrop-blur-sm border px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-muted-foreground shadow-sm">
                            {formatChatDate(new Date(msg.createdAt).toISOString())}
                        </span>
                    </div>
                )
                lastDate = date
            }

            const isMe = msg.senderId === user?.id
            elements.push(
                <div
                    key={msg._id}
                    className={cn(
                        "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                >
                    <Avatar className="h-8 w-8 shrink-0 border shadow-sm">
                        <AvatarFallback>{getInitials(msg.sender?.name || "U")}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                        "space-y-1",
                        isMe ? "items-end" : "items-start"
                    )}>
                        {!isMe && (
                            <p className="text-[10px] font-bold text-muted-foreground px-1 mb-0.5">
                                {msg.sender?.name}
                            </p>
                        )}
                        <div className={cn(
                            "rounded-2xl p-3 text-sm shadow-sm",
                            isMe 
                                ? "bg-primary text-primary-foreground rounded-tr-none" 
                                : "bg-muted text-foreground rounded-tl-none"
                        )}>
                            {msg.content}
                        </div>
                        <p className={cn(
                            "text-[10px] text-muted-foreground px-1",
                            isMe ? "text-right" : "text-left"
                        )}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            )
        })

        return elements
    }

    return (
        <div className="flex flex-col h-full bg-card border-0 sm:border sm:rounded-lg overflow-hidden shadow-none sm:shadow-sm">
            {showHead && (
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(title || "Chat")}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-sm font-bold">{title || "Conversation"}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                                {orderId ? "Client Portal" : "Internal Team"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-50">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                <User className="h-6 w-6" />
                            </div>
                            <p className="text-xs font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        renderMessages()
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="p-4 border-t bg-muted/10 flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-full bg-background border-muted focus-visible:ring-primary shadow-inner"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="shrink-0 h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                    disabled={!newMessage.trim()}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    )
}
