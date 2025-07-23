"use client"

import { useState, useCallback } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Search, User, LogOut, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadModal } from "@/components/upload-modal"
import { DocumentCard } from "@/components/document-card"
import { useDocuments } from "@/hooks/use-documents"

interface DashboardProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Dashboard({ user }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const { documents, isLoading } = useDocuments()

  const filteredDocuments =
    documents?.filter((doc) => doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())) || []

  const handleUploadSuccess = useCallback(() => {
    setShowUploadModal(false)
    // Refresh documents list
    window.location.reload()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background-white)]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-light sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <FileText className="h-7 w-7 text-[var(--accent-blue)]" />
              <span className="text-lg font-semibold">PDF Chat</span>
            </div>

            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 input-field"
              />
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && <p className="w-[200px] truncate text-sm text-secondary">{user.email}</p>}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Your Documents</h1>
            <p className="text-secondary">
              {documents?.length || 0} document{documents?.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Upload PDF</span>
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-32 bg-secondary rounded-lg mb-4" />
                <div className="h-4 bg-secondary rounded mb-2" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document._id} document={document} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{searchQuery ? "No documents found" : "No documents yet"}</h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No documents match "${searchQuery}". Try a different search term.`
                : "Upload your first PDF to start chatting with your documents."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowUploadModal(true)} className="btn-primary">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First PDF
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onSuccess={handleUploadSuccess} />
    </div>
  )
}
