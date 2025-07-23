"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    sources?: string[]
    confidence?: number
  }
}

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface MessageBubbleProps {
  message: Message
  user: User
}

export function MessageBubble({ message, user }: MessageBubbleProps) {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.type === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="flex items-end space-x-2 max-w-[80%] sm:max-w-[70%]">
          <div
            className="bg-[var(--accent-blue)] text-white rounded-[18px] rounded-br-[4px] px-4 py-3 cursor-pointer"
            onMouseEnter={() => setShowTimestamp(true)}
            onMouseLeave={() => setShowTimestamp(false)}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {showTimestamp && (
              <p className="text-xs opacity-75 mt-1">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </p>
            )}
          </div>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="text-xs">{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-start space-x-3 max-w-[90%] sm:max-w-[80%]">
        <Avatar className="w-8 h-8 shrink-0 mt-1">
          <AvatarFallback className="bg-[var(--accent-blue)] text-white text-xs font-medium">AI</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div
            className="bg-secondary rounded-[18px] rounded-tl-[4px] px-5 py-4 cursor-pointer group"
            onMouseEnter={() => setShowTimestamp(true)}
            onMouseLeave={() => setShowTimestamp(false)}
          >
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap m-0">{message.content}</p>
            </div>

            {showTimestamp && (
              <p className="text-xs text-secondary mt-2">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                {message.metadata?.confidence && (
                  <span className="ml-2">• Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
                )}
              </p>
            )}
          </div>

          {/* Message Actions */}
          <div className="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-secondary hover:text-[var(--primary-black)]"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-secondary hover:text-[var(--success-green)]"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-secondary hover:text-[var(--error-red)]">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>

          {/* Sources */}
          {message.metadata?.sources && message.metadata.sources.length > 0 && (
            <div className="mt-3 text-xs text-secondary">
              <p className="font-medium mb-1">Sources:</p>
              <div className="flex flex-wrap gap-1">
                {message.metadata.sources.map((source, index) => (
                  <span key={index} className="bg-white border border-light rounded px-2 py-1 text-xs">
                    Page {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
