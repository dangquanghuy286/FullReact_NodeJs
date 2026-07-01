import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, //5mb
  },
});
// Middleware để upload hình ảnh từ buffer
export const uploadImageFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "quanghuy_chat/avatars",
        resource_type: "image",
        transformation: [
          {
            width: 200,
            height: 200,
            crop: "fill",
          },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
};
// Middleware để upload hình ảnh cho message từ buffer

// 1 Ảnh
export const uploadMessageImage = (buffer) => {
  return uploadImageFromBuffer(buffer, {
    folder: "quanghuy_chat/messages",
    transformation: [
      {
        width: 1600,
        crop: "limit",
      },
    ],
  });
};

// Nhiều ảnh
export const uploadMessageImages = async (files = []) => {
  if (!files.length) return [];
  const results = await Promise.all(
    files.map((file) => uploadMessageImage(file.buffer)),
  );
  return results.map((r) => r.secure_url);
};
