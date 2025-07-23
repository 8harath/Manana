import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("pdf-chat")
    const documents = db.collection("documents")

    const userDocuments = await documents.find({ userEmail: session.user.email }).sort({ uploadDate: -1 }).toArray()

    return NextResponse.json(userDocuments)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
