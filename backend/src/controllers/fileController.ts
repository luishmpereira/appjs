import { Request, Response } from "express";
import { FileService } from "../services/fileService";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await FileService.uploadFile(req.file);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });

    const response = await s3Client.send(command);
    
    if (response.ContentType) {
        res.setHeader('Content-Type', response.ContentType);
    }
    
    // @ts-ignore
    response.Body.pipe(res);
  } catch (error: any) {
    return res.status(404).json({ error: "File not found" });
  }
};
