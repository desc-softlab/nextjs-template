"use server";

import { s3Client, BUCKET_NAME, AWS_REGION } from '@/config/awsConfig';
import {
     PutObjectCommand,
     DeleteObjectCommand,
     DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

export const uploadSingleImage = async (file: File, folder:string = "stays-dev"): Promise<string> => {
     const arrayBuffer = await file.arrayBuffer();
     const buffer = Buffer.from(arrayBuffer);
     try {
          const params = {
               Bucket: BUCKET_NAME,
               Key: `${folder}/${Date.now()}-${file.name}`,
               Body: buffer,
               ContentType: file.type,
          };
     
          const command = new PutObjectCommand(params);
     
          await s3Client.send(command);

          // `https://${this.bucketName}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${key}`
     
          return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`;
     } catch (error) {
          console.log(error);
          return "";
     }
};

export const uploadMultipleImages = async (files: File[], folder: string ="development"): Promise<string[]> => {
     const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
     return Promise.all(uploadPromises);
};

// export const deleteSingleImage = async (key: string): Promise<void> => {
//      const params = { Bucket: BUCKET_NAME, Key: key };
//      const command = new DeleteObjectCommand(params);

//      await s3Client.send(command);
// };

export const deleteSingleImage = async (imageUrl: string): Promise<void> => {
     try {
       // Extract the key from the image URL
          const bucketDomain = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;
          if (!imageUrl.startsWith(bucketDomain)) {
               // throw new Error("Invalid image URL. It does not match the expected bucket domain.");
               return;
          }
     
          // Extract the key portion (folder/filename)
          const key = imageUrl.replace(bucketDomain, "");

          if (!key) {
               throw new Error("Key could not be extracted from the URL.");
          }

       // Delete the object using the extracted key
          const params = { Bucket: BUCKET_NAME, Key: key };
          const command = new DeleteObjectCommand(params);
     
          await s3Client.send(command);
     } catch (error) {
          throw error;
     }
};

export const deleteMultipleImages = async (keys: string[]): Promise<void> => {
     const objects = keys.map((key) => ({ Key: key }));
     const params = {
          Bucket: BUCKET_NAME,
          Delete: { Objects: objects },
     };

     const command = new DeleteObjectsCommand(params);

     await s3Client.send(command);
};
