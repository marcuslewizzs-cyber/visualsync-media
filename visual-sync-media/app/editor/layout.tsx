"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { EditorSidebar } from "@/components/editor-sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <EditorSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1" />
                    <ModeToggle />
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
