import { PutObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";

export class FileService {
  static async ensureBucket() {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    } catch (error) {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    }
  }

  static async uploadFile(file: Express.Multer.File) {
    await this.ensureBucket();

    const key = `${Date.now()}-${file.originalname}`;
    
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer, // For memory storage
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    
    // In a real app you might want to return a signed URL or a public URL if the bucket is public
    // For now we just return the key so the frontend can request it via an API endpoint
    return {
      key,
      url: `/files/${key}`,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    };
  }

  static async deleteFile(key: string) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
  }
}
