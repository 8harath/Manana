"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 shrink-0 mt-1">
          <AvatarFallback className="bg-[var(--accent-blue)] text-white text-xs font-medium">AI</AvatarFallback>
        </Avatar>
        <div className="bg-secondary rounded-[18px] rounded-tl-[4px] px-5 py-4">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-[var(--primary-gray)] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-[var(--primary-gray)] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-[var(--primary-gray)] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
