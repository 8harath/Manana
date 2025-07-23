import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { ChatInterface } from "@/components/chat-interface"
import { getDocument } from "@/lib/documents"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const document = await getDocument(params.id, session.user.email!)

  if (!document) {
    redirect("/dashboard")
  }

  if (document.processingStatus !== "ready") {
    redirect("/dashboard")
  }

  return <ChatInterface document={document} user={session.user} />
}
