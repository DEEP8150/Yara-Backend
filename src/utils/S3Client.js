import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
import { Purchase } from "../models/purchase.model.js";
import { Product } from "../models/products.model.js";
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
    const engineerId = req.user?._id || null;

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



    const purchase = await Purchase.findOne({ projectNumber: safeProject });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    let updated = false;

    const updateDoc = (docs) => {
      const doc = docs.find(d => d.formKey === safeForm);
      if (doc) {
        doc.s3PdfUrl = fileUrl;
        doc.isFilled = true;
        doc.filledByEngineer = engineerId;
        updated = true;
      }
    };

    updateDoc(purchase.preDocs);
    updateDoc(purchase.postDocs);

    if (!updated) {
      return res.status(404).json({ error: "Form not found in pre or post docs" });
    }

    await purchase.save();

    return res.json({
      success: true,
      url: fileUrl,
      key: s3Key
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

export const uploadAttachDocument = async (req, res) => {
  try {
    const { projectNumber } = req.body;

    if (!projectNumber) {
      return res.status(400).json({ message: "Project number required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }


    const originalName = req.file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const fileKey = `AttachDocuments/${projectNumber}/${originalName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

    const purchase = await Purchase.findOneAndUpdate(
      { projectNumber },
      {
        $push: {
          attachDocuments: {
            url: fileUrl,
            uploadedAt: new Date(),
            filename: originalName, // save the original name in DB
          },
        },
      },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
      filename: originalName, // return it to frontend
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const uploadFeedbackForm = async (req, res) => {
  try {
    const { projectNumber, title } = req.body;

    if (!projectNumber || !file) {
      return res.status(400).json({ message: "Project number and file are required" });
    }

    const file = req.file;

    const filename = file.originalname;

    const fileKey = `feedback-form/${projectNumber}/${filename}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;


    const purchase = await Purchase.findOneAndUpdate(
      { projectNumber },
      {
        $push: {
          feedbackForm: {
            title: title || "Feedback Form",
            s3PdfUrl: fileUrl,
            isFilled: true,
          },
        },
      },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({ message: "Feedback form uploaded successfully", url: fileUrl });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};