import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

const localDir = './public/uploads';
if (!fs.existsSync(localDir)) {
  fs.mkdirSync(localDir, { recursive: true });
}

const localDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, localDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

let storage;
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloudinary';

if (useCloudinary) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
  });
} else {
  storage = localDiskStorage;
}

const upload = multer({ storage });

router.post('/image', verifyToken, upload.single('image'), uploadImage);
router.delete('/image/:publicId', verifyToken, deleteImage);

export default router;
