"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from '@uploadthing/react';

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.type !== "application/pdf") {
          toast({
            title: "Invalid file type",
            description: "Please select a PDF file.",
            variant: "destructive",
          })
          return
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          toast({
            title: "File too large",
            description: "Please select a file smaller than 10MB.",
            variant: "destructive",
          })
          return
        }

        setSelectedFile(file)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: isUploading,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      setUploadProgress(100)
      setUploadStatus("success")

      toast({
        title: "Upload successful",
        description: "Your document is being processed and will be ready shortly.",
      })

      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 1500)
    } catch (error) {
      setUploadStatus("error")
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null)
      setUploadProgress(0)
      setUploadStatus("idle")
      onClose()
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload PDF Document</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <UploadButton
            endpoint="pdfUploader"
            onClientUploadComplete={() => {
              toast({
                title: 'Upload successful',
                description: 'Your document is being processed and will be ready shortly.',
              });
              onSuccess();
              handleClose();
            }}
            onUploadError={(error) => {
              toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
              });
            }}
            appearance={{
              button: 'btn-primary w-full',
              container: 'w-full',
              allowedContent: 'text-secondary',
              label: 'text-lg font-medium',
              uploadIcon: 'h-6 w-6',
              progressBar: 'w-full',
            }}
            config={{
              maxFileSize: 10 * 1024 * 1024,
              accept: ['application/pdf'],
              multiple: false,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
