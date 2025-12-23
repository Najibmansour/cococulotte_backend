
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { config } from "../src/config/index.js";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

const run = async () => {
  console.log("Configuring CORS for bucket:", config.r2.bucket);
  
  const command = new PutBucketCorsCommand({
    Bucket: config.r2.bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://cococulotte.com",
            "https://www.cococulotte.com",
            "https://cococulotte-dev.netlify.app",
            "https://www.cococulotte-dev.netlify.app"
          ],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600
        }
      ]
    }
  });

  try {
    await s3Client.send(command);
    console.log("CORS configuration applied successfully.");
  } catch (err) {
    console.error("Error applying CORS configuration:", err);
    console.error("Ensure your R2 API Token has 'Admin Read & Write' permissions or specifically allows CORS configuration.");
  }
};

run();
