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
  const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return url;
};


export const uploadPdf = async (req, res) => {
  try {
    const { projectNumber, formName } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!projectNumber || !formName) {
      return res.status(400).json({ error: 'Missing data in token' });
    }

    const safeProject = projectNumber.replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeForm = formName.replace(/[^a-zA-Z0-9-]/g, "_");

    const s3Key = `pdfs/${safeProject}/${safeForm}.pdf`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: "application/pdf",
      })
    );

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${s3Key}`;

    return res.json({
      success: true,
      projectNumber: safeProject,
      formName: safeForm,
      key: s3Key,
      url: fileUrl,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getObjectPdf = async (key) => {
  try {
    const key = req.query.key;

    if (!key) return res.status(400).json({ message: "Image key required" });

    const signedUrl = await getObjectUrl(key);
    res.json({ url: signedUrl });
  } catch (err) {
    console.error("Error generating signed image URL:", err);
    res.status(500).json({ message: "Failed to generate signed URL" });
  }
};
