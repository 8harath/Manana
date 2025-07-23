"use client"

import { useState, useEffect } from "react"

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

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents")
        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }
        const data = await response.json()
        setDocuments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  return { documents, isLoading, error }
}
