import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient } from 'mongodb';

const f = createUploadthing();

const client = new MongoClient(process.env.MONGODB_URI!);

export const pdfUploader = f({
  pdf: {
    maxFileSize: '8MB', // UploadThing only allows certain values
    maxFileCount: 1,
    content: ['application/pdf'],
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
    await documents.insertOne({
      userEmail: metadata.userEmail,
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      lastAccessed: new Date(),
      processingStatus: 'processing',
      url: file.url,
      metadata: {},
    });
    await client.close();
  });

export type OurFileRouter = typeof pdfUploader;

export const { GET, POST } = pdfUploader;
