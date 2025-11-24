import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || "us-east-1",
  endpoint: process.env.STORAGE_ENDPOINT || "http://localhost:9000",
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.STORAGE_SECRET_KEY || "minioadmin",
  },
});

export const BUCKET_NAME = process.env.STORAGE_BUCKET || "app-files";
