"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, FileText, MoreVertical, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/hooks/use-chat"
import { MessageBubble } from "@/components/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"

interface Document {
  _id: string
  fileName: string
  fileSize: number
  uploadDate: string
  metadata?: {
    pageCount: number
  }
}

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface ChatInterfaceProps {
  document: Document
  user: User
}

export function ChatInterface({ document, user }: ChatInterfaceProps) {
  const router = useRouter()
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, isLoading, sendMessage } = useChat(document._id)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isLoading])

  // Focus input after AI response
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="h-screen bg-[var(--background-white)] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white border-b border-light flex items-center px-4 sm:px-6 shrink-0">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-[var(--accent-blue)]/10 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-[var(--accent-blue)]" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-medium text-sm truncate">{document.fileName}</h1>
              <p className="text-xs text-secondary">
                {formatFileSize(document.fileSize)} • {document.metadata?.pageCount || 0} pages
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="p-2 hover:bg-secondary shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--accent-blue)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--accent-blue)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                <p className="text-secondary max-w-md mx-auto mb-6">
                  Ask questions about your document, request summaries, or explore specific topics.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("What is this document about?")}
                    className="bg-white hover:bg-secondary"
                  >
                    What is this document about?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("Summarize the key points")}
                    className="bg-white hover:bg-secondary"
                  >
                    Summarize the key points
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput("What are the main conclusions?")}
                    className="bg-white hover:bg-secondary"
                  >
                    What are the main conclusions?
                  </Button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} user={user} />
            ))}

            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-light bg-white px-4 sm:px-6 py-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your document..."
                  disabled={isLoading}
                  className="input-field pr-12 min-h-[44px] resize-none"
                  maxLength={1000}
                />
                <div className="absolute right-3 bottom-3 text-xs text-secondary">{input.length}/1000</div>
              </div>
              <Button type="submit" disabled={!input.trim() || isLoading} className="btn-primary h-11 px-4 shrink-0">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
