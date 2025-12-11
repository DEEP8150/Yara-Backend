import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export const generatePresignedUrl = async (fileName, fileType) => {
  const fileKey = `Signature/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    // Body: file.buffer,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

  return { uploadUrl, fileKey, fileUrl };
};


export const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
};
