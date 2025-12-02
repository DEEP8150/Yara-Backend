import multer from "multer";

const storage = multer.memoryStorage();

export const uploadPdfMiddleware = multer({ storage }).single("file");
