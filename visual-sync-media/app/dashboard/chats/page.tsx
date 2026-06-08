"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Search, Edit, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials, cn, formatRelativeDate } from "@/lib/utils"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatsPage() {
    const conversations = useQuery(api.messages.getConversations) || []
    const [selectedConvo, setSelectedConvo] = useState<any>(null)

    return (
        <div className="flex w-full h-[calc(100vh-10rem)] shadow-sm rounded-lg overflow-hidden border bg-card">
            {/* Sidebar */}
            <div className="w-80 border-r flex flex-col bg-muted/10">
                <div className="p-4 border-b flex items-center justify-between bg-background">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Inbox <MessageSquare className="h-5 w-5 text-primary" />
                    </h2>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4 border-b bg-background">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search chat..." className="pl-8 bg-muted/50 border-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-10 text-center opacity-50">
                            <p className="text-xs font-medium">No active chats found.</p>
                        </div>
                    ) : (
                        conversations.map((chat) => (
                            <div
                                key={`${chat.type}_${chat.id}`}
                                onClick={() => setSelectedConvo(chat)}
                                className={cn(
                                    "p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer border-b transition-colors",
                                    selectedConvo?.id === chat.id ? "bg-primary/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarImage src={chat.lastSender?.image} />
                                    <AvatarFallback>{getInitials(chat.title)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="font-bold text-sm truncate">{chat.title}</p>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] text-muted-foreground">{formatRelativeDate(new Date(chat.lastMessageAt).toISOString())}</span>
                                            {chat.unreadCount > 0 && (
                                                <span className="h-4 min-w-[1rem] px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in duration-300">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">
                                        {chat.subtitle}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        <span className="font-medium text-foreground/70">
                                            {chat.lastSender?.name.split(' ')[0]}:
                                        </span> {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-muted/5">
                {selectedConvo ? (
                    <div className="h-full p-4">
                        <ChatInterface 
                            orderId={selectedConvo.orderId}
                            projectId={selectedConvo.projectId}
                            title={selectedConvo.title}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center max-w-sm">
                            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 mb-6 border-4 border-primary/10 shadow-inner">
                                <MessageSquare className="h-12 w-12 text-primary/40 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter mb-2 italic">Select a conversation</h3>
                            <p className="text-muted-foreground mb-6 font-medium">Choose a client or editor from the left to start chatting in real-time.</p>
                            <Button size="lg" className="rounded-full shadow-xl px-10 font-bold transition-all hover:scale-105 active:scale-95 bg-primary">
                                New Broadcast
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
