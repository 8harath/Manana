"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
          {/* Upload Area */}
          {!selectedFile && uploadStatus === "idle" && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-accent-blue bg-blue-50"
                  : "border-light hover:border-blue-300"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
              </p>
              <p className="text-secondary mb-4">or click to browse files</p>
              <Button variant="outline" className="btn-secondary bg-transparent">
                Browse Files
              </Button>
              <p className="text-xs text-secondary mt-4">Maximum file size: 10MB</p>
            </div>
          )}

          {/* Selected File */}
          {selectedFile && uploadStatus === "idle" && (
            <div className="border border-light rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-10 w-10 text-[var(--accent-blue)]" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-secondary">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-secondary hover:text-[var(--error-red)]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadStatus === "uploading" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-10 w-10 text-[var(--accent-blue)]" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile?.name}</p>
                  <p className="text-sm text-secondary">Uploading...</p>
                </div>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Success State */}
          {uploadStatus === "success" && (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-[var(--success-green)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
              <p className="text-secondary">Your document is being processed...</p>
            </div>
          )}

          {/* Error State */}
          {uploadStatus === "error" && (
            <div className="text-center py-4">
              <AlertCircle className="h-16 w-16 text-[var(--error-red)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Failed</h3>
              <p className="text-secondary mb-4">Please try again</p>
              <Button
                onClick={() => {
                  setUploadStatus("idle")
                  setSelectedFile(null)
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && uploadStatus === "idle" && (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleUpload} className="btn-primary flex-1">
                Upload Document
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
