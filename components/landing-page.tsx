"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Shield, Zap } from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background-white)]">
      {/* Header */}
      <header className="h-20 border-b border-light bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-[var(--accent-blue)]" aria-hidden="true" />
            <span className="text-xl font-semibold">PDF Chat</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-secondary hover:text-[var(--primary-black)] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-secondary hover:text-[var(--primary-black)] transition-colors">
              How it works
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Transform PDFs into <span className="text-[var(--accent-blue)]">Conversations</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload documents and chat with their content using advanced AI. Secure, private, and intelligent document
            analysis at your fingertips.
          </p>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl"
          >
            Sign in with Google
          </Button>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50 to-transparent rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">Intelligent Document Analysis</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Experience the future of document interaction with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="h-6 w-6 text-accent-blue" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Conversations</h3>
              <p className="text-secondary leading-relaxed">
                Ask questions about your documents in plain English and get intelligent, contextual responses.
              </p>
            </div>

            <div className="card text-center group hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Shield className="h-6 w-6 text-success-green" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-secondary leading-relaxed">
                Your documents are encrypted and processed securely. We never store or share your content.
              </p>
            </div>

            <div className="card text-center group hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Zap className="h-6 w-6 text-orange-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-secondary leading-relaxed">
                Get instant responses powered by advanced AI models and optimized vector search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">How it Works</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Three simple steps to unlock the power of your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent-blue)] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your PDF</h3>
              <p className="text-secondary">
                Drag and drop your document or browse to select. We support PDFs up to 10MB.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent-blue)] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-secondary">
                Our AI analyzes your document, creating intelligent embeddings for fast retrieval.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--accent-blue)] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Chatting</h3>
              <p className="text-secondary">
                Ask questions, request summaries, or explore your document through conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-[var(--accent-blue)]" aria-hidden="true" />
              <span className="font-semibold">PDF Chat</span>
            </div>
            <p className="text-sm text-secondary">© 2024 PDF Chat. Built with precision and care.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
