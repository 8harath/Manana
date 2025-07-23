import { MongoClient, ObjectId } from "mongodb"
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { Pinecone } from '@pinecone-database/pinecone';

const client = new MongoClient(process.env.MONGODB_URI!)

export interface PDFDocument {
  _id?: string | import('mongodb').ObjectId;
  userEmail: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  lastAccessed: Date;
  processingStatus: 'uploading' | 'processing' | 'ready' | 'error';
  url?: string;
  metadata?: {
    pageCount?: number;
    [key: string]: any;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    confidence?: number;
    [key: string]: any;
  };
}

export interface ChatSession {
  _id?: string | import('mongodb').ObjectId;
  pdfId: string;
  userId: string;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
  messages: ChatMessage[];
}

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

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export async function extractTextWithOCR(buffer: Buffer): Promise<string> {
  // Convert buffer to base64 for Tesseract.js
  const base64 = buffer.toString('base64');
  const image = `data:application/pdf;base64,${base64}`;
  const { data } = await Tesseract.recognize(image, 'eng');
  return data.text;
}

export async function processPDF(buffer: Buffer): Promise<string> {
  try {
    const text = await extractTextFromPDF(buffer);
    if (text && text.trim().length > 0) return text;
  } catch (err) {
    // Ignore and fallback to OCR
  }
  // Fallback to OCR
  return extractTextWithOCR(buffer);
}

// --- PDF Chunking Utility ---
export function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) chunks.push(chunk);
  }
  return chunks;
}

// --- Embedding Utility (Gemini placeholder) ---
export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Replace with Gemini embedding API call
  // For now, return a dummy vector
  return Array(768).fill(0).map((_, i) => Math.sin(i + text.length));
}

// --- Pinecone Integration ---
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});
const index = pinecone.Index(process.env.PINECONE_INDEX!);

export async function upsertDocumentEmbeddings(
  documentId: string,
  chunks: string[],
  userEmail: string
) {
  const vectors = await Promise.all(
    chunks.map(async (chunk, i) => ({
      id: `${documentId}_${i}`,
      values: await generateEmbedding(chunk),
      metadata: { documentId, userEmail, chunkIndex: i, text: chunk },
    }))
  );
  await index.upsert(vectors);
}

export async function queryRelevantChunks(
  documentId: string,
  userEmail: string,
  query: string,
  topK: number = 5
): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    filter: { documentId, userEmail },
    includeMetadata: true,
  });
  return results.matches?.map((m: any) => m.metadata.text) || [];
}
