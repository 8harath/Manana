import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { PDFDocument, ChatSession, ChatMessage } from '@/lib/documents';
import { queryRelevantChunks } from '@/lib/documents';

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("pdf-chat")
    const chatSessions = db.collection("chatSessions")

    const chatSession = await chatSessions.findOne({
      pdfId: new ObjectId(params.id),
      userId: session.user.email,
    })

    return NextResponse.json({
      messages: chatSession?.messages || [],
    })
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("pdf-chat")
    const documents = db.collection("documents")
    const chatSessions = db.collection("chatSessions")

    // Get the document
    const document = await documents.findOne({
      _id: new ObjectId(params.id),
      userEmail: session.user.email,
    }) as PDFDocument | null;

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Get or create chat session
    let chatSession = await chatSessions.findOne({
      pdfId: new ObjectId(params.id),
      userId: session.user.email,
    }) as ChatSession | null;

    if (!chatSession) {
      chatSession = {
        _id: new ObjectId().toHexString(),
        pdfId: params.id,
        userId: session.user.email,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messages: [],
      };
      await chatSessions.insertOne(chatSession as any);
    }

    // Retrieve relevant chunks from Pinecone
    const relevantChunks = await queryRelevantChunks(params.id, session.user.email, message, 5);
    const contextText = relevantChunks.join('\n---\n');

    // Generate AI response using Google Gemini
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are a helpful AI assistant that answers questions about PDF documents.\n\nYou have access to the following document context:\n${contextText}\n\nPlease provide accurate, helpful responses based on the document content. If you cannot find specific information in the document, say so clearly. Keep responses concise but informative.`,
      prompt: message,
    });

    // Save messages to chat session
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: text,
      timestamp: new Date(),
      metadata: {
        sources: ["1", "2"], // Simulated page references
        confidence: 0.85, // Simulated confidence score
      },
    }

    await chatSessions.updateOne(
      { _id: (chatSession as any)._id ? new ObjectId((chatSession as any)._id) : undefined },
      {
        $push: {
          messages: { $each: [userMessage, assistantMessage] },
        },
        $set: {
          lastMessageAt: new Date(),
        },
      } as any,
    )

    // Update document last accessed
    await documents.updateOne({ _id: new ObjectId(params.id) }, { $set: { lastAccessed: new Date() } })

    return NextResponse.json({
      response: text,
      metadata: {
        sources: ["1", "2"],
        confidence: 0.85,
      },
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
