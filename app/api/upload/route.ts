import { createUploadthing, createRouteHandler } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient } from 'mongodb';
import type { PDFDocument } from '@/lib/documents';
import { processPDF, chunkText, upsertDocumentEmbeddings } from '@/lib/documents';
import fetch from 'node-fetch';

const f = createUploadthing();

const client = new MongoClient(process.env.MONGODB_URI!);

export const pdfUploader = f({
  pdf: {
    maxFileSize: '8MB',
    maxFileCount: 1,
  },
})
  .middleware(async ({ req }) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error('Unauthorized');
    return { userEmail: session.user.email };
  })
  .onUploadComplete(async ({ file, metadata }) => {
    await client.connect();
    const db = client.db('pdf-chat');
    const documents = db.collection('documents');
    const document: PDFDocument = {
      userEmail: metadata.userEmail,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      lastAccessed: new Date(),
      processingStatus: 'processing',
      url: file.url,
      metadata: {},
    };
    // Only include _id if it is an ObjectId
    const { _id, ...docToInsert } = document;
    const result = await documents.insertOne(docToInsert);
    const documentId = result.insertedId.toString();

    // Download PDF from UploadThing
    const response = await fetch(file.url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Extract text from PDF
    const text = await processPDF(buffer);
    const chunks = chunkText(text);
    await upsertDocumentEmbeddings(documentId, chunks, metadata.userEmail);

    // Update document with processing status and metadata
    await documents.updateOne(
      { _id: result.insertedId },
      {
        $set: {
          processingStatus: 'ready',
          'metadata.pageCount': (text.match(/\f/g) || []).length + 1,
        },
      }
    );
    await client.close();
  });

export type OurFileRouter = typeof pdfUploader;

export const { GET, POST } = createRouteHandler({ router: { pdfUploader } });
