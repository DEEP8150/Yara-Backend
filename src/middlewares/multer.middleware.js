import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage })


const AttachFile = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/png",
    "image/svg+xml",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "video/mp4",
    "video/quicktime",
    "video/x-matroska",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, JPG, WEBP, PNG, SVG, PDF, ZIP and MP4/MOV/MKV videos are allowed"),
      false
    );
  }
};

export const uploadAttachDoc = multer({
  storage,
  // limits: {
  //     fileSize: 10 * 1024 * 1024,
  // },
  fileFilter: AttachFile,
});


const ticketFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/webp",
    "image/jpg",
    "image/png",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-matroska",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, WEBP, PNG, SVG images and MP4, WEBM, MOV, MKV videos are allowed"),
      false
    );
  }
};

export const uploadTicketFiles = multer({
  storage,
  fileFilter: ticketFileFilter,
});
