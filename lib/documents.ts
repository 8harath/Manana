import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function getDocument(id: string, userEmail: string) {
  try {
    await client.connect()
    const db = client.db("pdf-chat")
    const documents = db.collection("documents")

    const document = await documents.findOne({
      _id: new ObjectId(id),
      userEmail: userEmail,
    })

    return document
  } catch (error) {
    console.error("Error fetching document:", error)
    return null
  } finally {
    await client.close()
  }
}
