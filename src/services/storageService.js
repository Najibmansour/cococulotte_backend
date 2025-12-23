import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/index.js";
import { v4 as uuidv4 } from "uuid";




const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});



export const getPresignedUrl = async (filename, contentType, folder = "images") => {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${folder}/${uuidv4()}-${safeFilename}`;
  
  const command = new PutObjectCommand({
    Bucket: config.r2.bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return {
    url,
    key,
    publicUrl: `${config.r2.publicBaseUrl}/${key}`,
  };
};

export const listFiles = async (prefix = "images/") => {
  const command = new ListObjectsV2Command({
    Bucket: config.r2.bucket,
    Prefix: prefix,
  });

  const { Contents } = await s3Client.send(command);

  return (Contents || [])
    .sort((a, b) => (b.LastModified || 0) - (a.LastModified || 0))
    .map((file) => ({
      key: file.Key,
      url: `${config.r2.publicBaseUrl}/${file.Key}`,
      lastModified: file.LastModified,
      size: file.Size,
    }));
};
