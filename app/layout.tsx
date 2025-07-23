import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PDF Chat - Transform PDFs into Conversations",
  description: "Upload documents and chat with their content using advanced AI. Secure, private, and intelligent.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only absolute left-2 top-2 bg-white border border-light rounded px-3 py-2 z-50">Skip to main content</a>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
