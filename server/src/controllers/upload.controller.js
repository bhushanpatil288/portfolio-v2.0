import { ApiError } from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const uploadImage = asyncWrapper(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const isCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloudinary';

  if (isCloudinary) {
    res.status(200).json({
      success: true,
      url: req.file.path || req.file.secure_url,
      publicId: req.file.filename
    });
  } else {
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const filename = req.file.filename;
    res.status(200).json({
      success: true,
      url: `${serverUrl}/uploads/${filename}`,
      publicId: filename
    });
  }
});

export const deleteImage = asyncWrapper(async (req, res) => {
  const { publicId } = req.params;
  if (!publicId) {
    throw new ApiError(400, 'Public ID is required');
  }

  const isCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloudinary';

  if (isCloudinary) {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({
      success: true,
      result
    });
  } else {
    const filePath = `./public/uploads/${publicId}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({
      success: true,
      message: 'Local file deleted successfully'
    });
  }
});
