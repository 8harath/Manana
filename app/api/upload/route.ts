import { createUploadthing, createRouteHandler } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient } from 'mongodb';
import type { PDFDocument } from '@/lib/documents';

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
    await documents.insertOne(document);
    await client.close();
  });

export type OurFileRouter = typeof pdfUploader;

export const { GET, POST } = createRouteHandler({ router: { pdfUploader } });
