import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
     region: process.env.AWS_S3_REGION, // Replace with your AWS region
     credentials: {
     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
     },
     requestHandler: {
          connectionTimeout: 60000, // 60 seconds
          socketTimeout: 60000,    // 60 seconds
     },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_REGION = process.env.AWS_S3_REGION || '';
