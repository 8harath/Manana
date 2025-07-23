"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Calendar, Clock, MoreVertical, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface Document {
  _id: string
  fileName: string
  fileSize: number
  uploadDate: string
  lastAccessed: string
  processingStatus: "uploading" | "processing" | "ready" | "error"
  metadata?: {
    pageCount: number
  }
}

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleChatClick = () => {
    if (document.processingStatus === "ready") {
      router.push(`/chat/${document._id}`)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this document?")) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/documents/${document._id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          window.location.reload()
        }
      } catch (error) {
        console.error("Error deleting document:", error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = () => {
    switch (document.processingStatus) {
      case "ready":
        return "text-[var(--success-green)]"
      case "processing":
        return "text-[var(--accent-blue)]"
      case "error":
        return "text-[var(--error-red)]"
      default:
        return "text-secondary"
    }
  }

  const getStatusText = () => {
    switch (document.processingStatus) {
      case "ready":
        return "Ready to chat"
      case "processing":
        return "Processing..."
      case "uploading":
        return "Uploading..."
      case "error":
        return "Processing failed"
      default:
        return "Unknown status"
    }
  }

  return (
    <div className="card group cursor-pointer relative" onClick={handleChatClick}>
      {/* Document Preview */}
      <div className="h-32 bg-secondary rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <FileText className="h-12 w-12 text-[var(--primary-gray)]" />
        {document.processingStatus === "processing" && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--accent-blue)] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-[var(--accent-blue)] transition-colors">
          {document.fileName}
        </h3>

        <div className="flex items-center justify-between text-xs text-secondary">
          <span>{formatFileSize(document.fileSize)}</span>
          {document.metadata?.pageCount && <span>{document.metadata.pageCount} pages</span>}
        </div>

        <div className="flex items-center space-x-1 text-xs text-secondary">
          <Calendar className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(document.uploadDate), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center space-x-1 text-xs text-secondary">
          <Clock className="h-3 w-3" />
          <span>Last accessed {formatDistanceToNow(new Date(document.lastAccessed), { addSuffix: true })}</span>
        </div>

        <div className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleChatClick()
              }}
              disabled={document.processingStatus !== "ready"}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Open Chat
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="text-[var(--error-red)]"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chat Button Overlay */}
      {document.processingStatus === "ready" && (
        <div className="absolute inset-0 bg-[var(--accent-blue)]/0 group-hover:bg-[var(--accent-blue)]/5 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button className="btn-primary shadow-lg">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Chat
          </Button>
        </div>
      )}
    </div>
  )
}
