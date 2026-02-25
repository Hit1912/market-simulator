import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config";
import multer from "multer";

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    resource_type: "image",
    quality: "auto:good",
    format: "webp", // convert all uploads to WebP for smaller size
  } as object,
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB limit
  fileFilter: (_, file, cb) => {
    const isValid = /^image\/(jpe?g|png|gif|webp)$/.test(file.mimetype);
    if (!isValid) {
      // Must call cb with false so multer can continue; passing an Error rejects the whole request
      return cb(new Error("Only image files (JPG, PNG, GIF, WebP) are allowed"));
    }
    cb(null, true);
  },
});
