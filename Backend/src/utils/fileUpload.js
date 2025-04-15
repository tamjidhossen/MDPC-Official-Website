import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "./ApiError.js";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(process.cwd(), "public/uploads");

    // Determine specific folder based on route or file purpose
    if (req.originalUrl.includes("/users") || file.fieldname === "avatar") {
      uploadPath = path.join(process.cwd(), "public/uploads/images/users");
    } else if (
      req.originalUrl.includes("/members") ||
      file.fieldname === "photo"
    ) {
      uploadPath = path.join(process.cwd(), "public/uploads/images/members");
    } else if (req.originalUrl.includes("/blogs")) {
      uploadPath = path.join(process.cwd(), "public/uploads/images/blogs");
    } else if (req.originalUrl.includes("/events")) {
      uploadPath = path.join(process.cwd(), "public/uploads/images/events");
    } else if (req.originalUrl.includes("/contests")) {
      uploadPath = path.join(process.cwd(), "public/uploads/images/contests");
    } else if (req.originalUrl.includes("/resources")) {
      uploadPath = path.join(process.cwd(), "public/uploads/resources");
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only for photos, avatars, and other images
  if (
    file.fieldname === "photo" ||
    file.fieldname === "avatar" ||
    file.fieldname === "image"
  ) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new ApiError(400, "Only image files are allowed!"), false);
    }
    cb(null, true);
  }
  // For resources, accept other file types too
  else if (file.fieldname === "file") {
    if (
      !file.originalname.match(
        /\.(jpg|jpeg|png|gif|pdf|doc|docx|ppt|pptx|txt|md)$/
      )
    ) {
      return cb(
        new ApiError(400, "Only supported document formats are allowed!"),
        false
      );
    }
    cb(null, true);
  } else {
    cb(null, true);
  }
};

/**
 * Helper function to generate standardized file path based on request and file
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @returns {String} Standardized file path for storing in database
 */
export const getFilePath = (req, file) => {
  if (!file) return null;

  let basePath = "/uploads";

  if (req.originalUrl.includes("/users") || file.fieldname === "avatar") {
    basePath = "/uploads/images/users";
  } else if (
    req.originalUrl.includes("/members") ||
    file.fieldname === "photo"
  ) {
    basePath = "/uploads/images/members";
  } else if (req.originalUrl.includes("/blogs")) {
    basePath = "/uploads/images/blogs";
  } else if (req.originalUrl.includes("/events")) {
    basePath = "/uploads/images/events";
  } else if (req.originalUrl.includes("/contests")) {
    basePath = "/uploads/images/contests";
  } else if (req.originalUrl.includes("/resources")) {
    basePath = "/uploads/resources";
  }

  return `${basePath}/${file.filename}`;
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter,
});

export { upload };
