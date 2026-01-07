import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
import { Purchase } from "../models/purchase.model.js";
import { Product } from "../models/products.model.js";
import { Feedback } from "../models/feedback.model.js";
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

// export const generatePresignedUrlForPdf = async (fileName, fileType) => {
//   const fileKey = `Documents-PDF/${Date.now()}-${fileName}`;

//   const command = new PutObjectCommand({
//     Bucket: process.env.BUCKET_NAME,
//     Key: fileKey,
//     // Body: file.buffer,
//     ContentType: fileType,
//   });

//   const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

//   const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

//   return { uploadUrl, fileKey, fileUrl };
// };


export const generatePresignedUrlForPdf = async (req, res) => {
  try {
    const { filename, fileType, projectNumber, formName } = req.body;

    if (!filename || !fileType || !projectNumber || !formName) {
      return res.status(400).json({ error: 'Missing filename or fileType or projectNumber or formName' });
    }

    const safeProject = projectNumber.replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeForm = formName.replace(/[^a-zA-Z0-9-]/g, "_");

    const fileKey = `Documents-PDF/${safeProject}/${safeForm}.pdf`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

    return res.json({ uploadUrl, fileKey, fileUrl });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const generatePresignedUrlForFeedBackForm = async (req, res) => {
  try {
    const { filename, fileType, projectNumber, formName } = req.body;

    if (!filename || !fileType || !projectNumber || !formName) {
      return res.status(400).json({ error: 'Missing filename or fileType or projectNumber or formName' });
    }

    const safeProject = projectNumber.replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeForm = formName.replace(/[^a-zA-Z0-9-]/g, "_");

    const fileKey = `FeedBack-Form/${safeProject}/${safeForm}.pdf`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;

    return res.json({ uploadUrl, fileKey, fileUrl });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return res.status(500).json({ error: error.message });
  }
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
    const { projectNumber, formName, fileKey, fileUrl } = req.body;
    const engineerId = req.user?._id || null;

    if (!projectNumber || !formName || !fileKey || !fileUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const purchase = await Purchase.findOne({ projectNumber });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    let updated = false;

    const updateDoc = (docs) => {
      const doc = docs.find(d => d.formKey === formName);
      if (doc) {
        doc.s3PdfUrl = fileUrl;
        doc.s3Key = fileKey;
        doc.isFilled = true;
        doc.filledByEngineer = engineerId;
        doc.uploadedAt = new Date();
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
      key: fileKey
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

// export const uploadFeedbackForm = async (req, res) => {
//   try {
//     const { projectNumber, title } = req.body;

//     if (!projectNumber || !file) {
//       return res.status(400).json({ message: "Project number and file are required" });
//     }

//     const file = req.file;

//     const filename = file.originalname;

//     const fileKey = `feedback-form/${projectNumber}/${filename}`;

//     await s3Client.send(
//       new PutObjectCommand({
//         Bucket: process.env.BUCKET_NAME,
//         Key: fileKey,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       })
//     );

//     const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;


//     const purchase = await Purchase.findOneAndUpdate(
//       { projectNumber },
//       {
//         $push: {
//           feedbackForm: {
//             title: title || "Feedback Form",
//             s3PdfUrl: fileUrl,
//             isFilled: true,
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!purchase) {
//       return res.status(404).json({ message: "Purchase not found" });
//     }

//     res.status(200).json({ message: "Feedback form uploaded successfully", url: fileUrl });

//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };


export const uploadFeedbackForm = async (req, res) => {
  try {
    const { tokenId, projectNumber } = req.feedbackToken;
    const feedback = req.feedbackDoc;

    if (!req.file) {
      return res.status(400).json({ message: "PDF missing" });
    }

    const fileKey = `feedback-form/${projectNumber}/${tokenId}.pdf`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    feedback.s3PdfUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`;
    feedback.status = "SUBMITTED";
    feedback.submittedAt = new Date();
    feedback.totalScore = req.body.totalScore;
    feedback.scorePercentage = req.body.scorePercentage;
    feedback.grade = req.body.grade;
    feedback.beforeSalesTotal = req.body.beforeSalesTotal;
    feedback.executionTotal = req.body.executionTotal;
    feedback.afterSalesTotal = req.body.afterSalesTotal;
    feedback.qualityTotal = req.body.qualityTotal;


    const SECTION_MAX = {
      beforeSales: 15,
      execution: 20,
      afterSales: 15,
      quality: 10,
    };

    feedback.sectionPercentages = {
      beforeSales: ((req.body.beforeSalesTotal / SECTION_MAX.beforeSales) * 25),
      execution: ((req.body.executionTotal / SECTION_MAX.execution) * 25),
      afterSales: ((req.body.afterSalesTotal / SECTION_MAX.afterSales) * 25),
      quality: ((req.body.qualityTotal / SECTION_MAX.quality) * 25),
    };

    const sectionEntries = Object.entries(feedback.sectionPercentages);

    sectionEntries.sort((a, b) => a[1] - b[1]);

    feedback.worstSection = sectionEntries[0][0];


    await feedback.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


export const DeleteAttachDocument = async (req, res) => {
  try {
    const docId = req.params.id;

    const purchase = await Purchase.findOne({ "attachDocuments._id": docId });
    if (!purchase) return res.status(404).json({ message: "Document not found" });

    const doc = purchase.attachDocuments.id(docId);
    if (!doc) return res.status(404).json({ message: "Document not found in Purchase" });

    const urlParts = doc.url.split("/");
    const keyIndex = urlParts.findIndex(part => part.includes(".com")) + 1;
    const s3Key = urlParts.slice(keyIndex).join("/");

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key
    }));

    purchase.attachDocuments.pull({ _id: docId });
    await purchase.save();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};


export const DeleteFeedbackDocument = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    if (!feedback.s3PdfUrl) return res.status(400).json({ message: "No PDF attached" });

    const urlParts = feedback.s3PdfUrl.split("/");
    const keyIndex = urlParts.findIndex(part => part.includes(".com")) + 1;
    const s3Key = urlParts.slice(keyIndex).join("/");

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: s3Key,
    }));

    await Feedback.findByIdAndDelete(feedbackId);

    res.json({ message: "Feedback deleted successfully" });

  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
};

export const deletePreOrPostDoc = async (req, res) => {
  try {
    const { purchaseId, docId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }


    let doc =
      purchase.preDocs.id(docId) ||
      purchase.postDocs.id(docId);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.s3PdfUrl) {
      const urlParts = doc.s3PdfUrl.split("/");
      const keyIndex = urlParts.findIndex(p => p.includes(".com")) + 1;
      const s3Key = urlParts.slice(keyIndex).join("/");

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: s3Key,
        })
      );
    }

    doc.isFilled = false;
    doc.s3PdfUrl = null;
    doc.filledByEngineer = null;

    await purchase.save();

    return res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete doc error:", err);
    return res.status(500).json({ message: "Failed to delete document" });
  }
};
