import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("pdf-chat")
    const documents = db.collection("documents")
    const chatSessions = db.collection("chatSessions")

    // Delete the document
    const result = await documents.deleteOne({
      _id: new ObjectId(params.id),
      userEmail: session.user.email,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete associated chat sessions
    await chatSessions.deleteMany({
      pdfId: new ObjectId(params.id),
      userId: session.user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { tags } = await request.json()
    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "Invalid tags" }, { status: 400 })
    }
    await client.connect()
    const db = client.db("pdf-chat")
    const documents = db.collection("documents")
    const result = await documents.updateOne(
      { _id: new ObjectId(params.id), userEmail: session.user.email },
      { $set: { tags } }
    )
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating tags:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
