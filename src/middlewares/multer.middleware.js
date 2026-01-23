import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage })


const AttachFile = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "video/mp4",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, JPG, PNG and PDF files are allowed"),
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
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG images and MP4, WEBM, MOV videos are allowed"),
      false
    );
  }
};

export const uploadTicketFiles = multer({
  storage,
  fileFilter: ticketFileFilter,
});
